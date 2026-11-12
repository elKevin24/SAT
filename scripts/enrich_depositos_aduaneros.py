# -*- coding: utf-8 -*-
"""
Enrichment script for Depósitos Aduaneros (36 gestiones) in AFPA
Adhering to ATO UX Writing standards, Regla 12, and SAT Guatemala regulations.
"""

import json

def enrich_depositos():
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Dictionary of enriched data for Depósitos Aduaneros
    dep_data = {
        "SAT-GES-0457": {
            "nombreActual": "Habilitar recinto para depósito aduanero temporal (DAT)",
            "descripcion": "Solicita ante la Intendencia de Aduanas la autorización y delimitación física de instalaciones para operar como Depósito Aduanero Temporal (DAT). Permite custodiar y almacenar mercancías extranjeras pendientes de destinación aduanera bajo control satelital y fiscal.",
            "requisitos": [
                "Constituir sociedad anónima debidamente inscrita en el Registro Mercantil con objeto de almacenamiento aduanero.",
                "Estar inscrito en el RTU con solvencia fiscal y régimen tributario general aplicable.",
                "Disponer de un inmueble propio o arrendado que cumpla con los estándares de seguridad física, bardas perimetrales y circuito cerrado de televisión (CCTV) con enlace directo a SAT.",
                "Presentar póliza de seguro de caución a favor de la SAT por el monto determinado en el estudio técnico de riesgo."
            ],
            "documentos": [
                "Testimonio de escritura constitutiva de la sociedad y nombramiento del representante legal.",
                "Planos arquitectónicos y de delimitación del área del recinto con coordenadas georreferenciadas.",
                "Póliza original de fianza de seguro de caución operativa a favor de la SAT.",
                "Dictamen favorable de viabilidad técnica y seguridad perimetral expedido por la Intendencia de Aduanas."
            ],
            "pasos": [
                "Ingresa el memorial de solicitud de habilitación de DAT en la Unidad de Administración de Auxiliares (Torre SAT, nivel 3).",
                "Entrega el expediente técnico con planos de ingeniería y especificaciones del sistema de videovigilancia CCTV.",
                "Atiende la visita de inspección ocular realizada por los auditores y técnicos de aduanas en las instalaciones.",
                "Consigna la póliza de fianza requerida tras la aprobación técnica preliminar.",
                "Recibe la resolución de Directorio o Intendencia de Aduanas que autoriza el código de DAT y su delimitación geográfica."
            ],
            "resultadoObtenido": "Resolución administrativa de habilitación del Depósito Aduanero Temporal e inscripción en el registro nacional de recintos aduaneros.",
            "tiempoEstimado": "45 a 60 días hábiles",
            "costo": "Gratuito ante SAT (inversión de infraestructura y póliza de caución a cargo de la empresa)",
            "advertencia": "Operar como depósito aduanero sin resolución formal de habilitación constituye delito de defraudación aduanera y comiso inmediato de los bultos almacenados.",
            "normativa": "Código Aduanero Uniforme Centroamericano (CAUCA) Artículo 19; RECAUCA Artículos 111 al 121; Procedimiento PR-IAD/DNO-ADU-AYR-50."
        },
        "SAT-GES-0450": {
            "nombreActual": "Gestionar declaración de abandono y subasta aduanera de mercancías",
            "descripcion": "Consulta el procedimiento normado para declarar en abandono las mercancías que superaron el plazo máximo de permanencia en depósito aduanero sin ser nacionalizadas. Permite a los recintos fiscales desahogar espacio físico y notificar a la autoridad para su remate público.",
            "requisitos": [
                "Estar acreditado como administrador o representante legal de un Depósito Aduanero o Almacén Fiscal habilitado.",
                "Haber transcurrido el plazo legal de permanencia (más de 6 meses en depósito o 20 días en temporal) sin destinación aduanera.",
                "Registros de notificación o avisos preventivos dirigidos al consignatario de la carga."
            ],
            "documentos": [
                "Inventario detallado de mercancías en presunto abandono (marca, cantidad, bultos y descripción física).",
                "Conocimientos de embarque (Bill of Lading o Carta de Porte) y actas de recepción DAT originales.",
                "Memorial de notificación de abandono dirigido al Administrador de la Aduana de jurisdicción."
            ],
            "pasos": [
                "Revisa el libro de existencias del depósito e identifica los lotes cuyo plazo legal de almacenaje ha prescrito.",
                "Elabora el inventario pormenorizado de las mercancías y emite el aviso oficial de abandono.",
                "Presenta el informe ante la Administración de la Aduana correspondiente para la declaratoria formal de abandono tácito.",
                "La SAT publica las listas de mercancías en abandono en el Diario Oficial previo a programar la subasta pública o donación oficial."
            ],
            "resultadoObtenido": "Resolución de declaratoria de abandono que transfiere la custodia de los bienes al Departamento de Subastas de la SAT.",
            "tiempoEstimado": "20 a 30 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No reportar oportunamente las mercancías caídas en abandono genera responsabilidades solidarias para el depósito sobre los tributos de importación devengados.",
            "normativa": "CAUCA Artículos 118 al 120; RECAUCA Artículos 601 al 610 (Abandono y Subasta Aduanera)."
        },
        "SAT-GES-0451": {
            "nombreActual": "Consultar cálculo de cobro por permanencia de mercancías (SCP)",
            "descripcion": "Calcula en línea el importe adeudado por el servicio de custodia y estadía de mercancías retenidas en recintos portuarios y aduaneros administrados por la SAT. Facilita la liquidación exacta de tarifas antes de efectuar el retiro de las cargas.",
            "requisitos": [
                "Número de declaración de aduana (DUCA) o número de documento de ingreso a rampa.",
                "Fecha exacta de ingreso físico de las mercancías al recinto aduanero.",
                "Volumen o peso de la carga en metros cúbicos o toneladas métricas."
            ],
            "documentos": [
                "Comprobante o acta de ingreso al recinto aduanero con sello fechador.",
                "Declaración de mercancías debidamente liquidada."
            ],
            "pasos": [
                "Ingresa a la herramienta 'Sistema de Cobro por Permanencia (SCP)' en el Portal SAT.",
                "Introduce el código de la aduana, el número de documento de carga y la fecha prevista de retiro.",
                "El sistema calcula automáticamente los días de gracia aplicables y la tarifa acumulada según el tipo de recinto.",
                "Genera la boleta de pago SAT-8008 en Declaraguate y cancélala en la banca en línea antes de movilizar el embarque."
            ],
            "resultadoObtenido": "Boleta de cálculo oficial para el pago de la tarifa de permanencia aduanera.",
            "tiempoEstimado": "Inmediato (consulta interactiva)",
            "costo": "Gratuito (la tarifa de permanencia depende del peso y tiempo de almacenaje)",
            "advertencia": "Retirar la carga sin haber satisfecho el cobro por permanencia en el sistema SCP impedirá la impresión del pase de salida en las garitas de control.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; Acuerdo de Directorio SAT 07-2007 (Tarifario de Servicios Aduaneros)."
        },
        "SAT-GES-0447": {
            "nombreActual": "Registrar títulos de crédito y bonos de prenda en almacenes fiscales",
            "descripcion": "Registra y reporta ante la SAT los certificados de depósito y bonos de prenda emitidos sobre mercancías afianzadas bajo régimen de depósito aduanero. Otorga certeza jurídica a las operaciones financieras garantizadas con inventarios fiscales.",
            "requisitos": [
                "Estar constituido como Almacén General de Depósito regulado por la Superintendencia de Bancos y habilitado ante SAT.",
                "Mercancías debidamente amparadas bajo declaración aduanera de depósito (régimen 150-DA).",
                "Póliza de fianza global vigente a favor del Estado de Guatemala."
            ],
            "documentos": [
                "Copia de los certificados de depósito y bonos de prenda emitidos con numeración correlativa.",
                "Declaración de mercancías de ingreso a depósito y póliza afianzada asociada.",
                "Reporte mensual de inventarios y títulos de crédito en circulación."
            ],
            "pasos": [
                "Emite el certificado de depósito y bono de prenda conforme a la Ley de Almacenes Generales de Depósito.",
                "Registra la emisión del título en el sistema informático de control aduanero de inventarios afianzados.",
                "Entrega el reporte mensual consolidado de títulos vigentes ante la Unidad de Regímenes Especiales de la SAT.",
                "Al cancelarse el crédito, asienta la anulación del título para liberar las mercancías hacia importación definitiva o reexportación."
            ],
            "resultadoObtenido": "Constancia de registro informático de gravamen prendario y validación de custodia aduanera.",
            "tiempoEstimado": "1 a 3 días hábiles",
            "costo": "Gratuito ante SAT (comisiones mercantiles acordadas privadamente)",
            "advertencia": "Liberar o entregar mercancías amparadas con bonos de prenda vigentes sin autorización judicial o anulación formal del título constituye delito de estafa y alzamiento de bienes.",
            "normativa": "Ley de Almacenes Generales de Depósito (Decreto 1236 del Congreso); RECAUCA Artículo 118."
        },
        "SAT-GES-0448": {
            "nombreActual": "Reportar saldos e inventarios de existencias afianzadas en depósitos",
            "descripcion": "Transmite periódicamente a la Intendencia de Aduanas el informe de inventario de mercancías bajo custodia afianzada en almacenes fiscales y depósitos aduaneros. Garantiza la congruencia entre las pólizas de garantía registradas y las mercancías en bodega.",
            "requisitos": [
                "Contar con clave de acceso como Depósito Aduanero en el sistema de control de inventarios de la SAT.",
                "Llevar libros y registros contables aduaneros debidamente autorizados al día.",
                "Conciliación de bultos ingresados, retirados y saldos en custodia al corte de mes."
            ],
            "documentos": [
                "Archivo electrónico estructurado de saldos de existencias (código de producto, DUCA de ingreso, fecha y valor CIF).",
                "Copia de las actas de recepción y comprobantes de despacho definitivo o reexportación."
            ],
            "pasos": [
                "Genera el reporte de inventario físico y contable al cierre del período mensual en tu sistema de control de bodegas.",
                "Carga el archivo de existencias afianzadas en el módulo correspondiente de la Agencia Virtual o plataforma aduanera.",
                "El sistema aduanero ejecuta el cruce automático entre los retiros autorizados y los saldos declarados.",
                "Recibe el acuse digital de transmisión de saldos afianzados sin discrepancias."
            ],
            "resultadoObtenido": "Acuse de recibo electrónico que valida la consistencia de inventarios afianzados ante la autoridad aduanera.",
            "tiempoEstimado": "Transmisión en línea inmediata",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No presentar los reportes mensuales de existencias dentro de los primeros 10 días de cada mes amerita suspensión temporal de ingresos a bodega y auditoría física inmediata.",
            "normativa": "RECAUCA Artículo 117; Procedimiento PR-IAD/DNO-ADU-AYR-50."
        },
        "SAT-GES-0453": {
            "nombreActual": "Registrar actas de recepción y control de descarga en depósitos (DAT)",
            "descripcion": "Registra en el sistema aduanero la recepción física de contenedores y carga suelta ingresada al depósito temporal, reportando sobrantes o faltantes. Formaliza la asunción de custodia fiscal por parte del operador del recinto aduanero.",
            "requisitos": [
                "Contar con autorización de Depósito Aduanero Temporal (DAT) activo.",
                "Haber concluido la descarga física del medio de transporte dentro del recinto.",
                "Tener a la vista la declaración de tránsito interno (DUCA-T) o manifiesto de carga correspondiente."
            ],
            "documentos": [
                "Acta de recepción física de mercancías debidamente firmada por el custodio y el piloto de transporte.",
                "Reporte de inconsistencias, roturas o discrepancias de sellos y precintos aduaneros.",
                "Declaración de tránsito interno asociada."
            ],
            "pasos": [
                "Inspecciona el contenedor al ingresar al recinto y verifica la integridad del precinto o marchamo electrónico.",
                "Procede a la descarga física y coteja la cantidad de bultos y marcas contra el manifiesto de carga.",
                "Digita en el sistema aduanero el Acta de Recepción DAT detallando bultos efectivamente recibidos y estado de la carga.",
                "Si existen discrepancias, emite de inmediato la nota de tarja o inconformidad para conocimiento de la aduana."
            ],
            "resultadoObtenido": "Acta de recepción aduanera registrada electrónicamente que finaliza el tránsito terrestre y abre el plazo de depósito temporal.",
            "tiempoEstimado": "Menos de 2 horas tras culminar la descarga",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Omitir el reporte de bultos sobrantes o faltantes dentro de las 24 horas siguientes a la descarga traslada al depósito la presunción de responsabilidad por contrabando aduanero.",
            "normativa": "RECAUCA Artículos 254 al 263; Procedimiento de Despacho de Mercancías PR-IAD/DNO-DE-01."
        },
        "SAT-GES-0446": {
            "nombreActual": "Registrar seguro de caución y pólizas de garantía operativa de depósito",
            "descripcion": "Entrega y registra formalmente las pólizas de seguro de caución requeridas para responder por los tributos de mercancías bajo custodia en depósitos aduaneros. Garantiza la solvencia patrimonial del recinto ante posibles pérdidas, siniestros o faltantes.",
            "requisitos": [
                "Resolución administrativa de habilitación o renovación del depósito aduanero expedida por la SAT.",
                "Póliza original de fianza o seguro de caución emitida a favor de la Superintendencia de Administración Tributaria.",
                "Tener solvencia fiscal y registros de personería jurídica actualizados."
            ],
            "documentos": [
                "Póliza original de seguro de caución y dos fotocopias legibles.",
                "Memorial de entrega de garantía operativa suscrito por el representante legal del depósito.",
                "Copia de nombramiento vigente debidamente razonado por el Registro Mercantil."
            ],
            "pasos": [
                "Preséntate a la Unidad de Administración de Auxiliares de la Función Pública Aduanera (Torre SAT, nivel 3).",
                "Entrega la póliza original del seguro de caución para su registro en el sistema de garantías aduaneras.",
                "El operador revisa las cláusulas de indemnización y la vigencia del contrato de fianza.",
                "Recibe la copia sellada de aceptación de la garantía y la actualización de cupo en la plataforma aduanera."
            ],
            "resultadoObtenido": "Comprobante sellado de registro de garantía operativa que mantiene plenamente habilitado el depósito aduanero.",
            "tiempoEstimado": "El mismo día hábil",
            "costo": "Gratuito ante SAT (pago de prima a la aseguradora privada)",
            "advertencia": "Si la fianza no se renueva antes de su vencimiento, la SAT suspenderá inmediatamente el código de depósito y bloqueará el ingreso de nuevos contenedores.",
            "normativa": "CAUCA Artículo 21; RECAUCA Artículos 52 al 58 y 115."
        },
        "SAT-GES-0702": {
            "nombreActual": "Registrar seguro de caución y pólizas de garantía operativa en depósitos temporales",
            "descripcion": "Registra y formaliza ante la Intendencia de Aduanas la póliza de fianza operativa anual para recintos de depósito aduanero temporal (DAT). Resguarda el cumplimiento tributario sobre las mercancías en tránsito y resguardo primario.",
            "requisitos": [
                "Resolución de habilitación como Depósito Aduanero Temporal (DAT) emitida por la autoridad aduanera.",
                "Póliza original de seguro de caución con endoso formal a favor de la SAT.",
                "Solvencia fiscal vigente tanto de la empresa concesionaria como del representante legal."
            ],
            "documentos": [
                "Póliza original de fianza de seguro de caución expedida por aseguradora autorizada en Guatemala.",
                "Memorial de entrega firmado por el representante legal.",
                "Constancia de solvencia fiscal descargada de la Agencia Virtual."
            ],
            "pasos": [
                "Entrega la póliza original y sus copias en la Unidad de Administración de Auxiliares de la SAT (Torre SAT, zona 9).",
                "El personal técnico verifica el monto garantizado y la conformidad de las condiciones generales de la fianza.",
                "Obtén la boleta con sello oficial de recepción de la garantía aduanera.",
                "Verifica que el estado de vigencia de la fianza se refleje como 'Activo' en el padrón de depósitos aduaneros."
            ],
            "resultadoObtenido": "Sello oficial de recepción y habilitación operativa anual para operar el depósito temporal.",
            "tiempoEstimado": "El mismo día hábil",
            "costo": "Gratuito ante SAT (prima contractual a cargo del operador)",
            "advertencia": "Operar con póliza vencida acarrea la clausura temporal inmediata del recinto aduanero y la suspensión de recepción de mercancías.",
            "normativa": "RECAUCA Artículos 114 y 115; Procedimiento PR-IAD/DNO-ADU-AYR-50."
        },
        "SAT-GES-0704": {
            "nombreActual": "Renovar habilitación anual de depósito aduanero temporal (DAT)",
            "descripcion": "Solicita ante la Intendencia de Aduanas la prórroga anual de operación y refrendo de fianza para depósitos aduaneros temporales. Asegura la continuidad de la recepción de carga en puertos, aeropuertos y aduanas terrestres.",
            "requisitos": [
                "Contar con solvencia fiscal vigente emitida por la SAT.",
                "Presentar prórroga o renovación del seguro de caución a favor de la SAT por el plazo normado.",
                "Mantener activas y en óptimo funcionamiento las cámaras de CCTV con transmisión hacia el Centro de Monitoreo SAT.",
                "No registrar multas tributarias ni sanciones de cierre pendientes de cumplimiento."
            ],
            "documentos": [
                "Póliza de seguro de caución renovada en original y copias simples.",
                "Formulario de solicitud de renovación de depósito suscrito por el representante legal.",
                "Informe técnico del sistema de videovigilancia y certificación de enlaces de telecomunicaciones."
            ],
            "pasos": [
                "Ingresa la solicitud de renovación con al menos 30 días de anticipación a la fecha de expiración.",
                "Entrega el expediente en la Unidad de Administración de Auxiliares en el Edificio Torre SAT.",
                "Facilita la inspección periódica de verificación de instalaciones por los auditores de aduanas.",
                "Recibe la resolución administrativa que prorroga la habilitación por un nuevo período anual."
            ],
            "resultadoObtenido": "Resolución de intendencia de aduanas que extiende la vigencia de operaciones del depósito temporal.",
            "tiempoEstimado": "15 a 20 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No presentar la renovación en tiempo provocará que el sistema informático rechace el direccionamiento de manifiestos y contenedores hacia el depósito.",
            "normativa": "RECAUCA Artículos 86 y 116; Manual DG-IAD-DNO-AYR-50."
        },
        "SAT-GES-0694": {
            "nombreActual": "Renovar operaciones anuales de almacén fiscal y depósito aduanero",
            "descripcion": "Gestiona la renovación anual de la autorización de funcionamiento y prórroga de fianza para depósitos aduaneros y almacenes generales de depósito. Habilita la continuidad en la recepción de mercancías bajo régimen suspensivo de tributos.",
            "requisitos": [
                "Solvencia fiscal vigente de la persona jurídica concesionaria del depósito.",
                "Póliza original de fianza de seguro de caución renovada a favor de la SAT.",
                "Dictamen favorable de cumplimiento de medidas de seguridad y control de inventarios.",
                "Estar al día en la transmisión de los informes mensuales de existencias afianzadas."
            ],
            "documentos": [
                "Póliza original del seguro de caución renovado.",
                "Memorial de solicitud de renovación dirigido al Intendente de Aduanas.",
                "Certificación contable de conciliación de inventarios y títulos de crédito emitidos."
            ],
            "pasos": [
                "Presenta el memorial de renovación en la Unidad de Administración de Auxiliares de la Función Pública Aduanera.",
                "Entrega la póliza del seguro de caución debidamente endosada a favor de la SAT.",
                "Obtén la contraseña de recepción y el comprobante sellado de entrega de fianza.",
                "Recibe la resolución formal de prórroga y confirmación en el padrón nacional de auxiliares aduaneros."
            ],
            "resultadoObtenido": "Resolución de prórroga anual de autorización como depósito aduanero y actualización en los sistemas aduaneros.",
            "tiempoEstimado": "15 a 25 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "El vencimiento de la habilitación sin haber gestionado la renovación impide la emisión de nuevos certificados de depósito y bonos de prenda.",
            "normativa": "RECAUCA Artículo 86; Ley de Almacenes Generales de Depósito Decreto 1236."
        },
        "SAT-GES-0449": {
            "nombreActual": "Obtener solvencia fiscal para gestiones de almacén fiscal",
            "descripcion": "Genera en línea el certificado que acredita el cabal cumplimiento tributario y la ausencia de omisos de la empresa titular del depósito aduanero. Constituye requisito mandatorio para toda gestión de acreditación, renovación y fianza ante la SAT.",
            "requisitos": [
                "Acceso a la Agencia Virtual SAT con usuario y contraseña del titular o representante legal.",
                "Tener todas las declaraciones tributarias de IVA, ISR y retenciones debidamente presentadas y pagadas.",
                "No tener requerimientos firmes de pago ni adeudos en cobranza económico coactiva.",
                "Datos del RTU ratificados en el año en curso."
            ],
            "documentos": [
                "No requiere documentos físicos; se genera electrónicamente con firma y código QR de validación."
            ],
            "pasos": [
                "Inicia sesión en la Agencia Virtual con tu NIT institucional.",
                "Dirígete al apartado 'Servicios Tributarios' y pulsa sobre 'Solvencia Fiscal'.",
                "El sistema efectúa la verificación automatizada de tu comportamiento tributario.",
                "Descarga la constancia en formato PDF con verificación digital incorporada."
            ],
            "resultadoObtenido": "Constancia de Solvencia Fiscal válida por el plazo normado para trámites ante la Intendencia de Aduanas.",
            "tiempoEstimado": "Inmediato (generación en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Cualquier declaración pendiente de presentación, aun sin impuesto a pagar, bloqueará de inmediato la emisión del certificado de solvencia.",
            "normativa": "Código Tributario Artículo 57 'A'; Acuerdo de Directorio SAT 07-2007."
        },
        "SAT-GES-0705": {
            "nombreActual": "Obtener solvencia fiscal para renovación de depósito aduanero temporal",
            "descripcion": "Genera de manera inmediata en la Agencia Virtual la solvencia tributaria requerida para la prórroga anual de recintos temporales de carga. Permite comprobar la ausencia de deudas fiscales firmes ante el servicio aduanero nacional.",
            "requisitos": [
                "Usuario y clave de acceso a la Agencia Virtual de la SAT.",
                "Estar al corriente en el pago de tributos internos y aranceles aduaneros.",
                "Ratificación de datos del RTU vigente en el ejercicio fiscal actual."
            ],
            "documentos": [
                "Constancia digital en formato PDF con firma electrónica y código QR."
            ],
            "pasos": [
                "Accede a la Agencia Virtual de la SAT.",
                "Ingresa al módulo de 'Solvencia Fiscal' dentro de las opciones tributarias.",
                "Confirma la consulta de estado tributario automatizada.",
                "Guarda e imprime el certificado emitido para incorporarlo al expediente de renovación de auxiliar."
            ],
            "resultadoObtenido": "Certificado de Solvencia Fiscal con validación electrónica institucional.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Verifica que tanto la empresa titular como su representante legal cuenten con solvencia vigente para evitar prevenciones administrativas.",
            "normativa": "Código Tributario Artículo 57 'A'; RECAUCA Artículo 75."
        },
        "SAT-GES-0456": {
            "nombreActual": "Consultar admisión temporal y prórrogas de contenedores terrestres",
            "descripcion": "Consulta en tiempo real el estatus de ingreso, vigencia y prórrogas otorgadas a contenedores extranjeros bajo régimen de admisión temporal. Permite a los recintos aduaneros y transportistas verificar los días de estadía autorizados antes de programar su salida.",
            "requisitos": [
                "Número de contenedor de 11 dígitos alfanuméricos (sigla del propietario, número de serie y dígito verificador).",
                "Conexión a internet para consultar la herramienta informática del portal aduanero SAT."
            ],
            "documentos": [
                "Formulario de Admisión Temporal de Equipo de Carga (ATC) SAT-8349 correspondiente."
            ],
            "pasos": [
                "Ingresa a la sección de 'Consultas Aduaneras' en el Portal SAT.",
                "Selecciona 'Admisión Temporal de Contenedores Terrestres (ATC)'.",
                "Digita la sigla y número del contenedor para consultar su fecha de ingreso y plazo límite de permanencia.",
                "Verifica si la unidad registra prórrogas autorizadas o advertencias de vencimiento."
            ],
            "resultadoObtenido": "Pantalla informativa con el historial de movimientos, aduana de entrada y vigencia legal del contenedor en el país.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Egresar un contenedor con el plazo de admisión temporal vencido sin prórroga autorizada genera sanciones pecuniarias al transportista y retención en aduana.",
            "normativa": "Procedimiento PR-IAD/DNO-CA-03; RECAUCA Artículos 141 al 149."
        },
        "SAT-GES-0455": {
            "nombreActual": "Consultar monitoreo de disponibilidad de sistemas informáticos aduaneros",
            "descripcion": "Verifica en línea el estado de operatividad y disponibilidad de los servidores de transmisión electrónica de la Intendencia de Aduanas. Permite comprobar la vigencia de enlaces de transmisión de DUCAs, manifiestos y selectividad automatizada.",
            "requisitos": [
                "Navegador web con acceso a internet.",
                "Interés en verificar la continuidad de los servicios de aduana digital y transmisión EDI/Web Services."
            ],
            "documentos": [
                "No requiere documentos; es una herramienta pública de monitoreo tecnológico institucional."
            ],
            "pasos": [
                "Accede al panel de monitoreo de sistemas informáticos en el portal de Aduanas de la SAT.",
                "Verifica el estatus en verde (operativo), amarillo (intermitencia) o rojo (mantenimiento programado) de cada servicio.",
                "Revisa los comunicados oficiales sobre ventanas de mantenimiento programadas en servidores centrales.",
                "Activa los planes de contingencia aduanera normados en caso de interrupción fortuita prolongada."
            ],
            "resultadoObtenido": "Panel de control con el estatus técnico y porcentaje de disponibilidad de los sistemas aduaneros en tiempo real.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Durante interrupciones no programadas de sistemas, las aduanas aplican el procedimiento de contingencia autorizado sin paralizar las operaciones de comercio exterior.",
            "normativa": "Plan de Contingencia de los Sistemas Informáticos Aduaneros de la Intendencia de Aduanas; RECAUCA Artículo 72."
        },
        "SAT-GES-0458": {
            "nombreActual": "Consultar tarifario oficial de cobro por permanencia en el país",
            "descripcion": "Consulta las tarifas oficiales normadas para el almacenaje y permanencia de vehículos y mercancías en recintos bajo control directo de la SAT. Permite a los usuarios calcular los costos asociados a retenciones o demoras en el despacho aduanero.",
            "requisitos": [
                "Acceso a internet para consultar el tarifario institucional en el Portal SAT.",
                "Conocer el tipo de bien (vehículo liviano, pesado, contenedor o carga suelta) y el período de estadía."
            ],
            "documentos": [
                "No requiere documentación; es una tabla oficial de tarifas públicas aplicables."
            ],
            "pasos": [
                "Ingresa al módulo del Sistema de Cobro por Permanencia en la sección de consultas del portal aduanero.",
                "Consulta la tabla de cobro diario según el tipo de recinto (aduana fronteriza, puerto o predio fiscal).",
                "Aplica los días de gracia iniciales libres de cobro de conformidad con el reglamento vigente.",
                "Calcula el importe acumulado a cancelar para la emisión de la boleta de pago respectiva."
            ],
            "resultadoObtenido": "Detalle normado de tarifas por metro cuadrado o tipo de unidad para el servicio de permanencia aduanera.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las tarifas de permanencia se acumulan diariamente; demorar el retiro de mercancías liberadas incrementa los costos de almacenaje fiscal.",
            "normativa": "Acuerdo de Directorio SAT 07-2007; Ley Orgánica de la SAT Artículo 3."
        },
        "SAT-GES-0441": {
            "nombreActual": "Consultar facilidades de pago y convenios para deudas aduaneras",
            "descripcion": "Consulta el saldo, cuotas pendientes y fechas de vencimiento de convenios de pago formalizados por ajustes tributarios en aduanas. Permite dar seguimiento oportuno a los abonos para mantener vigente la suspensión de cobros judiciales.",
            "requisitos": [
                "Número de resolución o número de convenio de pago suscrito con la SAT.",
                "Número de Identificación Tributaria (NIT) del deudor o persona jurídica responsable."
            ],
            "documentos": [
                "Convenio de pago formalizado ante la Intendencia de Aduanas o Asuntos Jurídicos de la SAT.",
                "Comprobantes de pago de las cuotas mensuales amortizadas en Declaraguate."
            ],
            "pasos": [
                "Ingresa a la herramienta 'Consulta de Movimiento de Convenio' en el Portal SAT.",
                "Digita el NIT del contribuyente y el número correlativo del convenio de pago otorgado.",
                "Visualiza la tabla de amortización, las cuotas canceladas y las fechas límites de los siguientes pagos.",
                "Genera en Declaraguate la boleta SAT-8008 correspondiente a la cuota mensual para pagarla en línea."
            ],
            "resultadoObtenido": "Estado de cuenta actualizado del convenio de pago con detalle de capital e intereses cancelados.",
            "tiempoEstimado": "Inmediato (consulta interactiva)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "El atraso en el pago de dos o más cuotas consecutivas provoca la anulación automática del convenio y el cobro ejecutivo judicial inmediato del saldo total con multas.",
            "normativa": "Código Tributario Artículo 40; Código Aduanero Uniforme Centroamericano Artículo 60."
        },
        "SAT-GES-0442": {
            "nombreActual": "Consultar retención y liberación de mercancías en aduanas",
            "descripcion": "Verifica en línea si un contenedor o cargamento aduanero tiene medidas cautelares de retención vigentes o si ya cuenta con pase de salida autorizado. Facilita la coordinación de retiro de bultos en muelles y recintos fiscales.",
            "requisitos": [
                "Número de Declaración Única Centroamericana (DUCA) o número de contenedor.",
                "Conexión a internet para consultar el sistema aduanero institucional."
            ],
            "documentos": [
                "DUCA pagada y validada en el sistema informático aduanero.",
                "Documento de transporte correspondiente (Bill of Lading o Carta de Porte)."
            ],
            "pasos": [
                "Accede a la sección de 'Consultas Aduaneras' > 'Retención y Liberación' en el Portal SAT.",
                "Ingresa el número de declaración aduanera o el número de contenedor de 11 dígitos.",
                "Verifica el estatus: 'Retenido' (con especificación de la unidad responsable) o 'Liberado' (listo para retiro).",
                "Si existe retención, acude a la unidad aduanera requirente para solventar la observación o presentar descargos."
            ],
            "resultadoObtenido": "Pantalla oficial con el estado de liberación aduanera y código de autorización de salida del recinto.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Intentar retirar del recinto una mercancía que figure como 'Retenida' en el sistema constituye delito flagrante de contrabando aduanero.",
            "normativa": "RECAUCA Artículos 341 al 345 (Levante de las Mercancías); Ley Nacional de Aduanas Decreto 14-2013."
        },
        "SAT-GES-0443": {
            "nombreActual": "Consultar legislación sobre almacenes generales de depósito y aduanas",
            "descripcion": "Accede al marco normativo aplicable al funcionamiento, garantías y fiscalización de almacenes generales de depósito en Guatemala. Permite consultar el Decreto 1236 del Congreso y las disposiciones especiales del RECAUCA en materia de almacenamiento afianzado.",
            "requisitos": [
                "Dispositivo con acceso a internet para descargar leyes y reglamentos aduaneros.",
                "Interés en la regulación jurídica del depósito aduanero y emisión de títulos de crédito."
            ],
            "documentos": [
                "Textos completos del Decreto 1236, CAUCA y RECAUCA disponibles en la biblioteca virtual SAT."
            ],
            "pasos": [
                "Ingresa a la sección 'Biblioteca en Línea SAT' > 'Legislación Aduanera'.",
                "Localiza la normativa de Almacenes Generales de Depósito y reglamentos conexos.",
                "Descarga el documento en PDF con las reformas legales incorporadas.",
                "Utiliza los textos legales oficiales para fundamentar operaciones y defender derechos patrimoniales ante la administración."
            ],
            "resultadoObtenido": "Compilación normativa oficial y vigente sobre el régimen de almacenamiento fiscal.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Verifica siempre que la normativa consultada corresponda a la versión consolidada con sus últimas reformas publicadas en el Diario Oficial.",
            "normativa": "Decreto 1236 del Congreso de la República (Ley de Almacenes Generales de Depósito); CAUCA Artículo 19."
        },
        "SAT-GES-0454": {
            "nombreActual": "Consultar disposiciones del RECAUCA sobre depósitos aduaneros",
            "descripcion": "Consulta las obligaciones operativas, responsabilidades sobre tributos y requerimientos de infraestructura fijados por el RECAUCA para los recintos fiscales. Garantiza que los almacenes cumplan con los estándares técnicos centroamericanos exigidos por el servicio aduanero.",
            "requisitos": [
                "Conexión a internet para consultar la biblioteca normativa de la SAT.",
                "Conocimiento del articulado regional sobre depósitos de aduana (Artículos 111 al 121 del RECAUCA)."
            ],
            "documentos": [
                "Texto íntegro del Reglamento del Código Aduanero Uniforme Centroamericano (RECAUCA)."
            ],
            "pasos": [
                "Accede a la Biblioteca Virtual de la SAT en el apartado de Legislación Aduanera.",
                "Abre el texto del RECAUCA y dirígete al Capítulo III del Título II (Depósitos Aduaneros).",
                "Revisa las obligaciones sobre control de bultos, transmisión de inventarios, garantías y custodia de mercancías.",
                "Aplica los estándares técnicos en tus manuales internos de operación de bodegas afianzadas."
            ],
            "resultadoObtenido": "Acceso libre a los estándares normativos regionales que rigen la operación de depósitos aduaneros.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "El incumplimiento de las obligaciones fijadas en el Artículo 117 del RECAUCA amerita sanciones económicas y suspensión de la autorización de depósito.",
            "normativa": "Reglamento del Código Aduanero Uniforme Centroamericano (RECAUCA) Artículos 111 al 121."
        },
        "SAT-GES-0444": {
            "nombreActual": "Consultar manuales de procedimientos para depósitos aduaneros",
            "descripcion": "Accede a las guías oficiales y manuales procedimentales autorizados por la SAT para la operación de depósitos aduaneros temporales y almacenes fiscales. Facilita la estandarización operativa en la recepción, custodia y despacho de mercancías.",
            "requisitos": [
                "Navegador de internet con soporte para visualización de archivos PDF.",
                "Identificar el procedimiento aduanero de interés (recepción de carga, custodia afianzada o subastas)."
            ],
            "documentos": [
                "Manual DG-IAD-DNO-AYR-50 (Manual Renovación Depósito Aduanero y otros usuarios).",
                "Instructivos operativos vigentes de la Intendencia de Aduanas."
            ],
            "pasos": [
                "Ingresa a la sección de Procedimientos de la Intendencia de Aduanas en el Portal SAT.",
                "Selecciona el apartado de 'Auxiliares de la Función Pública Aduanera' > 'Depósitos'.",
                "Descarga los instructivos y manuales vigentes autorizados por resolución de superintendencia.",
                "Implementa las secuencias de pasos normadas en los sistemas de control de bodegas."
            ],
            "resultadoObtenido": "Manuales y guías oficiales de operación autorizados por la Superintendencia de Administración Tributaria.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las operaciones de depósito deben ajustarse estrictamente a las versiones vigentes de los manuales aduaneros para evitar sanciones administrativas.",
            "normativa": "Ley Orgánica de la SAT Artículo 3 literal h); RECAUCA Artículo 112."
        },
        "SAT-GES-0700": {
            "nombreActual": "Consultar guías operativas e instructivos para depósitos temporales (DAT)",
            "descripcion": "Consulta las directrices e instructivos específicos emitidos por la SAT para el manejo de recintos aduaneros temporales en puertos y fronteras. Permite conocer los requisitos técnicos de balanzas, garitas y sistemas informáticos exigidos a los concesionarios.",
            "requisitos": [
                "Acceso a internet para ingresar al repositorio de instructivos aduaneros del Portal SAT.",
                "Interés en la normativa operativa y de seguridad para recintos de depósito temporal."
            ],
            "documentos": [
                "Directrices técnicas de habilitación e instructivos de operación DAT.",
                "Normas de control de pesaje y trazabilidad de contenedores en recintos portuarios."
            ],
            "pasos": [
                "Accede a la sección de directrices técnicas de la Intendencia de Aduanas en el Portal SAT.",
                "Descarga la guía operativa correspondiente a depósitos aduaneros temporales.",
                "Verifica los requerimientos de enlace informático, lectores de código de barras y certificación de pesaje.",
                "Alinea las instalaciones a los requerimientos de la autoridad aduanera para mantener activa la concesión."
            ],
            "resultadoObtenido": "Documentación técnica oficial que rige la concesión y operación de depósitos temporales en Guatemala.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Operar instrumentos de pesaje (básculas) sin calibración certificada por OGM constituye infracción sujeta a suspensión de operaciones.",
            "normativa": "RECAUCA Artículos 111 al 116; Directrices Técnicas de la Intendencia de Aduanas."
        },
        "SAT-GES-0701": {
            "nombreActual": "Consultar proyectos de modernización aduanera (MIAD) para recintos",
            "descripcion": "Conoce los estándares tecnológicos del Programa de Modernización Integral Aduanera (MIAD) aplicables a depósitos aduaneros y recintos portuarios. Brinda las especificaciones de videovigilancia CCTV, reconocimiento óptico de caracteres (OCR) y control perimetral.",
            "requisitos": [
                "Dispositivo con conexión a internet para descargar guías técnicas del programa MIAD.",
                "Interés en la integración tecnológica y automatización de recintos fiscales aduaneros."
            ],
            "documentos": [
                "Documento marco del Programa de Modernización Integral Aduanera (MIAD).",
                "Especificaciones de cámaras de videovigilancia y servidores de grabación homologados ante SAT."
            ],
            "pasos": [
                "Ingresa a la sección del Programa MIAD en el portal oficial de la SAT.",
                "Revisa los componentes de infraestructura, tecnología y procesos aduaneros automatizados.",
                "Descarga los requerimientos para la integración de cámaras de circuito cerrado con el Centro de Monitoreo Central.",
                "Aplica los estándares técnicos en los proyectos de modernización de tu depósito aduanero."
            ],
            "resultadoObtenido": "Especificaciones tecnológicas oficiales para la homologación de recintos aduaneros modernos.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Los recintos aduaneros que no implementen los estándares de videovigilancia MIAD en los plazos previstos no podrán renovar su autorización operativa.",
            "normativa": "Acuerdo de Directorio SAT 07-2019; Estrategia Nacional de Modernización Aduanera."
        },
        "SAT-GES-0445": {
            "nombreActual": "Consultar componentes de modernización aduanera para almacenes fiscales",
            "descripcion": "Accede a las especificaciones y manuales del Programa MIAD orientados a la automatización de la trazabilidad en almacenes generales de depósito. Facilita la interconexión de sistemas de inventario y transmisión de datos en tiempo real hacia la SAT.",
            "requisitos": [
                "Conexión a internet para consultar los manuales de integración informática aduanera.",
                "Interés en el cumplimiento de los estándares de aduana digital y control no intrusivo."
            ],
            "documentos": [
                "Guía de especificaciones técnicas para interconexión de inventarios de almacenes fiscales.",
                "Manual del Sistema de Gestión Aduanera para auxiliares de la función pública."
            ],
            "pasos": [
                "Accede a la pestaña de modernización aduanera en el Portal SAT.",
                "Consulta los estándares del componente de procesos y tecnologías de almacenamiento afianzado.",
                "Verifica los protocolos de intercambio seguro de datos para reportes de inventarios afianzados.",
                "Implementa las interfaces informáticas necesarias para el enlace automatizado con la plataforma aduanera."
            ],
            "resultadoObtenido": "Lineamientos técnicos para la digitalización e integración informática de almacenes fiscales ante SAT.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La interconexión informática es obligatoria para garantizar la trazabilidad permanente de mercancías afianzadas bajo control de la administración.",
            "normativa": "Ley Orgánica de la SAT Artículo 3; RECAUCA Artículo 117."
        },
        "SAT-GES-0452": {
            "nombreActual": "Consultar rampa de inspección, revisores y retenciones aduaneras",
            "descripcion": "Consulta en línea la asignación de andenes, el inspector aduanero y las posibles medidas de retención aplicadas a cargamentos en depósitos aduaneros. Facilita la coordinación de rampas y el flujo ágil de mercancías dentro del recinto fiscal.",
            "requisitos": [
                "Número de Declaración Única Centroamericana (DUCA) o número de contenedor.",
                "Acceso a internet para consultar el portal de Aduanas de la SAT."
            ],
            "documentos": [
                "Declaración de mercancías DUCA pagada y validada en el sistema.",
                "Acta de recepción DAT o documento de transporte asociado."
            ],
            "pasos": [
                "Ingresa al módulo de consultas aduaneras en el Portal SAT.",
                "Introduce el número de la declaración aduanera o el número de contenedor de 11 dígitos.",
                "Verifica la rampa asignada, el nombre del técnico de aduanas y si existe orden de retención preventiva.",
                "Coordina el posicionamiento de la unidad en la rampa indicada para la inspección física."
            ],
            "resultadoObtenido": "Pantalla oficial con el andén de rampa asignado y estatus de reconocimiento aduanero.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Si la mercancía presenta orden de retención emitida por una unidad de fiscalización, no podrá ser posicionada para levante hasta que la medida sea levantada formalmente.",
            "normativa": "RECAUCA Artículos 338 y 339; Procedimiento PR-IAD/DNO-DE-01."
        }
    }

    # Projections / shared items in Depósitos Aduaneros
    # SAT-GES-0695, 0688 -> Componente ActiveX / Carné (map to same clean text)
    # SAT-GES-0689, 0696 -> Capacitaciones aduaneras
    # SAT-GES-0691, 0698 -> Preguntas frecuentes
    # SAT-GES-0692, 0699 -> Procedimientos administrativos y recursos
    # SAT-GES-0697, 0690 -> Declaración de mercancías (DUCA y aduana sin papeles)
    # SAT-GES-0703, 0693 -> Expedientes de gestión aduanera
    shared_mappings = {
        "SAT-GES-0695": {
            "nombreActual": "Solicitar carné y habilitación de firma electrónica para auxiliar de depósito",
            "descripcion": "Gestiona la emisión del carné institucional y la vinculación de firma electrónica para los personeros autorizados del depósito aduanero temporal. Habilita el acceso físico a zonas primarias y la transmisión de actas de recepción de carga en SAQB'E.",
            "requisitos": [
                "Resolución administrativa de acreditación del depósito aduanero o nombramiento de personal.",
                "Solvencia fiscal y datos del RTU actualizados del solicitante.",
                "Certificado de firma electrónica avanzada emitido por una entidad de certificación acreditada."
            ],
            "documentos": [
                "Documento Personal de Identificación (DPI) en original y copia.",
                "Comprobante de pago de tarifa de emisión de carné oficial en Declaraguate (formulario SAT-8008).",
                "Copia de nombramiento o contrato laboral con el depósito aduanero autorizado."
            ],
            "pasos": [
                "Genera y paga la boleta en Declaraguate por concepto de emisión de carné de auxiliar aduanero.",
                "Preséntate en la Unidad de Administración de Auxiliares de la SAT (Torre SAT, nivel 3) para la toma de fotografía y biometría.",
                "Recibe el carné oficial con chip de proximidad institucional.",
                "Instala el componente ActiveX AresPKI y efectúa la adhesión del certificado digital en SAQB'E."
            ],
            "resultadoObtenido": "Carné físico oficial y firma electrónica activa para el despacho aduanero y recepción de bultos.",
            "tiempoEstimado": "1 a 3 días hábiles",
            "costo": "Q75.00 (emisión de carné oficial)",
            "advertencia": "Portar el carné visible es obligatorio para ingresar a recintos aduaneros y zonas de control fiscal.",
            "normativa": "RECAUCA Artículos 83 y 112; Manual DG-IAD/DNO-ADU-AYR-24."
        },
        "SAT-GES-0688": {
            "nombreActual": "Solicitar carné y habilitación de firma electrónica para personal de almacén fiscal",
            "descripcion": "Tramita la credencial oficial y habilitación informática para los operadores de almacenes generales de depósito. Garantiza la identificación ante los módulos de inspección aduanera y la firma digital de operaciones afianzadas.",
            "requisitos": [
                "Acreditación laboral emitida por el representante legal del almacén fiscal registrado en SAT.",
                "Solvencia fiscal vigente y datos ratificados en el RTU.",
                "Certificado digital de firma electrónica vigente para transmisiones en línea."
            ],
            "documentos": [
                "DPI original y copia legible.",
                "Boleta de pago de carné cancelada en Declaraguate.",
                "Carta de asignación suscrita por la gerencia del almacén fiscal."
            ],
            "pasos": [
                "Paga la boleta correspondiente al carné en banca virtual a través de Declaraguate.",
                "Acude a las oficinas de la Unidad de Auxiliares en Torre SAT para registro fotográfico.",
                "Recibe el carné oficial con hologramas de seguridad.",
                "Valida la activación del usuario y firma en el sistema informático aduanero."
            ],
            "resultadoObtenido": "Carné oficial de auxiliar aduanero y habilitación de firma digital para despachos afianzados.",
            "tiempoEstimado": "1 a 3 días hábiles",
            "costo": "Q75.00",
            "advertencia": "El carné es estrictamente personal e intransferible; prestarlo acarrea sanción disciplinaria y revocatoria de habilitación.",
            "normativa": "RECAUCA Artículos 83 y 112."
        },
        "SAT-GES-0689": {
            "nombreActual": "Inscribirse en capacitaciones sobre almacenamiento fiscal y aduanas",
            "descripcion": "Inscríbete en los talleres formativos dictados por la SAT sobre administración de inventarios afianzados, trazabilidad y regulaciones de recintos aduaneros. Fortalece las capacidades técnicas del personal de almacenes generales de depósito.",
            "requisitos": [
                "Correo electrónico activo personal o corporativo.",
                "Acceso a computadora con internet para la plataforma virtual de aprendizaje.",
                "Laborar en recintos aduaneros, almacenes fiscales o agencias de aduana."
            ],
            "documentos": [
                "Formulario digital de inscripción en el portal de Cultura Tributaria SAT."
            ],
            "pasos": [
                "Ingresa a la sección de capacitaciones de aduanas en el Portal SAT.",
                "Selecciona el curso enfocado en Depósitos Aduaneros y Almacenes Fiscales.",
                "Completa el formulario de inscripción con tus datos y código de auxiliar.",
                "Participa en las sesiones de formación y aprueba las evaluaciones modulares para obtener tu constancia."
            ],
            "resultadoObtenido": "Constancia de acreditación curricular emitida por el Departamento de Cultura Tributaria de la SAT.",
            "tiempoEstimado": "Duración variable (10 a 30 horas académicas)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Es necesario cumplir con el 80% de asistencia y evaluación aprobatoria para descargar el certificado oficial.",
            "normativa": "Ley Orgánica de la SAT Artículo 3 literal h); RECAUCA Artículo 75."
        },
        "SAT-GES-0696": {
            "nombreActual": "Inscribirse en capacitaciones operativas para depósitos temporales (DAT)",
            "descripcion": "Accede a cursos técnicos gratuitos impartidos por la SAT sobre pesaje, circuito cerrado, actas de recepción y control no intrusivo en recintos de depósito temporal. Permite mantener actualizado al personal en los estándares de facilitación y control aduanero.",
            "requisitos": [
                "Personal activo de depósitos aduaneros temporales o concesionarios portuarios.",
                "Dispositivo con acceso a internet para ingresar al aula virtual de la SAT."
            ],
            "documentos": [
                "Registro en línea mediante el formulario de convocatoria institucional."
            ],
            "pasos": [
                "Accede a la cartelera de formación de aduanas en el portal institucional.",
                "Selecciona el programa formativo de operación y normativa para recintos DAT.",
                "Llena tus datos de contacto para recibir el acceso a la plataforma Moodle.",
                "Finaliza el curso y descarga el diploma digital avalado por la Intendencia de Aduanas."
            ],
            "resultadoObtenido": "Certificado de formación aduanera especializada en gestión de recintos temporales.",
            "tiempoEstimado": "Autogestionado en línea",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La capacitación continua del personal de recintos es un criterio evaluado positivamente en las auditorías de cumplimiento OEA y SAT.",
            "normativa": "RECAUCA Artículo 75; Ley Orgánica de la SAT."
        },
        "SAT-GES-0691": {
            "nombreActual": "Consultar preguntas frecuentes sobre almacenamiento aduanero",
            "descripcion": "Resuelve dudas frecuentes sobre plazos de almacenaje, traslados de mercancías, causas de abandono y responsabilidades de custodia en recintos fiscales. Proporciona lineamientos claros en lenguaje directo para la correcta toma de decisiones.",
            "requisitos": [
                "Conexión a internet para consultar la sección de preguntas frecuentes en el portal de la SAT.",
                "Identificar el tema operativo de consulta (depósitos, garantías o inventarios)."
            ],
            "documentos": [
                "No requiere documentos; es una guía de orientación en línea."
            ],
            "pasos": [
                "Ingresa a la sección 'Preguntas Frecuentes' en el portal aduanero SAT.",
                "Navega hacia la categoría de Depósitos y Almacenes Fiscales.",
                "Revisa las respuestas oficiales con sus fundamentos reglamentarios.",
                "Si requieres una consulta personalizada, contacta a la mesa de ayuda de la Intendencia de Aduanas."
            ],
            "resultadoObtenido": "Aclaración técnica inmediata sobre procedimientos y criterios oficiales de depósito aduanero.",
            "tiempoEstimado": "Inmediato (consulta libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las respuestas informativas no sustituyen los dictámenes vinculantes emitidos formalmente por la Intendencia de Aduanas.",
            "normativa": "Código Tributario Artículo 101; RECAUCA Artículo 111."
        },
        "SAT-GES-0698": {
            "nombreActual": "Consultar preguntas frecuentes sobre depósitos temporales (DAT)",
            "descripcion": "Consulta respuestas oficiales sobre delimitación de recintos, tiempos máximos de permanencia temporal, traslados y tarja de bultos en terminales de carga. Permite resolver inquietudes prácticas sin trasladarse a dependencias de aduanas.",
            "requisitos": [
                "Dispositivo con acceso a internet para consultar el repositorio institucional."
            ],
            "documentos": [
                "No requiere documentación física."
            ],
            "pasos": [
                "Accede a la sección de preguntas frecuentes de comercio exterior en el Portal SAT.",
                "Selecciona el tópico de recintos aduaneros y depósitos temporales.",
                "Lee las aclaraciones sobre pesaje, responsabilidades de garita y selectivo en rampa.",
                "Aplica los criterios recomendados para agilizar la entrega de mercancías."
            ],
            "resultadoObtenido": "Orientación operativa inmediata para gestiones en depósitos temporales.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Ante discrepancias operativas en recinto, prevalecen las instrucciones directas del Administrador de la Aduana de jurisdicción.",
            "normativa": "RECAUCA Artículos 111 al 121."
        },
        "SAT-GES-0692": {
            "nombreActual": "Consultar recursos administrativos y defensas para almacenes fiscales",
            "descripcion": "Conoce los procedimientos y plazos legales para interponer recursos de revocatoria contra resoluciones de sanción o ajustes tributarios en almacenes fiscales. Garantiza la defensa técnica y el debido proceso ante la Intendencia de Aduanas.",
            "requisitos": [
                "Notificación formal de resolución administrativa sancionatoria emitida por la SAT.",
                "Estar dentro del plazo de 10 días hábiles posteriores a la notificación para impugnar.",
                "Acreditar representación legal de la empresa almacenadora."
            ],
            "documentos": [
                "Cédula de notificación del acto o resolución impugnada.",
                "Memorial formal de recurso de revocatoria auxiliado por abogado colegiado activo.",
                "Documentación probatoria y balances contables que desvirtúen los cargos formulados."
            ],
            "pasos": [
                "Revisa la cédula de notificación y computa el plazo improrrogable de 10 días hábiles.",
                "Prepara el memorial de agravios con sustento en la legislación aduanera y mercantil.",
                "Presenta el recurso ante la ventanilla de recepción de la Intendencia de Aduanas.",
                "Da seguimiento al expediente hasta la resolución final por el Directorio de la SAT."
            ],
            "resultadoObtenido": "Admisión formal del recurso de revocatoria con suspensión de cobro hasta resolución firme.",
            "tiempoEstimado": "30 a 60 días hábiles",
            "costo": "Gratuito ante SAT (honorarios profesionales privados)",
            "advertencia": "Presentar el recurso fuera de los 10 días hábiles legales provoca la firmeza del acto y habilita la ejecución inmediata de la fianza del depósito.",
            "normativa": "CAUCA Artículo 127; Código Tributario Artículo 154."
        },
        "SAT-GES-0699": {
            "nombreActual": "Consultar recursos administrativos y defensas para depósitos temporales",
            "descripcion": "Conoce las pautas legales para recurrir resoluciones de ajuste, multas por discrepancias de bultos o medidas cautelares en recintos temporales. Permite a los concesionarios defender sus derechos y justificar demoras o roturas de precintos.",
            "requisitos": [
                "Resolución o pliego de cargos aduaneros notificado fehacientemente.",
                "Estar en el plazo perentorio de 10 días hábiles para plantear el recurso de revocatoria.",
                "Personería jurídica de representación de la terminal de carga o DAT."
            ],
            "documentos": [
                "Cédula de notificación de la sanción o ajuste.",
                "Memorial de revocatoria debidamente fundamentado y firmado por abogado.",
                "Copias de actas de recepción, notas de tarja e imágenes de CCTV probatorias."
            ],
            "pasos": [
                "Verifica la fecha de notificación y calcula el plazo legal de impugnación.",
                "Redacta el memorial de revocatoria adjuntando las pruebas fotográficas y registros del sistema.",
                "Ingresa el expediente en la aduana correspondiente o en la Torre SAT.",
                "Monitorea el avance de la pieza administrativa hasta que se emita resolución de segunda instancia."
            ],
            "resultadoObtenido": "Recepción formal de la impugnación y apertura del período probatorio de descargo.",
            "tiempoEstimado": "30 a 60 días hábiles",
            "costo": "Gratuito ante SAT (asesoría legal por cuenta del recurrente)",
            "advertencia": "Las multas aduaneras firmes que no sean recurridas en tiempo conllevan el cobro por vía de apremio y el bloqueo del recinto.",
            "normativa": "Código Tributario Artículo 154; Ley Nacional de Aduanas Decreto 14-2013."
        },
        "SAT-GES-0690": {
            "nombreActual": "Transmitir declaración de mercancías en aduana sin papeles para almacenes",
            "descripcion": "Carga y valida los documentos digitalizados de soporte para el ingreso o salida de mercancías bajo régimen de depósito aduanero en el sistema SAQB'E. Agiliza el levante aduanero eliminando la presentación de expedientes físicos.",
            "requisitos": [
                "Operador del almacén fiscal acreditado con usuario y clave en el sistema aduanero.",
                "Documentos de soporte escaneados en formato PDF de alta resolución y nitidez.",
                "Declaración de mercancías de depósito (régimen 150-DA) validada previamente."
            ],
            "documentos": [
                "Factura comercial o factura de exportación digitalizada.",
                "Documento de transporte electrónico (Bill of Lading, Carta de Porte o Guía Aérea).",
                "Certificado de origen o licencias no arancelarias aplicables."
            ],
            "pasos": [
                "Captura la declaración de depósito en el sistema informático aduanero.",
                "Ingresa al repositorio documental y adjunta cada documento de soporte en formato PDF legible.",
                "Revisa la correspondencia de datos y firma electrónicamente la transmisión.",
                "Envía la declaración y genera el pase de ingreso al almacén fiscal sin papeles físicos."
            ],
            "resultadoObtenido": "Aceptación informática de la declaración de depósito con selectivo asignado sin uso de papel.",
            "tiempoEstimado": "10 a 20 minutos por declaración",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La carga de documentos ilegibles o adulterados paraliza el despacho y amerita inspección física exhaustiva en rampa.",
            "normativa": "Resolución de Superintendencia SAT-DSI-1017-2018; RECAUCA Artículo 321."
        },
        "SAT-GES-0697": {
            "nombreActual": "Transmitir declaración de mercancías en aduana sin papeles para depósitos temporales",
            "descripcion": "Asocia electrónicamente los documentos digitalizados de embarque para autorizar traslados y levantes desde recintos de depósito temporal. Facilita la salida ágil de contenedores hacia destinos definitivos mediante validación en línea.",
            "requisitos": [
                "Usuario y firma electrónica de auxiliar de depósito activo en el portal aduanero.",
                "Documentos de soporte digitalizados en formato PDF según especificaciones técnicas.",
                "Número correlativo de declaración DUCA asociada."
            ],
            "documentos": [
                "Factura comercial y lista de empaque digitalizadas.",
                "Documento de transporte (B/L o Carta de Porte) firmado.",
                "Autorizaciones no arancelarias digitalizadas cuando corresponda."
            ],
            "pasos": [
                "Accede a la plataforma aduanera y selecciona la declaración correspondiente a la carga en depósito.",
                "Carga los archivos PDF en el repositorio digital institucional.",
                "Verifica la coincidencia de bultos, marcas y pesos entre el sistema y los documentos.",
                "Transmite la declaración y habilita la presentación del medio de transporte en garita de salida."
            ],
            "resultadoObtenido": "Recepción digital completa y asignación automática de selectivo aduanero.",
            "tiempoEstimado": "10 a 15 minutos",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Omitir la carga de documentos obligatorios retiene la unidad en semáforo amarillo hasta que se solvente la omisión.",
            "normativa": "Resolución SAT-DSI-1017-2018; RECAUCA Artículo 321."
        },
        "SAT-GES-0693": {
            "nombreActual": "Consultar expedientes de almacenes fiscales en gestión aduanera",
            "descripcion": "Verifica el estado procesal y los avances técnicos de solicitudes de habilitación, modificaciones o descargos ingresados por almacenes de depósito. Brinda información oportuna sobre dictámenes y resoluciones pendientes de emitir por la SAT.",
            "requisitos": [
                "Número de expediente asignado por la ventanilla de recepción aduanera.",
                "Acreditación de personería del auxiliar o representante legal requirente."
            ],
            "documentos": [
                "Contraseña o boleta con número correlativo de expediente aduanero."
            ],
            "pasos": [
                "Ingresa a la sección 'Consulta de Expedientes' en el portal aduanero SAT.",
                "Digita el número de expediente y año correspondiente a la solicitud del almacén fiscal.",
                "Verifica la unidad administrativa donde se ubica el expediente y los últimos oficios generados.",
                "Toma nota de cualquier providencia de requerimiento para subsanarla dentro del plazo legal."
            ],
            "resultadoObtenido": "Detalle cronológico de actuaciones y estado administrativo actual del expediente aduanero.",
            "tiempoEstimado": "Inmediato (consulta interactiva)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Los plazos para responder requerimientos corren a partir de la notificación formal en buzón de Agencia Virtual.",
            "normativa": "Código Tributario Artículo 126; Ley de lo Contencioso Administrativo Artículo 1."
        },
        "SAT-GES-0703": {
            "nombreActual": "Consultar expedientes de depósitos temporales en gestión aduanera",
            "descripcion": "Consulta el avance de dictámenes técnicos, renovaciones de fianza y resoluciones administrativas tramitadas para recintos de depósito temporal. Permite conocer el estatus sin desplazarse a las oficinas centrales de la SAT.",
            "requisitos": [
                "Número de expediente o código de gestión otorgado por recepción de aduanas.",
                "Identificación del operador o apoderado del depósito temporal."
            ],
            "documentos": [
                "Boleta con el número de expediente de la solicitud aduanera."
            ],
            "pasos": [
                "Accede a la herramienta de consulta de expedientes en el Portal SAT.",
                "Introduce el número de expediente y selecciona la unidad de gestión aduanera.",
                "Revisa las actuaciones y la fecha de última providencia emitida.",
                "Descarga o consulta las notificaciones electrónicas asociadas a la gestión."
            ],
            "resultadoObtenido": "Información detallada de la ubicación procesal y avance del expediente de depósito temporal.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No solventar los requerimientos notificados dentro del plazo conferido causa la caducidad del expediente.",
            "normativa": "Código Tributario Artículo 126; Constitución Política Artículo 30."
        }
    }

    # Merge shared mappings into dep_data
    dep_data.update(shared_mappings)

    updated_count = 0
    for item in data:
        tid = item.get('id')
        if tid in dep_data:
            ed = dep_data[tid]
            for k, v in ed.items():
                item[k] = v
            updated_count += 1

    print(f"Enriched {updated_count} Depósitos Aduaneros gestiones.")

    with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    enrich_depositos()
