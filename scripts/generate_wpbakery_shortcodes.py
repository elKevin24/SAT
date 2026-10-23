import json
import os
import re
import urllib.parse

def slugify(text):
    if not text:
        return ''
    text = str(text).lower()
    text = re.sub(r'[áàäâ]', 'a', text)
    text = re.sub(r'[éèëê]', 'e', text)
    text = re.sub(r'[íìïî]', 'i', text)
    text = re.sub(r'[óòöô]', 'o', text)
    text = re.sub(r'[úùüû]', 'u', text)
    text = re.sub(r'[ñ]', 'n', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def clean_text(text):
    if not text:
        return ''
    text = str(text)
    # Regla 12 de Gobernanza Institucional: Prohibición estricta de trámite -> gestión
    text = re.sub(r'\bTramitar\b', 'Gestionar', text)
    text = re.sub(r'\btramitar\b', 'gestionar', text)
    text = re.sub(r'\bTrámites\b', 'Gestiones', text)
    text = re.sub(r'\btrámites\b', 'gestiones', text)
    text = re.sub(r'\bTrámite\b', 'Gestión', text)
    text = re.sub(r'\btrámite\b', 'gestión', text)
    return text.replace('"', '&quot;').strip()

def get_ato_score(it):
    title = (it.get('gestion') or it.get('nombreActual') or '').lower()
    etapa = (it.get('etapaAto') or '').lower()
    if any(k in title for k in ['inscrib', 'solicitar', 'obtener']):
        return 10
    if any(k in title for k in ['afiliar', 'habilitar', 'autorizar']):
        return 20
    if any(k in title for k in ['confirmar', 'ratific', 'declarar', 'pagar', 'emitir']):
        return 30
    if any(k in title for k in ['modificar', 'actualizar', 'cambio']):
        return 40
    if any(k in title for k in ['baja', 'inactiv', 'cancelar', 'cierre', 'suspender']):
        return 50
    if any(k in title for k in ['consultar', 'consulta', 'verificar']):
        return 60
    if any(k in title for k in ['curso', 'capacitaci', 'guia', 'legislac', 'preguntas']):
        return 70
    order_map = {
        'empezar': 15,
        'inicio': 15,
        'operar': 35,
        'consultar': 65,
        'modificar_cerrar': 45,
        'modificar': 45,
        'cerrar': 55,
        'normativa': 75
    }
    return order_map.get(etapa, 45)

def build_wpbakery_shortcode(page_title, pillar, items, include_urls=True, group_by_n4=False):
    """
    Construye el shortcode canónico de WPBakery + The7 + Ultimate Addons
    respetando exactamente la plantilla institucional solicitada y el ciclo ATO.
    """
    # Ordenar por ciclo ATO
    sorted_items = sorted(items, key=get_ato_score)

    lines = []
    # 1. Breadcrumbs The7
    lines.append('[vc_row gap="5px"][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]')
    
    # 2. Sección Principal
    pillar_class = f"sat-seccion-{pillar.replace('_', '-')}"
    lines.append(f'[vc_section]')
    
    if group_by_n4 and any(it.get('nivel4') and it.get('nivel4') != '—' for it in sorted_items):
        # Agrupar por N4 para respetar Miller (bloques de 5-9)
        n4_groups = {}
        for it in sorted_items:
            n4 = it.get('nivel4') or 'Otras gestiones'
            if n4 == '—':
                n4 = 'Gestiones principales'
            if n4 not in n4_groups:
                n4_groups[n4] = []
            n4_groups[n4].append(it)
            
        for n4_title, sub_items in n4_groups.items():
            lines.append(f'[vc_row][vc_column][vc_custom_heading text="{clean_text(n4_title)}" font_container="tag:h3|text_align:left" use_theme_fonts="yes"][/vc_column][/vc_row]')
            lines.append(f'[vc_row gap="0px" el_class="{pillar_class}"]')
            for it in sub_items:
                title = clean_text(it.get('gestion') or it.get('nombreActual'))
                desc = clean_text(it.get('descripcion') or '')
                url = it.get('url') or ''
                if include_urls and url:
                    enc_url = urllib.parse.quote(url, safe='')
                    link_attr = f'url:{enc_url}||target:%20_blank|'
                else:
                    link_attr = ''
                lines.append(f'[vc_column width="1/3"][bsf-info-box icon_type="none" title="{title}" read_more="box" link="{link_attr}"]{desc}[/bsf-info-box][/vc_column]')
            lines.append('[/vc_row]')
    else:
        # Fila directa de gestiones
        lines.append(f'[vc_row gap="0px" el_class="{pillar_class}"]')
        for it in sorted_items:
            title = clean_text(it.get('gestion') or it.get('nombreActual'))
            desc = clean_text(it.get('descripcion') or '')
            url = it.get('url') or ''
            if include_urls and url:
                enc_url = urllib.parse.quote(url, safe='')
                link_attr = f'url:{enc_url}||target:%20_blank|'
            else:
                link_attr = ''
            lines.append(f'[vc_column width="1/3"][bsf-info-box icon_type="none" title="{title}" read_more="box" link="{link_attr}"]{desc}[/bsf-info-box][/vc_column]')
        lines.append('[/vc_row]')
        
    lines.append('[/vc_section]')
    return '\n'.join(lines)

def main():
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        tramites = json.load(f)

    pillars = {
        'contribuyentes': 'Contribuyentes',
        'comercio_exterior': 'Operadores de Comercio Exterior',
        'profesionales': 'Profesionales',
        'entes_exentos': 'Entes Exentos'
    }

    base_out_dir = 'wordpress/shortcodes'
    os.makedirs(base_out_dir, exist_ok=True)

    catalog_data = []

    for p_id, p_name in pillars.items():
        p_items = [t for t in tramites if t.get('pillar') == p_id]
        p_dir = os.path.join(base_out_dir, p_id)
        os.makedirs(p_dir, exist_ok=True)

        # Agrupar por Páginas (N2 y N3)
        # 1. Identificar páginas
        pages = {}
        for t in p_items:
            n2 = t.get('nivel2') or 'General'
            n3 = t.get('nivel3') or '—'
            
            # Determinamos si la página es N3 o si N3 es pasarela/vacío y es N2
            if n3 != '—' and n3 != n2:
                page_key = f"{n2} - {n3}"
                page_title = n3
                parent_title = n2
            else:
                page_key = n2
                page_title = n2
                parent_title = p_name

            if page_key not in pages:
                pages[page_key] = {
                    'page_title': page_title,
                    'parent_title': parent_title,
                    'pillar': p_id,
                    'pillar_name': p_name,
                    'items': []
                }
            pages[page_key]['items'].append(t)

        for p_key, p_info in pages.items():
            slug = slugify(p_key)
            items = p_info['items']
            group_n4 = len(items) > 10

            # Generar versión con URLs oficiales y versión link=""
            sc_with_urls = build_wpbakery_shortcode(p_info['page_title'], p_id, items, include_urls=True, group_by_n4=group_n4)
            sc_empty_links = build_wpbakery_shortcode(p_info['page_title'], p_id, items, include_urls=False, group_by_n4=group_n4)

            # Guardar archivos de texto para copiar/pegar directo
            file_name_urls = f"{slug}-con-enlaces.txt"
            file_name_empty = f"{slug}.txt"

            with open(os.path.join(p_dir, file_name_empty), 'w', encoding='utf-8') as f_out:
                f_out.write(sc_empty_links)

            with open(os.path.join(p_dir, file_name_urls), 'w', encoding='utf-8') as f_out:
                f_out.write(sc_with_urls)

            catalog_data.append({
                'pillar_id': p_id,
                'pillar_name': p_name,
                'page_title': p_info['page_title'],
                'parent_title': p_info['parent_title'],
                'slug': slug,
                'total_gestiones': len(items),
                'shortcode_empty': sc_empty_links,
                'shortcode_urls': sc_with_urls
            })

    # Guardar catálogo JSON para visor interactivo
    json_path = 'wordpress/catalogo_shortcodes.json'
    with open(json_path, 'w', encoding='utf-8') as f_json:
        json.dump(catalog_data, f_json, ensure_ascii=False, indent=2)

    # Generar visor interactivo HTML (con botón Copiar Shortcode)
    html_content = generate_interactive_viewer_html(catalog_data)
    viewer_path = 'wordpress/visor-shortcodes.html'
    with open(viewer_path, 'w', encoding='utf-8') as f_html:
        f_html.write(html_content)

    print(f"[OK] Generados {len(catalog_data)} paquetes de shortcodes WPBakery en {base_out_dir}")
    print(f"[OK] Visor interactivo listo en: {viewer_path}")

def generate_interactive_viewer_html(catalog):
    # Genera una aplicación HTML interactiva sin dependencias externas
    catalog_json_str = json.dumps(catalog, ensure_ascii=False)
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>SAT WPBakery Shortcodes - The7 Classic</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {{
      --sat-azul: #003865;
      --sat-celeste: #0072CE;
      --sat-gris-bg: #F4F6F9;
      --sat-borde: #DDE2E5;
      --sat-verde: #2E7D32;
      --sat-texto: #1C2833;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--sat-gris-bg); color: var(--sat-texto); display: flex; height: 100vh; overflow: hidden; }}
    #sidebar {{ width: 340px; background: #fff; border-right: 1px solid var(--sat-borde); display: flex; flex-direction: column; }}
    .sidebar-header {{ padding: 20px; background: var(--sat-azul); color: white; }}
    .sidebar-header h1 {{ font-size: 18px; margin-bottom: 4px; }}
    .sidebar-header p {{ font-size: 12px; opacity: 0.8; }}
    .search-box {{ padding: 12px 16px; border-bottom: 1px solid var(--sat-borde); }}
    .search-box input {{ width: 100%; padding: 8px 12px; border: 1px solid var(--sat-borde); border-radius: 4px; font-size: 14px; }}
    .nav-list {{ flex: 1; overflow-y: auto; padding: 10px 0; }}
    .pillar-group-title {{ font-size: 11px; font-weight: 700; text-transform: uppercase; color: #7F8C8D; padding: 12px 16px 6px; letter-spacing: 0.5px; }}
    .nav-item {{ padding: 10px 16px; cursor: pointer; border-left: 3px solid transparent; font-size: 13px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }}
    .nav-item:hover {{ background: #EBF3FB; }}
    .nav-item.active {{ background: #E1EFFE; border-left-color: var(--sat-celeste); font-weight: 600; color: var(--sat-azul); }}
    .badge-count {{ background: #E2E8F0; color: #4A5568; font-size: 11px; padding: 2px 7px; border-radius: 12px; font-weight: bold; }}
    #content {{ flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #fff; }}
    .content-header {{ padding: 20px 30px; border-bottom: 1px solid var(--sat-borde); display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }}
    .page-info h2 {{ font-size: 20px; color: var(--sat-azul); }}
    .page-info .parent-crumb {{ font-size: 12px; color: #64748B; margin-top: 2px; }}
    .actions {{ display: flex; gap: 12px; align-items: center; }}
    .btn {{ padding: 9px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; display: inline-flex; align-items: center; gap: 6px; }}
    .btn-primary {{ background: var(--sat-celeste); color: #fff; }}
    .btn-primary:hover {{ background: #005bb5; }}
    .btn-success {{ background: var(--sat-verde); color: #fff; }}
    .toggle-wrap {{ display: flex; align-items: center; gap: 8px; font-size: 12px; color: #475569; }}
    .editor-body {{ flex: 1; padding: 20px 30px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }}
    textarea {{ width: 100%; flex: 1; min-height: 400px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 13px; line-height: 1.5; padding: 16px; border: 1px solid var(--sat-borde); border-radius: 6px; background: #F8FAFC; color: #1E293B; resize: none; }}
    .toast {{ position: fixed; bottom: 30px; right: 30px; background: #10B981; color: white; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: none; animation: slideUp 0.3s ease; }}
    @keyframes slideUp {{ from {{ transform: translateY(20px); opacity: 0; }} to {{ transform: translateY(0); opacity: 1; }} }}
  </style>
</head>
<body>
  <div id="sidebar">
    <div class="sidebar-header">
      <h1>SAT &bull; WPBakery The7</h1>
      <p>Generador de Páginas &amp; Shortcodes</p>
    </div>
    <div class="search-box">
      <input type="text" id="filterInput" placeholder="Filtrar páginas..." oninput="filterPages()">
    </div>
    <div class="nav-list" id="navList"></div>
  </div>

  <div id="content">
    <div class="content-header">
      <div class="page-info">
        <h2 id="currentTitle">Selecciona una página</h2>
        <div class="parent-crumb" id="currentCrumb">Ruta jerárquica</div>
      </div>
      <div class="actions">
        <div class="toggle-wrap">
          <input type="checkbox" id="urlToggle" onchange="toggleUrlMode()">
          <label for="urlToggle">Incluir URLs oficiales activas</label>
        </div>
        <button class="btn btn-primary" id="copyBtn" onclick="copyShortcode()">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          Copiar Shortcode
        </button>
      </div>
    </div>
    <div class="editor-body">
      <p style="font-size: 13px; color: #64748B;">Pega este código directamente en la pestaña <strong>Texto / Classic Mode</strong> de WPBakery en WordPress:</p>
      <textarea id="shortcodeOutput" readonly></textarea>
    </div>
  </div>

  <div class="toast" id="toastMsg">✓ Shortcode copiado al portapapeles</div>

  <script>
    const data = {catalog_json_str};
    let currentIndex = 0;
    let useUrls = false;

    function renderNav(items) {{
      const list = document.getElementById('navList');
      list.innerHTML = '';
      
      const groups = {{}};
      items.forEach((item, idx) => {{
        if (!groups[item.pillar_name]) groups[item.pillar_name] = [];
        groups[item.pillar_name].push({{ item, originalIndex: data.indexOf(item) }});
      }});

      for (const [pillar, pItems] of Object.entries(groups)) {{
        const titleDiv = document.createElement('div');
        titleDiv.className = 'pillar-group-title';
        titleDiv.textContent = pillar;
        list.appendChild(titleDiv);

        pItems.forEach(({{ item, originalIndex }}) => {{
          const row = document.createElement('div');
          row.className = 'nav-item' + (originalIndex === currentIndex ? ' active' : '');
          row.onclick = () => selectPage(originalIndex);
          row.innerHTML = `<span>${{item.page_title}}</span><span class="badge-count">${{item.total_gestiones}}</span>`;
          list.appendChild(row);
        }});
      }}
    }}

    function selectPage(idx) {{
      currentIndex = idx;
      const item = data[idx];
      document.getElementById('currentTitle').textContent = item.page_title;
      document.getElementById('currentCrumb').textContent = `${{item.pillar_name}} &rsaquo; ${{item.parent_title}} &rsaquo; ${{item.page_title}} (${{item.total_gestiones}} gestiones)`;
      updateText();
      
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      const activeEl = document.querySelectorAll('.nav-item')[idx];
      if (activeEl) activeEl.classList.add('active');
    }}

    function updateText() {{
      const item = data[currentIndex];
      const code = useUrls ? item.shortcode_urls : item.shortcode_empty;
      document.getElementById('shortcodeOutput').value = code;
    }}

    function toggleUrlMode() {{
      useUrls = document.getElementById('urlToggle').checked;
      updateText();
    }}

    function copyShortcode() {{
      const ta = document.getElementById('shortcodeOutput');
      ta.select();
      navigator.clipboard.writeText(ta.value).then(() => {{
        const toast = document.getElementById('toastMsg');
        toast.style.display = 'block';
        setTimeout(() => {{ toast.style.display = 'none'; }}, 2500);
      }});
    }}

    function filterPages() {{
      const q = document.getElementById('filterInput').value.toLowerCase();
      const filtered = data.filter(d => 
        d.page_title.toLowerCase().includes(q) || 
        d.parent_title.toLowerCase().includes(q) ||
        d.pillar_name.toLowerCase().includes(q)
      );
      renderNav(filtered);
    }}

    // Init
    renderNav(data);
    if (data.length > 0) selectPage(0);
  </script>
</body>
</html>"""

if __name__ == '__main__':
    main()
