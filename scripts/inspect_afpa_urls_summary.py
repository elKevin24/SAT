import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

afpa = [t for t in data if t.get('nivel2') == 'Auxiliares de la Función Pública Aduanera (AFPA)']

urls = {}
for t in afpa:
    u = t.get('url', '')
    base = u.split('#')[0]
    urls[base] = urls.get(base, 0) + 1

print(f"Total AFPA records: {len(afpa)}")
print(f"Unique base URLs: {len(urls)}")
for u, c in sorted(urls.items(), key=lambda x: -x[1]):
    print(f"  {c:2d} gestiones -> {u}")
