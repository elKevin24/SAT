import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

norm = [t for t in data if t.get('nivel2') == 'Normativa y Operaciones Aduaneras Generales']
print(f"Total Normativa y Operaciones Aduaneras Generales: {len(norm)}")

n3_counts = {}
for t in norm:
    n3 = t.get('nivel3', '—')
    if n3 not in n3_counts:
        n3_counts[n3] = []
    n3_counts[n3].append(t)

for n3, items in n3_counts.items():
    print(f"\n=== Nivel 3: {n3} ({len(items)} gestiones) ===")
    for t in items[:15]:
        print(f"  {t.get('id')} | N4: {t.get('nivel4', '—')} | {t.get('nombreActual')} | {t.get('url')}")
    if len(items) > 15:
        print(f"  ... and {len(items) - 15} more")
