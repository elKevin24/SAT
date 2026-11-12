import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

ce = [t for t in data if t.get('nivel1') == 'Operadores de Comercio Exterior']
print(f"Total Comercio Exterior: {len(ce)}")

n2_counts = {}
for t in ce:
    n2 = t.get('nivel2', '—')
    has_req = len(t.get('requisitos', [])) > 0
    if n2 not in n2_counts:
        n2_counts[n2] = {'total': 0, 'enriched': 0}
    n2_counts[n2]['total'] += 1
    if has_req:
        n2_counts[n2]['enriched'] += 1

for k, v in n2_counts.items():
    print(f"  {k}: {v['enriched']}/{v['total']} enriched ({v['total'] - v['enriched']} remaining)")
