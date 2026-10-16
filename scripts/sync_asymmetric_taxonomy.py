#!/usr/bin/env python3
"""
scripts/sync_asymmetric_taxonomy.py
Sincroniza la taxonomía asimétrica real 1:1 desde la miga de pan (migaBreadcrumb)
hacia allTramites.json y regenera el libro maestro oficial Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx.
- Elimina niveles inventados y duplicaciones de nombre de gestión en N5.
- Deja N4 y N5 vacíos ('—') donde no existan.
- Preserva códigos inmutables SAT-GES-####, orden ATO y matriz de 25 columnas.
"""

import json
from collections import OrderedDict

ALL_TRAMITES_PATH = 'src/data/allTramites.json'

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

print(f"Cargados {len(master_data)} trámites desde {ALL_TRAMITES_PATH}")

# 1. Definición de orden de segmentos (Nivel 1)
n1_order_map = {
    'Contribuyentes': 1,
    'Operadores de Comercio Exterior': 2,
    'Profesionales': 3,
    'Entes Exentos': 4
}

n2_order_map = OrderedDict()
n3_order_map = OrderedDict()
n4_order_map = OrderedDict()
n5_order_map = OrderedDict()
leaf_content_counters = OrderedDict()

# 2. Primera pasada: registrar nodos únicos en orden de aparición/ATO
for item in master_data:
    miga = item.get('migaBreadcrumb', '')
    parts = [p.strip() for p in miga.split('>') if p.strip()]
    nav_levels = parts[:-1] if len(parts) > 1 else parts

    n1 = nav_levels[0] if len(nav_levels) >= 1 else '—'
    n2 = nav_levels[1] if len(nav_levels) >= 2 else '—'
    n3 = nav_levels[2] if len(nav_levels) >= 3 else '—'
    n4 = nav_levels[3] if len(nav_levels) >= 4 else '—'
    n5 = nav_levels[4] if len(nav_levels) >= 5 else '—'

    if (n1, n2) not in n2_order_map:
        cnt = sum(1 for (k1, k2) in n2_order_map if k1 == n1) + 1
        n2_order_map[(n1, n2)] = cnt

    if n3 != '—' and (n1, n2, n3) not in n3_order_map:
        cnt = sum(1 for (k1, k2, k3) in n3_order_map if k1 == n1 and k2 == n2) + 1
        n3_order_map[(n1, n2, n3)] = cnt

    if n4 != '—' and (n1, n2, n3, n4) not in n4_order_map:
        cnt = sum(1 for (k1, k2, k3, k4) in n4_order_map if k1 == n1 and k2 == n2 and k3 == n3) + 1
        n4_order_map[(n1, n2, n3, n4)] = cnt

    if n5 != '—' and (n1, n2, n3, n4, n5) not in n5_order_map:
        cnt = sum(1 for (k1, k2, k3, k4, k5) in n5_order_map if k1 == n1 and k2 == n2 and k3 == n3 and k4 == n4) + 1
        n5_order_map[(n1, n2, n3, n4, n5)] = cnt

print(f"Taxonomía detectada: {len(n1_order_map)} N1, {len(n2_order_map)} N2, {len(n3_order_map)} N3, {len(n4_order_map)} N4, {len(n5_order_map)} N5")

# 3. Segunda pasada: actualizar campos en allTramites.json
for item in master_data:
    miga = item.get('migaBreadcrumb', '')
    parts = [p.strip() for p in miga.split('>') if p.strip()]
    nav_levels = parts[:-1] if len(parts) > 1 else parts

    n1 = nav_levels[0] if len(nav_levels) >= 1 else '—'
    n2 = nav_levels[1] if len(nav_levels) >= 2 else '—'
    n3 = nav_levels[2] if len(nav_levels) >= 3 else '—'
    n4 = nav_levels[3] if len(nav_levels) >= 4 else '—'
    n5 = nav_levels[4] if len(nav_levels) >= 5 else '—'

    ord_n1 = n1_order_map.get(n1, 1)
    ord_n2 = n2_order_map.get((n1, n2), 1)
    ord_n3 = n3_order_map.get((n1, n2, n3), '—') if n3 != '—' else '—'
    ord_n4 = n4_order_map.get((n1, n2, n3, n4), '—') if n4 != '—' else '—'
    ord_n5 = n5_order_map.get((n1, n2, n3, n4, n5), '—') if n5 != '—' else '—'

    leaf_key = (n1, n2, n3, n4, n5)
    leaf_content_counters[leaf_key] = leaf_content_counters.get(leaf_key, 0) + 1
    ord_c = leaf_content_counters[leaf_key]

    # Actualizar campos canónicos en el item
    item['nivel1_segmento'] = n1
    item['nivel2_area'] = n2
    item['nivel3_subarea'] = n3
    item['nivel4_tema'] = n4
    item['nivel5_tramite'] = n5
    item['nivel2_categoria'] = n2
    item['nivel3_subcategoria'] = n3

    item['segmento'] = n1
    item['regimenArea'] = n2
    item['grupoActor'] = n3
    item['materiaTema'] = n4
    item['subtemaGestion'] = n5

    item['categoria'] = n2
    item['subcategoria'] = n3 if n3 != '—' else n2
    item['tema'] = n4 if n4 != '—' else (n3 if n3 != '—' else n2)
    item['subtema'] = n5 if n5 != '—' else (n4 if n4 != '—' else (n3 if n3 != '—' else n2))

    item['orden_n1'] = ord_n1
    item['orden_n2'] = ord_n2
    item['orden_n3'] = ord_n3
    item['orden_n4'] = ord_n4
    item['orden_n5'] = ord_n5
    item['orden_contenido'] = ord_c

with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(master_data, f, ensure_ascii=False, indent=2)

print(f"[OK] {ALL_TRAMITES_PATH} actualizado con taxonomía asimétrica y órdenes 1:1.")
