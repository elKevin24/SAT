import json

with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    if item.get('id') == 'SAT-GES-0452':
        item['nombreActual'] = "Consultar rampa de inspección, revisores y retenciones aduaneras"
        item['descripcion'] = "Consulta en línea la asignación de andenes, el inspector aduanero y las posibles medidas de retención aplicadas a cargamentos en depósitos aduaneros. Facilita la coordinación de rampas y el flujo ágil de mercancías dentro del recinto fiscal."
        item['requisitos'] = [
            "Número de Declaración Única Centroamericana (DUCA) o número de contenedor.",
            "Acceso a internet para consultar el portal de Aduanas de la SAT."
        ]
        item['documentos'] = [
            "Declaración de mercancías DUCA pagada y validada en el sistema.",
            "Acta de recepción DAT o documento de transporte asociado."
        ]
        item['pasos'] = [
            "Ingresa al módulo de consultas aduaneras en el Portal SAT.",
            "Introduce el número de la declaración aduanera o el número de contenedor de 11 dígitos.",
            "Verifica la rampa asignada, el nombre del técnico de aduanas y si existe orden de retención preventiva.",
            "Coordina el posicionamiento de la unidad en la rampa indicada para la inspección física."
        ]
        item['resultadoObtenido'] = "Pantalla oficial con el andén de rampa asignado y estatus de reconocimiento aduanero."
        item['tiempoEstimado'] = "Inmediato (consulta pública)"
        item['costo'] = "Gratuito (Q0.00)"
        item['advertencia'] = "Si la mercancía presenta orden de retención emitida por una unidad de fiscalización, no podrá ser posicionada para levante hasta que la medida sea levantada formalmente."
        item['normativa'] = "RECAUCA Artículos 338 y 339; Procedimiento PR-IAD/DNO-DE-01."
        print("Updated SAT-GES-0452 successfully!")
        break

with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
