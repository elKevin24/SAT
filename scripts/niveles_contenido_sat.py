# -*- coding: utf-8 -*-
"""
Contenido editorial de la arquitectura de información del Portal Web SAT.

Este módulo concentra los textos orientadores (Qué es / Lead text / Base jurídica)
de los niveles superiores del árbol canónico:

    NIVEL 1  -> 4 nodos                              (editorial)
    NIVEL 2  -> 20 nodos                             (editorial)
    NIVEL 3  -> 58 nodos                             (editorial)
    NIVEL 4  -> 157 nodos (agrupaciones de gestiones)(derivado del dataset)
    NIVEL 5  -> 715 trámites / gestiones terminales  (derivado del dataset)

La Base jurídica de N2 y N3 se deriva automáticamente de las hojas del dataset
(unión por frecuencia de los `baseLegal` hijos), por lo que aquí solo se
redactan las definiciones operativas y los lead text.
"""

# ==============================================================================
# NIVEL 1 — DEFINICIÓN COMPLETA AUTORADA
# ==============================================================================
NIVEL1 = {
    "Operadores de Comercio Exterior": {
        "que_es": (
            "Son todas las personas individuales o jurídicas que intervienen en el ingreso, "
            "permanencia, traslado y salida de mercancías del territorio aduanero nacional. "
            "Comprende tanto a los dueños de las mercancías (importadores y exportadores) como a los "
            "prestadores de servicios logísticos autorizados (auxiliares de la función pública, "
            "transportistas, depósitos) y empresas que operan bajo regímenes territoriales especiales."
        ),
        "lead_text": "Servicios e información aduanera para la importación, exportación y logística.",
        "base_juridica": (
            "Código Tributario (Dto. 6-91), CAUCA IV (Resolución 223-2008 COMIECO) y "
            "RECAUCA (Resolución 224-2008 COMIECO)."
        ),
    },
    "Contribuyentes": {
        "que_es": (
            "Son las personas individuales, jurídicas, patrimonios o entes afectos al cumplimiento de "
            "obligaciones tributarias internas en el territorio guatemalteco. Abarca a ciudadanos sin "
            "actividad económica activa, asalariados en relación de dependencia, pequeños contribuyentes, "
            "contribuyentes del régimen general del IVA e ISR, propietarios de vehículos y grandes/medianos "
            "contribuyentes especiales calificados."
        ),
        "lead_text": "Información y servicios tributarios para personas y empresas.",
        "base_juridica": (
            "Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), "
            "Ley de Actualización Tributaria (Dto. 10-2012), Ley del ISCV (Dto. 70-94) y "
            "Ley de Simplificación Tributaria (Dto. 7-2019 / Dto. 31-2024)."
        ),
    },
    "Profesionales": {
        "que_es": (
            "Son las personas individuales colegiadas activas o técnicos acreditados ante la SAT que ejercen "
            "liberalmente su profesión o actúan como auxiliares técnicos en materia tributaria, mercantil y "
            "notarial. Comprende a abogados y notarios (traspasos vehiculares electrónicos y fe pública), "
            "peritos contadores, contadores públicos y auditores (CPA) y gestores tributarios acreditados."
        ),
        "lead_text": "Herramientas y servicios especializados para profesionales tributarios y auxiliares.",
        "base_juridica": (
            "Código de Notariado (Dto. 314), Ley de Colegiación Profesional Obligatoria (Dto. 72-2001), "
            "Decreto 2450 (Normas de la Profesión Contable), Ley de Timbres Fiscales (Dto. 37-92) y "
            "Código Tributario (Art. 57 \"A\" y 112)."
        ),
    },
    "Entes Exentos": {
        "que_es": (
            "Son las personas jurídicas, entidades del sector público, organismos diplomáticos y "
            "organizaciones de la sociedad civil que, por mandato constitucional o ley específica ordinaria, "
            "gozan de exención total o parcial de tributos y aranceles en el territorio nacional. Incluye "
            "centros educativos, universidades, comunidades religiosas, ONGs, fundaciones sin fines de lucro, "
            "municipalidades y ministerios de Estado."
        ),
        "lead_text": "Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.",
        "base_juridica": (
            "Constitución Política (Arts. 37, 73, 88 y 257), Ley de ONGs (Dto. 02-2003), Ley del IVA "
            "(Dto. 27-92, Art. 8), Ley de Actualización Tributaria (Dto. 10-2012, Art. 11), "
            "Código Municipal (Dto. 12-2002) y Ley Orgánica del Presupuesto (Dto. 101-97)."
        ),
    },
}

# ==============================================================================
# NIVEL 2 — ÁREAS / REGÍMENES (20 nodos)
# ==============================================================================
NIVEL2 = {
    "Sin Obligaciones de Impuestos": {
        "que_es": (
            "Personas individuales que no realizan actividad económica ni prestan servicios afectos, pero que "
            "requieren un NIT para actos civiles, laborales, notariales o bancarios, así como residentes en el extranjero."
        ),
        "lead_text": "Gestiones de identificación tributaria para personas sin actividad comercial.",
    },
    "Pequeños Contribuyentes": {
        "que_es": (
            "Personas individuales o jurídicas que tributan la tarifa definitiva del 5% en el régimen simplificado "
            "sobre ingresos brutos, incluyendo el régimen electrónico y los productores del sector primario y agropecuario."
        ),
        "lead_text": "Información y obligaciones para pequeños negocios y el régimen simplificado.",
    },
    "Régimen General": {
        "que_es": (
            "Contribuyentes del régimen general del IVA e ISR obligados a facturar, declarar y pagar periódicamente, "
            "así como a mantener actualizado su RTU, sus establecimientos, vehículos y comprobantes electrónicos."
        ),
        "lead_text": "Declaraciones, RTU, vehículos, facturación FEL y servicios del régimen general.",
    },
    "Contribuyentes Especiales": {
        "que_es": (
            "Empresas calificadas por resolución de la SAT como grandes o medianos contribuyentes, sujetas a "
            "fiscalización intensiva, atención diferenciada y control de precios de transferencia."
        ),
        "lead_text": "Servicios especializados para grandes y medianos contribuyentes calificados.",
    },
    "Importadores": {
        "que_es": (
            "Personas individuales o jurídicas inscritas en el padrón aduanero que introducen mercancías extranjeras "
            "al territorio aduanero nacional para su consumo, uso o transformación."
        ),
        "lead_text": "Inscripción, DUCAs, despacho, valoración y nacionalización de mercancías.",
    },
    "Exportadores": {
        "que_es": (
            "Personas inscritas en el registro de exportadores que despachan mercancías de origen nacional o "
            "nacionalizadas hacia mercados del exterior."
        ),
        "lead_text": "Registro, embarques y devolución de crédito fiscal del IVA para exportadores.",
    },
    "Operador Económico Autorizado (OEA)": {
        "que_es": (
            "Operadores de la cadena logística internacional certificados por la SAT por cumplir estándares "
            "rigurosos de seguridad y confiabilidad en sus operaciones transfronterizas."
        ),
        "lead_text": "Certifícate como OEA y accede a carriles exprés y selectivo rojo reducido.",
    },
    "Auxiliares de la Función Pública Aduanera (AFPA)": {
        "que_es": (
            "Personas naturales o jurídicas autorizadas por la SAT para intervenir ante el servicio aduanero en el "
            "desaduanamiento, transporte, custodia o desconsolidación de mercancías, en nombre propio o de terceros."
        ),
        "lead_text": "Agentes aduaneros, apoderados, depósitos, courier y transportistas.",
    },
    "Regímenes Territoriales y Zonas Especiales": {
        "que_es": (
            "Empresas y polígonos industriales delimitados que operan bajo regímenes aduaneros de fomento con "
            "suspensión o exención arancelaria y fiscal."
        ),
        "lead_text": "Maquilas y Zonas de Desarrollo Económico Especial Público (ZDEEP).",
    },
    "Normativa y Operaciones Aduaneras Generales": {
        "que_es": (
            "Servicios transversales de consulta técnica arancelaria, resoluciones anticipadas, acuerdos comerciales, "
            "prevención del contrabando y modernización de la infraestructura aduanera."
        ),
        "lead_text": "Arancel SAC, permisos, acuerdos comerciales, consultas técnicas y denuncias.",
    },
    "Abogados y Notarios": {
        "que_es": (
            "Profesionales del derecho colegiados activos autorizados para ejercer la fe pública notarial, autorizar "
            "traspasos electrónicos de vehículos y emitir razones tributarias ante la SAT."
        ),
        "lead_text": "Papel sellado, timbres fiscales, e-Traspaso y avisos notariales.",
    },
    "Peritos Contadores": {
        "que_es": (
            "Técnicos y profesionales contables inscritos ante la SAT facultados para llevar y certificar registros "
            "contables, libros tributarios electrónicos y declaraciones juradas de contribuyentes."
        ),
        "lead_text": "Registro, libros electrónicos, facturación FEL y retenciones contables.",
    },
    "Auditores": {
        "que_es": (
            "Contadores Públicos y Auditores (CPA) colegiados activos autorizados para emitir dictámenes de "
            "devolución de crédito fiscal y certificar estados financieros."
        ),
        "lead_text": "Inscripción de firma de CPA y dictámenes de crédito fiscal.",
    },
    "Gestores Tributarios": {
        "que_es": (
            "Personas individuales acreditadas formalmente ante la SAT para representar a terceros en la tramitación "
            "presencial de gestiones administrativas tributarias y aduaneras."
        ),
        "lead_text": "Acreditación, carné oficial y renovación de gafetes de gestor tributario.",
    },
    "Servicios Profesionales": {
        "que_es": (
            "Profesionales liberales e independientes que prestan servicios técnicos, jurídicos o de salud por "
            "honorarios, sujetos a regímenes de retención y actualización registral."
        ),
        "lead_text": "Facturación por honorarios, consultas legales y sistemas de retención.",
    },
    "Entidades del Estado": {
        "que_es": (
            "Ministerios, secretarías, organismos de los tres poderes del Estado y entidades descentralizadas que "
            "operan como agentes de retención del IVA e ISR."
        ),
        "lead_text": "Registro institucional, retenciones, parque vehicular y control interno.",
    },
    "Constitucionales": {
        "que_es": (
            "Centros educativos, universidades, iglesias, misiones diplomáticas y entidades del deporte federado "
            "exentas de impuestos por mandato directo de la Constitución."
        ),
        "lead_text": "Exenciones constitucionales de IVA, ISR y timbres fiscales.",
    },
    "No Lucrativos": {
        "que_es": (
            "Organizaciones No Gubernamentales, fundaciones benéficas, asociaciones civiles y comités que solicitan "
            "reconocimiento administrativo de exención de ISR e IVA."
        ),
        "lead_text": "Inscripción, exenciones y cierre de organizaciones no lucrativas.",
    },
    "Municipalidades": {
        "que_es": (
            "Corporaciones municipales autónomas, mancomunidades y empresas municipales que gestionan su patrimonio "
            "y exenciones ante la administración tributaria."
        ),
        "lead_text": "Registro municipal, flotillas exentas de ISCV y solvencias.",
    },
    "Decreto": {
        "que_es": (
            "Personas o entidades beneficiarias de leyes de fomento económico y exenciones tributarias específicas "
            "aprobadas mediante decretos legislativos ordinarios del Congreso."
        ),
        "lead_text": "Exenciones especiales, cooperativas, partidos políticos y misiones diplomáticas.",
    },
}

# ==============================================================================
# NIVEL 3 — SUBÁREAS / CATEGORÍAS (58 nodos)
# ==============================================================================
NIVEL3 = {
    # --- Contribuyentes -------------------------------------------------------
    "Asalariados, Compradores de Bienes y Residentes en el Extranjero": {
        "que_es": "Personas que tramitan su primer NIT o lo utilizan únicamente para actos civiles, laborales o bancarios, sin ejercer actividad mercantil.",
        "lead_text": "Solicita y actualiza tu NIT para actos civiles y bancarios.",
    },
    "Pequeño Contribuyente General (5% / Régimen Electrónico)": {
        "que_es": "Negocios inscritos en el régimen simplificado del 5% definitivo o en el régimen electrónico sobre ingresos brutos.",
        "lead_text": "Inscríbete y cumple tus obligaciones como pequeño contribuyente.",
    },
    "Productores del Sector Primario (Régimen Especial)": {
        "que_es": "Productores agropecuarios y del sector primario acogidos a regímenes especiales y al Impuesto de Circulación de Productos (ICT).",
        "lead_text": "Regístrate como productor del sector primario y gestiona tu régimen especial.",
    },
    "RTU Digital y Agencia Virtual": {
        "que_es": "Identidad tributaria y expediente electrónico del contribuyente: actualización de datos, actividades, establecimientos, contadores y usuarios.",
        "lead_text": "Actualiza tus datos en el RTU Digital y administra tus accesos en la Agencia Virtual.",
    },
    "Empresas y Sociedades Mercantiles": {
        "que_es": "Sociedades anónimas, sucursales extranjeras y contratos asociativos: inscripción, nombramiento de representantes legales y cese de operaciones.",
        "lead_text": "Inscribe tu empresa, sucursal o sociedad y gestiona a sus representantes legales.",
    },
    "Declaraciones y Pagos": {
        "que_es": "Formularios oficiales y liquidación periódica de impuestos internos directos e indirectos: IVA, ISR, ISO, Timbres Fiscales e IETAP.",
        "lead_text": "Llena tus formularios en Declaraguate, genera tu boleta y paga en línea.",
    },
    "Servicios al Contribuyente": {
        "que_es": "Citas en agencias tributarias, solvencias fiscales, certificaciones, habilitación de libros y asistencia tributaria.",
        "lead_text": "Agenda citas, obtén solvencias y consulta tus servicios tributarios.",
    },
    "Asalariados y Relación de Dependencia": {
        "que_es": "Rentas del trabajo en relación de dependencia: retenciones mensuales de ISR, proyección anual y devoluciones en exceso.",
        "lead_text": "Gestiona tus retenciones de ISR y solicita devoluciones como asalariado.",
    },
    "Vehículos": {
        "que_es": "Registro Fiscal de Vehículos: calcomanía anual ISCV, primeras placas, traspasos, modificaciones y reposición de distintivos.",
        "lead_text": "Paga tu calcomanía ISCV, tramita placas y traspasos de vehículos.",
    },
    "Facturación Electrónica (FEL)": {
        "que_es": "Régimen de Factura Electrónica en Línea (FEL): habilitación como emisor, autorización de formatos y emisión o anulación de DTE.",
        "lead_text": "Habilítate como emisor FEL y administra tus documentos tributarios electrónicos.",
    },
    "Grandes y Medianos Contribuyentes": {
        "que_es": "Contribuyentes especiales con atención diferenciada, presentación de estados financieros auditados y control de precios de transferencia.",
        "lead_text": "Gestiones y obligaciones para grandes y medianos contribuyentes especiales.",
    },
    # --- Comercio Exterior: Importadores -------------------------------------
    "Registro y Padrón de Importadores": {
        "que_es": "Inscripción y consultas del padrón aduanero de importadores, así como requisitos generales de ingreso de mercancías.",
        "lead_text": "Inscríbete en el padrón de importadores y conoce los requisitos de ingreso.",
    },
    "Declaraciones Aduaneras y DUCAs": {
        "que_es": "Transmisión, corrección y consulta de declaraciones aduaneras de mercancías (DUCA).",
        "lead_text": "Transmite, corrige y consulta tus declaraciones aduaneras.",
    },
    "Despacho Aduanero, Levante y Selectivo": {
        "que_es": "Despacho aduanero: selectivo, levante, envíos parciales y rescate de mercancías en aduana.",
        "lead_text": "Gestiona el despacho, el levante y el rescate de tus mercancías.",
    },
    "Importación y Nacionalización de Vehículos": {
        "que_es": "Importación, avalúo y nacionalización de vehículos usados y nuevos al territorio aduanero nacional.",
        "lead_text": "Importa, avalúa y nacionaliza vehículos ante la aduana.",
    },
    "Mercancías en Abandono, Depósitos y Franquicias": {
        "que_es": "Recuperación de depósitos aduanales, tratamiento de mercancías en abandono y regímenes de franquicia.",
        "lead_text": "Recupera depósitos y gestiona mercancías en abandono o franquicia.",
    },
    # --- Comercio Exterior: Exportadores -------------------------------------
    "Padrón y Registro de Exportadores": {
        "que_es": "Inscripción como exportador habitual y registro en la Ventanilla Única para las Exportaciones (VUPE).",
        "lead_text": "Inscríbete como exportador y obtén tu registro VUPE.",
    },
    "Declaraciones Aduaneras y Embarques": {
        "que_es": "Autorización de embarques y presentación de declaraciones complementarias de exportación.",
        "lead_text": "Autoriza tus embarques y presenta declaraciones de exportación.",
    },
    "Devolución de Crédito Fiscal": {
        "que_es": "Regímenes especial y optativo de devolución del crédito fiscal del IVA a exportadores, con dictamen de CPA.",
        "lead_text": "Solicita la devolución del crédito fiscal del IVA por tus exportaciones.",
    },
    # --- Comercio Exterior: AFPA y regímenes ---------------------------------
    "Agentes Aduaneros": {
        "que_es": "Inscripción, renovación de operación y garantías de los agentes aduaneros ante la SAT.",
        "lead_text": "Inscríbete, renueva y garantiza tu operación como agente aduanero.",
    },
    "Apoderados Especiales Aduaneros": {
        "que_es": "Habilitación y operación de los apoderados especiales aduaneros autorizados para actuar ante el servicio aduanero.",
        "lead_text": "Habilita y opera como apoderado especial aduanero.",
    },
    "Depósitos Aduaneros": {
        "que_es": "Depósitos Aduaneros Temporales (DAT), Almacenes Generales de Depósito (AGD) y depósitos fiscales.",
        "lead_text": "Habilita y opera depósitos aduaneros temporales, generales y fiscales.",
    },
    "Empresas de Entrega Rápida o Courier": {
        "que_es": "Habilitación y operación de empresas de entrega rápida o courier autorizadas por la SAT.",
        "lead_text": "Habilítate y opera como empresa de entrega rápida o courier.",
    },
    "Transportistas Aduaneros": {
        "que_es": "Habilitación, cartas de ingreso a zona primaria y operación de transportistas aduaneros.",
        "lead_text": "Gestiona tu habilitación y operación como transportista aduanero.",
    },
    "Maquilas (Decreto 29-89)": {
        "que_es": "Habilitación, cuenta corriente, liberación de fianza y cese de operaciones de empresas maquiladoras.",
        "lead_text": "Gestiona tu empresa maquiladora bajo el Decreto 29-89.",
    },
    "Zonas de Desarrollo Económico Especial Público (ZDEEP)": {
        "que_es": "Entidades administradoras y empresas usuarias de las Zonas de Desarrollo Económico Especial Público.",
        "lead_text": "Gestiona polígonos ZDEEP como entidad administradora o usuaria.",
    },
    # --- Comercio Exterior: normativa general --------------------------------
    "Arancel Centroamericano (SAC) y Permisos": {
        "que_es": "Consulta del Sistema Arancelario Centroamericano (SAC) y del catálogo de permisos no arancelarios.",
        "lead_text": "Consulta aranceles y permisos no arancelarios de importación.",
    },
    "Acuerdos Comerciales y Facilitación": {
        "que_es": "Tratados de libre comercio, convenios interinstitucionales y medidas de facilitación del comercio.",
        "lead_text": "Consulta los acuerdos comerciales y las medidas de facilitación.",
    },
    "Prevención de Contrabando y Defraudación": {
        "que_es": "Denuncias y acciones institucionales contra el contrabando y la defraudación aduanera.",
        "lead_text": "Denuncia el contrabando y la defraudación aduanera.",
    },
    "Consultas Técnicas, Recursos y Valoración": {
        "que_es": "Consultas aduaneras, ampliaciones, recursos de revisión y criterios de valoración de mercancías.",
        "lead_text": "Presenta consultas técnicas, recursos y valoraciones aduaneras.",
    },
    "Modernización e Infraestructura Aduanera": {
        "que_es": "Recintos aduaneros, complejos fronterizos y proyectos de modernización de la infraestructura aduanera.",
        "lead_text": "Conoce los recintos y proyectos de modernización aduanera.",
    },
    # --- Profesionales --------------------------------------------------------
    "Habilitación y Registro Notarial": {
        "que_es": "Inscripción y actualización de abogados y notarios en el Registro Tributario Unificado.",
        "lead_text": "Inscríbete y actualiza tu registro como abogado y notario.",
    },
    "Timbres Fiscales y Papel Sellado de Protocolo": {
        "que_es": "Compra y retiro de especies fiscales, timbres y papel sellado de protocolo notarial.",
        "lead_text": "Compra y retira papel sellado y especies fiscales.",
    },
    "Traspaso Electrónico Vehicular (e-Traspaso)": {
        "que_es": "Autorización notarial de traspasos vehiculares electrónicos y gestión de terceros autorizados.",
        "lead_text": "Autoriza traspasos vehiculares electrónicos con tu firma notarial.",
    },
    "Avisos Notariales y Fe Pública": {
        "que_es": "Registro, consulta y gestión de avisos notariales y actos de fe pública ante la SAT.",
        "lead_text": "Registra y consulta tus avisos notariales.",
    },
    "Habilitación y Registro de Perito Contador": {
        "que_es": "Inscripción y actualización de peritos contadores en el registro de contadores de la SAT.",
        "lead_text": "Inscríbete y actualiza tu registro como perito contador.",
    },
    "Consultas, Retenciones y Libros Contables": {
        "que_es": "Constancias de retención de IVA e ISR, gestión de libros contables y consultas del contador.",
        "lead_text": "Consulta constancias de retención y gestiona tus libros contables.",
    },
    "Habilitación y Registro de Auditor (CPA)": {
        "que_es": "Inscripción y actualización de contadores públicos y auditores (CPA) en el registro correspondiente.",
        "lead_text": "Inscribe y actualiza tu firma como auditor (CPA).",
    },
    "Dictámenes de Crédito Fiscal y Auditoría": {
        "que_es": "Emisión de dictámenes periciales para la devolución de crédito fiscal y auditorías tributarias.",
        "lead_text": "Emite dictámenes de devolución de crédito fiscal como CPA.",
    },
    "Acreditación y Carné Oficial de Gestor": {
        "que_es": "Requisitos y acreditación oficial del gestor tributario ante la SAT.",
        "lead_text": "Acredítate y obtén tu carné oficial de gestor tributario.",
    },
    "Renovación y Gestión de Gafetes": {
        "que_es": "Renovación anual, habilitación e inhabilitación de gafetes de gestores tributarios y auxiliares.",
        "lead_text": "Renueva y gestiona tu gafete de gestor tributario.",
    },
    "Facturación por Honorarios y Formularios": {
        "que_es": "Catálogo de formularios oficiales para la facturación de honorarios profesionales.",
        "lead_text": "Consulta y descarga los formularios de facturación por honorarios.",
    },
    "Actualización de Actividad y RTU": {
        "que_es": "Actualización de la actividad profesional y de los datos registrales en la Agencia Virtual.",
        "lead_text": "Actualiza tu actividad profesional en el RTU Digital.",
    },
    "Consultas Jurídico Tributarias": {
        "que_es": "Consultas legales y criterios jurídico-tributarios vinculantes ante la administración tributaria.",
        "lead_text": "Presenta consultas jurídico-tributarias y consulta criterios vinculantes.",
    },
    "Sistemas de Retención y Cumplimiento": {
        "que_es": "Sistemas de retención en línea y herramientas de cumplimiento tributario para profesionales.",
        "lead_text": "Opera los sistemas de retención y cumple tus obligaciones profesionales.",
    },
    # --- Entes Exentos: Estado y municipios ----------------------------------
    "Parque Vehicular Oficial y de Autoridad": {
        "que_es": "Alta, baja, traslado y control de los vehículos oficiales y de autoridad del Estado.",
        "lead_text": "Gestiona el alta, baja y control del parque vehicular oficial.",
    },
    "Registro Institucional y RTU Estatal": {
        "que_es": "Inscripción y actualización de ministerios, secretarías y entidades del Estado en el RTU.",
        "lead_text": "Inscribe y actualiza entidades del Estado en el RTU.",
    },
    "Facturación FEL, Retenciones y Operaciones": {
        "que_es": "Facturación electrónica FEL, constancias de retención y operaciones tributarias de entidades estatales.",
        "lead_text": "Emite retenciones y comprobantes FEL como entidad del Estado.",
    },
    "Control Interno, Solvencias y Normativa": {
        "que_es": "Solvencias institucionales, devolución de pagos indebidos y normativa de control interno.",
        "lead_text": "Gestiona solvencias, devoluciones y control interno institucional.",
    },
    "Centros Educativos y Universidades (Arts. 73 y 88)": {
        "que_es": "Exenciones tributarias de centros educativos, colegios y universidades conforme a los artículos 73 y 88 constitucionales.",
        "lead_text": "Gestiona las exenciones de tu centro educativo o universidad.",
    },
    "Vehículos, Solvencias y Asistencia Institucional": {
        "que_es": "Vehículos institucionales exentos, solvencias y solicitudes de cultura tributaria.",
        "lead_text": "Gestiona vehículos, solvencias y asistencia institucional.",
    },
    "Iglesias y Deporte Federado (Arts. 37 y 92)": {
        "que_es": "Exenciones de comunidades religiosas y entidades del deporte federado conforme a los artículos 37 y 92 constitucionales.",
        "lead_text": "Gestiona las exenciones de iglesias y deporte federado.",
    },
    "Inscripción y RTU de Organizaciones No Lucrativas": {
        "que_es": "Inscripción y registro en el RTU de ONGs, fundaciones, asociaciones civiles y comités.",
        "lead_text": "Inscribe tu organización no lucrativa y actualiza su RTU.",
    },
    "Exenciones CIVA, Actualización y Cierre de Operaciones": {
        "que_es": "Exenciones del Impuesto a los Combustibles (CIVA), actualización de datos y cierre de organizaciones no lucrativas.",
        "lead_text": "Gestiona exenciones CIVA, actualizaciones y cierre de tu organización.",
    },
    "Gestión Tributaria y Patrimonio Municipal": {
        "que_es": "Inscripción de municipalidades, flotillas municipales exentas del ISCV y gestión de su patrimonio.",
        "lead_text": "Inscribe tu municipalidad y gestiona su patrimonio y flotillas.",
    },
    "Cooperativas, Partidos Políticos y Exenciones Especiales": {
        "que_es": "Exenciones de cooperativas, partidos políticos y otros beneficiarios de regímenes especiales por decreto.",
        "lead_text": "Gestiona las exenciones especiales de cooperativas y partidos políticos.",
    },
    "Misiones Diplomáticas y Organismos Internacionales": {
        "que_es": "Registro y actualización de representaciones diplomáticas y organismos internacionales acreditados.",
        "lead_text": "Gestiona el registro de misiones diplomáticas y organismos internacionales.",
    },
    "Donaciones Oficiales y Despacho Aduanero": {
        "que_es": "Donaciones a favor del Estado y su despacho aduanero bajo regímenes especiales.",
        "lead_text": "Gestiona donaciones oficiales y su despacho aduanero.",
    },
}

# Etiqueta de reemplazo para nodos sin subdivisión (guion del dataset)
SIN_SUBDIVISION = "Gestiones directas (sin subdivisión adicional)"
