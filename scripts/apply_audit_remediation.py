import json
import os
import re

DATA_PATH = 'src/data/allTramites.json'

with open(DATA_PATH, 'r', encoding='utf-8') as f:
    tramites = json.load(f)

print(f"Cargados {len(tramites)} trámites para remediación de auditoría.")

# ==============================================================================
# 1. HALLAZGO 2: CORRECCIÓN DE REGISTROS DESALINEADOS Y PASARELAS
# ==============================================================================
for t in tramites:
    cod = t.get('codigo')
    if cod == 'SAT-GES-0161':
        # Proyección educativa -> Cultura tributaria y capacitación
        t['nivel2_area'] = 'Contribuyente General'
        t['nivel3_subarea'] = 'Cultura tributaria y capacitación'
        t['nivel4_tema'] = 'Programas de cultura tributaria'
        t['nivel5_tramite'] = 'Proyección educativa'
        t['migaBreadcrumb'] = 'Contribuyentes > Contribuyente General > Cultura tributaria y capacitación > Programas de cultura tributaria > Proyección educativa'
        t['categoria'] = 'Contribuyente General'
        t['subcategoria'] = 'Cultura tributaria y capacitación'
        print("SAT-GES-0161 corregido a Cultura tributaria y capacitación.")

    elif cod == 'SAT-GES-0318':
        # Traspaso de vehículos por notario -> Vehículos (como propietario)
        t['nivel2_area'] = 'Contribuyente General'
        t['nivel3_subarea'] = 'Vehículos (como propietario)'
        t['nivel4_tema'] = 'Traspaso de vehículos'
        t['nivel5_tramite'] = 'Traspaso de vehículos por notario (vista del comprador/vendedor)'
        t['migaBreadcrumb'] = 'Contribuyentes > Contribuyente General > Vehículos (como propietario) > Traspaso de vehículos > Traspaso de vehículos por notario (vista del comprador/vendedor)'
        t['categoria'] = 'Contribuyente General'
        t['subcategoria'] = 'Vehículos (como propietario)'
        print("SAT-GES-0318 corregido a Vehículos (como propietario).")

    # Corrección de etapa ATO de SAT-GES-0011 (Solicitar tu NIT en línea -> empezar)
    elif cod == 'SAT-GES-0011':
        t['etapaAto'] = 'empezar'
        t['etapaAtoLabel'] = 'Empezar y registrarse'
        print("SAT-GES-0011 corregido a etapaAto 'empezar'.")

# ==============================================================================
# 2. HALLAZGO 3: CONSOLIDACIÓN DE MILLER EN CONTRIBUYENTE GENERAL (N3 Y N4)
# ==============================================================================

def map_n3_contribuyente_general(t):
    n3 = t.get('nivel3_subarea', '')
    n4 = t.get('nivel4_tema', '')

    if n3 == 'Personas Individuales con Negocio':
        n3 = n4

    if n3 in ['Inscripción y actualización en el RTU', 'RTU Digital y Agencia Virtual']:
        return 'Inscripción y actualización en el RTU'
    if n3 in ['Facturación electrónica y documentos tributarios', 'Facturación Electrónica']:
        return 'Facturación electrónica y documentos tributarios'
    if n3 in ['Declaraciones, pagos y solvencias', 'Solvencia y Convenios']:
        return 'Declaraciones, pagos y solvencias'
    if n3 in ['Devoluciones y créditos fiscales']:
        return 'Devoluciones y créditos fiscales'
    if n3 in ['Regímenes tributarios']:
        return 'Regímenes tributarios'
    if n3 in ['Vehículos (como propietario)', 'Propietarios y Distribuidores de Vehículos', 'Notarios'] or t.get('codigo') == 'SAT-GES-0318':
        return 'Vehículos (como propietario)'
    if n3 in ['Cultura tributaria y capacitación', 'Gestiones y consultas aduaneras'] or t.get('codigo') == 'SAT-GES-0161':
        return 'Cultura tributaria y capacitación'
    if n3 in ['Otros servicios al contribuyente', 'Servicios al Contribuyente', 'Consultas y verificadores', 'Atención, quejas y denuncias', 'Asalariados en Relación de Dependencia']:
        return 'Servicios y gestiones al contribuyente'

    return n3

def map_n4_vehiculos(t):
    n4 = t.get('nivel4_tema', '')
    cod = t.get('codigo', '')

    if n4 in ['Inscripción de vehículos', 'Título y tarjeta de circulación', 'Placas de circulación'] or cod in ['SAT-GES-0314', 'SAT-GES-0315', 'SAT-GES-0316', 'SAT-GES-0317']:
        return 'Inscripción, distintivos y placas'
    if n4 in ['Traspaso de vehículos', 'Traspasos en casos especiales'] or cod == 'SAT-GES-0318':
        return 'Traspasos de vehículos'
    if n4 in ['Impuesto de circulación y tablas de valores', 'Devoluciones de impuestos de vehículos'] or cod in ['SAT-GES-0312', 'SAT-GES-0313']:
        return 'Impuesto de circulación (ISCV) y valores'
    if n4 in ['Dar de baja (inactivar)', 'Reactivar (activar)']:
        return 'Bajas, inactivación y reactivación'
    if n4 in ['Correcciones de datos'] or cod in ['SAT-GES-0232', 'SAT-GES-0233', 'SAT-GES-0234', 'SAT-GES-0235', 'SAT-GES-0236']:
        return 'Modificaciones y rectificaciones'
    if n4 in ['Requisitos y representantes', 'NIT para entidades extranjeras'] or cod in ['SAT-GES-0225', 'SAT-GES-0226', 'SAT-GES-0227', 'SAT-GES-0228', 'SAT-GES-0229']:
        return 'Autorizaciones, consultas y requisitos'

    return 'Autorizaciones, consultas y requisitos'

for t in tramites:
    if t.get('pillar') == 'contribuyentes' and t.get('nivel2_area') == 'Contribuyente General':
        old_n3 = t.get('nivel3_subarea')
        new_n3 = map_n3_contribuyente_general(t)
        t['nivel3_subarea'] = new_n3
        t['subcategoria'] = new_n3
        t['categoria'] = 'Contribuyente General'

        if new_n3 == 'Vehículos (como propietario)':
            new_n4 = map_n4_vehiculos(t)
            t['nivel4_tema'] = new_n4
        elif old_n3 == 'Personas Individuales con Negocio':
            if t.get('nivel5_tramite') and t.get('nivel5_tramite') != '—':
                pass
            else:
                t['nivel4_tema'] = '—'
                t['nivel5_tramite'] = t.get('tramite', '')

# ==============================================================================
# 3. HALLAZGO 5: RESOLVER DUPLICADOS SEMÁNTICOS (97 REGISTROS)
# ==============================================================================
dupes_genericos = [
    'Requisitos de persona/empresa',
    'Requisitos Gestiones Vehículos para Propietarios: Requisitos de Vehiculos',
    'Procedimientos administrativos de aduanas (Sanciones y recursos)',
    'Requisitos para consulta de expedientes de gestión aduanera',
    'Preguntas frecuentes sobre temas aduaneros',
    'Procedimientos, instructivos y guías para gestiones aduaneras',
    'Capacitaciones para auxiliares de la función pública',
    'Auxiliares de la función pública aduanera (Carné, componente ActiveX PKI/DUA)',
    'Requisitos para la renovación de operación de auxiliares de la función pública',
    'Programa de modernización integral aduanera (MIAD)'
]

homologados_count = 0
for t in tramites:
    n_act = (t.get('nombreActual') or '').strip()
    tr = (t.get('tramite') or '').strip()

    if n_act in dupes_genericos and tr and tr != n_act:
        t['nombreActual'] = tr
        homologados_count += 1
    elif not n_act:
        t['nombreActual'] = tr

print(f"Homologados {homologados_count} títulos de nombreActual con títulos distintivos en lenguaje ciudadano.")

for t in tramites:
    actor = t.get('nivel2_area') or t.get('categoria') or ''
    tr = t.get('tramite', '')
    
    if tr == 'Requisitos para consulta de expedientes de gestión aduanera':
        t['tramite'] = f"Requisitos para consulta de expedientes de gestión aduanera (para {actor})"
        t['nombreActual'] = t['tramite']
    elif tr == 'Procedimientos administrativos de aduanas (Sanciones y recursos)':
        t['tramite'] = f"Procedimientos administrativos de aduanas, sanciones y recursos (para {actor})"
        t['nombreActual'] = t['tramite']
    elif tr == 'Preguntas frecuentes sobre temas aduaneros':
        t['tramite'] = f"Preguntas frecuentes sobre operaciones aduaneras (para {actor})"
        t['nombreActual'] = t['tramite']
    elif tr == 'Procedimientos, instructivos y guías para gestiones aduaneras':
        t['tramite'] = f"Guías operativas e instructivos aduaneros (para {actor})"
        t['nombreActual'] = t['tramite']
    elif tr == 'Capacitaciones para auxiliares de la función pública':
        t['tramite'] = f"Capacitaciones y programas de formación (para {actor})"
        t['nombreActual'] = t['tramite']
    elif tr == 'Programa de modernización integral aduanera (MIAD)':
        t['tramite'] = f"Programa de modernización integral aduanera MIAD (para {actor})"
        t['nombreActual'] = t['tramite']
    elif tr == 'Requisitos para la renovación de operación de auxiliares de la función pública':
        t['tramite'] = f"Requisitos para renovación de operaciones de auxiliares aduaneros (para {actor})"
        t['nombreActual'] = t['tramite']

# ==============================================================================
# 4. HALLAZGO 4: GOBERNANZA DEL ORDEN Y CICLO ATO
# ==============================================================================
ATO_PESO = {
    'empezar': 1,
    'operar': 2,
    'consultar': 3,
    'modificar_cerrar': 4,
    'normativa': 5
}

folders = {}
for idx, t in enumerate(tramites):
    folder_key = (
        t.get('pillar', ''),
        t.get('nivel2_area', ''),
        t.get('nivel3_subarea', '—'),
        t.get('nivel4_tema', '—')
    )
    if folder_key not in folders:
        folders[folder_key] = []
    folders[folder_key].append(t)

for folder_key, items in folders.items():
    items.sort(key=lambda x: (
        ATO_PESO.get(x.get('etapaAto', 'empezar'), 1),
        x.get('codigo', '')
    ))
    for pos, item in enumerate(items, start=1):
        item['orden_contenido'] = pos

print(f"Reordenados {len(folders)} contenedores/folders respetando ciclo ATO.")

# ==============================================================================
# 5. HALLAZGO 6: NORMALIZACIÓN DE ESQUEMA JSON Y CAMPOS NUMÉRICOS N1..N5
# ==============================================================================
PILAR_ORDEN = {
    'contribuyentes': 1,
    'comercio_exterior': 2,
    'profesionales': 3,
    'entes_exentos': 4
}

for t in tramites:
    t['nivel1'] = t.get('nivel1_segmento') or t.get('pillarName') or ''
    t['orden_n1'] = PILAR_ORDEN.get(t.get('pillar'), 1)
    
    t['nivel2'] = t.get('nivel2_area', '')
    t['nivel3'] = t.get('nivel3_subarea', '—')
    t['nivel4'] = t.get('nivel4_tema', '—')
    t['nivel5'] = t.get('nivel5_tramite', '—')

    t['nivel1_segmento'] = t['nivel1']
    t['nivel2_area'] = t['nivel2']
    t['nivel3_subarea'] = t['nivel3']
    t['nivel4_tema'] = t['nivel4']
    t['nivel5_tramite'] = t['nivel5']

    miga_parts = [t['nivel1'], t['nivel2']]
    if t['nivel3'] and t['nivel3'] != '—':
        miga_parts.append(t['nivel3'])
    if t['nivel4'] and t['nivel4'] != '—':
        miga_parts.append(t['nivel4'])
    miga_parts.append(t.get('tramite', ''))
    t['migaBreadcrumb'] = " > ".join(miga_parts)

    t['categoria'] = t['nivel2']
    t['subcategoria'] = t['nivel3'] if (t['nivel3'] and t['nivel3'] != '—') else '—'

    for dead_key in ['segmento', 'regimenArea', 'grupoActor', 'materiaTema', 'subtemaGestion', 'nivel2_categoria', 'nivel3_subcategoria']:
        if dead_key in t:
            del t[dead_key]

# Ordenar el arreglo completo según la jerarquía canónica y el orden_contenido dentro de cada folder
tramites.sort(key=lambda x: (
    x.get('orden_n1', 1),
    x.get('nivel2', ''),
    x.get('nivel3', ''),
    x.get('nivel4', ''),
    x.get('orden_contenido', 1)
))

with open(DATA_PATH, 'w', encoding='utf-8') as f:
    json.dump(tramites, f, ensure_ascii=False, indent=2)

print("allTramites.json ordenado y actualizado con éxito.")
