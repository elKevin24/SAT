import json
from assign_base_legal import get_base_legal

# 1. Actualizar src/data/allTramites.json con baseLegal
all_t = json.load(open('src/data/allTramites.json', encoding='utf-8'))
for item in all_t:
    item['baseLegal'] = get_base_legal(item)

with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
    json.dump(all_t, f, ensure_ascii=False, indent=2)

print(f"Éxito: src/data/allTramites.json actualizado con baseLegal para los {len(all_t)} trámites.")
