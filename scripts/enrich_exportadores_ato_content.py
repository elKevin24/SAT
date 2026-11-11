#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enriquecimiento y Reescritura UX Writing ATO - Rama Comercio Exterior: Exportadores (21 gestiones)
Aplica la metodología del Australian Taxation Office (ATO), el Australian Government Style Manual
y las directrices SAT (Reglas 10 y 12):
- Front-loading en títulos (<= 10 palabras con verbos de acción).
- Descripciones concisas en 2 oraciones máximo.
- Requisitos previos interactivos y específicos.
- Pasos ordenados en voz activa con verbos de acción.
- Documentos de soporte requeridos.
- Resultado obtenido claro (qué recibe el usuario).
- Alertas de prevención de errores y tiempos estimados.
- Cero uso de la palabra prohibida "trámite".
"""

import json
from pathlib import Path

EXPORTADORES_CONTENT = {
    # -------------------------------------------------------------
    # Subrama 1: Padrón y Registro de Exportadores (7 gestiones)
    # -------------------------------------------------------------
    "SAT-GES-0395": {
        "gestion": "Inscribirte en el Registro de Exportadores (VUPE / SAT)",
        "nombreActual": "Inscribirte en el Registro de Exportadores (VUPE / SAT)",
        "descripcion": "Habilita tu código de exportador en la Ventanilla Única para las Exportaciones (VUPE) y el sistema aduanero de la SAT. Te permite emitir declaraciones de exportación y acceder a beneficios fiscales.",
        "requisitos": [
            "Contar con Número de Identificación Tributaria (NIT) activo y sin omisos en SAT.",
            "Tener usuario y contraseña en Agencia Virtual.",
            "Estar afiliado al Régimen General del Impuesto al Valor Agregado (IVA).",
            "Tener actualizados los datos de tu establecimiento comercial en el RTU Digital."
        ],
        "pasos": [
            "Ingresa al portal de la Ventanilla Única para las Exportaciones (VUPE / AGEXPORT).",
            "Solicita la asignación del código de exportador vinculando tu NIT de la SAT.",
            "La SAT valida electrónicamente que estés al día en tus declaraciones y sin omisos.",
            "Recibe tu código oficial de exportador y la confirmación de habilitación en aduanas."
        ],
        "documentos": [
            "Constancia de RTU Digital actualizada.",
            "DPI del titular o nombramiento vigente del representante legal."
        ],
        "resultadoObtenido": "Código oficial de exportador activo y habilitado en el sistema aduanero nacional.",
        "tiempoEstimado": "24 a 48 horas hábiles",
        "costo": "Gratuito en SAT",
        "advertencia": "Estar en el régimen de Pequeño Contribuyente no te permite inscribirte como exportador habitual; debes migrar previamente al Régimen General del IVA."
    },
    "SAT-GES-0399": {
        "gestion": "Requisitos para inscribirte como exportador",
        "nombreActual": "Requisitos para inscribirte como exportador",
        "descripcion": "Consulta la documentación legal, técnica y operativa requerida para registrarte ante la SAT y la VUPE como persona individual o jurídica exportadora.",
        "requisitos": [
            "Acceso libre al portal web oficial de la SAT."
        ],
        "pasos": [
            "Descarga la guía oficial de requisitos para exportadores.",
            "Verifica que tu actividad económica en el RTU esté clasificada con código de exportación.",
            "Revisa los requisitos específicos si exportas productos agrícolas, hidrobiológicos o minerales.",
            "Inicia tu expediente digital en la plataforma de la VUPE."
        ],
        "documentos": [
            "Ficha de requisitos en formato PDF descargable."
        ],
        "resultadoObtenido": "Checklist completo para preparar tu expediente de exportador sin retrasos.",
        "tiempoEstimado": "Consulta inmediata",
        "costo": "Gratuito",
        "advertencia": "Exportar productos regulados (alimentos, plantas o medicamentos) exige licencias sanitarias previas emitidas por el MAGA o Ministerio de Salud."
    },
    "SAT-GES-0397": {
        "gestion": "Solicitar permiso de exportación ocasional",
        "nombreActual": "Solicitar permiso de exportación ocasional",
        "descripcion": "Autorización aduanera para personas individuales que necesitan enviar muestras comerciales, menaje de casa o exportaciones no habituales sin inscribirse en el padrón.",
        "requisitos": [
            "Documento Personal de Identificación (DPI) o pasaporte.",
            "Factura o declaración del valor comercial de los bienes a exportar.",
            "No superar el límite legal de 2 exportaciones por año calendario bajo esta modalidad."
        ],
        "pasos": [
            "Presenta tu solicitud en la ventanilla aduanera de la sede de exportación o aduana de salida.",
            "Indica el motivo del envío (muestra sin valor comercial, menaje de casa o equipaje no acompañado).",
            "El funcionario aduanero verifica los bienes y autoriza la DUCA simplificada de exportación.",
            "Entrega la mercancía a la aerolínea o transportista para su salida internacional."
        ],
        "documentos": [
            "Factura proforma o declaración de valor.",
            "DPI del remitente.",
            "Lista de empaque detallada."
        ],
        "resultadoObtenido": "Permiso aduanero de exportación ocasional para levante de carga.",
        "tiempoEstimado": "1 a 2 horas en aduana",
        "costo": "Gratuito",
        "advertencia": "Si los envíos tienen carácter comercial recurrente, la SAT denegará el permiso ocasional y te requerirá la inscripción en el registro de exportadores."
    },
    "SAT-GES-0400": {
        "gestion": "Registrar código de exportador en Agencia Virtual",
        "nombreActual": "Registrar código de exportador en Agencia Virtual",
        "descripcion": "Vinculación directa de tu código de exportador otorgado por la VUPE dentro de tu perfil de Agencia Virtual SAT para habilitar gestiones tributarias y de crédito fiscal.",
        "requisitos": [
            "Código de exportador emitido por la VUPE activo.",
            "Usuario y contraseña en Agencia Virtual SAT."
        ],
        "pasos": [
            "Inicia sesión en tu Agencia Virtual de la SAT.",
            "Dirígete al módulo de Comercio Exterior y selecciona 'Registro de Exportador'.",
            "Digita tu código de exportador otorgado por la VUPE y haz clic en Validar.",
            "El sistema confirma la vinculación y actualiza tu perfil aduanero de forma automática."
        ],
        "documentos": [
            "Constancia de código de exportador VUPE."
        ],
        "resultadoObtenido": "Perfil de exportador sincronizado en los sistemas informáticos de la SAT.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Verifica que el nombre comercial y NIT en la VUPE sean idénticos a los registrados en la SAT para evitar rechazos en la validación informática."
    },
    "SAT-GES-0401": {
        "gestion": "Presentar aviso de exportador (Formulario SAT-2125)",
        "nombreActual": "Presentar aviso de exportador (Formulario SAT-2125)",
        "descripcion": "Notificación oficial ante la SAT sobre el inicio de operaciones de exportación y la cuenta bancaria autorizada para recibir transferencias de crédito fiscal.",
        "requisitos": [
            "Estar inscrito en el Régimen General del IVA.",
            "Cuenta bancaria monetaria a nombre del exportador en un banco del sistema.",
            "Formulario electrónico SAT-2125 generado en Declaraguate."
        ],
        "pasos": [
            "Ingresa a Declaraguate y llena el formulario SAT-2125 (Aviso de Exportador).",
            "Ingresa el número de tu código de exportador y los datos de tu cuenta bancaria.",
            "Valida y congela el formulario para generar la boleta de presentación.",
            "Preséntalo electrónicamente a través de tu banca en línea o en ventanilla bancaria."
        ],
        "documentos": [
            "Formulario SAT-2125 congelado.",
            "Certificación bancaria de cuenta activa no mayor a 1 mes."
        ],
        "resultadoObtenido": "Constancia de aviso de exportador y registro de cuenta bancaria para devolución de impuestos.",
        "tiempoEstimado": "Inmediato tras presentación",
        "costo": "Gratuito",
        "advertencia": "La cuenta bancaria debe estar exclusivamente a nombre de la persona o entidad exportadora; no se aceptan cuentas de terceros o mancomunadas."
    },
    "SAT-GES-0396": {
        "gestion": "Inactivar o cesar registro de exportador",
        "nombreActual": "Inactivar o cesar registro de exportador",
        "descripcion": "Procedimiento para suspender temporalmente o cancelar de forma definitiva tu registro en el padrón de exportadores al finalizar tus actividades de comercio exterior.",
        "requisitos": [
            "No tener declaraciones aduaneras de exportación pendientes de liquidar.",
            "Estar solvente en el pago de impuestos ante la SAT.",
            "Solicitud formal de cese o inactivación en Agencia Virtual."
        ],
        "pasos": [
            "Ingresa a tu Agencia Virtual y selecciona la opción 'Cese de Registro de Exportador'.",
            "Indica el motivo del cese (suspensión temporal o clausura definitiva).",
            "El sistema verifica que no existan embarques en tránsito ni expedientes de fianza abiertos.",
            "Confirma la solicitud y descarga la constancia oficial de inactivación."
        ],
        "documentos": [
            "Constancia de no tener pólizas aduaneras pendientes."
        ],
        "resultadoObtenido": "Constancia de cese o suspensión en el padrón aduanero de exportadores.",
        "tiempoEstimado": "24 horas hábiles",
        "costo": "Gratuito",
        "advertencia": "Inactivar tu registro suspende automáticamente cualquier solicitud en curso de devolución de crédito fiscal hasta que aclares tu situación tributaria."
    },
    "SAT-GES-0398": {
        "gestion": "Actualizar datos en el Registro de Exportadores",
        "nombreActual": "Actualizar datos en el Registro de Exportadores",
        "descripcion": "Modificación de datos de contacto, representante legal, cuentas bancarias o tipos de productos exportados en la base de datos aduanera.",
        "requisitos": [
            "Tener usuario y contraseña de Agencia Virtual.",
            "Documentos que respalden el cambio que deseas efectuar (ej. acta de nuevo representante, nueva cuenta bancaria)."
        ],
        "pasos": [
            "Accede a tu Agencia Virtual en la sección RTU / Exportadores.",
            "Selecciona los campos que necesitas modificar y escribe los nuevos datos.",
            "Adjunta los documentos de respaldo en formato PDF legible.",
            "Envía la solicitud y recibe la confirmación con los datos actualizados."
        ],
        "documentos": [
            "Documento de soporte según el cambio (certificación bancaria, nombramiento legal)."
        ],
        "resultadoObtenido": "Constancia digital de actualización de datos de exportador.",
        "tiempoEstimado": "24 a 48 horas hábiles",
        "costo": "Gratuito",
        "advertencia": "Mantener actualizado el correo electrónico de notificaciones es vital para recibir avisos de auditoría de crédito fiscal y requerimientos de aduanas."
    },

    # -------------------------------------------------------------
    # Subrama 2: Declaraciones Aduaneras y Embarques (4 gestiones)
    # -------------------------------------------------------------
    "SAT-GES-0402": {
        "gestion": "Presentar declaración complementaria de exportación",
        "nombreActual": "Presentar declaración complementaria de exportación",
        "descripcion": "Ajuste o regularización formal de los datos definitivos de peso, valor o cantidad de una exportación previamente despachada con declaración provisional.",
        "requisitos": [
            "DUCA provisional de exportación aceptada previamente en la aduana de salida.",
            "Factura comercial definitiva con el precio final liquidado con el comprador en destino.",
            "Conocimiento de embarque definitivo emitido por la naviera o aerolínea."
        ],
        "pasos": [
            "Tu agente aduanero ingresa al sistema informático aduanero y selecciona la DUCA provisional.",
            "Captura los valores y cantidades definitivas comprobadas en el destino.",
            "Adjunta los comprobantes de liquidación final del comprador extranjero.",
            "Transmite la declaración complementaria dentro del plazo reglamentario."
        ],
        "documentos": [
            "Factura comercial definitiva.",
            "Documento de transporte final con sellos de recepción.",
            "DUCA provisional."
        ],
        "resultadoObtenido": "Declaración complementaria aceptada y cierre definitivo del expediente de exportación.",
        "tiempoEstimado": "24 horas hábiles",
        "costo": "Gratuito en SAT",
        "advertencia": "La declaración complementaria debe presentarse en un plazo máximo de 15 días posteriores al embarque; omitirla genera sanciones por incumplimiento de plazos aduaneros."
    },
    "SAT-GES-0404": {
        "gestion": "Transmitir Declaración Simplificada de Exportación",
        "nombreActual": "Transmitir Declaración Simplificada de Exportación",
        "descripcion": "Gestión electrónica en Aduana sin Papeles para despachar exportaciones definitivas de forma ágil mediante la transmisión de la DUCA de exportación.",
        "requisitos": [
            "Exportador habilitado en el padrón de la SAT.",
            "Intervención de agente aduanero o habilitación de autodespacho en VUPE.",
            "Documentos de transporte y factura comercial de exportación digitalizados."
        ],
        "pasos": [
            "Captura los datos del producto, valor FOB y país de destino en el sistema de la VUPE / SAT.",
            "Asocia los documentos de soporte en formato PDF en el módulo de Aduana sin Papeles.",
            "Transmite la declaración aduanera y genera la boleta con el código de barras oficial.",
            "Presenta la carga en la aduana de salida para la asignación de canal en el semáforo aduanero."
        ],
        "documentos": [
            "Factura comercial de exportación (FEL).",
            "Carta de porte, guía aérea o conocimiento de embarque (B/L).",
            "Permisos o certificados de origen si aplica."
        ],
        "resultadoObtenido": "DUCA de exportación autorizada y pase de salida para el embarque internacional.",
        "tiempoEstimado": "Menos de 1 hora",
        "costo": "Gratuito en SAT",
        "advertencia": "Las exportaciones están exentas de aranceles de salida en Guatemala y gravadas con tasa cero (0%) en el IVA, lo que da derecho a reclamar crédito fiscal."
    },
    "SAT-GES-0405": {
        "gestion": "Autorizar lista de embarque en aduana",
        "nombreActual": "Autorizar lista de embarque en aduana",
        "descripcion": "Validación de la relación detallada de bultos, contenedores y precintos que integran un cargamento consolidado para su carga en buque, avión o transporte terrestre.",
        "requisitos": [
            "Lista de empaque (Packing List) numerada y firmada por el exportador.",
            "DUCAs de exportación que amparan cada una de las fracciones del cargamento.",
            "Manifiesto de carga preliminar de la empresa transportista."
        ],
        "pasos": [
            "El transportista o agente entrega la lista de embarque electrónica ante la autoridad de la aduana portuaria.",
            "El sistema aduanero valida que todos los contenedores cuenten con selectivo verde o inspección física aprobada.",
            "Se autoriza la orden de estiba y carga en la nave o unidad de transporte.",
            "Se expide el pase de salida internacional del recinto portuario."
        ],
        "documentos": [
            "Lista de empaque y estiba.",
            "Reporte de precintos de seguridad colocados."
        ],
        "resultadoObtenido": "Autorización formal de embarque y salida del territorio aduanero nacional.",
        "tiempoEstimado": "1 a 3 horas en puerto",
        "costo": "Gratuito en SAT",
        "advertencia": "Cualquier contenedor cuyo precinto de seguridad presente roturas o diferencias numéricas con la lista de embarque será retenido para inspección física exhaustiva."
    },
    "SAT-GES-0403": {
        "gestion": "Consultar selectivo de exportación en aduana",
        "nombreActual": "Consultar selectivo de exportación en aduana",
        "descripcion": "Verificación en tiempo real del semáforo aduanero asignado a las declaraciones de exportación (verde para levante inmediato o rojo para inspección documental y física).",
        "requisitos": [
            "Número de DUCA de exportación o placa del camión transportista."
        ],
        "pasos": [
            "Accede al monitor público de selectivo de exportación de la SAT.",
            "Ingresa el número de declaración o número de contenedor.",
            "Verifica si el sistema otorgó canal verde para embarque directo o canal rojo para aforo.",
            "Descarga el comprobante con la hora de autorización de levante."
        ],
        "documentos": [
            "Número oficial de la DUCA."
        ],
        "resultadoObtenido": "Confirmación oficial del estado de selectivo para entrega de carga a la naviera o aerolínea.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Más del 95% de las exportaciones guatemaltecas reciben canal verde automático gracias a los acuerdos de facilitación aduanera."
    },

    # -------------------------------------------------------------
    # Subrama 3: Devolución de Crédito Fiscal (10 gestiones)
    # -------------------------------------------------------------
    "SAT-GES-0409": {
        "gestion": "Inscribirte al Régimen Especial de Devolución de IVA",
        "nombreActual": "Inscribirte al Régimen Especial de Devolución de IVA",
        "descripcion": "Solicitud para calificar en el Régimen Especial que permite a los exportadores habituales recibir la devolución de su crédito fiscal de IVA mediante acreditamiento bancario ágil.",
        "requisitos": [
            "Estar inscrito en el Régimen General del IVA con exportaciones en los últimos 6 meses.",
            "Tener una proporción mínima de exportaciones respecto a ventas totales según la ley.",
            "Estar al día en la presentación de declaraciones del IVA e ISR.",
            "Llevar contabilidad completa con libros de compras y ventas al día."
        ],
        "pasos": [
            "Ingresa a tu Agencia Virtual y selecciona 'Inscripción a Régimen Especial de Devolución'.",
            "Adjunta tus estados financieros y la relación de facturas de compras de insumos vinculados a la exportación.",
            "La Intendencia de Fiscalización evalúa la consistencia de tu crédito fiscal acumulado.",
            "Recibe la resolución de aprobación e incorporación al padrón del Régimen Especial."
        ],
        "documentos": [
            "Estados financieros firmados por contador registrado.",
            "Relación electrónica de DUCAs de exportación cumplidas.",
            "Certificación bancaria de cuenta monetaria."
        ],
        "resultadoObtenido": "Resolución de Directorio que incorpora a la empresa al Régimen Especial de Devolución de IVA.",
        "tiempoEstimado": "15 a 30 días hábiles",
        "costo": "Gratuito",
        "advertencia": "Las compras reportadas deben tener vinculación directa con el proceso productivo o comercial del bien exportado para ser reconocidas como crédito fiscal válido."
    },
    "SAT-GES-0412": {
        "gestion": "Inscribirte al Régimen Optativo de Devolución de IVA",
        "nombreActual": "Inscribirte al Régimen Optativo de Devolución de IVA",
        "descripcion": "Modalidad de devolución rápida de crédito fiscal de IVA para exportadores calificados mediante dictamen emitido por Contador Público y Auditor independiente.",
        "requisitos": [
            "Dictamen favorable emitido por Contador Público y Auditor (CPA) independiente registrado en SAT.",
            "Estar inscrito en el Régimen General del IVA y Registro de Exportadores.",
            "Constitución de póliza de fianza o garantía a favor de la SAT por el porcentaje fijado en la ley."
        ],
        "pasos": [
            "Presenta tu memorial de solicitud de ingreso al Régimen Optativo en la Agencia Virtual.",
            "Adjunta el dictamen de auditoría y los anexos de compras y ventas del período evaluado.",
            "La SAT revisa el cumplimiento formal y valida la fianza de respaldo.",
            "Emite la resolución de admisión al Régimen Optativo para devoluciones en un plazo máximo de 10 días."
        ],
        "documentos": [
            "Dictamen de CPA independiente.",
            "Póliza de fianza de caución.",
            "Libros de compras y ventas electrónicos."
        ],
        "resultadoObtenido": "Resolución que autoriza el cobro expedito de crédito fiscal mediante dictamen de auditor.",
        "tiempoEstimado": "10 a 20 días hábiles",
        "costo": "Gratuito en SAT (los honorarios del CPA y fianza son privados)",
        "advertencia": "Si auditorías posteriores detectan inconsistencias en las facturas avaladas por el CPA, el exportador y el auditor asumen responsabilidad solidaria y cobro de la fianza."
    },
    "SAT-GES-0414": {
        "gestion": "Solicitar devolución mensual de crédito fiscal de IVA",
        "nombreActual": "Solicitar devolución mensual de crédito fiscal de IVA",
        "descripcion": "Presentación electrónica periódica para requerir el reintegro de los saldos de IVA pagados en compras locales de insumos destinados a la exportación.",
        "requisitos": [
            "Estar incorporado activamente en el Régimen Especial u Optativo de Devolución.",
            "Declaración mensual del IVA (SAT-2237) presentada con saldo a favor generado por exportaciones.",
            "Archivo electrónico con el libro de compras estructurado según el formato oficial."
        ],
        "pasos": [
            "Ingresa al aplicativo web de Devolución de Crédito Fiscal en tu Agencia Virtual.",
            "Carga el archivo con el detalle de las facturas de compra y las declaraciones de exportación del mes.",
            "El sistema realiza la validación cruzada instantánea con las Facturas Electrónicas (FEL) de los proveedores.",
            "Confirma la solicitud y obtén el número de expediente electrónico para seguimiento del depósito."
        ],
        "documentos": [
            "Libro de compras electrónico del período.",
            "Relación de DUCAs de exportación del mes.",
            "Declaración jurada del formulario mensual."
        ],
        "resultadoObtenido": "Expediente electrónico autorizado y acreditamiento bancario de los fondos de IVA a tu cuenta.",
        "tiempoEstimado": "10 a 30 días hábiles (según régimen calificado)",
        "costo": "Gratuito",
        "advertencia": "Facturas de proveedores que tengan omisos o que no hayan emitido DTEs válidos en el régimen FEL son rechazadas automáticamente del cómputo de devolución."
    },
    "SAT-GES-0413": {
        "gestion": "Consultar estado de devolución de crédito fiscal",
        "nombreActual": "Consultar estado de devolución de crédito fiscal",
        "descripcion": "Seguimiento en línea de los expedientes mensuales de devolución de IVA para conocer la etapa de análisis, dictamen, emisión de resolución y fecha de pago bancario.",
        "requisitos": [
            "Número de expediente de solicitud de devolución o período fiscal (mes y año).",
            "Usuario de Agencia Virtual."
        ],
        "pasos": [
            "Inicia sesión en tu Agencia Virtual SAT.",
            "Accede a 'Consultas Tributarias' y haz clic en 'Estado de Solicitudes de Crédito Fiscal'.",
            "Localiza el mes consultado para ver el estatus: En Análisis, Aprobado o Liquidado.",
            "Descarga la resolución digital o consulta la fecha de transferencia emitida por la Tesorería."
        ],
        "documentos": [
            "Número de expediente mensual."
        ],
        "resultadoObtenido": "Información transparente del avance procesal y fecha estimada de acreditamiento.",
        "tiempoEstimado": "Inmediato (en línea)",
        "costo": "Gratuito",
        "advertencia": "Si el expediente cambia a estado 'Con Observaciones', revisa de inmediato tu buzón electrónico para responder los requerimientos en el plazo otorgado."
    },
    "SAT-GES-0406": {
        "gestion": "Cambiar al Régimen Optativo de Devolución de IVA",
        "nombreActual": "Cambiar al Régimen Optativo de Devolución de IVA",
        "descripcion": "Gestión para contribuyentes inscritos en el Régimen Especial que desean migrar al Régimen Optativo para agilizar sus devoluciones mediante dictamen de CPA.",
        "requisitos": [
            "Estar inscrito y activo en el Régimen Especial de Devolución de IVA.",
            "Dictamen de Contador Público y Auditor independiente que avale la migración.",
            "Fianza de garantía actualizada."
        ],
        "pasos": [
            "Presenta la solicitud de cambio de régimen en la plataforma de Agencia Virtual.",
            "Adjunta la póliza de fianza y el dictamen técnico del auditor.",
            "La SAT evalúa que no existan litigios ni ajustes pendientes en el Régimen Especial.",
            "Emite la resolución de traslado y habilita la presentación de solicitudes bajo el Régimen Optativo."
        ],
        "documentos": [
            "Solicitud formal de traslado de régimen.",
            "Dictamen de CPA.",
            "Póliza de fianza."
        ],
        "resultadoObtenido": "Resolución de cambio al Régimen Optativo con plazos de devolución de hasta 10 días.",
        "tiempoEstimado": "15 días hábiles",
        "costo": "Gratuito en SAT",
        "advertencia": "El cambio de régimen surte efectos a partir del período mensual siguiente a la notificación de la resolución favorable."
    },
    "SAT-GES-0407": {
        "gestion": "Cambiar al Régimen Especial de Devolución de IVA",
        "nombreActual": "Cambiar al Régimen Especial de Devolución de IVA",
        "descripcion": "Procedimiento para trasladarse del Régimen Optativo al Régimen Especial de Devolución de IVA ante la SAT.",
        "requisitos": [
            "Estar activo en el Régimen Optativo sin expedientes sancionatorios abiertos.",
            "Memorial de solicitud dirigido a la Intendencia de Fiscalización.",
            "Estar solvente en el pago de impuestos."
        ],
        "pasos": [
            "Ingresa la solicitud de traslado al Régimen Especial a través de Agencia Virtual.",
            "Presenta la liquidación del último período tramitado bajo el Régimen Optativo.",
            "La SAT revisa el cumplimiento y procede a cancelar la fianza vigente una vez liquidado el saldo.",
            "Recibe la resolución que te confirma en el Régimen Especial."
        ],
        "documentos": [
            "Memorial de renuncia al Régimen Optativo y adhesión al Especial.",
            "Constancia de no tener ajustes pendientes."
        ],
        "resultadoObtenido": "Resolución de traslado al Régimen Especial y liberación de la póliza de fianza.",
        "tiempoEstimado": "15 a 20 días hábiles",
        "costo": "Gratuito",
        "advertencia": "Al regresar al Régimen Especial, los plazos de revisión y pago se rigen por los tiempos estándar de fiscalización aduanera y tributaria."
    },
    "SAT-GES-0408": {
        "gestion": "Guía de devolución de crédito fiscal para exportadores",
        "nombreActual": "Guía de devolución de crédito fiscal para exportadores",
        "descripcion": "Manual comprensivo sobre requisitos legales, plazos, fórmulas de prorrateo y causales de rechazo de solicitudes de crédito fiscal de IVA para el sector exportador.",
        "requisitos": [
            "Acceso libre al portal web oficial de la SAT."
        ],
        "pasos": [
            "Descarga la guía metodológica de devolución de crédito fiscal.",
            "Revisa los criterios institucionales sobre gastos deducibles directamente vinculados a la exportación.",
            "Aprende a formular el cálculo del factor de proporcionalidad entre ventas locales y externas.",
            "Consulta los modelos de expedientes exitosos para asegurar la aprobación de tus solicitudes."
        ],
        "documentos": [
            "Manual técnico de crédito fiscal en formato PDF."
        ],
        "resultadoObtenido": "Manual de consulta permanente para optimizar la gestión financiera del IVA exportador.",
        "tiempoEstimado": "Descarga inmediata",
        "costo": "Gratuito",
        "advertencia": "Facturas con más de 2 meses de antigüedad respecto al período de compra no pueden ser incorporadas en solicitudes extemporáneas de crédito fiscal."
    },
    "SAT-GES-0410": {
        "gestion": "Curso: Actualización de exportadores en Régimen Especial",
        "nombreActual": "Curso: Actualización de exportadores en Régimen Especial",
        "descripcion": "Capacitación interactiva del CENSAT sobre la normativa contable, digitalización de facturas y mejores prácticas para mantener activa la calificación en el Régimen Especial.",
        "requisitos": [
            "Inscripción en la plataforma educativa CENSAT con tu NIT o correo de empresa."
        ],
        "pasos": [
            "Accede al catálogo de cursos aduaneros y tributarios del CENSAT.",
            "Selecciona el curso virtual de 'Régimen Especial de Devolución'.",
            "Completa los módulos sobre revisión de proveedores y auditoría preventiva de compras.",
            "Descarga tu diploma de participación para respaldar la capacitación de tu equipo contable."
        ],
        "documentos": [
            "Formulario digital de inscripción al curso."
        ],
        "resultadoObtenido": "Diploma de capacitación oficial para contadores y encargados tributarios de exportadoras.",
        "tiempoEstimado": "8 horas autoguiadas",
        "costo": "Gratuito",
        "advertencia": "Capacitar a tu personal contable reduce hasta en un 80% las prevenciones y retrasos en los pagos de crédito fiscal."
    },
    "SAT-GES-0411": {
        "gestion": "Actualizar datos en el Régimen Especial de Devolución",
        "nombreActual": "Actualizar datos en el Régimen Especial de Devolución",
        "descripcion": "Actualización de información de cuentas bancarias de reintegro, contadores responsables y líneas de exportación para contribuyentes en el Régimen Especial.",
        "requisitos": [
            "Usuario de Agencia Virtual del representante legal.",
            "Documentos probatorios del cambio a registrar (certificación bancaria o aviso de contador)."
        ],
        "pasos": [
            "Ingresa al apartado de Régimen Especial en tu Agencia Virtual.",
            "Actualiza la cuenta bancaria de recepción de fondos o datos de notificación.",
            "Adjunta los archivos comprobatorios en formato digital.",
            "Recibe la confirmación inmediata en tu buzón electrónico de la SAT."
        ],
        "documentos": [
            "Certificación bancaria actualizada.",
            "DPI del representante legal."
        ],
        "resultadoObtenido": "Actualización inmediata del expediente registral para pagos sin retrasos.",
        "tiempoEstimado": "24 horas hábiles",
        "costo": "Gratuito",
        "advertencia": "Si cambias de cuenta bancaria y no lo notificas en este módulo, la transferencia de tu crédito fiscal será rebotada por el Banco de Guatemala."
    },
    "SAT-GES-0415": {
        "gestion": "Curso: Régimen Electrónico de Devolución de Crédito Fiscal",
        "nombreActual": "Curso: Régimen Electrónico de Devolución de Crédito Fiscal",
        "descripcion": "Taller virtual para dominar el uso de la herramienta web de carga masiva de libros de compras y validación electrónica de facturas para devolución de IVA.",
        "requisitos": [
            "Acceso al aula virtual CENSAT con correo electrónico."
        ],
        "pasos": [
            "Inscríbete en el taller práctico de Devolución Electrónica de Crédito Fiscal.",
            "Aprende a estructurar el archivo plano o XML de libros de compras para evitar errores de sintaxis.",
            "Practica en el simulador de validación de facturas FEL.",
            "Obtén la certificación de operador del sistema de devolución electrónica."
        ],
        "documentos": [
            "Inscripción en línea en el portal de capacitaciones."
        ],
        "resultadoObtenido": "Certificado de competencia en el manejo del sistema digital de crédito fiscal.",
        "tiempoEstimado": "6 horas en línea",
        "costo": "Gratuito",
        "advertencia": "El sistema electrónico valida las facturas en milisegundos contra las bases de datos FEL; conocer la estructura de carga evita rechazos masivos de archivos."
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
        if gid in EXPORTADORES_CONTENT:
            patch = EXPORTADORES_CONTENT[gid]
            for key, val in patch.items():
                item[key] = val
            updated_count += 1

    with open(catalog_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Éxito: Se enriquecieron y editaron {updated_count} páginas de contenido en la rama Exportadores de Comercio Exterior.")

if __name__ == "__main__":
    apply_enrichment()
