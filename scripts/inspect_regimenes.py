import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

reg = [t for t in data if t.get('nivel2') == 'Regímenes Territoriales y Zonas Especiales']
print(f"Total Regímenes Territoriales: {len(reg)}")

n3_counts = {}
for t in reg:
    n3 = t.get('nivel3', '—')
    if n3 not in n3_counts:
        n3_counts[n3] = []
    n3_counts[n3].append(t)

for n3, items in n3_counts.items():
    print(f"\n=== Nivel 3: {n3} ({len(items)} gestiones) ===")
    for t in items:
        print(f"  {t.get('id')} | N4: {t.get('nivel4', '—')} | {t.get('nombreActual')} | {t.get('url')}")
