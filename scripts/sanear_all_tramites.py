import json

ALL_TRAMITES_PATH = 'src/data/allTramites.json'

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    tramites = json.load(f)

# 1. Limpieza de números en etapaAtoLabel (garantía global)
for t in tramites:
    lbl = t.get('etapaAtoLabel', '')
    if lbl.startswith('1. '): t['etapaAtoLabel'] = 'Empezar y registrarse'
    elif lbl.startswith('2. '): t['etapaAtoLabel'] = 'Operación y declaraciones'
    elif lbl.startswith('3. '): t['etapaAtoLabel'] = 'Consultas y herramientas'
    elif lbl.startswith('4. '): t['etapaAtoLabel'] = 'Modificaciones y cierre'
    elif lbl.startswith('5. '): t['etapaAtoLabel'] = 'Normativa y asistencia'

# Diccionario de saneamiento exhaustivo de AFPA
SANEAMIENTO_AFPA = {
    # --- ALMACENES FISCALES ---
    'comercio_exterior-92': {
        'tramite': 'Sistema de Cobro por Permanencia de Mercancías (SCP)',
        'descripcion': 'Aplicativo web oficial para consultar y liquidar las tarifas por días de permanencia de mercancías bajo control aduanero en almacén fiscal antes del levante.',
        'url': 'https://portal.sat.gob.gt/portal/sistema-de-cobro-por-permanencia/',
        'seccionActual': 'Gestiones y consultas aduaneras / Procedimientos aduaneros',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Régimen de Depósito Aduanero',
        'subtema': 'Liquidación y Permanencia',
        'etapaAto': 'operar',
        'etapaAtoLabel': 'Operación y declaraciones',
        'tipoInteraccion': 'servicio_transaccional',
        'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
        'perfilDestinatario': 'Depositarios Aduaneros, Almacenes Fiscales y Agentes de Aduana',
        'impactoOImportancia': 'Herramienta de control tributario que evita retrasos en el despacho y calcula automáticamente el importe por estadía aduanera.'
    },

    # --- AGENTES ADUANEROS ---
    'comercio_exterior-82': {
        'tramite': 'Acreditación y Carné de Identificación para AFPA',
        'descripcion': 'Requisitos, directrices de emisión de carné de identificación oficial y manual para registro, consulta y actualización de auxiliares aduaneros.',
        'url': 'https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1555105635499-a4507e58-10e9',
        'seccionActual': 'Procedimientos Aduaneros / Auxiliares de la Función Pública',
        'subcategoria': 'Registro y acreditación',
        'tema': 'Acreditación Aduanera',
        'subtema': 'Identificación y Credencial',
        'etapaAto': 'empezar',
        'etapaAtoLabel': 'Empezar y registrarse',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Agentes Aduaneros, Apoderados y Asistentes',
        'impactoOImportancia': 'Identificación obligatoria para ingresar y gestionar trámites en recintos y aduanas del país.'
    },
    'comercio_exterior-83': {
        'tramite': 'Inscripción y Habilitación de Auxiliares de la Función Pública Aduanera',
        'descripcion': 'Guía normativa y procedimental para la inscripción, autorización inicial de operaciones y registro en el padrón aduanero de la SAT.',
        'url': 'https://portal.sat.gob.gt/portal/auxiliares-de-la-funcion-publica/',
        'seccionActual': 'Aduanas / Auxiliares de la Función Pública',
        'subcategoria': 'Registro y acreditación',
        'tema': 'Habilitación AFPA',
        'subtema': 'Inscripción Inicial',
        'etapaAto': 'empezar',
        'etapaAtoLabel': 'Empezar y registrarse',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Aspirantes a Agentes Aduaneros, Transportistas y Depositarios',
        'impactoOImportancia': 'Habilitación legal para actuar por cuenta de terceros ante la autoridad aduanera.'
    },
    'comercio_exterior-84': {
        'tramite': 'Renovación Anual de Operación de Auxiliares Aduaneros',
        'descripcion': 'Gestión en línea de prórroga y renovación anual de la fianza y autorización para operar como auxiliar aduanero conforme al CAUCA y RECAUCA.',
        'url': 'https://portal.sat.gob.gt/portal/requisitos-de-aduanas/',
        'seccionActual': 'Aduanas / Requisitos de Aduanas',
        'subcategoria': 'Registro y acreditación',
        'tema': 'Habilitación AFPA',
        'subtema': 'Renovación de Operación',
        'etapaAto': 'modificar_cerrar',
        'etapaAtoLabel': 'Modificaciones y cierre',
        'tipoInteraccion': 'servicio_transaccional',
        'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
        'perfilDestinatario': 'Agentes Aduaneros, Transportistas, Depositarios y Courier',
        'impactoOImportancia': 'Mantiene activo el código de operador aduanero impidiendo la suspensión de actividades.'
    },
    'comercio_exterior-97': {
        'tramite': 'Instalador y Soporte de Firma Digital ActiveX PKI/DUA',
        'descripcion': 'Descarga oficial y soporte técnico del componente ActiveX PKI necesario para firmar digitalmente y transmitir la declaración aduanera (DUCA).',
        'url': 'https://portal.sat.gob.gt/portal/componente-activex-pki-dua/',
        'seccionActual': 'Aduanas / Componente ActiveX PKI/DUA',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Firma y Transmisión Electrónica',
        'subtema': 'Componente Tecnológico',
        'etapaAto': 'operar',
        'etapaAtoLabel': 'Operación y declaraciones',
        'tipoInteraccion': 'descarga_recurso',
        'tipoInteraccionLabel': 'Formulario / Documento Descargable',
        'perfilDestinatario': 'Agentes Aduaneros y Apoderados Especiales',
        'impactoOImportancia': 'Requisito técnico indispensable para la validación y firma de declaraciones sin papel.'
    },
    'comercio_exterior-95': {
        'tramite': 'Curso Virtual: Generalidades de la Declaración Única Centroamericana (DUCA)',
        'descripcion': 'Capacitación oficial interactiva sobre llenado, transmisión y soporte legal de la DUCA (modalidades D, F y T) para el despacho de mercancías.',
        'url': 'https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat/aduanas/declaraci%C3%B3n-%C3%BAnica-centroamericana-duca',
        'seccionActual': 'Cultura Tributaria / Cursos Virtuales de Aduanas',
        'subcategoria': 'Normativa y asistencia',
        'tema': 'Capacitación Aduanera',
        'subtema': 'Declaración DUCA',
        'etapaAto': 'normativa',
        'etapaAtoLabel': 'Normativa y asistencia',
        'tipoInteraccion': 'servicio_transaccional',
        'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
        'perfilDestinatario': 'Agentes de Aduana, Importadores y Exportadores',
        'impactoOImportancia': 'Previene multas y rechazos en aduanas por llenado incorrecto de documentos aduaneros.'
    },
    'comercio_exterior-100': {
        'tramite': 'Especificaciones de Videovigilancia y CCTV en Recintos Aduaneros',
        'descripcion': 'Guía técnica y normativa para la interconexión y visualización remota de cámaras de seguridad en puestos fronterizos y depósitos fiscales.',
        'url': 'https://portal.sat.gob.gt/portal/programa-miad/sistemas-de-video-vigilancia-cctv/',
        'seccionActual': 'Programa MIAD / Sistemas de Video Vigilancia CCTV',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Seguridad y Trazabilidad',
        'subtema': 'Circuito Cerrado de Televisión',
        'etapaAto': 'operar',
        'etapaAtoLabel': 'Operación y declaraciones',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Agentes, Transportistas y Operadores de Recinto',
        'impactoOImportancia': 'Cumplimiento de estándares OEA y control de seguridad en zona primaria aduanera.'
    },
    'comercio_exterior-143': {
        'tramite': 'Consulta del Estado de Expedientes en Gestión Aduanera',
        'descripcion': 'Servicio web para consultar el avance, estado procesal y unidad responsable de expedientes administrativos en la Intendencia de Aduanas.',
        'url': 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/consulta-del-estado-o-actuaciones-de-expedientes-de-las-unidades-del-departamento-de-gestion-aduanera/',
        'seccionActual': 'Requisitos de Aduanas / Consultas de Expedientes',
        'subcategoria': 'Consultas y seguimiento',
        'tema': 'Expedientes Aduaneros',
        'subtema': 'Seguimiento Procesal',
        'etapaAto': 'consultar',
        'etapaAtoLabel': 'Consultas y herramientas',
        'tipoInteraccion': 'consulta_datos',
        'tipoInteraccionLabel': 'Buscador / Consulta en Línea',
        'perfilDestinatario': 'Agentes Aduaneros, Apoderados y Operadores',
        'impactoOImportancia': 'Monitoreo ágil de gestiones sin necesidad de acudir físicamente a la intendencia.'
    },

    # --- TRANSPORTISTAS ADUANEROS ---
    'comercio_exterior-108': {
        'tramite': 'Autorización de Cartas de Ingreso a Zona Primaria Aduanera',
        'descripcion': 'Procedimiento y requisitos para autorizar el ingreso temporal de unidades de transporte de carga y conductores a áreas primarias portuarias y terrestres.',
        'url': 'https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/autorizacion-de-cartas-de-ingreso-a-zona-primaria/',
        'seccionActual': 'Requisitos Trámites de Aduanas / Ingreso a Zona Primaria',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Acceso a Zona Primaria',
        'subtema': 'Cartas de Ingreso',
        'etapaAto': 'operar',
        'etapaAtoLabel': 'Operación y declaraciones',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Transportistas Terrestres, Navieros y Agentes de Carga',
        'impactoOImportancia': 'Garantiza el control de acceso y seguridad física en recintos aduaneros portuarios y fronterizos.'
    },
    'comercio_exterior-110': {
        'tramite': 'Consulta y Verificación de Documentos del Manifiesto de Carga',
        'descripcion': 'Consulta en línea de documentos de transporte asociados al manifiesto (Carta de Porte, Guía Aérea, BL) transmitido por el transportista.',
        'url': 'https://portal.sat.gob.gt/portal/documentos-manifiesto/',
        'seccionActual': 'Aduanas / Consultas / Documentos del Manifiesto',
        'subcategoria': 'Consultas y seguimiento',
        'tema': 'Manifiesto de Carga',
        'subtema': 'Documentos Asociados',
        'etapaAto': 'consultar',
        'etapaAtoLabel': 'Consultas y herramientas',
        'tipoInteraccion': 'consulta_datos',
        'tipoInteraccionLabel': 'Buscador / Consulta en Línea',
        'perfilDestinatario': 'Transportistas Internacionales y Agentes Navieros',
        'impactoOImportancia': 'Permite verificar la validez de la transmisión antes de la llegada de la carga a aduana.'
    },
    'comercio_exterior-102': {
        'tramite': 'Ampliación de Plazo de Equipo de Carga en Admisión Temporal (ATC)',
        'descripcion': 'Gestión electrónica para prorrogar el tiempo de permanencia autorizada para remolques, contenedores y cabezales con placa extranjera.',
        'url': 'https://portal.sat.gob.gt/portal/registro-ampliacion-atc/',
        'seccionActual': 'Aduanas / Admisión Temporal de Equipo de Carga (ATC)',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Equipo de Carga (ATC)',
        'subtema': 'Prórroga de Permanencia',
        'etapaAto': 'operar',
        'etapaAtoLabel': 'Operación y declaraciones',
        'tipoInteraccion': 'servicio_transaccional',
        'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
        'perfilDestinatario': 'Empresas de Transporte Terrestre Internacional',
        'impactoOImportancia': 'Evita el comiso de la unidad y la imposición de multas por vencimiento de permanencia.'
    },
    'comercio_exterior-103': {
        'tramite': 'Culminación de Admisión Temporal de Equipo de Carga (ATC)',
        'descripcion': 'Procedimiento para registrar el descargo formal y la salida del territorio aduanero de contenedores y remolques extranjeros.',
        'url': 'https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/culminacion-de-admision-temporal-de-equipo-de-carga/',
        'seccionActual': 'Requisitos Trámites de Aduanas / Culminación ATC',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Equipo de Carga (ATC)',
        'subtema': 'Cancelación y Salida',
        'etapaAto': 'modificar_cerrar',
        'etapaAtoLabel': 'Modificaciones y cierre',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Transportistas Terrestres Internacionales',
        'impactoOImportancia': 'Cierra el expediente aduanero de la unidad de transporte y libera la garantía caucionada.'
    },
    'comercio_exterior-104': {
        'tramite': 'Registro y Habilitación de Equipo de Carga Terrestre (ATC)',
        'descripcion': 'Registro oficial de cabezales y plataformas de transporte internacional previo a su arribo a puestos fronterizos.',
        'url': 'https://portal.sat.gob.gt/portal/registro-atc-terrestre/',
        'seccionActual': 'Aduanas / Registro ATC Terrestre',
        'subcategoria': 'Registro y acreditación',
        'tema': 'Equipo de Carga (ATC)',
        'subtema': 'Registro de Unidades',
        'etapaAto': 'empezar',
        'etapaAtoLabel': 'Empezar y registrarse',
        'tipoInteraccion': 'servicio_transaccional',
        'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
        'perfilDestinatario': 'Transportistas de Carga Terrestre Centroamericano',
        'impactoOImportancia': 'Habilita el cruce fronterizo automatizado bajo el marco de la integración aduanera.'
    },
    'comercio_exterior-106': {
        'tramite': 'Consulta de Asignación de Rampa en Puertos y Depósitos',
        'descripcion': 'Buscador en línea que asigna el muelle, andén o rampa de inspección para la descarga y revisión no intrusiva de contenedores.',
        'url': 'https://portal.sat.gob.gt/portal/asignacion-rampa-pq/',
        'seccionActual': 'Aduanas / Asignación de Rampa',
        'subcategoria': 'Consultas y seguimiento',
        'tema': 'Operaciones Portuarias',
        'subtema': 'Asignación de Rampa',
        'etapaAto': 'consultar',
        'etapaAtoLabel': 'Consultas y herramientas',
        'tipoInteraccion': 'consulta_datos',
        'tipoInteraccionLabel': 'Buscador / Consulta en Línea',
        'perfilDestinatario': 'Transportistas, Pilotos y Agentes Portuarios',
        'impactoOImportancia': 'Agiliza los tiempos de logística interna en recintos aduaneros portuarios.'
    },
    'comercio_exterior-107': {
        'tramite': 'Consulta de Asignación de Revisores Aduaneros',
        'descripcion': 'Herramienta de transparencia que consulta el técnico aduanero asignado por sistema aleatorio para la verificación de carga.',
        'url': 'https://portal.sat.gob.gt/portal/asignacion-de-revisores/',
        'seccionActual': 'Aduanas / Asignación de Revisores',
        'subcategoria': 'Consultas y seguimiento',
        'tema': 'Inspección Aduanera',
        'subtema': 'Revisor Asignado',
        'etapaAto': 'consultar',
        'etapaAtoLabel': 'Consultas y herramientas',
        'tipoInteraccion': 'consulta_datos',
        'tipoInteraccionLabel': 'Buscador / Consulta en Línea',
        'perfilDestinatario': 'Transportistas, Agentes de Aduana y Gestores',
        'impactoOImportancia': 'Garantiza la trazabilidad del proceso de selectivo rojo en aduanas.'
    },
    'comercio_exterior-109': {
        'tramite': 'Consulta de Tránsitos Aduaneros Pendientes en Ruta',
        'descripcion': 'Monitoreo de declaraciones de tránsito interno e internacional en curso, mostrando aduana de partida, destino y tiempo restante.',
        'url': 'https://portal.sat.gob.gt/portal/transito-pendiente/',
        'seccionActual': 'Aduanas / Tránsito Pendiente',
        'subcategoria': 'Consultas y seguimiento',
        'tema': 'Tránsito Aduanero',
        'subtema': 'Monitoreo de Rutas',
        'etapaAto': 'consultar',
        'etapaAtoLabel': 'Consultas y herramientas',
        'tipoInteraccion': 'consulta_datos',
        'tipoInteraccionLabel': 'Buscador / Consulta en Línea',
        'perfilDestinatario': 'Transportistas y Agentes Aduaneros',
        'impactoOImportancia': 'Alerta sobre plazos límite de arribo para evitar infracciones por demoras en tránsito.'
    },
    'comercio_exterior-111': {
        'tramite': 'Especificaciones y Uso del Marchamo Electrónico Aduanero',
        'descripcion': 'Guía técnica y normativa para la colocación, monitoreo satelital GPS y desinstalación del precinto electrónico en unidades de carga.',
        'url': 'https://portal.sat.gob.gt/portal/marchamo-electronico/',
        'seccionActual': 'Aduanas / Marchamo Electrónico',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Trazabilidad y Seguridad',
        'subtema': 'Marchamo Electrónico',
        'etapaAto': 'operar',
        'etapaAtoLabel': 'Operación y declaraciones',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Transportistas Terrestres Internacionales',
        'impactoOImportancia': 'Seguridad en corredor fiscal evitando roturas o violaciones de carga en tránsito.'
    },
    'comercio_exterior-112': {
        'tramite': 'Transmisión Electrónica de Mensaje de Carga Aduanera (CUSCAR)',
        'descripcion': 'Manual de especificaciones y transmisión electrónica EDI del manifiesto de carga bajo el estándar CUSCAR hacia el sistema de aduanas.',
        'url': 'https://portal.sat.gob.gt/portal/mensaje-carga-aduanera-cuscar/',
        'seccionActual': 'Aduanas / Mensaje de Carga CUSCAR',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Manifiesto de Carga',
        'subtema': 'Transmisión EDI CUSCAR',
        'etapaAto': 'operar',
        'etapaAtoLabel': 'Operación y declaraciones',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Líneas Navieras, Aerolíneas y Empresas Consolidadoras',
        'impactoOImportancia': 'Cumplimiento de la anticipación obligatoria de manifiestos conforme al CAUCA.'
    },
    'comercio_exterior-101': {
        'tramite': 'Devolución de Garantía / Depósito de Admisión Temporal (ATC)',
        'descripcion': 'Gestión de reintegro o descargo de la fianza rendida por la internación temporal de unidades de transporte una vez reexportadas.',
        'url': 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-de-impuestos-de-admision-temporal-de-equipo-de-carga-atc/',
        'seccionActual': 'Requisitos de Aduanas / Devolución ATC',
        'subcategoria': 'Modificaciones y cierre',
        'tema': 'Equipo de Carga (ATC)',
        'subtema': 'Devolución de Garantías',
        'etapaAto': 'modificar_cerrar',
        'etapaAtoLabel': 'Modificaciones y cierre',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Transportistas y Líneas de Carga',
        'impactoOImportancia': 'Recuperación de activos financieros afianzados ante la administración tributaria.'
    },
    'comercio_exterior-5': {
        'tramite': 'Régimen de Infracciones y Sanciones en Tránsito Aduanero',
        'descripcion': 'Compendio de sanciones, multas pecuniarias y causales de inhabilitación por incumplimientos en operaciones aduaneras y tránsitos.',
        'url': 'https://portal.sat.gob.gt/portal/sanciones-aplicables-a-la-importacion-exportacion-o-transito/',
        'seccionActual': 'Aduanas / Sanciones Aplicables a Comercio Exterior',
        'subcategoria': 'Normativa y asistencia',
        'tema': 'Marco Sancionatorio',
        'subtema': 'Infracciones Aduaneras',
        'etapaAto': 'normativa',
        'etapaAtoLabel': 'Normativa y asistencia',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Transportistas, Pilotos y Agentes de Aduana',
        'impactoOImportancia': 'Previene contingencias legales y asegura el conocimiento de responsabilidades solidarias.'
    },
    'comercio_exterior-137': {
        'tramite': 'Procedimiento Administrativo Sancionatorio y Recursos de Impugnación',
        'descripcion': 'Pautas procesales y plazos legales para evacuar audiencias e interponer recursos administrativos en materia aduanera.',
        'url': 'https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1555105635499-a4507e58-10e9',
        'seccionActual': 'Procedimientos Aduaneros / Recursos e Impugnaciones',
        'subcategoria': 'Normativa y asistencia',
        'tema': 'Defensa Tributaria y Aduanera',
        'subtema': 'Recurso de Revocatoria',
        'etapaAto': 'normativa',
        'etapaAtoLabel': 'Normativa y asistencia',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Auxiliares de la Función Pública y Abogados',
        'impactoOImportancia': 'Derecho de defensa y debido proceso en resoluciones emitidas por la intendencia aduanera.'
    },
    'entes_exentos-82': {
        'tramite': 'Preguntas Frecuentes sobre Marchamo Electrónico y Corredores Fiscales',
        'descripcion': 'Respuestas oficiales sobre funcionamiento del marchamo satelital, incidencias técnicas en ruta y puestos de control interinstitucional.',
        'url': 'https://portal.sat.gob.gt/portal/preguntas-frecuentes/temas-aduaneros/',
        'seccionActual': 'Preguntas Frecuentes / Temas Aduaneros',
        'subcategoria': 'Normativa y asistencia',
        'tema': 'Trazabilidad y Seguridad',
        'subtema': 'Preguntas Frecuentes Marchamo',
        'etapaAto': 'normativa',
        'etapaAtoLabel': 'Normativa y asistencia',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Transportistas, Gestores y Usuarios de Comercio',
        'impactoOImportancia': 'Guía de contingencia ante alertas o aperturas de precinto por fuerza mayor en ruta.'
    },

    # --- EMPRESAS DE ENTREGA RÁPIDA / COURIER ---
    'comercio_exterior-87': {
        'tramite': 'Sistema de Franquicias Electrónicas Aduaneras',
        'descripcion': 'Aplicativo web para gestionar el beneficio arancelario de franquicias para encomiendas no comerciales y envíos diplomáticos.',
        'url': 'https://portal.sat.gob.gt/portal/franquicias-electronicas/',
        'seccionActual': 'Aduanas / Franquicias Electrónicas',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Despacho Simplificado',
        'subtema': 'Franquicias Electrónicas',
        'etapaAto': 'operar',
        'etapaAtoLabel': 'Operación y declaraciones',
        'tipoInteraccion': 'servicio_transaccional',
        'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
        'perfilDestinatario': 'Empresas Courier, Diplomáticos y Beneficiarios de Exención',
        'impactoOImportancia': 'Agiliza la liberación de encomiendas familiares y diplomáticas sin arancel.'
    },
    'comercio_exterior-88': {
        'tramite': 'Guía y Despacho Simplificado para Importación Courier',
        'descripcion': 'Procedimiento para la clasificación, aforo y desaduanamiento expedito de envíos de entrega rápida en terminales de carga aérea.',
        'url': 'https://portal.sat.gob.gt/portal/programa-miad/componente-procesos-2/importacion/',
        'seccionActual': 'Programa MIAD / Componente Procesos / Importación Express',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Despacho Express',
        'subtema': 'Importación Courier',
        'etapaAto': 'operar',
        'etapaAtoLabel': 'Operación y declaraciones',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Empresas Courier y Consolidadores de Paquetería',
        'impactoOImportancia': 'Garantiza el despacho aduanero en menos de 6 horas para paquetería urgente.'
    },
    'comercio_exterior-89': {
        'tramite': 'Registro y Recepción de Póliza de Fianza / Seguro de Caución Courier',
        'descripcion': 'Recepción y validación de la fianza de operación anual exigida por el Art. 576 del RECAUCA para garantizar obligaciones aduaneras.',
        'url': 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/recepcion-de-seguro-de-caucion-importacion-y-admision-temporal/',
        'seccionActual': 'Requisitos de Aduanas / Seguro de Caución',
        'subcategoria': 'Registro y acreditación',
        'tema': 'Garantías Aduaneras',
        'subtema': 'Fianza de Operación Courier',
        'etapaAto': 'empezar',
        'etapaAtoLabel': 'Empezar y registrarse',
        'tipoInteraccion': 'servicio_transaccional',
        'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
        'perfilDestinatario': 'Empresas de Entrega Rápida o Courier',
        'impactoOImportancia': 'Requisito habilitante para operar legalmente y responder por tributos en custodia.'
    },

    # --- OPERADOR ECONÓMICO AUTORIZADO (OEA) ---
    'comercio_exterior-136': {
        'tramite': 'Habilitación y Certificación del Operador Económico Autorizado (OEA)',
        'descripcion': 'Guía integral, requisitos de seguridad en la cadena logística y proceso de auditoría para obtener la certificación OEA en Guatemala.',
        'url': 'https://portal.sat.gob.gt/portal/operador-economico-autorizado/',
        'seccionActual': 'Aduanas / Operador Económico Autorizado (OEA)',
        'subcategoria': 'Registro y acreditación',
        'tema': 'Certificación de Confianza',
        'subtema': 'Habilitación OEA',
        'etapaAto': 'empezar',
        'etapaAtoLabel': 'Empezar y registrarse',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'perfilDestinatario': 'Importadores, Exportadores, AFPA y Agentes Aduaneros',
        'impactoOImportancia': 'Otorga canal verde prioritario, reducción de inspecciones físicas y reconocimiento internacional.'
    },
    'profesionales-24': {
        'tramite': 'Directorio y Catálogo de Beneficios de Actores Certificados OEA',
        'descripcion': 'Listado oficial de empresas certificadas como OEA y manual de beneficios operativos en despacho aduanero y facilitación.',
        'url': 'https://portal.sat.gob.gt/portal/operador-economico-autorizado/',
        'seccionActual': 'Aduanas / Directorio OEA',
        'subcategoria': 'Consultas y seguimiento',
        'tema': 'Certificación de Confianza',
        'subtema': 'Directorio y Beneficios',
        'etapaAto': 'consultar',
        'etapaAtoLabel': 'Consultas y herramientas',
        'tipoInteraccion': 'consulta_datos',
        'tipoInteraccionLabel': 'Buscador / Consulta en Línea',
        'perfilDestinatario': 'Operadores de Comercio Exterior y Ciudadanía',
        'impactoOImportancia': 'Permite validar la solvencia de seguridad de socios comerciales en la cadena logística.'
    }
}

# Aplicar saneamiento sobre allTramites
for t in tramites:
    tid = t.get('id')
    if tid in SANEAMIENTO_AFPA:
        datos = SANEAMIENTO_AFPA[tid]
        for campo, val in datos.items():
            t[campo] = val

# Asegurar trámite de subasta/abandono para Almacenes Fiscales si no estuviera
abandono_exists = any(t.get('id') == 'comercio_exterior-af-abandono' for t in tramites)
if not abandono_exists:
    nuevo_abandono = {
        'id': 'comercio_exterior-af-abandono',
        'pillar': 'comercio_exterior',
        'pillarName': 'Operadores de Comercio Exterior',
        'macroGrupo': 'Operadores de Comercio Exterior',
        'grupoNo': 8,
        'grupoNombre': 'Auxiliares de la Función Pública Aduanera (AFPA)',
        'categoria': 'Almacenes Fiscales',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Régimen de Depósito Aduanero',
        'subtema': 'Abandono y Subastas',
        'nombreActual': 'Procedimiento de Declaración de Abandono y Notificación de Subasta Aduanera',
        'tramite': 'Declaración de Abandono y Subasta Aduanera de Mercancías',
        'descripcion': 'Procedimiento normado para emitir el acta de abandono tácito tras vencer el plazo legal de permanencia y trasladar el expediente a la SAT para subasta pública o destrucción.',
        'perfilDestinatario': 'Depositarios Aduaneros y Almacenes Fiscales',
        'impactoOImportancia': 'Descargo de responsabilidad del depositario aduanero y liberación de espacio en recintos fiscales conforme al Art. 129 del RECAUCA.',
        'seccionActual': 'Aduanas / Subastas y Procedimientos Aduaneros',
        'url': 'https://portal.sat.gob.gt/portal/subastas-aduaneras/',
        'nota': 'Flujo obligatorio al vencer el plazo de 1 año en depósito fiscal o 20 días en depósito temporal.',
        'etapaAto': 'modificar_cerrar',
        'etapaAtoLabel': 'Modificaciones y cierre',
        'tipoInteraccion': 'guia_informativa',
        'tipoInteraccionLabel': 'Guía Informativa / Texto',
        'esBrecha': False
    }
    tramites.append(nuevo_abandono)

with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(tramites, f, ensure_ascii=False, indent=2)

print(f"allTramites.json actualizado con éxito. Total registros: {len(tramites)}")
