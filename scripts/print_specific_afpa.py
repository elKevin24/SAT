import json

with open('scripts/extracted_afpa_services.json', 'r', encoding='utf-8') as f:
    services = json.load(f)

for slug in ['recepcion-de-seguro-de-caucion-importacion-y-admision-temporal', 'culminacion-de-admision-temporal-de-equipo-de-carga', 'devolucion-de-impuestos-de-admision-temporal-de-equipo-de-carga-atc', 'autorizacion-de-cartas-de-ingreso-a-zona-primaria']:
    print(f"\n==================== {slug} ====================")
    for p in services[slug].get('content_sample', []):
        print(f"  * {p}")
