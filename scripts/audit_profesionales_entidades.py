import json
import re

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    tramites = json.load(f)

prof = [t for t in tramites if t.get('pillar') == 'profesionales']
exen = [t for t in tramites if t.get('pillar') == 'entes_exentos']

print(f"Total Profesionales: {len(prof)}")
print(f"Total Entes Exentos: {len(exen)}")

print("\n--- 1. BUSQUEDA DE PALABRA PROHIBIDA ('canónic*') ---")
for t in prof + exen:
    for field in ['tramite', 'descripcion', 'categoria', 'subcategoria', 'tema', 'subtema']:
        val = str(t.get(field, ''))
        if 'canónic' in val.lower() or 'canonic' in val.lower():
            print(f"[ALERTA PROHIBICION] {t['id']} campo '{field}': {val}")

print("\n--- 2. PROFESIONALES: ACRÓNIMOS EN TÍTULOS ---")
acronyms = {'RTU', 'FEL', 'SAT', 'ISR', 'IVA', 'DUCA', 'BANCASAT', 'DECLARAGUATE', 'TEV', 'LET', 'CPA'}
for t in prof:
    tr = t.get('tramite', '')
    found = [w for w in re.findall(r'\b[A-Z]{2,}\b', tr) if w in acronyms]
    if found:
        print(f"[{t['id']}] ({', '.join(found)}): {tr}")

print("\n--- 3. ENTES EXENTOS: ACRÓNIMOS EN TÍTULOS ---")
exen_acronyms = {'RTU', 'FEL', 'SAT', 'ISR', 'IVA', 'DUCA', 'BANCASAT', 'DECLARAGUATE', 'CIVA', 'CEMA', 'ONG', 'OPF', 'SENABED'}
for t in exen:
    tr = t.get('tramite', '')
    found = [w for w in re.findall(r'\b[A-Z]{2,}\b', tr) if w in exen_acronyms]
    if found:
        print(f"[{t['id']}] ({', '.join(found)}): {tr}")

print("\n--- 4. CALIDAD DE CONTENIDO: CAMPOS CLAVE ---")
for pillar_name, subset in [('Profesionales', prof), ('Entes Exentos', exen)]:
    sin_desc = [t['id'] for t in subset if not t.get('descripcion') or len(t.get('descripcion', '')) < 15]
    sin_url = [t['id'] for t in subset if not t.get('url')]
    sin_ato = [t['id'] for t in subset if not t.get('etapaAto')]
    sin_tipo = [t['id'] for t in subset if not t.get('tipoInteraccion')]
    sin_base = [t['id'] for t in subset if not t.get('baseLegal')]
    print(f"{pillar_name}:")
    print(f"  Sin descripción suficiente: {len(sin_desc)} -> {sin_desc}")
    print(f"  Sin URL: {len(sin_url)} -> {sin_url}")
    print(f"  Sin Etapa ATO: {len(sin_ato)} -> {sin_ato}")
    print(f"  Sin Tipo Interacción: {len(sin_tipo)} -> {sin_tipo}")
    print(f"  Sin Base Legal: {len(sin_base)} -> {sin_base[:5]}... (total {len(sin_base)})")
