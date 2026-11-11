import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

depositos = [t for t in data if t.get('nivel3') == 'Depósitos Aduaneros']
print(f"Total Depósitos Aduaneros: {len(depositos)}")

n4_groups = {}
for t in depositos:
    n4 = t.get('nivel4', '—')
    if n4 not in n4_groups:
        n4_groups[n4] = []
    n4_groups[n4].append(t)

for n4, items in n4_groups.items():
    print(f"\n=== Nivel 4: {n4} ({len(items)} gestiones) ===")
    for t in items:
        print(f"  {t.get('id')} | {t.get('nombreActual')} | {t.get('url')}")
