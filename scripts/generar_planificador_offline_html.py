"""
generar_planificador_offline_html.py
====================================
Genera un archivo HTML 100% autónomo y offline (sin requerir Node.js, servidor
ni conexión a internet) en:
  docs/plantillas-wpbakery/PLANIFICADOR_OFFLINE_WPBAKERY.html

Incluye embebidas las 160 plantillas WPBakery (0% [vc_raw_html]), la hoja de
estilos CSS oficial de The7, filtros por Ola (0 a 4) y Nivel 1, buscador en
vivo, soporte para prefijo de subcarpeta de WordPress, botones Anterior /
Siguiente, casillas de progreso persistente en localStorage y copiado en 1 clic.
"""

import json
from pathlib import Path
from generar_wxr_wordpress import collect_all_pages

BASE_DIR = Path(__file__).parent.parent
OUTPUT_HTML = BASE_DIR / "docs" / "plantillas-wpbakery" / "PLANIFICADOR_OFFLINE_WPBAKERY.html"
CSS_FILE = BASE_DIR / "docs" / "diseno-normativa" / "sat-design-system-wpbakery.css"


def build_offline_records() -> list[dict]:
    pages = collect_all_pages()
    id_to_page = {p["post_id"]: p for p in pages}

    wave_labels = {
        0: "Ola 0 (Portada + Universales)",
        1: "Ola 1 (Nivel 1)",
        2: "Ola 2 (Nivel 2)",
        3: "Ola 3 (Nivel 3)",
        4: "Ola 4 (Nivel 4)",
    }

    records = []
    for p in pages:
        parent = id_to_page.get(p["parent_id"])
        parent_title = parent["title"] if parent else "— (Sin superior)"

        # Construir cadena de breadcrumb
        chain = [p["title"]]
        curr = parent
        while curr:
            chain.append(curr["title"])
            curr = id_to_page.get(curr["parent_id"])
        if chain[-1] != "Inicio":
            chain.append("Inicio")
        chain.reverse()
        breadcrumb = " › ".join(chain)

        # Determinar Nivel 1 para filtro
        rel = p["rel_file"]
        if rel.startswith("contribuyentes/"):
            n1 = "Contribuyentes"
        elif rel.startswith("operadores-de-comercio-exterior/"):
            n1 = "Operadores de Comercio Exterior"
        elif rel.startswith("profesionales/"):
            n1 = "Profesionales"
        elif rel.startswith("entes-exentos/"):
            n1 = "Entes Exentos"
        else:
            n1 = "Contribuyentes"

        level_label = (
            "Portada"
            if p["url"] == "/"
            else "Proceso Conectado"
            if p["wave"] == 0
            else f"Nivel {p['wave']}"
        )

        records.append({
            "id": f"wp-{p['post_id']}",
            "wave": wave_labels[p["wave"]],
            "waveNum": p["wave"],
            "levelLabel": level_label,
            "n1": n1,
            "title": p["title"],
            "slug": p["slug"],
            "parentPage": parent_title,
            "url": p["url"],
            "breadcrumb": breadcrumb,
            "filePath": f"docs/plantillas-wpbakery/{p['rel_file']}",
            "shortcode": p["content"],
        })
    return records


def main():
    records = build_offline_records()
    css_raw = CSS_FILE.read_text(encoding="utf-8")

    data_json = json.dumps(records, ensure_ascii=False)
    css_json = json.dumps(css_raw, ensure_ascii=False)

    html_doc = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Planificador Offline WordPress + WPBakery (160 Páginas) — Portal SAT</title>
  <style>
    :root {{
      --sat-navy: #003865;
      --sat-blue: #14649B;
      --sat-sky: #0284C7;
      --sat-green: #059669;
      --sat-bg: #F8FAFC;
      --sat-border: #E2E8F0;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--sat-bg);
      color: #0F172A;
    }}
    header {{
      background: var(--sat-navy);
      color: #fff;
      padding: 14px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 20;
      border-bottom: 3px solid #19AFE1;
    }}
    header h1 {{
      margin: 0;
      font-size: 17px;
      font-weight: 700;
    }}
    header p {{
      margin: 3px 0 0 0;
      font-size: 12px;
      color: #BAE6FD;
    }}
    .top-actions {{
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }}
    .badge-progress {{
      background: rgba(255,255,255,0.12);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
    }}
    .btn {{
      border: 1px solid transparent;
      border-radius: 9px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }}
    .btn-primary {{
      background: var(--sat-navy);
      color: #fff;
    }}
    .btn-primary:hover {{
      background: var(--sat-blue);
    }}
    .btn-accent {{
      background: #38BDF8;
      color: #082F49;
    }}
    .btn-accent:hover {{
      background: #7DD3FC;
    }}
    .btn-outline {{
      background: #fff;
      border-color: #CBD5E1;
      color: #334155;
    }}
    .btn-outline:hover {{
      background: #F1F5F9;
    }}
    .wave-bar {{
      background: #fff;
      border-bottom: 1px solid var(--sat-border);
      padding: 10px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }}
    .wave-pills {{
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }}
    .wave-pill {{
      border: none;
      background: #F1F5F9;
      color: #334155;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }}
    .wave-pill.active {{
      background: var(--sat-navy);
      color: #fff;
    }}
    .layout {{
      max-width: 1400px;
      margin: 0 auto;
      padding: 18px 24px;
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 20px;
    }}
    @media (max-width: 980px) {{
      .layout {{ grid-template-columns: 1fr; }}
    }}
    .sidebar {{
      background: #fff;
      border: 1px solid var(--sat-border);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 150px);
      overflow: hidden;
    }}
    .sidebar-head {{
      padding: 12px;
      border-bottom: 1px solid var(--sat-border);
      background: #F8FAFC;
    }}
    .search-input {{
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      font-size: 12px;
      margin-top: 8px;
    }}
    .n1-pills {{
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 8px;
    }}
    .n1-pill {{
      border: none;
      background: #E2E8F0;
      color: #334155;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }}
    .n1-pill.active {{
      background: var(--sat-blue);
      color: #fff;
    }}
    .page-list {{
      overflow-y: auto;
      flex: 1;
    }}
    .page-item {{
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      border-bottom: 1px solid #F1F5F9;
      cursor: pointer;
    }}
    .page-item:hover {{
      background: #F8FAFC;
    }}
    .page-item.selected {{
      background: #E0F2FE;
      border-left: 4px solid var(--sat-blue);
    }}
    .page-item.done .item-title {{
      text-decoration: line-through;
      color: #64748B;
    }}
    .item-meta {{
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #64748B;
      margin-bottom: 2px;
    }}
    .item-badge {{
      background: #E2E8F0;
      color: #1E293B;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
    }}
    .item-title {{
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
    }}
    .item-parent {{
      font-size: 11px;
      color: #64748B;
      margin-top: 2px;
    }}
    .workspace {{
      display: flex;
      flex-direction: column;
      gap: 14px;
    }}
    .card {{
      background: #fff;
      border: 1px solid var(--sat-border);
      border-radius: 14px;
      padding: 18px;
    }}
    .card-header {{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding-bottom: 14px;
      border-bottom: 1px solid #F1F5F9;
    }}
    .steps-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 14px;
    }}
    @media (max-width: 900px) {{
      .steps-grid {{ grid-template-columns: 1fr 1fr; }}
    }}
    .step-box {{
      border: 1px solid var(--sat-border);
      background: #F8FAFC;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 12px;
    }}
    .step-box.parent {{
      background: #FFFBEB;
      border-color: #FDE68A;
    }}
    .step-box.url {{
      background: #ECFDF5;
      border-color: #A7F3D0;
    }}
    .step-top {{
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748B;
      margin-bottom: 4px;
    }}
    .copy-mini {{
      border: none;
      background: none;
      color: var(--sat-blue);
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
    }}
    .breadcrumb-banner {{
      margin-top: 12px;
      padding: 10px 14px;
      background: #F0F9FF;
      border: 1px solid #BAE6FD;
      border-radius: 10px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }}
    pre {{
      background: #0F172A;
      color: #E2E8F0;
      padding: 14px;
      border-radius: 12px;
      font-size: 11.5px;
      line-height: 1.55;
      overflow-x: auto;
      max-height: 460px;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 10px 0 0 0;
    }}
    .toast {{
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #065F46;
      color: #fff;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      display: none;
      z-index: 50;
      box-shadow: 0 8px 20px rgba(0,0,0,0.18);
    }}
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Planificador Offline WordPress + WPBakery (160 Páginas — 0% [vc_raw_html])</h1>
      <p>Funciona con doble clic sin servidor ni internet. Todas las páginas incluyen [dt_breadcrumbs] y enlaces listos.</p>
    </div>
    <div class="top-actions">
      <label style="font-size:12px;display:flex;align-items:center;gap:6px;">
        <span>Modo Tarjeta:</span>
        <select id="cardModeSelect" style="padding:5px 8px;border-radius:6px;border:none;font-size:12px;font-weight:700;">
          <option value="bsf">Ultimate Addons ([bsf-info-box])</option>
          <option value="vc_core">Fallback WPBakery Core ([vc_column_text])</option>
        </select>
      </label>
      <label style="font-size:12px;display:flex;align-items:center;gap:6px;">
        <span>Subcarpeta WP (opcional):</span>
        <input id="basePathInput" type="text" placeholder="/ (raíz)" style="padding:5px 8px;border-radius:6px;border:none;font-size:12px;width:120px;font-family:monospace;" />
      </label>
      <div class="badge-progress" id="progressBadge">Progreso: 0 / 160</div>
      <button class="btn btn-accent" id="copyCssBtn">Copiar CSS Global (The7)</button>
    </div>
  </header>

  <div class="wave-bar">
    <div class="wave-pills" id="wavePills"></div>
    <div style="font-size:12px;color:#475569;">
      <strong>Regla de oro:</strong> Crea siempre de Ola 0 → Ola 4 para que la «Página Superior» ya exista en WordPress.
    </div>
  </div>

  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-head">
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;">
          <span id="listCountLabel">Páginas (160)</span>
          <span style="color:#64748B;font-size:11px;">Marca tu avance</span>
        </div>
        <input id="searchInput" class="search-input" type="search" placeholder="Buscar título, página superior o slug..." />
        <div class="n1-pills" id="n1Pills"></div>
      </div>
      <div class="page-list" id="pageList"></div>
    </aside>

    <main class="workspace">
      <div class="card">
        <div class="card-header">
          <div>
            <div style="font-size:11px;color:#64748B;font-weight:700;" id="pageWaveAndFile"></div>
            <h2 style="margin:4px 0 0 0;font-size:20px;color:#003865;" id="pageTitleHeading"></h2>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-outline" id="prevBtn">← Anterior</button>
            <button class="btn btn-outline" id="nextBtn">Siguiente →</button>
            <button class="btn btn-outline" id="toggleDoneBtn">Marcar Creada</button>
            <button class="btn btn-primary" id="copyShortcodeBtn">4. Copiar Shortcode WPBakery</button>
          </div>
        </div>

        <div class="steps-grid">
          <div class="step-box">
            <div class="step-top">
              <span>1. Título de Página</span>
              <button class="copy-mini" id="copyTitleBtn">Copiar</button>
            </div>
            <div style="font-weight:700;" id="stepTitle"></div>
          </div>
          <div class="step-box parent">
            <div class="step-top">
              <span>2. Atributo «Página Superior»</span>
              <button class="copy-mini" id="copyParentBtn">Copiar</button>
            </div>
            <div style="font-weight:700;color:#78350F;" id="stepParent"></div>
          </div>
          <div class="step-box">
            <div class="step-top">
              <span>3. Slug en WordPress</span>
              <button class="copy-mini" id="copySlugBtn">Copiar</button>
            </div>
            <code style="font-weight:700;color:#003865;" id="stepSlug"></code>
          </div>
          <div class="step-box url">
            <div class="step-top">
              <span>URL Final Auto-Conectada</span>
            </div>
            <code style="font-weight:700;color:#065F46;word-break:break-all;font-size:11px;" id="stepUrl"></code>
          </div>
        </div>

        <div class="breadcrumb-banner">
          <div>
            <strong style="color:#003865;">Breadcrumb Automático ([dt_breadcrumbs] en línea 1):</strong>
            <span id="stepBreadcrumb"></span>
          </div>
        </div>

        <div style="margin-top:14px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#475569;">
          <span>Pega este bloque en <strong>WPBakeryModo Clásico › pestaña Texto</strong>:</span>
          <strong style="color:#059669;">0 bloques [vc_raw_html]</strong>
        </div>
        <pre id="shortcodePre"></pre>
      </div>
    </main>
  </div>

  <div class="toast" id="toast">¡Copiado al portapapeles!</div>

  <script>
    const PAGES = {data_json};
    const WP_CSS = {css_json};
    const STORAGE_DONE = 'sat_wpbakery_created_pages_v1';
    const STORAGE_BASE = 'sat_wpbakery_base_path_v1';
    const STORAGE_MODE = 'sat_wpbakery_card_mode_v1';

    let selectedId = PAGES[0].id;
    let activeWave = 'Todas';
    let activeN1 = 'Todos';
    let searchQuery = '';
    let basePath = localStorage.getItem(STORAGE_BASE) || '';
    let cardMode = localStorage.getItem(STORAGE_MODE) || 'bsf';
    let completed = new Set(JSON.parse(localStorage.getItem(STORAGE_DONE) || '[]'));

    const waves = [
      'Todas',
      'Ola 0 (Portada + Universales)',
      'Ola 1 (Nivel 1)',
      'Ola 2 (Nivel 2)',
      'Ola 3 (Nivel 3)',
      'Ola 4 (Nivel 4)'
    ];
    const n1s = ['Todos', 'Contribuyentes', 'Operadores de Comercio Exterior', 'Profesionales', 'Entes Exentos'];

    function showToast(msg) {{
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.style.display = 'block';
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => {{ t.style.display = 'none'; }}, 2000);
    }}

    function copyText(text, label) {{
      if (navigator.clipboard && navigator.clipboard.writeText) {{
        navigator.clipboard.writeText(text).then(() => showToast(label));
      }} else {{
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(label);
      }}
    }}

    function applyBase(shortcode) {{
      const clean = basePath.trim().replace(/\\/+$/, '');
      let out = shortcode;
      if (clean) {{
        const enc = encodeURI(clean).replace(/\\//g, '%2F');
        out = out
          .replace(/link="url:%2F/g, 'link="url:' + enc + '%2F')
          .replace(/link="url:\\//g, 'link="url:' + clean + '/');
      }}
      if (cardMode === 'vc_core') {{
        out = out.replace(
          /\\[bsf-info-box[^\\]]*title="([^"]*)"[^\\]]*link="([^"]*)"[^\\]]*\\]([\\s\\S]*?)\\[\\/bsf-info-box\\]/g,
          (_m, title, linkAttr, desc) => {{
            let href = '#';
            let isBlank = false;
            if (linkAttr && linkAttr.startsWith('url:')) {{
              const parts = linkAttr.slice(4).split('|');
              try {{ href = decodeURIComponent(parts[0] || '#'); }} catch {{ href = parts[0] || '#'; }}
              isBlank = linkAttr.includes('_blank');
            }}
            const targetAttr = isBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
            return '[vc_column_text el_class="sat-card"]<h3 class="sat-card-title"><a href="' + href + '"' + targetAttr + '>' + title + '</a></h3><p class="sat-card-desc">' + desc + '</p>[/vc_column_text]';
          }}
        );
      }}
      return out;
    }}

    function getFiltered() {{
      return PAGES.filter(p => {{
        if (activeWave !== 'Todas' && p.wave !== activeWave) return false;
        if (activeN1 !== 'Todos' && p.n1 !== activeN1) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.url.toLowerCase().includes(q) || p.parentPage.toLowerCase().includes(q);
      }});
    }}

    function saveDone() {{
      localStorage.setItem(STORAGE_DONE, JSON.stringify(Array.from(completed)));
    }}

    function render() {{
      document.getElementById('progressBadge').textContent = 'Progreso: ' + completed.size + ' / ' + PAGES.length;

      // Wave pills
      const waveContainer = document.getElementById('wavePills');
      waveContainer.innerHTML = '';
      waves.forEach(w => {{
        const count = w === 'Todas' ? PAGES.length : PAGES.filter(p => p.wave === w).length;
        const btn = document.createElement('button');
        btn.className = 'wave-pill' + (activeWave === w ? ' active' : '');
        btn.textContent = w + ' (' + count + ')';
        btn.onclick = () => {{ activeWave = w; render(); }};
        waveContainer.appendChild(btn);
      }});

      // N1 pills
      const n1Container = document.getElementById('n1Pills');
      n1Container.innerHTML = '';
      n1s.forEach(seg => {{
        const btn = document.createElement('button');
        btn.className = 'n1-pill' + (activeN1 === seg ? ' active' : '');
        btn.textContent = seg === 'Operadores de Comercio Exterior' ? 'Comercio Exterior' : seg;
        btn.onclick = () => {{ activeN1 = seg; render(); }};
        n1Container.appendChild(btn);
      }});

      const filtered = getFiltered();
      document.getElementById('listCountLabel').textContent = 'Páginas en esta Ola (' + filtered.length + ')';

      const current = PAGES.find(p => p.id === selectedId) || filtered[0] || PAGES[0];
      selectedId = current.id;

      // Page list
      const listEl = document.getElementById('pageList');
      listEl.innerHTML = '';
      filtered.forEach(p => {{
        const isSel = p.id === current.id;
        const isDone = completed.has(p.id);
        const row = document.createElement('div');
        row.className = 'page-item' + (isSel ? ' selected' : '') + (isDone ? ' done' : '');

        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = isDone;
        chk.style.marginTop = '3px';
        chk.onclick = (e) => {{
          e.stopPropagation();
          if (completed.has(p.id)) completed.delete(p.id);
          else completed.add(p.id);
          saveDone();
          render();
        }};

        const body = document.createElement('div');
        body.style.flex = '1';
        body.innerHTML =
          '<div class="item-meta"><span class="item-badge">' + p.levelLabel + '</span><code>' + p.slug + '</code></div>' +
          '<div class="item-title">' + p.title + '</div>' +
          '<div class="item-parent">Superior: <strong>' + p.parentPage + '</strong></div>';

        row.appendChild(chk);
        row.appendChild(body);
        row.onclick = () => {{ selectedId = p.id; render(); }};
        listEl.appendChild(row);
      }});

      // Workspace detail
      document.getElementById('pageWaveAndFile').textContent = current.wave + '  •  ' + current.filePath;
      document.getElementById('pageTitleHeading').textContent = current.title;
      document.getElementById('stepTitle').textContent = current.title;
      document.getElementById('stepParent').textContent = current.parentPage;
      document.getElementById('stepSlug').textContent = current.slug;
      const cleanBase = basePath.trim().replace(/\\/+$/, '');
      document.getElementById('stepUrl').textContent = (cleanBase ? cleanBase : '') + current.url;
      document.getElementById('stepBreadcrumb').textContent = current.breadcrumb;
      document.getElementById('shortcodePre').textContent = applyBase(current.shortcode);

      const doneBtn = document.getElementById('toggleDoneBtn');
      doneBtn.textContent = completed.has(current.id) ? '✓ Página Creada' : 'Marcar Creada';

      const idx = filtered.findIndex(p => p.id === current.id);
      document.getElementById('prevBtn').disabled = idx <= 0;
      document.getElementById('nextBtn').disabled = idx < 0 || idx >= filtered.length - 1;

      document.getElementById('prevBtn').onclick = () => {{
        if (idx > 0) {{ selectedId = filtered[idx - 1].id; render(); }}
      }};
      document.getElementById('nextBtn').onclick = () => {{
        if (idx >= 0 && idx < filtered.length - 1) {{ selectedId = filtered[idx + 1].id; render(); }}
      }};
      doneBtn.onclick = () => {{
        if (completed.has(current.id)) completed.delete(current.id);
        else completed.add(current.id);
        saveDone();
        render();
      }};
      document.getElementById('copyShortcodeBtn').onclick = () => copyText(applyBase(current.shortcode), '¡Shortcode WPBakery copiado!');
      document.getElementById('copyTitleBtn').onclick = () => copyText(current.title, 'Título copiado');
      document.getElementById('copyParentBtn').onclick = () => copyText(current.parentPage, 'Página Superior copiada');
      document.getElementById('copySlugBtn').onclick = () => copyText(current.slug, 'Slug copiado');
    }}

    document.getElementById('searchInput').oninput = (e) => {{
      searchQuery = e.target.value;
      render();
    }};
    const baseInput = document.getElementById('basePathInput');
    baseInput.value = basePath;
    baseInput.oninput = (e) => {{
      basePath = e.target.value;
      localStorage.setItem(STORAGE_BASE, basePath);
      render();
    }};
    const modeSelect = document.getElementById('cardModeSelect');
    modeSelect.value = cardMode;
    modeSelect.onchange = (e) => {{
      cardMode = e.target.value;
      localStorage.setItem(STORAGE_MODE, cardMode);
      render();
    }};
    document.getElementById('copyCssBtn').onclick = () => copyText(WP_CSS, '¡CSS Global de The7 copiado!');

    render();
  </script>
</body>
</html>
"""
    OUTPUT_HTML.write_text(html_doc, encoding="utf-8")
    print(f"Planificador Offline autónomo generado con éxito en: {OUTPUT_HTML} ({len(records)} páginas embebidas)")


if __name__ == "__main__":
    main()
