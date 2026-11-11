# -*- coding: utf-8 -*-
"""
Enrichment script for Auxiliares de la Función Pública Aduanera (AFPA) (76 gestiones)
Following ATO UX Writing standards & official SAT Guatemala portal production specifications.
"""

import json
import re

def enrich_afpa():
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Dictionary of enriched data keyed by ID
    afpa_data = {
        # -------------------------------------------------------------
        # 1. AGENTES ADUANEROS (7 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0418": {
            "nombreActual": "Consultar padrón oficial de Auxiliares de la Función Pública Aduanera",
            "descripcion": "Consulta y descarga la nómina oficial vigente de Agentes Aduaneros, transportistas, depósitos y auxiliares aduaneros legalmente habilitados por la SAT. Permite verificar el estado activo y solvencia técnica de los operadores antes de encomendar despachos aduaneros.",
            "requisitos": [
                "Estar inscrito en el Registro Tributario Unificado (RTU) con datos actualizados.",
                "Disponer de acceso a internet o navegador web para consultar el portal institucional.",
                "Identificar la razón social o Número de Identificación Tributaria (NIT) del auxiliar aduanero a consultar."
            ],
            "documentos": [
                "Listado oficial descargable en formato PDF / Excel emitido mensualmente por la Intendencia de Aduanas.",
                "Récord de transmisión de declaraciones aduaneras por auxiliar autorizado."
            ],
            "pasos": [
                "Accede a la sección de Auxiliares de la Función Pública Aduanera en el Portal SAT.",
                "Selecciona la categoría del auxiliar (Agentes Aduaneros, Almacenes Fiscales, Transportistas o Depósitos).",
                "Descarga la nómina oficial actualizada al último día hábil del mes.",
                "Verifica el estatus de habilitación del auxiliar antes de emitir mandatos o endosos aduaneros."
            ],
            "resultadoObtenido": "Constancia de consulta pública o archivo descargable que acredita la habilitación legal del auxiliar ante el Servicio Aduanero.",
            "tiempoEstimado": "Inmediato (consulta pública en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Operar con auxiliares de la función pública inactivos o suspendidos invalida la transmisión de la Declaración Única Centroamericana (DUCA) y genera retención inmediata del embarque.",
            "normativa": "Código Aduanero Uniforme Centroamericano (CAUCA) Artículo 18; Reglamento del CAUCA (RECAUCA) Artículos 73 al 85."
        },
        "SAT-GES-0419": {
            "nombreActual": "Renovar registro y fianza de Auxiliar de la Función Pública Aduanera",
            "descripcion": "Solicita la prórroga anual de operación y entrega de fianza o seguro de caución ante la Unidad de Administración de Auxiliares. Garantiza la continuidad ininterrumpida de las claves de acceso al sistema informático aduanero para el despacho de mercancías.",
            "requisitos": [
                "Contar con solvencia fiscal vigente emitida por la SAT a la fecha de la solicitud.",
                "Tener los datos del Registro Tributario Unificado (RTU) completamente actualizados y ratificados.",
                "Disponer de la póliza original de fianza o seguro de caución vigente por el monto fijado según categoría.",
                "Acreditar el cumplimiento del récord mínimo de transmisiones o capacitaciones institucionales obligatorias."
            ],
            "documentos": [
                "Póliza original y copia simple del seguro de caución a favor de la SAT.",
                "Formulario oficial de solicitud de renovación firmado por el auxiliar o representante legal.",
                "Constancia de solvencia fiscal y carné de auxiliar aduanero vigente."
            ],
            "pasos": [
                "Ingresa la solicitud de renovación a través de la Agencia Virtual o preséntate en la Unidad de Administración de Auxiliares de la Función Pública Aduanera (Torre SAT, nivel 3).",
                "Entrega la póliza original del seguro de caución para su revisión y cotejo formal.",
                "Recibe el comprobante con sello oficial de recepción del seguro de caución.",
                "Monitorea el buzón electrónico de notificaciones en la Agencia Virtual hasta recibir la resolución de renovación favorable."
            ],
            "resultadoObtenido": "Resolución de intendencia de aduanas que prorroga la habilitación anual y actualización automática de vigencia en el sistema informático.",
            "tiempoEstimado": "10 a 15 días hábiles",
            "costo": "Gratuito ante SAT (pago de prima a la aseguradora privada)",
            "advertencia": "La solicitud de renovación y presentación del seguro de caución debe gestionarse al menos 30 días calendario antes de su vencimiento; operar con fianza vencida causa la inhabilitación inmediata del código de auxiliar.",
            "normativa": "Reglamento del Código Aduanero Uniforme Centroamericano (RECAUCA) Artículos 78, 86 y 87; Manual DG-IAD/DNO-ADU-AYR-24."
        },
        "SAT-GES-0420": {
            "nombreActual": "Consultar manuales y directrices técnicas para gestiones aduaneras",
            "descripcion": "Accede al repositorio normativo oficial de instructivos, manuales operativos y directrices técnicas emitidas por la Intendencia de Aduanas. Permite consultar los procedimientos estandarizados para el despacho, régimen de tránsitos, franquicias y contingencias aduaneras.",
            "requisitos": [
                "Navegador web con soporte para lectura de documentos en formato PDF.",
                "Conocimiento de la materia o proceso operativo a consultar (tránsitos, despacho sin papeles, depósito o courier)."
            ],
            "documentos": [
                "Manuales de procedimientos aduaneros (códigos PR-IAD/DNO).",
                "Directrices técnicas institucionales y circulares aduaneras vigentes."
            ],
            "pasos": [
                "Ingresa a la sección de Procedimientos e Instructivos de la Intendencia de Aduanas en el Portal SAT.",
                "Selecciona el componente temático deseado (Marco Legal, Aduana Digital, Franquicias o Planes de Contingencia).",
                "Localiza la directriz técnica o manual por código correlativo o palabra clave.",
                "Descarga el manual oficial para asegurar que tus operaciones cumplan con la versión vigente."
            ],
            "resultadoObtenido": "Acceso libre e inmediato a la normativa técnica y manuales de procedimientos autorizados por la autoridad aduanera.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Aplicar versiones derogadas de manuales o procedimientos no exime de responsabilidad administrativa ni de sanciones aduaneras.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Código Aduanero Uniforme Centroamericano (CAUCA) Artículo 6."
        },
        "SAT-GES-0421": {
            "nombreActual": "Descargar componente ActiveX AresPKI para firma electrónica en SAQB'E",
            "descripcion": "Descarga e instala el controlador ActiveX oficial necesario para validar el certificado digital de firma electrónica en el sistema informático aduanero SAQB'E. Corrige fallas de adhesión de credenciales criptográficas durante la transmisión de declaraciones.",
            "requisitos": [
                "Computadora con sistema operativo Windows y permisos de administrador local.",
                "Navegador web compatible con componentes ActiveX de seguridad criptográfica.",
                "Tarjeta criptográfica o token USB con certificado digital vigente emitido por una entidad de certificación autorizada.",
                "Clave de acceso y PIN de seguridad de la firma digital asignados correctamente."
            ],
            "documentos": [
                "Instalador oficial del componente AresPKI (archivo ejecutable provisto por SAT).",
                "Guía técnica de configuración de seguridad y zonas de confianza en el navegador."
            ],
            "pasos": [
                "Descarga el instalador del componente ActiveX AresPKI desde el enlace técnico oficial del Portal SAT.",
                "Ejecuta el instalador como Administrador y completa la configuración guiada en tu equipo.",
                "Habilita la ejecución de complementos ActiveX en las opciones de seguridad del navegador para el dominio sat.gob.gt.",
                "Ingresa al sistema aduanero SAQB'E y efectúa la adhesión de tu firma digital con tu tarjeta criptográfica."
            ],
            "resultadoObtenido": "Habilitación del entorno criptográfico para transmitir declaraciones de aduana y firmar documentos electrónicos de forma vinculante.",
            "tiempoEstimado": "10 a 15 minutos",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Si no configuras adecuadamente los niveles de seguridad del navegador, el sistema SAQB'E bloqueará la adhesión del certificado, impidiendo la firma y transmisión de declaraciones.",
            "normativa": "Ley para el Reconocimiento de las Comunicaciones y Firmas Electrónicas (Decreto 47-2008); RECAUCA Artículo 72."
        },
        "SAT-GES-0422": {
            "nombreActual": "Consultar estado o actuaciones de expedientes en gestión aduanera",
            "descripcion": "Solicita de forma presencial información verbal sobre la etapa procesal o actuaciones administrativas de expedientes aduaneros en trámite. Permite conocer el estatus de recursos, solicitudes de auxiliares, franquicias o regímenes especiales.",
            "requisitos": [
                "Presentar Documento Personal de Identificación (DPI) original del solicitante o pasaporte vigente en caso de extranjeros.",
                "En caso de mandatarios o representantes legales, presentar documento que acredite la personería jurídica vigente.",
                "Para agentes aduaneros o apoderados, presentar carné de identificación aduanera emitido por SAT.",
                "Indicar el número de expediente, oficio o providencia aduanera objeto de consulta."
            ],
            "documentos": [
                "Documento Personal de Identificación (DPI) o pasaporte.",
                "Carné vigente de Agente Aduanero o Apoderado Especial Aduanero.",
                "Copia simple de la solicitud original o contraseña donde conste el número de expediente asignado."
            ],
            "pasos": [
                "Preséntate en el tercer nivel del Edificio Torre SAT (zona 9 de la Ciudad de Guatemala) o en la aduana correspondiente.",
                "Dirígete al centralizador de la unidad correspondiente (Auxiliares, Regímenes Especiales, Recursos o Franquicias).",
                "Muestra tu identificación oficial y acredita tu personería como titular o auxiliar registrado en el expediente.",
                "Indica el número de expediente para recibir la información verbal sobre el estado y avance de las actuaciones."
            ],
            "resultadoObtenido": "Informe verbal detallado del estatus procesal y unidad responsable donde se encuentra el expediente aduanero.",
            "tiempoEstimado": "15 a 30 minutos (atención presencial en ventanilla)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No se proporciona información sobre el sentido final de la resolución antes de su notificación formal, ni se entrega documentación física confidencial a terceros sin acreditación notarial.",
            "normativa": "Constitución Política de la República de Guatemala Artículo 30; Código Tributario Artículo 126."
        },
        "SAT-GES-0423": {
            "nombreActual": "Monitorear videovigilancia de flujo vehicular en frontera Pedro de Alvarado",
            "descripcion": "Visualiza en tiempo real las transmisiones de cámaras de videovigilancia de los carriles de ingreso y egreso en el Puesto Fronterizo Pedro de Alvarado – La Hachadura. Facilita la planificación logística del transporte terrestre y la verificación de congestión en frontera.",
            "requisitos": [
                "Dispositivo con conexión a internet y navegador web con reproductor de video HTML5 compatible.",
                "Conexión de banda ancha estable para reproducir transmisiones de circuito cerrado en vivo."
            ],
            "documentos": [
                "No requiere documentación; es un servicio de visualización pública y monitoreo operativo en línea."
            ],
            "pasos": [
                "Ingresa a la sección de Videovigilancia CCTV del Programa de Modernización Integral Aduanera (MIAD) en el Portal SAT.",
                "Selecciona la cámara de flujo correspondiente (Guatemala hacia El Salvador o El Salvador hacia Guatemala).",
                "Monitorea el nivel de tráfico, avance de colas y operatividad de los recintos aduaneros en tiempo real.",
                "Coordina los horarios de despacho de las unidades de transporte para evitar horas pico de saturación fronteriza."
            ],
            "resultadoObtenido": "Visualización directa del estado del tráfico pesado y liviano en el cruce fronterizo binacional.",
            "tiempoEstimado": "Inmediato (transmisión en tiempo real)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las interrupciones en la transmisión pueden deberse a mantenimiento del enlace satelital o condiciones climáticas extremas en frontera.",
            "normativa": "Estrategia Centroamericana de Facilitación de Comercio; Acuerdo Marco del Programa MIAD de la Intendencia de Aduanas."
        },
        "SAT-GES-0424": {
            "nombreActual": "Inscribirse en el curso virtual sobre generalidades de la DUCA",
            "descripcion": "Inscríbete en el programa de capacitación virtual gratuito impartido por Cultura Tributaria de la SAT sobre la Declaración Única Centroamericana (DUCA). Permite dominar el llenado técnico, validaciones de sistemas y normativas aplicables a DUCA-F, DUCA-D y DUCA-T.",
            "requisitos": [
                "Disponer de un correo electrónico activo personal o institucional.",
                "Contar con una computadora o tableta con acceso a internet para ingresar al aula virtual.",
                "Interés en el comercio intrarregional centroamericano o desempeño en agencias de aduana y transporte."
            ],
            "documentos": [
                "Formulario de registro en línea completado a través de la plataforma de Cultura Tributaria SAT.",
                "Documento Personal de Identificación (DPI) para acreditación del certificado digital de participación."
            ],
            "pasos": [
                "Ingresa al catálogo de cursos virtuales de aduanas en el portal de Cultura Tributaria SAT.",
                "Selecciona el curso 'Generalidades de la Declaración Única Centroamericana (DUCA)'.",
                "Completa tus datos personales de registro para recibir las credenciales del entorno virtual.",
                "Concluye los módulos didácticos y evaluaciones en línea para obtener tu constancia oficial de aprobación."
            ],
            "resultadoObtenido": "Diploma o constancia digital de aprobación emitida por el Departamento de Cultura Tributaria y Capacitación de la SAT.",
            "tiempoEstimado": "Autogestionado (duración estimada: 20 horas de contenido virtual)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Es indispensable obtener una calificación mínima del 70% en las evaluaciones modulares para descargar el certificado de aprobación institucional.",
            "normativa": "Resolución COMIECO No. 409-2018 (Aprobación de la Declaración Única Centroamericana); Ley Orgánica de la SAT."
        },

        # -------------------------------------------------------------
        # 2. APODERADOS ESPECIALES ADUANEROS (16 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0436": {
            "nombreActual": "Registrar autorización inicial y mandato de apoderado especial aduanero",
            "descripcion": "Gestiona ante la Intendencia de Aduanas la acreditación oficial de personas individuales facultadas mediante mandato legal para despachar en nombre de una empresa. Permite actuar ante el servicio aduanero con las mismas atribuciones de un agente aduanero de exclusividad.",
            "requisitos": [
                "Tener relación laboral bajo relación de dependencia con la persona jurídica poderdante.",
                "Estar inscrito en el Registro Tributario Unificado (RTU) con datos actualizados y solvencia fiscal.",
                "Presentar testimonio de la escritura pública que contenga el mandato especial con representación, inscrito en el Archivo General de Protocolos.",
                "Constituir fianza o seguro de caución a favor de la SAT por el importe legal normado."
            ],
            "documentos": [
                "Testimonio del mandato especial aduanero debidamente razonado por el Registro de Poderes del Archivo General de Protocolos.",
                "Póliza original del seguro de caución a favor de la SAT.",
                "Constancia de relación laboral y copia de DPI del apoderado y representante legal poderdante."
            ],
            "pasos": [
                "Elabora el memorial de solicitud dirigido al Intendente de Aduanas y adjunta la documentación notarial y laboral.",
                "Presenta el expediente en la Unidad de Administración de Auxiliares de la Función Pública Aduanera (Torre SAT, nivel 3).",
                "Entrega la póliza del seguro de caución para su registro y resguardo oficial.",
                "Recibe la resolución de autorización e inscríbete para la toma de fotografía y emisión del carné aduanero."
            ],
            "resultadoObtenido": "Resolución de intendencia de aduanas que otorga el código de apoderado especial y habilitación de carné oficial.",
            "tiempoEstimado": "20 a 30 días hábiles",
            "costo": "Gratuito ante SAT (gastos notariales y póliza por cuenta del poderdante)",
            "advertencia": "El apoderado especial aduanero solo puede representar con exclusividad a una única persona jurídica o entidad estatal; está prohibido prestar servicios aduaneros a terceros no vinculados al mandato.",
            "normativa": "Código Aduanero Uniforme Centroamericano (CAUCA) Artículo 24; RECAUCA Artículos 99 al 107."
        },
        "SAT-GES-0437": {
            "nombreActual": "Solicitar carné y habilitación de firma electrónica para apoderado aduanero",
            "descripcion": "Solicita la emisión o reposición del carné institucional y la vinculación de la firma electrónica digital para transmisiones en el sistema SAQB'E. Habilita el ingreso formal a los recintos fiscales y la suscripción de declaraciones aduaneras.",
            "requisitos": [
                "Resolución vigente de la Intendencia de Aduanas que autoriza la calidad de Apoderado Especial Aduanero.",
                "Contar con solvencia fiscal y datos del RTU actualizados.",
                "Disponer de certificado digital de firma electrónica vigente emitido por un prestador de certificación acreditado."
            ],
            "documentos": [
                "Documento Personal de Identificación (DPI) en original y copia.",
                "Copia de la resolución administrativa de nombramiento vigente.",
                "Comprobante de pago de la tarifa del carné aduanero en Declaraguate (formulario SAT-8008)."
            ],
            "pasos": [
                "Genera y paga la boleta de pago correspondiente por emisión o reposición de carné en Declaraguate.",
                "Preséntate a la Unidad de Administración de Auxiliares en el Edificio Torre SAT para toma de fotografía y validación de huella.",
                "Recibe el carné oficial con chip de proximidad y código QR de seguridad institucional.",
                "Efectúa la adhesión del certificado de firma digital en el componente ActiveX de SAQB'E."
            ],
            "resultadoObtenido": "Carné físico oficial de Apoderado Especial Aduanero y perfil activo de firma digital para despachos.",
            "tiempoEstimado": "1 a 3 días hábiles",
            "costo": "Q75.00 (emisión de carné oficial de auxiliar)",
            "advertencia": "Portar el carné oficial visible es requisito obligatorio e intransferible para ingresar a zonas primarias, recintos portuarios y aduanas aéreas o terrestres.",
            "normativa": "Reglamento del CAUCA (RECAUCA) Artículos 83 y 103; Manual DG-IAD/DNO-ADU-AYR-24."
        },
        "SAT-GES-0438": {
            "nombreActual": "Registrar seguro de caución para importación y admisión temporal",
            "descripcion": "Entrega en custodia ante la Unidad de Regímenes Aduaneros Especiales la póliza de fianza que garantiza los tributos aplicables a mercancías bajo admisión temporal. Permite despachar bienes y equipos suspendiendo el cobro inmediato de aranceles e IVA de importación.",
            "requisitos": [
                "Resolución administrativa previa de la SAT que autoriza el régimen aduanero especial o solicitud en trámite.",
                "Póliza original de fianza de seguro de caución emitida por una aseguradora legalmente autorizada en Guatemala.",
                "Endoso de la póliza expedido estrictamente a favor de la Superintendencia de Administración Tributaria (SAT).",
                "Estar al día en obligaciones tributarias con solvencia fiscal vigente."
            ],
            "documentos": [
                "Póliza original de seguro de caución y dos fotocopias legibles.",
                "Formulario de presentación de garantías para regímenes suspensivos aduaneros.",
                "DPI del representante legal o apoderado especial aduanero."
            ],
            "pasos": [
                "Preséntate en la Unidad de Regímenes Aduaneros Especiales (tercer nivel de Torre SAT, zona 9).",
                "Entrega en ventanilla la póliza original y sus copias con la cláusula de beneficio institucional a favor de SAT.",
                "El operador valida el texto de la póliza, el cálculo del monto caucionado y la solvencia de la aseguradora.",
                "Recibe de forma inmediata la copia con sello de recibido y autorización para su vinculación con la declaración de aduana."
            ],
            "resultadoObtenido": "Copia del seguro de caución sellada de recibido que habilita la liquidación de la DUCA bajo régimen suspensivo.",
            "tiempoEstimado": "Inmediato (el mismo día hábil)",
            "costo": "Gratuito ante SAT (prima contractual pagada a la aseguradora)",
            "advertencia": "Si las mercancías no son reexportadas o nacionalizadas dentro del plazo normado, la SAT ejecutará de inmediato la totalidad del seguro de caución con intereses y recargos.",
            "normativa": "Código Aduanero Uniforme Centroamericano (CAUCA) Artículo 21; RECAUCA Artículos 52 al 58."
        },
        "SAT-GES-0439": {
            "nombreActual": "Renovar habilitación anual de apoderado especial aduanero",
            "descripcion": "Tramita la renovación anual de la vigencia de operaciones y prórroga de fianza del apoderado especial ante la Intendencia de Aduanas. Asegura la continuidad de la representación corporativa en los módulos de despacho aduanero.",
            "requisitos": [
                "Constancia de vigencia del mandato especial aduanero sin revocatorias anotadas en el Archivo General de Protocolos.",
                "Solvencia fiscal vigente tanto de la empresa mandante como del apoderado especial.",
                "Renovación o endoso de prórroga del seguro de caución a favor de la SAT por el plazo de un año adicional."
            ],
            "documentos": [
                "Póliza de prórroga o nuevo seguro de caución original a favor de la SAT.",
                "Memorial de solicitud firmado conjuntamente por el representante legal y el apoderado especial.",
                "Copia de DPI de ambos personeros y carné aduanero vigente."
            ],
            "pasos": [
                "Ingresa la solicitud de renovación en la Unidad de Administración de Auxiliares de la Función Pública Aduanera (Torre SAT, nivel 3).",
                "Consigna la póliza original de renovación de fianza para su verificación y archivo.",
                "Obtén el sello de recepción oficial y la orden de refrendo de carné aduanero.",
                "Verifica la actualización del estado de habilitación en el padrón público del portal SAT."
            ],
            "resultadoObtenido": "Resolución de prórroga anual de habilitación de operaciones aduaneras y refrendo del carné oficial.",
            "tiempoEstimado": "5 a 10 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No presentar la renovación antes del vencimiento anual ocasiona la suspensión automática del usuario en el sistema aduanero y el bloqueo de la gestión de despachos.",
            "normativa": "RECAUCA Artículos 86 y 105; Manual DG-IAD/DNO-ADU-AYR-24."
        },
        "SAT-GES-0440": {
            "nombreActual": "Obtener solvencia fiscal para gestiones de auxiliar aduanero",
            "descripcion": "Genera en línea la constancia electrónica que acredita que el auxiliar y su empresa poderdante se encuentran al día en sus obligaciones tributarias. Es requisito ineludible para la acreditación inicial, renovación y registro de fianzas aduaneras.",
            "requisitos": [
                "Acceso a la Agencia Virtual SAT con usuario y contraseña válidos.",
                "No tener omisos de presentación en declaraciones de impuestos mensuales o anuales.",
                "No registrar adeudos líquidos y exigibles ni convenios de pago en estado de incumplimiento.",
                "Tener los datos del RTU ratificados en el año en curso."
            ],
            "documentos": [
                "No requiere documentos físicos; se genera automáticamente en formato PDF con código QR de verificación."
            ],
            "pasos": [
                "Inicia sesión en la Agencia Virtual con tu NIT y contraseña de seguridad.",
                "Selecciona en el menú la opción 'Servicios Tributarios' > 'Solvencia Fiscal'.",
                "El sistema realiza una auditoría informática en tiempo real de tu cuenta corriente tributaria.",
                "Si no registras omisos ni saldos pendientes, descarga e imprime la constancia oficial de solvencia fiscal."
            ],
            "resultadoObtenido": "Certificado de Solvencia Fiscal con código seguro de verificación electrónica y vigencia temporal normada.",
            "tiempoEstimado": "Inmediato (generación en línea 24/7)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Si el sistema detecta inconsistencias tributarias, mostrará un desglose de omisos o moras que deben subsanarse en Declaraguate antes de poder emitir la solvencia.",
            "normativa": "Código Tributario (Decreto 6-91) Artículo 57 'A'; Acuerdo de Directorio SAT 07-2007."
        },
        "SAT-GES-0433": {
            "nombreActual": "Transmitir declaración anticipada de mercancías para importación",
            "descripcion": "Transmite electrónicamente la declaración de mercancías antes del arribo físico del medio de transporte al territorio aduanero nacional. Agiliza el despacho fronterizo reduciendo los tiempos de estancia y costos de almacenaje.",
            "requisitos": [
                "Documentos de transporte (conocimiento de embarque, guía aérea o carta de porte) debidamente emitidos.",
                "Factura comercial o documento equivalente con valor final de transacción.",
                "Permisos o autorizaciones no arancelarias no automáticas aprobados por las ventanillas correspondientes (MAGA, MSPAS, MEM).",
                "Firma electrónica digital avanzada y saldo en cuenta para el pago electrónico de tributos aduaneros."
            ],
            "documentos": [
                "Declaración Única Centroamericana (DUCA-D o DUCA-F) en formato electrónico.",
                "Factura comercial y lista de empaque digitalizadas en el repositorio aduanero.",
                "Documento de transporte electrónico asociado al manifiesto de carga anticipado."
            ],
            "pasos": [
                "Ingresa al sistema aduanero y captura los datos de la declaración antes del arribo del embarque.",
                "Asocia los documentos soporte digitalizados y los números de permisos interinstitucionales en línea.",
                "Firma electrónicamente la declaración y efectúa el pago electrónico de los derechos arancelarios y tributos aplicables.",
                "Al presentarse el medio de transporte al recinto aduanero, activa el mecanismo de selectividad automatizada."
            ],
            "resultadoObtenido": "Declaración aduanera aceptada y pagada con selectivo asignado (verde para levante inmediato o rojo/amarillo para revisión).",
            "tiempoEstimado": "Menos de 2 horas (transmisión digital inmediata)",
            "costo": "Gratuito ante SAT (pago de los tributos de importación correspondientes)",
            "advertencia": "Cualquier discrepancia grave entre lo declarado anticipadamente y lo transportado físicamente anula el beneficio de despacho expedito y amerita fiscalización física.",
            "normativa": "Acuerdo de Facilitación del Comercio de la OMC Artículo 7.1; RECAUCA Artículo 323."
        },
        "SAT-GES-0434": {
            "nombreActual": "Gestionar declaración de mercancías en aduana sin papeles",
            "descripcion": "Carga y valida los documentos de soporte digitalizados que sustentan la declaración aduanera en el repositorio electrónico institucional. Elimina la presentación de expedientes físicos en papel en las aduanas marítimas, aéreas y terrestres.",
            "requisitos": [
                "Agente aduanero o apoderado especial habilitado con clave activa en el sistema aduanero.",
                "Documentos de soporte escaneados en formato PDF de alta resolución y legibilidad (resolución mínima 200 dpi).",
                "Número de orden de la declaración aduanera generada previamente en el sistema."
            ],
            "documentos": [
                "Factura comercial digitalizada con firma o sello de autenticidad.",
                "Documento de transporte (Bill of Lading, Guía Aérea o Carta de Porte) firmado.",
                "Certificado de origen o licencias no arancelarias digitalizadas, cuando corresponda."
            ],
            "pasos": [
                "Genera el borrador de la Declaración Única Centroamericana en el sistema SAQB'E o portal aduanero.",
                "Accede a la pestaña de repositorio documental y adjunta cada archivo PDF clasificándolo según su tipo de documento.",
                "Valida la legibilidad y conformidad de los adjuntos antes de firmar electrónicamente la transmisión.",
                "Envía la declaración; el sistema genera el código de barras y QR con el cual el transportista se presenta a rampa."
            ],
            "resultadoObtenido": "Recepción digital completa del expediente aduanero con trazabilidad informática y asignación de selectivo sin documentos físicos.",
            "tiempoEstimado": "10 a 20 minutos por declaración",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Subir archivos borrosos, incompletos o corruptos detendrá el levante aduanero en semáforo amarillo hasta que el operador cargue el documento legible.",
            "normativa": "Resolución de Superintendencia SAT-DSI-1017-2018 (Implementación del Despacho Aduanero sin Papeles); RECAUCA Artículo 321."
        },
        "SAT-GES-0435": {
            "nombreActual": "Tramitar autorizaciones en el sistema de franquicias electrónicas",
            "descripcion": "Gestiona la exención y dispensa de tributos para importaciones amparadas en tratados diplomáticos, organismos internacionales o leyes de fomento. Automatiza el cruce de autorizaciones entre el Ministerio de Relaciones Exteriores (MINEX), Finanzas y SAT.",
            "requisitos": [
                "Estar acreditado como sujeto beneficiario de franquicia diplomática, organismo multilateral o entidad con exención legal.",
                "Usuario registrado en el Sistema de Franquicias Electrónicas de la SAT o Agencia Virtual con perfil autorizado.",
                "Declaración de mercancías y factura comercial correspondientes a los bienes a exentar."
            ],
            "documentos": [
                "Solicitud electrónica de franquicia aprobada por el ministerio rector (MINEX o MINFIN).",
                "Factura comercial y conocimiento de embarque o documento de transporte asociado.",
                "Lista de empaque y catálogo descriptivo de los bienes a importar con franquicia."
            ],
            "pasos": [
                "Ingresa al módulo del Sistema de Franquicias Electrónicas en el portal de la SAT.",
                "Registra la solicitud de aplicación de franquicia vinculándola al número de resolución ministerial previa.",
                "Asocia las facturas comerciales y documentos de embarque que amparan la compra en el extranjero.",
                "Recibe el número de franquicia electrónica aprobada para consignarlo en la casilla correspondiente de la DUCA."
            ],
            "resultadoObtenido": "Autorización electrónica de franquicia aduanera que aplica el 100% de exención tributaria autorizada en la declaración de aduana.",
            "tiempoEstimado": "2 a 5 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Comercializar, transferir o dar uso comercial a bienes importados bajo régimen de franquicia diplomática o legal constituye delito de contrabando y defraudación aduanera.",
            "normativa": "Ley Orgánica del Presupuesto; Decreto Ley 22-73 (Ley de Franquicias Diplomáticas); RECAUCA Artículos 618 al 625."
        },
        "SAT-GES-0425": {
            "nombreActual": "Consultar asignación de rampa y estatus de revisión aduanera",
            "descripcion": "Verifica en línea la asignación de andenes, el técnico aduanero asignado y el avance de la inspección física de contenedores y carga suelta. Optimiza la coordinación operativa en recintos portuarios y aduanas internas.",
            "requisitos": [
                "Número de Declaración Única Centroamericana (DUCA) o número de contenedor.",
                "Conexión a internet para acceder al módulo de consultas aduaneras del Portal SAT."
            ],
            "documentos": [
                "DUCA impresa o electrónica con número correlativo visible.",
                "Contraseña o código de asignación de selectivo aduanero."
            ],
            "pasos": [
                "Ingresa a la sección de Consultas Aduaneras en el Portal SAT.",
                "Selecciona 'Asignación a rampa de revisión' o 'Revisores asignados' según la consulta requerida.",
                "Digita el número de la declaración aduanera o las siglas y número del contenedor.",
                "Visualiza la rampa asignada, el nombre del técnico de aduanas y el estatus actual de la diligencia."
            ],
            "resultadoObtenido": "Pantalla informativa con la ubicación exacta en rampa y el técnico aduanero encargado del reconocimiento físico.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las unidades de transporte deben posicionarse en la rampa designada en el horario estipulado para evitar cobros portuarios de permanencia en patio.",
            "normativa": "Procedimiento de Despacho de Mercancías PR-IAD/DNO-DE-01; RECAUCA Artículo 339."
        },
        "SAT-GES-0426": {
            "nombreActual": "Consultar expedientes de auxiliares aduaneros en gestión técnica",
            "descripcion": "Verifica el estado de dictámenes, solicitudes de autorización y trámites administrativos ingresados ante las dependencias de la Intendencia de Aduanas. Permite dar seguimiento oportuno a expedientes sin necesidad de desplazamientos físicos.",
            "requisitos": [
                "Número de expediente o código de gestión otorgado por la ventanilla de recepción aduanera.",
                "Identificación del auxiliar o personero legal que promovió la solicitud."
            ],
            "documentos": [
                "Contraseña de recepción de documentos o boleta con número de expediente asignado por SAT."
            ],
            "pasos": [
                "Ingresa al apartado de 'Consulta de Expedientes' en el portal de Aduanas de la SAT.",
                "Introduce el número de expediente y el año fiscal de ingreso.",
                "Verifica la unidad administrativa actual donde se encuentra asignado tu requerimiento.",
                "Consulta los oficios o providencias emitidas para solventar posibles prevenciones o requerimientos técnicos."
            ],
            "resultadoObtenido": "Detalle cronológico de movimientos del expediente y estado administrativo vigente.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Si el expediente registra un requerimiento o notificación pendiente, el plazo legal corre a partir del día siguiente de su entrega en buzón tributario.",
            "normativa": "Código Tributario Artículo 126; Ley de lo Contencioso Administrativo Artículo 1."
        },
        "SAT-GES-0427": {
            "nombreActual": "Consultar resoluciones y procedimientos de la Unión Aduanera",
            "descripcion": "Accede a las disposiciones normativas, resoluciones ministeriales e instructivos aplicables al proceso de integración profunda entre Guatemala, Honduras y El Salvador. Facilita el despacho expedito mediante la Factura y Declaración Única Centroamericana (FYDUCA).",
            "requisitos": [
                "Dispositivo con acceso a internet para descargar circulares y resoluciones técnicas bilaterales.",
                "Conocimiento del flujo comercial y régimen fronterizo aplicable (Puestos Fronterizos Integrados)."
            ],
            "documentos": [
                "Resoluciones de la Instancia Ministerial de la Unión Aduanera (IM-UA).",
                "Guías operativas de paso ágil por los Puestos Fronterizos Integrados (PFI)."
            ],
            "pasos": [
                "Ingresa a la sección de 'Unión Aduanera' en el portal oficial de la SAT.",
                "Selecciona el marco procedimental aplicable a la frontera de tránsito (Corinto, El Florido o Agua Caliente).",
                "Descarga los instructivos vigentes para la emisión, validación y paso de medios de transporte amparados con FYDUCA.",
                "Aplica los lineamientos homologados para evitar paradas o retenciones innecesarias en los controles integrados."
            ],
            "resultadoObtenido": "Acceso a las resoluciones binacionales vigentes y manuales operativos de facilitación comercial intrarregional.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las mercancías no originarias o exceptuadas del libre tránsito en la Unión Aduanera deben tramitarse obligatoriamente mediante DUCA y no aplican para FYDUCA.",
            "normativa": "Protocolo Habilitante para el Proceso de Integración Profunda hacia el Libre Tránsito de Mercancías; Resoluciones IM-UA."
        },
        "SAT-GES-0428": {
            "nombreActual": "Inscribirse en programas de formación y actualización aduanera",
            "descripcion": "Inscríbete en los cursos, talleres y seminarios virtuales especializados dictados por la SAT para auxiliares de la función pública aduanera. Fortalece las competencias en valoración, clasificación arancelaria y cumplimiento de normativas de comercio exterior.",
            "requisitos": [
                "Correo electrónico activo personal o de la empresa auxiliar aduanera.",
                "Acceso a computadora con internet para ingresar a la plataforma Moodle de Cultura Tributaria.",
                "Estar inscrito en el RTU y pertenecer al ecosistema del comercio exterior o profesional independiente."
            ],
            "documentos": [
                "Formulario de inscripción digital provisto en la convocatoria de capacitación institucional."
            ],
            "pasos": [
                "Ingresa a la cartelera de capacitaciones de Aduanas en el Portal SAT.",
                "Selecciona el programa formativo de tu interés (Valoración, Nomenclatura, OEA o Procedimientos).",
                "Llena el formulario digital de inscripción con tus datos y número de colegiado o auxiliar si aplica.",
                "Participa en las sesiones sincrónicas o asincrónicas y completa las actividades para obtener tu certificado oficial."
            ],
            "resultadoObtenido": "Constancia de participación y aprobación curricular emitida por la Superintendencia de Administración Tributaria.",
            "tiempoEstimado": "Variable según el curso (8 a 40 horas)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Completar los módulos de actualización técnica es considerado mérito favorable en las auditorías periódicas de cumplimiento para auxiliares aduaneros.",
            "normativa": "Ley Orgánica de la SAT Artículo 3 literal h); RECAUCA Artículo 75."
        },
        "SAT-GES-0429": {
            "nombreActual": "Consultar legislación aduanera en la biblioteca virtual SAT",
            "descripcion": "Accede a la recopilación digital oficial de convenios internacionales, tratados de libre comercio, códigos y leyes aduaneras de Guatemala. Garantiza la consulta de textos legales actualizados y vigentes para fundamentar operaciones y defensas legales.",
            "requisitos": [
                "Navegador de internet estándar con capacidad para visualizar o descargar archivos en PDF.",
                "Conocimiento de la materia jurídica, número de decreto o tratado a consultar."
            ],
            "documentos": [
                "Textos íntegros de CAUCA, RECAUCA, Ley Nacional de Aduanas y Tratados de Libre Comercio (TLC)."
            ],
            "pasos": [
                "Ingresa a la sección de 'Biblioteca en Línea SAT' > 'Legislación Aduanera'.",
                "Filtra los documentos por categoría: Leyes Nacionales, Normativa Regional o Tratados Comerciales.",
                "Selecciona la norma jurídica requerida para previsualizarla o guardarla en tu dispositivo.",
                "Utiliza los textos legales oficiales para sustentar peticiones, declaraciones y consultas arancelarias."
            ],
            "resultadoObtenido": "Documentos normativos oficiales con sus respectivas reformas consolidadas.",
            "tiempoEstimado": "Inmediato (acceso libre 24/7)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Verifica siempre que la norma consultada incorpore los decretos de reforma más recientes antes de formular descargos jurídicos.",
            "normativa": "Constitución Política de la República de Guatemala Artículo 171; Código Tributario Artículo 3."
        },
        "SAT-GES-0430": {
            "nombreActual": "Consultar preguntas frecuentes sobre operaciones aduaneras",
            "descripcion": "Resuelve dudas recurrentes sobre despacho de mercancías, valoración en aduana, plazos de almacenamiento y requisitos de auxiliares. Proporciona criterios oficiales en lenguaje directo para facilitar la autogestión de usuarios y profesionales.",
            "requisitos": [
                "Conexión a internet para consultar la base de conocimiento institucional de preguntas frecuentes.",
                "Identificar el tema operativo objeto de duda (importaciones, franquicias, tránsitos o subastas)."
            ],
            "documentos": [
                "No requiere documentos; es una guía pública de consulta en pantalla."
            ],
            "pasos": [
                "Ingresa a la sección de 'Preguntas Frecuentes' en el apartado de Aduanas del Portal SAT.",
                "Navega por las categorías temáticas o utiliza el buscador de palabras clave.",
                "Lee la respuesta institucional con su respectivo fundamento legal y práctico.",
                "En caso de dudas no resueltas, activa el canal de atención personalizada mediante el chat oficial de la SAT."
            ],
            "resultadoObtenido": "Orientación técnica inmediata sobre procedimientos y criterios habituales de la administración aduanera.",
            "tiempoEstimado": "Inmediato (consulta libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las respuestas de preguntas frecuentes son de carácter informativo; en controversias formales prevalece el texto expreso de la ley y las resoluciones de intendencia.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Código Tributario Artículo 101."
        },
        "SAT-GES-0431": {
            "nombreActual": "Consultar procedimientos para recursos y defensas administrativas aduaneras",
            "descripcion": "Conoce los plazos legales, requisitos formales y procedimientos para interponer recursos de revocatoria contra resoluciones de aduanas. Garantiza el debido proceso y el derecho de defensa frente a ajustes de valor, multas o liquidaciones tributarias.",
            "requisitos": [
                "Haber sido notificado legalmente de una resolución o providencia lesiva emitida por una aduana o la intendencia.",
                "Estar dentro del plazo perentorio legal para impugnar (10 días hábiles posteriores a la notificación de la resolución).",
                "Acreditar personería con documento de representación legal o mandato debidamente inscrito."
            ],
            "documentos": [
                "Cédula de notificación del acto o resolución que se impugna.",
                "Memorial formal de interposición del recurso de revocatoria con fundamentación jurídica y ofrecimiento de pruebas.",
                "Documentación probatoria y peritajes técnicos que desvirtúen los señalamientos de la autoridad aduanera."
            ],
            "pasos": [
                "Revisa la cédula de notificación y calcula con exactitud el término perentorio de 10 días hábiles para impugnar.",
                "Redacta el memorial con auxilio de abogado colegiado activo, señalando los agravios y las normas infringidas.",
                "Presenta el memorial de recurso de revocatoria en la aduana de origen o en la ventanilla de recepción de la SAT.",
                "Monitorea el expediente hasta que la autoridad eleve los autos al Directorio de la SAT para resolución definitiva."
            ],
            "resultadoObtenido": "Recepción formal del recurso de revocatoria con suspensión provisional de los cobros en controversia durante la vía administrativa.",
            "tiempoEstimado": "30 a 60 días hábiles para resolución de segunda instancia",
            "costo": "Gratuito ante SAT (honorarios de asesoría legal por cuenta del interesado)",
            "advertencia": "Presentar el recurso de revocatoria fuera del plazo de 10 días hábiles provoca que la resolución cause firmeza y sea exigible por la vía económico coactiva.",
            "normativa": "Código Aduanero Uniforme Centroamericano (CAUCA) Artículo 127; Código Tributario Artículo 154."
        },
        "SAT-GES-0432": {
            "nombreActual": "Solicitar criterio técnico arancelario y valoración en aduanas",
            "descripcion": "Solicita formalmente a la Intendencia de Aduanas un dictamen técnico vinculante sobre la clasificación arancelaria o el método de valoración de una mercancía. Otorga certeza jurídica anticipada antes de efectuar el embarque e importación al país.",
            "requisitos": [
                "Estar inscrito en el RTU con datos vigentes y solvencia fiscal.",
                "Muestra física de la mercancía, ficha técnica de laboratorio, plano de ingeniería o catálogo de composición química.",
                "Factura comercial o proforma donde conste la descripción del producto, país de origen y fabricante.",
                "Pago de la tarifa correspondiente por emisión de dictamen técnico arancelario."
            ],
            "documentos": [
                "Memorial de solicitud dirigido a la Unidad de Clasificación Arancelaria y Valoración Aduanera.",
                "Muestra del producto o ficha técnica certificada por el fabricante.",
                "Comprobante de pago del servicio técnico arancelario emitido en Declaraguate."
            ],
            "pasos": [
                "Genera el formulario de pago en Declaraguate y cancélalo en banca virtual.",
                "Entrega el memorial de solicitud junto con la muestra física o ficha técnica en la Torre SAT (zona 9, tercer nivel).",
                "Los peritos arancelarios de la SAT analizan la composición, uso y reglas de clasificación del Sistema Arancelario Centroamericano (SAC).",
                "Recibe la resolución formal con el criterio arancelario oficial y vinculante para futuras importaciones de ese producto."
            ],
            "resultadoObtenido": "Resolución anticipada de clasificación arancelaria vinculante ante todas las aduanas de la República.",
            "tiempoEstimado": "15 a 30 días hábiles",
            "costo": "Q250.00 a Q500.00 (según tarifa normada para análisis de clasificación arancelaria)",
            "advertencia": "Si la mercancía importada presenta variaciones en sus componentes o especificaciones técnicas respecto a la muestra evaluada, el criterio perderá validez legal en aduana.",
            "normativa": "RECAUCA Artículos 186 al 195; Decreto 14-2013 Ley Nacional de Aduanas."
        },

        # -------------------------------------------------------------
        # 3. EMPRESAS DE ENTREGA RÁPIDA O COURIER (3 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0461": {
            "nombreActual": "Registrar fianza y seguro de caución para empresas courier",
            "descripcion": "Entrega en custodia la póliza de seguro de caución que garantiza las operaciones de importación y despacho rápido de envíos urgentes. Habilita a la empresa de entrega rápida para realizar desaduanamientos ágiles y retiros inmediatos de paquetes.",
            "requisitos": [
                "Contar con resolución de habilitación como Empresa de Entrega Rápida o Courier emitida por la Intendencia de Aduanas.",
                "Disponer de la póliza de fianza original emitida por entidad autorizada a favor de la SAT por el monto regulado.",
                "Solvencia fiscal vigente tanto de la empresa courier como de su representante legal.",
                "Estar incorporado al sistema aduanero de aduana sin papeles y manifiestos aéreos."
            ],
            "documentos": [
                "Póliza original de fianza de seguro de caución y copia simple.",
                "Memorial de entrega de fianza firmado por el representante legal acreditado.",
                "Copia de la resolución administrativa de registro como auxiliar courier."
            ],
            "pasos": [
                "Preséntate en la Unidad de Administración de Auxiliares de la Función Pública Aduanera (Edificio Torre SAT, zona 9).",
                "Entrega la póliza original del seguro de caución para su registro en el sistema aduanero.",
                "Recibe la contraseña y copia sellada de recepción de la garantía.",
                "Verifica que el cupo y vigencia de la fianza se reflejen activos en el sistema de gestión aduanera."
            ],
            "resultadoObtenido": "Constancia de fianza aduanera debidamente inscrita que activa la clave de transmisión courier para vuelos de carga.",
            "tiempoEstimado": "Inmediato (el mismo día de entrega)",
            "costo": "Gratuito ante SAT (pago de prima contractual a la afianzadora)",
            "advertencia": "Operar paquetes con fianza vencida impide la liberación de guías courier en la aduana aérea y acarrea multas por retardo de despacho.",
            "normativa": "CAUCA Artículo 21; RECAUCA Artículos 134 al 140 (Empresas de Entrega Rápida o Courier)."
        },
        "SAT-GES-0459": {
            "nombreActual": "Consultar requisitos y modalidades para importación de envíos courier",
            "descripcion": "Consulta las directrices operativas, topes de valor y formalidades para el despacho de encomiendas y paquetes courier en aduanas aéreas. Permite diferenciar entre pequeños envíos familiares sin carácter comercial y paquetes sujetos a declaración formal.",
            "requisitos": [
                "Conexión a internet para consultar los manuales y clasificaciones de encomiendas aduaneras.",
                "Identificar el tipo de mercancía, valor en aduana (CIF) y destinatario del paquete."
            ],
            "documentos": [
                "Guía de paquetería expresa o House Air Waybill (HAWB).",
                "Factura comercial o declaración de valor consignada por el remitente."
            ],
            "pasos": [
                "Ingresa a la sección de Importaciones y Courier en el portal del Programa MIAD de la SAT.",
                "Verifica las categorías de clasificación: Categoría A (documentos), Categoría B (bajo valor exento) y Categoría C/D (declaración con impuestos).",
                "Comprueba si los bienes transportados están sujetos a licencias no arancelarias de salud, agricultura o armas.",
                "Aplica el procedimiento simplificado de liquidación para agilizar la entrega al cliente final."
            ],
            "resultadoObtenido": "Guía práctica de categorización de envíos y cálculo anticipado de impuestos para paquetes postales.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Fraccionar intencionalmente compras de un mismo proveedor para no superar los topes de exención constituye una falta aduanera sujeta a comiso y sanción.",
            "normativa": "RECAUCA Artículos 579 al 587 (Despacho de Envíos de Entrega Rápida); Acuerdo de Directorio SAT 07-2007."
        },
        "SAT-GES-0460": {
            "nombreActual": "Gestionar exenciones en franquicias electrónicas para paquetes courier",
            "descripcion": "Aplica las resoluciones de dispensa tributaria y exención legal a través del sistema electrónico para encomiendas diplomáticas o de ayuda humanitaria. Permite ingresar envíos courier exentos de derechos arancelarios de importación con trazabilidad en línea.",
            "requisitos": [
                "Contar con código de auxiliar courier activo en la Intendencia de Aduanas.",
                "Disponer de la resolución de franquicia previa emitida por el Ministerio de Relaciones Exteriores o entidad competente.",
                "Guía aérea individual asociada al beneficiario legítimo de la exención tributaria."
            ],
            "documentos": [
                "Resolución ministerial de concesión de franquicia diplomática u oficial.",
                "Guía aérea House (HAWB) y factura comercial que describe el envío.",
                "Acreditación diplomática o institucional del destinatario."
            ],
            "pasos": [
                "Ingresa con tu usuario courier al Sistema de Franquicias Electrónicas en el portal SAT.",
                "Registra la guía aérea y vincula el código de autorización ministerial correspondiente.",
                "Carga digitalmente la factura y conocimiento de embarque en el repositorio del despacho sin papeles.",
                "Transmite la declaración courier y obtiene el pase de salida sin cobro de aranceles."
            ],
            "resultadoObtenido": "Autorización electrónica de levante sin pago de tributos amparada en franquicia legal.",
            "tiempoEstimado": "1 a 2 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Los paquetes amparados bajo franquicia diplomática no pueden contener mercancías de venta masiva ni bienes para uso lucrativo de terceros.",
            "normativa": "Decreto Ley 22-73; RECAUCA Artículo 138 literal d)."
        },

        # -------------------------------------------------------------
        # 4. TRANSPORTISTAS ADUANEROS (14 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0470": {
            "nombreActual": "Registrar ingreso de equipo de carga terrestre (Régimen ATC)",
            "descripcion": "Registra el ingreso temporal de cabezales, remolques y contenedores extranjeros dedicados al transporte internacional de mercancías. Permite circular legalmente en el territorio guatemalteco durante el plazo normado sin pagar impuestos de importación.",
            "requisitos": [
                "Transportista o piloto autorizado y registrado previamente ante la SAT.",
                "Tarjeta de circulación o título de propiedad del vehículo y remolque expedido en el país de origen.",
                "Licencia de conducir vigente del piloto y documento de identidad o pasaporte.",
                "Manifiesto de carga internacional o carta de porte terrestre asociada."
            ],
            "documentos": [
                "Formulario de Admisión Temporal de Equipo de Carga (ATC) SAT-8349 en original y copia.",
                "Tarjeta de circulación original del cabezal y remolque/chasis.",
                "Manifiesto de carga terrestre o Declaración Única Centroamericana (DUCA-T)."
            ],
            "pasos": [
                "Preséntate en el módulo de ingreso de la aduana fronteriza terrestre por donde ingresas al país.",
                "Presenta el medio de transporte para la verificación física del número de placa, chasis (VIN) y contenedor.",
                "El funcionario aduanero digita los datos del equipo de carga en el sistema de control ATC.",
                "Recibe el formulario SAT-8349 sellado y firmado, donde consta la fecha límite autorizada para permanecer en el país."
            ],
            "resultadoObtenido": "Formulario oficial SAT-8349 sellado que autoriza el tránsito y permanencia temporal del equipo de carga.",
            "tiempoEstimado": "20 a 40 minutos en garita aduanera",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Permanecer en el país después del plazo autorizado en el formulario ATC genera multas diarias de permanencia ilegal y retención del medio de transporte.",
            "normativa": "Procedimiento PR-IAD/DNO-CA-03; RECAUCA Artículos 141 al 149."
        },
        "SAT-GES-0467": {
            "nombreActual": "Solicitar prórroga de plazo para equipo de carga terrestre (ATC)",
            "descripcion": "Solicita la ampliación del período de permanencia temporal en el país para cabezales, remolques o contenedores que no han podido salir por causas justificadas. Evita la imposición de multas por vencimiento de plazo de estadía aduanera.",
            "requisitos": [
                "Formulario original de Admisión Temporal de Equipo de Carga SAT-8349 emitido a la entrada al país.",
                "Presentar la solicitud antes de que expire el plazo original consignado en el formulario ATC.",
                "Documentación fehaciente que acredite la causa de fuerza mayor o retardo justificado (orden de taller, reparación mecánica o espera de carga de exportación).",
                "Estar al día en solvencia fiscal de transporte aduanero."
            ],
            "documentos": [
                "Memorial o solicitud de ampliación de plazo firmado por el transportista o consignatario.",
                "Formulario SAT-8349 original con el que ingresó el equipo.",
                "Informe técnico mecánico, denuncia policial o carta de la empresa exportadora que respalda la necesidad de prórroga."
            ],
            "pasos": [
                "Ingresa la solicitud de prórroga de ATC a través de la Agencia Virtual o en la aduana más cercana a la ubicación del equipo.",
                "Adjunta las justificaciones documentales que demuestran la causa fortuita o logística de la demora.",
                "El administrador de la aduana evalúa la procedencia del plazo y emite la providencia de ampliación.",
                "Recibe la constancia de ampliación de permanencia temporal y actualiza la fecha en el sistema informático aduanero."
            ],
            "resultadoObtenido": "Resolución de prórroga del plazo de admisión temporal y actualización informática de la vigencia del formulario ATC.",
            "tiempoEstimado": "2 a 3 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La solicitud de prórroga debe presentarse estrictamente antes del vencimiento del plazo original; una vez vencido el ATC no se admite prórroga y procede sanción.",
            "normativa": "Procedimiento PR-IAD/DNO-CA-03 Norma 18; RECAUCA Artículo 146."
        },
        "SAT-GES-0468": {
            "nombreActual": "Culminar admisión temporal de equipo de carga terrestre (ATC)",
            "descripcion": "Registra ante la aduana de salida el egreso formal del territorio nacional de contenedores, cabezales y remolques extranjeros. Cancela el compromiso aduanero y libera al transportista de cargos tributarios y responsabilidades legales.",
            "requisitos": [
                "Presentar físicamente el medio de transporte o equipo de carga en la garita de salida aduanera.",
                "Portar el ejemplar original del formulario SAT-8349 de Admisión Temporal de Equipo de Carga.",
                "Verificar que las características físicas (placa, marca, chasis y contenedor) coincidan fielmente con el formulario."
            ],
            "documentos": [
                "Formulario original de Admisión Temporal de Equipo de Carga (ATC) SAT-8349.",
                "Tarjeta de circulación y documento de identidad del piloto conductor.",
                "DUCA de exportación o DUCA-T de tránsito internacional con que egresa el equipo."
            ],
            "pasos": [
                "Preséntate al módulo de salida en la aduana fronteriza terrestre por donde abandonarás el país.",
                "Entrega el formulario SAT-8349 al oficial de aduanas junto con los documentos del vehículo.",
                "El técnico aduanero realiza el cotejo físico de las placas, número de chasis y contenedor.",
                "El oficial registra la salida en el sistema y devuelve un ejemplar del formulario con fecha, firma y sello de culminación oficial."
            ],
            "resultadoObtenido": "Formulario SAT-8349 con sello oficial de culminación que acredita la salida legal del equipo de carga del país.",
            "tiempoEstimado": "15 a 30 minutos",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Si el formulario ATC presenta inconsistencias en el número de chasis o placas, el sistema aduanero impedirá el egreso del vehículo hasta que se aclare la discrepancia.",
            "normativa": "Procedimiento PR-IAD/DNO-CA-03 Normas 20, 21 y 22; RECAUCA Artículo 148."
        },
        "SAT-GES-0469": {
            "nombreActual": "Solicitar devolución de pagos indebidos por admisión temporal (ATC)",
            "descripcion": "Solicita en línea el reintegro de pagos tributarios efectuados por error o cobros improcedentes en el régimen de admisión temporal de equipos de carga. Permite a navieras y transportistas recuperar saldos pagados de más en formularios SAT-8349 o SAT-8008.",
            "requisitos": [
                "Estar inscrito en el RTU con datos ratificados y contar con solvencia fiscal vigente.",
                "Disponer de acceso a la Agencia Virtual SAT.",
                "Tener los comprobantes bancarios originales y declaraciones que demuestren el pago erróneo o duplicado.",
                "Registros contables certificados de Diario Mayor donde conste la afectación del pago indebido."
            ],
            "documentos": [
                "Formularios SAT-8349-1 autorizados donde consta la permanencia temporal del equipo.",
                "Comprobantes bancarios de pago correcto y pago indebido (formularios SAT-8008, SAT-8349 o SAT-8011).",
                "Póliza de seguro de caución vigente y registros contables certificados del movimiento.",
                "Póliza aduanera y documentos de embarque (Bill of Lading, Carta de Porte o factura)."
            ],
            "pasos": [
                "Ingresa a la Agencia Virtual de la SAT y selecciona 'Servicios del Contribuyente' > 'Solicitud de Devolución de Pagos Indebidos' (Formulario 2410).",
                "Completa los datos del pago duplicado o erróneo y carga en PDF todos los comprobantes y estados contables requeridos.",
                "Presiona 'Enviar Solicitud' y recibe el correo electrónico de confirmación de recepción satisfactoria.",
                "La unidad técnica dictamina la procedencia y la SAT acredita el reintegro en la cuenta bancaria registrada."
            ],
            "resultadoObtenido": "Resolución de devolución y transferencia del crédito tributario indebidamente pagado a la cuenta bancaria del titular.",
            "tiempoEstimado": "30 a 45 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La solicitud de devolución prescribe a los 4 años contados a partir de la fecha en que se realizó el pago indebido ante la administración tributaria.",
            "normativa": "Código Tributario Artículos 153 y 153 'A'; Procedimiento PR-IAD/DNO-CA-03."
        },
        "SAT-GES-0462": {
            "nombreActual": "Autorizar ingreso de herramientas y maquinaria a zona primaria",
            "descripcion": "Solicita permiso oficial para ingresar temporalmente herramientas de trabajo, grúas o maquinaria de mantenimiento a recintos aduaneros y zonas primarias. Permite ejecutar reparaciones y maniobras autorizadas sin incurrir en sospecha de contrabando.",
            "requisitos": [
                "Ser consignatario, representante legal, agente aduanero, apoderado especial o empresa courier.",
                "Presentar Documento Personal de Identificación (DPI) del personal que ingresará los equipos o pasaporte para extranjeros.",
                "Factura o título de propiedad que acredite legalmente la posesión de las herramientas o maquinaria.",
                "Declaración aduanera asociada o justificación de las obras a ejecutar dentro del recinto."
            ],
            "documentos": [
                "Carta de solicitud de ingreso detallando marca, modelo, serie y características de cada herramienta o maquinaria.",
                "Factura de compra o tarjeta de propiedad de la maquinaria.",
                "Copia de DPI o pasaporte de los operarios técnicos responsables."
            ],
            "pasos": [
                "Preséntate a la Administración de la Aduana por donde ingresarán los equipos de trabajo.",
                "Entrega la carta de solicitud con el inventario pormenorizado y los documentos de propiedad.",
                "El administrador aduanero revisa los antecedentes y emite providencia de autorización (o sello de recibido si son herramientas menores).",
                "El personal de garita inspecciona los equipos al ingresar y verifica que egresen exactamente los mismos al culminar las labores."
            ],
            "resultadoObtenido": "Providencia o copia sellada de autorización que permite el ingreso temporal y garantiza el libre egreso de las herramientas.",
            "tiempoEstimado": "El mismo día hábil (1 a 2 horas)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Es responsabilidad del solicitante retirar las mismas herramientas declaradas; cualquier discrepancia o sustitución en garita provocará el decomiso inmediato y denuncia penal por defraudación aduanera.",
            "normativa": "Código Aduanero Uniforme Centroamericano (CAUCA) Artículo 12; RECAUCA Artículo 66."
        },
        "SAT-GES-0463": {
            "nombreActual": "Consultar asignación de técnicos revisores en despachos aduaneros",
            "descripcion": "Verifica en tiempo real el técnico aduanero que ha sido designado por sorteo automatizado para el examen físico o documental de un embarque. Otorga transparencia al proceso de reconocimiento de mercancías en recintos portuarios y aduanas.",
            "requisitos": [
                "Número de Declaración Única Centroamericana (DUCA) validada con selectivo asignado.",
                "Acceso a internet para ingresar al sistema de consultas aduaneras del Portal SAT."
            ],
            "documentos": [
                "Copia digital o impresa de la DUCA con número de correlativo de importación o exportación."
            ],
            "pasos": [
                "Ingresa a la sección 'Consultas Aduaneras' > 'Asignación de Revisores' en el Portal SAT.",
                "Digita el número de declaración aduanera y el código de la aduana de despacho.",
                "Presiona 'Consultar' para visualizar el nombre del funcionario revisor y la fecha de asignación.",
                "Coordina con tu gestor en recinto la presentación del medio de transporte ante el técnico asignado."
            ],
            "resultadoObtenido": "Pantalla informativa con el nombre del revisor aduanero y estado actual de la diligencia de reconocimiento.",
            "tiempoEstimado": "Inmediato (consulta en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La asignación de revisores es totalmente automatizada y aleatoria; ningún operador puede solicitar la sustitución o designación discrecional de un revisor específico.",
            "normativa": "RECAUCA Artículo 338 (Reconocimiento de las Mercancías); Procedimiento PR-IAD/DNO-DE-01."
        },
        "SAT-GES-0464": {
            "nombreActual": "Consultar asignación de rampa en Puerto Quetzal",
            "descripcion": "Consulta el andén y turno de rampa programado para la inspección física de contenedores en las instalaciones portuarias de Puerto Quetzal. Facilita la programación logística y reduce las esperas de los pilotos de transporte pesado.",
            "requisitos": [
                "Número de contenedor o número de declaración de mercancías DUCA.",
                "Conexión a internet desde computadora o teléfono inteligente."
            ],
            "documentos": [
                "DUCA y documento de transporte marítimo correspondiente (Bill of Lading)."
            ],
            "pasos": [
                "Accede a la herramienta 'Asignación de Rampa Puerto Quetzal' en el portal aduanero de la SAT.",
                "Introduce el número de contenedor de 11 dígitos o el número de la declaración.",
                "Revisa el número de rampa asignada y la ventana horaria programada para el posicionamiento del contenedor.",
                "Comunica la asignación al transportista para posicionar la plataforma en el andén indicado."
            ],
            "resultadoObtenido": "Número de andén de rampa y ventana horaria oficial para el reconocimiento físico del contenedor.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No presentarse en la ventana horaria asignada cancela el turno en rampa y obliga a solicitar reprogramación con costos de estadía portuaria adicionales.",
            "normativa": "Convenio de Operación Conjunta SAT - Empresa Portuaria Quetzal; RECAUCA Artículo 339."
        },
        "SAT-GES-0472": {
            "nombreActual": "Transmitir mensaje de carga aduanera CUSCAR para manifiestos",
            "descripcion": "Transmite el mensaje electrónico estándar CUSCAR (Customs Cargo Report) con el manifiesto anticipado de carga de buques, aeronaves y camiones. Cumple con la obligación internacional de informar a la autoridad aduanera sobre mercancías en ruta.",
            "requisitos": [
                "Estar acreditado como transportista aduanero, naviera, aerolínea o consolidador de carga.",
                "Disponer de conexión segura al web service o portal EDI aduanero de la SAT.",
                "Firma electrónica avanzada para la suscripción de transmisiones estructuradas EDIFACT/XML."
            ],
            "documentos": [
                "Manifiesto general de carga y conocimientos de embarque individuales (BLs o cartas de porte).",
                "Lista de mercancías peligrosas o perecederas en caso de aplicar."
            ],
            "pasos": [
                "Genera el archivo electrónico CUSCAR en tu sistema de gestión logística bajo el estándar internacional normado.",
                "Transmite el mensaje a través del canal informático aduanero dentro de los plazos de anticipación obligatorios.",
                "Recibe el mensaje de respuesta electrónica CUSRSP con la validación de aceptación o rechazo de sintaxis.",
                "Con la confirmación favorable, el manifiesto queda enlazado y disponible para la transmisión de las DUCAs de los importadores."
            ],
            "resultadoObtenido": "Número de registro de manifiesto aduanero aceptado en el sistema informático aduanero nacional.",
            "tiempoEstimado": "Menos de 15 minutos (transmisión automatizada de sistemas)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Transmitir el mensaje CUSCAR fuera de los plazos reglamentarios (previos al zarpe o arribo) constituye infracción administrativa sancionada con multa aduanera.",
            "normativa": "RECAUCA Artículos 242 al 249 (Transmisión del Manifiesto de Carga); Estándar de Mensajería EDI CUSCAR de las Naciones Unidas."
        },
        "SAT-GES-0471": {
            "nombreActual": "Consultar y asociar documentos del manifiesto de carga",
            "descripcion": "Consulta el estado de digitalización y vinculación de los conocimientos de embarque, cartas de porte y guías aéreas dentro del manifiesto aduanero. Permite subsanar discrepancias de pesos, bultos y consignatarios antes de la llegada de la carga.",
            "requisitos": [
                "Número de manifiesto aduanero generado por la autoridad portuaria o aduanera.",
                "Clave de acceso de auxiliar de transporte o agente de carga en la Agencia Virtual."
            ],
            "documentos": [
                "Manifiesto de carga suscrito por el capitán del medio de transporte o agente general.",
                "Conocimientos de embarque (B/L, Guía Aérea o Carta de Porte) originales o digitalizados."
            ],
            "pasos": [
                "Ingresa al módulo de 'Documentos Manifiesto' en el sistema aduanero de la SAT.",
                "Digita el número de manifiesto correspondiente al viaje o vuelo de carga.",
                "Verifica la lista de documentos de transporte enlazados y confirma que los bultos coincidan con la sumatoria física.",
                "Si existen sobrantes, faltantes o cartas de corrección, ingresa la solicitud de adición antes de la descarga."
            ],
            "resultadoObtenido": "Confirmación informática del manifiesto consolidado y listo para inicio de descarga en muelle o rampa.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Cualquier bulto sobrante o faltante no justificado mediante carta de corrección dentro del plazo legal generará proceso administrativo y retención preventiva.",
            "normativa": "RECAUCA Artículos 254 al 260; Ley Nacional de Aduanas Decreto 14-2013."
        },
        "SAT-GES-0473": {
            "nombreActual": "Verificar uso y monitoreo del marchamo electrónico en tránsitos",
            "descripcion": "Consulta la normativa, dispositivos autorizados y áreas de activación para la custodia satelital de contenedores en tránsito interno aduanero. Monitorea que la unidad de transporte cumpla con el seguimiento GPS en tiempo real entre aduanas.",
            "requisitos": [
                "Transportista o consignatario con operaciones bajo regímenes aduaneros sujetos a custodia satelital obligatoria.",
                "Unidad de transporte equipada con contenedor cerrado o furgón apto para colocación de precinto electrónico.",
                "Contrato con una Entidad Prestadora del Servicio de Marchamo Electrónico (EPSME) debidamente autorizada por la SAT."
            ],
            "documentos": [
                "DUCA-T de tránsito aduanero interno o DTI aceptada en el sistema.",
                "Boleta de asignación y prueba de transmisión del dispositivo marchamo electrónico emitida por la empresa prestadora."
            ],
            "pasos": [
                "Al despachar la unidad en la aduana de partida, presenta el vehículo en el área de activación de marchamo.",
                "El operador de la empresa autorizada instala y activa el dispositivo GPS en las manijas del contenedor.",
                "El sistema aduanero enlaza el ID del marchamo electrónico con la declaración de tránsito aduanero.",
                "El vehículo inicia su ruta; el sistema monitorea en tiempo real velocidad, ruta autorizada y posibles alertas de apertura.",
                "Al llegar a la aduana de destino o almacén fiscal, el técnico aduanero desactiva y retira el dispositivo sin incidencias."
            ],
            "resultadoObtenido": "Trazabilidad completa del tránsito aduanero y cierre exitoso de la ruta satelital sin alertas de desviación.",
            "tiempoEstimado": "10 a 15 minutos para colocación y activación física del dispositivo",
            "costo": "Tarifa fijada por la empresa prestadora del servicio privado homologada ante SAT",
            "advertencia": "Detenerse en rutas no autorizadas, desviarse del trazado satelital o forzar el precinto genera alerta roja inmediata a las patrullas aduaneras de la SAT y Policía Nacional Civil.",
            "normativa": "Resoluciones de Superintendencia SAT-DSI-871-2017 y SAT-DSI-1917-2023; Procedimiento PR-IAD/DNO-ADU-AYR-10."
        },
        "SAT-GES-0475": {
            "nombreActual": "Consultar tránsitos aduaneros internos pendientes de arribo",
            "descripcion": "Consulta el listado de declaraciones de tránsito terrestre interno cuyo plazo de viaje aún no ha sido culminado en la aduana de destino. Permite alertar oportunamente sobre demoras en carretera para prevenir la presunción de extravío de carga.",
            "requisitos": [
                "Número de declaración de tránsito (DUCA-T) o número de placa del medio de transporte.",
                "Conexión a internet para ingresar al módulo de consultas del portal aduanero SAT."
            ],
            "documentos": [
                "Copia de la declaración de tránsito aduanero con la hora y fecha de salida de la aduana de origen."
            ],
            "pasos": [
                "Accede a la herramienta 'Tránsito Pendiente' en el portal aduanero de la SAT.",
                "Introduce el rango de fechas de despacho y la aduana de partida o destino.",
                "Revisa el tiempo transcurrido en carretera y el plazo perentorio de arribo otorgado por el sistema.",
                "Si la unidad sufrió un percance mecánico en ruta, notifica de inmediato a la autoridad aduanera para pausar el plazo."
            ],
            "resultadoObtenido": "Reporte en pantalla con el estado del tránsito aduanero, aduana de destino y tiempo restante de viaje.",
            "tiempoEstimado": "Inmediato (consulta libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Superar el tiempo límite de tránsito asignado sin dar aviso de percance activa de forma automática una alerta de riesgo por presunto desvío de mercancías.",
            "normativa": "RECAUCA Artículos 393 al 404 (Tránsito Aduanero Interno); Procedimiento PR-IAD/DNO-TR-01."
        },
        "SAT-GES-0474": {
            "nombreActual": "Consultar preguntas frecuentes sobre el marchamo electrónico",
            "descripcion": "Resuelve dudas técnicas y operativas sobre el funcionamiento de los precintos satelitales GPS, tarifas y procedimientos ante emergencias en ruta. Facilita a transportistas y generadores de carga el cumplimiento de los estándares de seguridad aduanera.",
            "requisitos": [
                "Dispositivo con acceso a internet para consultar la sección de preguntas frecuentes aduaneras.",
                "Interés en la regulación del tránsito aduanero interno custodiado."
            ],
            "documentos": [
                "No requiere documentos; es una guía pública de consulta en línea."
            ],
            "pasos": [
                "Ingresa a la sección de Preguntas Frecuentes de Marchamo Electrónico en el portal de la SAT.",
                "Explora los temas sobre activación, zonas de recarga de batería, empresas certificadas y protocolo en caso de accidentes.",
                "Aplica los lineamientos para evitar manipulaciones indebidas que disparen falsas alarmas de apertura.",
                "Contacta al Centro de Monitoreo Aduanero en caso de dudas operativas adicionales."
            ],
            "resultadoObtenido": "Información oficial sobre el correcto manejo del marchamo electrónico durante el transporte terrestre.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La rotura accidental o deliberada del marchamo satelital es causal de decomiso preventivo del vehículo y apertura de investigación penal inmediata.",
            "normativa": "Resolución SAT-IAD-02-2019; RECAUCA Artículo 398."
        },
        "SAT-GES-0465": {
            "nombreActual": "Consultar procedimientos sancionatorios de la intendencia de aduanas",
            "descripcion": "Conoce los lineamientos normados para la tipificación de infracciones aduaneras y la tramitación de audiencias y sanciones administrativas. Permite a transportistas y auxiliares ejercer su derecho de descargo ante observaciones de la autoridad.",
            "requisitos": [
                "Haber sido notificado de un requerimiento, audiencia de ajuste o pliego de cargos aduaneros.",
                "Conexión a internet para descargar manuales procedimentales de la SAT.",
                "Estar dentro del plazo legal para contestar la audiencia conferida."
            ],
            "documentos": [
                "Cédula de notificación de la audiencia de infracción aduanera.",
                "Procedimiento PR-IAD-DNO-PO-17 descargable desde el portal aduanero.",
                "Expediente aduanero de descargo y pruebas de respaldo."
            ],
            "pasos": [
                "Ingresa al apartado de procedimientos administrativos de la Intendencia de Aduanas en el Portal SAT.",
                "Descarga el procedimiento PR-IAD-DNO-PO-17 para la aplicación de sanciones aduaneras.",
                "Verifica el procedimiento que debe seguir la administración para calificar la gravedad de la falta.",
                "Prepara el memorial de evacuación de audiencia conforme a los pasos normados y plazos legales."
            ],
            "resultadoObtenido": "Guía oficial para la correcta tramitación de expedientes sancionatorios aduaneros en vía administrativa.",
            "tiempoEstimado": "Inmediato (consulta de manuales)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No contestar las audiencias en el plazo de ley implica que la administración aduanera resolverá el cobro de la multa en rebeldía.",
            "normativa": "Ley Nacional de Aduanas (Decreto 14-2013); Código Tributario Artículos 146 y 147."
        },
        "SAT-GES-0466": {
            "nombreActual": "Consultar catálogo de sanciones en importación, exportación y tránsito",
            "descripcion": "Accede a la tabla oficial de multas, faltas aduaneras y causales de suspensión aplicables a operadores de comercio exterior y transportistas. Brinda certidumbre sobre las consecuencias económicas y administrativas derivadas del incumplimiento de formalidades.",
            "requisitos": [
                "Navegador de internet para consultar la legislación aduanera sancionatoria en el portal de la SAT.",
                "Conocimiento de la falta observada en la declaración de mercancías o tránsito."
            ],
            "documentos": [
                "Ley Nacional de Aduanas (Decreto 14-2013) y tabla de infracciones administrativas.",
                "Resolución o requerimiento notificado por la administración tributaria."
            ],
            "pasos": [
                "Accede a la sección de 'Sanciones Aplicables' en el portal aduanero de la SAT.",
                "Identifica el tipo de infracción (falta formal, inexactitud en declaración, retraso en tránsito o falta grave).",
                "Consulta el porcentaje o monto fijo de la multa y las reducciones o rebajas por pago voluntario que contempla la ley.",
                "Efectúa el pago mediante Declaraguate o formula la impugnación correspondiente en los plazos fijados."
            ],
            "resultadoObtenido": "Cálculo transparente del monto legal de la sanción y conocimiento de las opciones de rectificación y rebaja.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Efectuar el pago voluntario de la multa antes de la notificación formal otorga reducciones legales de hasta el 75% sobre el valor de la sanción.",
            "normativa": "Ley Nacional de Aduanas Decreto 14-2013 Artículos 5 al 28; Código Tributario Artículo 94."
        }
    }

    # Now let's also enrich DEPÓSITOS ADUANEROS (36 gestiones) and any others remaining in AFPA!
    # Let's inspect all items in AFPA to see which ones are in Depósitos Aduaneros and enrich them systematically.
    updated_count = 0
    for item in data:
        tid = item.get('id')
        if tid in afpa_data:
            ed = afpa_data[tid]
            for k, v in ed.items():
                item[k] = v
            # Ensure tipologia and metadata
            if 'requisitos' in ed:
                item['requisitos'] = ed['requisitos']
            if 'pasos' in ed:
                item['pasos'] = ed['pasos']
            if 'documentos' in ed:
                item['documentos'] = ed['documentos']
            if 'resultadoObtenido' in ed:
                item['resultadoObtenido'] = ed['resultadoObtenido']
            if 'advertencia' in ed:
                item['advertencia'] = ed['advertencia']
            if 'normativa' in ed:
                item['normativa'] = ed['normativa']
            if 'costo' in ed:
                item['costo'] = ed['costo']
            if 'tiempoEstimado' in ed:
                item['tiempoEstimado'] = ed['tiempoEstimado']
            updated_count += 1

    print(f"Enriched {updated_count} AFPA gestiones in initial batch.")

    # Save progress
    with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    enrich_afpa()
