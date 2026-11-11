import json

with open('scripts/extracted_afpa_services.json', 'r', encoding='utf-8') as f:
    services = json.load(f)

for slug in ['marchamo-electronico', 'sanciones-aplicables-a-la-importacion-exportacion-o-transito']:
    print(f"\n==================== {slug} ====================")
    for p in services[slug].get('content_sample', []):
        print(f"  * {p}")
