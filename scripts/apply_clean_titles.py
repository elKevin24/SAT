import json
import re

# Diccionario de reemplazo exacto para títulos de Profesionales y Entes Exentos
TITLES_REPLACEMENT = {
    # === PROFESIONALES (49) ===
    "profesionales-54": "Acreditación integral, carné y renovación de Gestor Tributario y Auxiliares",
    "profesionales-41": "Acreditación de tercera persona autorizada para gestiones en el Registro Tributario Unificado (RTU)",
    "profesionales-16": "Consulta en línea de constancias de retención del Impuesto al Valor Agregado (IVA) e Impuesto Sobre la Renta (ISR)",
    "profesionales-17": "Guía y administración del régimen de Factura Electrónica en Línea (FEL)",
    "profesionales-18": "Presentación de Planilla del Impuesto al Valor Agregado (IVA) en Factura Electrónica en Línea (FEL)",
    "profesionales-19": "Habilitación y administración del Libro Electrónico Tributario (LET)",
    "profesionales-46": "Operación y emisión en el Sistema de Retenciones del Impuesto al Valor Agregado (IVA)",
    "profesionales-44": "Procedimiento y rectificación para autoliquidación de impuestos",
    "profesionales-45": "Sistema de retenciones para servicios médicos y hospitalarios (Asiste Web)",
    "profesionales-4": "Presentación de consultas técnico-tributarias vinculantes ante Asuntos Jurídicos",
    "profesionales-20": "Catálogo general de formularios tributarios electrónicos en Declaraguate",
    "profesionales-42": "Solicitud de devolución, retención o compensación de créditos tributarios",
    "profesionales-78": "Documentación y herramientas del Programa de Cumplimiento Tributario Voluntario",
    "profesionales-30": "Marco de actuación y alcance de los Gestores Tributarios acreditados",
    "profesionales-61": "Requisitos de acreditación inicial para Gestor Tributario o Auxiliar",
    "profesionales-82": "Inscripción y habilitación como Perito Contador ante la SAT",
    "profesionales-80": "Actualización de datos de Perito Contador en Agencia Virtual",
    "profesionales-81": "Cancelación y baja como Contador en Agencia Virtual",
    "profesionales-83": "Registro y habilitación de Contador en Agencia Virtual",
    "profesionales-89": "Inscripción de Contador autorizado para emitir dictámenes de devolución de crédito fiscal",
    "profesionales-91": "Inscripción y habilitación como Contador Público y Auditor (CPA)",
    "profesionales-88": "Actualización de datos de Contador que emite dictámenes de devolución",
    "profesionales-90": "Actualización de datos de Contador Público y Auditor (CPA)",
    "profesionales-59": "Habilitación e inhabilitación temporal o definitiva de Gestor Tributario o Auxiliar",
    "profesionales-58": "Consulta en línea del padrón de Gestores Tributarios y Auxiliares activos",
    "profesionales-57": "Actualización de datos y renovación de gafete para Gestor Tributario",
    "profesionales-60": "Reposición de gafete de identificación para Gestor Tributario",
    "profesionales-29": "Actualización de datos registrales de Servicios Profesionales en Agencia Virtual",
    "profesionales-34": "Calendario y plazos de obligaciones notariales ante la SAT",
    "profesionales-66": "Adquisición de Papel Sellado Especial para Protocolos y Timbres Fiscales (Formulario SAT-7130)",
    "profesionales-74": "Habilitación de Notario para Traspaso Electrónico de Vehículos (TEV)",
    "profesionales-timbres-razon-electronica": "Pago del Impuesto de Timbres Fiscales en línea con razón electrónica",
    "profesionales-timbres-devolucion-papel-sellado": "Devolución y canje de timbres fiscales y papel sellado inutilizado",
    "profesionales-capacitacion-timbres-notarios": "Capacitación sobre emisión de razón electrónica de timbres notariales",
    "profesionales-objeciones-asuntos-juridicos": "Recepción de propuestas y observaciones técnicas a criterios de Asuntos Jurídicos",

    # === ENTES EXENTOS (79) ===
    "profesionales-76": "Registro de exenciones del Impuesto a la Distribución de Petróleo Crudo y Combustibles Derivados (IDP)",
    "entes_exentos-10": "Inscripción de Centro Educativo exento en el Registro Tributario Unificado (RTU)",
    "entes_exentos-15": "Inscripción de entidad de la Iglesia Católica en el Registro Tributario Unificado (RTU)",
    "entes_exentos-17": "Inscripción de Universidad Privada en el Registro Tributario Unificado (RTU)",
    "entes_exentos-11": "Solicitud de actividades y talleres de Cultura Tributaria para centros educativos",
    "entes_exentos-8": "Actualización de datos de Centro Educativo en el Registro Tributario Unificado (RTU)",
    "entes_exentos-6": "Consulta de historial de Solvencias Fiscales emitidas",
    "entes_exentos-7": "Motivos de omisos y requisitos para desbloqueo de Solvencia Fiscal",
    "entes_exentos-12": "Actualización de datos de Federación o Asociación Deportiva (CDAG)",
    "entes_exentos-13": "Actualización de datos de entidad de la Iglesia Católica en el RTU Digital",
    "entes_exentos-16": "Actualización de datos de Universidad Privada en el RTU Digital",
    "entes_exentos-21": "Actualización integral de datos registrales para entidades del Estado y no lucrativas",
    "entes_exentos-26": "Actualización de distintivos vehiculares (tarjeta y título) para entidades exentas",
    "entes_exentos-22": "Gestiones tributarias y exenciones de la Confederación Deportiva Autónoma de Guatemala (CDAG)",
    "entes_exentos-14": "Cancelación o cambio de Representante Legal de entidad de la Iglesia Católica",
    "entes_exentos-18": "Aviso notarial de transferencia de dominio y legalización de firmas vehiculares",
    "entes_exentos-23": "Registro de marca y código de fabricante de vehículos ante el Registro Fiscal de Vehículos",
    "entes_exentos-24": "Rectificación de datos técnicos y transformaciones en vehículos oficiales o institucionales",
    "entes_exentos-9": "Capacitación virtual sobre obligaciones tributarias de centros educativos exentos",
    "entes_exentos-32": "Inscripción de Organización No Gubernamental (ONG) registrada antes de agosto 2022",
    "entes_exentos-33": "Inscripción de Organización No Gubernamental (ONG) registrada desde agosto 2022",
    "entes_exentos-34": "Inscripción de fundación, asociación civil o entidad religiosa no católica",
    "entes_exentos-35": "Inscripción de sucursal de entidad sin fines de lucro extranjera",
    "entes_exentos-37": "Inscripción de Organización Comunitaria de Servicios de Agua y Saneamiento (OCSAS)",
    "entes_exentos-39": "Inscripción de Organización de Padres de Familia (OPF)",
    "entes_exentos-40": "Inscripción de organización sindical en el Registro Tributario Unificado (RTU)",
    "entes_exentos-46": "Inscripción del Número de Identificación Tributaria (NIT) para entidades públicas y no lucrativas",
    "entes_exentos-30": "Actualización de datos de entidad no lucrativa en el Registro Tributario Unificado (RTU)",
    "entes_exentos-36": "Actualización de datos de Organización Comunitaria en el RTU Digital",
    "entes_exentos-38": "Actualización de datos de Organización de Padres de Familia (OPF)",
    "entes_exentos-31": "Cese definitivo de operaciones y cierre de entidad no lucrativa",
    "entes_exentos-66": "Inscripción de cooperativa en el Registro Tributario Unificado (RTU)",
    "entes_exentos-70": "Inscripción de Comité Cívico Electoral o Comité Pro Formación de Partido Político",
    "entes_exentos-71": "Inscripción de Partido Político en el Registro Tributario Unificado (RTU)",
    "entes_exentos-61": "Programa Aduana sin Papeles y despacho digital de donaciones oficiales",
    "entes_exentos-62": "Certificación como Operador Económico Autorizado (OEA) para entidades públicas y cooperación",
    "entes_exentos-63": "Operaciones de comercio exterior en el marco de la Unión Aduanera Centroamericana",
    "entes_exentos-65": "Actualización de datos de cooperativa en el Registro Tributario Unificado (RTU)",
    "entes_exentos-67": "Acreditación o cambio de representante de Misión Diplomática u Organismo Internacional",
    "entes_exentos-68": "Actualización de datos de Embajada, Misión Diplomática o Proyecto de Cooperación",
    "entes_exentos-69": "Actualización de datos de identificación para miembros del Cuerpo Diplomático y Consular",
    "entes_exentos-51": "Renovación anual de registro como Auxiliar de la Función Pública Aduanera (AFPA)",
    "entes_exentos-55": "Manual de procedimientos y despacho aduanero para misiones y cooperación internacional",
    "entes_exentos-64": "Recepción de sugerencias sobre procedimientos aduaneros para entidades exentas",
    "entes_exentos-76": "Cambio de placas particulares a placas oficiales, diplomáticas o consulares",
    "entes_exentos-80": "Traspaso vehicular con exención para miembros del Cuerpo Diplomático y Consular",
    "entes_exentos-97": "Inscripción de Municipalidad y corporaciones municipales en el RTU",
    "entes_exentos-91": "Emisión de Constancias de Exención del Impuesto al Valor Agregado (CIVA) para municipalidades",
    "entes_exentos-96": "Actualización de datos de Municipalidad y mancomunidades en el RTU Digital",
    "entes_exentos-98": "Baja definitiva de vehículos municipales desmantelados o subastados como chatarra",
    "entes_exentos-99": "Inscripción y traspaso de vehículos adjudicados o donados a Municipalidades",
    "entes_exentos-113": "Baja temporal o definitiva de vehículos por orden judicial o del Ministerio Público",
    "entes_exentos-114": "Reactivación de vehículo con levantamiento de orden judicial o del Ministerio Público",
    "entes_exentos-112": "Baja de vehículos subastados como chatarra por orden del Organismo Judicial",
    "entes_exentos-115": "Traspaso de vehículos a la Secretaría Nacional de Administración de Bienes en Extinción de Dominio (SENABED)",
    "entes_exentos-106": "Inscripción de Dependencia o Entidad del Estado en el Registro Tributario Unificado (RTU)",
    "entes_exentos-4": "Habilitación para emisión de Constancias de Exención del IVA (CIVA) en Agencia Virtual",
    "entes_exentos-111": "Generación de Constancias de Exención del IVA (CIVA) en Agencia Virtual y Factura Electrónica en Línea (FEL)",
    "entes_exentos-121": "Emisión de Factura Electrónica en Línea (FEL) para dependencias del Estado",
    "entes_exentos-125": "Corrección de casillas, período y NIT en formularios de Declaraguate",
    "entes_exentos-133": "Consulta pública de la tabla de valores imponibles del Impuesto de Circulación de Vehículos",
    "entes_exentos-105": "Actualización de datos de Dependencia o Entidad del Estado en el RTU Digital",
    "entes_exentos-128": "Devolución y compensación de impuestos para entidades estatales",
    "entes_exentos-107": "Cumplimiento tributario en el Sistema Nacional de Control Interno (SINACIG)",
    "entes_exentos-123": "Directorio de dependencias y servicios institucionales del Estado",
    "entes_exentos-124": "Recepción de sugerencias sobre criterios técnicos y procedimientos jurídicos",
    "entes_exentos-126": "Solicitud de facilidades de pago en cuotas (en línea o presencial)",
    "entes_exentos-127": "Gestiones y servicios tributarios en Agencia Virtual para entidades del Estado",
    "entes_exentos-129": "Guía para autoliquidación y regularización de impuestos en el sector público",
    "entes_exentos-130": "Sistema de retenciones del Impuesto Sobre la Renta (ISR) para agentes de retención del Estado",
    "entes_exentos-131": "Sistema de retenciones del Impuesto al Valor Agregado (IVA) para agentes retenedores públicos",
    "entes_exentos-132": "Solicitud de acceso a la información pública de la SAT (Decreto 57-2008)",
    "entes_exentos-108": "Traslado y asignación vehicular entre dependencias de una Entidad del Estado",
    "entes_exentos-109": "Activación e inactivación temporal de vehículos del Estado",
    "entes_exentos-110": "Cambio y reposición de placas temporales de vehículos oficiales",
    "entes_exentos-134": "Traspaso y regularización de vehículos oficiales del Estado",
    "entes_exentos-103": "Capacitación virtual sobre Factura Electrónica en Línea (FEL) para entidades del Estado",
    "entes_exentos-116": "Compendio de leyes aduaneras y convenios internacionales de exención",
    "entes_exentos-122": "Tabla de tasas e intereses resarcitorios vigentes de la SAT"
}

# Aplicar las modificaciones a allTramites.json
with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    tramites = json.load(f)

mod_count = 0
for t in tramites:
    tid = t.get('id')
    if tid in TITLES_REPLACEMENT:
        new_title = TITLES_REPLACEMENT[tid]
        t['tramite'] = new_title
        t['nivel5_tramite'] = new_title
        mod_count += 1

print(f"Total trámites modificados: {mod_count}")

# Guardar allTramites.json
with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
    json.dump(tramites, f, ensure_ascii=False, indent=2)

print("allTramites.json actualizado con éxito.")
