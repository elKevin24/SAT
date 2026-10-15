import json

ALL_TRAMITES_PATH = 'src/data/allTramites.json'

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    master = json.load(f)

for item in master:
    text = f"{item.get('tramite', '')} {item.get('descripcion', '')} {item.get('categoria', '')} {item.get('subcategoria', '')} {item.get('tema', '')}".lower()
    fam_ids = []
    fam_labels = []
    if any(k in text for k in ['fel', 'factur', 'dte']):
        fam_ids.append('fel')
        fam_labels.append('FAM-01 Factura Electrónica en Línea (FEL)')
    if any(k in text for k in ['vehiculo', 'vehículo', 'placa', 'iscv', 'traspaso', 'iprima', 'calcoman']):
        fam_ids.append('vehiculos')
        fam_labels.append('FAM-02 Registro Fiscal de Vehículos (RFV)')
    if any(k in text for k in ['rtu', 'nit', 'inscripcion', 'inscripción', 'tributario unificado']):
        fam_ids.append('rtu-digital')
        fam_labels.append('FAM-03 Registro Tributario Unificado (RTU) Digital')
    if any(k in text for k in ['duca', 'dua', 'aduanera', 'despacho', 'arancel', 'embarque']):
        fam_ids.append('ducas')
        fam_labels.append('FAM-04 Declaraciones Aduaneras (DUCAs)')
    if any(k in text for k in ['solvencia', 'convenio']):
        fam_ids.append('solvencia-fiscal')
        fam_labels.append('FAM-05 Solvencias y Convenios de Pago')
    if any(k in text for k in ['29-89', 'maquila', 'perfeccionamiento']):
        fam_ids.append('maquilas-29-89')
        fam_labels.append('FAM-06 Regímenes Especiales y Maquilas (Dto. 29-89)')
    if 'zdeep' in text:
        fam_ids.append('zdeep')
        fam_labels.append('FAM-07 Zonas de Desarrollo Económico Especial Público (ZDEEP)')
    if any(k in text for k in ['afpa', 'auxiliar', 'agente aduanero', 'apoderado', 'carné', 'carne', 'courier', 'transportista aduanero', 'depósito aduanero']):
        fam_ids.append('afpa')
        fam_labels.append('FAM-08 Auxiliares de la Función Pública Aduanera (AFPA)')
    if 'agencia virtual' in text:
        fam_ids.append('agencia-virtual')
        fam_labels.append('FAM-09 Agencia Virtual y Servicios Remotos')
    if any(k in text for k in ['exent', 'franquicia', 'diplomatic', 'civa']):
        fam_ids.append('exenciones')
        fam_labels.append('FAM-10 Franquicias y Exenciones Tributarias')

    item['familias_ids'] = fam_ids
    item['familiaTematica'] = "; ".join(fam_labels) if fam_labels else "Normativa y Gestiones Generales"

with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(master, f, ensure_ascii=False, indent=2)

print(f"allTramites.json enriquecido con familias_ids y familiaTematica para los {len(master)} registros.")
