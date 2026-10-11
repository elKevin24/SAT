import json

def run_migration():
    all_tramites_path = 'src/data/allTramites.json'
    catalogo_path = 'src/data/catalogoContenidosUnicos.json'

    with open(all_tramites_path, 'r', encoding='utf-8') as f:
        tramites = json.load(f)

    print(f"[allTramites] Total inicial: {len(tramites)}")

    # 1. Eliminar duplicado espejo de profesionales-22 (SAT-GES-0366 ya existe en entes_exentos-58)
    tramites = [t for t in tramites if t.get('id') != 'profesionales-22']
    print(f"[allTramites] Tras depurar profesionales-22: {len(tramites)}")

    # 2. Asignar IDs canónicos inmutables SAT-GES-#### y eliminar residuos legacy
    id_mapping = {'profesionales-22': 'SAT-GES-0366'}
    used_ids = set()

    for t in tramites:
        cod = t.get('codigo') or 'SAT-GES-0000'
        old_id = t.get('id', '')
        act = (t.get('actorEspecifico') or '').lower()

        if old_id.endswith('-agd') or 'almacenadoras' in act:
            new_id = f'{cod}-AGD'
        elif old_id.endswith('-dat') or 'depósitos aduaneros temporales' in act or 'temporales (dat)' in act:
            new_id = f'{cod}-DAT'
        elif 'zdeep-usr' in old_id or 'usuarias calificadas' in act:
            new_id = f'{cod}-ZDEEP-USR'
        elif 'zdeep-adm' in old_id or 'administradoras zdeep' in act:
            new_id = f'{cod}-ZDEEP-ADM'
        elif cod not in used_ids:
            new_id = cod
        else:
            suffix = 'B'
            cand = f'{cod}-{suffix}'
            while cand in used_ids:
                suffix = chr(ord(suffix) + 1)
                cand = f'{cod}-{suffix}'
            new_id = cand

        used_ids.add(new_id)
        id_mapping[old_id] = new_id
        t['id'] = new_id

        # Eliminar campos legacy si existen
        if 'codigos_legacy' in t:
            del t['codigos_legacy']
        if 'idOriginal' in t:
            del t['idOriginal']

    with open(all_tramites_path, 'w', encoding='utf-8') as f:
        json.dump(tramites, f, ensure_ascii=False, indent=2)
    print(f"[allTramites] Guardado exitosamente. Total registros: {len(tramites)}")

    # 3. Actualizar catalogoContenidosUnicos.json
    with open(catalogo_path, 'r', encoding='utf-8') as f:
        catalogo = json.load(f)

    print(f"[catalogo] Total inicial: {len(catalogo)}")

    for c in catalogo:
        cod = c.get('codigo')
        c['id'] = f'cnt-{cod}'
        c['idOriginal'] = cod

        # Mapear tramiteIds a canónicos
        new_tids = []
        for tid in c.get('tramiteIds', []):
            nid = id_mapping.get(tid, tid)
            if nid not in new_tids:
                new_tids.append(nid)
        c['tramiteIds'] = new_tids

        # Mapear ubicaciones a canónicos y deduplicar
        new_ubics = []
        seen_ubics = set()
        for u in c.get('ubicaciones', []):
            nid = id_mapping.get(u.get('tramiteId'), u.get('tramiteId'))
            key = (nid, u.get('segmentoId'))
            if key not in seen_ubics:
                seen_ubics.add(key)
                u['tramiteId'] = nid
                new_ubics.append(u)
        c['ubicaciones'] = new_ubics
        c['totalAudiencias'] = len(new_tids)
        c['esTransversal'] = len(new_tids) > 1

    with open(catalogo_path, 'w', encoding='utf-8') as f:
        json.dump(catalogo, f, ensure_ascii=False, indent=2)
    print(f"[catalogo] Guardado exitosamente. Total registros: {len(catalogo)}")

if __name__ == '__main__':
    run_migration()
