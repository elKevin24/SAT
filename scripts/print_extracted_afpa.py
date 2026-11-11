import json

with open('scripts/extracted_afpa_services.json', 'r', encoding='utf-8') as f:
    services = json.load(f)

for slug, data in services.items():
    print(f"\n==================== {slug} ====================")
    print(f"Title: {data.get('title')}")
    print(f"Headings: {data.get('headings')[:6]}")
    print("Content preview:")
    for p in data.get('content_sample', [])[:6]:
        print(f"  - {p}")
