# -*- coding: utf-8 -*-
"""
Enrichment script for:
1. Operador Económico Autorizado (OEA) (2 gestiones)
2. Maquilas (Decreto 29-89) (12 gestiones)
Adhering to ATO UX Writing standards, Regla 12, and SAT Guatemala regulations.
"""

import json

def enrich_oea_maquilas():
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    enrichment = {
        # -------------------------------------------------------------
        # OPERADOR ECONÓMICO AUTORIZADO (OEA) (2 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0417": {
            "nombreActual": "Solicitar certificación como Operador Económico Autorizado (OEA)",
            "descripcion": "Inicia el proceso de validación y acreditación oficial como operador confiable y seguro en la cadena logística internacional ante la SAT. Otorga despacho preferencial en aduanas, carriles express exclusivos y reducción sustancial de revisiones físicas.",
            "requisitos": [
                "Estar inscrito en el RTU con solvencia fiscal y mínimo tres años continuos de operaciones de comercio exterior.",
                "Disponer de estados financieros auditados por contador público y auditor independiente de los últimos tres ejercicios fiscales.",
                "Cumplir con los estándares mínimos de seguridad física, control de accesos, ciberseguridad y confiabilidad de socios comerciales normados en el Marco SAFE de la OMA.",
                "No registrar sanciones tributarias o aduaneras graves ni procesos penales por defraudación o contrabando."
            ],
            "documentos": [
                "Formulario digital de autoevaluación y solicitud en el Sistema Registro OEA.",
                "Manual de seguridad de la cadena de suministro y matriz de gestión de riesgos.",
                "Estados financieros auditados y certificaciones internacionales de seguridad (ISO 28000 o BASC), en caso de poseerlas."
            ],
            "pasos": [
                "Ingresa al aplicativo OEA Digital en el Portal SAT y completa el cuestionario de autoevaluación de seguridad.",
                "Carga la documentación probatoria, políticas de seguridad y certificaciones en el repositorio digital.",
                "Atiende la auditoría documental y la visita de inspección física realizada por los auditores de la Unidad OEA de la SAT.",
                "Subsanar las recomendaciones de mejora en caso de que se formulen hallazgos durante la visita técnica.",
                "Recibe la resolución formal de autorización y el certificado institucional como Operador Económico Autorizado."
            ],
            "resultadoObtenido": "Certificado oficial de Operador Económico Autorizado (OEA) con vigencia renovable y asignación de ejecutivo de cuenta aduanero.",
            "tiempoEstimado": "60 a 90 días hábiles (incluye auditoría documental y visita técnica)",
            "costo": "Gratuito ante SAT (inversiones de seguridad a cargo de la empresa)",
            "advertencia": "Incurrir en faltas graves de seguridad o perder la solvencia tributaria suspende de inmediato la certificación OEA y sus privilegios de despacho expedito.",
            "normativa": "Resolución de Superintendencia SAT-DSI-358-2019 (Reglamento del Programa OEA); Marco SAFE de la Organización Mundial de Aduanas (OMA)."
        },
        "SAT-GES-0416": {
            "nombreActual": "Consultar directorio y catálogo de beneficios de empresas OEA",
            "descripcion": "Consulta la nómina oficial vigente de empresas guatemaltecas certificadas como Operador Económico Autorizado y los beneficios aplicables a cada eslabón logístico. Permite verificar la confiabilidad de socios comerciales y conocer los acuerdos de reconocimiento mutuo internacionales.",
            "requisitos": [
                "Dispositivo con conexión a internet para consultar el portal institucional de la SAT.",
                "Identificar la razón social, NIT o tipo de actor logístico (importador, exportador, transportista o agente aduanero)."
            ],
            "documentos": [
                "Listado oficial descargable de actores OEA habilitados (actualizado mensualmente).",
                "Catálogo de beneficios interinstitucionales OEA País (SAT, MINGOB, MAGA y MSPAS)."
            ],
            "pasos": [
                "Ingresa a la sección de Operador Económico Autorizado en el Portal SAT.",
                "Selecciona 'Actores OEA Habilitados' para descargar el padrón oficial al último corte mensual.",
                "Explora el catálogo de beneficios para conocer las facilidades operativas en aduanas marítimas, aéreas y terrestres.",
                "Revisa los manuales de aplicación de Arreglos de Reconocimiento Mutuo (ARM) multilaterales con Centroamérica y las Américas."
            ],
            "resultadoObtenido": "Constancia de consulta pública con el estatus de certificación y beneficios aduaneros vigentes.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Solo las empresas con certificado vigente pueden acceder a los carriles preferenciales y despacho expedito en puestos fronterizos y puertos.",
            "normativa": "Convenio Interinstitucional OEA País; Arreglos de Reconocimiento Mutuo de la OMA."
        },

        # -------------------------------------------------------------
        # MAQUILAS (DECRETO 29-89) (12 gestiones)
        # -------------------------------------------------------------
        "SAT-GES-0484": {
            "nombreActual": "Registrar resolución de calificación MINECO para maquila (Decreto 29-89)",
            "descripcion": "Inscribe ante la Intendencia de Aduanas la resolución ministerial emitida por el Ministerio de Economía que califica a la empresa bajo el régimen de maquila. Habilita el goce de los incentivos fiscales de suspensión de aranceles e IVA de importación.",
            "requisitos": [
                "Contar con Resolución Ministerial de Calificación emitida por el MINECO debidamente notificada y ejecutoriada.",
                "Estar inscrito en el RTU con datos ratificados y contar con solvencia fiscal vigente.",
                "Constituir la fianza o seguro de caución correspondiente a favor de la SAT."
            ],
            "documentos": [
                "Copia certificada de la resolución ministerial del Ministerio de Economía (MINECO).",
                "Formulario de solicitud de inscripción de empresa calificada suscrito por el representante legal.",
                "Nombramiento del representante legal inscrito en el Registro Mercantil y copia de DPI."
            ],
            "pasos": [
                "Presenta el memorial de solicitud ante la Unidad de Regímenes Especiales de la SAT (Torre SAT, nivel 3).",
                "Adjunta la resolución original o copia certificada expedida por el MINECO y los datos societarios.",
                "El técnico aduanero registra la calificación en el sistema informático de regímenes especiales.",
                "Recibe el oficio con el código de registro aduanero que autoriza la apertura de operaciones bajo el Decreto 29-89."
            ],
            "resultadoObtenido": "Oficio de registro aduanero y habilitación del régimen de perfeccionamiento activo en los sistemas de la SAT.",
            "tiempoEstimado": "5 a 10 días hábiles",
            "costo": "Gratuito ante SAT (costos de trámite ministerial en MINECO)",
            "advertencia": "Cualquier modificación en el objeto social o domicilio de la planta debe notificarse a la SAT dentro de los 10 días siguientes para evitar la inhabilitación del registro.",
            "normativa": "Ley de Fomento y Desarrollo de la Actividad Exportadora y de Maquila (Decreto 29-89) Artículos 1 al 12."
        },
        "SAT-GES-0478": {
            "nombreActual": "Registrar fianza y seguro de caución para maquilas (Decreto 29-89)",
            "descripcion": "Entrega y formaliza en la Unidad de Regímenes Especiales la póliza de seguro de caución que garantiza los tributos suspendidos por importación temporal de materias primas y maquinaria. Permite despachar embarques sin pagar derechos arancelarios ni IVA de entrada.",
            "requisitos": [
                "Resolución ministerial de calificación del MINECO debidamente registrada en SAT.",
                "Póliza original de fianza o seguro de caución expedida a favor de la SAT por afianzadora autorizada.",
                "Solvencia fiscal vigente de la empresa maquiladora."
            ],
            "documentos": [
                "Póliza original de fianza de seguro de caución y dos copias legibles.",
                "Memorial de entrega de fianza firmado por el representante legal.",
                "Cálculo del monto afianzado conforme al cupo anual de importaciones proyectadas."
            ],
            "pasos": [
                "Preséntate a la Unidad de Regímenes Especiales de Aduanas en el Edificio Torre SAT.",
                "Entrega la póliza original para su verificación de cláusulas de indemnización y respaldo financiero.",
                "El operador valida el registro y asigna el monto caucionado a la cuenta corriente aduanera.",
                "Recibe la copia sellada de aceptación de la garantía aduanera."
            ],
            "resultadoObtenido": "Boleta sellada de recepción de garantía que habilita la liquidación de DUCAs temporales sin pago de tributos.",
            "tiempoEstimado": "El mismo día hábil",
            "costo": "Gratuito ante SAT (pago de prima a la entidad afianzadora)",
            "advertencia": "Si la fianza no se renueva oportunamente antes de su vencimiento anual, el sistema bloqueará la transmisión de nuevas declaraciones de admisión temporal.",
            "normativa": "Decreto 29-89 Artículo 13; CAUCA Artículo 21; RECAUCA Artículos 52 al 58."
        },
        "SAT-GES-0483": {
            "nombreActual": "Habilitar cuenta corriente de insumos y materias primas para maquila",
            "descripcion": "Apertura en el sistema informático aduanero el registro de control de saldos y materias primas autorizadas en la resolución de calificación. Permite debitar insumos en la importación temporal y acreditarlos con las exportaciones de producto terminado.",
            "requisitos": [
                "Resolución de calificación del MINECO registrada y fianza aduanera debidamente aceptada.",
                "Catálogo de materias primas, insumos y coeficientes técnicos de transformación aprobados por MINECO.",
                "Solvencia fiscal vigente y firma electrónica activa."
            ],
            "documentos": [
                "Resolución de calificación con listado de partidas arancelarias de insumos autorizados.",
                "Estudio técnico de coeficientes de rendimiento, mermas y desperdicios aprobado.",
                "Formulario de solicitud de apertura de cuenta corriente aduanera."
            ],
            "pasos": [
                "Ingresa la solicitud de apertura de cuenta corriente en la plataforma electrónica aduanera de la SAT.",
                "Carga el catálogo de insumos y factores de conversión autorizados en la resolución ministerial.",
                "El analista de regímenes especiales valida la consistencia de las partidas y coeficientes técnicos.",
                "Recibe la notificación de apertura de cuenta corriente activa para la transmisión de DUCAs de importación temporal."
            ],
            "resultadoObtenido": "Cuenta corriente aduanera habilitada con asignación de saldo afianzado y catálogo de insumos cargado en sistema.",
            "tiempoEstimado": "3 a 5 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Importar mercancías o materias primas no contempladas en la resolución de calificación constituye infracción aduanera y comiso preventivo.",
            "normativa": "Decreto 29-89 Artículos 14 al 18; RECAUCA Artículo 468."
        },
        "SAT-GES-0479": {
            "nombreActual": "Consultar saldo disponible de fianza para importación temporal",
            "descripcion": "Verifica en tiempo real el monto disponible, consumido y garantizado de la póliza de fianza asignada a la cuenta corriente de maquila. Permite planificar los embarques de materias primas sin riesgo de rebotes por insuficiencia de garantía.",
            "requisitos": [
                "Número de Identificación Tributaria (NIT) de la empresa maquiladora.",
                "Acceso a la Agencia Virtual de la SAT con perfil de usuario de regímenes especiales."
            ],
            "documentos": [
                "Póliza de seguro de caución vigente y número correlativo de fianza aduanera."
            ],
            "pasos": [
                "Inicia sesión en la Agencia Virtual con las credenciales de la empresa.",
                "Ingresa a la sección 'Aduanas' > 'Consultas de Saldos de Fianza'.",
                "Selecciona el número de póliza y visualiza el saldo total, monto debitado y disponible para nuevas DUCAs.",
                "Si el saldo está próximo a agotarse, tramita un endoso de ampliación ante la afianzadora."
            ],
            "resultadoObtenido": "Pantalla informativa con el detalle de saldo afianzado y consumos por declaración aduanera.",
            "tiempoEstimado": "Inmediato (consulta en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Intentar liquidar una DUCA de importación temporal cuyo monto de tributos suspendidos supere el saldo de fianza provocará el rechazo automático del sistema.",
            "normativa": "Decreto 29-89 Artículo 13; RECAUCA Artículo 56."
        },
        "SAT-GES-0480": {
            "nombreActual": "Transmitir declaración aduanera de admisión temporal bajo Decreto 29-89",
            "descripcion": "Transmite la Declaración Única Centroamericana (DUCA) para ingresar insumos, materias primas o maquinaria con suspensión temporal de tributos. Habilita el ingreso de los bienes a la planta de producción para su perfeccionamiento y posterior exportación.",
            "requisitos": [
                "Cuenta corriente de insumos y fianza aduanera activas con saldo disponible suficiente.",
                "Factura comercial del proveedor extranjero y conocimiento de embarque o carta de porte.",
                "Materias primas amparadas estrictamente dentro de la resolución de calificación del MINECO."
            ],
            "documentos": [
                "Declaración Única Centroamericana bajo régimen de admisión temporal (código de régimen aplicable).",
                "Factura comercial y lista de empaque digitalizadas en el repositorio aduanero.",
                "Documento de transporte electrónico asociado al manifiesto de carga."
            ],
            "pasos": [
                "Genera el borrador de la DUCA de admisión temporal en el sistema informático aduanero.",
                "Asocia el número de cuenta corriente y resolución ministerial de calificación.",
                "Carga los documentos soporte en el repositorio digital de aduana sin papeles.",
                "Firma electrónicamente la transmisión y activa la selectividad automatizada en la aduana de arribo."
            ],
            "resultadoObtenido": "Declaración aduanera aceptada con suspensión tributaria y autorización de levante hacia la planta de maquila.",
            "tiempoEstimado": "1 a 2 horas (transmisión digital)",
            "costo": "Gratuito ante SAT (tributos suspendidos amparados bajo fianza)",
            "advertencia": "Las materias primas importadas bajo régimen temporal no pueden ser comercializadas en el mercado local sin previa nacionalización y pago de impuestos.",
            "normativa": "Decreto 29-89 Artículo 19; RECAUCA Artículos 466 al 476."
        },
        "SAT-GES-0481": {
            "nombreActual": "Presentar descargo de cuenta corriente y conciliación insumo-producto",
            "descripcion": "Presenta ante la SAT la liquidación y descargo de insumos utilizados en los productos terminados efectivamente exportados al extranjero. Restablece el saldo disponible en la fianza aduanera y cancela las responsabilidades tributarias sobre las materias primas procesadas.",
            "requisitos": [
                "Declaraciones de exportación definitivas (DUCA) debidamente liquidadas con acuse de zarpe o salida fronteriza.",
                "Cálculo de aplicación de coeficientes técnicos de transformación, mermas y desperdicios autorizados.",
                "Cuenta corriente aduanera al día sin omisiones en períodos anteriores."
            ],
            "documentos": [
                "Cuadro de liquidación de insumo-producto firmado por el contador de la empresa y representante legal.",
                "Copia de las DUCAs de exportación asociadas a las DUCAs de admisión temporal de origen.",
                "Certificado de integración de insumos emitido por el sistema contable de la maquila."
            ],
            "pasos": [
                "Ingresa al módulo de descargo de cuentas corrientes de maquila en el Portal SAT.",
                "Vincula las declaraciones de exportación con las declaraciones de admisión temporal correspondientes.",
                "El sistema aduanero valida los coeficientes técnicos de consumo y calcula las mermas admisibles.",
                "Transmite la solicitud de descargo para la acreditación automática en la cuenta corriente aduanera."
            ],
            "resultadoObtenido": "Constancia electrónica de descargo de materias primas y restitución de cupo afianzado en la cuenta corriente.",
            "tiempoEstimado": "3 a 5 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No presentar los descargos dentro del plazo legal normado presume la comercialización ilegal en el país y amerita cobro coactivo de tributos con recargos.",
            "normativa": "Decreto 29-89 Artículos 20 al 25; RECAUCA Artículo 477."
        },
        "SAT-GES-0486": {
            "nombreActual": "Autorizar traslado de materias primas entre maquilas calificadas",
            "descripcion": "Solicita autorización para transferir temporalmente materias primas, productos semielaborados o maquinaria a otra empresa calificada bajo Decreto 29-89 para subcontratación de servicios. Mantiene la suspensión tributaria bajo custodia solidaria entre ambas plantas.",
            "requisitos": [
                "Ambas empresas (cedente y receptora) deben contar con calificación vigente bajo Decreto 29-89.",
                "Solvencia fiscal vigente de ambas entidades a la fecha de la solicitud.",
                "Contrato mercantil de subcontratación de servicios industriales suscrito entre las partes.",
                "Saldo suficiente en la fianza aduanera para respaldar la transferencia."
            ],
            "documentos": [
                "Memorial conjunto de solicitud de traslado temporal dirigido a la Unidad de Regímenes Especiales.",
                "Copia del contrato de maquila por subcontratación.",
                "Declaración aduanera interna de traslado y lista detallada de bultos a transferir."
            ],
            "pasos": [
                "Ingresa la solicitud de traslado a través de la Agencia Virtual de la SAT.",
                "Adjunta el contrato de subcontratación y las resoluciones de calificación de ambas empresas.",
                "La Unidad de Regímenes Especiales autoriza el traspaso informático entre las cuentas corrientes de ambas entidades.",
                "Moviliza las mercancías amparadas con la boleta de autorización de traslado sellada."
            ],
            "resultadoObtenido": "Autorización electrónica de traslado que debita insumos de la empresa cedente y los acredita en la receptora.",
            "tiempoEstimado": "3 a 5 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Efectuar traslados físicos de materias primas sin la autorización previa de la SAT tipifica el delito de contrabando aduanero interno.",
            "normativa": "Decreto 29-89 Artículo 26; RECAUCA Artículo 474."
        },
        "SAT-GES-0487": {
            "nombreActual": "Consultar verificador de plazos de permanencia para admisión temporal",
            "descripcion": "Consulta las fechas límite de permanencia en el país de las mercancías importadas bajo el régimen del Decreto 29-89. Permite programar las exportaciones o solicitar prórrogas antes del vencimiento del plazo anual improrrogable.",
            "requisitos": [
                "Número de Declaración Única Centroamericana (DUCA) de admisión temporal.",
                "Acceso a la Agencia Virtual SAT o consulta de regímenes aduaneros especiales."
            ],
            "documentos": [
                "DUCA de admisión temporal con fecha de levante aduanero."
            ],
            "pasos": [
                "Accede a la herramienta de verificación de plazos en el portal de la SAT.",
                "Introduce el número de la declaración de admisión temporal y el año de despacho.",
                "El sistema muestra la fecha exacta de ingreso y el conteo de días restantes para la exportación obligatoria.",
                "Verifica el estatus de la fianza y programa el descargo de materias primas antes de la fecha límite."
            ],
            "resultadoObtenido": "Reporte en pantalla con el cómputo de plazos legales de permanencia aduanera.",
            "tiempoEstimado": "Inmediato (consulta interactiva)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Superar el plazo de un año sin haber exportado o nacionalizado la materia prima conlleva la ejecución inmediata del seguro de caución.",
            "normativa": "Decreto 29-89 Artículo 19; RECAUCA Artículo 470."
        },
        "SAT-GES-0485": {
            "nombreActual": "Nacionalizar desperdicios y subproductos con liquidación de tributos",
            "descripcion": "Liquida y paga los derechos arancelarios e IVA correspondientes a los desperdicios con valor comercial resultantes del proceso industrial de maquila. Permite comercializar legalmente los sobrantes y subproductos en el mercado nacional.",
            "requisitos": [
                "Resolución ministerial de calificación del MINECO que autorice el porcentaje de desperdicios.",
                "Tener aprobada la solicitud de nacionalización por parte de la Unidad de Regímenes Especiales.",
                "Fondos disponibles para el pago de los tributos de importación definitiva en Declaraguate."
            ],
            "documentos": [
                "Declaración de mercancías de importación definitiva (cambio de régimen de admisión temporal a definitivo).",
                "Factura proforma o liquidación de valor comercial de los desperdicios.",
                "Dictamen técnico del contador que determina el peso y valor CIF residual de los subproductos."
            ],
            "pasos": [
                "Elabora la declaración de cambio de régimen en el sistema aduanero consignando el valor comercial residual de los desperdicios.",
                "Calcula y paga en banca virtual los tributos correspondientes a través del formulario Declaraguate.",
                "La SAT valida el pago y actualiza el descargo correspondiente en la cuenta corriente de materias primas.",
                "Comercializa o entrega los subproductos en territorio nacional amparados con factura local."
            ],
            "resultadoObtenido": "Declaración aduanera liquidada que nacionaliza los subproductos y finiquita la suspensión tributaria.",
            "tiempoEstimado": "1 a 2 días hábiles",
            "costo": "Pago de los tributos aplicables (DAI e IVA) según el valor de venta del desperdicio",
            "advertencia": "Vender desperdicios en el mercado nacional sin previa nacionalización y pago de tributos constituye defraudación tributaria.",
            "normativa": "Decreto 29-89 Artículos 23 y 24; RECAUCA Artículo 478."
        },
        "SAT-GES-0482": {
            "nombreActual": "Solicitar destrucción o donación de desperdicios bajo supervisión aduanera",
            "descripcion": "Solicita la presencia de un inspector aduanero de la SAT para presenciar la destrucción de mermas o la donación de desperdicios sin valor comercial a instituciones benéficas. Cancela el cargo tributario sobre materias primas inutilizadas.",
            "requisitos": [
                "Desperdicios o mermas inservibles que carecen de valor comercial o bienes aptos para beneficencia pública.",
                "Estar solvente en el cumplimiento de obligaciones aduaneras y tributarias.",
                "Presentar la solicitud con al menos 15 días hábiles de antelación a la fecha propuesta para el acto de destrucción."
            ],
            "documentos": [
                "Memorial de solicitud dirigido a la Administración de Aduana de jurisdicción.",
                "Inventario detallado de los materiales a destruir o donar (peso, descripción y DUCAs de origen asociadas).",
                "Constancia de aceptación de la donación por la entidad benéfica registrada ante SAT, en caso de aplicar."
            ],
            "pasos": [
                "Presenta el memorial de solicitud detallando el método ecológico de destrucción o el destino de la donación.",
                "La autoridad aduanera fija día y hora para la diligencia y designa al inspector actuante.",
                "El inspector de la SAT acude a la planta y supervisa la inutilización o entrega formal de los bienes.",
                "Se facciona el Acta Notarial o Administrativa de Destrucción que sirve de base para el descargo contable y aduanero."
            ],
            "resultadoObtenido": "Acta oficial de destrucción o donación suscrita por la SAT que autoriza el descargo total en la cuenta corriente.",
            "tiempoEstimado": "15 a 20 días hábiles",
            "costo": "Gratuito ante SAT (costos de destrucción o flete a cargo de la empresa)",
            "advertencia": "Destruir mercancías o desperdicios sin la presencia y fe pública del inspector aduanero de la SAT no extingue la obligación tributaria devengada.",
            "normativa": "Decreto 29-89 Artículo 24; RECAUCA Artículo 479."
        },
        "SAT-GES-0476": {
            "nombreActual": "Solicitar finiquito y liberación de fianza por cese de maquila",
            "descripcion": "Solicita la auditoría final y emisión de finiquito tributario por terminación definitiva de operaciones bajo el Decreto 29-89. Permite la devolución y cancelación de las pólizas de seguro de caución en custodia de la SAT.",
            "requisitos": [
                "Resolución ministerial del MINECO que autoriza el cese definitivo de operaciones bajo el régimen de maquila.",
                "Cuenta corriente de insumos y materias primas con saldo cero (100% de insumos descargados por exportación o nacionalización).",
                "Solvencia fiscal vigente de la persona jurídica y representante legal."
            ],
            "documentos": [
                "Memorial formal de solicitud de finiquito y devolución de pólizas de fianza.",
                "Resolución de cancelación del MINECO debidamente ejecutoriada.",
                "Estados de cuenta aduaneros finales y conciliación de inventario con saldo cero."
            ],
            "pasos": [
                "Ingresa el expediente de solicitud de finiquito en la Unidad de Regímenes Especiales de la SAT.",
                "Los auditores de aduanas efectúan la revisión y cruce de DUCAs de importación contra exportaciones y pagos.",
                "Una vez verificado que no existen saldos insolutos ni materias primas pendientes, se emite el dictamen de finiquito.",
                "Recibe el oficio de cancelación de fianza dirigido a la aseguradora para la liberación de contragarantías."
            ],
            "resultadoObtenido": "Resolución de finiquito aduanero y oficio de liberación definitiva de pólizas de seguro de caución.",
            "tiempoEstimado": "30 a 60 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Si la auditoría detecta faltantes de materias primas sin justificar, la SAT suspenderá el cese y ejecutará la fianza por el monto de los tributos defraudados.",
            "normativa": "Decreto 29-89 Artículos 30 al 35; Código Tributario Artículo 50."
        },
        "SAT-GES-0477": {
            "nombreActual": "Consultar compendio normativo y criterios operativos del Decreto 29-89",
            "descripcion": "Accede a la recopilación digital oficial de leyes, reglamentos, criterios institucionales y resoluciones aduaneras sobre el régimen de maquila en Guatemala. Otorga certeza jurídica sobre obligaciones de exportación, plazos y beneficios fiscales.",
            "requisitos": [
                "Dispositivo con acceso a internet para descargar leyes y manuales aduaneros.",
                "Interés en la regulación de la actividad exportadora y maquila."
            ],
            "documentos": [
                "Texto íntegro del Decreto 29-89 y sus reformas, disponible en la Biblioteca Virtual de la SAT."
            ],
            "pasos": [
                "Ingresa a la sección 'Biblioteca en Línea SAT' > 'Legislación Aduanera'.",
                "Selecciona el compendio de Fomento a la Actividad Exportadora y Maquila.",
                "Descarga la normativa consolidada y circulares técnicas aplicables.",
                "Aplica los criterios institucionales en la planeación tributaria y aduanera de tu empresa."
            ],
            "resultadoObtenido": "Acceso libre a la normativa legal oficial y criterios administrativos vigentes de la SAT.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las reformas legales al Decreto 29-89 (como las introducidas por el Decreto 19-2016) modificaron las partidas de insumos sujetas a exención de ISR.",
            "normativa": "Decreto 29-89 y sus reformas; Decreto 19-2016 (Ley de Fortalecimiento a la Productividad y el Empleo)."
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

    print(f"Enriched {updated_count} items (OEA & Maquilas).")

    with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    enrich_oea_maquilas()
