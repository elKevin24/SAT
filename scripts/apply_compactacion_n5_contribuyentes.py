"""
Script para compactar los 41 trámites de Contribuyentes que tenían N5 innecesario:
- 4 trámites de 'Asalariados en Relación de Dependencia' pasan a N3 directo (N4='—', N5='—').
- 37 trámites de los 6 grupos N4 de 'Personas Individuales con Negocio' (con <= 10 trámites)
  pasan a N4 directo (N5='—').

Conserva 100% de IDs, URLs, descripciones, bases legales y etapas ATO.
"""

import json

JSON_PATH = 'src/data/allTramites.json'

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Cargados {len(items)} trámites.")

# 1. Asalariados (4 trámites)
asal_count = 0
for it in items:
    if 'Asalariados' in (it.get('nivel3_subarea') or ''):
        asal_count += 1
        it['nivel4_tema'] = '—'
        it['nivel5_tramite'] = '—'
        it['orden_n4'] = '—'
        it['orden_n5'] = '—'
        it['migaBreadcrumb'] = f"Contribuyentes > Contribuyente General > Asalariados en Relación de Dependencia > {it['tramite']}"

print(f"1. Asalariados compactados a N3 directo: {asal_count} trámites.")

# 2. Los 6 grupos de Personas Individuales con Negocio con <= 10 trámites
N4_COMPACTAR = {
    'Atención, quejas y denuncias',
    'Consultas y verificadores',
    'Devoluciones y créditos fiscales',
    'Gestiones y consultas aduaneras',
    'Regímenes tributarios',
    'Vehículos (como propietario)'
}

pin_count = 0
for it in items:
    if it.get('nivel3_subarea') == 'Personas Individuales con Negocio':
        n4 = it.get('nivel4_tema')
        if n4 in N4_COMPACTAR:
            pin_count += 1
            it['nivel5_tramite'] = '—'
            it['orden_n5'] = '—'
            it['migaBreadcrumb'] = f"Contribuyentes > Contribuyente General > Personas Individuales con Negocio > {n4} > {it['tramite']}"

print(f"2. Personas Individuales con Negocio compactados a N4 directo: {pin_count} trámites.")
print(f"Total trámites compactados: {asal_count + pin_count}")

with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

print("allTramites.json guardado exitosamente.")
