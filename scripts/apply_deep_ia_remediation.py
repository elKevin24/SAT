import json
import os
import re

DATA_PATH = 'src/data/allTramites.json'

with open(DATA_PATH, 'r', encoding='utf-8') as f:
    tramites = json.load(f)

print(f"Cargados {len(tramites)} trámites para remediación profunda de IA.")

# ==============================================================================
# 1. PASO 1 & 6: COMPACTACIÓN DE NODOS SUB-DENSOS A LISTA DIRECTA (REGLA 3 Y 4)
# ==============================================================================
# Sin Obligaciones, Municipalidades, Auditores, Servicios Profesionales, Gestores Tributarios, OEA
compact_n2 = [
    'Sin Obligaciones',
    'Municipalidades',
    'Auditores',
    'Servicios Profesionales',
    'Gestores Tributarios',
    'Operador Económico Autorizado (OEA)'
]

for t in tramites:
    if t.get('nivel2') in compact_n2 or t.get('categoria') in compact_n2:
        t['nivel3'] = '—'
        t['nivel3_subarea'] = '—'
        t['nivel4'] = '—'
        t['nivel4_tema'] = '—'
        t['subcategoria'] = '—'

# En Maquilas (Decreto 29-89) bajo Regímenes Territoriales, nivel4 es '—'
for t in tramites:
    if t.get('nivel3') == 'Maquilas (Decreto 29-89)':
        t['nivel4'] = '—'
        t['nivel4_tema'] = '—'

print("Compactados a lista directa: Sin Obligaciones, Municipalidades, Auditores, Servicios Profesionales, Gestores Tributarios y OEA.")

# ==============================================================================
# 2. PASO 2: DESCOMPONER N4 Y PARTICIPACIÓN MODULAR DE VEHÍCULOS (80 GESTIONES)
# ==============================================================================
# N4 modulares (6 grupos de 6 a 19 items) y N5 temático por ciclo ATO
def classify_vehiculos(t):
    tr = (t.get('tramite', '') + ' ' + t.get('nombreActual', '')).lower()
    cod = t.get('codigo', '')

    # 1. Inscripción, distintivos y placas (19 items)
    if any(k in tr for k in ['inscribir', 'inscripción', 'primer certificado', 'primera matrícula']) and not any(k in tr for k in ['baja', 'inactiv', 'reactiv']):
        t['nivel4'] = 'Inscripción, distintivos y placas'
        t['nivel4_tema'] = 'Inscripción, distintivos y placas'
        t['nivel5'] = 'Inscripción y primera matrícula'
        t['nivel5_tramite'] = 'Inscripción y primera matrícula'
        t['etapaAto'] = 'empezar'
        t['etapaAtoLabel'] = 'Empezar y registrarse'
        return

    if any(k in tr for k in ['distribuidor', 'placas de distribuidor']) or cod in ['SAT-GES-0312', 'SAT-GES-0314', 'SAT-GES-0315', 'SAT-GES-0316', 'SAT-GES-0317']:
        t['nivel4'] = 'Inscripción, distintivos y placas'
        t['nivel4_tema'] = 'Inscripción, distintivos y placas'
        t['nivel5'] = 'Placas de circulación y distribuidores'
        t['nivel5_tramite'] = 'Placas de circulación y distribuidores'
        t['etapaAto'] = 'operar'
        t['etapaAtoLabel'] = 'Operación y declaraciones'
        return

    if any(k in tr for k in ['distintivos', 'tarjeta de circulación', 'placas temporales', 'cambio de placa', 'reposición de distintivos', 'reposiciones con formularios']):
        t['nivel4'] = 'Inscripción, distintivos y placas'
        t['nivel4_tema'] = 'Inscripción, distintivos y placas'
        t['nivel5'] = 'Distintivos y tarjeta de circulación'
        t['nivel5_tramite'] = 'Distintivos y tarjeta de circulación'
        t['etapaAto'] = 'operar'
        t['etapaAtoLabel'] = 'Operación y declaraciones'
        return

    # 2. Traspasos de vehículos (17 items)
    if 'traspas' in tr or cod == 'SAT-GES-0318':
        t['nivel4'] = 'Traspasos de vehículos'
        t['nivel4_tema'] = 'Traspasos de vehículos'
        if any(k in tr for k in ['especial', 'aseguradora', 'capital', 'subasta', 'leasing', 'pago de una deuda', 'sorteo', 'rifa', 'heredad', 'anulación', 'fusión', 'notario']):
            t['nivel5'] = 'Traspasos en casos especiales y notariales'
            t['nivel5_tramite'] = 'Traspasos en casos especiales y notariales'
        else:
            t['nivel5'] = 'Traspaso electrónico TEV y ordinario'
            t['nivel5_tramite'] = 'Traspaso electrónico TEV y ordinario'
        t['etapaAto'] = 'operar'
        t['etapaAtoLabel'] = 'Operación y declaraciones'
        return

    # 3. Impuesto de circulación (ISCV) y valores (11 items)
    if any(k in tr for k in ['iscv', 'impuesto de circulación', 'tabla de valores', 'iprima']) or cod in ['SAT-GES-0313', 'SAT-GES-0377', 'SAT-GES-0609']:
        t['nivel4'] = 'Impuesto de circulación (ISCV) y valores'
        t['nivel4_tema'] = 'Impuesto de circulación (ISCV) y valores'
        if any(k in tr for k in ['devoluci', 'recuperar']):
            t['nivel5'] = 'Devoluciones y compensaciones de ISCV'
            t['nivel5_tramite'] = 'Devoluciones y compensaciones de ISCV'
            t['etapaAto'] = 'modificar_cerrar'
            t['etapaAtoLabel'] = 'Modificaciones y cierre'
        else:
            t['nivel5'] = 'Pago del impuesto ISCV y tablas de valores'
            t['nivel5_tramite'] = 'Pago del impuesto ISCV y tablas de valores'
            t['etapaAto'] = 'operar'
            t['etapaAtoLabel'] = 'Operación y declaraciones'
        return

    # 4. Bajas, inactivación y reactivación (11 items)
    if any(k in tr for k in ['baja', 'inactiv', 'activar', 'reactivar']):
        t['nivel4'] = 'Bajas, inactivación y reactivación'
        t['nivel4_tema'] = 'Bajas, inactivación y reactivación'
        if any(k in tr for k in ['reactiv', 'activar']):
            t['nivel5'] = 'Reactivación y activación de vehículos'
            t['nivel5_tramite'] = 'Reactivación y activación de vehículos'
        else:
            t['nivel5'] = 'Inactivación temporal y baja definitiva'
            t['nivel5_tramite'] = 'Inactivación temporal y baja definitiva'
        t['etapaAto'] = 'modificar_cerrar'
        t['etapaAtoLabel'] = 'Modificaciones y cierre'
        return

    # 5. Modificaciones y rectificaciones (6 items)
    if any(k in tr for k in ['modificaci', 'rectificaci', 'transformaci', 'cambio de motor', 'cambiar características', 'corregir datos', 'corregir el nit', 'marca de vehículo', 'código de fabricante']):
        t['nivel4'] = 'Modificaciones y rectificaciones'
        t['nivel4_tema'] = 'Modificaciones y rectificaciones'
        t['nivel5'] = 'Rectificación de datos y características'
        t['nivel5_tramite'] = 'Rectificación de datos y características'
        t['etapaAto'] = 'modificar_cerrar'
        t['etapaAtoLabel'] = 'Modificaciones y cierre'
        return

    # 6. Autorizaciones, consultas y requisitos (16 items)
    t['nivel4'] = 'Autorizaciones, consultas y requisitos'
    t['nivel4_tema'] = 'Autorizaciones, consultas y requisitos'
    if any(k in tr for k in ['consultar', 'multas', 'expertaje', 'verificar']):
        t['nivel5'] = 'Consultas de vehículos, multas y expertaje'
        t['nivel5_tramite'] = 'Consultas de vehículos, multas y expertaje'
        t['etapaAto'] = 'consultar'
        t['etapaAtoLabel'] = 'Consultas y herramientas'
    else:
        t['nivel5'] = 'Autorizaciones y acreditación de representantes'
        t['nivel5_tramite'] = 'Autorizaciones y acreditación de representantes'
        t['etapaAto'] = 'empezar'
        t['etapaAtoLabel'] = 'Empezar y registrarse'

for t in tramites:
    if t.get('pillar') == 'contribuyentes' and t.get('nivel2') == 'Contribuyente General' and t.get('nivel3') == 'Vehículos (como propietario)':
        classify_vehiculos(t)

print("Vehículos descompuesto modularmente en 6 N4 y subtemas N5 por ciclo ATO.")

# ==============================================================================
# 3. PASO 3: RECLASIFICAR TRÁMITES FLOTANTES EN CONTRIBUYENTE GENERAL
# ==============================================================================
for t in tramites:
    cod = t.get('codigo', '')
    if t.get('pillar') == 'contribuyentes' and t.get('nivel2') == 'Contribuyente General':
        n3 = t.get('nivel3', '')
        
        # Facturación
        if cod == 'SAT-GES-0320':
            t['nivel4'] = 'Documentos tributarios y libros'
            t['nivel4_tema'] = 'Documentos tributarios y libros'
            t['nivel5'] = 'Libro Electrónico Tributario (LET)'
            t['nivel5_tramite'] = 'Libro Electrónico Tributario (LET)'
            
        # Declaraciones y Solvencias
        elif cod == 'SAT-GES-0340':
            t['nivel4'] = 'Solvencia fiscal'
            t['nivel4_tema'] = 'Solvencia fiscal'
            t['nivel5'] = 'Consulta de morosidad'
            t['nivel5_tramite'] = 'Consulta de morosidad'
            
        # Devoluciones flotantes
        elif n3 == 'Devoluciones y créditos fiscales' and t.get('nivel4') == '—':
            t['nivel4'] = 'Devoluciones de pagos indebidos o en exceso'
            t['nivel4_tema'] = 'Devoluciones de pagos indebidos o en exceso'
            t['nivel5'] = 'Pagos indebidos y tributos en exceso'
            t['nivel5_tramite'] = 'Pagos indebidos y tributos en exceso'
            
        # Regímenes tributarios
        elif cod == 'SAT-GES-0048':
            t['nivel4'] = 'Regímenes de afiliación tributaria'
            t['nivel4_tema'] = 'Regímenes de afiliación tributaria'
            t['nivel5'] = 'Cambio de régimen'
            t['nivel5_tramite'] = 'Cambio de régimen'
            
        # Servicios al contribuyente flotantes
        elif n3 == 'Servicios y gestiones al contribuyente' and t.get('nivel4') == '—':
            tr_low = t.get('tramite', '').lower()
            if any(k in tr_low for k in ['denuncia', 'queja', 'chatear']):
                t['nivel4'] = 'Atención ciudadana, quejas y denuncias'
            elif any(k in tr_low for k in ['agencia virtual', 'máquina registradora', 'cita', 'actualizar tus datos', 'rtu digital']):
                t['nivel4'] = 'Agencia Virtual y atención al contribuyente'
            elif any(k in tr_low for k in ['consultar', 'verificar']):
                t['nivel4'] = 'Consultas y verificadores integrados'
            elif any(k in tr_low for k in ['asalariado', 'planilla']):
                t['nivel4'] = 'Servicios para trabajadores asalariados'
            else:
                t['nivel4'] = 'Orientación legal y criterios tributarios'
            t['nivel4_tema'] = t['nivel4']
            t['nivel5'] = 'Gestiones operativas'
            t['nivel5_tramite'] = 'Gestiones operativas'
            
        # Cultura tributaria flotantes
        elif n3 == 'Cultura tributaria y capacitación' and t.get('nivel4') == '—':
            t['nivel4'] = 'Biblioteca y recursos de cultura tributaria'
            t['nivel4_tema'] = 'Biblioteca y recursos de cultura tributaria'
            t['nivel5'] = 'Materiales y recursos educativos'
            t['nivel5_tramite'] = 'Materiales y recursos educativos'

print("Trámites flotantes reclasificados en sus temas N4 correspondientes.")

# ==============================================================================
# 4. PASO 7: RESOLVER TÍTULOS DUPLICADOS EN AFPA > DEPÓSITOS ADUANEROS
# ==============================================================================
for t in tramites:
    if t.get('nivel3') == 'Depósitos Aduaneros':
        n4 = t.get('nivel4', '')
        tr = t.get('tramite', '')
        # Si tiene el sufijo genérico de AFPA, reemplazarlo por el específico de su N4
        if '(para Auxiliares de la Función Pública Aduanera (AFPA))' in tr:
            if 'Depósitos Aduaneros Temporales' in n4 or 'DAT' in n4:
                t['tramite'] = tr.replace('(para Auxiliares de la Función Pública Aduanera (AFPA))', '(para Depósitos Aduaneros Temporales - DAT)')
                t['nombreActual'] = t['tramite']
            elif 'Almacenes Generales de Depósito' in n4 or 'AGD' in n4:
                t['tramite'] = tr.replace('(para Auxiliares de la Función Pública Aduanera (AFPA))', '(para Almacenes Generales de Depósito - AGD)')
                t['nombreActual'] = t['tramite']
        elif tr == 'Recepción de seguro de caución y pólizas de garantía operativa':
            if 'Temporales' in n4 or 'DAT' in n4:
                t['tramite'] = 'Recepción de seguro de caución y pólizas de garantía (para Depósitos Temporales - DAT)'
            else:
                t['tramite'] = 'Recepción de seguro de caución y pólizas de garantía (para Almacenes Generales - AGD)'
            t['nombreActual'] = t['tramite']
        elif tr == 'Auxiliares de la función pública aduanera (Carné, componente ActiveX PKI/DUA)':
            if 'Temporales' in n4 or 'DAT' in n4:
                t['tramite'] = 'Carné de auxiliar y componente ActiveX PKI/DUA (para Depósitos Temporales - DAT)'
            else:
                t['tramite'] = 'Carné de auxiliar y componente ActiveX PKI/DUA (para Almacenes Generales - AGD)'
            t['nombreActual'] = t['tramite']
        elif tr == 'Declaración de mercancías (DUCA y aduana sin papeles)':
            if 'Temporales' in n4 or 'DAT' in n4:
                t['tramite'] = 'Declaración de mercancías DUCA y aduana sin papeles (en Depósitos Temporales - DAT)'
            else:
                t['tramite'] = 'Declaración de mercancías DUCA y aduana sin papeles (en Almacenes Generales - AGD)'
            t['nombreActual'] = t['tramite']

print("Títulos duplicados en AFPA > Depósitos Aduaneros resueltos y contextualizados.")

# ==============================================================================
# 5. PASO 4 & 5: REORDENACIÓN ATO DETERMINISTA EN TODOS LOS CONTENEDORES
# ==============================================================================
ATO_WEIGHT = {
    'empezar': 1,
    'operar': 2,
    'consultar': 3,
    'modificar_cerrar': 4,
    'normativa': 5,
}

folders = {}
for t in tramites:
    k = (
        t.get('pillar', ''),
        t.get('nivel2', ''),
        t.get('nivel3', '—'),
        t.get('nivel4', '—')
    )
    if k not in folders:
        folders[k] = []
    folders[k].append(t)

for k, items in folders.items():
    items.sort(key=lambda x: (
        ATO_WEIGHT.get(x.get('etapaAto', 'empezar'), 1),
        x.get('codigo', '')
    ))
    for idx, item in enumerate(items, start=1):
        item['orden_contenido'] = idx

# Orden global físico canónico
tramites.sort(key=lambda x: (
    x.get('orden_n1', 1),
    x.get('nivel2', ''),
    x.get('nivel3', ''),
    x.get('nivel4', ''),
    x.get('orden_contenido', 1)
))

# Sincronizar espejos
for t in tramites:
    t['nivel1_segmento'] = t['nivel1']
    t['nivel2_area'] = t['nivel2']
    t['nivel3_subarea'] = t['nivel3']
    t['nivel4_tema'] = t['nivel4']
    t['nivel5_tramite'] = t.get('nivel5', '—')
    t['subcategoria'] = t['nivel3'] if t['nivel3'] != '—' else '—'
    
    miga_parts = [t['nivel1'], t['nivel2']]
    if t['nivel3'] and t['nivel3'] != '—':
        miga_parts.append(t['nivel3'])
    if t['nivel4'] and t['nivel4'] != '—':
        miga_parts.append(t['nivel4'])
    miga_parts.append(t.get('tramite', ''))
    t['migaBreadcrumb'] = " > ".join(miga_parts)

with open(DATA_PATH, 'w', encoding='utf-8') as f:
    json.dump(tramites, f, ensure_ascii=False, indent=2)

print("allTramites.json actualizado con la remediación profunda.")
