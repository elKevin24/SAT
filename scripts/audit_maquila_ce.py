#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
audit_maquila_ce.py
===================
Validador automático de contratos de inventario, plantillas maestras, lotes WPBakery,
hoja CSS base y documentación Markdown para la maquila de páginas de Comercio Exterior
del Portal SAT Guatemala.

Reglas verificadas:
  1. Inventario JSON y libro Excel (docs/maquila-paginas/01-inventario/).
  2. Plantillas maestras, lotes compilados .txt y estilos .css (docs/maquila-paginas/).
  3. Documentación Markdown (RESUMEN_INVENTARIO.md, GUIA_USO_MAQUILA.md, *.md).
  4. Cumplimiento estricto de WPBakery nativo (0 [vc_raw_html], 0 <iframe>, 0 <script>,
     100% [dt_breadcrumbs], active_section="0", icon_type="none", tablas en
     sat-mq-table-box, enlaces URL-encoded) y lenguaje claro (uso exclusivo de
     "gestión/gestiones").
"""

from __future__ import annotations

import argparse
from collections import Counter
from dataclasses import dataclass, field
import json
from pathlib import Path
import re
import sys
from typing import Any

try:
    import openpyxl
except ImportError as exc:  # pragma: no cover - dependencia del proyecto
    print(f"[FAIL] Dependencia faltante 'openpyxl': {exc}", file=sys.stderr)
    sys.exit(1)


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


BASE_DIR = Path(__file__).resolve().parent.parent
MAQUILA_DIR = BASE_DIR / "docs" / "maquila-paginas"
INVENTARIO_DIR = MAQUILA_DIR / "01-inventario"
PLANTILLAS_DIR = MAQUILA_DIR / "00-plantillas-maestras"

JSON_PATH = INVENTARIO_DIR / "matriz_maquila_ce.json"
XLSX_PATH = INVENTARIO_DIR / "matriz_maquila_comercio_exterior.xlsx"
CSS_BASE_PATH = PLANTILLAS_DIR / "sat-maquila-base.css"

EXPECTED_UNIQUE_URLS = 120
EXPECTED_TOTAL_ROWS = 197

VALID_ARCHETYPES = {"TIPO-1", "TIPO-2", "TIPO-3", "TIPO-4", "TIPO-5", "TIPO-6"}
VALID_OLAS = {"PAUSA", "OLA-1", "OLA-2", "OLA-3", "OLA-4"}

REQUIRED_URL_FIELDS = (
    "slug",
    "url",
    "url_base",
    "es_ancla",
    "row_count",
    "ids_sat_ges",
    "niveles_2",
    "niveles_3",
    "titulos_excel",
    "tipologias_observadas",
    "tipos_interaccion",
    "observaciones",
    "lc_true_count",
    "lc_false_count",
    "colision_tipologia",
    "arquetipo_maestro",
    "ola",
    "http_status",
    "final_url",
    "content_type",
    "page_title",
)

EXPECTED_SHEETS = (
    "Resumen Maquila",
    "Inventario Unico (120)",
    "Colisiones Tipologia",
    "Trazabilidad (197)",
)

JSON_URL_OWN_FIELDS = (
    "slug",
    "arquetipo_maestro",
    "ola",
    "estado_maquila",
    "criterio_arquetipo",
)
JSON_COLLISION_OWN_FIELDS = (
    "slug",
    "arquetipo_maestro",
    "criterio_resolucion",
)
JSON_TRACE_OWN_FIELDS = (
    "slug_destino",
    "arquetipo_maestro",
    "ola",
)

EXCEL_OWN_DATA_COLUMNS: dict[str, set[str]] = {
    "Inventario Unico (120)": {
        "Slug",
        "Arquetipo Maestro",
        "Ola",
        "Estado Maquila",
        "Es Ancla",
        "Colisión Tipología",
        "Criterio Arquetipo",
    },
    "Colisiones Tipologia": {
        "Slug",
        "Arquetipo Maestro",
        "Criterio de Resolución",
    },
    "Trazabilidad (197)": {
        "Slug Destino",
        "Arquetipo Maestro",
        "Ola",
    },
}

SLUG_RE = re.compile(r"[a-z0-9-]+")
PROHIBITED_WORD_RE = re.compile(r"\btr[a\u00e1]mites?\b", re.IGNORECASE)
RAW_SOURCE_TERM_RE = re.compile(r"tr[a\u00e1]mite\s+transaccional", re.IGNORECASE)
URL_LITERAL_RE = re.compile(r"https?://[^\s)>\]\"']+", re.IGNORECASE)
TOPIC_COUNTER_RE = re.compile(r"\bTema\s+\d+\s+de\s+\d+\b", re.IGNORECASE)
PLACEHOLDER_RE = re.compile(r"\{\{[A-Z0-9_]+\}\}")

FORBIDDEN_EMBED_RE = re.compile(
    r"\[vc_raw_html\b|<iframe\b|<script\b",
    re.IGNORECASE,
)
BREADCRUMBS_OPEN_RE = re.compile(r"\[dt_breadcrumbs\b([^\]]*)\]", re.IGNORECASE)
BREADCRUMBS_FONT_STYLE_RE = re.compile(
    r'(?i:\bfont_style)\s*=\s*(?:"italic:normal:none"|\'italic:normal:none\')'
)
BREADCRUMBS_ALIGNMENT_RE = re.compile(
    r'(?i:\balignment)\s*=\s*(?:"left"|\'left\')'
)
VC_ROW_BLOCK_RE = re.compile(
    r"\[vc_row\b([^\]]*)\](.*?)\[/vc_row\]",
    re.IGNORECASE | re.DOTALL,
)
VC_ROW_OPEN_RE = re.compile(r"\[vc_row\b([^\]]*)\]", re.IGNORECASE)
VC_ROW_CLOSE_RE = re.compile(r"\[/vc_row\]", re.IGNORECASE)
ROW_GAP_5PX_RE = re.compile(r'\bgap\s*=\s*(?:"5px"|\'5px\')', re.IGNORECASE)
ACCORDION_OPEN_RE = re.compile(r"\[vc_tta_accordion\b([^\]]*)\]", re.IGNORECASE)
ACCORDION_ACTIVE_ZERO_RE = re.compile(r'\bactive_section\s*=\s*(?:"0"|\'0\')')
INFOBOX_OPEN_RE = re.compile(r"\[bsf-info-box\b([^\]]*)\]", re.IGNORECASE)
INFOBOX_ICON_NONE_RE = re.compile(r'\bicon_type\s*=\s*(?:"none"|\'none\')', re.IGNORECASE)

LINK_ATTR_STRIP_RE = re.compile(
    r'link\s*=\s*(?:"url:[^"]*"|\'url:[^\']*\')',
    re.IGNORECASE,
)
HREF_ATTR_STRIP_RE = re.compile(
    r'href\s*=\s*(?:"[^"]*"|\'[^\']*\')',
    re.IGNORECASE,
)
SRC_ATTR_STRIP_RE = re.compile(
    r'src\s*=\s*(?:"[^"]*"|\'[^\']*\')',
    re.IGNORECASE,
)
LINK_URL_EXTRACT_RE = re.compile(r'link="url:([^|"]*)')
A_BLOCK_STRIP_RE = re.compile(
    r"<a\b[^>]*>(.*?)</a>",
    re.IGNORECASE | re.DOTALL,
)
RAW_URL_LINK_TEXT_RE = re.compile(
    r"<a\b[^>]*>\s*(?:https?://|www\.)[^<]*</a>",
    re.IGNORECASE,
)
GENERIC_CLICK_HERE_RE = re.compile(
    r"\b(?:haz\s+)?click?\s+aqu[ií]\b",
    re.IGNORECASE,
)
GESTION_MASC_ARTICLE_RE = re.compile(
    r"\b(?:el|al|del|un|los|estos|esos|aquellos)\s+gesti[oó]n(?:es)?\b",
    re.IGNORECASE,
)
GESTIONES_MASC_ADJ_RE = re.compile(
    r"\bgestiones\s+"
    r"(?!menos\b|nos\b|los\b|todos\b|otros\b|dos\b|estos\b|esos\b|aquellos\b|cuyos\b|"
    r"unos\b|ambos\b|varios\b|muchos\b|pocos\b|datos\b|casos\b|pagos\b|plazos\b|"
    r"avisos\b|pasos\b|efectos\b|derechos\b|documentos\b|requisitos\b|registros\b|"
    r"formularios\b|recursos\b|medios\b|procesos\b|archivos\b|servicios\b|impuestos\b|"
    r"contribuyentes\b|estados\b|ingresos\b|egresos\b|contratos\b|a[nñ]os\b|"
    r"elementos\b|procedimientos\b|instrumentos\b|reglamentos\b|lineamientos\b|"
    r"asuntos\b|puntos\b|montos\b|eventos\b|usuarios\b|funcionarios\b|horarios\b|"
    r"objetivos\b|motivos\b|incentivos\b|dispositivos\b|activos\b|aspectos\b|"
    r"productos\b|resultados\b)"
    r"[a-záéíóúñ]+(?:ad|id|ar|er|or|ori|ic|iv|ec|nt|ari|pi|ev|vi|uit)os\b",
    re.IGNORECASE,
)
GESTION_MASC_SING_ADJ_RE = re.compile(
    r"\bgesti[oó]n\s+"
    r"(?!no\b|como\b|bajo\b|junto\b|cuando\b|pero\b|sino\b|luego\b|todo\b|otro\b|"
    r"mucho\b|poco\b|solo\b|medio\b|punto\b|paso\b|caso\b|pago\b|plazo\b|aviso\b|"
    r"dato\b|archivo\b|documento\b|registro\b|formulario\b|proceso\b|servicio\b|"
    r"impuesto\b|estado\b|contrato\b|a[nñ]o\b|aspecto\b|producto\b|resultado\b|"
    r"objetivo\b|motivo\b|incentivo\b|dispositivo\b|activo\b|usuario\b|"
    r"funcionario\b|horario\b|elemento\b|procedimiento\b|instrumento\b|"
    r"reglamento\b|lineamiento\b|asunto\b|monto\b|evento\b)"
    r"[a-záéíóúñ]+(?:ad|id|er|ori|ic|iv|ari|pi|ev|vi|uit)o\b",
    re.IGNORECASE,
)
PLAIN_VISIBLE_URL_RE = re.compile(
    r"(?:https?://[^\s<>\"'\]]+|(?<!@)\b(?:www\.[a-z0-9.-]+\.[a-z]{2,}|portal\.sat\.gob\.gt)[^\s<>\"'\]]*)",
    re.IGNORECASE,
)
PLAIN_VISIBLE_EMAIL_RE = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
)

TABLE_OPEN_RE = re.compile(r"<table\b", re.IGNORECASE)
COLUMN_TEXT_BLOCK_RE = re.compile(
    r"\[vc_column_text\b([^\]]*)\](.*?)\[/vc_column_text\]",
    re.IGNORECASE | re.DOTALL,
)
EL_CLASS_ATTR_RE = re.compile(
    r'\bel_class\s*=\s*(?:"([^"]*)"|\'([^\']*)\')',
    re.IGNORECASE,
)

CSS_REQUIRED_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    (".sat-mq", re.compile(r"\.sat-mq\b")),
    ("--acento:#0284c7", re.compile(r"--acento\s*:\s*#0284c7\b", re.IGNORECASE)),
    (":focus-visible", re.compile(r":focus-visible\b")),
    (
        "@media(max-width:767px)",
        re.compile(r"@media\s*\(\s*max-width\s*:\s*767px\s*\)", re.IGNORECASE),
    ),
    (
        "@media(prefers-reduced-motion:reduce)",
        re.compile(
            r"@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)",
            re.IGNORECASE,
        ),
    ),
    (".sat-mq-table-box table", re.compile(r"\.sat-mq-table-box\s+table\b")),
)

MD_RULE_CONTEXT_RE = re.compile(
    r"(?:prohib|cero\s+|no\s+usar|evitar|sustitu|reemplaz|en\s+lugar\s+de|regla\s+12|t[eé]rmino\s+prohibido)",
    re.IGNORECASE,
)


@dataclass
class AuditReport:
    """Acumula hallazgos estructurados de la auditoría."""

    passes: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    metrics: dict[str, int] = field(default_factory=dict)

    def add_pass(self, section: str, message: str) -> None:
        self.passes.append(f"[{section}] {message}")

    def add_warn(self, section: str, message: str) -> None:
        self.warnings.append(f"[{section}] {message}")

    def add_error(self, section: str, message: str) -> None:
        self.errors.append(f"[{section}] {message}")


def _preview_items(items: list[str], limit: int = 8) -> str:
    if len(items) <= limit:
        return ", ".join(items)
    return f"{', '.join(items[:limit])} ... (+{len(items) - limit} más)"


def is_master_template(txt_path: Path) -> bool:
    """Determina si un archivo .txt corresponde a una plantilla maestra TIPO-*.txt."""
    return txt_path.parent == PLANTILLAS_DIR and txt_path.name.startswith("TIPO-")


def _collect_prohibited_in_records(
    records: list[Any],
    section_key: str,
    label_field: str,
    fields: tuple[str, ...],
    prohibited_hits: list[str],
    non_dict_indices: list[str] | None = None,
) -> None:
    """Busca el término prohibido (sin excepciones) en campos propios de registros JSON."""
    for idx, rec in enumerate(records):
        if not isinstance(rec, dict):
            if non_dict_indices is not None:
                non_dict_indices.append(str(idx))
            continue
        label = str(rec.get(label_field) or f"índice={idx}")
        for field_name in fields:
            val = rec.get(field_name)
            if isinstance(val, str) and PROHIBITED_WORD_RE.search(val):
                prohibited_hits.append(f"{section_key}[{label}].{field_name}: {val[:80]!r}")


def audit_inventory_json(report: AuditReport, allow_missing_inventory: bool) -> None:
    """Audita el contrato estructural y de contenido de matriz_maquila_ce.json."""
    section = "Inventario JSON"
    if not JSON_PATH.exists():
        msg = f"No existe {JSON_PATH.relative_to(BASE_DIR).as_posix()}"
        if allow_missing_inventory:
            report.add_warn(section, f"Omitido por --allow-missing-inventory: {msg}")
        else:
            report.add_error(section, msg)
        return

    try:
        data: Any = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        report.add_error(section, f"JSON inválido o ilegible ({JSON_PATH.name}): {exc}")
        return

    if not isinstance(data, dict):
        report.add_error(section, "El nodo raíz de matriz_maquila_ce.json debe ser un objeto JSON.")
        return

    urls_unicas = data.get("urls_unicas")
    colisiones_tipologia = data.get("colisiones_tipologia")
    trazabilidad_filas = data.get("trazabilidad_filas")

    if not isinstance(urls_unicas, list):
        report.add_error(section, "'urls_unicas' falta o no es una lista.")
        return

    report.metrics["json_urls_unicas"] = len(urls_unicas)
    if len(urls_unicas) == EXPECTED_UNIQUE_URLS:
        report.add_pass(section, f"urls_unicas contiene exactamente {EXPECTED_UNIQUE_URLS} registros.")
    else:
        report.add_error(
            section,
            f"Se esperaban {EXPECTED_UNIQUE_URLS} registros en urls_unicas y hay {len(urls_unicas)}.",
        )

    expected_collisions = sum(
        1 for u in urls_unicas if isinstance(u, dict) and u.get("colision_tipologia")
    )
    if not isinstance(colisiones_tipologia, list):
        report.add_error(section, "'colisiones_tipologia' falta o no es una lista.")
    else:
        report.metrics["json_colisiones_tipologia"] = len(colisiones_tipologia)
        if len(colisiones_tipologia) == expected_collisions:
            report.add_pass(
                section,
                f"colisiones_tipologia contiene exactamente {expected_collisions} registros "
                "(coincide con urls_unicas).",
            )
        else:
            report.add_error(
                section,
                f"Se esperaban {expected_collisions} registros en colisiones_tipologia según "
                f"urls_unicas y hay {len(colisiones_tipologia)}.",
            )

    if not isinstance(trazabilidad_filas, list):
        report.add_error(section, "'trazabilidad_filas' falta o no es una lista.")
    else:
        report.metrics["json_trazabilidad_filas"] = len(trazabilidad_filas)
        if len(trazabilidad_filas) == EXPECTED_TOTAL_ROWS:
            report.add_pass(
                section,
                f"trazabilidad_filas contiene exactamente {EXPECTED_TOTAL_ROWS} registros.",
            )
        else:
            report.add_error(
                section,
                f"Se esperaban {EXPECTED_TOTAL_ROWS} registros en trazabilidad_filas y hay {len(trazabilidad_filas)}.",
            )

    non_dict_indices: list[str] = []
    missing_fields_issues: list[str] = []
    invalid_slugs: list[str] = []
    slugs: list[str] = []
    invalid_row_counts: list[str] = []
    row_count_sum = 0
    invalid_archetypes: list[str] = []
    invalid_olas: list[str] = []
    invalid_estado_maquila: list[str] = []
    invalid_criterio_arquetipo: list[str] = []

    for idx, rec in enumerate(urls_unicas):
        if not isinstance(rec, dict):
            non_dict_indices.append(str(idx))
            continue

        slug = rec.get("slug")
        label = str(slug) if slug else f"índice={idx}"

        missing_keys = [k for k in REQUIRED_URL_FIELDS if k not in rec]
        if missing_keys:
            missing_fields_issues.append(f"{label} ({', '.join(missing_keys)})")

        if not isinstance(slug, str) or not slug or SLUG_RE.fullmatch(slug) is None:
            invalid_slugs.append(f"{idx}:{slug!r}")
        else:
            slugs.append(slug)

        rc = rec.get("row_count")
        if isinstance(rc, bool) or not isinstance(rc, int):
            invalid_row_counts.append(f"{label}={rc!r}")
        else:
            row_count_sum += rc

        arquetipo = rec.get("arquetipo_maestro")
        if arquetipo not in VALID_ARCHETYPES:
            invalid_archetypes.append(f"{label}={arquetipo!r}")

        ola = rec.get("ola")
        if ola not in VALID_OLAS:
            invalid_olas.append(f"{label}={ola!r}")

        estado_maquila = rec.get("estado_maquila")
        if not isinstance(estado_maquila, str) or not estado_maquila.strip():
            invalid_estado_maquila.append(f"{label}={estado_maquila!r}")

        criterio_arquetipo = rec.get("criterio_arquetipo")
        if not isinstance(criterio_arquetipo, str) or not criterio_arquetipo.strip():
            invalid_criterio_arquetipo.append(f"{label}={criterio_arquetipo!r}")

    if non_dict_indices:
        report.add_error(
            section,
            f"Registros no objeto en urls_unicas: {_preview_items(non_dict_indices)}",
        )

    if missing_fields_issues:
        report.add_error(
            section,
            f"{len(missing_fields_issues)} registros con campos obligatorios faltantes: "
            f"{_preview_items(missing_fields_issues, limit=5)}",
        )
    else:
        report.add_pass(section, "Todos los registros de urls_unicas tienen los 21 campos obligatorios.")

    if invalid_slugs:
        report.add_error(
            section,
            f"{len(invalid_slugs)} slugs inválidos (deben ser ASCII kebab-case ^[a-z0-9-]+$): "
            f"{_preview_items(invalid_slugs)}",
        )

    duplicate_slugs = [s for s, count in Counter(slugs).items() if count > 1]
    if duplicate_slugs:
        report.add_error(
            section,
            f"Slugs duplicados ({len(duplicate_slugs)}): {_preview_items(duplicate_slugs)}",
        )
    elif not invalid_slugs and len(set(slugs)) == EXPECTED_UNIQUE_URLS:
        report.add_pass(section, f"{EXPECTED_UNIQUE_URLS} slugs ASCII kebab-case válidos y sin duplicados.")

    if invalid_row_counts:
        report.add_error(
            section,
            f"Valores row_count no enteros: {_preview_items(invalid_row_counts)}",
        )
    elif row_count_sum == EXPECTED_TOTAL_ROWS:
        report.add_pass(section, f"Suma de row_count == {EXPECTED_TOTAL_ROWS}.")
    else:
        report.add_error(
            section,
            f"La suma de row_count es {row_count_sum} (se esperaba {EXPECTED_TOTAL_ROWS}).",
        )

    if invalid_archetypes:
        report.add_error(
            section,
            f"arquetipo_maestro fuera de catálogo: {_preview_items(invalid_archetypes)}",
        )
    else:
        report.add_pass(section, "100% de registros con arquetipo_maestro en TIPO-1..TIPO-6.")

    if invalid_olas:
        report.add_error(
            section,
            f"ola fuera de catálogo: {_preview_items(invalid_olas)}",
        )
    else:
        report.add_pass(section, "100% de registros con ola válida (PAUSA / OLA-1..OLA-4).")

    if invalid_estado_maquila:
        report.add_error(
            section,
            f"estado_maquila vacío o inválido en urls_unicas: {_preview_items(invalid_estado_maquila)}",
        )
    else:
        report.add_pass(section, "100% de registros en urls_unicas tienen estado_maquila no vacío.")

    if invalid_criterio_arquetipo:
        report.add_error(
            section,
            f"criterio_arquetipo vacío o inválido en urls_unicas: {_preview_items(invalid_criterio_arquetipo)}",
        )
    else:
        report.add_pass(section, "100% de registros en urls_unicas tienen criterio_arquetipo no vacío.")

    json_prohibited_hits: list[str] = []
    non_dict_colisiones: list[str] = []
    non_dict_trazabilidad: list[str] = []

    _collect_prohibited_in_records(
        urls_unicas,
        "urls_unicas",
        "slug",
        JSON_URL_OWN_FIELDS,
        json_prohibited_hits,
    )
    if isinstance(colisiones_tipologia, list):
        _collect_prohibited_in_records(
            colisiones_tipologia,
            "colisiones_tipologia",
            "slug",
            JSON_COLLISION_OWN_FIELDS,
            json_prohibited_hits,
            non_dict_colisiones,
        )
    if isinstance(trazabilidad_filas, list):
        _collect_prohibited_in_records(
            trazabilidad_filas,
            "trazabilidad_filas",
            "slug_destino",
            JSON_TRACE_OWN_FIELDS,
            json_prohibited_hits,
            non_dict_trazabilidad,
        )

    if non_dict_colisiones:
        report.add_error(
            section,
            f"Registros no objeto en colisiones_tipologia: {_preview_items(non_dict_colisiones)}",
        )
    if non_dict_trazabilidad:
        report.add_error(
            section,
            f"Registros no objeto en trazabilidad_filas: {_preview_items(non_dict_trazabilidad)}",
        )

    if json_prohibited_hits:
        report.add_error(
            section,
            f"Término prohibido detectado en campos propios del JSON ({len(json_prohibited_hits)}): "
            f"{_preview_items(json_prohibited_hits, limit=6)}",
        )
    elif isinstance(colisiones_tipologia, list) and isinstance(trazabilidad_filas, list):
        report.add_pass(
            section,
            "0 menciones de término prohibido en campos propios del JSON "
            "(urls_unicas, colisiones_tipologia, trazabilidad_filas).",
        )


def _contains_prohibited_term_clean(text: str, allow_raw_source_term: bool = False) -> bool:
    """Evalúa presencia del término prohibido ignorando URLs literales."""
    cleaned = URL_LITERAL_RE.sub(" ", text)
    if allow_raw_source_term:
        cleaned = RAW_SOURCE_TERM_RE.sub(" ", cleaned)
    return PROHIBITED_WORD_RE.search(cleaned) is not None


def audit_inventory_excel(report: AuditReport, allow_missing_inventory: bool) -> None:
    """Audita hojas, encabezados y rótulos propios de matriz_maquila_comercio_exterior.xlsx."""
    section = "Inventario Excel"
    if not XLSX_PATH.exists():
        msg = f"No existe {XLSX_PATH.relative_to(BASE_DIR).as_posix()}"
        if allow_missing_inventory:
            report.add_warn(section, f"Omitido por --allow-missing-inventory: {msg}")
        else:
            report.add_error(section, msg)
        return

    wb = None
    try:
        wb = openpyxl.load_workbook(XLSX_PATH, read_only=True, data_only=False)
        sheetnames = list(wb.sheetnames)
        report.metrics["xlsx_sheets"] = len(sheetnames)

        missing_sheets = [s for s in EXPECTED_SHEETS if s not in sheetnames]
        extra_sheets = [s for s in sheetnames if s not in EXPECTED_SHEETS]
        if missing_sheets or extra_sheets or len(sheetnames) != len(EXPECTED_SHEETS):
            report.add_error(
                section,
                f"Hojas inválidas. Faltantes={missing_sheets}, Extras={extra_sheets}, Actuales={sheetnames}",
            )
        else:
            report.add_pass(section, f"Contiene las {len(EXPECTED_SHEETS)} hojas exactas requeridas.")

        prohibited_hits: list[str] = []

        for sname in sheetnames:
            if PROHIBITED_WORD_RE.search(sname):
                prohibited_hits.append(f"nombre_hoja='{sname}'")

            ws = wb[sname]
            if sname == "Resumen Maquila":
                for r_idx, row in enumerate(ws.iter_rows(values_only=True), start=1):
                    for c_idx, val in enumerate(row, start=1):
                        if not isinstance(val, str):
                            continue
                        text = val.strip()
                        if not text or text.startswith("="):
                            continue
                        if _contains_prohibited_term_clean(text, allow_raw_source_term=False):
                            prohibited_hits.append(f"Resumen Maquila ({r_idx},{c_idx}): {text[:80]!r}")
            else:
                row_iter = ws.iter_rows(values_only=True)
                header_row = next(row_iter, ())
                own_headers = EXCEL_OWN_DATA_COLUMNS.get(sname, set())
                own_col_indices: list[tuple[int, str]] = []

                for c_idx, val in enumerate(header_row, start=1):
                    if not isinstance(val, str):
                        continue
                    text = val.strip()
                    if not text or text.startswith("="):
                        continue
                    if _contains_prohibited_term_clean(text, allow_raw_source_term=False):
                        prohibited_hits.append(f"{sname} fila 1 col {c_idx}: {text[:80]!r}")
                    if text in own_headers:
                        own_col_indices.append((c_idx - 1, text))

                if own_col_indices:
                    for r_idx, row in enumerate(row_iter, start=2):
                        row_len = len(row)
                        for zero_idx, col_name in own_col_indices:
                            if zero_idx >= row_len:
                                continue
                            val = row[zero_idx]
                            if not isinstance(val, str):
                                continue
                            text = val.strip()
                            if not text or text.startswith("="):
                                continue
                            if _contains_prohibited_term_clean(text, allow_raw_source_term=False):
                                prohibited_hits.append(
                                    f"{sname} ({r_idx},{zero_idx + 1} '{col_name}'): {text[:80]!r}"
                                )

        if prohibited_hits:
            report.add_error(
                section,
                f"Término prohibido detectado en nombres/encabezados/rótulos propios de Excel "
                f"({len(prohibited_hits)}): {_preview_items(prohibited_hits, limit=6)}",
            )
        else:
            report.add_pass(
                section,
                "0 menciones de término prohibido en Resumen Maquila, fila 1 y columnas propias "
                "(filas >= 2) de hojas 2-4.",
            )
    except Exception as exc:
        report.add_error(section, f"No se pudo leer el libro Excel ({XLSX_PATH.name}): {exc}")
    finally:
        if wb is not None:
            wb.close()


def _extract_valid_table_spans(content: str) -> list[tuple[int, int]]:
    """Retorna spans internos de bloques [vc_column_text] que incluyen la clase sat-mq-table-box."""
    spans: list[tuple[int, int]] = []
    for block in COLUMN_TEXT_BLOCK_RE.finditer(content):
        attrs = block.group(1)
        el_class_m = EL_CLASS_ATTR_RE.search(attrs)
        if not el_class_m:
            continue
        classes = (el_class_m.group(1) or el_class_m.group(2) or "").split()
        if "sat-mq-table-box" in classes:
            spans.append(block.span(2))
    return spans


def _validate_breadcrumbs(content: str, rel_name: str, report: AuditReport) -> None:
    """Valida atributos obligatorios de [dt_breadcrumbs] y ausencia de gap='5px' en su fila."""
    section = "Shortcodes .txt"
    bc_matches = list(BREADCRUMBS_OPEN_RE.finditer(content))
    if not bc_matches:
        report.add_error(section, f"[{rel_name}] Falta shortcode obligatorio [dt_breadcrumbs].")
        return

    flagged_row_starts: set[int] = set()
    vc_row_blocks = list(VC_ROW_BLOCK_RE.finditer(content))

    for idx, bc_match in enumerate(bc_matches, start=1):
        attrs = bc_match.group(1)
        if not BREADCRUMBS_FONT_STYLE_RE.search(attrs):
            report.add_error(
                section,
                f"[{rel_name}] Shortcode #{idx} ([dt_breadcrumbs]) sin font_style=\"italic:normal:none\".",
            )
        if not BREADCRUMBS_ALIGNMENT_RE.search(attrs):
            report.add_error(
                section,
                f"[{rel_name}] Shortcode #{idx} ([dt_breadcrumbs]) sin alignment=\"left\".",
            )

        enclosing_rows = [
            rm for rm in vc_row_blocks if rm.start(2) <= bc_match.start() < rm.end(2)
        ]
        if enclosing_rows:
            for rm in enclosing_rows:
                if rm.start() not in flagged_row_starts and ROW_GAP_5PX_RE.search(rm.group(1)):
                    flagged_row_starts.add(rm.start())
                    report.add_error(
                        section,
                        f"[{rel_name}] La fila de breadcrumb ([vc_row]) contiene gap=\"5px\" prohibido.",
                    )
        else:
            prefix = content[: bc_match.start()]
            open_rows = list(VC_ROW_OPEN_RE.finditer(prefix))
            if open_rows:
                last_open = open_rows[-1]
                if not VC_ROW_CLOSE_RE.search(prefix[last_open.end() :]):
                    if (
                        last_open.start() not in flagged_row_starts
                        and ROW_GAP_5PX_RE.search(last_open.group(1))
                    ):
                        flagged_row_starts.add(last_open.start())
                        report.add_error(
                            section,
                            f"[{rel_name}] La fila de apertura de breadcrumb ([vc_row]) contiene "
                            "gap=\"5px\" prohibido.",
                        )


def _validate_txt_file(txt_path: Path, report: AuditReport) -> None:
    """Valida un archivo .txt (plantilla maestra o lote compilado) bajo reglas SAT/WPBakery."""
    section = "Shortcodes .txt"
    rel_name = txt_path.relative_to(MAQUILA_DIR).as_posix()
    master = is_master_template(txt_path)

    try:
        content = txt_path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        report.add_error(section, f"[{rel_name}] Error de lectura: {exc}")
        return

    if FORBIDDEN_EMBED_RE.search(content):
        report.add_error(
            section,
            f"[{rel_name}] Contiene [vc_raw_html], <iframe> o <script> prohibido.",
        )

    _validate_breadcrumbs(content, rel_name, report)

    for idx, acc_match in enumerate(ACCORDION_OPEN_RE.finditer(content), start=1):
        attrs = acc_match.group(1)
        if not ACCORDION_ACTIVE_ZERO_RE.search(attrs):
            report.add_error(
                section,
                f"[{rel_name}] Acordeón #{idx} ([vc_tta_accordion]) sin active_section=\"0\".",
            )

    for idx, box_match in enumerate(INFOBOX_OPEN_RE.finditer(content), start=1):
        attrs = box_match.group(1)
        if not INFOBOX_ICON_NONE_RE.search(attrs):
            report.add_error(
                section,
                f"[{rel_name}] Tarjeta/caja #{idx} ([bsf-info-box]) sin icon_type=\"none\".",
            )

    if "[email protected]" in content.lower():
        report.add_error(
            section,
            f"[{rel_name}] Contiene correo ofuscado '[email protected]' de Cloudflare.",
        )

    visible_text = LINK_ATTR_STRIP_RE.sub(" ", content)
    visible_text = HREF_ATTR_STRIP_RE.sub(" ", visible_text)
    visible_text = SRC_ATTR_STRIP_RE.sub(" ", visible_text)
    if PROHIBITED_WORD_RE.search(visible_text):
        report.add_error(
            section,
            f"[{rel_name}] Contiene término prohibido en texto visible (usar 'gestión/gestiones').",
        )

    grammar_hits: list[str] = []
    grammar_hits.extend(m.group(0) for m in GESTION_MASC_ARTICLE_RE.finditer(visible_text))
    grammar_hits.extend(m.group(0) for m in GESTIONES_MASC_ADJ_RE.finditer(visible_text))
    grammar_hits.extend(m.group(0) for m in GESTION_MASC_SING_ADJ_RE.finditer(visible_text))
    if grammar_hits:
        report.add_error(
            section,
            f"[{rel_name}] Discordancia gramatical con 'gestión/gestiones': "
            f"{_preview_items(grammar_hits, limit=6)}",
        )

    click_hits = [m.group(0) for m in GENERIC_CLICK_HERE_RE.finditer(visible_text)]
    if click_hits:
        report.add_error(
            section,
            f"[{rel_name}] Texto genérico de enlace prohibido (reemplazar por acción descriptiva): "
            f"{_preview_items(click_hits, limit=5)}",
        )

    raw_link_texts: list[str] = []
    for a_match in A_BLOCK_STRIP_RE.finditer(content):
        inner_plain = re.sub(r"<[^>]+>", "", a_match.group(1)).strip()
        if RAW_URL_LINK_TEXT_RE.match(a_match.group(0)) or re.match(
            r"^(?:https?://|www\.)", inner_plain, re.IGNORECASE
        ):
            raw_link_texts.append(inner_plain[:70])
    if raw_link_texts:
        report.add_error(
            section,
            f"[{rel_name}] Enlace <a> usa URL cruda como texto visible: "
            f"{_preview_items(raw_link_texts, limit=5)}",
        )

    plain_no_links = A_BLOCK_STRIP_RE.sub(" ", visible_text)
    plain_url_hits = [m.group(0)[:70] for m in PLAIN_VISIBLE_URL_RE.finditer(plain_no_links)]
    if plain_url_hits:
        report.add_error(
            section,
            f"[{rel_name}] URL suelta en texto plano visible (convertir a enlace <a> o botón WPBakery): "
            f"{_preview_items(plain_url_hits, limit=5)}",
        )
    plain_email_hits = [m.group(0) for m in PLAIN_VISIBLE_EMAIL_RE.finditer(plain_no_links)]
    if plain_email_hits:
        report.add_error(
            section,
            f"[{rel_name}] Correo electrónico suelto en texto plano sin mailto: "
            f"{_preview_items(plain_email_hits, limit=5)}",
        )

    topic_match = TOPIC_COUNTER_RE.search(visible_text)
    if topic_match:
        report.add_error(
            section,
            f"[{rel_name}] Contiene contador prohibido '{topic_match.group(0)}'.",
        )

    table_matches = list(TABLE_OPEN_RE.finditer(content))
    if table_matches:
        valid_spans = _extract_valid_table_spans(content)
        unwrapped = [
            i
            for i, tm in enumerate(table_matches, start=1)
            if not any(start <= tm.start() < end for start, end in valid_spans)
        ]
        if unwrapped:
            report.add_error(
                section,
                f"[{rel_name}] Tabla(s) {unwrapped} fuera de [vc_column_text el_class=\"...sat-mq-table-box...\"].",
            )

    if not master:
        unresolved = sorted(set(PLACEHOLDER_RE.findall(content)))
        if unresolved:
            report.add_error(
                section,
                f"[{rel_name}] Placeholders sin resolver: {_preview_items(unresolved)}",
            )

        bad_links: list[str] = []
        for lm in LINK_URL_EXTRACT_RE.finditer(content):
            url_val = lm.group(1)
            if not url_val:
                bad_links.append("<vacío>")
                continue
            if "://" in url_val or "#" in url_val:
                bad_links.append(url_val[:70])
                continue
            lower_val = url_val.lower()
            if "%3a%2f%2f" not in lower_val and not lower_val.startswith("%23"):
                bad_links.append(url_val[:70])

        if bad_links:
            report.add_error(
                section,
                f"[{rel_name}] Atributo(s) link=\"url:...\" sin codificación WPBakery (%3A%2F%2F o %23): "
                f"{_preview_items(bad_links, limit=5)}",
            )


def _validate_css_file(css_path: Path, report: AuditReport) -> None:
    """Valida una hoja CSS bajo las reglas estructurales y de lenguaje de maquila."""
    section = "Estilos .css"
    rel_name = css_path.relative_to(MAQUILA_DIR).as_posix()

    try:
        content = css_path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        report.add_error(section, f"[{rel_name}] Error de lectura: {exc}")
        return

    missing_tokens = [
        label for label, pattern in CSS_REQUIRED_PATTERNS if pattern.search(content) is None
    ]
    if missing_tokens:
        report.add_error(
            section,
            f"[{rel_name}] Faltan selectores/reglas obligatorias: {', '.join(missing_tokens)}",
        )
    else:
        report.add_pass(section, f"[{rel_name}] Cumple todos los tokens CSS requeridos.")

    if _contains_prohibited_term_clean(content, allow_raw_source_term=False):
        report.add_error(
            section,
            f"[{rel_name}] Contiene término prohibido en comentarios o reglas CSS.",
        )


def audit_templates_and_css(report: AuditReport) -> None:
    """Audita la existencia de plantillas maestras, CSS base y todos los .txt/.css de maquila."""
    section_req = "Plantillas Maestras"
    if not MAQUILA_DIR.exists():
        report.add_error(section_req, f"No existe el directorio {MAQUILA_DIR.relative_to(BASE_DIR).as_posix()}")
        return

    if CSS_BASE_PATH.exists():
        report.add_pass(section_req, f"Existe {CSS_BASE_PATH.relative_to(BASE_DIR).as_posix()}.")
    else:
        report.add_error(section_req, f"Falta hoja CSS base obligatoria: {CSS_BASE_PATH.relative_to(BASE_DIR).as_posix()}")

    for num in range(1, 7):
        matches = sorted(PLANTILLAS_DIR.glob(f"TIPO-{num}_*.txt")) if PLANTILLAS_DIR.exists() else []
        if not matches:
            report.add_error(section_req, f"Falta plantilla maestra obligatoria: TIPO-{num}_*.txt")
        elif len(matches) > 1:
            names = [m.name for m in matches]
            report.add_error(section_req, f"Múltiples plantillas TIPO-{num}_*.txt encontradas: {', '.join(names)}")
        else:
            report.add_pass(section_req, f"Plantilla maestra presente: {matches[0].name}")

    txt_files = sorted(MAQUILA_DIR.rglob("*.txt"))
    css_files = sorted(MAQUILA_DIR.rglob("*.css"))
    report.metrics["txt_files"] = len(txt_files)
    report.metrics["txt_master"] = sum(1 for p in txt_files if is_master_template(p))
    report.metrics["txt_compiled"] = len(txt_files) - report.metrics["txt_master"]
    report.metrics["css_files"] = len(css_files)

    errors_before_txt = len(report.errors)
    for txt_path in txt_files:
        _validate_txt_file(txt_path, report)
    if txt_files and len(report.errors) == errors_before_txt:
        report.add_pass(
            "Shortcodes .txt",
            f"Los {len(txt_files)} archivos .txt superaron todas las validaciones WPBakery y de lenguaje.",
        )

    for css_path in css_files:
        _validate_css_file(css_path, report)


def _strip_markdown_inline_exceptions(line: str) -> str:
    """Elimina backticks en línea, URLs literales y la etiqueta cruda de origen."""
    cleaned = re.sub(r"`[^`]*`", " ", line)
    cleaned = URL_LITERAL_RE.sub(" ", cleaned)
    cleaned = RAW_SOURCE_TERM_RE.sub(" ", cleaned)
    return cleaned


def _validate_markdown_file(md_path: Path, report: AuditReport) -> None:
    """Audita encabezados y prosa propia en archivos Markdown de maquila."""
    section = "Markdown"
    rel_name = md_path.relative_to(MAQUILA_DIR).as_posix()

    try:
        lines = md_path.read_text(encoding="utf-8").splitlines()
    except (OSError, UnicodeDecodeError) as exc:
        report.add_error(section, f"[{rel_name}] Error de lectura: {exc}")
        return

    in_fence = False
    fence_char = ""
    heading_errors: list[str] = []
    body_errors: list[str] = []
    rule_mentions: list[str] = []

    for line_no, raw_line in enumerate(lines, start=1):
        stripped = raw_line.strip()
        fence_match = re.match(r"^(`{3,}|~{3,})", stripped)
        if fence_match:
            marker = fence_match.group(1)[0]
            if not in_fence:
                in_fence = True
                fence_char = marker
            elif marker == fence_char:
                in_fence = False
                fence_char = ""
            continue

        if in_fence:
            continue

        heading_match = re.match(r"^\s{0,3}#{1,6}\s+(.+)$", raw_line)
        if heading_match:
            heading_text = heading_match.group(1)
            if PROHIBITED_WORD_RE.search(heading_text):
                heading_errors.append(f"L{line_no}: {heading_text[:70]!r}")
            continue

        cleaned = _strip_markdown_inline_exceptions(raw_line)
        if PROHIBITED_WORD_RE.search(cleaned):
            if MD_RULE_CONTEXT_RE.search(cleaned):
                rule_mentions.append(f"L{line_no}")
            else:
                body_errors.append(f"L{line_no}: {stripped[:70]!r}")

    if heading_errors:
        report.add_error(
            section,
            f"[{rel_name}] Término prohibido en encabezados '#': {_preview_items(heading_errors, limit=5)}",
        )
    if body_errors:
        report.add_error(
            section,
            f"[{rel_name}] Término prohibido en texto/títulos fuera de URLs/backticks: "
            f"{_preview_items(body_errors, limit=5)}",
        )
    if rule_mentions:
        report.add_warn(
            section,
            f"[{rel_name}] Mención documental de la regla de prohibición detectada en líneas: "
            f"{_preview_items(rule_mentions)}",
        )
    if not heading_errors and not body_errors:
        report.add_pass(section, f"[{rel_name}] Encabezados y contenido propio sin término prohibido.")


def audit_markdown_docs(report: AuditReport, allow_missing_inventory: bool) -> None:
    """Audita RESUMEN_INVENTARIO.md, GUIA_USO_MAQUILA.md y demás .md en docs/maquila-paginas/."""
    section = "Markdown"
    if not MAQUILA_DIR.exists():
        return

    md_files = sorted(MAQUILA_DIR.rglob("*.md"))
    report.metrics["md_files"] = len(md_files)
    found_names = {p.name for p in md_files}

    for expected_md in ("RESUMEN_INVENTARIO.md", "GUIA_USO_MAQUILA.md"):
        if expected_md not in found_names:
            if expected_md == "RESUMEN_INVENTARIO.md" and allow_missing_inventory:
                report.add_warn(section, f"Omitido por --allow-missing-inventory: no encontrado {expected_md}.")
            else:
                report.add_warn(section, f"Documento Markdown aún no encontrado en docs/maquila-paginas/: {expected_md}.")

    for md_path in md_files:
        _validate_markdown_file(md_path, report)


def print_report(report: AuditReport) -> None:
    """Imprime el resumen estructurado de la auditoría."""
    print("=" * 80)
    print("AUDITORÍA AUTOMÁTICA DE MAQUILA COMERCIO EXTERIOR — SAT GUATEMALA")
    print(f"Directorio auditado: {MAQUILA_DIR.relative_to(BASE_DIR).as_posix()}")
    print("=" * 80)

    if report.metrics:
        print("\nMÉTRICAS OBSERVADAS:")
        for key, value in report.metrics.items():
            print(f"  - {key}: {value}")

    if report.passes:
        print(f"\nVALIDACIONES SUPERADAS ({len(report.passes)}):")
        for item in report.passes:
            print(f"  [PASS] {item}")

    if report.warnings:
        print(f"\nADVERTENCIAS ({len(report.warnings)}):")
        for item in report.warnings:
            print(f"  [WARN] {item}")

    if report.errors:
        print(f"\nERRORES DETECTADOS ({len(report.errors)}):")
        for item in report.errors:
            print(f"  [FAIL] {item}")

    print("\n" + "=" * 80)
    estado = "PASSED (0 errores)" if not report.errors else f"FAILED ({len(report.errors)} error(es))"
    print(
        f"RESULTADO FINAL: {estado} | "
        f"PASS={len(report.passes)} | WARN={len(report.warnings)} | FAIL={len(report.errors)}"
    )
    print("=" * 80)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Valida contratos de inventario, plantillas WPBakery, CSS y Markdown de maquila CE.",
    )
    parser.add_argument(
        "--allow-missing-inventory",
        action="store_true",
        help="Permite omitir la falla si aún no existen matriz_maquila_ce.json o el libro Excel.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    report = AuditReport()

    audit_inventory_json(report, allow_missing_inventory=args.allow_missing_inventory)
    audit_inventory_excel(report, allow_missing_inventory=args.allow_missing_inventory)
    audit_templates_and_css(report)
    audit_markdown_docs(report, allow_missing_inventory=args.allow_missing_inventory)

    print_report(report)
    return 1 if report.errors else 0


if __name__ == "__main__":
    sys.exit(main())
