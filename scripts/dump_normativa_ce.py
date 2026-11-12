import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

norm = [t for t in data if t.get('nivel2') == 'Normativa y Operaciones Aduaneras Generales']
print(f"Total Normativa items: {len(norm)}")

for t in norm:
    print(f"{t.get('id')} | N3: {t.get('nivel3')} | N4: {t.get('nivel4', '—')} | {t.get('nombreActual')} | {t.get('url')}")
