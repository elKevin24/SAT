import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

oea = [t for t in data if t.get('nivel2') == 'Operador Económico Autorizado (OEA)']
for t in oea:
    print(f"{t.get('id')} | {t.get('nombreActual')} | {t.get('url')}")
