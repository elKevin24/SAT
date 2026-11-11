import json
with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

depositos = [t for t in data if t.get('nivel3') == 'Depósitos Aduaneros']
for t in depositos:
    if len(t.get('requisitos', [])) == 0:
        print(f"Missing: {t.get('id')} | {t.get('nombreActual')} | N4: {t.get('nivel4')}")
