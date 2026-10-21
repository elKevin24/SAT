import json
import csv
import re
import os

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

def main():
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        tramites = json.load(f)

    # 1. Macro-Segmentos (Nivel 1)
    segments_meta = {
        'contribuyentes': {
            'title': 'Contribuyentes',
            'tone': 'azul',
            'desc': 'Información y servicios tributarios para personas y empresas. Accede a las gestiones de tu régimen, declaraciones juradas, RTU Digital y vehículos.'
        },
        'comercio_exterior': {
            'title': 'Operadores de Comercio Exterior',
            'tone': 'celeste',
            'desc': 'Servicios e información aduanera para la importación, exportación y logística. Inscripción en padrones, declaración DUCA y auxiliares de la función pública.'
        },
        'profesionales': {
            'title': 'Profesionales',
            'tone': 'verde',
            'desc': 'Herramientas y habilitaciones para profesionales tributarios y auxiliares. Acreditaciones, timbres fiscales, traspasos vehiculares y libros contables.'
        },
        'entes_exentos': {
            'title': 'Entes Exentos',
            'tone': 'naranja',
            'desc': 'Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas. Constancias de exención, CIVA y personería jurídica.'
        }
    }

    pages_to_export = []

    # A. Crear las 4 Páginas Padre (Nivel 1)
    for seg_id, sdata in segments_meta.items():
        slug = slugify(sdata['title'])
        pages_to_export.append({
            'page_title': sdata['title'],
            'page_slug': slug,
            'parent_slug': '',
            'nivel': 'Nivel 1',
            'segmento': sdata['title'],
            'tone': sdata['tone'],
            'excerpt': sdata['desc'],
            'content_type': 'hub_segmento'
        })

    # B. Agrupar por Nivel 2 (Áreas / Regímenes)
    n2_groups = {}
    for t in tramites:
        seg_id = t.get('pillar')
        if seg_id not in segments_meta:
            continue
        n2_name = t.get('nivel2_area') or t.get('categoria')
        if not n2_name or n2_name == '—':
            continue
        
        key = (seg_id, n2_name)
        if key not in n2_groups:
            n2_groups[key] = {
                'seg_id': seg_id,
                'n2_name': n2_name,
                'tramites': [],
                'subareas': set()
            }
        n2_groups[key]['tramites'].append(t)
        n3 = t.get('nivel3_subarea') or t.get('subcategoria')
        if n3 and n3 != '—' and n3 != n2_name:
            n2_groups[key]['subareas'].add(n3)

    # Generar páginas de Nivel 2
    for (seg_id, n2_name), data in n2_groups.items():
        parent_slug = slugify(segments_meta[seg_id]['title'])
        page_slug = slugify(n2_name)
        tone = segments_meta[seg_id]['tone']
        
        # Descripción
        desc = f"Gestiones y servicios tributarios correspondientes a {n2_name}."
        if data['tramites'] and data['tramites'][0].get('descripcion'):
            # Primer trámite como referencia
            pass

        pages_to_export.append({
            'page_title': n2_name,
            'page_slug': page_slug,
            'parent_slug': parent_slug,
            'nivel': 'Nivel 2',
            'segmento': segments_meta[seg_id]['title'],
            'tone': tone,
            'excerpt': desc,
            'content_type': 'area_hub',
            'items_data': data['tramites']
        })

    # C. Construir el HTML completo para cada página en WPBakery
    output_rows = []
    for p in pages_to_export:
        seg_title = p['segmento']
        title = p['page_title']
        slug = p['page_slug']
        parent = p['parent_slug']
        tone = p['tone']
        excerpt = p['excerpt']
        nivel = p['nivel']
        
        # 1. Breadcrumb HTML
        breadcrumb_html = f'<nav class="sat-breadcrumb" aria-label="Miga de pan">\n  <a href="/portal/">Inicio</a>\n'
        if parent:
            breadcrumb_html += f'  <span class="sat-breadcrumb-sep">›</span>\n  <a href="/portal/{parent}/">{seg_title}</a>\n'
        breadcrumb_html += f'  <span class="sat-breadcrumb-sep">›</span>\n  <span class="sat-breadcrumb-current" aria-current="page">{title}</span>\n</nav>'

        # 2. Header & In this section HTML
        in_this_section_links = ''
        cards_html = ''
        
        if p['content_type'] == 'hub_segmento':
            # Obtener sus áreas hijas
            child_areas = [d['n2_name'] for (s, n), d in n2_groups.items() if s == [k for k, v in segments_meta.items() if v['title'] == seg_title][0]]
            links_tags = ''.join([f'  <a href="/portal/{slug}/{slugify(ca)}/" class="sat-its-link">{ca}</a>\n' for ca in child_areas[:8]])
            in_this_section_links = links_tags

            # Cards de las áreas
            for ca in child_areas:
                ca_key = ([k for k, v in segments_meta.items() if v['title'] == seg_title][0], ca)
                ca_tramites = n2_groups.get(ca_key, {}).get('tramites', [])
                ca_desc = ca_tramites[0].get('descripcion') if ca_tramites else f"Información y servicios oficiales para {ca}."
                if len(ca_desc) > 130:
                    ca_desc = ca_desc[:127] + '...'
                cards_html += f'''
  <a href="/portal/{slug}/{slugify(ca)}/" class="sat-card sat-card--{tone}">
    <div class="sat-card-head">
      <h3 class="sat-card-title">{ca}</h3>
      <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
    </div>
    <p class="sat-card-desc">{ca_desc}</p>
  </a>'''

        else:
            # Es un área con sus trámites reales
            t_list = p.get('items_data', [])
            # In this section con los primeros 6 trámites
            links_tags = ''.join([f'  <a href="#{slugify(t.get("tramite", ""))[:25]}" class="sat-its-link">{t.get("tramite", "")[:35]}</a>\n' for t in t_list[:6]])
            in_this_section_links = links_tags

            for t in t_list[:15]:
                t_title = t.get('tramite', 'Trámite Oficial')
                t_desc = t.get('descripcion', 'Requisitos y pasos normados.')
                if len(t_desc) > 140:
                    t_desc = t_desc[:137] + '...'
                t_url = t.get('url') or 'https://portal.sat.gob.gt/'
                cards_html += f'''
  <a href="{t_url}" target="_blank" rel="noopener noreferrer" class="sat-card sat-card--{tone}">
    <div class="sat-card-head">
      <h3 class="sat-card-title">{t_title}</h3>
      <span class="sat-card-chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></span>
    </div>
    <p class="sat-card-desc">{t_desc}</p>
  </a>'''

        header_html = f'''<header class="sat-section-header">
  <div class="sat-segment-badge">
    <span class="sat-badge-dot sat-badge-dot--{tone}"></span>
    <span class="sat-badge-text">{seg_title.upper()}</span>
  </div>
  <h1 class="sat-section-title">{title}</h1>
  <p class="sat-section-desc">{excerpt}</p>

  <div class="sat-in-this-section sat-in-this-section--{tone}">
    <div class="sat-its-head">
      <svg class="sat-its-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5-4-1.5 1.5-4 4 1.5z"/></svg>
      <span class="sat-its-label">EN ESTA SECCIÓN:</span>
    </div>
    <div class="sat-its-links">
{in_this_section_links}    </div>
  </div>
</header>'''

        grid_html = f'<div class="sat-cards-grid">{cards_html}\n</div>'

        # Contenido final para WPBakery / WordPress
        full_page_html = f'{breadcrumb_html}\n\n{header_html}\n\n{grid_html}'

        output_rows.append({
            'post_title': title,
            'post_name': slug,
            'parent_slug': parent,
            'post_content': full_page_html,
            'post_excerpt': excerpt,
            'post_status': 'publish',
            'post_type': 'page',
            'nivel_jerarquico': nivel,
            'segmento_oficial': seg_title
        })

    # Guardar CSV
    csv_file = 'docs/fuentes-datos/02_archivos_producto_entregables/importar_paginas_sat_wp_all_import.csv'
    with open(csv_file, 'w', encoding='utf-8', newline='') as out:
        writer = csv.DictWriter(out, fieldnames=[
            'post_title', 'post_name', 'parent_slug', 'post_content',
            'post_excerpt', 'post_status', 'post_type', 'nivel_jerarquico', 'segmento_oficial'
        ])
        writer.writeheader()
        writer.writerows(output_rows)

    print(f'✓ Exportadas {len(output_rows)} páginas oficiales listas para WP All Import en: {csv_file}')

if __name__ == '__main__':
    main()
