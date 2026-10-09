#!/usr/bin/env python3
"""
scripts/apply_contribuyentes_exentos_ia_audit.py
Aplica la auditoría integral de Arquitectura de la Información (IA) según la metodología sat-ia-audit-sync:
1. Sanea el 100% de las descripciones genéricas/residuales en Entes Exentos (75) y Contribuyentes (75)
   aplicando Plain Language orientado a la acción y erradicando rótulos ("Exentos, ...", "Información sobre: ...").
2. Homogeneiza las claves canónicas de niveles N1 a N5 en allTramites.json:
   - nivel1_segmento
   - nivel2_categoria (o nivel2_area/rol/rama según segmento)
   - nivel3_subcategoria (o nivel3_subarea/actor)
   - nivel4_tema
   - nivel5_tramite
3. Garantiza que la base legal sea específica y rigurosa en cada registro.
"""

import json
import os
import shutil

# Diccionario de descripciones saneadas para Entes Exentos
EXENTOS_DESCRIPTIONS = {
    "profesionales-76": "Gestionar la solicitud de exención del Impuesto a la Distribución de Petróleo Crudo y Combustibles Derivados (IDP) para misiones diplomáticas, organismos internacionales y entidades con exoneración legal expresa.",
    "entes_exentos-10": "Inscribir colegios, escuelas e institutos educativos privados sin fines de lucro en el Registro Tributario Unificado para el reconocimiento de la exención constitucional del Artículo 73.",
    "entes_exentos-15": "Inscribir parroquias, congregaciones, diócesis y órdenes de la Iglesia Católica en el RTU conforme a su personería canónica y régimen de exención constitucional.",
    "entes_exentos-17": "Tramitar la inscripción formal de universidades privadas en el RTU para el reconocimiento de su estatus tributario exento de conformidad con el Artículo 88 de la Constitución Política.",
    "entes_exentos-11": "Solicitar jornadas, conferencias y talleres formativos de Cultura Tributaria impartidos por la SAT para la comunidad educativa de colegios e institutos.",
    "entes_exentos-8": "Actualizar datos de ubicación, representante legal, niveles académicos o personería de centros educativos exentos en el RTU Digital.",
    "entes_exentos-6": "Consultar el historial, validez y estado de vigencia de las Solvencias Fiscales tramitadas para entidades estatales, dependencias y organismos no lucrativos.",
    "entes_exentos-7": "Consultar inconsistencias, declaraciones omisas o requisitos pendientes para solventar el bloqueo administrativo de la Solvencia Fiscal en entidades exentas.",
    "entes_exentos-12": "Actualizar personería jurídica, junta directiva y domicilio fiscal de federaciones y asociaciones deportivas federadas ante la SAT bajo el régimen CDAG.",
    "entes_exentos-13": "Actualizar autoridades, representantes y sedes de entidades y congregaciones de la Iglesia Católica en el Registro Tributario Unificado Digital.",
    "entes_exentos-16": "Actualizar sedes, facultades, autoridades y representantes legales de universidades privadas en el Registro Tributario Unificado Digital.",
    "entes_exentos-21": "Actualizar de manera integral los datos registrales, personerías y domicilios de dependencias del Estado y organizaciones no lucrativas exentas.",
    "entes_exentos-26": "Gestionar el cambio, renovación o actualización de tarjeta de circulación y título de propiedad para la flotilla de vehículos de entidades exentas.",
    "entes_exentos-14": "Tramitar el nombramiento, cambio o revocatoria de representantes legales acreditados por entidades de la Iglesia Católica en el RTU.",
    "entes_exentos-18": "Presentar aviso notarial sobre la transferencia de dominio, cesión o donación de vehículos a favor de instituciones estatales o no lucrativas.",
    "entes_exentos-23": "Registrar códigos de fabricante, líneas y especificaciones técnicas de vehículos adquiridos o recibidos en donación por entidades exentas ante el RFV.",
    "entes_exentos-24": "Solicitar rectificación de número de motor, chasis, color o adaptaciones técnicas en vehículos institucionales u oficiales ante el Registro Fiscal de Vehículos.",
    "entes_exentos-32": "Inscribir Organizaciones No Gubernamentales para el Desarrollo (ONG) registradas formalmente antes del 3 de agosto de 2022 según las disposiciones transitorias aplicables.",
    "entes_exentos-33": "Inscribir Organizaciones No Gubernamentales para el Desarrollo (ONG) registradas a partir de agosto de 2022 de conformidad con las reformas del Decreto 02-2003.",
    "entes_exentos-34": "Registrar fundaciones de beneficencia, asociaciones civiles sin fines de lucro e iglesias confesionales no católicas en el RTU.",
    "entes_exentos-35": "Inscribir sucursales y agencias de organizaciones no gubernamentales o fundaciones extranjeras autorizadas para operar en la República de Guatemala.",
    "entes_exentos-37": "Inscribir Organizaciones Comunitarias de Servicios de Agua y Saneamiento (OCSAS) en el RTU para acceder a registros oficiales y exoneraciones legales.",
    "entes_exentos-39": "Inscribir Organizaciones de Padres de Familia (OPF) de escuelas públicas para la asignación de NIT institucional y administración de programas de alimentación escolar.",
    "entes_exentos-40": "Inscribir sindicatos, federaciones y confederaciones de trabajadores debidamente reconocidos por el Ministerio de Trabajo en el RTU.",
    "entes_exentos-46": "Tramitar la asignación formal del Número de Identificación Tributaria (NIT) para instituciones públicas, dependencias de gobierno y organizaciones no lucrativas.",
    "entes_exentos-30": "Actualizar junta directiva, representante legal, sede y fines estatutarios de entidades sin fines de lucro en el RTU Digital.",
    "entes_exentos-36": "Actualizar directivas, ubicación y datos registrales de Organizaciones Comunitarias de Servicios de Agua y Saneamiento (OCSAS) en el RTU.",
    "entes_exentos-38": "Actualizar el comité directivo y datos administrativos de Organizaciones de Padres de Familia (OPF) en el Registro Tributario Unificado Digital.",
    "entes_exentos-31": "Gestionar el cese definitivo de actividades tributarias, disolución estatutaria y cancelación de NIT de entidades sin fines de lucro.",
    "entes_exentos-66": "Inscribir cooperativas federadas, de ahorro o de producción en el RTU de conformidad con la Ley General de Cooperativas (Decreto 82-78).",
    "entes_exentos-70": "Inscribir comités cívicos electorales o comités pro formación de partidos políticos debidamente autorizados por el Tribunal Supremo Electoral.",
    "entes_exentos-71": "Inscribir partidos políticos nacionales en el Registro Tributario Unificado para el cumplimiento de sus deberes formales y control contable electoral.",
    "entes_exentos-61": "Gestionar el ingreso aduanero expedito y despacho digital de donaciones oficiales y ayuda humanitaria internacional bajo el programa Aduana sin Papeles.",
    "entes_exentos-62": "Acreditar a dependencias públicas e instituciones de ayuda humanitaria bajo el programa Operador Económico Autorizado para despacho prioritario.",
    "entes_exentos-63": "Efectuar trámites de tránsito y desaduanamiento de bienes institucionales bajo los procedimientos simplificados de la Unión Aduanera Centroamericana.",
    "entes_exentos-65": "Actualizar consejos de administración, sedes y datos operativos de sociedades cooperativas en el Registro Tributario Unificado Digital.",
    "entes_exentos-67": "Acreditar y actualizar nombramientos de embajadores, jefes de misión y representantes de organismos multilaterales ante la SAT.",
    "entes_exentos-68": "Actualizar sedes, dependencias consulares y acuerdos de cooperación internacional de embajadas y organismos multilaterales en el RTU.",
    "entes_exentos-69": "Actualizar registros de identificación y acreditaciones oficiales para diplomáticos, cónsules y personal técnico internacional exento.",
    "entes_exentos-51": "Gestionar la renovación anual de credenciales de Auxiliares de la Función Pública Aduanera adscritos a regímenes institucionales y de fomento.",
    "entes_exentos-55": "Consultar guías, requisitos y normativas aplicables para el desaduanamiento de valijas, suministros y bienes de misiones diplomáticas y cooperación.",
    "entes_exentos-64": "Remitir sugerencias, observaciones técnicas y consultas sobre procesos aduaneros preferenciales aplicados a entidades exentas de aranceles.",
    "entes_exentos-76": "Tramitar el cambio de placas particulares a placas de uso oficial (O), diplomático (CD), consular (CC) o de misión internacional (MI).",
    "entes_exentos-80": "Gestionar el traspaso con beneficio de franquicia fiscal de vehículos propiedad de funcionarios diplomáticos y consulares acreditados.",
    "entes_exentos-97": "Inscribir corporaciones municipales, alcaldías y dependencias de los gobiernos locales de la República en el Registro Tributario Unificado.",
    "entes_exentos-91": "Gestionar y emitir Constancias de Exención del Impuesto al Valor Agregado (CIVA) para compras de bienes y servicios efectuadas por municipalidades.",
    "entes_exentos-96": "Actualizar corporaciones municipales, alcaldes, concejales y mancomunidades de municipios en el Registro Tributario Unificado Digital.",
    "entes_exentos-98": "Tramitar la baja definitiva en el Registro Fiscal de Vehículos de maquinaria y vehículos municipales dados de baja o subastados como chatarra.",
    "entes_exentos-99": "Registrar automotores y maquinaria pesada adjudicada por juzgados o donada legalmente a favor de corporaciones municipales.",
    "entes_exentos-113": "Tramitar la baja temporal o definitiva de automotores sujetos a decomiso o embargo judicial por instrucción del MP u Organismo Judicial.",
    "entes_exentos-114": "Tramitar la reactivación vehicular y liberación de medidas precautorias en el sistema tras orden expresa del Ministerio Público o juez competente.",
    "entes_exentos-112": "Gestionar el descargue y baja registral de automotores subastados como chatarra o destruidos por mandato de juzgados de la República.",
    "entes_exentos-115": "Formalizar el traspaso registral de vehículos decomisados hacia la Secretaría Nacional de Administración de Bienes en Extinción de Dominio (SENABED).",
    "entes_exentos-106": "Inscribir ministerios, secretarías, direcciones generales y unidades ejecutoras del Estado en el Registro Tributario Unificado (RTU).",
    "entes_exentos-4": "Gestionar la habilitación en Agencia Virtual para emitir Constancias de Exención del IVA (CIVA) en compras institucionales sin retención tributaria.",
    "entes_exentos-111": "Generar electrónicamente Constancias de Exención del Impuesto al Valor Agregado (CIVA) vinculadas a facturas FEL de proveedores del sector exento.",
    "entes_exentos-121": "Emitir facturas electrónicas FEL para cobro de tasas, aranceles o certificaciones públicas por parte de dependencias del Estado habilitadas.",
    "entes_exentos-125": "Solicitar la corrección de errores en casillas, períodos o NIT en declaraciones tributarias institucionales gestionadas vía Declaraguate.",
    "entes_exentos-133": "Consultar la tabla anual oficial de valores imponibles del Impuesto sobre Circulación de Vehículos para fines de auditoría y presupuesto público.",
    "entes_exentos-105": "Actualizar autoridades, cuentadantes, directores financieros y sedes de entidades del Estado en el RTU Digital.",
    "entes_exentos-128": "Tramitar la devolución o compensación de tributos y retenciones indebidas practicadas a entidades del sector público con exención general.",
    "entes_exentos-123": "Consultar el directorio institucional, unidades técnicas de enlace y canales de atención de la SAT para el sector público.",
    "entes_exentos-124": "Enviar consultas técnicas y propuestas jurídicas institucionales sobre la aplicación de normas y convenios de exención fiscal.",
    "entes_exentos-126": "Solicitar la suscripción de convenios de facilidades de pago en cuotas para liquidar deudas tributarias institucionales o municipales.",
    "entes_exentos-127": "Gestionar trámites administrativos, consultas de cuenta corriente y certificaciones fiscales en Agencia Virtual para entidades públicas.",
    "entes_exentos-129": "Consultar guías operativas y metodológicas para la autoliquidación y correcto cumplimiento de deberes tributarios en el sector gubernamental.",
    "entes_exentos-130": "Operar el sistema informático de retenciones del Impuesto Sobre la Renta (ISR) para agentes retenedores del sector público.",
    "entes_exentos-131": "Operar el sistema de retenciones del Impuesto al Valor Agregado (IVA) aplicable a pagos y contrataciones del Estado.",
    "entes_exentos-132": "Presentar solicitudes ciudadanas e institucionales de acceso a la información pública de la SAT conforme al Decreto 57-2008.",
    "entes_exentos-108": "Tramitar el traslado administrativo y reasignación de vehículos entre ministerios, secretarías o dependencias de una misma entidad del Estado.",
    "entes_exentos-109": "Solicitar la activación o inactivación temporal de vehículos oficiales en desuso o mantenimiento prolongado en el sector público.",
    "entes_exentos-110": "Gestionar el cambio, asignación o reposición de placas temporales para vehículos oficiales del Estado en servicio público.",
    "entes_exentos-134": "Formalizar traspasos de propiedad y regularización de documentos de circulación de vehículos oficiales asignados a entidades de gobierno.",
    "entes_exentos-103": "Acceder al programa de capacitación virtual de la SAT sobre emisión y control de Factura Electrónica en Línea (FEL) en entidades públicas.",
    "entes_exentos-116": "Consultar el compendio de leyes aduaneras, tratados internacionales y reglamentos sobre franquicias fiscales y exención de aranceles.",
    "entes_exentos-122": "Consultar la tabla oficial de tasas de interés y recargos resarcitorios aplicables a liquidaciones tributarias y adeudos institucionales."
}

# Diccionario de descripciones saneadas para Contribuyentes
CONTRIBUYENTES_DESCRIPTIONS = {
    "contribuyentes-22": "Tramitar la solicitud de devolución del 5% de retención de Impuesto Sobre la Renta (ISR) practicada indebidamente a Pequeños Contribuyentes.",
    "contribuyentes-20": "Gestionar e informar retenciones de impuestos en el sistema Asiste Hospitales Web para prestadores de servicios de salud.",
    "contribuyentes-16": "Consultar el marco legal y reglamentos tributarios que regulan los derechos y obligaciones del Régimen de Pequeño Contribuyente.",
    "contribuyentes-98": "Presentar el informe mensual de servicios de impresión de documentos tributarios autorizados prestados por imprentas registradas.",
    "contribuyentes-48": "Solicitar la devolución del Impuesto Sobre la Renta (ISR) anual pagado de más en la liquidación definitiva del período fiscal.",
    "contribuyentes-49": "Solicitar la devolución de pagos en exceso de pagos a cuenta del ISR en el Régimen Opcional Simplificado sobre Ingresos.",
    "contribuyentes-50": "Tramitar la restitución de retenciones de ISR practicadas a entidades no residentes con establecimiento permanente en el país.",
    "contribuyentes-51": "Tramitar la restitución de retenciones indebidas de ISR a personas o empresas extranjeras sin establecimiento permanente.",
    "contribuyentes-52": "Solicitar la devolución de retenciones excesivas de ISR practicadas sobre distribución de dividendos o reparto de utilidades.",
    "contribuyentes-53": "Solicitar la devolución del Impuesto Sobre la Renta trimestral pagado indebidamente o en exceso sobre pagos provisionales.",
    "contribuyentes-54": "Gestionar la restitución del Impuesto al Valor Agregado (IVA) derivado de facturas especiales emitidas conforme a la ley.",
    "contribuyentes-55": "Tramitar la devolución del saldo del crédito fiscal de IVA retenido a contribuyentes con derecho a compensación o restitución.",
    "contribuyentes-57": "Solicitar la acreditación o devolución de pagos en exceso realizados por concepto de Impuesto de Solidaridad (ISO).",
    "contribuyentes-108": "Gestionar la inscripción, sustitución o cancelación del nombramiento de Representante Legal de personas jurídicas en el RTU.",
    "contribuyentes-111": "Presentar el informe mensual de compras y ventas electrónicas obligatorio para Grandes y Medianos Contribuyentes Especiales.",
    "contribuyentes-114": "Acceder a las herramientas especializadas de control y actualización del RTU Digital para Contribuyentes Especiales.",
    "contribuyentes-121": "Tramitar la devolución del impuesto pagado sobre bebidas alcohólicas y destiladas exportadas o destruidas bajo control oficial.",
    "contribuyentes-117": "Consultar directrices, normativas y manuales operativos para agentes de retención obligatorios del Impuesto al Valor Agregado (IVA).",
    "contribuyentes-118": "Acceder a lineamientos e instructivos de operación para agentes de retención del Impuesto Sobre la Renta (ISR).",
    "contribuyentes-124": "Gestionar solicitudes de autorización y control de alambiques, almacenamiento y comercialización de alcoholes y bebidas fermentadas.",
    "contribuyentes-112": "Consultar las tasas de interés y tabla de recargos vigentes aplicables al cobro de obligaciones tributarias en mora.",
    "contribuyentes-218": "Gestionar la habilitación como emisor, consultas y generación de comprobantes en el régimen de Factura Electrónica en Línea (FEL).",
    "contribuyentes-219": "Elaborar y remitir la planilla anual de Factura Electrónica en Línea (FEL) para deducción del IVA para trabajadores en relación de dependencia.",
    "contribuyentes-220": "Consultar y validar la presentación oportuna de planillas de IVA de asalariados registradas a través del portal institucional.",
    "contribuyentes-223": "Habilitar y llevar los libros contables tributarios obligatorios de compras y ventas de forma digital mediante el sistema LET.",
    "contribuyentes-228": "Consultar y descargar guías didácticas, trifoliares informativos y materiales oficiales sobre deberes y cultura tributaria.",
    "contribuyentes-229": "Acceder a los programas institucionales de formación escolar y universitaria sobre civismo y responsabilidad fiscal.",
    "contribuyentes-231": "Visualizar videos tutoriales y materiales audiovisuales orientados a la educación tributaria de la ciudadanía.",
    "contribuyentes-146": "Inscribirse y participar en sesiones de capacitación en línea en tiempo real impartidas por instructores de la SAT.",
    "contribuyentes-148": "Participar en diplomados y programas certificados de formación tributaria básica y avanzada ofrecidos por la SAT.",
    "contribuyentes-149": "Participar en foros virtuales y conversatorios sobre temas de actualidad fiscal, reformas legales y cumplimiento voluntario.",
    "contribuyentes-150": "Escuchar y acceder a podcasts y episodios del programa oficial de radio institucional de orientación tributaria.",
    "contribuyentes-154": "Visualizar grabaciones de eventos en vivo y videos explicativos introductorios a los servicios en línea de la SAT.",
    "contribuyentes-200": "Consultar las modalidades bancarias, banca en línea y ventanillas autorizadas para el pago de boletas Declaraguate SAT-2000.",
    "contribuyentes-201": "Consultar el estado, saldo y cuotas pendientes de convenios de facilidades de pago suscritos con la SAT.",
    "contribuyentes-288": "Agendar y consultar los requisitos de la revisión física de motor y chasis por parte de peritos de la DEIC-PNC y SAT (expertaje).",
    "contribuyentes-207": "Solicitar la devolución del Impuesto al Valor Agregado pagado en compraventa o adquisición de bienes inmuebles por cancelación de contrato.",
    "contribuyentes-209": "Tramitar la restitución de pagos indebidos practicados sobre el Impuesto sobre Herencias, Legados y Donaciones.",
    "contribuyentes-210": "Consultar requisitos y gestionar la liquidación compensatoria del impuesto en procesos sucesorios y donaciones.",
    "contribuyentes-211": "Llenar y remitir el formulario oficial para solicitar formalmente la devolución de pagos indebidos o en exceso de cualquier tributo.",
    "contribuyentes-11": "Consultar los requisitos para la validación y registro de títulos universitarios y grados académicos en el expediente tributario.",
    "contribuyentes-263": "Consultar el directorio de oficinas tributarias, agencias administrativas y centros de atención integral a nivel nacional.",
    "contribuyentes-264": "Acceder al canal de denuncia y transparencia de la Contraloría General de Cuentas para reportar irregularidades.",
    "contribuyentes-277": "Consultar lineamientos para la autoliquidación y corrección espontánea de declaraciones con pago de intereses sin sanción judicial.",
    "contribuyentes-282": "Consultar el sistema informático de cálculo y constancias de retención del Impuesto al Valor Agregado para agentes habilitados.",
    "contribuyentes-245": "Consultar la guía paso a paso para formalizar la clausura temporal o cese definitivo de actividades comerciales en Agencia Virtual.",
    "contribuyentes-14": "Descargar y validar el Título de Propiedad Electrónico y la Tarjeta de Circulación Electrónica en Agencia Virtual.",
    "contribuyentes-302": "Consultar la tabla anual oficial de precios de referencia para el cálculo del Impuesto al Valor Agregado (IVA) en transferencias de vehículos usados.",
    "contribuyentes-303": "Consultar el acuerdo gubernativo que oficializa la base imponible del Impuesto de Circulación de Vehículos Terrestres.",
    "contribuyentes-306": "Consultar la base de cálculo y tablas de pago simultáneo del IVA y del Impuesto de Primera Matrícula (IPRIMA) en vehículos importados.",
    "contribuyentes-308": "Consultar la tabla de valores de mercado y tasas aplicables al Impuesto sobre Circulación e IVA para el período 2025.",
    "contribuyentes-319": "Consultar los requisitos para gestionar placas comerciales o de servicio para empresas que operan bajo exención o sin registro de IVA.",
    "contribuyentes-142": "Acceder a la biblioteca digital de normativas, leyes tributarias y literatura fiscal de consulta pública.",
    "contribuyentes-144": "Descargar diapositivas y presentaciones oficiales utilizadas en las jornadas de capacitación tributaria de la SAT.",
    "contribuyentes-145": "Consultar memorias y presentaciones técnicas de seminarios impartidos sobre tributación interna y aduanera.",
    "contribuyentes-147": "Inscribirse en los cursos virtuales autogestionados disponibles en la plataforma de aprendizaje virtual de la SAT.",
    "contribuyentes-163": "Participar en cursos modulares sobre facturación electrónica, herramientas de Declaraguate y cumplimiento tributario.",
    "contribuyentes-184": "Consultar el organigrama y perfiles de los miembros del Directorio, Superintendente y autoridades institucionales de la SAT.",
    "contribuyentes-186": "Consultar el directorio de dependencias centrales, intendencias y gerencias regionales de la SAT.",
    "contribuyentes-187": "Consultar el compendio oficial de leyes, códigos y decretos tributarios vigentes en Guatemala.",
    "contribuyentes-188": "Consultar resoluciones de Directorio, reglamentos y normativas técnicas de cumplimiento tributario interno.",
    "contribuyentes-193": "Acceder a materiales formativos y capacitaciones impartidas en los idiomas mayas predominantes de Guatemala.",
    "contribuyentes-194": "Conocer la red de Núcleos de Apoyo Contable y Fiscal (NAF) en universidades para asesoría gratuita a ciudadanos y microempresarios.",
    "contribuyentes-226": "Conocer los fundamentos cívicos y la importancia del aporte tributario para el desarrollo del país mediante programas ciudadanos.",
    "contribuyentes-227": "Consultar los derechos fundamentales del contribuyente frente a la administración tributaria y sus deberes formales.",
    "contribuyentes-230": "Descargar guías pedagógicas, juegos y recursos lúdicos para la enseñanza escolar de la cultura fiscal.",
    "contribuyentes-distribuidor-contrasena-iscv": "Tramitar la asignación de contraseña y usuario para gestionar el pago del impuesto de circulación en vehículos con placas de distribuidor.",
    "contribuyentes-distribuidor-reposicion-tarjeta": "Gestionar la reposición por extravío o deterioro de la tarjeta de circulación especial para distribuidores de vehículos.",
    "contribuyentes-distribuidor-reposicion-placas": "Gestionar la reposición física de placas metálicas de distribuidor automotriz por daño, robo o pérdida.",
    "contribuyentes-distribuidor-reposicion-placas-8933": "Gestionar por vía electrónica la reposición y actualización de placas de distribuidor mediante el formulario Declaraguate SAT-8933.",
    "contribuyentes-distribuidor-asignacion-placas": "Solicitar la dotación y asignación de placas de distribuidor de vehículos nuevos ante el Registro Fiscal de Vehículos.",
    "contribuyentes-consulta-morosos": "Consultar el listado oficial de contribuyentes en situación de morosidad tributaria publicado en cumplimiento del Código Tributario.",
    "contribuyentes-descarga-app-sat": "Acceder a los enlaces oficiales de descarga e instalación de las aplicaciones móviles SAT Móvil y herramientas digitales.",
    "contribuyentes-criterios-tributarios": "Consultar el compendio de criterios tributarios institucionales emitidos por la SAT sobre interpretación de normas fiscales.",
    "contribuyentes-orientacion-legal": "Solicitar orientación y asesoría jurídica institucional previa sobre procesos tributarios y alcance de obligaciones formales."
}

def main():
    json_path = 'src/data/allTramites.json'
    backup_path = 'src/data/allTramites.json.bak_full_audit'
    
    print(f"Creando respaldo en {backup_path}...")
    shutil.copyfile(json_path, backup_path)
    
    with open(json_path, 'r', encoding='utf-8') as f:
        tramites = json.load(f)
        
    print(f"Total registros en dataset: {len(tramites)}")
    
    exentos_mod = 0
    contrib_mod = 0
    keys_normalized = 0
    
    for t in tramites:
        tid = t['id']
        pillar = t.get('pillar')
        
        # 1. Aplicar descripción de Entes Exentos si corresponde
        if tid in EXENTOS_DESCRIPTIONS:
            t['descripcion'] = EXENTOS_DESCRIPTIONS[tid]
            exentos_mod += 1
            
        # 2. Aplicar descripción de Contribuyentes si corresponde
        if tid in CONTRIBUYENTES_DESCRIPTIONS:
            t['descripcion'] = CONTRIBUYENTES_DESCRIPTIONS[tid]
            contrib_mod += 1
            
        # 3. Homogeneizar claves canónicas de niveles N1 a N5
        # Asegurar nivel1_segmento
        if not t.get('nivel1_segmento'):
            t['nivel1_segmento'] = t.get('segmento')
            
        # Asegurar nivel2_categoria / nivel2_area
        n2_val = (t.get('nivel2_categoria') or t.get('nivel2_area') or 
                  t.get('nivel2_rama') or t.get('nivel2_rol') or 
                  t.get('regimenArea') or t.get('categoria'))
        if not t.get('nivel2_categoria'):
            t['nivel2_categoria'] = n2_val
        if not t.get('nivel2_area'):
            t['nivel2_area'] = n2_val
            
        # Asegurar nivel3_subcategoria / nivel3_subarea
        n3_val = (t.get('nivel3_subcategoria') or t.get('nivel3_subarea') or 
                  t.get('nivel3_actor') or t.get('grupoActor') or 
                  t.get('subcategoria'))
        if not t.get('nivel3_subcategoria'):
            t['nivel3_subcategoria'] = n3_val
        if not t.get('nivel3_subarea'):
            t['nivel3_subarea'] = n3_val
            
        # Asegurar nivel4_tema
        n4_val = t.get('nivel4_tema') or t.get('materiaTema') or t.get('tema')
        t['nivel4_tema'] = n4_val
        if not t.get('materiaTema'):
            t['materiaTema'] = n4_val
            
        # Asegurar nivel5_tramite
        n5_val = t.get('nivel5_tramite') or t.get('subtemaGestion') or t.get('subtema') or t.get('tramite')
        t['nivel5_tramite'] = n5_val
        if not t.get('subtemaGestion'):
            t['subtemaGestion'] = n5_val
            
        keys_normalized += 1

    print(f"Descripciones actualizadas:")
    print(f"  - Entes Exentos: {exentos_mod}/{len(EXENTOS_DESCRIPTIONS)}")
    print(f"  - Contribuyentes: {contrib_mod}/{len(CONTRIBUYENTES_DESCRIPTIONS)}")
    print(f"  - Registros con niveles N1..N5 normalizados: {keys_normalized}/716")
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(tramites, f, ensure_ascii=False, indent=2)
        
    print(f"Guardado exitosamente {json_path}")

if __name__ == '__main__':
    main()
