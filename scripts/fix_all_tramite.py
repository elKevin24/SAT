import json
import re

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

count = 0
for t in data:
    # check all string fields
    for k, v in t.items():
        if isinstance(v, str):
            if re.search(r'\btr[áa]mites?\b', v, re.IGNORECASE):
                print(f"Fixing in {t.get('id')} [{k}]: {v[:80]}")
                v_new = re.sub(r'\btr[áa]mites\b', 'gestiones', v, flags=re.IGNORECASE)
                v_new = re.sub(r'\btr[áa]mite\b', 'gestión', v_new, flags=re.IGNORECASE)
                t[k] = v_new
                count += 1
        elif isinstance(v, list):
            new_list = []
            for item in v:
                if isinstance(item, str):
                    if re.search(r'\btr[áa]mites?\b', item, re.IGNORECASE):
                        print(f"Fixing in list {t.get('id')} [{k}]: {item[:80]}")
                        item = re.sub(r'\btr[áa]mites\b', 'gestiones', item, flags=re.IGNORECASE)
                        item = re.sub(r'\btr[áa]mite\b', 'gestión', item, flags=re.IGNORECASE)
                        count += 1
                    new_list.append(item)
                else:
                    new_list.append(item)
            t[k] = new_list

print(f"Total fixes applied: {count}")

with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
