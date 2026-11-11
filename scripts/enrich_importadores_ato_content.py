#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enriquecimiento y Reescritura UX Writing ATO - Rama Comercio Exterior: Importadores (54 gestiones)
Aplica la metodología del Australian Taxation Office (ATO), el Australian Government Style Manual
y las directrices SAT (Reglas 10 y 12):
- Front-loading en títulos (<= 10 palabras con verbos de acción).
- Descripciones concisas en 2 oraciones máximo.
- Requisitos previos interactivos y específicos.
- Pasos ordenados en voz activa con verbos de acción.
- Documentos de soporte requeridos.
- Resultado obtenido claro (qué recibe el usuario).
- Alertas de prevención de errores y tiempos estimados.
"""

import json
from pathlib import Path

# Diccionario maestro de contenido ATO para las 54 gestiones de Importadores
IMPORTADORES_CONTENT = {
    # -------------------------------------------------------------
    # Subrama 1: Registro y Padrón de Importadores (9 gestiones)
    # -------------------------------------------------------------
    "SAT-GES-0344": {
        "gestion": "Inscribirte en el Padrón de Importadores",
        "nombreActual": "Inscribirte en el Padrón de Importadores",
        "descripcion": "Activa tu registro aduanero en el RTU Digital para realizar importaciones comerciales en Guatemala. La gestión se vincula directamente a tu Número de Identificación Tributaria (NIT).",
        "requisitos": [
            "Contar con Número de Identificación Tributaria (NIT) activo y sin omisos en SAT.",
            "Tener usuario y contraseña vigente en Agencia Virtual.",
            "Estar inscrito en el Régimen del Impuesto al Valor Agregado (IVA general o pequeño contribuyente con actividad comercial).",
            "Tener actualizados los datos de tu domicilio fiscal en el RTU Digital."
        ],
        "pasos": [
            "Ingresa a tu Agencia Virtual SAT con tu usuario y clave.",
            "Dirígete al menú Servicios, selecciona RTU y haz clic en Actualización de Datos.",
            "Activa la casilla 'Importador Habitual' y confirma tu actividad económica principal.",
            "Confirma la solicitud y descarga tu constancia de importador activo de forma inmediata."
        ],
        "documentos": [
            "Constancia de RTU Digital actualizada.",
            "Documento Personal de Identificación (DPI) del titular o representante legal."
        ],
        "resultadoObtenido": "Constancia electrónica de inscripción en el Padrón de Importadores y habilitación en el sistema aduanero.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Si tienes omisos o declaraciones pendientes en el IVA o ISR, el sistema no te permitirá activar el padrón hasta que regularices tu situación."
    },
    "SAT-GES-0341": {
        "gestion": "Revisar consideraciones para envíos aéreos",
        "nombreActual": "Revisar consideraciones para envíos aéreos",
        "descripcion": "Guía práctica con las reglas de peso, embalaje y permisos previos para traer paquetes y carga por vía aérea. Evita retrasos en la aduana del Aeropuerto Internacional La Aurora.",
        "requisitos": [
            "Factura comercial o comprobante de compra con descripción detallada y valor de las mercancías.",
            "Guía aérea (Air Waybill - AWB) emitida por la aerolínea o empresa de paquetería.",
            "Identificación oficial (DPI o pasaporte) si importas a título personal."
        ],
        "pasos": [
            "Revisa si tus productos requieren permisos no arancelarios (salud, agricultura o ambiente) antes de despachar en origen.",
            "Solicita a tu proveedor que adjunte la factura con precios reales y desglose de flete y seguro.",
            "Rastrea la llegada de la carga con el número de guía aérea.",
            "Presenta la documentación en la aduana aérea para el cálculo de aranceles y levante."
        ],
        "documentos": [
            "Guía aérea internacional (AWB).",
            "Factura comercial original."
        ],
        "resultadoObtenido": "Guía informativa de despacho aéreo y requisitos de entrada de carga.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Mercancías como cosméticos, medicamentos y alimentos requieren autorización previa del Ministerio de Salud antes de su llegada a Guatemala."
    },
    "SAT-GES-0342": {
        "gestion": "Guía para comprar productos en el extranjero",
        "nombreActual": "Guía para comprar productos en el extranjero",
        "descripcion": "Conoce los impuestos aplicables, límites de exención y requisitos antes de adquirir mercancías por internet o proveedores internacionales. Calcula tus costos totales antes de pagar.",
        "requisitos": [
            "Comprobante de compra o factura electrónica con desglose del valor del producto.",
            "Comprobante del costo de envío internacional (flete) y seguro.",
            "Medio de pago autorizado (tarjeta de crédito, débito o transferencia)."
        ],
        "pasos": [
            "Identifica la clasificación arancelaria de tu producto para conocer el porcentaje de arancel (DAI) y el 12% de IVA.",
            "Verifica que el producto no tenga prohibición de importación ni restricciones zoosanitarias o fitosanitarias.",
            "Contrata una empresa de transporte internacional o courier registrada ante la SAT.",
            "Guarda tus recibos de pago para justificar el valor declarado ante la aduana."
        ],
        "documentos": [
            "Factura comercial o recibo de compra en tienda digital.",
            "Comprobante de transacción bancaria."
        ],
        "resultadoObtenido": "Orientación técnica para compras seguras y cálculo preventivo de tributos.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Compras superiores a $1,000 USD requieren la contratación obligatoria de un agente aduanero para elaborar la declaración oficial (DUCA)."
    },
    "SAT-GES-0343": {
        "gestion": "Pasos previos para importar por vía aérea",
        "nombreActual": "Pasos previos para importar por vía aérea",
        "descripcion": "Instrucciones paso a paso para preparar la documentación de importación antes de que la carga arribe a aduana aérea. Acelera el proceso de selectivo y levante.",
        "requisitos": [
            "Estar inscrito y activo en el Padrón de Importadores de la SAT.",
            "Tener contratado a un agente aduanero o empresa de entrega rápida autorizada.",
            "Contar con las licencias o permisos ministeriales si aplica a tu tipo de producto."
        ],
        "pasos": [
            "Verifica con tu agente aduanero la correcta clasificación en el Sistema Arancelario Centroamericano (SAC).",
            "Transmite los documentos digitalizados a través del sistema de Aduana sin Papeles.",
            "Prepara la Declaración Única Centroamericana (DUCA) antes del arribo del vuelo.",
            "Efectúa el pago anticipado de aranceles en el sistema bancario para agilizar el levante."
        ],
        "documentos": [
            "Guía aérea de carga (AWB).",
            "Factura comercial traducida si viene en idioma distinto al español.",
            "Lista de empaque (Packing List)."
        ],
        "resultadoObtenido": "Lista de chequeo operativa validada para despacho aéreo inmediato.",
        "tiempoEstimado": "1 a 2 horas previas al arribo",
        "costo": "Gratuito",
        "advertencia": "No contar con permisos no arancelarios al momento del arribo provoca la retención de la carga en almacén fiscal con costos diarios de almacenaje."
    },
    "SAT-GES-0347": {
        "gestion": "Consultar buenas prácticas de importación aduanera",
        "nombreActual": "Consultar buenas prácticas de importación aduanera",
        "descripcion": "Estándares y recomendaciones de Modernización Integral Aduanera para agilizar el paso por aduanas y reducir revisiones intrusivas. Optimiza tu cadena logística.",
        "requisitos": [
            "Ser operador de comercio exterior, importador o despachante registrado.",
            "Acceso a internet para descargar manuales y estándares operativos."
        ],
        "pasos": [
            "Descarga la guía oficial de buenas prácticas aduaneras desde el portal.",
            "Implementa el etiquetado normado y embalaje seguro en tus envíos.",
            "Verifica la consistencia entre factura comercial, lista de empaque y declaración aduanera.",
            "Monitorea tus tiempos promedio de despacho en el sistema de semáforo aduanero."
        ],
        "documentos": [
            "Manual de buenas prácticas aduaneras en formato PDF."
        ],
        "resultadoObtenido": "Guía técnica oficial de estándares operativos para importadores.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Mantener una alta exactitud en tus declaraciones reduce la probabilidad de asignación de canal rojo (revisión física) en el sistema de riesgo."
    },
    "SAT-GES-0348": {
        "gestion": "Conocer el sistema de Modernización Aduanera",
        "nombreActual": "Conocer el sistema de Modernización Aduanera",
        "descripcion": "Información sobre las nuevas tecnologías de rayos X, aduana sin papeles y controles no intrusivos implementados por la SAT en puertos, aeropuertos y fronteras.",
        "requisitos": [
            "Disponibilidad de conexión para consultar infografías y especificaciones técnicas."
        ],
        "pasos": [
            "Ingresa al módulo informativo de Modernización Integral Aduanera.",
            "Revisa las aduanas que operan con sistemas de inspección no intrusiva (Rayos X y escáneres).",
            "Consulta los procedimientos digitales de despacho anticipado.",
            "Aplica los lineamientos para el paso expedito por Puestos de Control Interinstitucional (PCI)."
        ],
        "documentos": [
            "Documento descriptivo de infraestructura aduanera moderna."
        ],
        "resultadoObtenido": "Panorama técnico de operaciones en aduanas automatizadas.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Los contenedores inspeccionados por escáner no requieren apertura física a menos que el analista detecte inconsistencias en la imagen."
    },
    "SAT-GES-0349": {
        "gestion": "Preparar documentos para importación definitiva aérea",
        "nombreActual": "Preparar documentos para importación definitiva aérea",
        "descripcion": "Checklist completo de documentos contractuales, técnicos y arancelarios para el desaduanamiento definitivo de mercancías aéreas en aduana.",
        "requisitos": [
            "Estar inscrito en el Registro Tributario Unificado (RTU) como importador.",
            "Factura comercial que cumpla con los requisitos del Código Aduanero Centroamericano.",
            "Guía aérea máster e hija si aplica consolidación de carga."
        ],
        "pasos": [
            "Digitaliza todos tus documentos de soporte en formato PDF legible.",
            "Entrega los archivos a tu agente aduanero para vincularlos a la DUCA-D.",
            "Revisa que la descripción de las mercancías no utilice términos genéricos como 'repuestos' o 'mercadería'.",
            "Autoriza la transmisión electrónica al sistema de aduanas de la SAT."
        ],
        "documentos": [
            "Factura comercial detallada.",
            "Guía aérea internacional.",
            "Certificado de origen (si aplica preferencia arancelaria de tratado de libre comercio).",
            "Permisos o licencias no arancelarias."
        ],
        "resultadoObtenido": "Expediente digital listo para transmisión en Aduana sin Papeles.",
        "tiempoEstimado": "Previo al arribo de carga",
        "costo": "Gratuito",
        "advertencia": "Las descripciones incompletas o ambiguas generan ajustes de valor inmediatos por parte de los revisores técnicos de la aduana."
    },
    "SAT-GES-0345": {
        "gestion": "Inscribirte al curso para el nuevo importador",
        "nombreActual": "Inscribirte al curso para el nuevo importador",
        "descripcion": "Capacitación virtual interactiva impartida por especialistas de la SAT para personas y emprendedores que desean importar por primera vez. Incluye certificado de participación.",
        "requisitos": [
            "Contar con Número de Identificación Tributaria (NIT) activo.",
            "Correo electrónico personal para recibir acceso al aula virtual del Centro de Capacitación Tributaria y Aduanera (CENSAT).",
            "Dispositivo con conexión a internet y navegador web actualizado."
        ],
        "pasos": [
            "Ingresa al catálogo de cursos del CENSAT en el portal oficial.",
            "Selecciona el curso virtual 'Guía Básica para el Nuevo Importador'.",
            "Llena el formulario de inscripción con tu NIT y correo electrónico.",
            "Accede a los módulos interactivos y completa las evaluaciones para obtener tu constancia."
        ],
        "documentos": [
            "Formulario digital de inscripción al curso."
        ],
        "resultadoObtenido": "Constancia de aprobación del curso virtual del Nuevo Importador.",
        "tiempoEstimado": "Duración: 10 horas autoguiadas",
        "costo": "Gratuito",
        "advertencia": "Los cupos se renuevan mensualmente; verifica el calendario de inscripciones al inicio de cada mes."
    },
    "SAT-GES-0346": {
        "gestion": "Consultar legislación y normas aduaneras",
        "nombreActual": "Consultar legislación y normas aduaneras",
        "descripcion": "Acceso libre al Código Aduanero Uniforme Centroamericano (CAUCA IV), su reglamento (RECAUCA IV), Ley de Aduanas y criterios vinculantes emitidos por la Intendencia de Aduanas.",
        "requisitos": [
            "Acceso a internet para consultar o descargar las leyes en formato PDF."
        ],
        "pasos": [
            "Ingresa al repositorio de normativa aduanera del portal SAT.",
            "Selecciona la categoría legal: Tratados Centroamericanos, Leyes Nacionales o Criterios Institucionales.",
            "Descarga el texto oficial actualizado de la norma que necesitas consultar.",
            "Utiliza el buscador por artículo o palabra clave para localizar temas específicos."
        ],
        "documentos": [
            "Textos normativos oficiales en PDF descargables."
        ],
        "resultadoObtenido": "Textos legales oficiales actualizados y de aplicación directa en aduanas.",
        "tiempoEstimado": "Acceso inmediato",
        "costo": "Gratuito",
        "advertencia": "Asegúrate de consultar las versiones vigentes compiladas para considerar las reformas aprobadas por el Congreso y el Consejo Arancelario."
    },

    # -------------------------------------------------------------
    # Subrama 2: Declaraciones Aduaneras y DUCAs (10 gestiones)
    # -------------------------------------------------------------
    "SAT-GES-0351": {
        "gestion": "Declarar el valor en aduana de mercancías",
        "nombreActual": "Declarar el valor en aduana de mercancías",
        "descripcion": "Procedimiento oficial para justificar el precio realmente pagado o por pagar de las mercancías importadas, de acuerdo con el Acuerdo de Valoración de la OMC.",
        "requisitos": [
            "Factura comercial comercial original emitida por el vendedor internacional.",
            "Comprobantes bancarios de pago al proveedor extranjero (transferencia SWIFT, tarjeta o carta de crédito).",
            "Contrato de compraventa internacional o cotización aceptada si aplica.",
            "Documentos de flete y póliza de seguro de transporte."
        ],
        "pasos": [
            "Completa el formulario de Declaración del Valor en Aduana anexo a la DUCA.",
            "Desglosa el valor en fábrica (FOB), flete internacional y seguro contratado (CIF).",
            "Adjunta los comprobantes de pago bancarios digitalizados.",
            "Firma la declaración bajo fe de juramento mediante firma electrónica autorizada."
        ],
        "documentos": [
            "Formulario de Declaración del Valor en Aduana.",
            "Comprobantes bancarios de pago.",
            "Factura comercial."
        ],
        "resultadoObtenido": "Determinación oficial de la base imponible para el cálculo de tributos de importación.",
        "tiempoEstimado": "Integrado en el proceso de la DUCA",
        "costo": "Gratuito",
        "advertencia": "Subvaluar mercancías o declarar montos inferiores al precio de compra real constituye delito de defraudación aduanera y conlleva multas del 100% al 300% de los impuestos omitidos."
    },
    "SAT-GES-0352": {
        "gestion": "Manual de Aduana sin Papeles y digitalización",
        "nombreActual": "Manual de Aduana sin Papeles y digitalización",
        "descripcion": "Guía técnica para codificar, escanear y subir documentos de soporte a los sistemas informáticos aduaneros. Elimina el uso de expedientes físicos.",
        "requisitos": [
            "Escaner o cámara con capacidad de digitalizar a 200 o 300 DPI en blanco y negro o color.",
            "Software para guardar archivos en formato PDF individual no mayor a 10 MB por archivo."
        ],
        "pasos": [
            "Consulta la tabla oficial de codificación de documentos aduaneros (ej. 001 para factura, 002 para conocimiento de embarque).",
            "Nombra cada archivo PDF según la nomenclatura oficial indicada en el manual.",
            "Sube los documentos a través del aplicativo web de digitalización vinculado a la DUCA.",
            "Verifica que el sistema genere el código de barras o sello digital de recepción."
        ],
        "documentos": [
            "Manual operativo en PDF con especificaciones técnicas de escaneo."
        ],
        "resultadoObtenido": "Guía práctica para evitar el rechazo de documentos en el repositorio digital.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Los documentos borrosos, cortados o con resolución menor a 200 DPI son rechazados automáticamente por el sistema de aduanas."
    },
    "SAT-GES-0353": {
        "gestion": "Información sobre tipos de DUCA y DUA",
        "nombreActual": "Información sobre tipos de DUCA y DUA",
        "descripcion": "Conoce las diferencias entre la Declaración Única Centroamericana (DUCA-F, DUCA-D, DUCA-T) y cuándo corresponde utilizar cada formato según el origen y destino de tus mercancías.",
        "requisitos": [
            "Acceso al portal institucional para consultar el cuadro comparativo."
        ],
        "pasos": [
            "Identifica el origen de tu producto: Centroamérica con libre comercio (DUCA-F) o terceros países fuera de la región (DUCA-D).",
            "Si tus mercancías están en tránsito aduanero terrestre regional, selecciona la DUCA-T.",
            "Revisa los datos específicos que exige cada modalidad de declaración.",
            "Coordina con tu agente aduanero la transmisión del formato correcto."
        ],
        "documentos": [
            "Tabla comparativa de tipos de DUCA en formato PDF."
        ],
        "resultadoObtenido": "Criterio técnico para seleccionar el formato correcto de declaración aduanera.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Transmitir una DUCA-F para productos que no cumplen con las reglas de origen centroamericanas provoca la pérdida de exención arancelaria y sanciones inmediatas."
    },
    "SAT-GES-0354": {
        "gestion": "Transmitir Declaración Única Aduanera (DUA-GT)",
        "nombreActual": "Transmitir Declaración Única Aduanera (DUA-GT)",
        "descripcion": "Transmisión electrónica de la declaración aduanera bajo el régimen general de importación para mercancías fuera del ámbito centroamericano.",
        "requisitos": [
            "Agente aduanero autorizado con fianza y firma electrónica vigente.",
            "Importador activo en el padrón de la SAT.",
            "Documentos de transporte, factura comercial y seguro digitalizados.",
            "Permisos no arancelarios emitidos por ministerios correspondientes."
        ],
        "pasos": [
            "El agente aduanero captura los datos de la mercancía en el sistema informático aduanero.",
            "Vincula los documentos de soporte digitalizados con sus códigos correspondientes.",
            "Genera el cálculo automático de DAI (Derechos Arancelarios a la Importación) e IVA.",
            "Transmite la declaración y obtiene el número oficial de póliza para efectuar el pago bancario."
        ],
        "documentos": [
            "Factura comercial.",
            "Conocimiento de embarque (B/L, Guía Aérea o Carta de Porte).",
            "Póliza de seguro.",
            "Certificados sanitarios o fitosanitarios si aplica."
        ],
        "resultadoObtenido": "Declaración oficial transmitida y boleta de pago de tributos generada.",
        "tiempoEstimado": "1 a 3 horas hábiles",
        "costo": "Gratuito en SAT (los honorarios del agente aduanero son privados)",
        "advertencia": "Una vez transmitida la declaración, cualquier cambio en datos de valor o clasificación requiere una rectificación formal sujeta a autorización aduanera."
    },
    "SAT-GES-0355": {
        "gestion": "Transmitir DUCA-D para importación definitiva",
        "nombreActual": "Transmitir DUCA-D para importación definitiva",
        "descripcion": "Gestión electrónica para declarar la importación definitiva de mercancías provenientes de países fuera de Centroamérica, utilizando el formato regional unificado.",
        "requisitos": [
            "Importador con NIT activo en el Padrón de Importadores.",
            "Intervención de un agente aduanero debidamente autorizado.",
            "Documentos de soporte cargados en el repositorio de Aduana sin Papeles."
        ],
        "pasos": [
            "Tu agente aduanero ingresa al sistema informático aduanero y selecciona la opción DUCA-D.",
            "Ingresa el país de origen, proveedor, partida arancelaria y valor CIF de las mercancías.",
            "Asocia los números de documentos de soporte digitalizados previamente.",
            "Valida la declaración, realiza la transmisión y genera la orden de pago para el banco."
        ],
        "documentos": [
            "Factura comercial con valor FOB.",
            "Documento de transporte internacional.",
            "Póliza de seguro internacional.",
            "Certificado de origen (si aplica beneficio arancelario)."
        ],
        "resultadoObtenido": "DUCA-D oficial registrada en el sistema aduanero centroamericano lista para pago.",
        "tiempoEstimado": "Inmediato tras transmisión",
        "costo": "Gratuito en SAT",
        "advertencia": "Asegúrate de contar con fondos en tu cuenta bancaria para pagar los impuestos el mismo día de la transmisión y evitar recargos por intereses moratorios."
    },
    "SAT-GES-0356": {
        "gestion": "Consultar información sobre pólizas de importación",
        "nombreActual": "Consultar información sobre pólizas de importación",
        "descripcion": "Guía para interpretar los datos, códigos de liquidación y casillas de una póliza o declaración aduanera de importación registrada ante la SAT.",
        "requisitos": [
            "Acceso al portal institucional de la SAT."
        ],
        "pasos": [
            "Ingresa a la sección de orientación aduanera del portal.",
            "Descarga la guía de lectura de casillas de la póliza de importación.",
            "Verifica cómo se calculan los Derechos Arancelarios (DAI), el IVA y otros tributos aplicables.",
            "Aprende a ubicar el número de declaración y la fecha de liquidación para consultas oficiales."
        ],
        "documentos": [
            "Instructivo de casillas de la póliza aduanera."
        ],
        "resultadoObtenido": "Conocimiento operativo para auditar tus liquidaciones de importación.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Conserva las copias de tus pólizas y documentos de soporte durante un mínimo de 4 años, ya que la SAT puede auditarlas en revisiones posteriores al despacho."
    },
    "SAT-GES-0357": {
        "gestion": "Presentar declaración de importación con fianza",
        "nombreActual": "Presentar declaración de importación con fianza",
        "descripcion": "Solicitud para autorizar el levante temporal o provisional de mercancías mediante la constitución de una garantía o fianza aduanera mientras se resuelven discrepancias arancelarias.",
        "requisitos": [
            "Póliza de fianza o seguro de caución emitida por una aseguradora autorizada en Guatemala.",
            "DUCA-D o póliza de importación con solicitud expresa de despacho garantizado.",
            "Resolución previa de la Intendencia de Aduanas que autorice el uso de fianza."
        ],
        "pasos": [
            "Presenta la póliza de fianza original en la aduana de despacho o unidad de garantías.",
            "El funcionario aduanero verifica la vigencia, beneficiario a favor de la SAT y monto afianzado.",
            "El sistema registra la garantía y autoriza la continuación del despacho aduanero.",
            "Procede con el levante de las mercancías bajo custodia garantizada."
        ],
        "documentos": [
            "Póliza original de fianza o seguro de caución.",
            "Copia de la declaración aduanera (DUCA).",
            "DPI del representante legal del importador."
        ],
        "resultadoObtenido": "Levante garantizado de las mercancías sin paralizar tu operación comercial.",
        "tiempoEstimado": "24 a 48 horas hábiles",
        "costo": "Gratuito en SAT (el costo de la prima lo fija la aseguradora)",
        "advertencia": "La fianza debe cubrir el 100% de los posibles tributos omitidos más los intereses proyectados por el plazo de la controversia."
    },
    "SAT-GES-0358": {
        "gestion": "Consultar pago de DUCA-F en país de destino",
        "nombreActual": "Consultar pago de DUCA-F en país de destino",
        "descripcion": "Servicio de consulta en línea para verificar si los impuestos de una Declaración Única Centroamericana (DUCA-F) ya fueron cancelados en el país centroamericano receptor.",
        "requisitos": [
            "Número de identificación de la DUCA-F a consultar.",
            "Conexión a internet."
        ],
        "pasos": [
            "Ingresa a la herramienta de consultas públicas aduaneras en el portal SAT.",
            "Selecciona el buscador de DUCA-F regional.",
            "Escribe el número de la declaración y el país de destino (El Salvador, Honduras, Nicaragua, Costa Rica o Panamá).",
            "Haz clic en Consultar y visualiza el estado del pago en tiempo real."
        ],
        "documentos": [
            "Número de DUCA-F emitida."
        ],
        "resultadoObtenido": "Constancia digital del estado del pago de aranceles en el país de destino.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Si el pago no aparece reflejado tras 24 horas de efectuado en el banco del país vecino, comunícate con el soporte del nodo aduanero regional de la SIECA."
    },
    "SAT-GES-0359": {
        "gestion": "Verificar declaraciones DUCA-F y FAUCA",
        "nombreActual": "Verificar declaraciones DUCA-F y FAUCA",
        "descripcion": "Herramienta pública para validar la autenticidad, exportador, importador y mercancías amparadas en una declaración regional centroamericana.",
        "requisitos": [
            "Número de declaración DUCA-F o código FAUCA histórico.",
            "Código de seguridad o captcha del verificador."
        ],
        "pasos": [
            "Accede al verificador público de declaraciones centroamericanas de la SAT.",
            "Ingresa el código numérico de la DUCA-F o FAUCA.",
            "Verifica en pantalla que los datos de las mercancías coincidan exactamente con tu factura física.",
            "Descarga el reporte de verificación para tus archivos contables."
        ],
        "documentos": [
            "Número de declaración aduanera regional."
        ],
        "resultadoObtenido": "Certificación en pantalla de la validez y vigencia de la declaración regional.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Verificar la DUCA-F antes de recibir la mercancía en bodega protege a tu empresa contra falsificaciones de documentos aduaneros."
    },
    "SAT-GES-0350": {
        "gestion": "Capacitación sobre Factura y DUCA (FYDUCA)",
        "nombreActual": "Capacitación sobre Factura y DUCA (FYDUCA)",
        "descripcion": "Curso virtual para aprender a emitir la Factura y Declaración Única Centroamericana (FYDUCA) dentro del proceso de integración profunda entre Guatemala, Honduras y El Salvador.",
        "requisitos": [
            "Usuario activo en el portal CENSAT o registro con NIT en Agencia Virtual.",
            "Computadora o teléfono con acceso a internet."
        ],
        "pasos": [
            "Accede al aula virtual de la SAT (CENSAT).",
            "Selecciona el curso interactivo 'Régimen de FYDUCA y Unión Aduanera'.",
            "Revisa los videos explicativos sobre libre circulación de mercancías comunitarias.",
            "Realiza la prueba final y descarga tu diploma digital de aprobación."
        ],
        "documentos": [
            "Formulario digital de inscripción al curso en línea."
        ],
        "resultadoObtenido": "Diploma digital de capacitación en operaciones de FYDUCA y Unión Aduanera.",
        "tiempoEstimado": "8 horas autoguiadas",
        "costo": "Gratuito",
        "advertencia": "La FYDUCA sustituye a la factura y a la declaración aduanera únicamente para mercancías con libre circulación entre Guatemala, Honduras y El Salvador."
    },

    # -------------------------------------------------------------
    # Subrama 3: Despacho Aduanero, Levante y Selectivo (16 gestiones)
    # -------------------------------------------------------------
    "SAT-GES-0360": {
        "gestion": "Despachar documentos de envíos parciales",
        "nombreActual": "Despachar documentos de envíos parciales",
        "descripcion": "Procedimiento para entregar y autorizar el despacho de mercancías que ingresan fraccionadas en distintos momentos bajo un mismo contrato o factura.",
        "requisitos": [
            "Declaración aduanera original amparada por el envío global.",
            "Factura comercial con desglose de la entrega parcial que arriba a la aduana.",
            "Documento de transporte de la fracción que se despacha."
        ],
        "pasos": [
            "Tu agente aduanero presenta la declaración de entrega parcial vinculada al embarque máster.",
            "El funcionario aduanero verifica los saldos de mercancía pendientes de ingreso.",
            "Se calcula la liquidación proporcional de tributos para la fracción presente.",
            "Se autoriza el levante de las mercancías recibidas mientras el resto queda en espera."
        ],
        "documentos": [
            "Factura comercial de la fracción.",
            "Conocimiento de embarque parcial.",
            "Control de saldos del embarque matriz."
        ],
        "resultadoObtenido": "Autorización de levante para la entrega fraccionada sin esperar el embarque completo.",
        "tiempoEstimado": "24 horas hábiles",
        "costo": "Gratuito en SAT",
        "advertencia": "El importador debe completar el desaduanamiento de todas las fracciones dentro del plazo legal fijado en el reglamento aduanero."
    },
    "SAT-GES-0361": {
        "gestion": "Presentar declaración para análisis de riesgo",
        "nombreActual": "Presentar declaración para análisis de riesgo",
        "descripcion": "Envío de la declaración aduanera al motor de análisis de riesgo de la SAT para la asignación automática del canal de selectivo (verde, amarillo o rojo).",
        "requisitos": [
            "DUCA debidamente transmitida y validada en el sistema.",
            "Pago de tributos aduaneros completado y confirmado por el banco.",
            "Documentos de soporte cargados en el repositorio digital."
        ],
        "pasos": [
            "Una vez confirmado el pago bancario, el agente aduanero solicita la activación del selectivo.",
            "El motor de riesgo evalúa el historial del importador, tipo de mercancía, país de origen y valor.",
            "El sistema emite el resultado inmediato del semáforo aduanero.",
            "Si resulta verde, la carga tiene levante inmediato; si es rojo o amarillo, se procede a revisión documental o física."
        ],
        "documentos": [
            "Boleta de pago de tributos bancarios.",
            "Declaración aduanera con código de barras."
        ],
        "resultadoObtenido": "Resultado oficial del canal de selectivo y pase de salida para levante si es verde.",
        "tiempoEstimado": "Inmediato (automático)",
        "costo": "Gratuito",
        "advertencia": "Manipular bultos o romper precintos aduaneros antes de que el sistema asigne el canal selectivo constituye infracción grave sancionada con cierre de padrón."
    },
    "SAT-GES-0362": {
        "gestion": "Solicitar distintivos de control de productos importados",
        "nombreActual": "Solicitar distintivos de control de productos importados",
        "descripcion": "Petición de timbres, sellos y distintivos fiscales oficiales para licores, bebidas alcohólicas y tabacos importados previo a su distribución en el mercado nacional.",
        "requisitos": [
            "Estar inscrito en el RTU como importador y distribuidor de productos gravados con impuestos específicos.",
            "Declaración aduanera de importación cancelada.",
            "Boleta de pago del costo de fabricación de distintivos (SAT-8011)."
        ],
        "pasos": [
            "Ingresa a tu Agencia Virtual y solicita la cantidad de distintivos fiscales según el lote importado.",
            "Genera y paga el formulario SAT-8011 por el valor de los distintivos en tu banca en línea.",
            "Agenda tu cita para el retiro de los distintivos en la sede central de la SAT.",
            "Presenta la documentación de importación para recibir los sellos de seguridad numerados."
        ],
        "documentos": [
            "Copia de la DUCA pagada.",
            "Comprobante de pago bancario de distintivos.",
            "DPI del representante o autorizado para recoger distintivos."
        ],
        "resultadoObtenido": "Entrega de timbres y distintivos fiscales de control para adherir a los productos.",
        "tiempoEstimado": "3 a 5 días hábiles",
        "costo": "Costo de fabricación del distintivo fijado por acuerdo de Directorio",
        "advertencia": "Comercializar bebidas alcohólicas o tabaco importado sin los distintivos fiscales adheridos es causal de incautación inmediata por contrabando."
    },
    "SAT-GES-0363": {
        "gestion": "Requisitos para distintivos de control de productos",
        "nombreActual": "Requisitos para distintivos de control de productos",
        "descripcion": "Consulta la documentación legal, técnica y tarifas vigentes para la entrega de distintivos y timbres fiscales de control aduanero.",
        "requisitos": [
            "Conexión a internet para consultar la guía oficial de requisitos."
        ],
        "pasos": [
            "Descarga la ficha oficial de requisitos para distintivos de control.",
            "Verifica las tarifas unitarias vigentes por tipo de producto (licores, cervezas o cigarrillos).",
            "Prepara la carta de designación de la persona autorizada para retirar los paquetes de distintivos.",
            "Inicia tu solicitud formal en la plataforma de servicios en línea."
        ],
        "documentos": [
            "Ficha de requisitos en formato PDF."
        ],
        "resultadoObtenido": "Conocimiento previo de la documentación para evitar rechazos en ventanilla.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Los distintivos fiscales son de uso intransferible y deben registrarse con estricto control de numeración en tus libros contables."
    },
    "SAT-GES-0364": {
        "gestion": "Implementar declaración anticipada de importación",
        "nombreActual": "Implementar declaración anticipada de importación",
        "descripcion": "Procedimiento para transmitir y pagar la declaración aduanera antes de que el transporte llegue a la frontera, reduciendo el paso fronterizo a minutos.",
        "requisitos": [
            "Importador y transportista habilitados en el sistema aduanero.",
            "Factura comercial y documentos de transporte completos antes de la salida de origen.",
            "Tráfico de mercancías por aduanas terrestres integradas (ej. Tecún Umán, Pedro de Alvarado)."
        ],
        "pasos": [
            "Tu agente aduanero transmite la DUCA anticipada cuando el camión sale de la fábrica o bodega de origen.",
            "Realiza el pago de tributos en línea antes de que la unidad arribe a la aduana guatemalteca.",
            "Al llegar a la frontera, el transportista pasa por el lector de código de barras sin bajarse del vehículo.",
            "El sistema activa el selectivo en pantalla y, si es verde, el camión continúa su ruta de inmediato."
        ],
        "documentos": [
            "DUCA anticipada transmitida.",
            "Carta de porte internacional.",
            "Factura comercial definitiva."
        ],
        "resultadoObtenido": "Paso fronterizo inmediato en menos de 15 minutos en carriles ágiles.",
        "tiempoEstimado": "Cruce fronterizo: 15 minutos",
        "costo": "Gratuito en SAT",
        "advertencia": "La declaración anticipada es obligatoria para el paso de mercancías en aduanas terrestres priorizadas bajo acuerdos de facilitación."
    },
    "SAT-GES-0365": {
        "gestion": "Preguntas frecuentes sobre declaración anticipada",
        "nombreActual": "Preguntas frecuentes sobre declaración anticipada",
        "descripcion": "Respuestas a dudas operativas sobre rectificaciones, rechazos en garita, pagos bancarios y asignación de carriles en aduanas terrestres.",
        "requisitos": [
            "Acceso libre al portal web oficial de la SAT."
        ],
        "pasos": [
            "Ingresa a la sección de preguntas frecuentes de despacho aduanero.",
            "Revisa las respuestas oficiales sobre contingencias informáticas y cortes de energía en frontera.",
            "Consulta cómo solicitar asistencia técnica del personal aduanero en aduanas integradas.",
            "Descarga el manual de contingencias para transportistas."
        ],
        "documentos": [
            "Guía de preguntas frecuentes en PDF."
        ],
        "resultadoObtenido": "Resolución rápida de dudas sobre incidencias en fronteras terrestres.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Si el sistema entra en contingencia técnica, la aduana activa el sello físico provisional para evitar que las unidades de carga queden varadas."
    },
    "SAT-GES-0372": {
        "gestion": "Formatos y guías para gestiones aduaneras",
        "nombreActual": "Formatos y guías para gestiones aduaneras",
        "descripcion": "Descarga de formularios oficiales, modelos de cartas de responsabilidad, formatos de fianza y guías de tramitación autorizados por la Intendencia de Aduanas.",
        "requisitos": [
            "Lector de archivos PDF y procesador de textos para llenar los formularios."
        ],
        "pasos": [
            "Navega por el catálogo de formularios aduaneros clasificados por tipo de gestión.",
            "Selecciona el formato correspondiente a tu gestión (ej. devolución, fianza, solicitud de rectificación).",
            "Completa los campos editables sin tachones ni alteraciones.",
            "Firma el documento y preséntalo digitalmente o en ventanilla aduanera según corresponda."
        ],
        "documentos": [
            "Formularios editables en PDF y Word descargables."
        ],
        "resultadoObtenido": "Plantillas oficiales vigentes para gestiones aduaneras ante la SAT.",
        "tiempoEstimado": "Descarga inmediata",
        "costo": "Gratuito",
        "advertencia": "No utilices formatos descargados de sitios web externos o no oficiales, ya que pueden contener cláusulas desactualizadas que invaliden tu solicitud."
    },
    "SAT-GES-0373": {
        "gestion": "Ubicación de Puestos de Control Interinstitucional",
        "nombreActual": "Ubicación de Puestos de Control Interinstitucional",
        "descripcion": "Directorio geográfico, facultades legales y protocolos de revisión de los Puestos de Control Interinstitucional (PCI) distribuidos en las principales rutas del país.",
        "requisitos": [
            "Acceso al mapa interactivo de infraestructura aduanera en el portal."
        ],
        "pasos": [
            "Consulta el mapa interactivo de puestos de control en carretera.",
            "Identifica los puntos de inspección interinstitucional (SAT, PNC, Ministerio de Salud y Ejército).",
            "Verifica que el transportista lleve consigo la declaración aduanera y documentos de flete impresos o digitales.",
            "Facilita la lectura del código QR o escaneo en el puesto de control para continuar la marcha."
        ],
        "documentos": [
            "Mapa y directorio de Puestos de Control Interinstitucional."
        ],
        "resultadoObtenido": "Información sobre ubicación de retenes legales y tiempos de control.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Todo transporte de carga debe portar la DUCA con levante autorizado; circular sin documentos aduaneros en ruta fiscal amerita el decomiso inmediato del cargamento."
    },
    "SAT-GES-0374": {
        "gestion": "Estudio de tiempos de despacho aduanero",
        "nombreActual": "Estudio de tiempos de despacho aduanero",
        "descripcion": "Publicación periódica de mediciones estadísticas internacionales sobre el tiempo promedio que tarda una mercancía desde su llegada a puerto hasta su salida.",
        "requisitos": [
            "Acceso al portal de transparencia y facilitación del comercio de la SAT."
        ],
        "pasos": [
            "Ingresa al módulo de Estudios de Tiempos de Despacho (TRS por sus siglas en inglés).",
            "Descarga el último informe técnico elaborado bajo la metodología de la Organización Mundial de Aduanas (OMA).",
            "Compara los tiempos promedio de liberación en aduanas marítimas, aéreas y terrestres.",
            "Utiliza las estadísticas para optimizar los contratos de logística y almacenamiento con tus proveedores."
        ],
        "documentos": [
            "Informes anuales de Tiempos de Despacho en formato PDF."
        ],
        "resultadoObtenido": "Datos estadísticos oficiales para la planificación logística y reducción de costos.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "El tiempo de despacho atribuible a la SAT promedia menos de 4 horas en canal verde; los mayores retrasos se originan en almacenaje y demoras de navieras."
    },
    "SAT-GES-0375": {
        "gestion": "Normas operativas de la Unión Aduanera",
        "nombreActual": "Normas operativas de la Unión Aduanera",
        "descripcion": "Compendio de resoluciones de la instancia ministerial y reglamentos técnicos que rigen la libre circulación de bienes entre Guatemala y los países de la unión.",
        "requisitos": [
            "Acceso al módulo de integración económica regional del portal."
        ],
        "pasos": [
            "Consulta los acuerdos binacionales y trinacionales vigentes.",
            "Revisa la lista de mercancías exceptuadas de la libre circulación (café, azúcar, derivados de petróleo).",
            "Verifica el procedimiento de pago del impuesto local en destino mediante la FYDUCA.",
            "Aplica los lineamientos en tus contratos de distribución regional."
        ],
        "documentos": [
            "Compendio normativo de la Unión Aduanera Centroamericana."
        ],
        "resultadoObtenido": "Marco regulatorio completo para operaciones comerciales comunitarias.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Las mercancías no originarias de los países miembros deben pagar aranceles externos comunes antes de acogerse a la libre circulación comunitaria."
    },
    "SAT-GES-0366": {
        "gestion": "Consultar historial del selectivo en aduanas",
        "nombreActual": "Consultar historial del selectivo en aduanas",
        "descripcion": "Servicio para importadores registrados que permite auditar el porcentaje de canales verdes, amarillos y rojos asignados a sus operaciones en los últimos 12 meses.",
        "requisitos": [
            "Usuario activo en Agencia Virtual SAT.",
            "Estar registrado como importador en el sistema aduanero."
        ],
        "pasos": [
            "Ingresa a tu Agencia Virtual con tus credenciales de acceso.",
            "Dirígete a la sección de Consultas Aduaneras y selecciona 'Historial de Selectivo'.",
            "Selecciona el rango de fechas que deseas evaluar.",
            "Genera el reporte gráfico con el desglose de canales asignados y motivos de inspección."
        ],
        "documentos": [
            "Reporte descargable en PDF y Excel con el historial de selectivo."
        ],
        "resultadoObtenido": "Métricas de cumplimiento aduanero para mejorar el perfil de riesgo de tu empresa.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Un aumento constante en asignaciones de canal rojo indica discrepancias reiteradas en tus declaraciones o alertas emitidas por sistemas internacionales."
    },
    "SAT-GES-0367": {
        "gestion": "Consultar manifiestos de la Unión Aduanera",
        "nombreActual": "Consultar manifiestos de la Unión Aduanera",
        "descripcion": "Buscador en línea para consultar el estado, bultos y transportista registrado en los manifiestos de carga terrestres de la integración profunda.",
        "requisitos": [
            "Número de manifiesto aduanero o número de placa del vehículo de transporte.",
            "Conexión a internet."
        ],
        "pasos": [
            "Ingresa a la herramienta de consulta de manifiestos aduaneros.",
            "Escribe el número de manifiesto o placa del cabezal.",
            "Verifica en pantalla la aduana de ingreso, fecha de arribo y estado del tránsito.",
            "Imprime el comprobante para coordinar la recepción en tu centro de distribución."
        ],
        "documentos": [
            "Número de manifiesto o placa de transporte."
        ],
        "resultadoObtenido": "Información confirmada sobre el ingreso y tránsito de la unidad de carga.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "El transportista tiene un plazo máximo en horas para cubrir la ruta entre aduanas; superarlo activa una alerta de seguridad por posible desvío de carga."
    },
    "SAT-GES-0368": {
        "gestion": "Consultar mercancías retenidas y liberadas",
        "nombreActual": "Consultar mercancías retenidas y liberadas",
        "descripcion": "Buscador público para verificar si un cargamento se encuentra en retención preventiva por falta de permisos o si ya cuenta con orden de liberación aduanera.",
        "requisitos": [
            "Número de expediente aduanero, número de contenedor o guía de transporte."
        ],
        "pasos": [
            "Ingresa al buscador de estatus de mercancías de la SAT.",
            "Introduce el número de contenedor o guía aérea.",
            "Consulta el motivo exacto de la retención (permiso ministerial pendiente, ajuste de valor o análisis químico).",
            "Revisa las instrucciones de la aduana para subsanar el expediente y obtener el levante."
        ],
        "documentos": [
            "Número de contenedor, guía de embarque o expediente."
        ],
        "resultadoObtenido": "Estado en tiempo real de tu carga con instrucciones para su liberación.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Las mercancías retenidas generan costos diarios de almacenaje en el depósito aduanero; subsana los requisitos con prontitud para evitar cargos excesivos."
    },
    "SAT-GES-0369": {
        "gestion": "Consultar estado de la declaración aduanera",
        "nombreActual": "Consultar estado de la declaración aduanera",
        "descripcion": "Verificador en tiempo real del estado de procesamiento de cualquier DUCA transmitida ante la SAT (registrada, pagada, en selectivo o con levante).",
        "requisitos": [
            "Número de DUCA o póliza de importación.",
            "Aduana de despacho."
        ],
        "pasos": [
            "Accede al verificador público de declaraciones aduaneras.",
            "Ingresa el código alfanumérico de tu declaración.",
            "Haz clic en Consultar y verifica el semáforo y la fase operativa actual.",
            "Descarga el comprobante con sello electrónico de confirmación."
        ],
        "documentos": [
            "Número oficial de la DUCA."
        ],
        "resultadoObtenido": "Constancia digital oficial del estado del proceso de despacho.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "El transportista solo puede retirar la carga del recinto fiscal cuando el estado de la declaración figure expresamente como 'LEVANTE AUTORIZADO'."
    },
    "SAT-GES-0370": {
        "gestion": "Monitorear semáforo de selectivo aduanero",
        "nombreActual": "Monitorear semáforo de selectivo aduanero",
        "descripcion": "Pantalla de seguimiento en tiempo real para transportistas y despachantes en recintos fiscales que notifica la asignación de canal de inspección.",
        "requisitos": [
            "Número de placa del vehículo o número de orden de pago aduanera."
        ],
        "pasos": [
            "Ingresa al monitor de selectivo aduanero en tiempo real.",
            "Filtra por aduana de operación (Santo Tomás, Puerto Quetzal, Express Aéreo, etc.).",
            "Ubica tu unidad de transporte para conocer el canal asignado.",
            "Si es verde, acude directamente a la garita de salida; si es rojo, dirígete al andén de aforo físico."
        ],
        "documentos": [
            "Número de placa o código de barra de la DUCA."
        ],
        "resultadoObtenido": "Notificación inmediata del canal para dirigir la unidad de carga al andén correspondiente.",
        "tiempoEstimado": "Actualización en tiempo real",
        "costo": "Gratuito",
        "advertencia": "Ignorar la instrucción de canal rojo y no presentarse al andén de aforo se tipifica como intento de evasión de control aduanero."
    },
    "SAT-GES-0371": {
        "gestion": "Consultar expedientes de Gestión Aduanera",
        "nombreActual": "Consultar expedientes de Gestión Aduanera",
        "descripcion": "Seguimiento en línea al avance de solicitudes administrativas, clasificación arancelaria y peticiones especiales radicadas ante el Departamento de Gestión Aduanera.",
        "requisitos": [
            "Número correlativo de expediente asignado en ventanilla de recepción."
        ],
        "pasos": [
            "Ingresa a la consulta de expedientes administrativos aduaneros.",
            "Escribe el número de expediente y año de ingreso.",
            "Consulta la unidad técnica en la que se encuentra tu solicitud y el nombre del analista asignado.",
            "Revisa si existen notificaciones electrónicas o solicitudes de ampliación de información."
        ],
        "documentos": [
            "Número de expediente de gestión aduanera."
        ],
        "resultadoObtenido": "Hoja de ruta y estado procesal de tu solicitud administrativa aduanera.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Si la SAT emite una providencia de requerimiento de documentos, tienes un plazo de 10 días hábiles para responder antes de que se declare el abandono del expediente."
    },

    # -------------------------------------------------------------
    # Subrama 4: Importación y Nacionalización de Vehículos (10 gestiones)
    # -------------------------------------------------------------
    "SAT-GES-0385": {
        "gestion": "Inscribir vehículos nuevos para importadores",
        "nombreActual": "Inscribir vehículos nuevos para importadores",
        "descripcion": "Procedimiento digital para importadores y distribuidores registrados que nacionalizan e inscriben lotes de vehículos automotores nuevos de fábrica.",
        "requisitos": [
            "Estar registrado como importador habitual de vehículos en el RTU.",
            "DUCA de importación definitiva debidamente pagada.",
            "Certificado de origen y factura comercial emitida por el fabricante automotriz.",
            "Reporte digital de números de chasis (VIN) y motor en formato requerido por SAT."
        ],
        "pasos": [
            "Tu agente aduanero transmite la DUCA de importación con el listado detallado de números de chasis (VIN).",
            "Paga los impuestos correspondientes: IPRIMA (Impuesto a la Primera Matrícula) e IVA.",
            "Ingresa al módulo del Registro Fiscal de Vehículos para generar las tarjetas de circulación y placas en lote.",
            "Descarga los distintivos electrónicos para entregar los vehículos listos a los compradores."
        ],
        "documentos": [
            "Factura original del fabricante.",
            "Conocimiento de embarque (B/L).",
            "Certificado de homologación y emisiones.",
            "DUCA cancelada."
        ],
        "resultadoObtenido": "Inscripción en el Registro Fiscal de Vehículos, asignación de placas y emisión de tarjeta de circulación.",
        "tiempoEstimado": "48 a 72 horas hábiles",
        "costo": "Pago de IPRIMA (según cilindraje) + 12% IVA + Q120 placa metálica",
        "advertencia": "Verifica minuciosamente que los 17 dígitos del número de chasis (VIN) coincidan exactamente con la placa metálica grabada en el vehículo para evitar bloqueos registrales."
    },
    "SAT-GES-0380": {
        "gestion": "Solicitar permiso temporal de vehículo turístico",
        "nombreActual": "Solicitar permiso temporal de vehículo turístico",
        "descripcion": "Permiso aduanero temporal para turistas y extranjeros que ingresan a Guatemala conduciendo su propio vehículo con placas extranjeras. Válido por hasta 90 días.",
        "requisitos": [
            "Pasaporte vigente con sello migratorio de ingreso a Guatemala.",
            "Título de propiedad o tarjeta de circulación original del país de origen a nombre del conductor.",
            "Licencia de conducir vigente del país de procedencia.",
            "Si el vehículo no está a tu nombre, autorización notariada con apostilla del propietario legal."
        ],
        "pasos": [
            "Al llegar a la aduana fronteriza terrestre, presenta tu pasaporte y documentos del vehículo en la ventanilla SAT.",
            "El funcionario realiza la inspección física de los números de motor y chasis.",
            "El sistema emite el permiso digital de internación temporal por el mismo plazo otorgado por Migración.",
            "Recibe tu comprobante oficial y adhiere el distintivo de control en el parabrisas."
        ],
        "documentos": [
            "Título de propiedad o registro vehicular original.",
            "Pasaporte con visa o sello de turista.",
            "Licencia de conducir vigente."
        ],
        "resultadoObtenido": "Permiso oficial de internación temporal para circular legalmente en Guatemala.",
        "tiempoEstimado": "30 a 45 minutos en frontera",
        "costo": "Gratuito",
        "advertencia": "El vehículo no puede venderse, alquilarse ni ser conducido por personas residentes en Guatemala; debe salir del país antes del vencimiento del permiso."
    },
    "SAT-GES-0381": {
        "gestion": "Documentos para ingresar vehículos por aduana",
        "nombreActual": "Documentos para ingresar vehículos por aduana",
        "descripcion": "Guía completa de títulos de propiedad, facturas y comprobantes requeridos para desaduanar vehículos terrestres procedentes de Estados Unidos u otros países.",
        "requisitos": [
            "Acceso libre al portal institucional para consultar la guía."
        ],
        "pasos": [
            "Revisa la lista de títulos de propiedad válidos en EE. UU. (Certificate of Title, Salvage Certificate).",
            "Verifica que el título no tenga la condición de 'Junk', 'Parts Only' o 'Destruction', los cuales tienen prohibición expresa de ingreso por ley.",
            "Prepara la factura comercial o contrato de compraventa notariado.",
            "Entrega los documentos a tu tramitador o agente aduanero para la liquidación arancelaria."
        ],
        "documentos": [
            "Guía de títulos permitidos y prohibidos en formato PDF."
        ],
        "resultadoObtenido": "Conocimiento exacto de documentos válidos para evitar el rechazo y reembarque del vehículo.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Los vehículos declarados con pérdida total irreparable ('Junk' o 'Scrap') tienen prohibido su ingreso a Guatemala según el Decreto 10-2012; serán confiscados si intentas ingresarlos."
    },
    "SAT-GES-0382": {
        "gestion": "Requisitos para gestiones en aduana de vehículos",
        "nombreActual": "Requisitos para gestiones en aduana de vehículos",
        "descripcion": "Orientación sobre los requisitos y procedimientos en las aduanas especializadas de vehículos (Aduana Central, Puerto Barrios, Puerto Quetzal).",
        "requisitos": [
            "Acceso libre al portal de la SAT."
        ],
        "pasos": [
            "Identifica la aduana por donde arribará tu vehículo automotor.",
            "Descarga el formulario de solicitud de aforo e inspección vehicular.",
            "Programa tu cita o coordina con tu agente aduanero la presentación física de la unidad.",
            "Revisa los horarios de atención y oficinas de pago bancario habilitadas."
        ],
        "documentos": [
            "Directorio y catálogo de requisitos de aduanas de vehículos."
        ],
        "resultadoObtenido": "Hoja de ruta para el despacho ágil de vehículos en recintos portuarios.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "El vehículo debe contar con la batería cargada y llaves originales para facilitar la inspección física en el andén aduanero."
    },
    "SAT-GES-0383": {
        "gestion": "Conocer el proceso de alza e importación de vehículos",
        "nombreActual": "Conocer el proceso de alza e importación de vehículos",
        "descripcion": "Información sobre cómo la SAT determina el valor imponible de vehículos usados y en qué casos aplica un ajuste o alza al valor declarado por el importador.",
        "requisitos": [
            "Acceso libre a la normativa de valoración vehicular de la SAT."
        ],
        "pasos": [
            "Revisa los métodos de valoración aplicados a vehículos importados usados.",
            "Compara el precio pagado contra la tabla oficial de valores imponibles aprobada por el Directorio de la SAT.",
            "Conoce tus derechos para presentar pruebas documentales si tu vehículo costó menos que el valor de tabla.",
            "Acepta el valor de tabla o solicita la revisión técnica de valoración por daño severo."
        ],
        "documentos": [
            "Guía informativa sobre valoración y alza de vehículos."
        ],
        "resultadoObtenido": "Certeza técnica sobre los criterios de cálculo de impuestos de tu vehículo.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Si el vehículo presenta daños considerables, fotografías certificadas por la aseguradora en origen pueden justificar una reducción en el valor base imponible."
    },
    "SAT-GES-0384": {
        "gestion": "Importar y nacionalizar un vehículo automotor",
        "nombreActual": "Importar y nacionalizar un vehículo automotor",
        "descripcion": "Paso a paso integral para traer un vehículo del extranjero, pagar los tributos aduaneros (IPRIMA e IVA) y tramitar sus primeras placas guatemaltecas.",
        "requisitos": [
            "NIT activo del propietario con datos actualizados en RTU Digital.",
            "Título original del vehículo debidamente endosado o factura de compra internacional.",
            "Conocimiento de embarque (B/L) o carta de porte terrestre internacional.",
            "Contratación de un agente aduanero para transmitir la DUCA."
        ],
        "pasos": [
            "Tu agente aduanero transmite la DUCA de importación de vehículo con los datos del chasis, cilindraje, modelo y marca.",
            "Genera la boleta de pago de impuestos SAT-2000 y cancela en tu banco en línea o agencia bancaria.",
            "El vehículo pasa por el andén de aforo aduanero para verificar el número de chasis físico contra el sistema.",
            "Una vez autorizado el levante, genera tu cita en el Registro Fiscal de Vehículos para recoger tus placas metálicas."
        ],
        "documentos": [
            "Título de propiedad original.",
            "Factura o contrato de compra.",
            "DUCA cancelada.",
            "DPI del nuevo propietario."
        ],
        "resultadoObtenido": "Vehículo legalmente nacionalizado con placas de circulación, tarjeta de circulación y calcomanía.",
        "tiempoEstimado": "3 a 5 días hábiles",
        "costo": "Tributos según tabla de valores + Impuesto de Circulación proporcional + Q120 placa metálica",
        "advertencia": "No repares ni pintes el vehículo antes de la inspección aduanera; las alteraciones físicas previas al aforo impiden validar su estado real y demoran el despacho."
    },
    "SAT-GES-0376": {
        "gestion": "Comprobar el valor de un vehículo usado importado",
        "nombreActual": "Comprobar el valor de un vehículo usado importado",
        "descripcion": "Procedimiento para demostrar el valor real de compra de un vehículo usado adquirido en subastas internacionales (Copart, IAAI) mediante transferencias y facturas oficiales.",
        "requisitos": [
            "Factura original emitida por la casa de subastas internacional.",
            "Comprobante bancario de transferencia internacional (código SWIFT) a nombre del comprador.",
            "Historial fotográfico de la subasta donde consten los daños y el kilometraje real."
        ],
        "pasos": [
            "Presenta la carpeta de pruebas de pago bancario ante el revisor de la aduana vehicular.",
            "El analista técnico coteja el monto transferido contra la factura y el historial de la subasta en línea.",
            "Si la documentación es consistente, la aduana acepta el valor de transacción para liquidar impuestos.",
            "Procede a liquidar el IPRIMA e IVA sobre la base real comprobada."
        ],
        "documentos": [
            "Estado de cuenta bancario con el débito de la compra.",
            "Factura oficial de la subasta.",
            "Reporte Carfax o AutoCheck del vehículo."
        ],
        "resultadoObtenido": "Liquidación arancelaria calculada sobre el precio real de compra sin ajustes discrecionales.",
        "tiempoEstimado": "1 a 2 días hábiles",
        "costo": "Gratuito",
        "advertencia": "Facturas alteradas o recibos de compra en efectivo de terceros no son aceptados como prueba de valor por la Intendencia de Aduanas."
    },
    "SAT-GES-0378": {
        "gestion": "Consultar acuerdo de tabla de IVA para vehículos",
        "nombreActual": "Consultar acuerdo de tabla de IVA para vehículos",
        "descripcion": "Consulta el acuerdo oficial del Directorio de la SAT que aprueba los valores de referencia para el cálculo del IVA en la importación y traspaso de vehículos usados.",
        "requisitos": [
            "Acceso libre al portal institucional."
        ],
        "pasos": [
            "Ingresa al módulo de acuerdos y resoluciones del Directorio.",
            "Localiza el acuerdo anual que rige los valores del año en curso.",
            "Descarga el documento oficial publicado en el Diario de Centro América.",
            "Revisa las tablas de depreciación por año y modelo vehicular."
        ],
        "documentos": [
            "Acuerdo de Directorio oficial en PDF."
        ],
        "resultadoObtenido": "Base legal y técnica oficial de cálculo del impuesto vehicular.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Las tablas de valores se actualizan anualmente y entran en vigor el 1 de enero de cada ejercicio fiscal."
    },
    "SAT-GES-0379": {
        "gestion": "Consultar tabla de valores para importar vehículos 2025",
        "nombreActual": "Consultar tabla de valores para importar vehículos 2025",
        "descripcion": "Herramienta interactiva para conocer la base imponible y el cálculo proyectado de impuestos para importar cualquier marca, línea y modelo de vehículo.",
        "requisitos": [
            "Marca, modelo (año de fabricación) y línea del vehículo que deseas consultar."
        ],
        "pasos": [
            "Ingresa al cotizador de vehículos usados en el portal web de la SAT.",
            "Selecciona la marca (ej. Toyota, Honda, Ford), la línea y el año del modelo.",
            "El sistema muestra el valor imponible oficial en quetzales.",
            "Calcula automáticamente el monto proyectado de IPRIMA y el 12% de IVA a pagar."
        ],
        "documentos": [
            "Datos técnicos del vehículo a cotizar."
        ],
        "resultadoObtenido": "Cotización estimada de impuestos antes de comprar o embarcar tu vehículo.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "El cálculo es referencial; el monto final se determinará con las especificaciones físicas verificadas por el técnico aduanero durante la inspección."
    },
    "SAT-GES-0377": {
        "gestion": "Buscador de tabla de valores de vehículos",
        "nombreActual": "Buscador de tabla de valores de vehículos",
        "descripcion": "Buscador en línea para consultar rápidamente los valores de tabla por código de vehículo o características técnicas.",
        "requisitos": [
            "Acceso libre al portal web."
        ],
        "pasos": [
            "Accede al buscador rápido de tablas de vehículos.",
            "Escribe la marca o modelo en la casilla de búsqueda.",
            "Revisa los valores fijados para diferentes tipos de carrocería (sedán, camioneta, pick-up).",
            "Descarga la tabla completa en formato Excel o PDF si necesitas realizar análisis masivos."
        ],
        "documentos": [
            "Tabla de valores descargable en Excel."
        ],
        "resultadoObtenido": "Acceso a la matriz completa de valores fiscales de vehículos automotores.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Los vehículos clásicos o con más de 15 años de antigüedad tienen reglas especiales de depreciación mínima fijadas en la ley."
    },

    # -------------------------------------------------------------
    # Subrama 5: Mercancías en Abandono, Depósitos y Franquicias (9 gestiones)
    # -------------------------------------------------------------
    "SAT-GES-0392": {
        "gestion": "Guía de solicitudes de Franquicia Electrónica",
        "nombreActual": "Guía de solicitudes de Franquicia Electrónica",
        "descripcion": "Tutoriales y manuales operativos para que diplomáticos, organismos internacionales y entidades con exención legal gestionen su franquicia aduanera 100% digital.",
        "requisitos": [
            "Pertenecer a una embajada, misión diplomática, organismo internacional o entidad con ley de exención.",
            "Acceso a la plataforma de Franquicia Electrónica con firma autorizada."
        ],
        "pasos": [
            "Descarga el manual de usuario del sistema de Franquicia Electrónica.",
            "Revisa los pasos para crear tu expediente y asociar el aval del Ministerio de Relaciones Exteriores (MINEX).",
            "Visualiza los videos instructivos sobre cómo cargar las facturas y conocimientos de embarque.",
            "Inicia tu solicitud en el sistema para obtener la resolución de exención arancelaria."
        ],
        "documentos": [
            "Manual de usuario y videos explicativos."
        ],
        "resultadoObtenido": "Instrucciones claras para desaduanar mercancías bajo régimen de franquicia diplomática sin demoras.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Toda solicitud de franquicia diplomática debe contar previamente con el visto bueno digital de la Dirección de Protocolo del MINEX."
    },
    "SAT-GES-0393": {
        "gestion": "Llenar Declaración Jurada Regional de Viajero",
        "nombreActual": "Llenar Declaración Jurada Regional de Viajero",
        "descripcion": "Formulario digital obligatorio para pasajeros que ingresan o salen de Guatemala por vía aérea o terrestre, declarando equipaje, compras y dinero en efectivo.",
        "requisitos": [
            "Pasaporte vigente y número de vuelo o transporte terrestre.",
            "Relación de artículos adquiridos en el exterior con valor superior a la franquicia de viajero ($500 USD).",
            "Declaración obligatoria si transportas dinero en efectivo o valores iguales o superiores a $10,000 USD (o su equivalente)."
        ],
        "pasos": [
            "Ingresa a la aplicación digital de Declaración de Viajero desde tu teléfono o computadora (hasta 3 días antes de tu viaje).",
            "Completa tus datos personales, itinerario de vuelo y equipaje que transportas.",
            "El sistema genera un código QR oficial en tu pantalla.",
            "Muestra el código QR al oficial de aduanas en el punto de inspección del aeropuerto o frontera."
        ],
        "documentos": [
            "Código QR de la Declaración Jurada de Viajero.",
            "Pasaporte."
        ],
        "resultadoObtenido": "Paso ágil por el control de equipaje de aduanas sin llenar formularios impresos.",
        "tiempoEstimado": "5 minutos (en línea)",
        "costo": "Gratuito",
        "advertencia": "Omitir declarar sumas de dinero en efectivo iguales o superiores a $10,000 USD constituye delito de lavado de dinero y conlleva la incautación inmediata de los fondos."
    },
    "SAT-GES-0394": {
        "gestion": "Despacho de importación menor de oficio",
        "nombreActual": "Despacho de importación menor de oficio",
        "descripcion": "Procedimiento simplificado en el cual la autoridad aduanera liquida directamente los impuestos para paquetes o mercancías sin fines comerciales con valor de hasta $1,000 USD.",
        "requisitos": [
            "Documento Personal de Identificación (DPI) o pasaporte del viajero o destinatario.",
            "Factura o comprobante de compra de las mercancías.",
            "Valor total de la mercancía no superior a $1,000 USD (FOB)."
        ],
        "pasos": [
            "Presenta tus mercancías y facturas de compra en la ventanilla de importación menor de la aduana.",
            "El técnico aduanero realiza el aforo directo y emite la declaración de oficio en el sistema.",
            "Cancela los impuestos determinados en la agencia bancaria ubicada dentro de la misma aduana.",
            "Presenta el comprobante de pago cancelado y retira tus mercancías de inmediato sin necesidad de contratar agente aduanero."
        ],
        "documentos": [
            "Factura comercial o comprobante de compra.",
            "DPI o pasaporte del interesado."
        ],
        "resultadoObtenido": "Levante inmediato de tus compras personales o paquetería menor.",
        "tiempoEstimado": "30 a 60 minutos en aduana",
        "costo": "DAI correspondiente según producto + 12% IVA (sin honorarios de agente aduanero)",
        "advertencia": "Este procedimiento simplificado no aplica para mercancías restringidas, productos químicos ni lotes con fines comerciales evidentes."
    },
    "SAT-GES-0391": {
        "gestion": "Capacitación sobre Franquicias Electrónicas",
        "nombreActual": "Capacitación sobre Franquicias Electrónicas",
        "descripcion": "Taller virtual sobre la gestión, autorización y trazabilidad de exenciones aduaneras a través del sistema informático de la SAT.",
        "requisitos": [
            "Inscripción en la plataforma educativa CENSAT con correo electrónico."
        ],
        "pasos": [
            "Accede al portal de capacitaciones de la SAT.",
            "Inscríbete en el curso de Franquicias Aduaneras Electrónicas.",
            "Completa los módulos sobre normativa, plazos de respuesta y registro de solicitudes.",
            "Descarga el certificado de participación."
        ],
        "documentos": [
            "Formulario de inscripción digital."
        ],
        "resultadoObtenido": "Constancia de aprobación del curso de franquicias aduaneras.",
        "tiempoEstimado": "6 horas en línea",
        "costo": "Gratuito",
        "advertencia": "Dirigido especialmente a encargados de logística de misiones diplomáticas y entidades no gubernamentales con convenios de cooperación."
    },
    "SAT-GES-0390": {
        "gestion": "Garantías para importación y admisión temporal",
        "nombreActual": "Garantías para importación y admisión temporal",
        "descripcion": "Información sobre los tipos de seguros de caución, depósitos bancarios y cartas de garantía aceptados por la SAT para suspender el pago de aranceles en admisiones temporales.",
        "requisitos": [
            "Acceso libre al portal institucional para consultar los lineamientos."
        ],
        "pasos": [
            "Revisa los regímenes aduaneros temporales que permiten la suspensión de impuestos (maquila, ferias, turismo, reparación).",
            "Consulta el listado de afianzadoras autorizadas por la Superintendencia de Bancos (SIB).",
            "Verifica la fórmula para calcular el monto exacto de la garantía requerida.",
            "Coordina con tu aseguradora la redacción del texto de la fianza según el modelo normado de la SAT."
        ],
        "documentos": [
            "Modelo de póliza de garantía aduanera en PDF."
        ],
        "resultadoObtenido": "Requisitos claros para evitar observaciones en la constitución de garantías aduaneras.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Las fianzas deben tener una vigencia igual al plazo de permanencia autorizado de las mercancías más 30 días calendario adicionales de gracia."
    },
    "SAT-GES-0388": {
        "gestion": "Solicitar devolución de tributos arancelarios",
        "nombreActual": "Solicitar devolución de tributos arancelarios",
        "descripcion": "Procedimiento formal para solicitar el reembolso de pagos indebidos o en exceso realizados en concepto de aranceles (DAI) o IVA de importación.",
        "requisitos": [
            "Estar al día en tus obligaciones tributarias (sin omisos).",
            "Copia de la declaración aduanera y boleta de pago donde ocurrió el cobro en exceso.",
            "Documentos de soporte que fundamenten el error (ej. rectificación de partida arancelaria, certificado de origen omitido o duplicidad de pago).",
            "Cuenta bancaria activa a nombre del importador para recibir la transferencia."
        ],
        "pasos": [
            "Presenta tu memorial de solicitud ante la Intendencia de Aduanas o a través de la Agencia Virtual.",
            "Adjunta las pruebas del pago indebido o en exceso y la justificación técnica del reclamo.",
            "El departamento de fiscalización aduanera revisa el expediente y emite dictamen técnico.",
            "Si es favorable, el Directorio de la SAT autoriza la resolución de devolución mediante acreditamiento bancario."
        ],
        "documentos": [
            "Memorial de solicitud firmado por el representante legal.",
            "Comprobante original del pago bancario en exceso.",
            "Dictamen arancelario o documentos rectificados.",
            "Certificación bancaria de la cuenta."
        ],
        "resultadoObtenido": "Resolución de devolución y transferencia de los fondos a tu cuenta bancaria.",
        "tiempoEstimado": "30 a 60 días hábiles",
        "costo": "Gratuito",
        "advertencia": "El derecho a solicitar la devolución prescribe a los 4 años contados a partir de la fecha en que se efectuó el pago indebido."
    },
    "SAT-GES-0389": {
        "gestion": "Rescatar mercancías en abandono tácito",
        "nombreActual": "Rescatar mercancías en abandono tácito",
        "descripcion": "Procedimiento legal para recuperar mercancías que superaron el plazo máximo de permanencia en depósito aduanero antes de que sean subastadas por la SAT.",
        "requisitos": [
            "Ser el consignatario original de las mercancías o acreditar representación legal suficiente.",
            "Que las mercancías no hayan sido adjudicadas en subasta pública aduanera o destruidas.",
            "Contar con fondos para pagar los impuestos aduaneros, multas y almacenaje acumulado."
        ],
        "pasos": [
            "Presenta memorial de rescate de mercancías ante la administración de la aduana correspondiente.",
            "El depósito aduanero liquida los costos de almacenaje causados hasta la fecha.",
            "Tu agente aduanero elabora la DUCA de rescate y liquida los tributos arancelarios más la multa por vencimiento de plazo.",
            "Efectúa el pago total y procede con el retiro inmediato de la carga del depósito aduanero."
        ],
        "documentos": [
            "Memorial de rescate.",
            "Factura comercial y conocimiento de embarque original.",
            "Constancia de almacenaje del depósito aduanero."
        ],
        "resultadoObtenido": "Resolución de rescate y orden de levante para retirar las mercancías del almacén.",
        "tiempoEstimado": "5 a 10 días hábiles",
        "costo": "Tributos causados + multa del 3% mensual sobre el valor CIF + almacenaje privado",
        "advertencia": "Una vez publicada la convocatoria de subasta pública aduanera en el diario oficial, el rescate solo puede realizarse hasta el día anterior a la fecha fijada para la puja."
    },
    "SAT-GES-0386": {
        "gestion": "Recuperar depósitos aduaneros en garantía (SAT-8011)",
        "nombreActual": "Recuperar depósitos aduaneros en garantía (SAT-8011)",
        "descripcion": "Solicitud de reintegro de fondos depositados en garantía ante la SAT mediante formulario SAT-8011, tras haber cumplido con la obligación aduanera condicionada.",
        "requisitos": [
            "Boleta original de depósito en garantía (SAT-8011) debidamente certificada por el banco.",
            "Resolución aduanera o acta de inspección que confirme el cumplimiento total de la obligación garantizada.",
            "Número de cuenta bancaria del titular para realizar el depósito de reintegro."
        ],
        "pasos": [
            "Presenta tu solicitud formal de devolución de garantía ante la unidad financiera aduanera.",
            "Adjunta la boleta original del pago de garantía y la constancia de cancelación de la obligación.",
            "La unidad revisora verifica que no existan cobros pendientes vinculados a la operación.",
            "La SAT transfiere los fondos devueltos a tu cuenta monetaria o de ahorros registrada."
        ],
        "documentos": [
            "Boleta original SAT-8011.",
            "Copia de la DUCA o expediente respaldado.",
            "Constancia bancaria de cuenta activa."
        ],
        "resultadoObtenido": "Transferencia bancaria con el reembolso íntegro del depósito en garantía.",
        "tiempoEstimado": "15 a 30 días hábiles",
        "costo": "Gratuito",
        "advertencia": "Verifica que el nombre del titular de la cuenta bancaria coincida con el nombre registrado en la boleta SAT-8011 para evitar rechazos en la acreditación bancaria."
    },
    "SAT-GES-0387": {
        "gestion": "Requisitos para recuperar depósitos aduaneros",
        "nombreActual": "Requisitos para recuperar depósitos aduaneros",
        "descripcion": "Guía informativa con el listado de documentos, plazos y formularios necesarios para tramitar la devolución de depósitos de garantía aduanera.",
        "requisitos": [
            "Acceso libre al portal web oficial de la SAT."
        ],
        "pasos": [
            "Descarga la lista de chequeo de requisitos para devolución de depósitos de garantía.",
            "Reúne las certificaciones bancarias y comprobantes de la operación aduanera concluida.",
            "Llena el memorial con la estructura legal aprobada por la Intendencia de Aduanas.",
            "Ingresa tu expediente en la ventanilla de la sede aduanera donde radicaste el depósito."
        ],
        "documentos": [
            "Ficha técnica de requisitos para reintegro de garantías."
        ],
        "resultadoObtenido": "Documentación preparada para que tu solicitud de devolución no sufra prevenciones.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Si extraviaste la boleta original de depósito, debes presentar una denuncia por pérdida ante la Policía Nacional Civil antes de iniciar el reclamo de fondos."
    }
}

def apply_enrichment():
    catalog_path = Path("src/data/allTramites.json")
    if not catalog_path.exists():
        print(f"Error: {catalog_path} no encontrado.")
        return

    with open(catalog_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated_count = 0
    for item in data:
        gid = item.get("id")
        if gid in IMPORTADORES_CONTENT:
            patch = IMPORTADORES_CONTENT[gid]
            for key, val in patch.items():
                item[key] = val
            updated_count += 1

    with open(catalog_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Éxito: Se enriquecieron y editaron {updated_count} páginas de contenido en la rama Importadores de Comercio Exterior.")

if __name__ == "__main__":
    apply_enrichment()
