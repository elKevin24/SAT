import json

def update_pequenos():
    path = 'src/data/allTramites.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    agro_ids = [
        'SAT-GES-0012',
        'SAT-GES-0023',
        'SAT-GES-0017',
        'SAT-GES-0018',
        'SAT-GES-0019',
        'SAT-GES-0027',
        'SAT-GES-0026',
        'SAT-GES-0031'
    ]

    peq_ids = [
        'SAT-GES-0011',
        'SAT-GES-0015',
        'SAT-GES-0014',
        'SAT-GES-0024',
        'SAT-GES-0684',
        'SAT-GES-0025',
        'SAT-GES-0013',
        'SAT-GES-0016',
        'SAT-GES-0020',
        'SAT-GES-0021',
        'SAT-GES-0022',
        'SAT-GES-0028',
        'SAT-GES-0029',
        'SAT-GES-0030'
    ]

    updated_agro = 0
    updated_peq = 0

    for t in data:
        tid = t.get('id')
        tramite_name = t.get('tramite', '')
        if tid in agro_ids:
            idx = agro_ids.index(tid) + 1
            t['subcategoria'] = 'Régimen Agropecuario y Productores'
            t['nivel1_segmento'] = 'Contribuyentes'
            t['nivel2_area'] = 'Pequeños Contribuyentes'
            t['nivel3_subarea'] = 'Régimen Agropecuario y Productores'
            t['nivel4_tema'] = '—'
            t['nivel5_tramite'] = '—'
            t['tema'] = '—'
            t['subtema'] = '—'
            t['orden_n1'] = 1
            t['orden_n2'] = 2
            t['orden_n3'] = 2
            t['orden_n4'] = '—'
            t['orden_n5'] = '—'
            t['orden_contenido'] = idx
            t['migaBreadcrumb'] = f"Contribuyentes > Pequeños Contribuyentes > Régimen Agropecuario y Productores > {tramite_name}"
            updated_agro += 1
        elif tid in peq_ids:
            idx = peq_ids.index(tid) + 1
            t['subcategoria'] = 'Régimen de Pequeño Contribuyente'
            t['nivel1_segmento'] = 'Contribuyentes'
            t['nivel2_area'] = 'Pequeños Contribuyentes'
            t['nivel3_subarea'] = 'Régimen de Pequeño Contribuyente'
            t['nivel4_tema'] = '—'
            t['nivel5_tramite'] = '—'
            t['tema'] = '—'
            t['subtema'] = '—'
            t['orden_n1'] = 1
            t['orden_n2'] = 2
            t['orden_n3'] = 1
            t['orden_n4'] = '—'
            t['orden_n5'] = '—'
            t['orden_contenido'] = idx
            t['migaBreadcrumb'] = f"Contribuyentes > Pequeños Contribuyentes > Régimen de Pequeño Contribuyente > {tramite_name}"
            updated_peq += 1

    print(f"Actualizados: {updated_agro} agropecuarios, {updated_peq} pequeños contribuyentes")
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Guardado src/data/allTramites.json exitosamente")

if __name__ == '__main__':
    update_pequenos()
