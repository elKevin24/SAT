import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

afpa = [t for t in data if t.get('nivel2') == 'Auxiliares de la Función Pública Aduanera (AFPA)']

print(f"Total AFPA items: {len(afpa)}")

for n3 in ['Agentes Aduaneros', 'Apoderados Especiales Aduaneros', 'Empresas de Entrega Rápida o Courier', 'Transportistas Aduaneros', 'Depósitos Aduaneros']:
    sub = [t for t in afpa if t.get('nivel3') == n3]
    print(f"\n=== {n3} ({len(sub)} gestiones) ===")
    for t in sub:
        req_count = len(t.get('requisitos', []))
        pasos_count = len(t.get('pasos', []))
        print(f"{t.get('id')} | N4: {t.get('nivel4', '—')} | {t.get('nombreActual')} | Req: {req_count} | Pasos: {pasos_count} | {t.get('url')}")
