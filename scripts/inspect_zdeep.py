import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

zdeep = [t for t in data if t.get('nivel3') == 'Zonas de Desarrollo Económico Especial Público (ZDEEP)']
print(f"Total ZDEEP items: {len(zdeep)}")

for t in zdeep:
    print(f"{t.get('id')} | N4: {t.get('nivel4', '—')} | {t.get('nombreActual')} | {t.get('url')}")
