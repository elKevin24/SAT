# -*- coding: utf-8 -*-
"""
Enrichment script for Normativa y Operaciones Aduaneras Generales - Part 2 (32 gestiones):
- Consultas Técnicas, Recursos y Valoración (14 gestiones)
- Modernización e Infraestructura Aduanera (18 gestiones)
Adhering to ATO UX Writing standards, Regla 12, and SAT Guatemala regulations.
"""

import json

def enrich_normativa_p2():
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    enrichment = {
        # -------------------------------------------------------------
        # 1. CONSULTAS TÉCNICAS, RECURSOS Y VALORACIÓN (14 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0527": {
            "nombreActual": "Ampliar información de una consulta técnica tributaria o aduanera",
            "descripcion": "Aporta información complementaria, peritajes técnicos o antecedentes adicionales a una consulta tributaria o aduanera previamente formulada ante la SAT. Permite a la autoridad emitir un criterio más preciso y exhaustivo sobre la materia.",
            "requisitos": [
                "Contar con el número correlativo de consulta técnica asignado por el sistema institucional.",
                "Estar dentro del plazo fijado por la SAT en caso de responder a una providencia de requerimiento de información.",
                "Identificación del titular, agente aduanero o representante legal consultante."
            ],
            "documentos": [
                "Memorial o formulario digital de ampliación de consulta.",
                "Fichas técnicas, catálogos, muestras de laboratorio o facturas de respaldo en formato PDF."
            ],
            "pasos": [
                "Ingresa a la sección de 'Ampliación de Consulta' en el portal de contacto de la SAT.",
                "Digita el número de gestión y la clave de seguimiento otorgada inicialmente.",
                "Adjunta los nuevos argumentos jurídicos y los archivos de respaldo técnico requeridos.",
                "Presiona 'Enviar Ampliación' y descarga el acuse electrónico de recepción conforme."
            ],
            "resultadoObtenido": "Acuse digital de recepción que incorpora los nuevos elementos de juicio al expediente de consulta técnica.",
            "tiempoEstimado": "5 a 10 minutos (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No responder a una solicitud de ampliación formulada por la SAT dentro del plazo conferido causa el archivo de la consulta sin pronunciamiento de fondo.",
            "normativa": "Código Tributario (Decreto 6-91) Artículo 102; Ley de lo Contencioso Administrativo."
        },
        "SAT-GES-0528": {
            "nombreActual": "Presentar consulta técnica vinculante tributaria o aduanera",
            "descripcion": "Plantea formalmente ante la SAT una duda sobre la interpretación de normas tributarias o arancelarias aplicables a una operación o contrato concreto. Otorga certeza jurídica vinculante que exime de sanciones e intereses si el contribuyente actúa conforme al criterio emitido.",
            "requisitos": [
                "Tener interés directo, personal y legítimo en la situación tributaria o aduanera concreta a dilucidar.",
                "Estar inscrito en el RTU con datos ratificados y solvencia fiscal.",
                "Exponer con claridad los hechos reales y concretos, acompañando los contratos o antecedentes correspondientes.",
                "Firma del contribuyente o representante legal auxiliado por abogado colegiado activo."
            ],
            "documentos": [
                "Memorial de consulta técnica formal debidamente razonado y fundado en derecho.",
                "Copia de los contratos, facturas, proyectos de inversión o antecedentes objeto de la duda legal.",
                "Copia de DPI del compareciente y nombramiento de personería jurídica."
            ],
            "pasos": [
                "Ingresa el memorial de consulta técnica a través del módulo web de contacto o en la ventanilla de recepción de Torre SAT.",
                "La Gerencia de Asuntos Jurídicos o Intendencia de Aduanas califica la procedencia y asigna el expediente a un analista técnico.",
                "La unidad analiza el marco legal, antecedentes doctrinales y jurisprudencia administrativa aplicable.",
                "Recibe la resolución formal debidamente notificada con el criterio institucional vinculante para el caso concreto."
            ],
            "resultadoObtenido": "Resolución administrativa con criterio técnico vinculante que otorga certeza y seguridad jurídica a la operación consultada.",
            "tiempoEstimado": "30 a 45 días hábiles",
            "costo": "Gratuito ante SAT (honorarios de asesoría legal por cuenta del consultante)",
            "advertencia": "La consulta no suspende el cómputo de plazos legales para el cumplimiento de obligaciones tributarias ni exime de presentar declaraciones corrientes.",
            "normativa": "Código Tributario Artículos 102 y 103 (Consultas y Efectos de la Resolución)."
        },
        "SAT-GES-0529": {
            "nombreActual": "Formular consulta ciudadana tributaria o aduanera en línea",
            "descripcion": "Envía consultas generales sobre orientación de gestiones, requisitos, calendarios de pago y uso de plataformas informáticas de la SAT. Permite a ciudadanos y operadores resolver dudas cotidianas con asistencia directa de analistas del centro de contacto.",
            "requisitos": [
                "Dispositivo con acceso a internet para ingresar al formulario web institucional.",
                "Correo electrónico activo para recibir la respuesta oficial de la administración.",
                "Describir la duda u operación de manera clara y concreta."
            ],
            "documentos": [
                "No requiere documentación; es un servicio de orientación ciudadana abierta."
            ],
            "pasos": [
                "Accede al formulario de 'Información y Consultas' en el portal web de la SAT.",
                "Selecciona el tema de tu interés (Aduanas, Vehículos, RTU, Declaraguate o Facturación FEL).",
                "Escribe tu consulta detallando los antecedentes esenciales y consigna tu correo electrónico.",
                "Recibe el número de ticket de atención y la respuesta por correo electrónico en un plazo ágil."
            ],
            "resultadoObtenido": "Respuesta institucional con la orientación técnica y enlaces a las guías o normativas aplicables.",
            "tiempoEstimado": "Respuesta en 24 a 48 horas hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las respuestas a consultas ciudadanas tienen carácter meramente orientativo y no constituyen dictamen vinculante para litigios judiciales.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Constitución Política Artículo 28 (Derecho de Petición)."
        },
        "SAT-GES-0530": {
            "nombreActual": "Consultar estatus de ticket de consulta técnica tributaria o aduanera",
            "descripcion": "Verifica en línea el estado de avance, analista asignado y respuestas emitidas a solicitudes de información y tickets ingresados a la SAT. Brinda trazabilidad en tiempo real a las peticiones ciudadanas y profesionales.",
            "requisitos": [
                "Número de ticket o código correlativo de consulta asignado al momento del registro.",
                "Correo electrónico registrado en la solicitud."
            ],
            "documentos": [
                "Boleta o acuse digital del ticket de consulta emitido por el sistema institucional."
            ],
            "pasos": [
                "Ingresa a la herramienta 'Revisión de Estado de Consulta' en el portal web de la SAT.",
                "Digita el número de ticket y tu dirección de correo electrónico.",
                "Presiona 'Consultar' para visualizar si el requerimiento está en análisis, requiere ampliación o ha sido resuelto.",
                "Descarga la respuesta oficial o ingresa información adicional si el analista formuló una pregunta."
            ],
            "resultadoObtenido": "Pantalla informativa con el estatus del requerimiento y descarga de la respuesta técnica institucional.",
            "tiempoEstimado": "Inmediato (consulta interactiva)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Revisa periódicamente la bandeja de correo no deseado (spam) para asegurarte de no perder notificaciones de respuesta.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Ley de Acceso a la Información Pública."
        },
        "SAT-GES-0536": {
            "nombreActual": "Consultar proyectos del Programa de Modernización Integral Aduanera (MIAD)",
            "descripcion": "Conoce los proyectos, componentes de inversión y cronogramas de modernización de aduanas, puestos fronterizos y puertos de Guatemala. Informa sobre la automatización de garitas, drones de inspección, escáneres y aduana sin papeles.",
            "requisitos": [
                "Conexión a internet para consultar los avances del programa de modernización en el Portal SAT."
            ],
            "documentos": [
                "Documentos marco e informes de resultados del Programa MIAD de la Intendencia de Aduanas."
            ],
            "pasos": [
                "Accede a la sección del Programa de Modernización Integral Aduanera en el Portal SAT.",
                "Explora los 5 componentes: Procesos, Tecnología, Infraestructura, Recursos Humanos y Seguridad.",
                "Revisa las memorias de implementación de marchamo electrónico, básculas y arancel digital.",
                "Consulta los estándares técnicos exigidos para la homologación de recintos fiscales privados."
            ],
            "resultadoObtenido": "Información pública sobre las reformas estructurales e innovaciones tecnológicas del servicio aduanero nacional.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las nuevas disposiciones técnicas del programa MIAD son de adopción progresiva y obligatoria para todos los auxiliares aduaneros.",
            "normativa": "Acuerdos de Directorio SAT 07-2019 y 08-2022; Estrategia Nacional de Modernización Aduanera."
        },
        "SAT-GES-0537": {
            "nombreActual": "Confirmar declaraciones de mercancías en aduana",
            "descripcion": "Solicita la ratificación y confirmación oficial de datos de declaraciones de importación o exportación que requieran validación formal de salida o pago. Permite subsanar inconsistencias informáticas para el cierre de operaciones aduaneras.",
            "requisitos": [
                "Número de Declaración Única Centroamericana (DUCA) validada y liquidada.",
                "Acceso a la Agencia Virtual de la SAT o comparecencia ante la administración de aduana correspondiente.",
                "Ser el importador, exportador o agente aduanero registrado en la declaración."
            ],
            "documentos": [
                "Ejemplar de la declaración aduanera y comprobantes de pago de tributos.",
                "Documentos de transporte y manifiesto aduanero asociado."
            ],
            "pasos": [
                "Ingresa al módulo de confirmación de declaraciones en el portal aduanero o preséntate a la aduana de despacho.",
                "Introduce el número de declaración y los datos del medio de transporte.",
                "El oficial técnico verifica en el sistema el cruce de zarpe, salida de garita o liquidación de tributos.",
                "Se asienta la confirmación informática definitiva que cierra la operación en los registros de la SAT."
            ],
            "resultadoObtenido": "Constancia de confirmación aduanera que acredita el cierre legal y definitivo de la declaración de mercancías.",
            "tiempoEstimado": "1 a 2 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No confirmar declaraciones sujetas a regímenes suspensivos dentro del término de ley deja abierta la cuenta corriente y expone a multas.",
            "normativa": "Procedimiento de Despacho de Mercancías PR-IAD/DNO-DE-01; RECAUCA Artículo 320."
        },
        "SAT-GES-0538": {
            "nombreActual": "Llenar la Declaración Jurada Regional de Viajero en línea",
            "descripcion": "Llena y transmite de forma digital la declaración jurada aduanera obligatoria para personas individuales que ingresan o salen del país por vía aérea, marítima o terrestre. Permite reportar equipaje, dinero en efectivo o mercancías afectas a tributos.",
            "requisitos": [
                "Pasaporte vigente del viajero o documento de identificación oficial en caso de ciudadanos centroamericanos.",
                "Boleto aéreo, itinerario de viaje o datos del vuelo o transporte de ingreso/salida.",
                "Declarar obligatoriamente montos en dinero en efectivo, cheques o títulos al portador que igualen o superen diez mil dólares estadounidenses (US$10,000.00)."
            ],
            "documentos": [
                "Formulario electrónico de Declaración Jurada Regional de Viajero completado en línea.",
                "Facturas de compras efectuadas en el extranjero que superen la franquicia libre de tributos (US$500.00)."
            ],
            "pasos": [
                "Ingresa a la aplicación 'Declaración Jurada Regional de Viajero' en el Portal SAT antes de abordar tu viaje.",
                "Completa los datos de identidad, motivo del viaje, procedencia y detalle del equipaje acompañado.",
                "Declara si transportas mercancías distintas al equipaje personal o dinero en efectivo superior a US$10,000.00.",
                "El sistema genera un código QR de confirmación; muéstralo en tu teléfono móvil al oficial aduanero en el punto de control."
            ],
            "resultadoObtenido": "Código QR oficial de declaración aduanera de viajero para paso ágil en los aeropuertos y aduanas del país.",
            "tiempoEstimado": "5 a 10 minutos (llenado digital previo al viaje)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Omitir la declaración de montos superiores a US$10,000.00 en efectivo conlleva la incautación preventiva inmediata del dinero y proceso penal por lavado de dinero.",
            "normativa": "Ley Contra el Lavado de Dinero u Otros Activos (Decreto 67-2001) Artículo 25; RECAUCA Artículos 578 al 588."
        },
        "SAT-GES-0539": {
            "nombreActual": "Participar en subastas públicas y donaciones aduaneras de mercancías",
            "descripcion": "Consulta las convocatorias oficiales, catálogos de lotes y bases de participación para el remate público de mercancías declaradas en abandono o decomisadas en aduanas. Permite a personas y empresas adquirir bienes bajo concurso público transparente.",
            "requisitos": [
                "Ser persona individual o jurídica legalmente capaz, inscrita en el RTU con solvencia fiscal.",
                "Efectuar el depósito previo de garantía en Declaraguate (formulario SAT-8008) por el porcentaje fijado en las bases de la subasta.",
                "No estar inhabilitado para participar en compras estatales ni ser funcionario de la SAT."
            ],
            "documentos": [
                "Documento Personal de Identificación (DPI) o pasaporte original y copia.",
                "Boleta bancaria de depósito de garantía de participación (10% a 25% del valor base del lote).",
                "Formulario de inscripción de postor suscrito por el participante."
            ],
            "pasos": [
                "Ingresa a la sección de 'Subastas y Donaciones Aduaneras' en el Portal SAT y descarga las bases de la convocatoria.",
                "Acude a los recintos fiscales en las fechas de exhibición pública para inspeccionar el estado físico de los lotes.",
                "Paga la boleta de garantía de postura en Declaraguate y regístrate como postor en el evento.",
                "Participa en la puja pública presencial o electrónica; si ganas el lote, cancela el saldo final para recibir la resolución de adjudicación."
            ],
            "resultadoObtenido": "Resolución de adjudicación en subasta aduanera y factura oficial que acredita la propiedad legítima libre de gravámenes.",
            "tiempoEstimado": "Conforme al cronograma de cada convocatoria de subasta pública",
            "costo": "Valor adjudicado en la puja pública más aranceles e impuestos correspondientes",
            "advertencia": "Los bienes subastados se adjudican en el estado en que se encuentran; la SAT no asume garantías sobre el funcionamiento mecánico o eléctrico de los productos.",
            "normativa": "CAUCA Artículos 118 al 120; RECAUCA Artículos 601 al 617 (Procedimiento de Subasta Aduanera)."
        },
        "SAT-GES-0540": {
            "nombreActual": "Suscribir el pacto de integridad y ética aduanera",
            "descripcion": "Formaliza el compromiso ético voluntario entre operadores de comercio exterior y la SAT para prevenir el soborno, la corrupción y el contrabando aduanero. Promueve la transparencia y las buenas prácticas comerciales en puertos y aduanas.",
            "requisitos": [
                "Empresa, gremial, transportista o auxiliar aduanero formalmente establecido en el país.",
                "Estar inscrito en el RTU y al día en el pago de tributos con solvencia fiscal vigente.",
                "Adhesión expresa al Código de Ética y Conducta de la Superintendencia de Administración Tributaria."
            ],
            "documentos": [
                "Carta de manifestación de interés y adhesión firmada por la máxima autoridad o representante legal de la empresa.",
                "Copia de nombramiento debidamente inscrito en el Registro Mercantil."
            ],
            "pasos": [
                "Ingresa a la sección del Pacto de Integridad en el portal web de la SAT.",
                "Descarga el modelo de carta de adhesión y los principios rectores de ética aduanera.",
                "Firma el documento y remítelo a la Unidad de Probidad y Conducta de la SAT.",
                "Participa en el acto protocolario de suscripción y recibe el distintivo de empresa comprometida con la integridad aduanera."
            ],
            "resultadoObtenido": "Constancia de suscripción del Pacto de Integridad Aduanera y reconocimiento institucional como socio ético.",
            "tiempoEstimado": "10 a 15 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Incurrir en actos de soborno a funcionarios o falsedad anula de inmediato la vigencia del pacto y activa denuncias penales en el Ministerio Público.",
            "normativa": "Convención de las Naciones Unidas contra la Corrupción; Código de Ética y Conducta de la SAT."
        },
        "SAT-GES-0534": {
            "nombreActual": "Actualizar datos tributarios y de comercio exterior en Agencia Virtual",
            "descripcion": "Actualiza la dirección de notificación, correos electrónicos, actividades económicas y representantes legales en el Registro Tributario Unificado (RTU). Garantiza la validez legal de las notificaciones aduaneras y la vigencia del padrón de importadores.",
            "requisitos": [
                "Usuario y clave de acceso a la Agencia Virtual de la SAT.",
                "Tener a mano el Documento Personal de Identificación (DPI) escaneado de ambos lados en formato PDF.",
                "Comprobante reciente de servicio de agua, luz o teléfono que respalde el cambio de domicilio fiscal.",
                "Nombramiento del representante legal inscrito en el Registro Mercantil si se modifica la personería."
            ],
            "documentos": [
                "DPI del contribuyente o representante legal en formato digital legible.",
                "Factura de servicios básicos (luz o agua) con antigüedad no mayor a tres meses.",
                "Acta notarial de nombramiento debidamente razonada."
            ],
            "pasos": [
                "Inicia sesión en la Agencia Virtual y selecciona 'Servicios Tributarios' > 'Actualización de Datos RTU'.",
                "Modifica los campos necesarios (domicilio fiscal, correo para notificaciones, actividades aduaneras o sucursales).",
                "Adjunta los documentos de soporte escaneados en formato PDF nítido.",
                "Firma la solicitud electrónicamente y recibe en tu correo el aviso de confirmación de datos ratificados."
            ],
            "resultadoObtenido": "Constancia electrónica del RTU actualizada que mantiene vigente el estatus para operar en aduanas.",
            "tiempoEstimado": "1 a 2 días hábiles para validación documental",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No actualizar los datos del RTU dentro de los 30 días siguientes a cualquier cambio constituye falta sancionada con multa formal de Q100.00 por día de retraso.",
            "normativa": "Código Tributario Artículo 120; Acuerdo de Directorio SAT 08-2010."
        },
        "SAT-GES-0535": {
            "nombreActual": "Consultar compendio digital de legislación aduanera de Guatemala",
            "descripcion": "Accede a la biblioteca digital oficial de leyes, reglamentos, tratados y resoluciones de intendencia en materia aduanera y de comercio exterior. Facilita la consulta jurídica rigurosa para litigios, despachos y auditorías fiscales.",
            "requisitos": [
                "Navegador de internet estándar con capacidad para visualizar o guardar archivos en PDF.",
                "Identificar la ley o materia aduanera de interés."
            ],
            "documentos": [
                "Compilaciones oficiales del CAUCA, RECAUCA, Ley Nacional de Aduanas y Resoluciones de la Intendencia de Aduanas."
            ],
            "pasos": [
                "Ingresa a la sección 'Biblioteca en Línea SAT' > 'Legislación Aduanera'.",
                "Utiliza el buscador por número de decreto o palabra técnica.",
                "Selecciona el documento oficial y descárgalo con su historial de reformas incorporado.",
                "Utiliza los textos legales oficiales para sustentar peticiones ante la administración pública."
            ],
            "resultadoObtenido": "Documentos normativos oficiales y vigentes con validez legal garantizada.",
            "tiempoEstimado": "Inmediato (consulta pública 24/7)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Asegúrate de revisar siempre la versión consolidada más reciente publicada en el portal para evitar citar artículos reformados o derogados.",
            "normativa": "Constitución Política Artículo 171; Código Tributario Artículo 3."
        },
        "SAT-GES-0531": {
            "nombreActual": "Solicitar devolución de pagos indebidos en operaciones aduaneras",
            "descripcion": "Gestiona en línea la restitución de tributos aduaneros, derechos arancelarios o multas cancelados por error de cálculo o cobro improcedente. Permite acreditar el reembolso directo en cuenta bancaria previa auditoría técnica de la SAT.",
            "requisitos": [
                "Estar inscrito en el RTU con solvencia fiscal y datos plenamente actualizados.",
                "Disponer de acceso a la Agencia Virtual de la SAT.",
                "Comprobar fehacientemente el pago duplicado o erróneo mediante las boletas bancarias y declaraciones aduaneras.",
                "Haber rectificado previamente la declaración aduanera (DUCA) que originó el pago objeto de reclamo."
            ],
            "documentos": [
                "Formulario digital SAT-2410 de Devolución de Pagos Indebidos completado en Agencia Virtual.",
                "Comprobantes bancarios de pago original y del pago correcto (formularios SAT-8008 o SAT-8011).",
                "DUCA rectificada y resolución aduanera favorable que ampara el saldo a favor.",
                "Estado de cuenta bancario donde conste el número de cuenta y titular para la transferencia electrónica."
            ],
            "pasos": [
                "Ingresa a la Agencia Virtual y selecciona 'Servicios del Contribuyente' > 'Solicitud de Devolución de Pagos Indebidos' (Formulario 2410).",
                "Captura los datos del pago erróneo y adjunta en formato PDF los comprobantes bancarios y DUCAs rectificadas.",
                "Presiona 'Enviar Solicitud' y recibe el correo electrónico de acuse de recepción formal con número de expediente.",
                "Los auditores de la Unidad de Devoluciones analizan la documentación y emiten la resolución administrativa correspondiente.",
                "La SAT realiza la transferencia electrónica bancaria del importe reconocido a la cuenta del titular."
            ],
            "resultadoObtenido": "Resolución de devolución y acreditación bancaria del saldo tributario indebidamente pagado.",
            "tiempoEstimado": "30 a 60 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "El derecho a reclamar la devolución de pagos indebidos prescribe a los cuatro años contados a partir de la fecha en que se efectuó el pago ante el banco.",
            "normativa": "Código Tributario Artículos 153 y 153 'A'; CAUCA Artículo 62."
        },
        "SAT-GES-0532": {
            "nombreActual": "Consultar procedimientos y requisitos de recursos administrativos aduaneros",
            "descripcion": "Consulta las directrices normadas, plazos y requisitos para interponer el recurso de revocatoria y recursos de apelación en materia de aduanas. Garantiza la defensa técnica y el debido proceso frente a determinaciones y multas de la autoridad.",
            "requisitos": [
                "Conexión a internet para consultar los manuales procedimentales de recursos en el Portal SAT.",
                "Haber sido notificado de una resolución o pliego de cargos aduaneros."
            ],
            "documentos": [
                "Directrices de la Gerencia de Asuntos Jurídicos sobre tramitación de recursos de revocatoria aduaneros."
            ],
            "pasos": [
                "Accede a la sección de 'Recursos Aduaneros' en el Portal SAT.",
                "Revisa el flujograma de impugnaciones administrativas y los plazos improrrogables fijados por la ley.",
                "Descarga la guía de requisitos formales que debe contener el memorial de revocatoria.",
                "Coordina la redacción del recurso con un abogado colegiado activo antes del vencimiento del término."
            ],
            "resultadoObtenido": "Guía práctica oficial con los requisitos legales para la adecuada formulación de defensas aduaneras.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La interposición del recurso en tiempo suspende la obligación de pago hasta que la resolución cause estado definitivo en vía administrativa.",
            "normativa": "CAUCA Artículo 127; Código Tributario Artículo 154; Ley de lo Contencioso Administrativo."
        },
        "SAT-GES-0533": {
            "nombreActual": "Interponer recurso de revocatoria contra resoluciones de aduanas",
            "descripcion": "Presenta el memorial formal de impugnación legal contra resoluciones lesivas emitidas por aduanas o intendencias tributarias. Permite elevar el caso ante el Tribunal Administrativo Tributario y Aduanero (TRIBUTA) para su revisión imparcial.",
            "requisitos": [
                "Haber sido legalmente notificado de la resolución aduanera, ajuste o sanción que se impugna.",
                "Presentar el recurso dentro del plazo perentorio e improrrogable de diez (10) días hábiles siguientes a la notificación.",
                "Acreditar la personería jurídica del recurrente mediante mandato o nombramiento debidamente inscrito.",
                "Auxilio obligatorio de abogado colegiado activo."
            ],
            "documentos": [
                "Memorial formal de interposición del recurso de revocatoria firmado por el compareciente y su abogado patrocinante.",
                "Cédula de notificación del acto administrativo recurrido.",
                "Pruebas documentales, peritajes o antecedentes aduaneros que sustenten la inexistencia del ajuste o falta.",
                "Nombramiento del representante legal o mandato especial con representación."
            ],
            "pasos": [
                "Verifica la fecha exacta en la cédula de notificación y calcula el plazo fatal de 10 días hábiles.",
                "Redacta el memorial de revocatoria fundamentando detalladamente los agravios de hecho y de derecho.",
                "Presenta el memorial y sus copias en la aduana de origen o en la ventanilla de recepción de la SAT.",
                "La autoridad aduanera concede o deniega el trámite del recurso en un plazo de 15 días hábiles.",
                "Si es concedido, el expediente se eleva ante el Tribunal TRIBUTA para la emisión de la resolución final de segunda instancia."
            ],
            "resultadoObtenido": "Recepción formal del recurso de revocatoria que suspende el cobro y apertura la fase de resolución ante el tribunal superior.",
            "tiempoEstimado": "30 a 60 días hábiles para resolución de segunda instancia por el Directorio/TRIBUTA",
            "costo": "Gratuito ante SAT (honorarios de defensa legal por cuenta del interesado)",
            "advertencia": "Presentar el recurso de revocatoria al undécimo día hábil provoca que el tribunal lo rechace por extemporáneo, dejando firme el cobro coactivo inmediato.",
            "normativa": "Código Aduanero Uniforme Centroamericano (CAUCA) Artículo 127; Código Tributario Artículo 154."
        },

        # -------------------------------------------------------------
        # 2. MODERNIZACIÓN E INFRAESTRUCTURA ADUANERA (18 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0541": {
            "nombreActual": "Consultar instalaciones y servicios del Complejo Lavarreda (Aduana Central)",
            "descripcion": "Consulta la ubicación, andenes de revisión, horarios y delegaciones operativas destacadas en el Complejo Lavarreda en la zona 17. Conoce los servicios de fiscalización, despacho de encomiendas y entrega de vehículos nuevos nacionalizados.",
            "requisitos": [
                "Conexión a internet para consultar la información del complejo en el Portal SAT."
            ],
            "documentos": [
                "No requiere documentos; es una guía informativa de infraestructura pública."
            ],
            "pasos": [
                "Ingresa a la sección de Infraestructura Aduanera en el Portal SAT.",
                "Selecciona 'Complejo Lavarreda - Aduana Central'.",
                "Revisa la ubicación geográfica, teléfonos de contacto y horarios de atención al público.",
                "Verifica los carriles de acceso y protocolos de seguridad para ingreso de camiones y visitantes."
            ],
            "resultadoObtenido": "Información oficial sobre las instalaciones y trámites disponibles en el principal nodo aduanero central.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Para ingresar a las áreas de rampa del Complejo Lavarreda es obligatorio portar equipo de protección personal (chaleco y casco).",
            "normativa": "Reglamento Interno de Seguridad y Operación de Aduanas de la SAT."
        },
        "SAT-GES-0542": {
            "nombreActual": "Consultar componente de infraestructura del programa MIAD",
            "descripcion": "Conoce los proyectos de modernización física, ampliación de patios de contenedores y remodelación de puestos fronterizos terrestres. Describe las inversiones del Estado en pasos fronterizos integrados y puertos marítimos.",
            "requisitos": [
                "Dispositivo con acceso a internet para revisar las fichas de proyectos del programa MIAD."
            ],
            "documentos": [
                "Fichas técnicas y planos generales de los proyectos de infraestructura aduanera."
            ],
            "pasos": [
                "Accede a la sección 'Componente de Infraestructura' del Programa MIAD en el Portal SAT.",
                "Revisa los avances de construcción y remodelación de las aduanas del país.",
                "Consulta los estándares arquitectónicos aplicados para la segregación de tráfico comercial y turismo.",
                "Conoce los cronogramas de entrega de nuevas instalaciones aduaneras."
            ],
            "resultadoObtenido": "Información oficial sobre el plan maestro de infraestructura física de la Intendencia de Aduanas.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las obras de infraestructura en puestos fronterizos pueden generar desvíos temporales de carriles debidamente señalizados.",
            "normativa": "Acuerdo de Directorio SAT 07-2019."
        },
        "SAT-GES-0543": {
            "nombreActual": "Consultar Plan Maestro del Puesto Fronterizo El Ceibo",
            "descripcion": "Consulta el proyecto de desarrollo y modernización del paso fronterizo El Ceibo en Petén, en la frontera con México. Describe la infraestructura para el tránsito internacional de mercancías, turismo y controles sanitarios integrados.",
            "requisitos": [
                "Acceso a internet para consultar los planes maestros aduaneros en el Portal SAT."
            ],
            "documentos": [
                "Documento técnico del Plan Maestro de Desarrollo del Puesto Fronterizo El Ceibo."
            ],
            "pasos": [
                "Ingresa a la sección de Planes Maestros de Infraestructura en el Portal SAT.",
                "Selecciona 'Plan Maestro Puesto Fronterizo El Ceibo'.",
                "Revisa el diseño de garitas binacionales, áreas de rampa y módulos de control migratorio y aduanero.",
                "Aplica los lineamientos para la planificación de tránsitos de mercancías por el norte del país."
            ],
            "resultadoObtenido": "Detalle técnico oficial sobre las obras y capacidades operativas de la Aduana El Ceibo.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Verifica siempre los horarios de operación autorizados antes de programar tránsitos de carga pesada por esta frontera.",
            "normativa": "Estrategia Centroamericana de Facilitación de Comercio; Convenio Bilateral Guatemala-México."
        },
        "SAT-GES-0544": {
            "nombreActual": "Consultar Plan Maestro del Puesto Fronterizo Ing. Juan Luis Lizarralde Arrillaga",
            "descripcion": "Conoce el plan de modernización de la aduana La Mesilla (Puesto Fronterizo Ingeniero Juan Luis Lizarralde Arrillaga) en Huehuetenango. Describe las mejoras en carriles de pesaje, control de transporte y garitas de despacho con México.",
            "requisitos": [
                "Navegador web con conexión a internet para descargar planos y documentos informativos."
            ],
            "documentos": [
                "Plan maestro de infraestructura del puesto fronterizo La Mesilla."
            ],
            "pasos": [
                "Accede a la herramienta de infraestructura aduanera en el Portal SAT.",
                "Consulta las inversiones de ampliación de patios de carga y módulos de atención ciudadana.",
                "Verifica los equipos de inspección no intrusiva y lectores de placas instalados.",
                "Planifica las rutas de despacho terrestre por la región noroccidental."
            ],
            "resultadoObtenido": "Información oficial del proyecto de desarrollo fronterizo en Huehuetenango.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "El paso fronterizo cuenta con carriles diferenciados para transporte pesado y vehículos particulares de turismo.",
            "normativa": "Acuerdo de Directorio SAT 07-2019."
        },
        "SAT-GES-0545": {
            "nombreActual": "Consultar Plan Maestro del Puesto Fronterizo Pedro de Alvarado",
            "descripcion": "Accede a las especificaciones de ampliación y modernización del principal puesto fronterizo con El Salvador en Moyuta, Jutiapa. Conoce las instalaciones de paso ágil, carriles express para OEA y videovigilancia de última generación.",
            "requisitos": [
                "Dispositivo con acceso a internet para revisar el plan de desarrollo fronterizo."
            ],
            "documentos": [
                "Plan Maestro de Infraestructura de la Aduana Pedro de Alvarado."
            ],
            "pasos": [
                "Ingresa a la sección de infraestructura aduanera en el portal de la SAT.",
                "Selecciona 'Plan Maestro Puesto Fronterizo Pedro de Alvarado'.",
                "Revisa la segregación vial implementada para evitar el congestionamiento del transporte de carga intrarregional.",
                "Consulta los protocolos de actuación conjunta entre la SAT y la Dirección General de Aduanas de El Salvador."
            ],
            "resultadoObtenido": "Ficha técnica oficial de las capacidades logísticas y de facilitación comercial en la frontera con El Salvador.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Este puesto fronterizo aplica obligatoriamente la transmisión anticipada de declaraciones DUCA y marchamo satelital.",
            "normativa": "Tratado General de Integración Económica Centroamericana; Convenio Binacional de Operación Aduanera."
        },
        "SAT-GES-0546": {
            "nombreActual": "Consultar Plan Maestro de la Aduana Tecún Umán I",
            "descripcion": "Consulta los planes arquitectónicos y operacionales de remodelación de la Aduana Tecún Umán I en San Marcos. Informa sobre la modernización del cruce fronterizo por el Puente Internacional Rodolfo Robles y las instalaciones ferroviarias.",
            "requisitos": [
                "Conexión a internet para consultar los planes maestros aduaneros en el Portal SAT."
            ],
            "documentos": [
                "Documento del Plan Maestro de Desarrollo de la Aduana Tecún Umán I."
            ],
            "pasos": [
                "Accede a los proyectos de infraestructura fronteriza en el Portal SAT.",
                "Revisa las fases de construcción de garitas automatizadas y plataformas de inspección fitozoosanitaria.",
                "Comprueba la interconexión con el sistema ferroviario y las áreas de maniobras de carga pesada.",
                "Aplica los lineamientos operativos para el cruce de mercancías por la frontera suroccidental."
            ],
            "resultadoObtenido": "Información oficial sobre las capacidades operativas de la aduana de mayor volumen de comercio con México.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La carga pesada debe canalizarse obligatoriamente por el recinto de Tecún Umán II; Tecún Umán I atiende turismo y ferrocarril.",
            "normativa": "Convenios Bilaterales de Cooperación Aduanera entre Guatemala y México."
        },
        "SAT-GES-0547": {
            "nombreActual": "Consultar directorio, ubicación y horarios de aduanas de Guatemala",
            "descripcion": "Consulta la ubicación georreferenciada, teléfonos, administradores a cargo y horarios de atención de las 22 aduanas de la República. Permite a importadores y transportistas planificar arribos y despachos sin contratiempos.",
            "requisitos": [
                "Acceso a internet para consultar el directorio interactivo oficial de la SAT.",
                "Identificar la aduana de destino o tránsito (marítima, aérea, terrestre o interna)."
            ],
            "documentos": [
                "No requiere documentos; es una herramienta pública de geolocalización y contacto."
            ],
            "pasos": [
                "Ingresa a 'Aduanas de Guatemala' en el Portal SAT.",
                "Selecciona la región aduanera: Central, Sur, Nororiente u Occidente.",
                "Consulta la dirección exacta, números de teléfono de planta y el correo institucional del administrador.",
                "Verifica los horarios de ventanilla administrativa y los turnos de despacho de carga en garita (muchas aduanas 24/7)."
            ],
            "resultadoObtenido": "Directorio oficial actualizado con datos de contacto y horarios de servicio de todas las aduanas del país.",
            "tiempoEstimado": "Inmediato (consulta interactiva)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Ciertas aduanas terrestres manejan horarios de cierre fronterizo nocturno acordados bilateralmente con los países vecinos.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Reglamento Interno de Trabajo de la SAT."
        },
        "SAT-GES-0548": {
            "nombreActual": "Consultar componente de seguridad integral aduanera del programa MIAD",
            "descripcion": "Conoce los sistemas de control de accesos, videovigilancia CCTV en tiempo real y protocolos de seguridad física en recintos portuarios y aduanas. Garantiza la integridad de las cargas frente a riesgos de contaminación, robo o vandalismo.",
            "requisitos": [
                "Dispositivo con acceso a internet para revisar las políticas de seguridad aduanera en el Portal SAT."
            ],
            "documentos": [
                "Documento técnico del Componente de Seguridad del Programa MIAD."
            ],
            "pasos": [
                "Accede a la sección de Seguridad Aduanera en el Portal SAT.",
                "Revisa las especificaciones de blindaje de garitas, iluminación perimetral y barreras vehiculares de alto impacto.",
                "Conoce los protocolos de actuación ante contingencias de seguridad pública o alertas de intrusión.",
                "Alinea las políticas de seguridad de tu empresa con los estándares de control perimetral de la SAT."
            ],
            "resultadoObtenido": "Información oficial sobre los estándares y tecnologías de seguridad implementadas en el sistema aduanero.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "El ingreso a recintos aduaneros está sujeto a inspección corporal, revisión de vehículos y detección de metales en garitas.",
            "normativa": "Código Internacional para la Protección de los Buques y de las Instalaciones Portuarias (Código PBIP); CAUCA Artículo 12."
        },
        "SAT-GES-0549": {
            "nombreActual": "Consultar componente de tecnología e innovación del programa MIAD",
            "descripcion": "Accede a las especificaciones de modernización en centros de cómputo, inteligencia artificial para perfiles de riesgo y digitalización de gestiones aduaneras. Conoce las plataformas de comunicación electrónica entre el sector privado y la SAT.",
            "requisitos": [
                "Conexión a internet para consultar los proyectos tecnológicos en el Portal SAT."
            ],
            "documentos": [
                "Documento marco del Componente de Tecnología del Programa MIAD."
            ],
            "pasos": [
                "Ingresa a la sección de Tecnología Aduanera en el Portal SAT.",
                "Revisa las innovaciones en servidores en la nube, ciberseguridad y procesamiento masivo de datos.",
                "Conoce cómo los modelos de riesgo seleccionan automáticamente los embarques para revisión en rampa.",
                "Verifica las especificaciones de las interfaces API para integración de sistemas empresariales."
            ],
            "resultadoObtenido": "Visión técnica oficial de la arquitectura informática que respalda la Aduana Digital de Guatemala.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La SAT implementa certificados SSL y protocolos TLS 1.3 obligatorios para todas las conexiones a sus plataformas.",
            "normativa": "Ley para el Reconocimiento de las Comunicaciones y Firmas Electrónicas (Decreto 47-2008)."
        },
        "SAT-GES-0550": {
            "nombreActual": "Consultar equipamiento de inspección no intrusiva (Rayos X y Escáneres)",
            "descripcion": "Conoce la operación de los equipos de inspección no intrusiva por rayos X instalados en puertos marítimos y puestos fronterizos. Permite el escaneo rápido de contenedores en menos de dos minutos sin necesidad de vaciar la carga.",
            "requisitos": [
                "Navegador web para consultar las directrices técnicas de inspección no intrusiva en el Portal SAT."
            ],
            "documentos": [
                "Manuales y protocolos de seguridad radiológica y operación de escáneres aduaneros."
            ],
            "pasos": [
                "Accede a 'Equipos de Revisión No Intrusivos' en la sección técnica del Portal SAT.",
                "Revisa el funcionamiento de los portales de rayos X de alta energía en Puerto Quetzal y Santo Tomás de Castilla.",
                "Conoce el protocolo de tránsito vehicular a través del túnel de escaneo sin que el conductor se exponga a radiación.",
                "Comprende cómo los analistas de imágenes detectan inconsistencias de densidad o bultos no declarados."
            ],
            "resultadoObtenido": "Información oficial sobre la tecnología de revisión no intrusiva que agiliza el levante de mercancías.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Si la imagen de rayos X revela discrepancias con la declaración DUCA, la unidad será remitida obligatoriamente a apertura física en rampa.",
            "normativa": "Marco SAFE de la OMA; Ley Nacional de Aduanas Decreto 14-2013; Reglamento de Protección Radiológica del MEM."
        },
        "SAT-GES-0551": {
            "nombreActual": "Consultar implementación de tecnología RFID para control de transporte",
            "descripcion": "Conoce el sistema de identificación por radiofrecuencia (RFID) mediante tags adheridos a cabezales y medios de transporte terrestre. Permite la identificación automática y apertura de garitas fronterizas sin contacto físico.",
            "requisitos": [
                "Dispositivo con acceso a internet para consultar las especificaciones técnicas del sistema RFID en el Portal SAT."
            ],
            "documentos": [
                "Guía de especificaciones y enrolamiento de tags RFID para transportistas aduaneros."
            ],
            "pasos": [
                "Ingresa a la sección de Tecnología RFID en el portal del Programa MIAD de la SAT.",
                "Conoce los requisitos para el enrolamiento y adhesión del tag RFID en el parabrisas de tu unidad de transporte.",
                "Revisa la ubicación de las antenas lectoras instaladas en los puestos fronterizos y recintos aduaneros.",
                "Aprovecha el paso ágil automatizado en los carriles habilitados con tecnología de radiofrecuencia."
            ],
            "resultadoObtenido": "Información oficial sobre el programa de enrolamiento de transporte pesado mediante microchips de proximidad.",
            "tiempoEstimado": "Inmediato (consulta libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Dañar deliberadamente o retirar el tag RFID del vehículo registrado acarrea la pérdida del beneficio de paso automatizado por garitas.",
            "normativa": "Estrategia Centroamericana de Facilitación de Comercio; Acuerdo de Directorio SAT 07-2019."
        },
        "SAT-GES-0552": {
            "nombreActual": "Consultar repositorio digital de documentos del manifiesto de carga",
            "descripcion": "Accede a la herramienta institucional de consulta de manifiestos y conocimientos de embarque digitalizados en el sistema aduanero. Permite a navieras, aerolíneas y transportistas verificar la consistencia de bultos asociados a cada viaje.",
            "requisitos": [
                "Número de manifiesto aduanero o número correlativo de viaje.",
                "Acceso a internet desde computadora o dispositivo móvil."
            ],
            "documentos": [
                "Manifiesto general de carga y conocimientos de embarque (BLs, guías aéreas o cartas de porte)."
            ],
            "pasos": [
                "Ingresa al módulo de 'Documentos Manifiesto' en el portal aduanero de la SAT.",
                "Introduce el número de manifiesto asignado por el sistema de aduanas.",
                "Revisa la lista completa de documentos de transporte enlazados y su estado de confirmación.",
                "Identifica posibles cartas de corrección pendientes de autorizar por la intendencia."
            ],
            "resultadoObtenido": "Pantalla oficial con el consolidado digital de documentos y bultos amparados en el manifiesto aduanero.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Los bultos no manifestados oportunamente no podrán ser nacionalizados y quedarán retenidos bajo investigación aduanera.",
            "normativa": "RECAUCA Artículos 242 al 260; Procedimiento de Despacho de Mercancías."
        },
        "SAT-GES-0553": {
            "nombreActual": "Consultar estadísticas tributarias y de recaudación aduanera",
            "descripcion": "Accede a los tableros interactivos y reportes mensuales de recaudación por tipo de impuesto interno y aranceles de importación. Permite analizar el cumplimiento de metas de ingresos fiscales y la evolución del comercio formal.",
            "requisitos": [
                "Navegador de internet con soporte para visualización de tableros de Business Intelligence (Power BI) o descarga de archivos Excel."
            ],
            "documentos": [
                "Informes mensuales y anuales de recaudación tributaria y comercio exterior publicados por la SAT."
            ],
            "pasos": [
                "Ingresa a la sección de 'Estadísticas Tributarias' en el Portal SAT.",
                "Selecciona el reporte de tu interés: Recaudación por Aduana, Desempeño por Impuesto (IVA, ISR, DAI) o Comercio Exterior.",
                "Aplica filtros por año fiscal, mes o sector económico para personalizar la visualización.",
                "Descarga los datos en hojas de cálculo para fines académicos, de investigación o de planificación empresarial."
            ],
            "resultadoObtenido": "Acceso libre a datos estadísticos macroeconómicos y de recaudación fiscal certificados por la SAT.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Los datos estadísticos oficiales son de dominio público conforme al principio de máxima publicidad y transparencia.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Ley de Acceso a la Información Pública (Decreto 57-2008)."
        },
        "SAT-GES-0554": {
            "nombreActual": "Consultar memoria de labores y rendición de cuentas institucional de la SAT",
            "descripcion": "Descarga los informes anuales de rendición de cuentas, cumplimiento de metas de recaudación y proyectos estratégicos de la SAT. Brinda a la ciudadanía una visión integral del desempeño financiero y operativo de la administración tributaria.",
            "requisitos": [
                "Dispositivo con acceso a internet para descargar documentos en formato PDF."
            ],
            "documentos": [
                "Memorias de Labores anuales de la Superintendencia de Administración Tributaria."
            ],
            "pasos": [
                "Accede a la sección de 'Memoria de Labores' en el Portal SAT.",
                "Selecciona el ejercicio fiscal que deseas auditar o consultar.",
                "Descarga el informe completo con los estados financieros, auditorías de la Contraloría y metas alcanzadas.",
                "Analiza los principales logros institucionales en fiscalización, facilitación y transformación digital."
            ],
            "resultadoObtenido": "Documento oficial de rendición de cuentas y transparencia gubernamental de la SAT.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La Memoria de Labores anual se publica obligatoriamente dentro del primer trimestre de cada año calendario.",
            "normativa": "Ley Orgánica de la SAT Artículo 23; Ley de Acceso a la Información Pública."
        },
        "SAT-GES-0555": {
            "nombreActual": "Presentar objeciones y recomendaciones a procedimientos de Asuntos Jurídicos",
            "descripcion": "Participa en la consulta pública ciudadana enviando observaciones y propuestas de mejora a los proyectos de manuales normativos de la SAT. Fortalece la calidad regulatoria y la certeza jurídica de los procedimientos administrativos.",
            "requisitos": [
                "Identificar el proyecto de procedimiento normativo en fase de consulta pública.",
                "Formular observaciones técnicas debidamente fundamentadas en la legislación vigente.",
                "Dispositivo con acceso a internet para ingresar al formulario oficial de recepción de objeciones."
            ],
            "documentos": [
                "Borrador del proyecto de procedimiento aduanero o tributario sometido a consulta.",
                "Formulario digital de presentación de recomendaciones con datos de contacto del compareciente."
            ],
            "pasos": [
                "Ingresa a la sección de 'Recepción de Objeciones y Recomendaciones' en el Portal SAT.",
                "Descarga el proyecto de manual o procedimiento de la Intendencia de Asuntos Jurídicos en consulta.",
                "Completa el formulario en línea consignando los artículos específicos que propones modificar y la justificación técnica.",
                "Envía tus comentarios dentro del período habilitado de participación pública.",
                "La unidad jurídica evalúa los aportes antes de la emisión y publicación de la resolución final."
            ],
            "resultadoObtenido": "Acuse de recepción electrónica que registra tu participación en la consulta regulatoria institucional.",
            "tiempoEstimado": "10 a 15 minutos para remitir la propuesta",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las sugerencias deben guardar relación directa con el proyecto normativo consultado y presentarse dentro del plazo de convocatoria.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Política Institucional de Mejora Regulatoria."
        },
        "SAT-GES-0556": {
            "nombreActual": "Consultar componente de reingeniería de procesos del programa MIAD",
            "descripcion": "Conoce los avances en la simplificación, homologación y reducción de pasos en los procesos de despacho de importación y exportación. Describe las mejoras implementadas para reducir el tiempo total de levante aduanero en el país.",
            "requisitos": [
                "Conexión a internet para revisar los flujogramas de procesos modernizados en el Portal SAT."
            ],
            "documentos": [
                "Manuales de procesos reingenierizados del Programa de Modernización Integral Aduanera."
            ],
            "pasos": [
                "Accede a 'Componente de Procesos' en el portal del Programa MIAD.",
                "Revisa los diagramas de flujo comparativos de los procesos aduaneros antes y después de la modernización.",
                "Comprueba la eliminación de pasos redundantes y la integración de trámites digitales unificados.",
                "Aplica los nuevos flujos de trabajo en tus departamentos de tráfico y aduanas corporativos."
            ],
            "resultadoObtenido": "Información oficial sobre la simplificación y optimización de procedimientos de comercio exterior.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Los procesos optimizados sustituyen plenamente a las antiguas metodologías manuales en todas las aduanas del país.",
            "normativa": "Acuerdo de Directorio SAT 07-2019; Estrategia Nacional de Facilitación de Comercio."
        },
        "SAT-GES-0557": {
            "nombreActual": "Consultar componente de recursos humanos y ética del programa MIAD",
            "descripcion": "Accede a las políticas de formación continua, profesionalización, pruebas de confiabilidad y carrera administrativa del personal aduanero. Garantiza la idoneidad técnica e integridad moral de los funcionarios al servicio del comercio exterior.",
            "requisitos": [
                "Dispositivo con acceso a internet para consultar los programas de capacitación y ética en el Portal SAT."
            ],
            "documentos": [
                "Informe del Componente de Recursos Humanos y Fortalecimiento del Talento de la Intendencia de Aduanas."
            ],
            "pasos": [
                "Ingresa a la sección de Recursos Humanos del Programa MIAD en el Portal SAT.",
                "Conoce el programa de selección meritocrática, evaluaciones psicométricas y polígrafo para personal aduanero.",
                "Revisa la oferta académica de la Escuela Aduanera y Tributaria de la SAT.",
                "Infórmate sobre los canales de reporte de conducta irregular de funcionarios públicos."
            ],
            "resultadoObtenido": "Información oficial sobre el fortalecimiento ético y profesional del cuerpo de inspectores y técnicos de aduanas.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Todo funcionario de aduanas está sujeto al régimen disciplinario de probidad y denuncias ante la Inspectoría General.",
            "normativa": "Ley Orgánica de la SAT Artículo 30; Reglamento Interno de Trabajo de la SAT."
        },
        "SAT-GES-0715": {
            "nombreActual": "Consultar listado público oficial de contribuyentes morosos",
            "descripcion": "Consulta el registro público actualizado de personas individuales y jurídicas con deudas tributarias o aduaneras firmes en proceso de cobro. Permite a las empresas verificar la solvencia legal y reputación fiscal de proveedores y clientes.",
            "requisitos": [
                "Acceso a internet para consultar el portal de transparencia de la SAT.",
                "Conocer el Nombre, Razón Social o Número de Identificación Tributaria (NIT) a verificar."
            ],
            "documentos": [
                "Listado público descargable en formato Excel y PDF publicado en cumplimiento de la ley tributaria."
            ],
            "pasos": [
                "Ingresa a la sección de 'Transparencia' > 'Listado de Contribuyentes Morosos' en el Portal SAT.",
                "Digita el NIT o nombre de la empresa para verificar su presencia en el registro de deudores.",
                "Consulta el monto líquido y exigible demandado judicialmente o pendiente de pago.",
                "Verifica la fecha de última actualización del reporte oficial de la intendencia."
            ],
            "resultadoObtenido": "Constancia de consulta pública sobre el historial de morosidad tributaria y aduanera de operadores económicos.",
            "tiempoEstimado": "Inmediato (consulta libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Figurar en el listado de morosos impide la emisión de solvencias fiscales, contrataciones con el Estado y goce de incentivos.",
            "normativa": "Código Tributario (Decreto 6-91) Artículo 101 literal c); Ley Orgánica de la SAT."
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

    print(f"Enriched {updated_count} Normativa Part 2 items.")

    with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    enrich_normativa_p2()
