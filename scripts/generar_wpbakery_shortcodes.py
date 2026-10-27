"""
generar_wpbakery_shortcodes.py  v5 (100% Cero [vc_raw_html] — Sincronizado con allTramites.json + Hallazgos A y B)
==================================================================================================================
Genera todos los shortcodes oficiales de WPBakery + The7 Classic para el Portal SAT Guatemala,
sin utilizar en ningún caso [vc_raw_html] ni bloques de HTML crudo prohibidos.

Fuente canónica única (Single Source of Truth):
  - src/data/allTramites.json (714 gestiones canónicas con orden_n1..orden_n5 y orden_contenido)

Reglas aplicadas (AGENTS.md & DESIGN_RULES.md):
  - Prohibición estricta de [vc_raw_html] -> Uso exclusivo de elementos nativos de WPBakery y The7
    ([vc_row], [vc_column], [bsf-info-box], [vc_tta_tabs], [vc_message], [vc_custom_heading], [vc_column_text]).
  - Estructura estrictamente numérica (Nivel 1 a Nivel 5), sin nombres conceptuales inventados.
  - Prohibición estricta de la palabra "trámite" / "trámites" -> Uso obligatorio de "gestión" / "gestiones".
  - Regla del Guion Largo (—):
      · Si nivel3 == "—" (ej. Sin Obligaciones, OEA, Auditores, Servicios Profesionales, Municipalidades),
        las gestiones se listan directamente en la página N2_<slug>.txt (sin crear subcarpetas vacías ni N3_.txt).
      · Si nivel4 == "—" (ej. Contribuyente General > Regímenes tributarios, Agentes Aduaneros, etc.),
        las gestiones se listan directamente en la página N3_<slug>.txt.
  - Capacidad de Miller (7±2) y orden cronológico del ciclo de vida ATO (orden_contenido).
  - Páginas Universales Conectadas en 3 Pasos (/solicitar-nit/ y /actualizar-rtu/) sin [vc_raw_html].
"""

import json
import re
import shutil
import sys
import urllib.parse
from collections import OrderedDict
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).parent.parent
TRAMITES_JSON = BASE_DIR / "src" / "data" / "allTramites.json"
OUTPUT_DIR = BASE_DIR / "docs" / "plantillas-wpbakery"

CSS_CLASS = {
    "Contribuyentes": "sat-seccion-contribuyentes",
    "Operadores de Comercio Exterior": "sat-seccion-comercio-exterior",
    "Profesionales": "sat-seccion-profesionales",
    "Entes Exentos": "sat-seccion-entes-exentos",
}

N1_SLUGS = {
    "Contribuyentes": "contribuyentes",
    "Operadores de Comercio Exterior": "operadores-de-comercio-exterior",
    "Profesionales": "profesionales",
    "Entes Exentos": "entes-exentos",
}

# Descripciones ciudadanas curadas para tarjetas de Nivel 2, Nivel 3 y Nivel 4
CURATED_DESCRIPTIONS = {
    # Nivel 2
    "Sin Obligaciones": "Obtén tu primer Número de Identificación Tributaria (NIT), actualiza tus datos personales, emite tu Solvencia Fiscal o registra tu título universitario sin tener negocio activo.",
    "Pequeños Contribuyentes": "Factura Electrónica en Línea (FEL), declaraciones mensuales del 5%, régimen electrónico y facilidades para productores del sector primario.",
    "Contribuyente General": "Inscripción y actualización en el Registro Tributario Unificado (RTU), Factura Electrónica en Línea (FEL), declaraciones de IVA e ISR, vehículos y servicios al contribuyente.",
    "Contribuyentes Especiales": "Atención especializada en gerencias diferenciadas, informes de precios de transferencia, estados financieros auditados y cumplimiento corporativo.",
    "Importadores": "Inscripción en el padrón de importadores, Declaración Única Centroamericana (DUCA - Aduanas), despacho, levante e importación de vehículos.",
    "Exportadores": "Padrón de exportadores, declaraciones aduaneras de embarque y solicitud de devolución de crédito fiscal del Impuesto al Valor Agregado (IVA).",
    "Operador Económico Autorizado (OEA)": "Certificación en seguridad logística de la cadena de suministro y beneficios de facilitación aduanera.",
    "Auxiliares de la Función Pública Aduanera (AFPA)": "Habilitación, carnés, fianzas y operaciones para agentes aduaneros, apoderados, depósitos, couriers y transportistas.",
    "Regímenes Territoriales y Zonas Especiales": "Operación aduanera y fiscal para empresas calificadas bajo Maquilas (Decreto 29-89) y Zonas de Desarrollo Económico Especial Público (ZDEEP).",
    "Normativa y Operaciones Aduaneras Generales": "Consulta del Sistema Arancelario Centroamericano (SAC), acuerdos comerciales, prevención de contrabando, criterios técnicos y modernización aduanera.",
    "Abogados y Notarios": "Habilitación notarial, compra de papel sellado de protocolo, timbres fiscales, traspaso electrónico vehicular (e-Traspaso) y avisos notariales.",
    "Peritos Contadores": "Inscripción y actualización en el registro de peritos contadores, autorización de libros contables y consultas de retenciones.",
    "Auditores": "Habilitación de Contador Público y Auditor (CPA), emisión de dictámenes de crédito fiscal y solvencia para auditorías tributarias.",
    "Gestores Tributarios": "Acreditación oficial, emisión y renovación anual de carnés y gafetes para realizar gestiones en representación de terceros.",
    "Servicios Profesionales": "Facturación electrónica por honorarios, actualización de actividad profesional en el Registro Tributario Unificado (RTU), consultas vinculantes y sistemas de retención.",
    "Entidades del Estado": "Unidades ejecutoras estatales en el Registro Tributario Unificado (RTU), Factura Electrónica en Línea (FEL), retenciones en compras públicas, solvencias y parque vehicular oficial.",
    "Constitucionales": "Registro, exenciones de impuestos, constancias y vehículos para centros educativos, universidades, iglesias y confederaciones deportivas.",
    "No Lucrativos": "Inscripción en el Registro Tributario Unificado (RTU), reconocimiento de exención de impuestos, constancias de exención del IVA (CIVA) y actualización de asociaciones.",
    "Municipalidades": "Registro de corporaciones municipales y autoridades ediles en el Registro Tributario Unificado (RTU), exención para flotillas municipales y solvencias institucionales.",
    "Decreto": "Exenciones y franquicias para misiones diplomáticas, organismos internacionales, cooperativas, partidos políticos y donaciones oficiales.",

    # Nivel 3 — Contribuyentes
    "Régimen de Pequeño Contribuyente": "Inscripción, cambio al régimen electrónico del 4% o general del 5%, Factura Electrónica en Línea (FEL) y declaraciones mensuales.",
    "Régimen Agropecuario y Productores": "Inscripción, confirmación de datos, libros electrónicos y pago de impuestos para productores agropecuarios, artesanales y de reciclaje.",
    "Inscripción y actualización en el RTU": "Inscripción de personas, sociedades, empresas mercantiles, representantes legales, actualización de datos y cierre de negocios en el Registro Tributario Unificado (RTU).",
    "Facturación electrónica y documentos tributarios": "Habilitación en Factura Electrónica en Línea (FEL), autorización de documentos, imprentas, máquinas registradoras y constancias de exención.",
    "Declaraciones, pagos y solvencias": "Presentación de formularios en Declaraguate, formas de pago bancario, convenios de pago a plazos y emisión de Solvencia Fiscal.",
    "Devoluciones y créditos fiscales": "Solicitud de devolución de crédito fiscal del Impuesto al Valor Agregado (IVA), pagos en exceso o indebidos de ISR y acreditamiento de otros impuestos.",
    "Regímenes tributarios": "Inscripción, obligaciones, pagos trimestrales o mensuales y cambio de régimen en el Impuesto Sobre la Renta (ISR) e Impuesto al Valor Agregado (IVA).",
    "Vehículos (como propietario)": "Primeras placas, traspasos de propiedad, pago anual del Impuesto Sobre Circulación de Vehículos (ISCV), reposición de distintivos, modificaciones y bajas.",
    "Servicios y gestiones al contribuyente": "Constancias del Registro Tributario Unificado (RTU), Agencia Virtual, programación de citas previas, orientación tributaria y otros servicios de asistencia.",
    "Cultura tributaria y capacitación": "Cursos virtuales gratuitos de IVA, ISR y herramientas electrónicas, calendario de capacitaciones, biblioteca virtual y normativa.",
    "Gerencias Especiales y Control Tributario": "Calificación en gerencias de grandes y medianos contribuyentes, solvencias, actualización registral y atención especializada.",
    "Declaraciones e Informes Especiales": "Estudio de precios de transferencia, estados financieros auditados, informe semestral de saldos de inventario y retenciones.",
    "Capacitación y Orientación Diferenciada": "Programas de formación especializada y boletines técnicos para grandes y medianos contribuyentes.",

    # Nivel 4 — Contribuyente General (Consolidados con Hallazgo B)
    "Factura Electrónica en Línea (FEL) y Autorización de Documentos": "Habilitación como emisor en el régimen FEL, emisión y verificación de Documentos Tributarios Electrónicos (DTE) y autorización de documentos.",
    "Imprentas, Máquinas Registradoras y Sistemas": "Inscripción en el Registro Fiscal de Imprentas, autorización de máquinas registradoras y sistemas computarizados de facturación.",
    "Formularios y Constancias de Exención": "Constancias de exención del IVA (CIVA), Constancias de Adquisición de Insumos (CAIS), listado de formularios y guías de llenado.",
    "Constancias y gestiones del RTU": "Emisión de constancia de inscripción en el Registro Tributario Unificado (RTU), ratificación de datos, acreditación de imprentas y consultas del registro tributario.",
    "Agencia Virtual y accesos": "Solicitud de usuario, recuperación de contraseña, desbloqueo de credenciales y configuración de accesos en Agencia Virtual.",
    "Citas, estado y quejas": "Programación de citas previas para agencias tributarias, consulta de estado de expedientes y presentación de quejas o denuncias.",
    "Orientación y constancias": "Consultas tributarias, constancias de retención, certificaciones administrativas y asistencia técnica al contribuyente.",
    "Otros servicios al contribuyente": "Habilitación de libros contables, corrección de formularios, sistemas de retención de IVA e ISR y gestiones complementarias.",
    "Personas y representantes": "Inscripción y actualización de personas individuales, profesionales liberales, representantes legales y mandatarios en el Registro Tributario Unificado (RTU).",
    "Sociedades y empresas": "Inscripción, modificación de datos y apertura de establecimientos para sociedades anónimas y empresas mercantiles.",
    "Otras entidades y patrimonios": "Inscripción de copropiedades, fideicomisos, contratos de participación, sucursales extranjeras y entes especiales.",
    "Cierre de negocios y gestiones": "Cese temporal o definitivo de actividades económicas, cancelación de establecimientos mercantiles y prescripción de obligaciones.",
    "Declaraciones": "Presentación de declaraciones juradas mensuales, trimestrales y anuales de impuestos a través de Declaraguate.",
    "Formas de pago y convenios": "Bancos autorizados para recepción de pagos con boleta SAT-2000, solicitud de convenios de pago y facilidades tributarias.",
    "Solvencia fiscal": "Emisión electrónica de Solvencia Fiscal para acreditar que te encuentras al día en el cumplimiento de tus obligaciones tributarias.",
    "IVA (Impuesto al Valor Agregado)": "Solicitud de devolución de crédito fiscal del Impuesto al Valor Agregado (IVA) en los regímenes general, optativo y especial.",
    "ISR (Impuesto Sobre la Renta)": "Devolución o acreditamiento de pagos en exceso o indebidos del Impuesto Sobre la Renta (ISR).",
    "Otros impuestos": "Reclamo y devolución de pagos en exceso en el Impuesto de Solidaridad (ISO), timbres y otros tributos.",
    "Inscripción, distintivos y placas": "Inscripción de vehículos nuevos o importados, asignación de primeras placas y reposición de tarjeta de circulación o calcomanía.",
    "Traspasos de vehículos": "Transferencia de propiedad de vehículos por compraventa electrónica notarial, donación, sucesión hereditaria o subasta.",
    "Impuesto de circulación (ISCV) y valores": "Consulta y pago anual del Impuesto Sobre Circulación de Vehículos (ISCV), tablas de valores imponibles y rebajas por antigüedad.",
    "Modificaciones y rectificaciones": "Cambio de uso o tipo de vehículo, cambio de color, rectificación de número de motor o chasis y transformación de carrocería.",
    "Bajas, inactivación y reactivación": "Retiro temporal o definitivo de circulación por robo, hurto, pérdida total, exportación o desarme, y reactivación vehicular.",
    "Autorizaciones, consultas y requisitos": "Consultas del Registro Fiscal de Vehículos (RFV), historial de propiedad, solvencias vehiculares y autorizaciones para terceros.",
}


def clean_text(text: str) -> str:
    if not text:
        return ""
    t = str(text)
    t = re.sub(r"\bTramitar\b", "Gestionar", t)
    t = re.sub(r"\btramitar\b", "gestionar", t)
    t = re.sub(r"\bTrámites\b", "Gestiones", t)
    t = re.sub(r"\btrámites\b", "gestiones", t)
    t = re.sub(r"\bTrámite\b", "Gestión", t)
    t = re.sub(r"\btrámite\b", "gestión", t)
    return t.replace('"', "&quot;").strip()


def slug(text: str) -> str:
    if not text:
        return "sin-nombre"
    t = str(text).lower().strip()
    for src, dst in [
        ("á", "a"), ("à", "a"), ("ä", "a"), ("é", "e"), ("è", "e"), ("ë", "e"),
        ("í", "i"), ("ì", "i"), ("ï", "i"), ("ó", "o"), ("ò", "o"), ("ö", "o"),
        ("ú", "u"), ("ù", "u"), ("ü", "u"), ("ñ", "n"), ("ç", "c")
    ]:
        t = t.replace(src, dst)
    t = re.sub(r"[^a-z0-9]+", "-", t)
    return t.strip("-")[:70]


def es_vacio(v) -> bool:
    return v is None or str(v).strip() in ("", "—", "–", "-", "None")


def safe_order(val) -> int:
    if val is None:
        return 999
    s = str(val).strip()
    return int(s) if s.isdigit() else 999


def get_node_desc(title: str, child_items: list[dict]) -> str:
    if title in CURATED_DESCRIPTIONS:
        return clean_text(CURATED_DESCRIPTIONS[title])
    sample_titles = [
        clean_text(it.get("gestion") or it.get("nombreActual") or "")
        for it in child_items[:3]
        if (it.get("gestion") or it.get("nombreActual"))
    ]
    if sample_titles:
        joined = ", ".join(sample_titles)
        return clean_text(f"Incluye gestiones como: {joined}.")
    return clean_text(f"Consulta los requisitos oficiales, pasos y servicios en línea para {title}.")


def encode_vc_link(url: str, target_blank: bool = False) -> str:
    if not url:
        return ""
    enc = urllib.parse.quote(url, safe=":/#?=&%-_.")
    target = "target:%20_blank|" if target_blank else "|"
    return f"url:{enc}||{target}"


def info_box(title: str, desc: str, url: str = "", target_blank: bool = False) -> str:
    link_val = encode_vc_link(url, target_blank=target_blank)
    return (
        f'[bsf-info-box icon_type="none" title="{clean_text(title)}" '
        f'read_more="box" link="{link_val}"]'
        f'{clean_text(desc)}'
        f'[/bsf-info-box]'
    )


def columna(content: str, width: str = "1/3") -> str:
    return f'[vc_column width="{width}"]{content}[/vc_column]'


def wrap_page(items: list[dict], n1: str, heading: str = "", lead_text: str = "") -> str:
    breadcrumb = (
        '[vc_row gap="5px"][vc_column]'
        '[dt_breadcrumbs font_style="italic:normal:none" alignment="left"]'
        '[vc_separator][/vc_column][/vc_row]'
    )
    header_block = ""
    if heading:
        header_block = (
            f'[vc_row][vc_column]'
            f'[vc_custom_heading text="{clean_text(heading)}" font_container="tag:h1|font_size:28px|text_align:left|color:%23003865" use_theme_fonts="yes"]'
            + (
                f'[vc_custom_heading text="{clean_text(lead_text)}" font_container="tag:p|font_size:15px|text_align:left|color:%23475569" use_theme_fonts="yes"]'
                if lead_text else ""
            )
            + '[vc_empty_space height="16px"][/vc_column][/vc_row]\n'
        )
    col_width = "1/2" if len(items) in (2, 4) else "1/3"
    cols = "".join(
        columna(info_box(it["title"], it["desc"], it.get("url", ""), it.get("target_blank", False)), width=col_width)
        for it in items
    )
    section = (
        f'[vc_section]'
        f'[vc_row equal_height="yes" gap="15px" el_class="{CSS_CLASS.get(n1, "sat-seccion-contribuyentes")}"]'
        f'{cols}'
        f'[/vc_row][/vc_section]'
    )
    return f"{breadcrumb}\n{header_block}{section}"


def build_home_shortcode() -> str:
    return """[vc_row full_width="stretch_row" el_class="sat-hero-section" css=".vc_custom_hero{background-color: #003865; padding: 45px 0;}"]
[vc_column]
[vc_custom_heading text="Portal SAT Guatemala" font_container="tag:h1|font_size:32px|text_align:center|color:%23ffffff" use_theme_fonts="yes"]
[vc_custom_heading text="Gestiones, requisitos oficiales y servicios tributarios y aduaneros en línea" font_container="tag:p|font_size:16px|text_align:center|color:%23e2e8f0" use_theme_fonts="yes"]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="10px" el_class="sat-quick-access-row" css=".vc_custom_qa{margin-top: -25px; margin-bottom: 30px;}"]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Declaraguate" read_more="box" link="url:https://declaraguate.sat.gob.gt/||target:%20_blank|"]Presentación y pago de formularios.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Agencia Virtual" read_more="box" link="url:https://farm3.sat.gob.gt/menu/login.jsf||target:%20_blank|"]Servicios en línea y constancia RTU.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Solicitar NIT" read_more="box" link="url:/solicitar-nit/|||"]Requisitos, formulario oficial y cita en 3 pasos.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Factura FEL" read_more="box" link="url:https://portal.sat.gob.gt/portal/factura-electronica-en-linea-fel/||target:%20_blank|"]Emisión y verificación de DTE.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Consulta de NIT" read_more="box" link="url:https://portal.sat.gob.gt/portal/consulta-cui-nit/||target:%20_blank|"]Verificar estado y validez tributaria.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Cita Previa" read_more="box" link="url:https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal||target:%20_blank|"]Programar atención en agencias.[/bsf-info-box][/vc_column]
[/vc_row]

[vc_row]
[vc_column]
[dt_fancy_title title="Selecciona tu perfil de atención" title_size="h2" title_color="accent"]
[vc_empty_space height="20px"]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="15px" el_class="sat-seccion-macro-segmentos"]
[vc_column width="1/4"][bsf-info-box icon_type="none" title="Contribuyentes" read_more="box" link="url:/contribuyentes/|||"]Información y servicios tributarios para personas y empresas. Registro Tributario Unificado (RTU), pequeños contribuyentes, régimen general y vehículos.[/bsf-info-box][/vc_column]
[vc_column width="1/4"][bsf-info-box icon_type="none" title="Operadores de Comercio Exterior" read_more="box" link="url:/operadores-de-comercio-exterior/|||"]Servicios e información aduanera. Importación, exportación, padrones, auxiliares de la función pública (AFPA) y declaraciones DUCA.[/bsf-info-box][/vc_column]
[vc_column width="1/4"][bsf-info-box icon_type="none" title="Profesionales" read_more="box" link="url:/profesionales/|||"]Herramientas especializadas para auxiliares y profesionales tributarios. Abogados, notarios, peritos contadores, auditores y gestores.[/bsf-info-box][/vc_column]
[vc_column width="1/4"][bsf-info-box icon_type="none" title="Entes Exentos" read_more="box" link="url:/entes-exentos/|||"]Gestiones y normativa para entidades del Estado, centros educativos, misiones diplomáticas, ONGs y municipalidades.[/bsf-info-box][/vc_column]
[/vc_row]

[vc_row]
[vc_column]
[vc_empty_space height="30px"]
[dt_fancy_title title="Gestiones más frecuentes" title_size="h2" title_color="accent"]
[vc_empty_space height="20px"]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="15px" el_class="sat-seccion-contribuyentes"]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Solicitar Número de Identificación Tributaria (NIT)" read_more="box" link="url:/solicitar-nit/|||"]Requisitos claros, formulario oficial RTU Digital y programación de cita en 3 pasos conectados.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Actualizar o Ratificar Datos en el RTU Digital" read_more="box" link="url:/actualizar-rtu/|||"]Actualiza tu dirección fiscal, establecimientos, impuestos o contador, consulta el estado e imprime tu Constancia de RTU en 3 pasos.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Solicitud y Emisión de Solvencia Fiscal en Línea" read_more="box" link="url:https://portal.sat.gob.gt/portal/solvencia-fiscal/||target:%20_blank|"]Consulta, pago y descarga del certificado electrónico que acredita la ausencia de adeudos tributarios.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Habilitación para emitir Factura Electrónica (FEL)" read_more="box" link="url:https://portal.sat.gob.gt/portal/factura-electronica-en-linea-fel/||target:%20_blank|"]Pasos para incorporarte al régimen FEL y emitir Documentos Tributarios Electrónicos (DTE) de forma gratuita.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Traspaso Electrónico de Vehículos en Línea" read_more="box" link="url:https://portal.sat.gob.gt/portal/vehiculos/||target:%20_blank|"]Transferencia de dominio de automotores autorizada notarialmente a través de Agencia Virtual.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Inscripción en el Padrón de Importadores" read_more="box" link="url:https://portal.sat.gob.gt/portal/padron-de-importadores/||target:%20_blank|"]Requisitos y activación de estado en el padrón aduanero para el despacho e internación de mercancías.[/bsf-info-box][/vc_column]
[/vc_row]"""


def build_solicitar_nit_shortcode() -> str:
    """
    Construye el Shortcode WPBakery para la Página Universal Conectada en 3 Pasos (100% Cero [vc_raw_html]):
    /solicitar-nit/
      - Paso 1: 1. Requisitos (texto nativo en lenguaje ciudadano, alerta DPI físico vigente sin constancia RENAP,
        4 modalidades y guía de comprobante de domicilio; sin lista de agencias por región).
      - Paso 2: 2. Solicitar Gestión (bloque nativo WPBakery sin [vc_raw_html] hacia https://app.c.sat.gob.gt/rtu/formulario-inscripcion).
      - Paso 3: 3. Solicitar Cita (bloque nativo WPBakery sin [vc_raw_html] hacia https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal
        + manual PDF oficial).
    """
    return """[vc_row gap="5px"][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]

[vc_row el_class="sat-gestion-header"]
[vc_column]
[vc_custom_heading text="Solicitar Número de Identificación Tributaria (NIT)" font_container="tag:h1|font_size:30px|text_align:left|color:%23003865" use_theme_fonts="yes"]
[vc_custom_heading text="Obtén por primera vez tu Número de Identificación Tributaria (NIT) y activa tu usuario de Agencia Virtual en 3 pasos conectados." font_container="tag:p|font_size:16px|text_align:left|color:%23475569" use_theme_fonts="yes"]
[vc_empty_space height="12px"]
[/vc_column]
[/vc_row]

[vc_section]
[vc_row]
[vc_column]
[vc_tta_tabs style="modern" shape="rounded" color="blue" active_section="1" el_class="sat-connected-steps-tabs"]

[vc_tta_section title="1. Requisitos" tab_id="paso-1-requisitos"]
[vc_row]
[vc_column]
[vc_message message_box_style="solid-icon" message_box_color="warning" icon_fontawesome="fas fa-id-card"]<strong>Condición indispensable sobre tu documento de identificación:</strong> Tu Documento Personal de Identificación (DPI) debe estar <strong>físico y vigente</strong>. Para la inscripción de datos en el Registro Tributario Unificado (RTU), <strong>no se acepta la constancia de solicitud o renovación emitida por el Registro Nacional de las Personas (RENAP)</strong>.[/vc_message]
[vc_empty_space height="16px"]
[vc_custom_heading text="Elige tu modalidad y verifica los documentos que necesitas en formato digital (PDF o JPG, máximo 5 MB)" font_container="tag:h2|font_size:20px|text_align:left|color:%23003865" use_theme_fonts="yes"]
[vc_empty_space height="12px"]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="15px" el_class="sat-seccion-contribuyentes"]
[vc_column width="1/2"]
[vc_column_text]
<div class="sat-modalidad-card">
  <h3>Uso Personal o Laboral (Sin Obligaciones de Impuestos)</h3>
  <p>Para empleados en relación de dependencia, estudiantes, gestiones bancarias, compra de vehículos o actos civiles sin negocio propio.</p>
  <ul>
    <li><strong>DPI original, físico y vigente</strong> (ambos lados legibles) o pasaporte vigente en caso de extranjeros.</li>
    <li><strong>Correo electrónico personal activo</strong> al que tengas acceso inmediato para validar tu código de seguridad.</li>
    <li><strong>Comprobante de domicilio</strong> (únicamente si la dirección actual es distinta a la impresa en tu DPI o si el DPI no especifica dirección completa).</li>
  </ul>
</div>
[/vc_column_text]
[/vc_column]

[vc_column width="1/2"]
[vc_column_text]
<div class="sat-modalidad-card">
  <h3>Negocio, Comercio o Profesión (Con Obligaciones Tributarias)</h3>
  <p>Para emprender un negocio propio, emitir facturas como Pequeño Contribuyente, Régimen General o ejercer una profesión liberal.</p>
  <ul>
    <li><strong>DPI original, físico y vigente</strong> o pasaporte vigente si eres extranjero.</li>
    <li><strong>Factura o comprobante de domicilio fiscal y comercial</strong> con antigüedad no mayor a 3 meses.</li>
    <li><strong>Constancia de colegiado activo o título universitario</strong> (si te inscribes como profesional liberal).</li>
  </ul>
</div>
[/vc_column_text]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="15px" el_class="sat-seccion-contribuyentes"]
[vc_column width="1/2"]
[vc_column_text]
<div class="sat-modalidad-card">
  <h3>Personas con Discapacidad Visual, Auditiva o Invalidez</h3>
  <p>Atención preferencial acompañada en cualquier agencia o delegación tributaria de la SAT.</p>
  <ul>
    <li><strong>DPI original y vigente</strong> del solicitante.</li>
    <li><strong>Acompañamiento de un familiar</strong> dentro de los grados de ley (con su propio DPI vigente) o auxilio de un Notario para la firma y validación biométrica.</li>
  </ul>
</div>
[/vc_column_text]
[/vc_column]

[vc_column width="1/2"]
[vc_column_text]
<div class="sat-modalidad-card">
  <h3>Guatemalteco Residente en el Extranjero</h3>
  <p>Para ciudadanos guatemaltecos que residen fuera del país y requieren su NIT para gestiones consulares, bancarias o patrimoniales.</p>
  <ul>
    <li><strong>DPI vigente o Pasaporte vigente</strong> digitalizado en alta resolución.</li>
    <li><strong>Fotografía tipo selfie</strong> sosteniendo tu documento de identificación a la altura del rostro.</li>
    <li><strong>Dirección en Guatemala</strong> (de un familiar o inmueble propio) y correo electrónico personal.</li>
  </ul>
</div>
[/vc_column_text]
[/vc_column]
[/vc_row]

[vc_empty_space height="16px"]

[vc_row equal_height="yes" gap="15px"]
[vc_column width="1/2"]
[vc_message message_box_style="outline" message_box_color="success" icon_fontawesome="fas fa-check-circle"]<strong>¿Cuándo NO necesitas adjuntar factura de servicios?</strong> Si tu DPI muestra tu dirección completa de residencia actual y seleccionas la casilla <strong>"Dirección según DPI"</strong> dentro del formulario electrónico, no necesitas adjuntar recibo de luz, agua ni teléfono.[/vc_message]
[/vc_column]

[vc_column width="1/2"]
[vc_message message_box_style="outline" message_box_color="info" icon_fontawesome="fas fa-file-invoice"]<strong>¿Qué documentos se aceptan si tu dirección es distinta a la del DPI?</strong> Factura de energía eléctrica, agua potable, teléfono residencial o internet fijo, recibo del Impuesto Único Sobre Inmuebles (IUSI) o contrato de arrendamiento vigente (con máximo 3 meses de antigüedad).[/vc_message]
[/vc_column]
[/vc_row]
[/vc_tta_section]

[vc_tta_section title="2. Solicitar Gestión" tab_id="paso-2-solicitar-gestion"]
[vc_row el_class="sat-seccion-contribuyentes"]
[vc_column]
[vc_custom_heading text="Paso 2: Completa el Formulario Oficial de Inscripción de NIT en el RTU Digital" font_container="tag:h2|font_size:20px|text_align:left|color:%23003865" use_theme_fonts="yes"]
[vc_column_text]
<div class="sat-app-launch-card">
  <h3>Aplicativo Oficial SAT — Formulario Electrónico de Inscripción en el RTU</h3>
  <p>Sigue estos pasos dentro del formulario oficial de la SAT:</p>
  <ol>
    <li>Ingresa tu <strong>correo electrónico personal</strong> y escribe el código de seguridad enviado a tu bandeja de entrada.</li>
    <li>Completa tus datos de identificación y ubicación, y adjunta tu <strong>DPI físico y vigente de ambos lados</strong>.</li>
    <li>Si el sistema aprueba tu solicitud en línea recibirás tu NIT por correo; si te indica validación adicional, pasa a la pestaña <strong>3. Solicitar Cita</strong>.</li>
  </ol>
</div>
[/vc_column_text]
[vc_empty_space height="14px"]
[bsf-info-box icon_type="none" title="Iniciar Solicitud en el Formulario Oficial de Inscripción de NIT (RTU Digital)" read_more="box" link="url:https://app.c.sat.gob.gt/rtu/formulario-inscripcion||target:%20_blank|"]Haz clic aquí para abrir el aplicativo oficial de inscripción de NIT de la SAT (app.c.sat.gob.gt/rtu/formulario-inscripcion) y registrar tu solicitud en línea.[/bsf-info-box]
[/vc_column]
[/vc_row]
[/vc_tta_section]

[vc_tta_section title="3. Solicitar Cita" tab_id="paso-3-solicitar-cita"]
[vc_row el_class="sat-seccion-contribuyentes"]
[vc_column]
[vc_custom_heading text="Paso 3: Programa tu Cita para Finalizar tu Solicitud de NIT" font_container="tag:h2|font_size:20px|text_align:left|color:%23003865" use_theme_fonts="yes"]
[vc_column_text]Si ya enviaste tu solicitud en el Paso 2 y recibiste el correo electrónico de confirmación indicando que debes programar cita para finalizar la validación de tu NIT, selecciona el aplicativo oficial a continuación con tu Código Único de Identificación (CUI / DPI) y el correo electrónico registrado:[/vc_column_text]
[vc_empty_space height="14px"]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="15px" el_class="sat-seccion-contribuyentes"]
[vc_column width="1/2"]
[bsf-info-box icon_type="none" title="Programar Cita en el Sistema Oficial de Cita Validada SAT" read_more="box" link="url:https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal||target:%20_blank|"]Ingresa tu CUI (DPI) y el correo electrónico registrado en tu solicitud para elegir agencia, fecha y hora de atención.[/bsf-info-box]
[/vc_column]
[vc_column width="1/2"]
[bsf-info-box icon_type="none" title="Descargar Manual Oficial de Cita Validada (PDF)" read_more="box" link="url:https://portal.sat.gob.gt/portal/descarga/15389/cita-controlada/96248/manual-usuario-portal-2||target:%20_blank|"]Guía paso a paso ilustrada sobre cómo validar tu correo y confirmar tu cita para finalizar la inscripción de tu NIT.[/bsf-info-box]
[/vc_column]
[/vc_row]
[/vc_tta_section]

[/vc_tta_tabs]
[/vc_column]
[/vc_row]
[/vc_section]"""


def build_actualizar_rtu_shortcode() -> str:
    """
    Construye el Shortcode WPBakery para la Página Universal Conectada en 3 Pasos (100% Cero [vc_raw_html]):
    /actualizar-rtu/
      - Paso 1: 1. Requisitos según tu caso (plazo legal de 30 días hábiles Art. 94 Código Tributario,
        4 escenarios ciudadanos y reglas oficiales sobre Factura de Servicios vs otro comprobante).
      - Paso 2: 2. Realizar Actualización (ruta operativa en Agencia Virtual + enlaces directos +
        manuales PDF oficiales de la SAT).
      - Paso 3: 3. Estado, Constancia y Cita (3 tarjetas nativas [bsf-info-box] hacia los aplicativos oficiales:
        consulta de estado RTU Digital, impresión de Constancia de RTU y sistema de Cita Validada).
    """
    return """[vc_row gap="5px"][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]

[vc_row el_class="sat-gestion-header"]
[vc_column]
[vc_custom_heading text="Actualizar o Ratificar Datos en el Registro Tributario Unificado (RTU Digital)" font_container="tag:h1|font_size:30px|text_align:left|color:%23003865" use_theme_fonts="yes"]
[vc_custom_heading text="Actualiza tu dirección fiscal, datos de identificación, establecimientos comerciales, afiliaciones de impuestos, contador o representante legal, consulta el estado de tu gestión e imprime tu Constancia de RTU en 3 pasos conectados." font_container="tag:p|font_size:16px|text_align:left|color:%23475569" use_theme_fonts="yes"]
[vc_empty_space height="12px"]
[/vc_column]
[/vc_row]

[vc_section]
[vc_row]
[vc_column]
[vc_tta_tabs style="modern" shape="rounded" color="blue" active_section="1" el_class="sat-connected-steps-tabs"]

[vc_tta_section title="1. Requisitos según tu caso" tab_id="paso-1-requisitos-rtu"]
[vc_row]
[vc_column]
[vc_message message_box_style="solid-icon" message_box_color="warning" icon_fontawesome="fas fa-clock"]<strong>Plazo legal de 30 días hábiles (Art. 94 del Código Tributario, Decreto 6-91):</strong> A partir de la fecha en que realices cualquier modificación en tus datos o cambies de domicilio fiscal o comercial, cuentas con <strong>treinta (30) días hábiles</strong> para actualizar tu información ante la SAT sin sanciones. Tu <strong>DPI debe estar físico y vigente</strong>.[/vc_message]
[vc_empty_space height="16px"]
[vc_custom_heading text="Verifica los documentos requeridos según el tipo de actualización (Formatos: PDF, JPG o PNG)" font_container="tag:h2|font_size:20px|text_align:left|color:%23003865" use_theme_fonts="yes"]
[vc_empty_space height="12px"]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="15px" el_class="sat-seccion-contribuyentes"]
[vc_column width="1/2"]
[vc_column_text]
<div class="sat-modalidad-card">
  <h3>Datos Personales, Domicilio Fiscal o Ratificación Anual</h3>
  <p>Cambio de dirección de residencia, teléfono, correo electrónico, actividad económica personal o confirmación anual de datos.</p>
  <ul>
    <li><strong>DPI vigente de ambos lados</strong> (o Pasaporte vigente en caso de ser extranjero).</li>
    <li><strong>Comprobante de domicilio fiscal</strong> con máximo 3 meses de emisión (Factura de servicios donde solo digitas serie y número, o recibo de agua / IUSI adjunto).</li>
    <li><strong>Usuario activo de Agencia Virtual SAT</strong> (si solo realizas la ratificación anual sin cambios, se confirma de inmediato en línea).</li>
  </ul>
</div>
[/vc_column_text]
[/vc_column]

[vc_column width="1/2"]
[vc_column_text]
<div class="sat-modalidad-card">
  <h3>Establecimiento Comercial, Negocio o Actividad Económica</h3>
  <p>Apertura, cambio de dirección comercial, cambio de nombre comercial o modificación de actividad económica.</p>
  <ul>
    <li><strong>DPI vigente de ambos lados</strong> o Pasaporte vigente en caso de ser extranjero.</li>
    <li><strong>Comprobante de domicilio comercial</strong> (máximo 3 meses de antigüedad).</li>
    <li><strong>Patente de comercio de empresa</strong> (para comerciantes inscritos en el Registro Mercantil).</li>
    <li><strong>Casos especiales:</strong> Centros educativos adjuntan resolución del MINEDUC; Zonas Francas / ZOLIC / Decreto 29-89 / Movilidad Eléctrica Decreto 40-2022 adjuntan resolución ministerial; Fincas adjuntan certificación o solvencia municipal con dirección.</li>
  </ul>
</div>
[/vc_column_text]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="15px" el_class="sat-seccion-contribuyentes"]
[vc_column width="1/2"]
[vc_column_text]
<div class="sat-modalidad-card">
  <h3>Impuestos, Afiliaciones, Cambio de Régimen o Contador</h3>
  <p>Agregar o actualizar afiliaciones de impuestos (IVA, ISR, ISO), transición de régimen o nombramiento/cambio de Perito Contador.</p>
  <ul>
    <li><strong>Usuario activo de Agencia Virtual</strong> y datos de identificación actualizados en el RTU Digital.</li>
    <li><strong>Para nombrar o cambiar Perito Contador:</strong> Tanto el contribuyente como el Perito Contador deben contar con Agencia Virtual activa y sus propios datos actualizados en el RTU Digital. El contador deberá confirmar su nombramiento desde su Agencia Virtual.</li>
  </ul>
</div>
[/vc_column_text]
[/vc_column]

[vc_column width="1/2"]
[vc_column_text]
<div class="sat-modalidad-card">
  <h3>Persona Jurídica (Sociedad, Empresa) o Ente Exento</h3>
  <p>Actualización de sociedades mercantiles, nombramiento o cambio de Representante Legal, entidades no lucrativas o del Estado.</p>
  <ul>
    <li><strong>Agencia Virtual activa y RTU Digital actualizado</strong> para la Entidad, su Representante Legal y su Perito Contador previo a iniciar la gestión.</li>
    <li><strong>DPI vigente de ambos lados</strong> (o Pasaporte vigente) del Representante Legal.</li>
    <li><strong>Acta Notarial de Nombramiento vigente e inscrita</strong> en el Registro Mercantil, REPEJU o registro correspondiente.</li>
    <li><strong>Comprobante de domicilio fiscal y comercial</strong> (máximo 3 meses de emisión).</li>
  </ul>
</div>
[/vc_column_text]
[/vc_column]
[/vc_row]

[vc_empty_space height="16px"]

[vc_row equal_height="yes" gap="15px"]
[vc_column width="1/2"]
[vc_message message_box_style="outline" message_box_color="success" icon_fontawesome="fas fa-check-circle"]<strong>¿Cuándo NO necesitas adjuntar el archivo de la factura?</strong> Si en el campo <em>"Tipo de documento comprobante de domicilio"</em> eliges <strong>"Factura de Servicios"</strong> (energía eléctrica, agua potable, teléfono de línea fija o internet residencial no mayor a 3 meses), <strong>únicamente debes digitar la serie y el número de documento de la factura</strong>. No se requiere adjuntar archivo y tu gestión finaliza 100% en línea.[/vc_message]
[/vc_column]

[vc_column width="1/2"]
[vc_message message_box_style="outline" message_box_color="info" icon_fontawesome="fas fa-file-upload"]<strong>¿Cuándo SÍ debes adjuntar comprobante digital (JPG, PDF o PNG)?</strong> Si eliges <strong>Recibo de agua potable</strong>, <strong>Recibo de IUSI</strong> o <strong>Certificación/Solvencia municipal</strong>, debes adjuntar el archivo. Los contribuyentes con obligaciones activas en IVA que elijan otro tipo de documento finalizan su gestión en Agencia Tributaria (Paso 3).[/vc_message]
[/vc_column]
[/vc_row]
[/vc_tta_section]

[vc_tta_section title="2. Realizar Actualización" tab_id="paso-2-actualizar-agencia-virtual"]
[vc_row el_class="sat-seccion-contribuyentes"]
[vc_column]
[vc_custom_heading text="Paso 2: Realiza tu Actualización o Ratificación dentro de Agencia Virtual SAT" font_container="tag:h2|font_size:20px|text_align:left|color:%23003865" use_theme_fonts="yes"]
[vc_column_text]
<div class="sat-app-launch-card">
  <h3>Ruta Operativa dentro de Agencia Virtual SAT</h3>
  <ol>
    <li>Ingresa a <strong>Agencia Virtual</strong> con tu usuario (NIT) y contraseña, y dirígete al menú <strong>Servicios › RTU › Actualizar Datos</strong> (o <em>Ratificación de Datos</em>).</li>
    <li>Modifica únicamente las secciones que necesitas poner al día: Identificación, Ubicación (domicilio fiscal), Actividad Económica, Establecimientos, Afiliaciones de Impuestos o Contador.</li>
    <li>Adjunta tu DPI vigente de ambos lados. En comprobante de domicilio, selecciona <strong>"Factura de Servicios"</strong> para digitar únicamente la serie y número de tu factura sin adjuntar archivo.</li>
    <li>Confirma y envía tu solicitud. Luego abre la pestaña <strong>3. Estado, Constancia y Cita</strong> en esta misma página para consultar la aprobación o imprimir tu Constancia de RTU.</li>
  </ol>
</div>
[/vc_column_text]
[vc_empty_space height="14px"]
[bsf-info-box icon_type="none" title="Ingresar a Agencia Virtual SAT para Actualizar o Ratificar el RTU" read_more="box" link="url:https://farm3.sat.gob.gt/menu/login.jsf||target:%20_blank|"]Accede con tu NIT y contraseña al portal transaccional de Agencia Virtual SAT (Servicios › RTU › Actualizar Datos).[/bsf-info-box]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="15px" el_class="sat-seccion-contribuyentes"]
[vc_column width="1/2"]
[bsf-info-box icon_type="none" title="Descargar Guía Paso a Paso de Actualización en el RTU Digital (PDF)" read_more="box" link="url:https://portal.sat.gob.gt/portal/descarga/14366/rtu-digital/43540/actualizacion-rtu-digital.pdf||target:%20_blank|"]Manual ilustrado oficial de la SAT con las pantallas paso a paso para completar tu actualización de datos dentro de Agencia Virtual.[/bsf-info-box]
[/vc_column]
[vc_column width="1/2"]
[bsf-info-box icon_type="none" title="Descargar Manual de Comprobante de Domicilio (PDF)" read_more="box" link="url:https://portal.sat.gob.gt/portal/descarga/14366/rtu-digital/80676/manual-comprobante-de-domicilio-actualizacion-2.pdf||target:%20_blank|"]Guía oficial sobre cómo registrar tu Factura de Servicios (serie y número) o adjuntar otro tipo de comprobante de domicilio.[/bsf-info-box]
[/vc_column]
[/vc_row]
[/vc_tta_section]

[vc_tta_section title="3. Estado, Constancia y Cita" tab_id="paso-3-estado-constancia-cita"]
[vc_row]
[vc_column]
[vc_custom_heading text="Paso 3: Consulta el Estado de tu Gestión, Imprime tu Constancia de RTU o Solicita Cita" font_container="tag:h2|font_size:20px|text_align:left|color:%23003865" use_theme_fonts="yes"]
[vc_column_text]Selecciona directamente el servicio oficial de la SAT que necesitas para dar seguimiento a tu solicitud, descargar tu Constancia de RTU actualizada o programar cita presencial si el sistema te lo requirió:[/vc_column_text]
[vc_empty_space height="14px"]
[/vc_column]
[/vc_row]

[vc_row equal_height="yes" gap="15px" el_class="sat-seccion-contribuyentes"]
[vc_column width="1/3"]
[bsf-info-box icon_type="none" title="3.1 Consultar Estado de Gestión de RTU Digital" read_more="box" link="url:https://cdn.c.sat.gob.gt/rtu/consulta-gestion||target:%20_blank|"]Verifica en tiempo real si tu solicitud de actualización del Registro Tributario Unificado (RTU) ya fue aprobada o si requiere acción adicional.[/bsf-info-box]
[/vc_column]
[vc_column width="1/3"]
[bsf-info-box icon_type="none" title="3.2 Imprimir Constancia de Inscripción y Actualización en el RTU" read_more="box" link="url:https://cdn.c.sat.gob.gt/rtu/constancia-rtu-portal||target:%20_blank|"]Genera y descarga en formato PDF tu Constancia oficial del Registro Tributario Unificado (RTU) con código QR verificable.[/bsf-info-box]
[/vc_column]
[vc_column width="1/3"]
[bsf-info-box icon_type="none" title="3.3 Solicitar Cita Presencial (Sistema de Cita Validada)" read_more="box" link="url:https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal||target:%20_blank|"]Programa tu cita en Agencia Tributaria únicamente si el sistema te notificó por correo que debes concluir tu actualización presencialmente.[/bsf-info-box]
[/vc_column]
[/vc_row]
[/vc_tta_section]

[/vc_tta_tabs]
[/vc_column]
[/vc_row]
[/vc_section]"""


SOLICITAR_NIT_IDS = {
    "SAT-GES-0001",
    "SAT-GES-0049",
    "SAT-GES-0050",
    "SAT-GES-0051",
}

ACTUALIZAR_RTU_IDS = {
    "SAT-GES-0002",
    "SAT-GES-0040",
    "SAT-GES-0054",
    "SAT-GES-0068",
    "SAT-GES-0069",
    "SAT-GES-0070",
    "SAT-GES-0071",
    "SAT-GES-0072",
    "SAT-GES-0073",
    "SAT-GES-0074",
    "SAT-GES-0075",
    "SAT-GES-0076",
    "SAT-GES-0115",
    "SAT-GES-0118",
}


def resolve_card_link(t: dict) -> tuple[str, bool]:
    """Devuelve (url, target_blank) enlazando gestiones conectadas a su página universal interna."""
    cid = t.get("id") or t.get("codigo") or ""
    if cid in SOLICITAR_NIT_IDS:
        return "/solicitar-nit/", False
    if cid in ACTUALIZAR_RTU_IDS:
        return "/actualizar-rtu/", False
    url = t.get("url") or ""
    return url, bool(url)


def main():
    with open(TRAMITES_JSON, "r", encoding="utf-8") as f:
        tramites = json.load(f)

    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    tramites_sorted = sorted(
        tramites,
        key=lambda t: (
            safe_order(t.get("orden_n1")),
            safe_order(t.get("orden_n2")),
            safe_order(t.get("orden_n3")),
            safe_order(t.get("orden_n4")),
            safe_order(t.get("orden_contenido")),
            str(t.get("id") or ""),
        ),
    )

    index_lines = [
        "# Índice Maestro de Plantillas y Shortcodes WPBakery (Cero Raw HTML) — Portal SAT Guatemala\n\n",
        "Este directorio contiene los shortcodes oficiales de **WPBakery Page Builder + The7 Classic + Ultimate Addons (`[bsf-info-box]`)**, **100% libres de `[vc_raw_html]`**, sincronizados con `src/data/allTramites.json` (**714 gestiones canónicas**), los **Hallazgos A y B** de la Arquitectura de Información y las **Páginas Universales Conectadas en 3 Pasos (`/solicitar-nit/` y `/actualizar-rtu/`)**.\n\n",
        "## 1. Portada y Páginas de Proceso Conectado (3 Pasos Nativos WPBakery)\n\n",
        "| Archivo | Tipo | Ruta Web Sugerida | Contenido |\n",
        "| :--- | :---: | :--- | :--- |\n",
        "| `HOME_portada-portal-sat.txt` | Portada | `/` | Hero institucional, 6 accesos rápidos, 4 tarjetas de Nivel 1 y 6 gestiones frecuentes |\n",
        "| `procesos-conectados/G_solicitar-nit.txt` | Gestión Conectada (3 Pasos) | `/solicitar-nit/` | Pestañas conectadas (`[vc_tta_tabs]` sin `[vc_raw_html]`): **1. Requisitos** › **2. Solicitar Gestión** › **3. Solicitar Cita** |\n",
        "| `procesos-conectados/G_actualizar-rtu.txt` | Gestión Conectada (3 Pasos) | `/actualizar-rtu/` | Pestañas conectadas (`[vc_tta_tabs]` sin `[vc_raw_html]`): **1. Requisitos según tu caso** › **2. Realizar Actualización** › **3. Estado, Constancia y Cita** |\n\n",
        "## 2. Páginas Jerárquicas del Catálogo (Nivel 1 a Nivel 4)\n\n",
        "| Archivo | Nivel | Ruta Jerárquica Canónica | Elementos en Página |\n",
        "| :--- | :---: | :--- | :---: |\n",
    ]

    # 1. Guardar Portada (Home) y Páginas Conectadas (Solicitar NIT y Actualizar RTU)
    (OUTPUT_DIR / "HOME_portada-portal-sat.txt").write_text(build_home_shortcode(), encoding="utf-8")
    proc_dir = OUTPUT_DIR / "procesos-conectados"
    proc_dir.mkdir(parents=True, exist_ok=True)
    (proc_dir / "G_solicitar-nit.txt").write_text(build_solicitar_nit_shortcode(), encoding="utf-8")
    (proc_dir / "G_actualizar-rtu.txt").write_text(build_actualizar_rtu_shortcode(), encoding="utf-8")

    # 2. Construir estructuras por Nivel 1 -> Nivel 2 -> Nivel 3 -> Nivel 4
    n1_groups: dict[str, list[dict]] = OrderedDict()
    for t in tramites_sorted:
        n1 = t.get("nivel1") or "Contribuyentes"
        if n1 not in n1_groups:
            n1_groups[n1] = []
        n1_groups[n1].append(t)

    pages_count = 3  # Home + Solicitar NIT + Actualizar RTU

    for n1, n1_items in n1_groups.items():
        n1_slug = N1_SLUGS.get(n1, slug(n1))
        n1_dir = OUTPUT_DIR / n1_slug
        n1_dir.mkdir(parents=True, exist_ok=True)

        # Agrupar por Nivel 2
        n2_groups: dict[str, list[dict]] = OrderedDict()
        for t in n1_items:
            n2 = t.get("nivel2") or "General"
            if n2 not in n2_groups:
                n2_groups[n2] = []
            n2_groups[n2].append(t)

        # Generar Página Hub N1_<slug>.txt con tarjetas hacia cada Nivel 2
        n1_cards = []
        for n2, n2_items in n2_groups.items():
            n2_slug = slug(n2)
            n1_cards.append({
                "title": n2,
                "desc": get_node_desc(n2, n2_items),
                "url": f"/{n1_slug}/{n2_slug}/",
                "target_blank": False,
            })
        n1_file = n1_dir / f"N1_{n1_slug}.txt"
        n1_file.write_text(wrap_page(n1_cards, n1, heading=n1), encoding="utf-8")
        pages_count += 1
        index_lines.append(f"| `{n1_slug}/N1_{n1_slug}.txt` | Nivel 1 | **{n1}** | {len(n1_cards)} |\n")

        # Procesar cada Nivel 2
        for n2, n2_items in n2_groups.items():
            n2_slug = slug(n2)
            n3_groups: dict[str, list[dict]] = OrderedDict()
            for t in n2_items:
                n3 = t.get("nivel3") or "—"
                if not es_vacio(n3):
                    if n3 not in n3_groups:
                        n3_groups[n3] = []
                    n3_groups[n3].append(t)

            n2_file = n1_dir / f"N2_{n2_slug}.txt"

            if not n3_groups:
                leaf_cards = []
                for t in n2_items:
                    url, target_blank = resolve_card_link(t)
                    leaf_cards.append({
                        "title": t.get("gestion") or t.get("nombreActual") or "",
                        "desc": t.get("descripcion") or "",
                        "url": url,
                        "target_blank": target_blank,
                    })
                n2_file.write_text(
                    wrap_page(leaf_cards, n1, heading=n2, lead_text=get_node_desc(n2, n2_items)),
                    encoding="utf-8",
                )
                pages_count += 1
                index_lines.append(
                    f"| `{n1_slug}/N2_{n2_slug}.txt` | Nivel 2 (Lista Directa) | {n1} > **{n2}** | {len(leaf_cards)} |\n"
                )
            else:
                n2_cards = []
                for n3, n3_items in n3_groups.items():
                    n3_slug = slug(n3)
                    n2_cards.append({
                        "title": n3,
                        "desc": get_node_desc(n3, n3_items),
                        "url": f"/{n1_slug}/{n2_slug}/{n3_slug}/",
                        "target_blank": False,
                    })
                n2_file.write_text(
                    wrap_page(n2_cards, n1, heading=n2, lead_text=get_node_desc(n2, n2_items)),
                    encoding="utf-8",
                )
                pages_count += 1
                index_lines.append(
                    f"| `{n1_slug}/N2_{n2_slug}.txt` | Nivel 2 | {n1} > **{n2}** | {len(n2_cards)} |\n"
                )

                n2_subdir = n1_dir / n2_slug
                n2_subdir.mkdir(parents=True, exist_ok=True)

                for n3, n3_items in n3_groups.items():
                    n3_slug = slug(n3)
                    n3_file = n2_subdir / f"N3_{n3_slug}.txt"

                    n4_groups: dict[str, list[dict]] = OrderedDict()
                    for t in n3_items:
                        n4 = t.get("nivel4") or "—"
                        if not es_vacio(n4):
                            if n4 not in n4_groups:
                                n4_groups[n4] = []
                            n4_groups[n4].append(t)

                    if not n4_groups:
                        leaf_cards = []
                        for t in n3_items:
                            url, target_blank = resolve_card_link(t)
                            leaf_cards.append({
                                "title": t.get("gestion") or t.get("nombreActual") or "",
                                "desc": t.get("descripcion") or "",
                                "url": url,
                                "target_blank": target_blank,
                            })
                        n3_file.write_text(
                            wrap_page(leaf_cards, n1, heading=n3, lead_text=get_node_desc(n3, n3_items)),
                            encoding="utf-8",
                        )
                        pages_count += 1
                        index_lines.append(
                            f"| `{n1_slug}/{n2_slug}/N3_{n3_slug}.txt` | Nivel 3 (Lista Directa) | {n1} > {n2} > **{n3}** | {len(leaf_cards)} |\n"
                        )
                    else:
                        n3_cards = []
                        for n4, n4_items in n4_groups.items():
                            n4_slug = slug(n4)
                            n3_cards.append({
                                "title": n4,
                                "desc": get_node_desc(n4, n4_items),
                                "url": f"/{n1_slug}/{n2_slug}/{n3_slug}/{n4_slug}/",
                                "target_blank": False,
                            })
                        n3_file.write_text(
                            wrap_page(n3_cards, n1, heading=n3, lead_text=get_node_desc(n3, n3_items)),
                            encoding="utf-8",
                        )
                        pages_count += 1
                        index_lines.append(
                            f"| `{n1_slug}/{n2_slug}/N3_{n3_slug}.txt` | Nivel 3 | {n1} > {n2} > **{n3}** | {len(n3_cards)} |\n"
                        )

                        n3_subdir = n2_subdir / n3_slug
                        n3_subdir.mkdir(parents=True, exist_ok=True)

                        for n4, n4_items in n4_groups.items():
                            n4_slug = slug(n4)
                            n4_file = n3_subdir / f"N4_{n4_slug}.txt"
                            leaf_cards = []
                            for t in n4_items:
                                url, target_blank = resolve_card_link(t)
                                leaf_cards.append({
                                    "title": t.get("gestion") or t.get("nombreActual") or "",
                                    "desc": t.get("descripcion") or "",
                                    "url": url,
                                    "target_blank": target_blank,
                                })
                            n4_file.write_text(
                                wrap_page(leaf_cards, n1, heading=n4, lead_text=get_node_desc(n4, n4_items)),
                                encoding="utf-8",
                            )
                            pages_count += 1
                            index_lines.append(
                                f"| `{n1_slug}/{n2_slug}/{n3_slug}/N4_{n4_slug}.txt` | Nivel 4 (Gestiones) | {n1} > {n2} > {n3} > **{n4}** | {len(leaf_cards)} |\n"
                            )

    indice_path = OUTPUT_DIR / "_INDICE.md"
    indice_path.write_text("".join(index_lines), encoding="utf-8")

    print(f"Generación WPBakery (Cero Raw HTML) completada con éxito: {pages_count} plantillas generadas en {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
