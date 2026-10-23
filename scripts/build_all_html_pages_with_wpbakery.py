import json
import os
import re
import urllib.parse

def clean_text(text):
    if not text:
        return ''
    text = str(text)
    # Regla 12
    text = re.sub(r'\bTramitar\b', 'Gestionar', text)
    text = re.sub(r'\btramitar\b', 'gestionar', text)
    text = re.sub(r'\bTrámites\b', 'Gestiones', text)
    text = re.sub(r'\btrámites\b', 'gestiones', text)
    text = re.sub(r'\bTrámite\b', 'Gestión', text)
    text = re.sub(r'\btrámite\b', 'gestión', text)
    return text.replace('"', '&quot;').strip()

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

def build_wpbakery_shortcode(pillar_slug, items):
    sorted_items = sorted(items, key=get_ato_score)
    lines = []
    lines.append('[vc_row gap="5px"][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]')
    lines.append('[vc_section]')
    lines.append(f'[vc_row gap="0px" el_class="sat-seccion-{pillar_slug}"]')
    for it in sorted_items:
        title = clean_text(it.get('gestion') or it.get('nombreActual'))
        desc = clean_text(it.get('descripcion') or '')
        lines.append(f'[vc_column width="1/3"][bsf-info-box icon_type="none" title="{title}" read_more="box" link=""]{desc}[/bsf-info-box][/vc_column]')
    lines.append('[/vc_row]')
    lines.append('[/vc_section]')
    return '\n'.join(lines)

COPY_SCRIPT = """
  <script>
    function copiarShortcodeWp(btn, targetId) {
      const ta = document.getElementById(targetId);
      if (!ta) return;
      ta.select();
      navigator.clipboard.writeText(ta.value).then(() => {
        const span = btn.querySelector('span') || btn;
        const orig = span.textContent;
        span.textContent = '¡Copiado!';
        btn.style.background = '#2e7d32';
        setTimeout(() => {
          span.textContent = orig;
          btn.style.background = '#0072ce';
        }, 2000);
      });
    }
  </script>
"""

def generate_page_html(pillar_id, pillar_name, n2_name, items):
    pillar_slug = pillar_id.replace('_', '-')
    sorted_items = sorted(items, key=get_ato_score)[:15] # Rango de visualización
    shortcode = build_wpbakery_shortcode(pillar_slug, sorted_items)

    # Breadcrumbs
    parent_link = f"../{pillar_slug}.html"

    # Badges
    badge_color = {
        'contribuyentes': 'contribuyentes',
        'comercio_exterior': 'personas',
        'profesionales': 'empresas',
        'entes_exentos': 'aduanas'
    }.get(pillar_id, 'contribuyentes')

    # Cards HTML
    cards_html = []
    for it in sorted_items:
        t_title = clean_text(it.get('gestion') or it.get('nombreActual'))
        t_desc = clean_text(it.get('descripcion') or f"Requisitos, pasos y documentos para {t_title}.")
        t_url = it.get('url') or 'https://portal.sat.gob.gt/'
        cards_html.append(f"""      <a href="{t_url}" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--azul">
        <div class="sat-card-head">
          <h2 class="sat-card-title">{t_title}</h2>
          <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>
        <p class="sat-card-desc">{t_desc}</p>
      </a>""")

    grid_content = '\n\n'.join(cards_html)

    # "En esta sección" primeros 5 enlaces
    in_section_links = ''.join([f'          <a href="#{slugify(it.get("gestion") or it.get("nombreActual"))[:25]}" class="sat-its-link">{clean_text(it.get("gestion") or it.get("nombreActual"))[:32]}</a>\n' for it in sorted_items[:5]])

    desc = f"Servicios, guías oficiales y gestiones tributarias y aduaneras correspondientes a {n2_name}."

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{clean_text(n2_name)} — Portal SAT Guatemala</title>
  <link rel="stylesheet" href="../../css/sat-portal.css">
</head>
<body>

  <header class="sat-header-top">
    <div class="sat-container sat-header-inner">
      <a href="../../index.html" class="sat-brand">
        <span class="sat-logo-text">SAT<span class="sat-logo-dot">.</span></span>
        <span class="sat-brand-sub">Superintendencia de Administración Tributaria</span>
      </a>
      <div class="sat-header-links">
        <a href="https://declaraguate.sat.gob.gt/" target="_blank" rel="noopener noreferrer" class="sat-header-link sat-header-link--transp">Declaraguate</a>
        <a href="https://farm3.sat.gob.gt/menu/login.jsf" target="_blank" rel="noopener noreferrer" class="sat-header-link sat-header-link--celeste">Agencia Virtual</a>
      </div>
    </div>
  </header>

  <main class="sat-container">
    <!-- 1. MIGA DE PAN OFICIAL -->
    <nav class="sat-breadcrumb" aria-label="Miga de pan">
      <a href="../../index.html">Inicio</a>
      <span class="sat-breadcrumb-sep">›</span>
      <a href="{parent_link}">{pillar_name}</a>
      <span class="sat-breadcrumb-sep">›</span>
      <span class="sat-breadcrumb-current" aria-current="page">{clean_text(n2_name)}</span>
    </nav>

    <!-- 2. CABECERA Y EN ESTA SECCIÓN -->
    <header class="sat-section-header">
      <div class="sat-segment-badge">
        <span class="sat-badge-dot sat-badge-dot--{badge_color}"></span>
        <span class="sat-badge-text">{pillar_name.upper()} &bull; N2</span>
      </div>
      <h1 class="sat-section-title">{clean_text(n2_name)}</h1>
      <p class="sat-section-desc">{desc}</p>

      <div class="sat-in-this-section">
        <div class="sat-its-head">
          <svg class="sat-its-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5-4-1.5 1.5-4 4 1.5z"/></svg>
          <span class="sat-its-label">EN ESTA SECCIÓN:</span>
        </div>
        <div class="sat-its-links">
{in_section_links}        </div>
      </div>
    </header>

    <!-- 3. CUADRÍCULA DE GESTIONES -->
    <div class="sat-cards-grid">
{grid_content}
    </div>

    <!-- ========================================================================= -->
    <!-- BLOQUE WPBAKERY / THE7 CLASSIC - LISTO PARA COPIAR A WORDPRESS           -->
    <!-- ========================================================================= -->
    <section class="sat-wp-export-box" style="margin-top: 50px; margin-bottom: 30px; background: #f8fafc; border: 2px dashed #0072ce; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span style="display: inline-block; background: #003865; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">WordPress &bull; The7 Classic &bull; WPBakery</span>
          <h3 style="font-size: 17px; color: #003865; margin: 6px 0 2px; font-weight: 700;">Código WPBakery para esta página</h3>
          <p style="font-size: 13px; color: #475569; margin: 0;">Pega este código directamente en la pestaña <strong>Texto (Classic Mode)</strong> de WPBakery en WordPress.</p>
        </div>
        <button onclick="copiarShortcodeWp(this, 'wp-shortcode-main')" style="background: #0072ce; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          <span>Copiar Shortcode</span>
        </button>
      </div>
      <textarea id="wp-shortcode-main" readonly style="width: 100%; height: 260px; font-family: Consolas, 'Liberation Mono', Menlo, monospace; font-size: 12px; line-height: 1.5; padding: 14px; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff; color: #0f172a; resize: vertical; box-sizing: border-box;">{shortcode}</textarea>
    </section>

  </main>

  <footer class="sat-footer">
    <div class="sat-container sat-footer-inner">
      <span>© 2026 Superintendencia de Administración Tributaria — Guatemala</span>
      <a href="{parent_link}">Volver a {pillar_name}</a>
    </div>
  </footer>

{COPY_SCRIPT}
</body>
</html>
"""

def main():
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        tramites = json.load(f)

    pillars = {
        'contribuyentes': 'Contribuyentes',
        'comercio_exterior': 'Operadores de Comercio Exterior',
        'profesionales': 'Profesionales',
        'entes_exentos': 'Entes Exentos'
    }

    created_count = 0
    updated_count = 0

    for p_id, p_name in pillars.items():
        p_items = [t for t in tramites if t.get('pillar') == p_id]
        p_slug = p_id.replace('_', '-')
        target_dir = os.path.join('html-template', 'paginas', p_slug)
        os.makedirs(target_dir, exist_ok=True)

        # Agrupar por Nivel 2
        n2_groups = {}
        for t in p_items:
            n2 = t.get('nivel2') or 'General'
            if n2 not in n2_groups:
                n2_groups[n2] = []
            n2_groups[n2].append(t)

        for n2_name, items in n2_groups.items():
            slug = slugify(n2_name)
            # Casos especiales de nombres existentes
            if slug == 'pequenos-contribuyentes':
                file_name = 'pequenos-contribuyentes.html'
            elif slug == 'sin-obligaciones':
                file_name = 'nit-sin-obligaciones.html'
            elif slug == 'contribuyentes-especiales':
                file_name = 'contribuyentes-especiales.html'
            elif slug == 'contribuyente-general':
                file_name = 'regimen-general.html'
            elif slug == 'auxiliares-de-la-funcion-publica-aduanera-afpa':
                file_name = 'afpa.html'
            else:
                file_name = f"{slug}.html"

            file_path = os.path.join(target_dir, file_name)

            # Si el archivo no existe, lo creamos completo
            if not os.path.exists(file_path):
                html_out = generate_page_html(p_id, p_name, n2_name, items)
                with open(file_path, 'w', encoding='utf-8') as f_out:
                    f_out.write(html_out)
                created_count += 1
                print(f"[CREADA] {file_path} ({len(items)} gestiones)")
            else:
                updated_count += 1

    print(f"[OK] Proceso completado. Páginas creadas: {created_count}, Páginas preservadas/actualizadas: {updated_count}")

if __name__ == '__main__':
    main()
