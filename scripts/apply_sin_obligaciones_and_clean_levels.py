#!/usr/bin/env python3
"""
scripts/apply_sin_obligaciones_and_clean_levels.py
1. Renombra Nivel 2 a 'Sin Obligaciones' en allTramites.json y sincroniza.
2. Compacta las 10 gestiones terminales directamente bajo Nivel 2 (N3, N4, N5 = '—').
3. Limpia etiquetas semánticas inventadas en UI (PortalFlowPage: Nivel 1..5 sin nombres).
4. Actualiza categoryOrder.ts, a11y.spec.ts y regenera el libro Excel maestro.
"""

import json
import subprocess
import sys

ALL_TRAMITES_PATH = 'src/data/allTramites.json'
CATEGORY_ORDER_PATH = 'src/data/categoryOrder.ts'
PORTAL_FLOW_PATH = 'src/pages/PortalFlowPage.tsx'
A11Y_SPEC_PATH = 'tests/a11y.spec.ts'

# ==============================================================================
# 1. ACTUALIZAR allTramites.json
# ==============================================================================
with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    tramites = json.load(f)

# Orden ATO para las 10 gestiones de Sin Obligaciones
ato_order_weight = {
    'empezar': 1,
    'operar': 2,
    'consultar': 3,
    'modificar_cerrar': 4,
    'normativa': 5
}

# Filtrar las 10 gestiones de Sin Obligaciones
sin_ob_items = [t for t in tramites if t.get('nivel2_area') in ['Sin Obligaciones', 'NIT sin Obligaciones', 'Sin Obligaciones de Impuestos'] or t.get('categoria') in ['Sin Obligaciones', 'NIT sin Obligaciones', 'Sin Obligaciones de Impuestos']]

print(f"Detectadas {len(sin_ob_items)} gestiones para 'Sin Obligaciones'.")

# Ordenar por ciclo ATO y asignar orden_contenido 1..10
sin_ob_items.sort(key=lambda t: (ato_order_weight.get(t.get('etapaAto', 'operar'), 3), t.get('id', '')))

for idx, t in enumerate(sin_ob_items, 1):
    t['nivel1_segmento'] = 'Contribuyentes'
    t['nivel2_area'] = 'Sin Obligaciones'
    t['nivel3_subarea'] = '—'
    t['nivel4_tema'] = '—'
    t['nivel5_tramite'] = '—'

    t['nivel2_categoria'] = 'Sin Obligaciones'
    t['nivel3_subcategoria'] = '—'

    t['segmento'] = 'Contribuyentes'
    t['regimenArea'] = 'Sin Obligaciones'
    t['grupoActor'] = '—'
    t['materiaTema'] = '—'
    t['subtemaGestion'] = '—'

    t['categoria'] = 'Sin Obligaciones'

    t['orden_n1'] = 1
    t['orden_n2'] = 1
    t['orden_n3'] = '—'
    t['orden_n4'] = '—'
    t['orden_n5'] = '—'
    t['orden_contenido'] = idx

    t['migaBreadcrumb'] = f"Contribuyentes > Sin Obligaciones > {t['tramite']}"

with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(tramites, f, ensure_ascii=False, indent=2)

print(f"[OK] {ALL_TRAMITES_PATH} actualizado con N2 'Sin Obligaciones' y N3/N4/N5 compactados.")

# ==============================================================================
# 2. ACTUALIZAR categoryOrder.ts
# ==============================================================================
with open(CATEGORY_ORDER_PATH, 'r', encoding='utf-8') as f:
    co_text = f.read()

co_text = co_text.replace("'NIT sin Obligaciones'", "'Sin Obligaciones'")
with open(CATEGORY_ORDER_PATH, 'w', encoding='utf-8') as f:
    f.write(co_text)

print(f"[OK] {CATEGORY_ORDER_PATH} actualizado con 'Sin Obligaciones'.")

# ==============================================================================
# 3. ACTUALIZAR tests/a11y.spec.ts
# ==============================================================================
with open(A11Y_SPEC_PATH, 'r', encoding='utf-8') as f:
    a11y_text = f.read()

a11y_text = a11y_text.replace("'NIT sin Obligaciones'", "'Sin Obligaciones'")
with open(A11Y_SPEC_PATH, 'w', encoding='utf-8') as f:
    f.write(a11y_text)

print(f"[OK] {A11Y_SPEC_PATH} actualizado con 'Sin Obligaciones'.")

# ==============================================================================
# 4. LIMPIAR RÓTULOS SEMÁNTICOS EN PortalFlowPage.tsx (Los niveles no tienen nombre)
# ==============================================================================
with open(PORTAL_FLOW_PATH, 'r', encoding='utf-8') as f:
    pflow_text = f.read()

replacements = [
    ('Nivel 1 — Segmento', 'Nivel 1'),
    ('Áreas en Nivel 2:', 'Nodos en Nivel 2:'),
    ('Nivel 2 — Área', 'Nivel 2'),
    ('Nivel 3 — Subárea', 'Nivel 3'),
    ('Nivel 4 — Tema', 'Nivel 4'),
    ('Nivel 5 — Gestión', 'Nivel 5'),
    ('Nivel 1 (Segmento):', 'Nivel 1:'),
    ('temas (Nivel 4)', 'nodos (Nivel 4)'),
    ('subáreas (Nivel 3)', 'nodos (Nivel 3)'),
    ("'NIT sin Obligaciones'", "'Sin Obligaciones'")
]

for old, new in replacements:
    pflow_text = pflow_text.replace(old, new)

with open(PORTAL_FLOW_PATH, 'w', encoding='utf-8') as f:
    f.write(pflow_text)

print(f"[OK] {PORTAL_FLOW_PATH} sanitizado (niveles estrictamente numéricos Nivel 1 a 5).")

# ==============================================================================
# 5. REGENERAR EL LIBRO EXCEL ENTREGABLE
# ==============================================================================
print("[PROCESO] Regenerando Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx...")
res = subprocess.run([sys.executable, 'scripts/build_final_excel_deliverable.py'], capture_output=True, text=True)
if res.returncode != 0:
    print(f"[ERROR Excel] {res.stderr}")
else:
    print(f"[OK Excel] {res.stdout.strip()}")
