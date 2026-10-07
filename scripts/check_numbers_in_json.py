import json, re

with open('c:/Users/busqu/Documents/GitHub/SAT/src/data/allTramites.json', 'r', encoding='utf-8') as f:
    tramites = json.load(f)

print(f"Total trámites: {len(tramites)}")

# Comprobar si hay nombres con números al frente
grupos = set(t.get('grupoNombre', '') for t in tramites)
print("Grupos en allTramites.json:", grupos)

categorias = set(t.get('categoria', '') for t in tramites)
print("\nCategorías con números al inicio:")
for c in categorias:
    if re.match(r'^\d+[\.\s]', c):
        print("  -", c)

subcategorias = set(t.get('subcategoria', '') for t in tramites)
print("\nSubcategorías con números al inicio:")
for s in subcategorias:
    if re.match(r'^\d+[\.\s]', s):
        print("  -", s)
