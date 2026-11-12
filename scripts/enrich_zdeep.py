# -*- coding: utf-8 -*-
"""
Enrichment script for Zonas de Desarrollo Económico Especial Público (ZDEEP) (29 gestiones)
Adhering to ATO UX Writing standards, Regla 12, and SAT Guatemala regulations.
"""

import json

def enrich_zdeep():
    with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    enrichment = {
        "SAT-GES-0507": {
            "nombreActual": "Habilitar polígono territorial de Zona de Desarrollo Económico Especial Público (ZDEEP)",
            "descripcion": "Solicita ante la Intendencia de Aduanas la delimitación geográfica y habilitación aduanera del área territorial autorizada por ZOLIC como ZDEEP. Confiere extraterritorialidad aduanera al polígono para la instalación de empresas industriales, comerciales y de servicios.",
            "requisitos": [
                "Contar con resolución formal de la Junta Directiva de la Zona Libre de Santo Tomás de Castilla (ZOLIC) que autoriza la creación de la ZDEEP.",
                "Estar legalmente constituido como Empresa Desarrolladora inscrita en el Registro Mercantil y en el RTU con solvencia fiscal.",
                "Disponer de levantamiento topográfico con coordenadas georreferenciadas (WGS84) del polígono cerrado y amurallado.",
                "Presentar póliza de seguro de caución a favor de la SAT que garantice las operaciones aduaneras del recinto."
            ],
            "documentos": [
                "Certificación de la resolución de la Junta Directiva de ZOLIC.",
                "Planos generales de delimitación perimetral, accesos viales y diseño de garita de control.",
                "Póliza original de fianza de seguro de caución operativa a favor de la SAT.",
                "Estudio de impacto ambiental y licencias municipales de construcción de la zona."
            ],
            "pasos": [
                "Ingresa el memorial de habilitación ante la Intendencia de Aduanas adjuntando el expediente técnico y resolución de ZOLIC.",
                "Facilita la inspección ocular realizada por ingenieros y auditores de la SAT para verificar el cerramiento físico perimetral.",
                "Entrega la póliza del seguro de caución en la Unidad de Administración de Auxiliares de Aduanas.",
                "Recibe la resolución administrativa de la SAT que otorga el código aduanero de la ZDEEP y autoriza el inicio de operaciones."
            ],
            "resultadoObtenido": "Resolución de intendencia de aduanas que habilita el polígono como zona franca extraterritorial y asigna código de recinto aduanero.",
            "tiempoEstimado": "45 a 60 días hábiles",
            "costo": "Gratuito ante SAT (fianza y costos de habilitación territorial por cuenta del desarrollador)",
            "advertencia": "No se autorizará el ingreso de mercancías si el polígono presenta aperturas no controladas en el muro perimetral o carece de cámaras con enlace activo a SAT.",
            "normativa": "Ley Orgánica de ZOLIC (Decreto 22-73 y reformas del Decreto 30-2018); CAUCA Artículo 19; Reglamento General de ZDEEP."
        },
        "SAT-GES-0506": {
            "nombreActual": "Registrar garitas de control aduanero e infraestructura en Zonas Especiales (ZDEEP)",
            "descripcion": "Homologa y registra ante la SAT las instalaciones de control de acceso, básculas de pesaje y casetas de control fiscal en la entrada y salida de la ZDEEP. Garantiza la presencia física de la delegación aduanera para el despacho ininterrumpido de contenedores.",
            "requisitos": [
                "Resolución de habilitación previa del polígono ZDEEP emitida por la SAT.",
                "Básculas camioneras de pesaje continuo con certificación de calibración vigente emitida por OGM.",
                "Infraestructura de oficinas administrativas dotadas de equipos de cómputo y enlace de fibra óptica dedicado para los inspectores de la SAT."
            ],
            "documentos": [
                "Planos de detalle arquitectónico y de telecomunicaciones de la garita de control aduanero.",
                "Certificado de calibración de las básculas de pesaje vehicular.",
                "Convenio de comodato o asignación de instalaciones para uso del personal aduanero de la SAT."
            ],
            "pasos": [
                "Presenta a la Intendencia de Aduanas el informe de finalización de obras de la garita de control.",
                "Los técnicos de telecomunicaciones y aduanas de la SAT realizan pruebas de enlace informático y pesaje en tiempo real.",
                "Se facciona el acta de entrega-recepción de las oficinas de la delegación aduanera permanente.",
                "La SAT designa al administrador de aduana y oficiales para el inicio del control de accesos."
            ],
            "resultadoObtenido": "Acta de recepción y activación de la delegación aduanera destacada en la garita de la ZDEEP.",
            "tiempoEstimado": "15 a 20 días hábiles",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Operar accesos vehiculares de carga eludiendo el paso por la garita aduanera tipifica el delito flagrante de contrabando aduanero.",
            "normativa": "Reglamento de Operación Aduanera en ZDEEP; CAUCA Artículo 12; RECAUCA Artículos 66 al 70."
        },
        "SAT-GES-0497": {
            "nombreActual": "Registrar empresas usuarias autorizadas de Zonas Especiales (ZDEEP) ante SAT",
            "descripcion": "Inscribe en los registros de la SAT a las personas jurídicas que han firmado contrato de usuario con el desarrollador y obtenido calificación de ZOLIC. Habilita a la empresa para operar dentro de la ZDEEP y gozar de las exenciones tributarias de ley.",
            "requisitos": [
                "Contrato de usuario suscrito con la Empresa Desarrolladora de la ZDEEP correspondiente.",
                "Resolución de calificación favorable emitida por la Junta Directiva de ZOLIC.",
                "Estar inscrito en el RTU con datos ratificados y solvencia fiscal vigente.",
                "Constituir fianza aduanera de cumplimiento a favor de la SAT en caso de realizar actividades de transformación o manufactura."
            ],
            "documentos": [
                "Certificación de la resolución de calificación expedida por ZOLIC.",
                "Copia legalizada del contrato de arrendamiento o compraventa en el polígono ZDEEP.",
                "Póliza original del seguro de caución a favor de la SAT.",
                "Nombramiento del representante legal inscrito en el Registro Mercantil."
            ],
            "pasos": [
                "Ingresa el memorial de inscripción ante la Unidad de Regímenes Especiales de la SAT (Torre SAT, nivel 3).",
                "Entrega la certificación de ZOLIC y la póliza de fianza requerida.",
                "El analista aduanero verifica los requisitos y registra la calidad de 'Usuario ZDEEP' en el sistema del RTU.",
                "Recibe la constancia de inscripción aduanera y habilitación para emitir DUCAs hacia la zona especial."
            ],
            "resultadoObtenido": "Constancia de registro aduanero como Usuario Calificado de ZDEEP y activación de beneficios tributarios.",
            "tiempoEstimado": "10 a 15 días hábiles",
            "costo": "Gratuito ante SAT (pago de derechos normados ante ZOLIC)",
            "advertencia": "Perder la calificación de ZOLIC o rescindir el contrato con el desarrollador provoca la cancelación automática del registro aduanero y la pérdida de las exenciones fiscales.",
            "normativa": "Decreto 22-73 Reformado por Decreto 30-2018; RECAUCA Artículos 480 al 490."
        },
        "SAT-GES-0504": {
            "nombreActual": "Controlar ingreso y egreso de carga en garitas aduaneras de Zonas Especiales (ZDEEP)",
            "descripcion": "Registra y fiscaliza en garita el flujo vehicular y de contenedores que entran o salen del polígono de la ZDEEP amparados con declaraciones aduaneras. Asegura el control físico de precintos, peso en báscula y coincidencia documental de bultos.",
            "requisitos": [
                "Declaración aduanera (DUCA de importación, DUCA-T de tránsito o pase de salida local) validada en sistema.",
                "Medio de transporte debidamente registrado con marchamo electrónico o precinto aduanero intacto.",
                "Conductor portando documento de identificación y carta de porte o manifiesto."
            ],
            "documentos": [
                "Ejemplar de la declaración aduanera correspondiente.",
                "Boleta de pesaje emitida por la báscula de garita.",
                "Conocimiento de embarque o documento de transporte terrestre."
            ],
            "pasos": [
                "El piloto posiciona la unidad de transporte en la báscula de la garita de la ZDEEP.",
                "El oficial de la SAT realiza la lectura óptica del marchamo y coteja el peso bruto contra el manifiesto.",
                "Se efectúa la consulta informática de selectivo en rampa o confirmación de tránsito.",
                "Si la unidad tiene selectivo verde o tránsito conforme, el oficial valida el pase de garita en el sistema y autoriza el ingreso o egreso."
            ],
            "resultadoObtenido": "Validación informática de garita que autoriza el ingreso de insumos al polígono o la salida de mercancías al exterior.",
            "tiempoEstimado": "10 a 20 minutos por unidad de transporte",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Discrepancias significativas entre el peso real de báscula y el peso manifestado motivan la retención inmediata del contenedor y su remisión a rampa de inspección física.",
            "normativa": "Procedimiento de Despacho en ZDEEP PR-IAD/DNO-DE-01; RECAUCA Artículos 254 al 263."
        },
        "SAT-GES-0496": {
            "nombreActual": "Tramitar traslado de mercancías hacia y desde Zonas Especiales (ZDEEP)",
            "descripcion": "Gestiona el traslado fiscal de materias primas y productos entre puertos marítimos, aduanas terrestres y recintos de ZDEEP bajo régimen suspensivo. Garantiza el transporte seguro mediante custodia satelital y precintos electrónicos.",
            "requisitos": [
                "Estar acreditado como usuario calificado de la ZDEEP con cuenta corriente aduanera activa.",
                "Declaración de tránsito interno (DUCA-T) autorizada con empresa transportista habilitada ante SAT.",
                "Uso obligatorio de marchamo electrónico para el monitoreo satelital de la ruta fiscal autorizada."
            ],
            "documentos": [
                "DUCA-T de tránsito aduanero interno aceptada en el sistema informático.",
                "Factura comercial o proforma del traslado y lista de empaque.",
                "Contrato o comprobante de servicio de marchamo electrónico satelital."
            ],
            "pasos": [
                "Genera la declaración DUCA-T consignando como aduana de destino la delegación aduanera de la ZDEEP.",
                "Instala y activa el marchamo electrónico satelital en el puerto de arribo o punto de partida.",
                "El vehículo recorre la ruta fiscal autorizada dentro del plazo de viaje fijado por el sistema aduanero.",
                "Al presentarse en la garita de la ZDEEP, el oficial desactiva el marchamo satelital y culmina formalmente el tránsito."
            ],
            "resultadoObtenido": "Cierre exitoso del tránsito aduanero e ingreso de las mercancías a los almacenes del usuario dentro de la ZDEEP.",
            "tiempoEstimado": "Inmediato (conforme a los tiempos de ruta carretera autorizados)",
            "costo": "Tarifa fijada por el proveedor privado de marchamo satelital",
            "advertencia": "Desviarse de la ruta fiscal asignada o abrir el furgón antes de llegar a la garita de la ZDEEP dispara alertas rojas automáticas de decomiso por contrabando.",
            "normativa": "RECAUCA Artículos 393 al 404; Resolución SAT-DSI-871-2017."
        },
        "SAT-GES-0491": {
            "nombreActual": "Reportar inventarios periódicos de transformación en Zonas Especiales (ZDEEP)",
            "descripcion": "Transmite a la Intendencia de Aduanas el informe periódico de conciliación de materias primas ingresadas, productos elaborados y mermas en la ZDEEP. Asegura la transparencia tributaria y mantiene habilitadas las exenciones de impuestos de importación.",
            "requisitos": [
                "Usuario calificado de ZDEEP con operaciones industriales o de manufactura activas.",
                "Llevar sistema informático de control de inventarios permanente enlazado o conciliable con SAT.",
                "Haber registrado los factores técnicos de transformación y coeficientes de rendimiento aprobados."
            ],
            "documentos": [
                "Archivo electrónico estructurado de conciliación de inventarios al corte mensual o trimestral.",
                "Copia de las DUCAs de ingreso y DUCAs de exportación o traslado asociadas.",
                "Certificación de existencias firmada por el representante legal y contador de la empresa."
            ],
            "pasos": [
                "Genera el reporte de inventario físico y contable al cierre de período en el software de la empresa.",
                "Ingresa a la plataforma informática aduanera de la SAT en el apartado de Regímenes Especiales.",
                "Carga el archivo de conciliación de inventarios y factores de consumo.",
                "El sistema ejecuta la validación algorítmica y emite el comprobante de recepción de inventario conforme."
            ],
            "resultadoObtenido": "Acuse de recibo electrónico que valida la regularidad de los inventarios industriales dentro de la ZDEEP.",
            "tiempoEstimado": "Transmisión en línea inmediata",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Omitir la entrega de los reportes periódicos de inventario genera la inhabilitación inmediata del código de usuario para despachos aduaneros.",
            "normativa": "Decreto 22-73 reformado; RECAUCA Artículo 117; Reglamento General de ZDEEP."
        },
        "SAT-GES-0505": {
            "nombreActual": "Consultar puestos de control interinstitucional (PCI) y rutas fiscales",
            "descripcion": "Consulta la ubicación estratégica de los Puestos de Control Interinstitucional (PCI) operados conjuntamente por SAT, PNC y ministerios en carreteras. Permite planificar el paso seguro de cargamentos de comercio exterior amparados con documentación legal.",
            "requisitos": [
                "Conexión a internet para consultar la ubicación geográfica de los puestos de control en el Portal SAT.",
                "Portar durante el viaje la documentación completa de transporte, DUCAs y marchamo activo."
            ],
            "documentos": [
                "Declaración aduanera impresa o digital con código QR de verificación rápida.",
                "Licencia de conducir, tarjeta de circulación del cabezal y remolque."
            ],
            "pasos": [
                "Accede a la sección 'Puestos de Control Interinstitucional (PCI)' en el Portal SAT.",
                "Revisa el mapa interactivo con la ubicación de los puestos (Pajapita, Entre Ríos, Pasaco, Sanarate, Patzicía, etc.).",
                "Verifica los protocolos de inspección no intrusiva con escáneres de rayos X y perros detectores K9.",
                "Al aproximarse al puesto de control, reduce la velocidad y atiende las indicaciones de los oficiales de turno."
            ],
            "resultadoObtenido": "Información oficial sobre la red de seguridad vial fiscal y facilitación del tránsito aduanero seguro.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Intentar evadir un Puesto de Control Interinstitucional constituye delito penal de desobediencia y presunción de contrabando aduanero.",
            "normativa": "Consejo Nacional Interinstitucional contra el Contrabando y Defraudación Aduanera (CONACON); Ley Nacional de Aduanas."
        },
        "SAT-GES-0494": {
            "nombreActual": "Consultar legislación y exenciones tributarias de Zonas Especiales (ZDEEP)",
            "descripcion": "Accede a la normativa legal consolidada que rige los incentivos fiscales, exenciones de Impuesto Sobre la Renta (ISR) y aranceles para empresas en ZDEEP. Otorga certeza jurídica a inversionistas nacionales y extranjeros sobre el régimen fiscal especial.",
            "requisitos": [
                "Dispositivo con acceso a internet para descargar leyes y decretos aduaneros.",
                "Interés en el régimen de incentivos de Zonas de Desarrollo Económico Especial Público."
            ],
            "documentos": [
                "Textos íntegros del Decreto 22-73 y Decreto 30-2018 del Congreso de la República.",
                "Resoluciones de Directorio de la SAT sobre operatividad aduanera en zonas francas."
            ],
            "pasos": [
                "Ingresa a la sección 'Biblioteca en Línea SAT' > 'Legislación Aduanera'.",
                "Selecciona el marco normativo de Zonas Libres y Zonas de Desarrollo Económico Especial Público.",
                "Descarga la legislación consolidada para evaluar los períodos de exención de ISR (10 años) e IVA de importación.",
                "Aplica los criterios tributarios autorizados en la contabilidad corporativa de la empresa."
            ],
            "resultadoObtenido": "Compilación legal oficial con las disposiciones tributarias y aduaneras vigentes para usuarios de ZDEEP.",
            "tiempoEstimado": "Inmediato (acceso libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las ventas realizadas desde una ZDEEP hacia el territorio aduanero nacional se consideran importaciones definitivas y causan el pago íntegro de aranceles e IVA.",
            "normativa": "Decreto 22-73; Decreto 30-2018; Ley de Actualización Tributaria (Decreto 10-2012)."
        },
        "SAT-GES-0503": {
            "nombreActual": "Consultar compendio normativo de Zonas Especiales (ZDEEP) y reformas",
            "descripcion": "Accede a la recopilación de resoluciones, acuerdos gubernativos y reformas a la Ley de ZOLIC aplicables a las zonas especiales públicas y privadas. Facilita la consulta de reglamentos operativos y de seguridad para inversionistas y operadores.",
            "requisitos": [
                "Navegador de internet con soporte para visualización de documentos en PDF.",
                "Conocimiento de la materia de regímenes territoriales y aduaneros especiales."
            ],
            "documentos": [
                "Reglamento General para la Autorización, Habilitación y Funcionamiento de las ZDEEP."
            ],
            "pasos": [
                "Accede al portal de legislación tributaria y aduanera de la SAT.",
                "Localiza el apartado de normativas territoriales especiales y circulares de la Intendencia de Aduanas.",
                "Descarga el compendio reglamentario oficial.",
                "Verifica los requisitos normados para la instalación de nuevas plantas productivas."
            ],
            "resultadoObtenido": "Acceso libre e inmediato a los reglamentos oficiales de la figura ZDEEP en Guatemala.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Verifica siempre la vigencia de los reglamentos complementarios aprobados por el Ministerio de Finanzas Públicas.",
            "normativa": "Decreto 30-2018; Acuerdo Gubernativo 23-2020 (Reglamento de la Ley de ZOLIC)."
        },
        "SAT-GES-0498": {
            "nombreActual": "Habilitar facturación electrónica en línea (FEL) para usuarios de ZDEEP",
            "descripcion": "Activa el régimen de Factura Electrónica en Línea (FEL) con los tipos de documentos tributarios específicos para operaciones dentro de ZDEEP. Permite emitir facturas exentas y registrar traslados de bienes con plena validez fiscal y aduanera.",
            "requisitos": [
                "Estar acreditado en el RTU como Usuario Calificado de ZDEEP.",
                "Acceso a la Agencia Virtual SAT con credenciales activas del contribuyente.",
                "Solvencia fiscal vigente y firma electrónica digital habilitada en el sistema FEL."
            ],
            "documentos": [
                "Constancia de registro aduanero como usuario de ZDEEP.",
                "Resolución de acreditación de personería jurídica."
            ],
            "pasos": [
                "Inicia sesión en la Agencia Virtual y dirígete al menú 'Factura Electrónica en Línea (FEL)'.",
                "Habilita el perfil de emisor seleccionando la certificación gratuita provista por la SAT o un certificador privado.",
                "Configura las series y tipos de documentos especiales para operaciones extraterritoriales y de exportación.",
                "Comienza a emitir comprobantes electrónicos autorizados con código de autorización de emisión (CAE) en tiempo real."
            ],
            "resultadoObtenido": "Habilitación del sistema de emisión de comprobantes fiscales electrónicos autorizados para operar en la ZDEEP.",
            "tiempoEstimado": "10 a 15 minutos (en línea)",
            "costo": "Gratuito mediante la aplicación oficial de SAT",
            "advertencia": "Emitir facturas convencionales en papel está prohibido para usuarios de regímenes especiales; todos los comprobantes deben ser electrónicos bajo régimen FEL.",
            "normativa": "Acuerdo de Directorio SAT 13-2018; Ley del IVA (Decreto 27-92)."
        },
        "SAT-GES-0508": {
            "nombreActual": "Obtener solvencia fiscal para desarrolladores de Zonas Especiales (ZDEEP)",
            "descripcion": "Genera en línea el certificado que acredita que la empresa desarrolladora de la ZDEEP se encuentra al día en todas sus obligaciones tributarias formales y materiales. Es requisito indispensable para mantener vigente la autorización de la delegación aduanera.",
            "requisitos": [
                "Acceso a la Agencia Virtual de la SAT.",
                "No registrar omisos en declaraciones de impuestos mensuales o anuales.",
                "No tener requerimientos de cobro en estado de mora ni convenios incumplidos.",
                "Datos del RTU ratificados en el año en curso."
            ],
            "documentos": [
                "Constancia electrónica en formato PDF con código QR de verificación institucional."
            ],
            "pasos": [
                "Ingresa a la Agencia Virtual de la SAT con el NIT de la Empresa Desarrolladora.",
                "Selecciona 'Servicios Tributarios' > 'Solvencia Fiscal'.",
                "El sistema audita automáticamente el historial de pagos y obligaciones de la entidad.",
                "Descarga e imprime la constancia oficial de solvencia tributaria."
            ],
            "resultadoObtenido": "Certificado digital de Solvencia Fiscal con validación electrónica oficial.",
            "tiempoEstimado": "Inmediato (generación en línea 24/7)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Cualquier inconsistencia en declaraciones de retenciones del personal paralizará la emisión de la solvencia institucional.",
            "normativa": "Código Tributario Artículo 57 'A'; Acuerdo de Directorio SAT 07-2007."
        },
        "SAT-GES-0499": {
            "nombreActual": "Obtener solvencia fiscal para empresas usuarias de Zonas Especiales (ZDEEP)",
            "descripcion": "Genera el certificado de solvencia tributaria exigido periódicamente a las empresas instaladas en ZDEEP para mantener el goce de las exenciones de impuestos. Comprueba la transparencia y cumplimiento tributario ante la Intendencia de Aduanas.",
            "requisitos": [
                "Usuario y contraseña de la Agencia Virtual SAT.",
                "Declaraciones tributarias presentadas en los plazos fijados por ley.",
                "RTU ratificado en el ejercicio fiscal vigente."
            ],
            "documentos": [
                "Certificado de solvencia fiscal descargado desde la plataforma digital de la SAT."
            ],
            "pasos": [
                "Inicia sesión en la Agencia Virtual con tu usuario corporativo.",
                "Pulsa sobre la opción 'Solvencia Fiscal' dentro del menú de servicios.",
                "Verifica la respuesta satisfactoria de la auditoría informática en tiempo real.",
                "Descarga el documento oficial para incorporarlo al expediente de control aduanero de ZDEEP."
            ],
            "resultadoObtenido": "Constancia de Solvencia Fiscal institucional válida para gestiones de comercio exterior y zonas francas.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Estar insolvente ante la SAT suspende el derecho a aplicar las exenciones de aranceles e IVA en las importaciones que ingresen a la zona.",
            "normativa": "Código Tributario Artículo 57 'A'; Decreto 22-73 reformado."
        },
        "SAT-GES-0489": {
            "nombreActual": "Consultar convenios de pago y facilidades para usuarios de ZDEEP",
            "descripcion": "Consulta el estado de cuenta, cuotas abonadas y saldos pendientes de convenios de pago suscritos por ajustes tributarios en operaciones de zonas especiales. Permite a los usuarios mantener al día sus obligaciones y evitar la revocatoria de facilidades aduaneras.",
            "requisitos": [
                "Número de convenio formalizado o número de resolución administrativa de facilidades de pago.",
                "Número de Identificación Tributaria (NIT) de la empresa usuaria."
            ],
            "documentos": [
                "Convenio de pago autorizado por la Intendencia de Asuntos Jurídicos o Aduanas.",
                "Comprobantes de pago bancarios de cuotas anteriores."
            ],
            "pasos": [
                "Ingresa a la herramienta 'Consulta de Convenios de Pago' en el Portal SAT.",
                "Digita el NIT de la empresa y el número de convenio otorgado.",
                "Revisa la tabla de cuotas pactadas, fechas de vencimiento y pagos registrados.",
                "Genera en Declaraguate la boleta SAT-8008 correspondiente a la mensualidad a cancelar."
            ],
            "resultadoObtenido": "Estado de cuenta detallado del convenio de pago con desglose de capital e intereses.",
            "tiempoEstimado": "Inmediato (consulta interactiva)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "El atraso en dos cuotas consecutivas revoca de pleno derecho las facilidades de pago y habilita la cobranza coactiva inmediata con multas.",
            "normativa": "Código Tributario Artículo 40."
        },
        "SAT-GES-0501": {
            "nombreActual": "Consultar facilidades de pago tributarias para desarrolladores ZDEEP",
            "descripcion": "Permite a las empresas desarrolladoras consultar el historial de amortizaciones y fechas límites de pago de compromisos formalizados con la SAT. Brinda control financiero para asegurar el cumplimiento oportuno de acuerdos tributarios.",
            "requisitos": [
                "NIT de la empresa desarrolladora y número de convenio de pago asignado."
            ],
            "documentos": [
                "Resolución de autorización de convenio suscrita con la administración tributaria."
            ],
            "pasos": [
                "Accede al módulo de consultas de convenios en el portal web institucional.",
                "Introduce las credenciales del convenio de pago.",
                "Comprueba las cuotas aplicadas y el saldo restante por amortizar.",
                "Realiza el pago antes de la fecha límite en la banca virtual asociada."
            ],
            "resultadoObtenido": "Reporte en pantalla con el saldo amortizado y vigencia del convenio de pago.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Mantener cuotas vencidas inhabilita la emisión de solvencias fiscales y bloquea gestiones de ampliación del polígono.",
            "normativa": "Código Tributario Artículo 40."
        },
        "SAT-GES-0708": {
            "nombreActual": "Consultar expedientes de registro de usuarios de ZDEEP en aduanas",
            "descripcion": "Verifica en línea el estatus procesal de solicitudes de calificación, acreditación de usuarios y modificaciones de contratos ingresados ante la Intendencia de Aduanas. Permite dar seguimiento ágil a los dictámenes pendientes de emisión.",
            "requisitos": [
                "Número de expediente asignado en la ventanilla de recepción de aduanas.",
                "Acreditación de personería jurídica del solicitante o representante legal."
            ],
            "documentos": [
                "Contraseña o comprobante con el correlativo de expediente asignado por la SAT."
            ],
            "pasos": [
                "Ingresa al apartado de 'Consulta de Expedientes' en el portal aduanero SAT.",
                "Digita el número de expediente y selecciona el año de ingreso.",
                "Revisa la unidad administrativa donde se encuentra el expediente y el último movimiento registrado.",
                "Verifica las notificaciones o providencias en el buzón electrónico de tu Agencia Virtual."
            ],
            "resultadoObtenido": "Información oficial sobre el estado procesal y unidad responsable del expediente aduanero.",
            "tiempoEstimado": "Inmediato (consulta libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Los requerimientos de información formulados por la autoridad deben responderse dentro de los plazos normados para evitar el abandono de la solicitud.",
            "normativa": "Código Tributario Artículo 126; Ley de lo Contencioso Administrativo Artículo 1."
        },
        "SAT-GES-0714": {
            "nombreActual": "Consultar expedientes de operaciones y control de carga en ZDEEP",
            "descripcion": "Consulta el avance de solicitudes de autorización de traslados, auditorías de inventario o peticiones operativas para recintos de ZDEEP. Facilita la trazabilidad administrativa sin necesidad de presentarse físicamente a las oficinas centrales.",
            "requisitos": [
                "Número correlativo de expediente o gestión aduanera asignado en ventanilla."
            ],
            "documentos": [
                "Boleta con el número de gestión o solicitud aduanera."
            ],
            "pasos": [
                "Accede a la herramienta de consulta de expedientes en el Portal SAT.",
                "Introduce el correlativo de tu solicitud operativa.",
                "Revisa los oficios o dictámenes técnicos emitidos por el Departamento de Gestión Aduanera.",
                "Descarga las providencias notificadas formalmente en tu buzón digital."
            ],
            "resultadoObtenido": "Detalle cronológico de diligencias y estado del expediente de control de carga.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Cualquier prevención administrativa notificada corre con plazos perentorios de días hábiles a partir de su entrega en Agencia Virtual.",
            "normativa": "Código Tributario Artículo 126."
        },
        "SAT-GES-0709": {
            "nombreActual": "Consultar monitoreo de disponibilidad de sistemas aduaneros para ZDEEP",
            "descripcion": "Verifica en línea la operatividad de los servidores aduaneros de recepción de declaraciones, pesaje en garitas y aduana sin papeles para ZDEEP. Permite confirmar la continuidad de los enlaces de transmisión digital de carga.",
            "requisitos": [
                "Dispositivo con acceso a internet para revisar el panel de disponibilidad de servidores aduaneros."
            ],
            "documentos": [
                "No requiere documentos; es una herramienta pública de monitoreo tecnológico institucional."
            ],
            "pasos": [
                "Accede al panel de monitoreo de sistemas aduaneros en el Portal SAT.",
                "Verifica el estatus de los servicios de transmisión de DUCAs, validación de garitas y web services.",
                "Revisa avisos sobre ventanas programadas de mantenimiento en la infraestructura informática.",
                "En caso de falla imprevista, activa los procedimientos de contingencia autorizados por la Intendencia de Aduanas."
            ],
            "resultadoObtenido": "Panel de control con el estado técnico y porcentaje de disponibilidad de los sistemas en tiempo real.",
            "tiempoEstimado": "Inmediato (consulta interactiva)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Durante caídas imprevistas de enlaces informáticos, las garitas de ZDEEP operan con bitácoras físicas de contingencia para no detener el comercio.",
            "normativa": "Plan de Contingencia de los Sistemas Informáticos Aduaneros de la Intendencia de Aduanas."
        },
        "SAT-GES-0492": {
            "nombreActual": "Transmitir declaración anticipada de mercancías hacia Zonas Especiales (ZDEEP)",
            "descripcion": "Transmite la declaración de mercancías antes del arribo del buque o medio de transporte con destino al polígono de la ZDEEP. Reduce los tiempos de espera en puerto y permite el traslado directo e inmediato hacia la zona especial.",
            "requisitos": [
                "Usuario calificado de ZDEEP con clave habilitada en el sistema aduanero.",
                "Documentos de transporte internacional (conocimiento de embarque o carta de porte) emitidos.",
                "Facturas comerciales de compra en el extranjero digitalizadas en el repositorio aduanero."
            ],
            "documentos": [
                "Declaración Única Centroamericana (DUCA) bajo modalidad anticipada.",
                "Factura comercial y lista de empaque en formato PDF digitalizado.",
                "Manifiesto de carga anticipado registrado por el transportista."
            ],
            "pasos": [
                "Captura la declaración aduanera en el sistema de la SAT previo al arribo de la carga al país.",
                "Adjunta los archivos digitalizados en el repositorio de aduana sin papeles.",
                "Firma electrónicamente la declaración y valida la asignación de selectivo automatizado.",
                "Al atracar el barco o cruzar la frontera, moviliza el contenedor directamente hacia la ZDEEP bajo custodia satelital."
            ],
            "resultadoObtenido": "Declaración anticipada aceptada que permite el despacho ágil y traslado directo sin demoras en muelle.",
            "tiempoEstimado": "Menos de 2 horas (transmisión en línea)",
            "costo": "Gratuito (tributos suspendidos amparados en el régimen ZDEEP)",
            "advertencia": "Discrepancias entre lo anticipado electrónicamente y el cargamento físico anulan el traslado directo y ameritan reconocimiento en puerto.",
            "normativa": "Acuerdo de Facilitación del Comercio de la OMC Artículo 7.1; RECAUCA Artículo 323."
        },
        "SAT-GES-0493": {
            "nombreActual": "Transmitir declaración de mercancías en aduana sin papeles para ZDEEP",
            "descripcion": "Carga y valida los documentos digitalizados de soporte para el ingreso de bienes a la ZDEEP o su exportación hacia terceros países. Elimina el uso de expedientes físicos en papel en las delegaciones aduaneras de las zonas francas.",
            "requisitos": [
                "Agente aduanero o apoderado especial habilitado por la empresa usuaria de ZDEEP.",
                "Documentos soporte escaneados en formato PDF con resolución nítida mínima de 200 dpi.",
                "Declaración de mercancías validada previamente en el sistema informático."
            ],
            "documentos": [
                "Factura comercial digitalizada con firma electrónica o sello del proveedor.",
                "Documento de transporte internacional firmado.",
                "Licencias o autorizaciones no arancelarias aplicables digitalizadas."
            ],
            "pasos": [
                "Ingresa al módulo de aduana sin papeles en la plataforma informática de la SAT.",
                "Selecciona el número de DUCA y asocia los archivos PDF clasificándolos por tipo de documento.",
                "Verifica la legibilidad y conformidad de los adjuntos antes del envío final.",
                "Transmite la declaración y obtiene el código QR con el que la unidad se presenta a control de garita."
            ],
            "resultadoObtenido": "Recepción digital completa del expediente y habilitación de selectivo aduanero automatizado.",
            "tiempoEstimado": "10 a 15 minutos",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Subir archivos ilegibles detiene el trámite de levante aduanero en semáforo amarillo hasta que el operador cargue el documento nítido.",
            "normativa": "Resolución de Superintendencia SAT-DSI-1017-2018; RECAUCA Artículo 321."
        },
        "SAT-GES-0490": {
            "nombreActual": "Consultar rampa, selectivo y liberación de mercancías en Zonas Especiales",
            "descripcion": "Verifica en línea la asignación de andenes para inspección física, el técnico revisor asignado y el levantamiento de retenciones en la ZDEEP. Permite a los usuarios coordinar la descarga rápida de mercancías en sus bodegas.",
            "requisitos": [
                "Número de Declaración Única Centroamericana (DUCA) o número de contenedor.",
                "Conexión a internet para consultar el sistema aduanero institucional."
            ],
            "documentos": [
                "DUCA y documento de transporte asociado a la carga."
            ],
            "pasos": [
                "Ingresa a la sección 'Consultas Aduaneras' en el Portal SAT.",
                "Digita el número de declaración o número de contenedor.",
                "Comprueba la rampa asignada y si la mercancía cuenta con pase de levante o medidas de retención.",
                "Coordina el traslado inmediato de la unidad hacia las instalaciones de la empresa usuaria."
            ],
            "resultadoObtenido": "Pantalla oficial con el andén de rampa asignado y estatus de reconocimiento o liberación aduanera.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Intentar descargar en bodega un contenedor con orden de inspección física antes del reconocimiento del revisor constituye falta aduanera grave.",
            "normativa": "RECAUCA Artículos 338 y 339; Procedimiento PR-IAD/DNO-DE-01."
        },
        "SAT-GES-0502": {
            "nombreActual": "Consultar estatus de rampa y liberación de carga en Zonas Especiales",
            "descripcion": "Permite a los operadores logísticos consultar en tiempo real el turno de rampa y el estado de liberación aduanera de contenedores en ZDEEP. Facilita la programación eficiente de cuadrillas de descarga en terminales industriales.",
            "requisitos": [
                "Número correlativo de declaración DUCA o número de identificación de bultos."
            ],
            "documentos": [
                "DUCA con código de barras legible."
            ],
            "pasos": [
                "Accede a la herramienta de consultas de aduanas en el portal institucional.",
                "Introduce el número de la declaración de mercancías.",
                "Revisa la ventana horaria asignada para la revisión en andén fiscal.",
                "Monitorea el cambio de semáforo a estado 'Liberado' para proceder al almacenamiento final."
            ],
            "resultadoObtenido": "Estatus oficial de reconocimiento aduanero y autorización de descarga en bodega.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "No presentarse en la ventana horaria designada obliga a solicitar reprogramación de inspección en rampa.",
            "normativa": "Procedimiento de Despacho PR-IAD/DNO-DE-01; RECAUCA Artículo 339."
        },
        "SAT-GES-0712": {
            "nombreActual": "Consultar directrices técnicas y guías operativas de Zonas Especiales (ZDEEP)",
            "descripcion": "Accede a los manuales de procedimientos y circulares técnicas emitidas por la Intendencia de Aduanas para la administración de zonas especiales. Proporciona lineamientos uniformes para el control de inventarios, garitas y traslados fiscales.",
            "requisitos": [
                "Dispositivo con acceso a internet para descargar guías técnicas en PDF."
            ],
            "documentos": [
                "Manuales operativos y circulares técnicas de la Intendencia de Aduanas."
            ],
            "pasos": [
                "Ingresa a la sección de directrices técnicas aduaneras en el Portal SAT.",
                "Selecciona el compendio de Zonas de Desarrollo Económico Especial Público.",
                "Descarga los instructivos autorizados por resolución de superintendencia.",
                "Implementa las mejores prácticas normadas en la logística interna de la empresa."
            ],
            "resultadoObtenido": "Acceso libre a los manuales de procedimientos técnicos oficiales de la SAT.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las empresas usuarias deben operar de estricta conformidad con las directrices técnicas vigentes para evitar observaciones en auditorías posteriores.",
            "normativa": "Ley Orgánica de la SAT Artículo 3 literal h); Reglamento General de ZDEEP."
        },
        "SAT-GES-0707": {
            "nombreActual": "Consultar guías operativas para control de mercancías en zonas francas y ZDEEP",
            "descripcion": "Consulta las instrucciones técnicas y protocolos de seguridad para el manejo de mercancías bajo custodia de zonas francas y zonas especiales. Brinda orientación detallada para el cumplimiento de formalidades aduaneras.",
            "requisitos": [
                "Conexión a internet para consultar el repositorio normativo institucional."
            ],
            "documentos": [
                "Directrices operativas y manuales de procedimientos aduaneros vigentes."
            ],
            "pasos": [
                "Accede a la sección de manuales procedimentales en el portal de la SAT.",
                "Revisa los instructivos sobre control de mermas, subproductos y traslados interzonas.",
                "Aplica los lineamientos normados en las operaciones de despacho diario.",
                "Consulta dudas específicas con el Administrador de la Aduana de la zona especial."
            ],
            "resultadoObtenido": "Instructivos y manuales autorizados para la operación de zonas francas y ZDEEP.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "El desconocimiento de las guías operativas no exime de responsabilidad administrativa ante hallazgos de fiscalización.",
            "normativa": "RECAUCA Artículos 480 al 490."
        },
        "SAT-GES-0713": {
            "nombreActual": "Consultar especificaciones del programa MIAD para Zonas Especiales (ZDEEP)",
            "descripcion": "Conoce los requerimientos de modernización aduanera en infraestructura tecnológica, videovigilancia CCTV y control automatizado de accesos en ZDEEP. Asegura que el polígono cumpla con los estándares de control inteligente del programa MIAD.",
            "requisitos": [
                "Dispositivo con acceso a internet para descargar especificaciones técnicas del programa MIAD."
            ],
            "documentos": [
                "Documento técnico del componente de infraestructura y tecnología del Programa MIAD."
            ],
            "pasos": [
                "Ingresa a la sección del Programa MIAD en el Portal SAT.",
                "Revisa las especificaciones técnicas homologadas para cámaras de CCTV y software OCR de placas.",
                "Descarga los protocolos de comunicación satelital y enlaces de red hacia los servidores centrales de SAT.",
                "Integra estos estándares en los proyectos de expansión y mantenimiento de la ZDEEP."
            ],
            "resultadoObtenido": "Especificaciones tecnológicas oficiales para la homologación de infraestructuras aduaneras modernas.",
            "tiempoEstimado": "Inmediato (consulta libre)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las zonas especiales que no mantengan activos sus enlaces de videovigilancia con el Centro de Monitoreo SAT están sujetas a sanciones de inhabilitación operativa.",
            "normativa": "Acuerdo de Directorio SAT 07-2019; Estrategia de Modernización Integral Aduanera."
        },
        "SAT-GES-0488": {
            "nombreActual": "Inscribirse en capacitaciones sobre Zonas Especiales (ZDEEP) y aduanas",
            "descripcion": "Inscríbete en los cursos gratuitos dictados por la SAT sobre el marco regulatorio, exenciones tributarias y procedimientos aduaneros en ZDEEP. Fortalece las capacidades técnicas del personal de empresas desarrolladoras y usuarias.",
            "requisitos": [
                "Correo electrónico activo para recibir credenciales de acceso al aula virtual.",
                "Dispositivo con acceso a internet para participar en las sesiones virtuales."
            ],
            "documentos": [
                "Formulario de inscripción digital provisto por Cultura Tributaria SAT."
            ],
            "pasos": [
                "Ingresa a la sección de capacitaciones de aduanas en el portal institucional.",
                "Selecciona el curso enfocado en Zonas de Desarrollo Económico Especial Público y ZOLIC.",
                "Llena el formulario de inscripción con tus datos personales y empresariales.",
                "Completa los módulos y evaluaciones en línea para obtener tu constancia de participación."
            ],
            "resultadoObtenido": "Certificado de aprobación curricular emitido por el Departamento de Cultura Tributaria de la SAT.",
            "tiempoEstimado": "Duración variable (10 a 20 horas académicas)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Se requiere un porcentaje mínimo de asistencia y aprobación en los cuestionarios modulares para descargar el certificado digital.",
            "normativa": "Ley Orgánica de la SAT Artículo 3 literal h); RECAUCA Artículo 75."
        },
        "SAT-GES-0500": {
            "nombreActual": "Inscribirse en programas de cultura tributaria y aduanas para ZDEEP",
            "descripcion": "Accede a seminarios y talleres especializados sobre cumplimiento fiscal, emisión de facturas FEL y auditoría aduanera para zonas francas. Promueve el apego a la legalidad y la prevención de contingencias tributarias.",
            "requisitos": [
                "Personal de empresas usuarias o desarrolladoras de ZDEEP.",
                "Conexión a internet para el ingreso a la plataforma Moodle de la SAT."
            ],
            "documentos": [
                "Registro en línea mediante formulario institucional."
            ],
            "pasos": [
                "Accede a la cartelera de cursos virtuales en el portal de Cultura Tributaria SAT.",
                "Inscríbete en el programa de formación en normativas tributarias y aduaneras.",
                "Participa en las clases sincrónicas y foros de discusión técnica.",
                "Obtén tu diploma de actualización profesional con validez institucional."
            ],
            "resultadoObtenido": "Diploma de capacitación acreditado por la Superintendencia de Administración Tributaria.",
            "tiempoEstimado": "Autogestionado en línea",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "La capacitación periódica del personal aduanero es una práctica valorada positivamente en los procesos de certificación OEA.",
            "normativa": "Ley Orgánica de la SAT Artículo 3."
        },
        "SAT-GES-0495": {
            "nombreActual": "Consultar preguntas frecuentes sobre operaciones aduaneras en ZDEEP",
            "descripcion": "Resuelve dudas recurrentes sobre exenciones fiscales, contratación de personal, plazos de permanencia de materias primas y ventas al mercado local en ZDEEP. Proporciona respuestas institucionales en lenguaje claro y accesible.",
            "requisitos": [
                "Dispositivo con acceso a internet para consultar la base de conocimiento institucional de preguntas frecuentes."
            ],
            "documentos": [
                "No requiere documentos; es una guía de orientación en línea."
            ],
            "pasos": [
                "Ingresa a la sección 'Preguntas Frecuentes' en el apartado de Aduanas del Portal SAT.",
                "Navega hacia el tópico de Zonas de Desarrollo Económico Especial Público.",
                "Lee las respuestas oficiales con sus respectivos fundamentos legales.",
                "Si tu consulta es compleja, plantea una solicitud formal de criterio técnico ante la intendencia."
            ],
            "resultadoObtenido": "Orientación técnica inmediata sobre procedimientos y criterios habituales de la administración tributaria y aduanera.",
            "tiempoEstimado": "Inmediato (consulta pública)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Las respuestas del portal son de carácter informativo; en caso de controversia prevalece el texto de las leyes y resoluciones formales.",
            "normativa": "Código Tributario Artículo 101; Decreto 22-73 reformado."
        },
        "SAT-GES-0710": {
            "nombreActual": "Consultar preguntas frecuentes sobre normativas de comercio en Zonas Especiales",
            "descripcion": "Consulta criterios oficiales sobre traslados de mercancías, destrucción de desperdicios y cálculo de impuestos para ventas locales desde ZDEEP. Brinda claridad a contadores y gerentes de operaciones en zonas francas.",
            "requisitos": [
                "Conexión a internet para acceder al repositorio de preguntas y respuestas del Portal SAT."
            ],
            "documentos": [
                "No requiere documentación física."
            ],
            "pasos": [
                "Accede al módulo de preguntas frecuentes en el portal aduanero SAT.",
                "Filtra por la categoría de Regímenes Territoriales y Zonas Especiales.",
                "Consulta los lineamientos oficiales para la liquidación de tributos en despachos locales.",
                "Aplica los criterios institucionales para evitar reparos tributarios."
            ],
            "resultadoObtenido": "Información oficial y directa sobre el régimen operativo de zonas francas.",
            "tiempoEstimado": "Inmediato (en línea)",
            "costo": "Gratuito (Q0.00)",
            "advertencia": "Ante inconsistencias contables o tributarias, solicita asesoría personalizada en la Unidad de Regímenes Especiales de la SAT.",
            "normativa": "Decreto 22-73; Decreto 30-2018."
        },
        "SAT-GES-0711": {
            "nombreActual": "Consultar recursos administrativos y defensas tributarias en ZDEEP",
            "descripcion": "Conoce los plazos legales, formalidades y procedimientos para interponer recursos de revocatoria contra ajustes tributarios o sanciones aduaneras en ZDEEP. Garantiza la defensa técnica y el debido proceso de las empresas usuarias ante la SAT.",
            "requisitos": [
                "Resolución o acto administrativo sancionatorio notificado legalmente.",
                "Estar dentro del plazo perentorio de 10 días hábiles posteriores a la notificación para impugnar.",
                "Acreditar personería con nombramiento vigente del representante legal."
            ],
            "documentos": [
                "Cédula de notificación del acto o resolución que se impugna.",
                "Memorial formal de interposición del recurso de revocatoria con firma y auxilio de abogado colegiado activo.",
                "Documentación probatoria, contratos de usuario y registros contables de respaldo."
            ],
            "pasos": [
                "Revisa la cédula de notificación y calcula con exactitud el término legal de 10 días hábiles para recurrir.",
                "Elabora el memorial de revocatoria detallando los agravios y las normas infringidas con asesoría jurídica.",
                "Presenta el expediente en la aduana de jurisdicción o en la ventanilla de recepción de la SAT.",
                "Da seguimiento a la tramitación de los autos hasta la resolución definitiva por el Directorio de la SAT."
            ],
            "resultadoObtenido": "Admisión formal del recurso de revocatoria con suspensión de cobro hasta la resolución firme en vía administrativa.",
            "tiempoEstimado": "30 a 60 días hábiles",
            "costo": "Gratuito ante SAT (honorarios profesionales privados)",
            "advertencia": "No presentar el recurso dentro del plazo legal causa la firmeza del acto administrativo e inicia el cobro ejecutivo judicial inmediato con embargo de bienes.",
            "normativa": "CAUCA Artículo 127; Código Tributario Artículo 154; Ley de lo Contencioso Administrativo Artículo 7."
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

    print(f"Enriched {updated_count} ZDEEP items.")

    with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    enrich_zdeep()
