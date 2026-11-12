# -*- coding: utf-8 -*-
"""
Enrichment script for Normativa y Operaciones Aduaneras Generales - Part 1 (18 gestiones):
- Arancel Centroamericano (SAC) y Permisos (7 gestiones)
- Acuerdos Comerciales y Facilitación (8 gestiones)
- Prevención de Contrabando y Defraudación (3 gestiones)
Adhering to ATO UX Writing standards, Regla 12, and SAT Guatemala regulations.
"""

import json

def enrich_normativa_p1():
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    enrichment = {
        # -------------------------------------------------------------
        # 1. ARANCEL CENTROAMERICANO (SAC) Y PERMISOS (7 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0514": {
            "nombreActual": "Habilitar perfil en Agencia Virtual para emisión de constancias CAIS",
            "descripcion": "Solicita en línea la autorización para emitir Constancias de Adquisición de Insumos y Servicios (CAIS) amparadas bajo el Decreto 29-89. Permite adquirir bienes y contratar servicios locales exentos de IVA para la producción de exportación.",
            "requisitos": [
                "Estar calificado activamente bajo el régimen del Decreto 29-89 en el Registro Tributario Unificado (RTU).",
                "Contar con usuario activo y actualizado en la Agencia Virtual de la SAT.",
                "Estar al día en el cumplimiento de obligaciones tributarias con solvencia fiscal vigente."
            ],
            "documentos": [
                "Resolución ministerial de calificación emitida por el Ministerio de Economía (MINECO).",
                "Nombramiento vigente del representante legal inscrito en el Registro Mercantil."
            ],
            "pasos": [
                "Inicia sesión en la Agencia Virtual con tu NIT y contraseña de seguridad.",
                "Dirígete al apartado 'Servicios al Contribuyente' > 'Habilitación para Emisión de Constancias CAIS'.",
                "El sistema valida en tiempo real la vigencia de la calificación del Decreto 29-89 y la solvencia fiscal.",
                "Confirma la habilitación para comenzar a generar constancias electrónicas CAIS a tus proveedores locales."
            ],
            "resultadoObtenido": "Perfil de emisión de constancias CAIS activado en la Agencia Virtual con numeración correlativa autorizada.",
            "tiempoEstimado": "Inmediato (habilitación en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Emitir constancias CAIS a favor de proveedores de bienes o servicios no vinculados directamente al proceso productivo exportador acarrea sanciones por defraudación tributaria.",
            "normativa": "Ley de Fomento y Desarrollo de la Actividad Exportadora y de Maquila (Decreto 29-89) Artículo 12 literal b); Ley del IVA."
        },
        "SAT-GES-0513": {
            "nombreActual": "Consultar la Nomenclatura del Sistema Arancelario Centroamericano (SAC)",
            "descripcion": "Accede a la estructura codificada oficial del Sistema Arancelario Centroamericano (SAC) de 10 dígitos basada en el Sistema Armonizado. Permite determinar la partida, subpartida e inciso arancelario aplicable a cualquier producto de importación.",
            "requisitos": [
                "Dispositivo con conexión a internet para consultar el portal del Arancel Integrado de la SAT.",
                "Identificar el nombre técnico, composición, uso o función de la mercancía a clasificar."
            ],
            "documentos": [
                "Ficha técnica, catálogo o especificaciones de laboratorio de la mercancía a importar o exportar."
            ],
            "pasos": [
                "Ingresa a la herramienta oficial del Arancel Integrado en el Portal SAT.",
                "Introduce el código arancelario de 10 dígitos o busca por palabra clave descriptiva.",
                "Navega a través de las Secciones, Capítulos y Partidas del SAC.",
                "Verifica la descripción oficial de la mercancía y las notas de capítulo correspondientes."
            ],
            "resultadoObtenido": "Clasificación arancelaria de la mercancía a nivel de inciso SAC oficial de 10 dígitos.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Una incorrecta clasificación arancelaria en la declaración DUCA genera ajustes tributarios por derechos arancelarios omitidos y multas del 100%.",
            "normativa": "Convenio sobre el Régimen Arancelario y Aduanero Centroamericano; Enmienda del Sistema Armonizado de la OMA."
        },
        "SAT-GES-0509": {
            "nombreActual": "Consultar catálogo oficial de permisos no arancelarios de importación",
            "descripcion": "Identifica las licencias, certificados fitosanitarios, registros de salud y permisos no arancelarios exigidos antes del despacho de mercancías. Permite conocer qué entidad rectora (MAGA, MSPAS, MEM o MARN) debe emitir la autorización previa.",
            "requisitos": [
                "Conocer el inciso arancelario del producto (SAC) o la descripción comercial del bien.",
                "Navegador web con acceso a internet para consultar el catálogo institucional de la SAT."
            ],
            "documentos": [
                "No requiere documentos físicos; es un repositorio público interactivo de consulta previa."
            ],
            "pasos": [
                "Accede a la herramienta 'Catálogo de Permisos No Arancelarios' en el Portal SAT.",
                "Digita la partida arancelaria o el nombre del producto (ej. alimentos, medicamentos, plaguicidas o combustibles).",
                "Revisa la institución gubernamental responsable de la emisión de la licencia y la normativa aplicable.",
                "Gestiona el permiso correspondiente a través de la Ventanilla Ágil de Importaciones (VAI) o ventanilla ministerial antes del embarque."
            ],
            "resultadoObtenido": "Detalle normado de los requisitos no arancelarios obligatorios para el ingreso legal de la mercancía al país.",
            "tiempoEstimado": "Inmediato (consulta interactiva)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Arribar al recinto aduanero sin la licencia no arancelaria obligatoria impide el levante de la carga y obliga a su reexportación forzosa en 30 días.",
            "normativa": "Acuerdo sobre Obstáculos Técnicos al Comercio de la OMC; RECAUCA Artículos 321 y 325."
        },
        "SAT-GES-0511": {
            "nombreActual": "Consultar derechos arancelarios (DAI) e impuestos en el Arancel Integrado",
            "descripcion": "Calcula los porcentajes de Derechos Arancelarios a la Importación (DAI) y las tasas tributarias aplicables a cada inciso del SAC. Muestra las preferencias arancelarias vigentes bajo los tratados de libre comercio suscritos por Guatemala.",
            "requisitos": [
                "Inciso arancelario de 10 dígitos o descripción técnica de la mercancía.",
                "País de origen y procedencia del embarque para verificar desgravación arancelaria por tratado comercial."
            ],
            "documentos": [
                "Factura comercial y certificado de origen si se solicita desgravación arancelaria preferencial."
            ],
            "pasos": [
                "Ingresa a la aplicación del Arancel Integrado en el Portal SAT.",
                "Introduce el código arancelario de la mercancía.",
                "Revisa el porcentaje de DAI general (0% a 15% o contingente) y la tasa del 12% del Impuesto al Valor Agregado (IVA).",
                "Selecciona el país de origen para verificar si el producto goza de arancel 0% bajo tratados como DR-CAFTA, UE o México."
            ],
            "resultadoObtenido": "Reporte completo de gravámenes aduaneros, contingentes y preferencias arancelarias aplicables al producto.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Para aplicar a aranceles preferenciales de tratados de libre comercio es obligatorio portar el certificado de origen formalmente válido.",
            "normativa": "Arancel Centroamericano de Importación; Acuerdos Comerciales Bilaterales y Multilaterales vigentes."
        },
        "SAT-GES-0515": {
            "nombreActual": "Consultar permisos específicos y notas arancelarias integradas",
            "descripcion": "Verifica simultáneamente las notas marginales del SAC y las regulaciones no arancelarias asociadas a partidas arancelarias complejas. Facilita el cumplimiento integral de barreras técnicas y requisitos de etiquetado en frontera.",
            "requisitos": [
                "Código arancelario de 10 dígitos o capítulo comercial a consultar.",
                "Conexión a internet para acceder a la base unificada de la Intendencia de Aduanas."
            ],
            "documentos": [
                "Ficha técnica y lista de ingredientes o especificaciones físicas del producto."
            ],
            "pasos": [
                "Accede al módulo unificado de permisos y arancel integrado en el Portal SAT.",
                "Busca por partida arancelaria o palabra técnica.",
                "Consulta en un solo panel los tributos de importación y las restricciones no arancelarias de ministerios.",
                "Descarga el informe técnico consolidado para planificar las licencias previas a la compra internacional."
            ],
            "resultadoObtenido": "Ficha consolidada de gravámenes arancelarios, notas legales y permisos ministeriales exigibles.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las notas legales de sección y capítulo tienen carácter vinculante obligatorio para la correcta interpretación del arancel.",
            "normativa": "Reglas Generales para la Interpretación del Sistema Arancelario Centroamericano (SAC)."
        },
        "SAT-GES-0510": {
            "nombreActual": "Consultar criterios vinculantes de clasificación arancelaria",
            "descripcion": "Accede a la base histórica de criterios oficiales y resoluciones anticipadas de clasificación arancelaria emitidas por la SAT. Otorga certidumbre sobre la interpretación de la autoridad aduanera para mercancías difíciles o novedosas.",
            "requisitos": [
                "Navegador de internet para consultar los criterios técnicos aduaneros en el portal institucional.",
                "Conocer la naturaleza, materia prima o marca comercial del producto a clasificar."
            ],
            "documentos": [
                "Criterios de clasificación arancelaria oficiales publicados en el repositorio institucional de la SAT."
            ],
            "pasos": [
                "Ingresa a la sección de Criterios Aduaneros en el Portal SAT.",
                "Filtra las resoluciones por año de emisión, número de criterio o palabra clave del producto.",
                "Descarga la resolución oficial de la Intendencia de Aduanas.",
                "Analiza la fundamentación técnica y reglas de clasificación aplicadas por los peritos de la SAT."
            ],
            "resultadoObtenido": "Texto íntegro del criterio arancelario vinculante para sustentar la declaración de importación.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Un criterio arancelario solo es directamente aplicable a mercancías que tengan exactamente las mismas características y composición técnica analizada.",
            "normativa": "RECAUCA Artículos 186 al 195 (Resoluciones Anticipadas de Clasificación Arancelaria)."
        },
        "SAT-GES-0512": {
            "nombreActual": "Consultar notas explicativas del Sistema Armonizado (SAC)",
            "descripcion": "Consulta las Notas Explicativas oficiales de la Organización Mundial de Aduanas (OMA) adoptadas en la legislación centroamericana. Proporcionan la guía técnica autorizada para definir el alcance exacto de cada partida y subpartida arancelaria.",
            "requisitos": [
                "Dispositivo con acceso a internet para consultar los tomos de Notas Explicativas del SAC.",
                "Interés en el análisis arancelario exhaustivo para clasificación de mercancías complejas."
            ],
            "documentos": [
                "Tomos oficiales de las Notas Explicativas de la OMA en formato digital."
            ],
            "pasos": [
                "Ingresa a la sección de 'Notas Explicativas del SAC' en el portal aduanero SAT.",
                "Selecciona el Capítulo y Partida arancelaria objeto de estudio.",
                "Lee las consideraciones generales, exclusiones expresas y criterios de inclusión técnica.",
                "Utiliza las citas de las notas explicativas para fundamentar expedientes arancelarios o recursos legales."
            ],
            "resultadoObtenido": "Acceso libre a la doctrina técnica oficial de clasificación arancelaria de la Organización Mundial de Aduanas.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las Notas Explicativas son la fuente doctrinal obligatoria para dirimir discrepancias de clasificación en auditorías aduaneras.",
            "normativa": "Convenio Internacional del Sistema Armonizado de Designación y Codificación de Mercancías; CAUCA Artículo 6."
        },

        # -------------------------------------------------------------
        # 2. ACUERDOS COMERCIALES Y FACILITACIÓN (8 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0516": {
            "nombreActual": "Consultar convenios interinstitucionales de cooperación con la SAT",
            "descripcion": "Consulta los acuerdos de cooperación, intercambio de información y controles conjuntos suscritos por la SAT con entidades públicas y privadas. Conoce los protocolos de facilitación en ventanillas únicas y puertos.",
            "requisitos": [
                "Conexión a internet para consultar los convenios interinstitucionales en el Portal SAT."
            ],
            "documentos": [
                "Textos de los convenios suscritos con MINGOB, MAGA, MSPAS, ZOLIC, AGEXPORT y cámaras empresariales."
            ],
            "pasos": [
                "Ingresa a la sección de 'Convenios Interinstitucionales' en el Portal SAT.",
                "Explora los acuerdos por área temática (seguridad portuaria, ventanilla única, OEA País o simplificación de trámites).",
                "Descarga los documentos de cooperación interinstitucional vigentes.",
                "Aplica los beneficios y mecanismos de enlace previstos en los acuerdos en tus operaciones logísticas."
            ],
            "resultadoObtenido": "Información pública sobre las alianzas estratégicas interinstitucionales de la administración aduanera.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Los convenios interinstitucionales fortalecen el cruce automatizado de bases de datos para detectar inconsistencias de fiscalización.",
            "normativa": "Ley Orgánica de la SAT Artículo 3 literal l); Ley Nacional de Aduanas Decreto 14-2013."
        },
        "SAT-GES-0522": {
            "nombreActual": "Consultar la Estrategia Centroamericana de Facilitación de Comercio",
            "descripcion": "Accede a los 5 ejes y medidas prioritarias de facilitación aduanera regional adoptados por el Consejo de Ministros de Integración Económica (COMIECO). Incluye declaración anticipada, gestión coordinada de fronteras y trazabilidad de carga.",
            "requisitos": [
                "Navegador web con acceso a internet para descargar informes y directrices de facilitación."
            ],
            "documentos": [
                "Documento oficial de la Estrategia Centroamericana de Facilitación de Comercio y Competitividad."
            ],
            "pasos": [
                "Ingresa a la sección de Facilitación de Comercio y Competitividad en el Portal SAT.",
                "Revisa las medidas operativas de paso ágil en los Puestos Fronterizos Integrados.",
                "Comprueba los avances en la interconexión informática entre las aduanas de Centroamérica.",
                "Implementa las mejores prácticas logísticas de despacho anticipado recomendadas por la SIECA."
            ],
            "resultadoObtenido": "Guía informativa de los compromisos regionales en agilización y reducción de tiempos de despacho fronterizo.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las medidas de la estrategia regional se implementan progresivamente en los puestos fronterizos terrestres.",
            "normativa": "Resolución COMIECO No. 372-2015; Protocolo de Guatemala al Tratado General de Integración Económica."
        },
        "SAT-GES-0523": {
            "nombreActual": "Consultar informes y estadísticas de comercio exterior aduanero",
            "descripcion": "Consulta los boletines informativos, estadísticas de recaudación y flujos de comercio internacional elaborados periódicamente por la Intendencia de Aduanas. Permite analizar volúmenes de importación, principales socios y balanza comercial.",
            "requisitos": [
                "Dispositivo con acceso a internet para descargar reportes estadísticos en Excel y PDF."
            ],
            "documentos": [
                "Boletines regionales de comercio exterior y tableros estadísticos aduaneros oficiales."
            ],
            "pasos": [
                "Accede a la sección de Información de Comercio Internacional en el portal de Aduanas de la SAT.",
                "Selecciona el período mensual o anual a consultar.",
                "Descarga los reportes consolidados de recaudación por aduana, vía de transporte y régimen comercial.",
                "Utiliza los datos oficiales para estudios de mercado y planificación logística empresarial."
            ],
            "resultadoObtenido": "Reportes estadísticos oficiales y confiables sobre el comportamiento del comercio exterior guatemalteco.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Los datos estadísticos oficiales son de acceso público conforme a los estándares de gobierno abierto.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Ley de Acceso a la Información Pública (Decreto 57-2008)."
        },
        "SAT-GES-0518": {
            "nombreActual": "Consultar preguntas frecuentes sobre operaciones aduaneras generales",
            "descripcion": "Resuelve dudas frecuentes sobre menaje de casa, importación de vehículos, equipaje de viajeros, donaciones y aranceles preferenciales. Proporciona respuestas oficiales en lenguaje ciudadano para facilitar la autogestión de usuarios.",
            "requisitos": [
                "Conexión a internet para consultar el repositorio institucional de preguntas frecuentes."
            ],
            "documentos": [
                "No requiere documentos; es una herramienta informativa digital."
            ],
            "pasos": [
                "Ingresa a 'Preguntas Frecuentes sobre Temas Aduaneros' en el Portal SAT.",
                "Selecciona el tema de interés (viajeros, importaciones menores, compras por internet o aduanas).",
                "Revisa la respuesta oficial con los requisitos y montos de exención aplicables.",
                "En caso de dudas operativas adicionales, utiliza el canal de atención por chat en vivo de la SAT."
            ],
            "resultadoObtenido": "Orientación inmediata sobre formalidades y procedimientos habituales del servicio aduanero.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las respuestas de preguntas frecuentes son de carácter informativo; prevalece la ley aduanera en resoluciones formales.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Código Tributario Artículo 101."
        },
        "SAT-GES-0521": {
            "nombreActual": "Consultar medidas del Acuerdo de Facilitación del Comercio (AFC - OMC)",
            "descripcion": "Conoce los compromisos, mesas técnicas y avances de Guatemala en el cumplimiento del Acuerdo de Facilitación del Comercio de la OMC. Incluye medidas de ventanilla única, resoluciones anticipadas, agilización de envíos y pago electrónico.",
            "requisitos": [
                "Dispositivo con acceso a internet para revisar las publicaciones de facilitación aduanera."
            ],
            "documentos": [
                "Texto del Acuerdo de Facilitación del Comercio de la Organización Mundial del Comercio (OMC).",
                "Plan de Acción del Comité Nacional de Facilitación del Comercio (CONAFAC)."
            ],
            "pasos": [
                "Accede a la sección de 'Facilitación de Comercio' en el Portal SAT.",
                "Revisa las publicaciones sobre reducción de tiempos de despacho y despacho anticipado.",
                "Consulta los informes de las mediciones de tiempos de levante (Time Release Study - TRS).",
                "Participa en las mesas de diálogo y propuestas a través de los gremios del sector privado."
            ],
            "resultadoObtenido": "Información oficial sobre los estándares internacionales de simplificación aduanera aplicados en el país.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las medidas del AFC buscan reducir los costos logísticos y los tiempos de frontera en beneficio del comercio formal.",
            "normativa": "Acuerdo de Facilitación del Comercio de la OMC (Decreto 1-2017 del Congreso de la República)."
        },
        "SAT-GES-0517": {
            "nombreActual": "Inscribirse en el curso virtual básico de comercio exterior",
            "descripcion": "Inscríbete en el curso virtual introductorio impartido por la SAT sobre importación, exportación, regímenes aduaneros e impuestos al comercio exterior. Brinda fundamentos esenciales para nuevos emprendedores y operadores logísticos.",
            "requisitos": [
                "Correo electrónico activo personal o laboral.",
                "Computadora o tableta con acceso a internet para el aula virtual de Cultura Tributaria.",
                "Interés en aprender los procesos básicos de la gestión aduanera en Guatemala."
            ],
            "documentos": [
                "Formulario digital de inscripción completado en la plataforma de Cultura Tributaria SAT."
            ],
            "pasos": [
                "Ingresa a la oferta de cursos virtuales de comercio exterior en el portal de la SAT.",
                "Selecciona el curso introductorio y completa el formulario con tus datos de contacto.",
                "Recibe tus credenciales y avanza en los módulos multimedia a tu propio ritmo.",
                "Aprueba la evaluación final para obtener y descargar tu certificado digital de aprovechamiento."
            ],
            "resultadoObtenido": "Constancia de aprobación emitida por el Departamento de Cultura Tributaria y Capacitación de la SAT.",
            "tiempoEstimado": "Autogestionado (15 horas académicas estimadas)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Completar satisfactoriamente el curso otorga conocimientos indispensables para evitar multas por malas prácticas operativas.",
            "normativa": "Ley Orgánica de la SAT Artículo 3 literal h); Política de Educación Fiscal y Aduanera."
        },
        "SAT-GES-0519": {
            "nombreActual": "Consultar normas técnicas de valoración aduanera y reglas de origen",
            "descripcion": "Accede a las disposiciones técnicas para la determinación del valor en aduana según el Acuerdo del Valor del GATT/OMC y los criterios de origen preferencial. Garantiza la correcta declaración de la base imponible y el cálculo de aranceles.",
            "requisitos": [
                "Navegador web con acceso a internet para descargar manuales y normas técnicas de valoración.",
                "Facturas comerciales de compra con desglose de flete y seguro para valoración CIF."
            ],
            "documentos": [
                "Acuerdo relativo a la aplicación del Artículo VII del Acuerdo General sobre Aranceles Aduaneros y Comercio (GATT de 1994).",
                "Normas de Valoración Aduanera del CAUCA y RECAUCA."
            ],
            "pasos": [
                "Ingresa a la sección de 'Valoración, Clasificación y Origen' en el Portal SAT.",
                "Revisa la prelación de los 6 métodos de valoración aduanera (Método del Valor de Transacción como regla primordial).",
                "Consulta los criterios de ajustes positivos y negativos al valor de factura (fletes, seguros, comisiones y regalías).",
                "Aplica los lineamientos normados para defender el valor en aduana ante posibles dudas de valor razonable."
            ],
            "resultadoObtenido": "Guía técnica oficial para la determinación exacta de la base imponible aduanera y el origen de las mercancías.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Declarar un valor en factura inferior al efectivamente pagado constituye defraudación aduanera y falsedad en declaración jurada.",
            "normativa": "Acuerdo sobre Valoración de la OMC; CAUCA Artículos 20 al 22; RECAUCA Artículos 186 al 215."
        },
        "SAT-GES-0520": {
            "nombreActual": "Consultar tratados de libre comercio y acuerdos comerciales vigentes",
            "descripcion": "Accede a la recopilación oficial de los Tratados de Libre Comercio (TLC) y Acuerdos de Alcance Parcial suscritos por Guatemala y ratificados por el Congreso. Permite verificar cronogramas de desgravación, reglas de origen específicas y contingentes.",
            "requisitos": [
                "Dispositivo con acceso a internet para consultar los textos íntegros de los tratados comerciales.",
                "Conocer el país de origen de la mercancía y la partida arancelaria SAC."
            ],
            "documentos": [
                "Textos de tratados comerciales: DR-CAFTA, Centroamérica, TLC México, Unión Europea (ADA), Colombia, Panamá, Taiwán, etc."
            ],
            "pasos": [
                "Ingresa al apartado de 'Tratados y Acuerdos Comerciales' en el Portal SAT.",
                "Selecciona el tratado comercial correspondiente al país de procedencia de la mercancía.",
                "Consulta el Anexo de Reglas de Origen Específicas para verificar si tu producto califica como originario.",
                "Revisa el cronograma de desgravación arancelaria para confirmar el porcentaje de arancel cero aplicable."
            ],
            "resultadoObtenido": "Acceso libre a los textos legales oficiales de los acuerdos comerciales y certificados de origen válidos.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Un certificado de origen con errores formales en el criterio de origen o firmado por persona no facultada invalida la preferencia arancelaria.",
            "normativa": "Tratados de Libre Comercio ratificados por Guatemala; Código Aduanero Uniforme Centroamericano."
        },

        # -------------------------------------------------------------
        # 3. PREVENCIÓN DE CONTRABANDO Y DEFRAUDACIÓN (3 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0524": {
            "nombreActual": "Presentar denuncia confidencial por contrabando o defraudación aduanera",
            "descripcion": "Canaliza denuncias anónimas o identificadas sobre ingresos ilegales de mercancías, falsificación de documentos aduaneros o bodegas clandestinas. Permite a la ciudadanía colaborar en la protección de la economía y la salud pública de forma segura.",
            "requisitos": [
                "Información fidedigna sobre el hecho ilícito (ubicación de la bodega, aduana involucrada, placas de vehículos o modo de operar).",
                "Fotografías, videos, comprobantes o documentos que sirvan como indicio probatorio, de ser posible.",
                "No se exige identificación personal; la denuncia puede ser 100% anónima."
            ],
            "documentos": [
                "Formulario de denuncia en línea completado en el portal de la SAT.",
                "Pruebas documentales, fotografías o archivos digitales adjuntos (opcional)."
            ],
            "pasos": [
                "Ingresa a la sección de 'Denuncias de Contrabando' en el Portal SAT.",
                "Describe de manera pormenorizada los hechos, personas o empresas involucradas y ubicación exacta del ilícito.",
                "Adjunta evidencias fotográficas o documentos de soporte que respalden tu denuncia.",
                "Presiona 'Enviar Denuncia' y recibe un código confidencial para dar seguimiento al estado de la investigación."
            ],
            "resultadoObtenido": "Constancia de denuncia confidencial registrada y remitida a la Gerencia de Investigación Aduanera y Ministerio Público.",
            "tiempoEstimado": "5 a 10 minutos para presentar la denuncia (investigación conforme a protocolos judiciales)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La SAT y la Comisión Nacional contra el Contrabando (CONACON) garantizan la estricta reserva y confidencialidad de la identidad del denunciante.",
            "normativa": "Ley Contra la Defraudación y el Contrabando Aduaneros (Decreto 58-90); Código Tributario Artículo 90."
        },
        "SAT-GES-0526": {
            "nombreActual": "Consultar la Política Nacional de Combate al Contrabando Aduanero",
            "descripcion": "Accede al documento rector de las estrategias, operativos interinstitucionales y metas del Estado de Guatemala para frenar el contrabando aduanero. Describe las acciones conjuntas del Consejo Nacional Interinstitucional (CONACON).",
            "requisitos": [
                "Dispositivo con acceso a internet para descargar informes y políticas públicas en PDF."
            ],
            "documentos": [
                "Documento oficial de la Política Nacional de Prevención y Combate de la Defraudación y el Contrabando Aduaneros."
            ],
            "pasos": [
                "Ingresa al apartado de políticas públicas y noticias institucionales en el Portal SAT.",
                "Descarga la Política Nacional contra el Contrabando aprobada por el Gobierno de la República.",
                "Conoce los operativos en pasos ciegos fronterizos, controles en carreteras y destrucción de productos incautados.",
                "Infórmate sobre los programas de formalización comercial para comerciantes fronterizos."
            ],
            "resultadoObtenido": "Documento oficial con las directrices estratégicas de seguridad fiscal y combate al comercio ilícito.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Comprar, distribuir o comercializar mercancías de contrabando conlleva penas de prisión de hasta 10 años y comiso definitivo de los bienes.",
            "normativa": "Decreto 58-90 del Congreso de la República; Acuerdo Gubernativo de creación de CONACON."
        },
        "SAT-GES-0525": {
            "nombreActual": "Inscribirse en el curso sobre consecuencias del contrabando aduanero",
            "descripcion": "Inscríbete en el taller interactivo virtual sobre las repercusiones penales, económicas y de salud del contrabando y la defraudación en Guatemala. Sensibiliza sobre los riesgos legales y el impacto en la pérdida de empleos formales.",
            "requisitos": [
                "Correo electrónico activo para acceder al aula virtual de Cultura Tributaria.",
                "Computadora o teléfono con internet para completar los módulos interactivos."
            ],
            "documentos": [
                "Registro digital en la plataforma de capacitaciones de la SAT."
            ],
            "pasos": [
                "Accede al catálogo de cursos virtuales en el portal de Cultura Tributaria SAT.",
                "Inscríbete en el curso '10 Consecuencias de la Defraudación y el Contrabando Aduanero'.",
                "Participa en los módulos didácticos que abordan sanciones penales, comiso y daño a la economía.",
                "Supera el cuestionario final para descargar tu constancia oficial de acreditación ciudadana."
            ],
            "resultadoObtenido": "Certificado digital de aprovechamiento emitido por la Superintendencia de Administración Tributaria.",
            "tiempoEstimado": "Autogestionado (10 horas académicas)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "El curso explica detalladamente cómo la adquisición de mercancías sin factura expone a los negocios a cierres temporales y procesos penales.",
            "normativa": "Ley Contra la Defraudación y el Contrabando Aduaneros (Decreto 58-90); Ley Orgánica de la SAT."
        }
    }

    updated_count = 0
    for item in data:
        tid = item.get('id')
        if tid in enrichment:
            ed = enrichment[tid]
            for k, v in ed.items():
                item[k] = v
            updated_count += 1

    print(f"Enriched {updated_count} Normativa Part 1 items.")

    with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    enrich_normativa_p1()
