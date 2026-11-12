import json
import re

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for t in data:
    tid = t.get('id')
    name = t.get('nombreActual', '')
    url = t.get('url', '')
    if 'alza' in name.lower() or 'alza' in url.lower() or tid in ['SAT-GES-0383', 'SAT-GES-0384', 'SAT-GES-0385']:
        print(f"ID: {tid} | Codigo: {t.get('codigo')} | Nombre: {name} | URL: {url} | Slug: {t.get('slug', '—')}")
