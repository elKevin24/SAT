"""
Script de Normalización Canónica de Identificadores Institucionales (SAT-GES-####)
Portal SAT Guatemala
Regla AGENTS.md:
- Código Institucional Inmutable: Usar siempre SAT-GES-#### como identificador canónico universal
  (agnóstico al árbol, segmento y nombre). Los IDs de hojas se preservan como codigos_legacy.

Acciones:
1. Elimina al 100% los sufijos (-B, -AGD, -DAT, -ZDEEP-USR, -ZDEEP-ADM).
2. Los 38 trámites primarios recuperan su código base 1..683 (ej. SAT-GES-0441-AGD -> SAT-GES-0441).
3. Los 32 trámites duplicados/polihierárquicos reciben identificadores canónicos consecutivos
   en el rango SAT-GES-0684 a SAT-GES-0715.
4. Preserva el 100% de los códigos anteriores en el arreglo codigos_legacy.
5. Sincroniza allTramites.json y catalogoContenidosUnicos.json.
"""

import json
from pathlib import Path

ALL_TRAMITES_PATH = Path('src/data/allTramites.json')
CATALOGO_PATH = Path('src/data/catalogoContenidosUnicos.json')

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    all_tramites = json.load(f)

seen_codigos = set()
remapping = {}
next_free_id = 684

normalized_tramites = []

for item in all_tramites:
    t = dict(item)
    old_id = t['id']
    base_codigo = t.get('codigo', old_id[:12])
    is_suffixed = not (old_id.startswith('SAT-GES-') and old_id[8:].isdigit())

    if is_suffixed:
        if base_codigo not in seen_codigos:
            # Es la primera aparición (estaba libre el código base)
            seen_codigos.add(base_codigo)
            new_id = base_codigo
            legacy = [old_id]
        else:
            # Es aparición duplicada / polihierárquica
            new_id = f"SAT-GES-{next_free_id:04d}"
            next_free_id += 1
            legacy = [old_id, base_codigo]

        remapping[old_id] = (new_id, legacy)
        t['id'] = new_id
        t['codigo'] = new_id
        t['codigos_legacy'] = legacy
    else:
        seen_codigos.add(base_codigo)
        if 'codigos_legacy' not in t or not t['codigos_legacy']:
            t['codigos_legacy'] = []

    normalized_tramites.append(t)

print(f"Total registros procesados: {len(normalized_tramites)}")
print(f"Total IDs renumerados/limpiados: {len(remapping)}")
print(f"Rango final de IDs: SAT-GES-0001 a SAT-GES-{next_free_id-1:04d}")

# Verificaciones de integridad
new_ids = [t['id'] for t in normalized_tramites]
assert len(new_ids) == 715, "El total debe ser exactamente 715"
assert len(set(new_ids)) == 715, "Todos los 715 IDs deben ser únicos"
assert all(i.startswith('SAT-GES-') and i[8:].isdigit() and len(i) == 12 for i in new_ids), "Todos los IDs deben tener formato SAT-GES-####"
assert set(int(i[8:]) for i in new_ids) == set(range(1, 716)), "El rango debe ser exactamente 1 a 715 continuo sin huecos"

# Guardar allTramites.json
with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(normalized_tramites, f, ensure_ascii=False, indent=2)
print("allTramites.json actualizado exitosamente.")

# Sincronizar catalogoContenidosUnicos.json si existe
if CATALOGO_PATH.exists():
    with open(CATALOGO_PATH, 'r', encoding='utf-8') as f:
        catalogo = json.load(f)

    updated_cat = []
    for c_item in catalogo:
        ci = dict(c_item)
        raw_id = ci.get('id', '')
        # Si el ID tiene prefijo cnt-
        if raw_id.startswith('cnt-'):
            sub_id = raw_id[4:]
            if sub_id in remapping:
                new_sub_id, leg = remapping[sub_id]
                ci['id'] = f"cnt-{new_sub_id}"
                ci['codigo'] = new_sub_id
                ci['codigos_legacy'] = leg
        elif raw_id in remapping:
            new_sub_id, leg = remapping[raw_id]
            ci['id'] = new_sub_id
            ci['codigo'] = new_sub_id
            ci['codigos_legacy'] = leg
        updated_cat.append(ci)

    with open(CATALOGO_PATH, 'w', encoding='utf-8') as f:
        json.dump(updated_cat, f, ensure_ascii=False, indent=2)
    print("catalogoContenidosUnicos.json actualizado exitosamente.")

# Guardar registro de trazabilidad en scratch/remapping_ids.json
out_log = {
    "total_normalizados": len(remapping),
    "rango": "SAT-GES-0001 a SAT-GES-0715",
    "mapeo": {k: {"nuevo_id": v[0], "codigos_legacy": v[1]} for k, v in remapping.items()}
}
with open('scripts/remapping_ids.json', 'w', encoding='utf-8') as f:
    json.dump(out_log, f, ensure_ascii=False, indent=2)
print("Registro de trazabilidad guardado en scripts/remapping_ids.json.")
