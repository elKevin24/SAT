import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

afpa = [t for t in data if t.get('nivel2') == 'Auxiliares de la Función Pública Aduanera (AFPA)']

for t in afpa:
    print(f"{t.get('id')} | {t.get('nivel3')} | {t.get('nivel4', '—')} | {t.get('nombreActual')} | {t.get('url')}")
