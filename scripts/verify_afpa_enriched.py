import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

afpa = [t for t in data if t.get('nivel2') == 'Auxiliares de la Función Pública Aduanera (AFPA)']
print(f"Total AFPA items: {len(afpa)}")

missing = []
for t in afpa:
    if len(t.get('requisitos', [])) == 0 or len(t.get('pasos', [])) == 0:
        missing.append(t)

print(f"Missing requirements or steps in AFPA: {len(missing)}")
if missing:
    for m in missing:
        print(f"  - {m.get('id')} | {m.get('nombreActual')}")
else:
    print("ALL 76 AFPA GESTIONES ENRICHED SUCCESSFULLY!")
