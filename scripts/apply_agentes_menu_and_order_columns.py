import json
import re

ALL_TRAMITES_PATH = 'src/data/allTramites.json'

def run():
    with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Total trámites iniciales: {len(data)}")

    # =========================================================================
    # 1. ACTUALIZACIÓN CANÓNICA DE AGENTES ADUANEROS (7 TRÁMITES)
    # =========================================================================
    agentes_canonical = {
        'comercio_exterior-143': {
            'orden_n4': 1,
            'orden_n5': 1,
            'nivel4_tema': 'Expedientes Aduaneros',
            'materiaTema': 'Expedientes Aduaneros',
            'nivel5_tramite': 'Consulta del Estado de Expedientes en Gestión Aduanera',
            'tramite': 'Consulta del Estado de Expedientes en Gestión Aduanera',
            'nombreActual': 'Consultar el estado de un expediente aduanero',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Consulta del Estado de Expedientes en Gestión Aduanera',
            'etapaAto': 'consultar',
            'etapaAtoLabel': 'Consultas y herramientas',
            'tipoInteraccion': 'consulta_datos',
            'tipoInteraccionLabel': 'Buscador / Consulta en Línea',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Servicio web para consultar el avance, estado procesal y unidad responsable de expedientes administrativos en la Intendencia de Aduanas.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-82': {
            'orden_n4': 2,
            'orden_n5': 1,
            'nivel4_tema': 'Acreditación Aduanera',
            'materiaTema': 'Acreditación Aduanera',
            'nivel5_tramite': 'Acreditación y Carné de Identificación para AFPA',
            'tramite': 'Acreditación y Carné de Identificación para AFPA',
            'nombreActual': 'Auxiliares de la Función Pública Aduanera',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Acreditación y Carné de Identificación para AFPA',
            'etapaAto': 'empezar',
            'etapaAtoLabel': 'Empezar y registrarse',
            'tipoInteraccion': 'guia_informativa',
            'tipoInteraccionLabel': 'Guía Informativa / Texto',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Requisitos, directrices de emisión de carné de identificación oficial y manual para registro, consulta y actualización de auxiliares aduaneros.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-97': {
            'orden_n4': 3,
            'orden_n5': 1,
            'nivel4_tema': 'Firma y Transmisión Electrónica',
            'materiaTema': 'Firma y Transmisión Electrónica',
            'nivel5_tramite': 'Instalador y Soporte de Firma Digital ActiveX PKI/DUA',
            'tramite': 'Instalador y Soporte de Firma Digital ActiveX PKI/DUA',
            'nombreActual': 'Componente ActiveX PKI/DUA',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Instalador y Soporte de Firma Digital ActiveX PKI/DUA',
            'etapaAto': 'operar',
            'etapaAtoLabel': 'Operación y declaraciones',
            'tipoInteraccion': 'descarga_recurso',
            'tipoInteraccionLabel': 'Formulario / Documento Descargable',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Descarga oficial y soporte técnico del componente ActiveX PKI necesario para firmar digitalmente y transmitir la declaración aduanera (DUCA).',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-83': {
            'orden_n4': 4,
            'orden_n5': 1,
            'nivel4_tema': 'Habilitación AFPA',
            'materiaTema': 'Habilitación AFPA',
            'nivel5_tramite': 'Inscripción y Habilitación de Auxiliares de la Función Pública Aduanera',
            'tramite': 'Inscripción y Habilitación de Auxiliares de la Función Pública Aduanera',
            'nombreActual': '1. Auxiliares de la función pública aduanera',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Inscripción y Habilitación de Auxiliares de la Función Pública Aduanera',
            'etapaAto': 'empezar',
            'etapaAtoLabel': 'Empezar y registrarse',
            'tipoInteraccion': 'guia_informativa',
            'tipoInteraccionLabel': 'Guía Informativa / Texto',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Guía normativa y procedimental para la inscripción, autorización inicial de operaciones y registro en el padrón aduanero de la SAT.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-84': {
            'orden_n4': 4,
            'orden_n5': 2,
            'nivel4_tema': 'Habilitación AFPA',
            'materiaTema': 'Habilitación AFPA',
            'nivel5_tramite': 'Renovación Anual de Operación de Auxiliares Aduaneros',
            'tramite': 'Renovación Anual de Operación de Auxiliares Aduaneros',
            'nombreActual': '2. Requisitos para la Renovación de Operación de Auxiliares de la Función Publica',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Renovación Anual de Operación de Auxiliares Aduaneros',
            'etapaAto': 'modificar_cerrar',
            'etapaAtoLabel': 'Modificaciones y cierre',
            'tipoInteraccion': 'servicio_transaccional',
            'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
            'tipologiaContenido': 'tramite_transaccional',
            'tipologiaContenidoLabel': 'Trámite / Aplicativo en Línea',
            'descripcion': 'Gestión en línea de prórroga y renovación anual de la fianza y autorización para operar como auxiliar aduanero conforme al CAUCA y RECAUCA.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-100': {
            'orden_n4': 5,
            'orden_n5': 1,
            'nivel4_tema': 'Seguridad y Trazabilidad',
            'materiaTema': 'Seguridad y Trazabilidad',
            'nivel5_tramite': 'Especificaciones de Videovigilancia y CCTV en Recintos Aduaneros',
            'tramite': 'Especificaciones de Videovigilancia y CCTV en Recintos Aduaneros',
            'nombreActual': 'Videovigilancia Pedro de Alvarado – La Hachadura',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Especificaciones de Videovigilancia y CCTV en Recintos Aduaneros',
            'etapaAto': 'operar',
            'etapaAtoLabel': 'Operación y declaraciones',
            'tipoInteraccion': 'guia_informativa',
            'tipoInteraccionLabel': 'Guía Informativa / Texto',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Guía técnica y normativa para la interconexión y visualización remota de cámaras de seguridad en puestos fronterizos y depósitos fiscales.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-95': {
            'orden_n4': 6,
            'orden_n5': 1,
            'nivel4_tema': 'Capacitación Aduanera',
            'materiaTema': 'Capacitación Aduanera',
            'nivel5_tramite': 'Curso Virtual: Generalidades de la Declaración Única Centroamericana (DUCA)',
            'tramite': 'Curso Virtual: Generalidades de la Declaración Única Centroamericana (DUCA)',
            'nombreActual': 'Curso: generalidades de la DUCA',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Curso Virtual: Generalidades de la Declaración Única Centroamericana (DUCA)',
            'etapaAto': 'normativa',
            'etapaAtoLabel': 'Normativa y asistencia',
            'tipoInteraccion': 'servicio_transaccional',
            'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
            'tipologiaContenido': 'tramite_transaccional',
            'tipologiaContenidoLabel': 'Trámite / Aplicativo en Línea',
            'descripcion': 'Capacitación oficial interactiva sobre llenado, transmisión y soporte legal de la DUCA (modalidades D, F y T) para el despacho de mercancías.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        }
    }

    # =========================================================================
    # 2. SANEAMIENTO PLAIN LANGUAGE: 16 EN APODERADOS ESPECIALES ADUANEROS
    # =========================================================================
    apoderados_descripciones = {
        'comercio_exterior-apod-consultas-de-aduanas-rampa-de-': 'Consultar en tiempo real el estatus de rampa de revisión, revisores asignados, retención y levante de mercancías para despachos aduaneros.',
        'comercio_exterior-apod-requisitos-para-consulta-de-ex': 'Guía de requisitos y acreditación de representación legal para solicitar y consultar expedientes de gestión aduanera ante la SAT.',
        'comercio_exterior-apod-uni-n-aduanera-procedimientos-': 'Consultar resoluciones, directrices operativas y procedimientos de paso ágil en puestos fronterizos integrados de la Unión Aduanera.',
        'comercio_exterior-apod-capacitaciones-para-auxiliares': 'Inscripción y acceso a programas de capacitación técnica oficial sobre procedimientos aduaneros para auxiliares y apoderados.',
        'comercio_exterior-apod-legislaci-n-aduanera-bibliotec': 'Compendio digital de leyes, reglamentos (CAUCA, RECAUCA, Ley de Aduanas) y resoluciones administrativas aplicables a apoderados especiales.',
        'comercio_exterior-apod-preguntas-frecuentes-sobre-tem': 'Respuestas directas a consultas frecuentes sobre trámites aduaneros, responsabilidades operativas y plazos legales.',
        'comercio_exterior-apod-procedimientos-administrativos': 'Guía procedimental para la atención de audiencias, presentación de pruebas y recursos administrativos en materia aduanera.',
        'comercio_exterior-apod-procedimientos-instructivos-ma': 'Manuales operativos y guías técnicas para el despacho de mercancías, llenado de formatos y gestión de apoderados.',
        'comercio_exterior-apod-declaraci-n-anticipada': 'Transmitir y registrar la declaración aduanera antes del arribo del medio de transporte para agilizar el despacho y levante de mercancías.',
        'comercio_exterior-apod-declaraci-n-de-mercanc-as-duca': 'Directrices técnicas y soporte normativo para la elaboración, firma electrónica y transmisión de la Declaración Única Centroamericana (DUCA).',
        'comercio_exterior-apod-sistema-de-franquicias-electr-': 'Plataforma web para gestionar, registrar y consultar la aplicación de franquicias y exenciones arancelarias autorizadas.',
        'comercio_exterior-apod-autorizaci-n-inicial-y-registr': 'Procedimiento normativo propuesto para registrar mandatos especiales aduaneros, habilitar firma autorizada y emitir acreditación ante SAT.',
        'comercio_exterior-apod-auxiliares-de-la-funci-n-p-bli': 'Directrices para la obtención del carné de identificación oficial y soporte para la instalación de firma digital ActiveX PKI para DUCA.',
        'comercio_exterior-apod-recepci-n-de-seguro-de-cauci-n': 'Requisitos y entrega de pólizas de seguro de caución para garantizar obligaciones aduaneras en importaciones y admisiones temporales.',
        'comercio_exterior-apod-requisitos-para-la-renovaci-n-': 'Requisitos y gestión de prórroga anual de autorización y actualización de fianza para operar como apoderado especial aduanero.',
        'comercio_exterior-apod-solvencia-fiscal-requisito-par': 'Generación y verificación de la solvencia fiscal electrónica, requisito obligatorio para la renovación de operación ante la SAT.'
    }

    # =========================================================================
    # 3. SANEAMIENTO PLAIN LANGUAGE: 34 EN DEPÓSITOS ADUANEROS (AGD + DAT)
    # =========================================================================
    depositos_descripciones = {
        # Almacenes Generales de Depósito (AGD) - 16
        'comercio_exterior-agd-auxiliares-de-la-funci-n-p-bli': 'Emisión de carné oficial para personal de almacenes generales y configuración de firma electrónica ActiveX PKI para DUCA.',
        'comercio_exterior-agd-capacitaciones-para-auxiliares': 'Inscripción a cursos y talleres de formación técnica aduanera para personal de almacenes generales de depósito.',
        'comercio_exterior-agd-consulta-facilidades-de-pago-y': 'Consultar cuotas, estados de cuenta y facilidades de pago formalizadas ante SAT para obligaciones tributarias aduaneras.',
        'comercio_exterior-agd-consultas-de-aduanas-retenci-n': 'Verificar en tiempo real estatus de retención, órdenes de liberación y clasificación en el Sistema Arancelario Centroamericano (SAC).',
        'comercio_exterior-agd-declaraci-n-de-mercanc-as-duca': 'Transmisión y control de declaraciones DUCA para el ingreso, custodia temporal y egreso de mercancías en almacenes de depósito.',
        'comercio_exterior-agd-legislaci-n-aduanera-y-financi': 'Compendio legal del Decreto 1236, CAUCA y RECAUCA aplicable al régimen de depósito aduanero y emisión de títulos de crédito afianzados.',
        'comercio_exterior-agd-preguntas-frecuentes-sobre-tem': 'Respuestas claras a dudas frecuentes sobre régimen de depósito aduanero, plazos de almacenamiento y control de bultos.',
        'comercio_exterior-agd-procedimientos-administrativos': 'Guía para atender audiencias, presentar descargos y gestionar recursos administrativos ante la Intendencia de Aduanas.',
        'comercio_exterior-agd-procedimientos-instructivos-y-': 'Manuales operativos y lineamientos para el ingreso, custodia, desconsolidación y despacho de mercancías en almacenes.',
        'comercio_exterior-agd-programa-de-modernizaci-n-inte': 'Directrices técnicas y estándares tecnológicos del programa MIAD para la interconexión informática y trazabilidad del almacén.',
        'comercio_exterior-agd-recepci-n-de-seguro-de-cauci-n': 'Requisitos y entrega de pólizas de fianza y seguros de caución para garantizar responsabilidades fiscales del almacén.',
        'comercio_exterior-agd-registro-y-emisi-n-de-t-tulos-': 'Mecanismo propuesto para registrar y validar digitalmente ante SAT la emisión de certificados de depósito y bonos de prenda afianzados.',
        'comercio_exterior-agd-reporte-de-saldos-y-existencia': 'Transmisión electrónica periódica de existencias y saldos de mercancías bajo custodia fiscal requerida por la intendencia aduanera.',
        'comercio_exterior-agd-requisitos-para-consulta-de-ex': 'Requisitos y acreditación para consultar el estado procesal de expedientes y resoluciones operativas de almacenes generales.',
        'comercio_exterior-agd-requisitos-para-la-renovaci-n-': 'Procedimiento para la prórroga anual de autorización y actualización de fianza reglamentaria como almacén general de depósito.',
        'comercio_exterior-agd-solvencia-fiscal-requisito-ind': 'Obtención en línea de la solvencia fiscal requerida para la prórroga y continuidad de la habilitación operativa ante la SAT.',

        # Depósitos Aduaneros Temporales (DAT) - 18
        'comercio_exterior-dat-auxiliares-de-la-funci-n-p-bli': 'Acreditación oficial, entrega de credenciales y soporte del componente ActiveX PKI para operadores de recintos temporales.',
        'comercio_exterior-dat-capacitaciones-para-auxiliares': 'Programas de capacitación sobre seguridad, control de recintos y normativa aduanera para personal de depósitos temporales.',
        'comercio_exterior-dat-consultas-de-aduanas-asignaci-': 'Consulta en línea de asignación a rampa de revisión física, técnicos asignados, retenciones y órdenes de levante de mercancías.',
        'comercio_exterior-dat-control-de-descarga-ingreso-de': 'Procedimiento propuesto para registrar digitalmente actas de recepción, inconsistencias y control de descarga de bultos en recintos DAT.',
        'comercio_exterior-dat-declaraci-n-de-mercanc-as-duca': 'Validación electrónica y despacho de declaraciones aduaneras DUCA bajo el modelo de aduana sin papeles en depósitos temporales.',
        'comercio_exterior-dat-legislaci-n-aduanera-recauca-a': 'Marco normativo del CAUCA y RECAUCA (Art. 119) sobre operación, obligaciones y plazos legales en depósitos temporales.',
        'comercio_exterior-dat-monitoreo-de-sistemas-inform-t': 'Monitoreo de disponibilidad y operatividad en tiempo real de los sistemas informáticos aduaneros para recintos temporales.',
        'comercio_exterior-dat-preguntas-frecuentes-sobre-tem': 'Respuestas a consultas frecuentes sobre manejo de carga, plazos de permanencia temporal y levante de mercancías en recintos.',
        'comercio_exterior-dat-procedimientos-administrativos': 'Lineamientos para responder audiencias de ajuste, formular descargos y presentar recursos administrativos aduaneros.',
        'comercio_exterior-dat-procedimientos-instructivos-y-': 'Instructivos y guías técnicas para el control de inventarios, tarja de carga y despacho en puertos, aeropuertos y fronteras.',
        'comercio_exterior-dat-programa-de-modernizaci-n-inte': 'Especificaciones técnicas de cámaras CCTV, básculas y lectores OCR requeridos bajo el Programa de Modernización Integral Aduanera.',
        'comercio_exterior-dat-recepci-n-de-seguro-de-cauci-n': 'Recepción y registro de pólizas de seguro de caución para garantizar la operación fiscal y custodia de mercancías en DAT.',
        'comercio_exterior-dat-registro-de-admisi-n-temporal-': 'Control y registro de ingreso y ampliación de plazo para la admisión temporal de contenedores y chasises terrestres.',
        'comercio_exterior-dat-requisitos-para-consulta-de-ex': 'Requisitos documentales para consultar el avance de expedientes técnicos y administrativos de recintos temporales ante SAT.',
        'comercio_exterior-dat-requisitos-para-habilitaci-n-y': 'Requisitos normativos propuestos para delimitar perímetros, equipamiento y habilitación inicial de recintos aduaneros temporales.',
        'comercio_exterior-dat-requisitos-para-la-renovaci-n-': 'Trámite anual para la prórroga de habilitación y renovación de póliza de fianza para recintos aduaneros temporales.',
        'comercio_exterior-dat-sistema-de-cobro-por-permanenc': 'Plataforma para calcular y gestionar el cobro por días de permanencia de contenedores y medios de transporte en el país.',
        'comercio_exterior-dat-solvencia-fiscal-requisito-par': 'Gestión electrónica de solvencia fiscal indispensable para tramitar la renovación anual de operación de depósitos temporales.'
    }

    # Aplicar actualizaciones de Agentes Aduaneros
    for item in data:
        tid = item.get('id')
        if tid in agentes_canonical:
            for k, v in agentes_canonical[tid].items():
                item[k] = v

    # Aplicar descripciones en Apoderados
    for item in data:
        tid = item.get('id')
        if tid in apoderados_descripciones:
            item['descripcion'] = apoderados_descripciones[tid]

    # Aplicar descripciones en Depósitos
    for item in data:
        tid = item.get('id')
        if tid in depositos_descripciones:
            item['descripcion'] = depositos_descripciones[tid]

    print("Actualizados Agentes Aduaneros (7) y saneadas 50 descripciones de AFPA.")

    # =========================================================================
    # 4. ASIGNACIÓN MATEMÁTICA Y SISTEMÁTICA DE ORDEN N1..N5 A LOS 716 REGISTROS
    # =========================================================================
    # Definición canónica de orden para Nivel 1 (Pilar / Segmento)
    pillar_order = {
        'contribuyentes': 1,
        'comercio_exterior': 2,
        'profesionales': 3,
        'entes_exentos': 4
    }

    # Definición canónica de orden para Nivel 2 (Categoría / Área)
    categories_order = {
        'contribuyentes': [
            'NIT sin Obligaciones',
            'Pequeños Contribuyentes',
            'RTU Digital y Agencia Virtual',
            'Empresas y Sociedades',
            'Declaraciones y Pagos',
            'Servicios al Contribuyente',
            'Asalariados',
            'Contribuyentes Especiales',
            'Vehículos',
            'Facturación Electrónica',
            'Solvencia y Convenios'
        ],
        'comercio_exterior': [
            'Importadores',
            'Exportadores',
            'Operador Económico Autorizado (OEA)',
            'Auxiliares de la Función Pública Aduanera (AFPA)',
            'Regímenes Territoriales y Zonas Especiales',
            'Normativa y Operaciones Aduaneras Generales'
        ],
        'profesionales': [
            'Abogados y Notarios',
            'Peritos Contadores',
            'Auditores',
            'Gestores Tributarios',
            'Servicios Profesionales'
        ],
        'entes_exentos': [
            'Entidades del Estado',
            'Constitucionales',
            'No Lucrativos',
            'Municipalidades',
            'Decreto'
        ]
    }

    # Definición canónica de orden para Nivel 3 (Subcategoría)
    subcategories_order = {
        'Auxiliares de la Función Pública Aduanera (AFPA)': [
            'Agentes Aduaneros',
            'Apoderados Especiales Aduaneros',
            'Depósitos Aduaneros',
            'Empresas de Entrega Rápida o Courier',
            'Transportistas Aduaneros'
        ],
        'Importadores': [
            'Registro y Padrón de Importadores',
            'Declaraciones Aduaneras y DUCAs',
            'Despacho Aduanero, Levante y Selectivo',
            'Importación y Nacionalización de Vehículos',
            'Mercancías en Abandono, Depósitos y Franquicias'
        ],
        'Exportadores': [
            'Padrón y Registro de Exportadores',
            'Declaraciones Aduaneras y Embarques',
            'Devolución de Crédito Fiscal'
        ],
        'Regímenes Territoriales y Zonas Especiales': [
            'Maquilas (Decreto 29-89)',
            'Zonas de Desarrollo Económico Especial Público (ZDEEP)'
        ],
        'Normativa y Operaciones Aduaneras Generales': [
            'Arancel Centroamericano (SAC) y Permisos',
            'Acuerdos Comerciales y Facilitación',
            'Prevención de Contrabando y Defraudación',
            'Consultas Técnicas, Recursos y Valoración',
            'Modernización e Infraestructura Aduanera'
        ],
        'Abogados y Notarios': [
            'Habilitación y Registro Notarial',
            'Timbres Fiscales y Papel Sellado de Protocolo',
            'Traspaso Electrónico Vehicular (e-Traspaso)',
            'Avisos Notariales y Fe Pública'
        ],
        'Peritos Contadores': [
            'Habilitación y Registro de Perito Contador',
            'Consultas, Retenciones y Libros Contables'
        ],
        'Auditores': [
            'Habilitación y Registro de Auditor (CPA)',
            'Dictámenes de Crédito Fiscal y Auditoría'
        ],
        'Gestores Tributarios': [
            'Acreditación y Carné Oficial de Gestor',
            'Renovación y Gestión de Gafetes'
        ],
        'Servicios Profesionales': [
            'Facturación por Honorarios y Formularios',
            'Actualización de Actividad y RTU',
            'Consultas Jurídico Tributarias',
            'Sistemas de Retención y Cumplimiento'
        ]
    }

    # Asignar N1, N2, N3
    for item in data:
        p = item.get('pillar', 'contribuyentes')
        item['orden_n1'] = pillar_order.get(p, 1)

        cat = item.get('categoria', '')
        p_cats = categories_order.get(p, [])
        if cat in p_cats:
            item['orden_n2'] = p_cats.index(cat) + 1
        else:
            item['orden_n2'] = 99

        subcat = item.get('subcategoria', '')
        c_subs = subcategories_order.get(cat, [])
        if subcat in c_subs:
            item['orden_n3'] = c_subs.index(subcat) + 1
        else:
            item['orden_n3'] = 1

    # Agrupar por (N1, N2, N3) para asignar Orden N4 y Orden N5 en el resto de categorías
    grupos_n3 = {}
    for item in data:
        key = (item['orden_n1'], item['orden_n2'], item['orden_n3'])
        grupos_n3.setdefault(key, []).append(item)

    for key, items in grupos_n3.items():
        # Si es Agentes Aduaneros, sus órdenes ya están explícitamente fijados en agentes_canonical
        if items[0].get('subcategoria') == 'Agentes Aduaneros':
            continue

        # Para las demás: detectar temas únicos (N4) en su orden de aparición
        temas_orden = []
        for it in items:
            t_tema = it.get('nivel4_tema') or it.get('materiaTema') or 'General'
            if t_tema not in temas_orden:
                temas_orden.append(t_tema)

        # Asignar Orden N4
        # Si el tema contiene un prefijo tipo "1. ", "2. ", usar ese número si es consistente
        tema_to_num = {}
        for idx, t_nom in enumerate(temas_orden, start=1):
            m = re.match(r'^(\d+)\.\s*', str(t_nom))
            if m:
                tema_to_num[t_nom] = int(m.group(1))
            else:
                tema_to_num[t_nom] = idx

        for it in items:
            t_tema = it.get('nivel4_tema') or it.get('materiaTema') or 'General'
            it['orden_n4'] = tema_to_num.get(t_tema, 1)

        # Ahora asignar Orden N5 por cada tema
        grupos_n4 = {}
        for it in items:
            n4_val = it['orden_n4']
            grupos_n4.setdefault(n4_val, []).append(it)

        for n4_val, n4_items in grupos_n4.items():
            for idx, it in enumerate(n4_items, start=1):
                # Si el trámite tiene un prefijo "1. ", "2. " en su título, extraerlo si corresponde
                m_sub = re.match(r'^(\d+)\.\s*', str(it.get('nivel5_tramite') or it.get('tramite', '')))
                if m_sub and len(n4_items) > 1:
                    it['orden_n5'] = int(m_sub.group(1))
                else:
                    it['orden_n5'] = idx

    # Verificación de Agentes Aduaneros
    agentes_items = [t for t in data if t.get('subcategoria') == 'Agentes Aduaneros']
    print(f"\nVerificación Agentes Aduaneros ({len(agentes_items)} trámites):")
    for t in sorted(agentes_items, key=lambda x: (x['orden_n4'], x['orden_n5'])):
        print(f"  N4 Ord {t['orden_n4']} | N5 Ord {t['orden_n5']} | Tema: {t.get('nivel4_tema')} | Trámite: {t.get('tramite')}")

    # Guardar archivo actualizado
    with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nGuardado exitosamente {ALL_TRAMITES_PATH}")

if __name__ == '__main__':
    run()
