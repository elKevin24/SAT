import re
import os
import urllib.parse
from bs4 import BeautifulSoup

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

def extract_cards_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    cards_data = []
    
    # Buscar tarjetas .sat-card
    cards = soup.select('.sat-card')
    for card in cards:
        title_el = card.select_one('.sat-card-title')
        desc_el = card.select_one('.sat-card-desc')
        url = card.get('href', '')
        
        title = title_el.get_text().strip() if title_el else ''
        desc = desc_el.get_text().strip() if desc_el else ''
        
        if title:
            cards_data.append({
                'title': clean_text(title),
                'desc': clean_text(desc),
                'url': url
            })
    return cards_data

def build_shortcode_for_cards(pillar_class, cards_data, col_width="1/3"):
    lines = []
    lines.append('[vc_row gap="5px"][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]')
    lines.append('[vc_section]')
    lines.append(f'[vc_row gap="0px" el_class="{pillar_class}"]')
    
    for c in cards_data:
        title = c['title']
        desc = c['desc']
        # En la plantilla del usuario el link viene link="" o con URL
        lines.append(f'[vc_column width="{col_width}"][bsf-info-box icon_type="none" title="{title}" read_more="box" link=""]{desc}[/bsf-info-box][/vc_column]')
        
    lines.append('[/vc_row]')
    lines.append('[/vc_section]')
    return '\n'.join(lines)

def generate_admin_box_html(shortcode, extra_tabs=None):
    # Genera la sección visual interactiva para copiar el shortcode
    if not extra_tabs:
        return f"""
    <!-- ========================================================================= -->
    <!-- BLOQUE WPBAKERY / THE7 CLASSIC - LISTO PARA COPIAR A WORDPRESS           -->
    <!-- ========================================================================= -->
    <section class="sat-wp-export-box" style="margin-top: 50px; margin-bottom: 30px; background: #f8fafc; border: 2px dashed #0072ce; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span style="display: inline-block; background: #003865; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">WordPress &bull; The7 Classic &bull; WPBakery</span>
          <h3 style="font-size: 17px; color: #003865; margin: 6px 0 2px; font-weight: 700;">Código WPBakery listo para copiar</h3>
          <p style="font-size: 13px; color: #475569; margin: 0;">Pega este código directamente en la pestaña <strong>Texto (Classic Mode)</strong> de WPBakery en WordPress.</p>
        </div>
        <button onclick="copiarShortcodeWp(this, 'wp-shortcode-main')" style="background: #0072ce; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          <span>Copiar Shortcode</span>
        </button>
      </div>
      <textarea id="wp-shortcode-main" readonly style="width: 100%; height: 260px; font-family: Consolas, 'Liberation Mono', Menlo, monospace; font-size: 12px; line-height: 1.5; padding: 14px; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff; color: #0f172a; resize: vertical; box-sizing: border-box;">{shortcode}</textarea>
    </section>
"""
    else:
        # Versión multi-tab
        tabs_nav = []
        textareas = []
        for idx, tab in enumerate(extra_tabs):
            active_btn_style = 'background: #003865; color: #fff;' if idx == 0 else 'background: #e2e8f0; color: #334155;'
            display_style = 'display: block;' if idx == 0 else 'display: none;'
            tab_id = f"wp-tab-{idx}"
            tabs_nav.append(f'<button type="button" onclick="switchWpTab(this, \'{tab_id}\')" style="padding: 7px 14px; font-size: 12px; font-weight: 600; border-radius: 4px; border: none; cursor: pointer; {active_btn_style} margin-right: 6px;">{tab["label"]}</button>')
            textareas.append(f"""
      <div id="{tab_id}" class="wp-tab-content" style="{display_style}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 12px; color: #64748b; font-weight: 600;">{tab['description']}</span>
          <button onclick="copiarShortcodeWp(this, 'ta-{tab_id}')" style="background: #0072ce; color: #fff; border: none; padding: 6px 14px; border-radius: 4px; font-weight: 600; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
            <span>Copiar este Shortcode</span>
          </button>
        </div>
        <textarea id="ta-{tab_id}" readonly style="width: 100%; height: 240px; font-family: Consolas, 'Liberation Mono', Menlo, monospace; font-size: 12px; line-height: 1.5; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff; color: #0f172a; resize: vertical; box-sizing: border-box;">{tab['shortcode']}</textarea>
      </div>""")
        tabs_html = ''.join(tabs_nav)
        areas_html = ''.join(textareas)
        return f"""
    <!-- ========================================================================= -->
    <!-- BLOQUE WPBAKERY / THE7 CLASSIC - LISTO PARA COPIAR A WORDPRESS           -->
    <!-- ========================================================================= -->
    <section class="sat-wp-export-box" style="margin-top: 50px; margin-bottom: 30px; background: #f8fafc; border: 2px dashed #0072ce; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="margin-bottom: 14px;">
        <span style="display: inline-block; background: #003865; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">WordPress &bull; The7 Classic &bull; WPBakery</span>
        <h3 style="font-size: 17px; color: #003865; margin: 6px 0 2px; font-weight: 700;">Códigos WPBakery listos para copiar</h3>
        <p style="font-size: 13px; color: #475569; margin: 0 0 12px;">Selecciona la sección y copia el código en la pestaña <strong>Texto (Classic Mode)</strong> de WordPress.</p>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          {tabs_html}
        </div>
      </div>
      {areas_html}
    </section>
"""

COPY_SCRIPT = """
  <!-- SCRIPT PARA COPIAR CÓDIGO WPBAKERY -->
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

    function switchWpTab(btn, targetId) {
      const parent = btn.closest('.sat-wp-export-box');
      parent.querySelectorAll('.wp-tab-content').forEach(c => c.style.display = 'none');
      parent.querySelectorAll('button[onclick*="switchWpTab"]').forEach(b => {
        b.style.background = '#e2e8f0';
        b.style.color = '#334155';
      });
      const target = document.getElementById(targetId);
      if (target) target.style.display = 'block';
      btn.style.background = '#003865';
      btn.style.color = '#fff';
    }
  </script>
"""

def main():
    pages_to_process = [
        {
            'path': 'html-template/paginas/contribuyentes/nit-sin-obligaciones.html',
            'pillar_class': 'sat-seccion-contribuyentes',
            'col_width': '1/3'
        },
        {
            'path': 'html-template/paginas/contribuyentes/pequenos-contribuyentes.html',
            'pillar_class': 'sat-seccion-contribuyentes',
            'col_width': '1/3',
            'is_pequenos': True
        },
        {
            'path': 'html-template/paginas/contribuyentes/regimen-general.html',
            'pillar_class': 'sat-seccion-contribuyentes',
            'col_width': '1/3'
        },
        {
            'path': 'html-template/paginas/contribuyentes/contribuyentes-especiales.html',
            'pillar_class': 'sat-seccion-contribuyentes',
            'col_width': '1/3'
        },
        {
            'path': 'html-template/paginas/contribuyentes.html',
            'pillar_class': 'sat-seccion-contribuyentes',
            'col_width': '1/4'
        },
        {
            'path': 'html-template/paginas/comercio-exterior.html',
            'pillar_class': 'sat-seccion-comercio-exterior',
            'col_width': '1/3'
        },
        {
            'path': 'html-template/paginas/comercio-exterior/afpa.html',
            'pillar_class': 'sat-seccion-comercio-exterior',
            'col_width': '1/3'
        },
        {
            'path': 'html-template/paginas/profesionales.html',
            'pillar_class': 'sat-seccion-profesionales',
            'col_width': '1/3'
        },
        {
            'path': 'html-template/paginas/entes-exentos.html',
            'pillar_class': 'sat-seccion-entes-exentos',
            'col_width': '1/4'
        }
    ]

    # Código exacto de Agropecuario que dio el usuario
    user_agropecuario_code = '''[vc_row gap="5px"][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row][vc_section][vc_row gap="0px" el_class="sat-seccion-contribuyentes"][vc_column width="1/3"][bsf-info-box icon_type="none" title="Inscribirte como productor agropecuario, artesanal o de reciclaje" read_more="box" link=""]Requisitos y pasos para inscribirte en el registro de productores del sector primario ante la SAT.[/bsf-info-box][/vc_column][vc_column width="1/3"][bsf-info-box icon_type="none" title="Afiliarte al Régimen Especial Agropecuario" read_more="box" link=""]Paso formal al Régimen Especial o Electrónico para productores agropecuarios con tarifa reducida de IVA.[/bsf-info-box][/vc_column][vc_column width="1/3"][bsf-info-box icon_type="none" title="Confirmar tus datos en el registro de productores" read_more="box" link=""]Ratificación anual obligatoria de datos y actividades en Agencia Virtual para mantener tu registro activo.[/bsf-info-box][/vc_column][vc_column width="1/3"][bsf-info-box icon_type="none" title="Modificar tus datos en el registro de productores" read_more="box" link=""]Actualización de productos, ubicación y datos comerciales registrados en la plataforma de productores.[/bsf-info-box][/vc_column][vc_column width="1/3"][bsf-info-box icon_type="none" title="Darte de baja del registro de productores" read_more="box" link=""]Inactivación o cancelación voluntaria de la inscripción en el registro de productores de la SAT.[/bsf-info-box][/vc_column][vc_column width="1/3"][bsf-info-box icon_type="none" title="Consultar productores inscritos" read_more="box" link=""]Herramienta pública de búsqueda para verificar la validez y estado de inscripción de un productor.[/bsf-info-box][/vc_column][vc_column width="1/3"][bsf-info-box icon_type="none" title="Curso: obligaciones del Régimen Especial Agropecuario" read_more="box" link=""]Capacitación virtual oficial sobre el marco tributario, facturación y retenciones del sector primario.[/bsf-info-box][/vc_column][vc_column width="1/3"][bsf-info-box icon_type="none" title="Curso: productores agropecuarios, artesanales y de reciclaje" read_more="box" link=""]Guía y curso en línea sobre los beneficios e inscripción del Decreto 7-2019 de simplificación tributaria.[/bsf-info-box][/vc_column][/vc_row][/vc_section]'''

    for p in pages_to_process:
        file_path = p['path']
        if not os.path.exists(file_path):
            print(f"[SKIP] No existe {file_path}")
            continue

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Si ya tiene el bloque sat-wp-export-box, lo removemos antes de reinsertar
        content = re.sub(r'<!-- =+\s*BLOQUE WPBAKERY.*?<\/section>', '', content, flags=re.DOTALL)
        content = re.sub(r'<section class="sat-wp-export-box".*?<\/section>', '', content, flags=re.DOTALL)
        content = re.sub(r'<!-- SCRIPT PARA COPIAR CÓDIGO WPBAKERY.*?<\/script>', '', content, flags=re.DOTALL)

        cards = extract_cards_from_html(content)
        shortcode = build_shortcode_for_cards(p['pillar_class'], cards, p['col_width'])

        if p.get('is_pequenos'):
            extra_tabs = [
                {
                    'label': 'Régimen Agropecuario y Productores (8 Gestiones)',
                    'description': 'Código para la subsección / página de Productores Agropecuarios (Decreto 7-2019)',
                    'shortcode': user_agropecuario_code
                },
                {
                    'label': 'Régimen de Pequeño Contribuyente (9 Gestiones)',
                    'description': 'Código correspondiente a la cuadrícula visible de esta página',
                    'shortcode': shortcode
                }
            ]
            admin_box = generate_admin_box_html('', extra_tabs=extra_tabs)
        else:
            admin_box = generate_admin_box_html(shortcode)

        # Inyectar antes de </main>
        if '</main>' in content:
            content = content.replace('</main>', f'{admin_box}\n  </main>')
        elif '</body>' in content:
            content = content.replace('</body>', f'{admin_box}\n</body>')

        # Inyectar script antes de </body> si no está la función declarada
        if 'function copiarShortcodeWp' not in content:
            content = content.replace('</body>', f'{COPY_SCRIPT}\n</body>')

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"[OK] Inyectado bloque WPBakery en: {file_path} ({len(cards)} tarjetas)")

    # Crear página dedicada para Régimen Agropecuario y Productores
    crear_pagina_agropecuario(user_agropecuario_code)

def crear_pagina_agropecuario(agro_shortcode):
    agro_path = 'html-template/paginas/contribuyentes/regimen-agropecuario.html'
    admin_box = generate_admin_box_html(agro_shortcode)
    
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Régimen Especial Agropecuario y Productores — Portal SAT Guatemala</title>
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
      <a href="../contribuyentes.html">Contribuyentes</a>
      <span class="sat-breadcrumb-sep">›</span>
      <a href="pequenos-contribuyentes.html">Pequeños Contribuyentes</a>
      <span class="sat-breadcrumb-sep">›</span>
      <span class="sat-breadcrumb-current" aria-current="page">Régimen Especial Agropecuario y Productores</span>
    </nav>

    <!-- 2. CABECERA Y "EN ESTA SECCIÓN" -->
    <header class="sat-section-header">
      <div class="sat-segment-badge">
        <span class="sat-badge-dot sat-badge-dot--contribuyentes"></span>
        <span class="sat-badge-text">CONTRIBUYENTES &bull; SECTOR PRIMARIO</span>
      </div>
      <h1 class="sat-section-title">Régimen Especial Agropecuario y Productores</h1>
      <p class="sat-section-desc">
        Requisitos, inscripción, actualización y capacitaciones oficiales para productores de productos agropecuarios, artesanales y de reciclaje conforme al Decreto 7-2019.
      </p>

      <div class="sat-in-this-section">
        <div class="sat-its-head">
          <svg class="sat-its-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5-4-1.5 1.5-4 4 1.5z"/></svg>
          <span class="sat-its-label">EN ESTA SECCIÓN:</span>
        </div>
        <div class="sat-its-links">
          <a href="#inscripcion" class="sat-its-link">Inscripción al Registro</a>
          <a href="#afiliacion" class="sat-its-link">Afiliación al Régimen</a>
          <a href="#actualizacion" class="sat-its-link">Confirmación y Modificación</a>
          <a href="#consultas" class="sat-its-link">Consulta de Productores</a>
          <a href="#cursos" class="sat-its-link">Cursos Virtuales</a>
        </div>
      </div>
    </header>

    <!-- 3. CUADRÍCULA DE LAS 8 GESTIONES OFICIALES -->
    <div class="sat-cards-grid">
      <a href="https://portal.sat.gob.gt/portal/requisitos-tramites-agencia-virtual/inscripcion-en-el-registro-de-productores-de-productos-agropecuarios-artesanales-y-reciclados/" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--azul">
        <div class="sat-card-head">
          <h2 class="sat-card-title">Inscribirte como productor agropecuario, artesanal o de reciclaje</h2>
          <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>
        <p class="sat-card-desc">Requisitos y pasos para inscribirte en el registro de productores del sector primario ante la SAT.</p>
      </a>

      <a href="https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-afiliaciones-regimen-especial-de-contribuyente-agropecuario-o-regimen-electronico-especial-de-contribuyente-agropecuario/" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--azul">
        <div class="sat-card-head">
          <h2 class="sat-card-title">Afiliarte al Régimen Especial Agropecuario</h2>
          <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>
        <p class="sat-card-desc">Paso formal al Régimen Especial o Electrónico para productores agropecuarios con tarifa reducida de IVA.</p>
      </a>

      <a href="https://portal.sat.gob.gt/portal/requisitos-tramites-agencia-virtual/ratificacion-de-datos-en-el-registro-de-productores-de-productos-agropecuarios-artesanales-y-reciclados/" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--azul">
        <div class="sat-card-head">
          <h2 class="sat-card-title">Confirmar tus datos en el registro de productores</h2>
          <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>
        <p class="sat-card-desc">Ratificación anual obligatoria de datos y actividades en Agencia Virtual para mantener tu registro activo.</p>
      </a>

      <a href="https://portal.sat.gob.gt/portal/requisitos-tramites-agencia-virtual/modificacion-de-datos-en-el-registro-de-productores-de-productos-agropecuarios-artesanales-y-reciclados/" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--azul">
        <div class="sat-card-head">
          <h2 class="sat-card-title">Modificar tus datos en el registro de productores</h2>
          <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>
        <p class="sat-card-desc">Actualización de productos, ubicación y datos comerciales registrados en la plataforma de productores.</p>
      </a>

      <a href="https://portal.sat.gob.gt/portal/requisitos-tramites-agencia-virtual/inactivacion-en-el-registro-de-productores-de-productos-agropecuarios-artesanales-y-reciclados/" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--azul">
        <div class="sat-card-head">
          <h2 class="sat-card-title">Darte de baja del registro de productores</h2>
          <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>
        <p class="sat-card-desc">Inactivación o cancelación voluntaria de la inscripción en el registro de productores de la SAT.</p>
      </a>

      <a href="https://portal.sat.gob.gt/portal/consulta-productores/" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--azul">
        <div class="sat-card-head">
          <h2 class="sat-card-title">Consultar productores inscritos</h2>
          <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>
        <p class="sat-card-desc">Herramienta pública de búsqueda para verificar la validez y estado de inscripción de un productor.</p>
      </a>

      <a href="https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat/impuesto-al-valor-agregado-iva/principales-obligaciones-tributarias-del-r%C3%A9gimen-especial-de-contribuyente" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--azul">
        <div class="sat-card-head">
          <h2 class="sat-card-title">Curso: obligaciones del Régimen Especial Agropecuario</h2>
          <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>
        <p class="sat-card-desc">Capacitación virtual oficial sobre el marco tributario, facturación y retenciones del sector primario.</p>
      </a>

      <a href="https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat/impuesto-al-valor-agregado-iva/inscripci%C3%B3n-y-actualizaci%C3%B3n-de-productores" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--azul">
        <div class="sat-card-head">
          <h2 class="sat-card-title">Curso: productores agropecuarios, artesanales y de reciclaje</h2>
          <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
        </div>
        <p class="sat-card-desc">Guía y curso en línea sobre los beneficios e inscripción del Decreto 7-2019 de simplificación tributaria.</p>
      </a>
    </div>

    {admin_box}
  </main>

  <footer class="sat-footer">
    <div class="sat-container sat-footer-inner">
      <span>© 2026 Superintendencia de Administración Tributaria — Guatemala</span>
      <a href="pequenos-contribuyentes.html">Volver a Pequeños Contribuyentes</a>
    </div>
  </footer>

  {COPY_SCRIPT}
</body>
</html>
"""
    with open(agro_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"[OK] Creada página dedicada: {agro_path}")

if __name__ == '__main__':
    main()
