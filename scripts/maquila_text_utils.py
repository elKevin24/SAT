#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
maquila_text_utils.py
=====================
Utilidades puras y deterministas para normalización de fechas en español accesible,
reemplazo seguro de fechas en texto visible (HTML / shortcodes WPBakery) y
estandarización a Sentence Case de títulos normativos y documentales del Portal SAT.
"""

from __future__ import annotations

import datetime
import re
import unicodedata

__all__ = [
    "format_spanish_date",
    "replace_visible_dates",
    "normalize_legislacion_title",
]

SPANISH_MONTHS: tuple[str, ...] = (
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
)

MIN_DATE_YEAR = 1990
MAX_DATE_YEAR = 2035

_STRICT_DATE_RE = re.compile(r"^\s*(\d{1,2})[-/](\d{1,2})[-/](\d{4})\s*$")

_PROTECTED_OR_DATE_RE = re.compile(
    r"""
    (?P<protected>
        <[a-zA-Z!/][^>]*>
        | (?:href|src|link)\s*=\s*(?:"[^"]*"|'[^']*')
        | https?://[^\s<>"'\]]+
        | www\.[a-z0-9.-]+\.[a-z]{2,}[^\s<>"'\]]*
    )
    | (?<![A-Za-z0-9-])(?P<day>\d{1,2})[-/](?P<month>\d{1,2})[-/](?P<year>\d{4})(?![A-Za-z0-9-])
    """,
    re.IGNORECASE | re.VERBOSE,
)

_TYPO_MAP: dict[str, str] = {
    "tánsito": "tránsito",
    "disposiones": "disposiciones",
    "tranferencia": "transferencia",
    "intedencia": "intendencia",
    "resolucion": "resolución",
    "trasmisión": "transmisión",
    "trasmision": "transmisión",
    "defraudacion": "defraudación",
    "priavado": "privado",
    "numero": "número",
    "codigo": "código",
    "deposito": "depósito",
    "importacion": "importación",
    "exportacion": "exportación",
    "administracion": "administración",
    "autorizacion": "autorización",
    "exoneracion": "exoneración",
    "integracion": "integración",
    "transmision": "transmisión",
    "electronica": "electrónica",
    "electronico": "electrónico",
    "electronicas": "electrónicas",
    "electronicos": "electrónicos",
    "especifico": "específico",
    "especifica": "específica",
    "matricula": "matrícula",
    "vehiculos": "vehículos",
    "vehiculo": "vehículo",
    "genericos": "genéricos",
    "republica": "república",
    "ultima": "última",
    "via": "vía",
    "poliza": "póliza",
    "economico": "económico",
    "economica": "económica",
    "economicos": "económicos",
    "economicas": "económicas",
    "tecnico": "técnico",
    "tecnica": "técnica",
    "tecnicos": "técnicos",
    "tecnicas": "técnicas",
    "quimico": "químico",
    "quimica": "química",
    "conocera": "conocerá",
}

_ALWAYS_UPPER_ACRONYMS: frozenset[str] = frozenset(
    {
        "IVA",
        "IPRIMA",
        "CAUCA",
        "RECAUCA",
        "SAC",
        "COMIECO",
        "ATU",
        "EPSME",
        "OEA",
        "TLC",
        "DUA",
        "SAT",
        "SC",
        "GT",
    }
)

_CONTEXTUAL_UPPER_ACRONYMS: frozenset[str] = frozenset({"TU", "CA", "EX"})

_ROMAN_NUMERAL_RE = re.compile(
    r"^(?:X{0,3}(?:IX|IV|V?I{1,3})|XL(?:IX|IV|V?I{0,3})|L(?:XXX|XX|X)?(?:IX|IV|V?I{0,3}))$"
)

_CODE_TOKEN_RE = re.compile(
    r"^(?:"
    r"(?:R-SAT|Res-SAT|DIR-SAT|SAT|PR)(?:-[A-Za-z0-9/_]+)+"
    r"|(?:[A-Za-z0-9]+/)+[A-Za-z0-9-]+"
    r"|(?:[A-Za-z0-9]+_)+[A-Za-z0-9_]+"
    r"|[A-Za-z]+-\d+[A-Za-z0-9-]*"
    r"|\d+(?:-\d+)+"
    r"|v\d+"
    r"|R-SAT"
    r"|COMIECO-EX"
    r"|OEA-GT"
    r")$",
    re.IGNORECASE,
)

_SLUG_PROTECTED_RE = re.compile(
    r"\b(?:R-SAT|Res-SAT|DIR-SAT|SAT)[-_](?:[A-Za-z0-9]+[-_])*\d{2,4}\b"
    r"|\b\d{1,4}-\d{2,4}\b"
    r"|\b(?:COMIECO-EX|OEA-GT|R-SAT)\b",
    re.IGNORECASE,
)

_ABBREV_CANONICAL: dict[str, str] = {
    "no.": "No.",
    "acdo.": "Acdo.",
    "direc.": "Direc.",
    "ing.": "Ing.",
    "admon.": "admon.",
}

_NON_SENTENCE_END_ABBREVS: frozenset[str] = frozenset(
    {"no.", "acdo.", "direc.", "ing.", "admon.", "art.", "arts.", "vig.", "v."}
)

_PROPER_PHRASES: tuple[str, ...] = tuple(
    sorted(
        (
            "Empresa Portuaria Nacional Santo Tomás de Castilla",
            "Puerto Fronterizo Ing. Juan Luis Lizarralde Arrivilla",
            "Ing. Juan Luis Lizarralde Arrivilla",
            "Santo Tomás de Castilla",
            "Superintendencia de Administración Tributaria",
            "Superintendencia de Administración",
            "Ley contra la Defraudación y el Contrabando Aduaneros",
            "Tratado General de Integración Económica Centroamericana",
            "Tratado General de Integración Centroamericana",
            "Código Aduanero Uniforme Centroamericano",
            "Sistema Arancelario Centroamericano",
            "Ley de Incentivos para Movilidad Eléctrica",
            "Ley de Actualización Tributaria",
            "Ley Aduanera Nacional",
            "Ley de Aduanas",
            "Código de Salud",
            "Arancel Centroamericano de Importación",
            "Comité Nacional de Valoración Aduanera",
            "Comité Arancelario",
            "Tribunal Aduanero Nacional",
            "Tratado de Libre Comercio",
            "República Dominicana",
            "Estados Unidos",
            "Centroamérica",
            "Guatemala",
            "Panamá",
            "Aduana de Vehículos",
            "Aduana de Tecún Umán",
            "Aduana El Ceibo",
            "Aduana Central",
            "Tecún Umán",
            "El Ceibo",
            "Entre Ríos",
            "Emporac",
            "Intendente de Recaudación y Gestión",
            "Intendencia de Aduanas",
            "Intendente de Aduanas",
            "Intendencia",
            "Superintendencia",
            "Superintendente",
            "Directorio",
            "Congreso de la República",
            "Congreso",
            "Acdo. Direc.",
            "Diario Oficial",
            "Operador Económico Autorizado",
            "Operadores Económicos Autorizados",
            "Fourier",
        ),
        key=len,
        reverse=True,
    )
)

_PROPER_PHRASE_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = tuple(
    (
        phrase,
        re.compile(
            rf"(?<![A-Za-zÁÉÍÓÚÑáéíóúñ0-9]){re.escape(phrase)}(?![A-Za-zÁÉÍÓÚÑáéíóúñ0-9])",
            re.IGNORECASE,
        ),
    )
    for phrase in _PROPER_PHRASES
)


def format_spanish_date(date_str: str) -> str:
    """Convierte ``DD-MM-YYYY`` o ``D/M/YYYY`` al formato español accesible sin cero inicial."""
    if not isinstance(date_str, str):
        raise ValueError(f"Se esperaba cadena de fecha, recibido {type(date_str).__name__}.")
    match = _STRICT_DATE_RE.match(date_str)
    if not match:
        raise ValueError(f"Formato de fecha inválido: {date_str!r}")

    day = int(match.group(1))
    month = int(match.group(2))
    year = int(match.group(3))

    if not (1 <= day <= 31 and 1 <= month <= 12 and MIN_DATE_YEAR <= year <= MAX_DATE_YEAR):
        raise ValueError(f"Fecha fuera de rango permitido (1990-2035): {date_str!r}")

    try:
        datetime.date(year, month, day)
    except ValueError as exc:
        raise ValueError(f"Fecha inexistente en calendario: {date_str!r}") from exc

    return f"{day} de {SPANISH_MONTHS[month - 1]} de {year}"


def replace_visible_dates(text: str) -> str:
    """Reemplaza fechas válidas en texto visible preservando URLs, etiquetas HTML y códigos."""
    if not text:
        return text

    def _replace_match(match: re.Match[str]) -> str:
        if match.group("protected") is not None:
            return match.group(0)
        candidate = f"{match.group('day')}-{match.group('month')}-{match.group('year')}"
        try:
            return format_spanish_date(candidate)
        except ValueError:
            return match.group(0)

    return _PROTECTED_OR_DATE_RE.sub(_replace_match, text)


def _unslug_if_needed(text: str) -> str:
    """Convierte títulos unidos por guiones tipo slug en palabras separadas por espacio."""
    if text.count("-") < 3 or len(text.split()) > 2:
        return text

    protected: list[str] = []

    def _hold(match: re.Match[str]) -> str:
        idx = len(protected)
        protected.append(match.group(0))
        return f"\x00P{idx}\x00"

    masked = _SLUG_PROTECTED_RE.sub(_hold, text)
    unslugged = re.sub(r"\s+", " ", masked.replace("-", " ")).strip()
    for idx, original in enumerate(protected):
        unslugged = unslugged.replace(f"\x00P{idx}\x00", original)
    return unslugged


def _normalize_word(word: str, sentence_start: bool) -> str:
    """Normaliza una palabra simple o sigla respetando inicio de oración y numerales romanos."""
    if not word or word.isdigit():
        return word

    word_low = word.lower()
    if word_low in _ABBREV_CANONICAL:
        canon = _ABBREV_CANONICAL[word_low]
        if sentence_start and canon[0].islower():
            return canon[0].upper() + canon[1:]
        return canon

    fixed = _TYPO_MAP.get(word_low, word)
    fixed_low = fixed.lower()
    fixed_up = fixed.upper()

    if fixed_up in _ALWAYS_UPPER_ACRONYMS:
        return fixed_up
    if fixed_up in _CONTEXTUAL_UPPER_ACRONYMS and word.isupper():
        return fixed_up
    if (
        word.isupper()
        and _ROMAN_NUMERAL_RE.match(fixed_up)
        and (len(fixed_up) >= 2 or fixed_up in {"I", "V", "X"})
    ):
        return fixed_up

    if sentence_start:
        return fixed_low[0].upper() + fixed_low[1:]
    return fixed_low


def normalize_legislacion_title(title: str) -> str:
    """Normaliza títulos normativos en MAYÚSCULAS o slug a Sentence Case preservando códigos y siglas."""
    if not title:
        return ""

    text = unicodedata.normalize("NFC", title)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return ""

    # Separa año pegado a palabra (p. ej. "aduanero2002" -> "aduanero 2002").
    text = re.sub(r"([A-Za-zÁÉÍÓÚÑáéíóúñ])((?:19|20)\d{2})\b", r"\1 \2", text)
    # Inserta espacio tras punto pegado al final de un número/año (p. ej. "2011.Declaración").
    text = re.sub(r"(?<=\d)\.(?=[A-Za-zÁÉÍÓÚÑáéíóúñ])", ". ", text)
    # Limpia signos anómalos de cierre y puntos repetidos.
    text = re.sub(r"(?:\.{2,}|,\.|,)\s*$", "", text)
    text = re.sub(r",\s*\.", ".", text)
    text = re.sub(r"\.{2,}", ".", text)

    text = _unslug_if_needed(text)

    out_tokens: list[str] = []
    at_sentence_start = True

    for raw_tok in text.split(" "):
        if raw_tok in {"-", "–", "—", "/"}:
            out_tokens.append(raw_tok)
            if raw_tok in {"-", "–", "—"}:
                at_sentence_start = True
            continue

        match = re.match(r'^([(\["“«-]*)(.*?)([)\]"”».,;:!?-]*)$', raw_tok)
        if not match:
            out_tokens.append(raw_tok)
            continue

        lead, core, trail = match.groups()
        if not core:
            out_tokens.append(raw_tok)
            continue

        if _CODE_TOKEN_RE.match(core):
            core_up = core.upper()
            if core_up in {"COMIECO-EX", "OEA-GT", "R-SAT"}:
                res_core = core_up
            elif re.match(r"^v\d+$", core, re.IGNORECASE):
                res_core = core.lower()
            else:
                res_core = core
            out_tokens.append(f"{lead}{res_core}{trail}")
            if "." in trail:
                at_sentence_start = True
            continue

        core_with_dot = f"{core}." if trail.startswith(".") else core
        if core_with_dot.lower() in _ABBREV_CANONICAL:
            canon = _ABBREV_CANONICAL[core_with_dot.lower()]
            if at_sentence_start and canon[0].islower():
                canon = canon[0].upper() + canon[1:]
            trail_rest = trail[1:] if trail.startswith(".") else trail
            out_tokens.append(f"{lead}{canon}{trail_rest}")
            at_sentence_start = False
            continue

        if "-" in core:
            parts = core.split("-")
            res_core = "-".join(
                _normalize_word(part, at_sentence_start and idx == 0)
                for idx, part in enumerate(parts)
            )
            starts_only_code = False
        else:
            res_core = _normalize_word(core, at_sentence_start)
            core_up = core.upper()
            starts_only_code = core_up in _ALWAYS_UPPER_ACRONYMS or (
                core.isupper() and bool(_ROMAN_NUMERAL_RE.match(core_up))
            )

        out_tokens.append(f"{lead}{res_core}{trail}")

        if "." in trail and f"{core}.".lower() not in _NON_SENTENCE_END_ABBREVS:
            at_sentence_start = True
        elif not starts_only_code:
            at_sentence_start = False

    result = " ".join(out_tokens)

    for phrase, pattern in _PROPER_PHRASE_PATTERNS:
        result = pattern.sub(phrase, result)

    return result


if __name__ == "__main__":
    # 1. Validación de format_spanish_date
    assert format_spanish_date("06-12-2017") == "6 de diciembre de 2017"
    assert format_spanish_date("24/7/2023") == "24 de julio de 2023"
    assert format_spanish_date("01-01-1990") == "1 de enero de 1990"
    assert format_spanish_date("31/12/2035") == "31 de diciembre de 2035"
    assert format_spanish_date("29-02-2024") == "29 de febrero de 2024"

    for invalid_date in (
        "00-05-2023",
        "32-01-2023",
        "15-13-2023",
        "15-05-1989",
        "15-05-2036",
        "31-02-2023",
        "29-02-2023",
        "2017-12-06",
        "04-01-4527",
        "",
    ):
        try:
            format_spanish_date(invalid_date)
        except ValueError:
            pass
        else:
            raise AssertionError(f"Debió lanzar ValueError para {invalid_date!r}")

    # 2. Validación de replace_visible_dates
    sample_html = (
        '[vc_btn title="Vigencia 06-12-2017" '
        'link="url:https%3A%2F%2Fportal.sat.gob.gt%2F06-12-2017%2Fdoc.pdf||target:%20_blank|"]'
        '<a href="https://portal.sat.gob.gt/portal/06-12-2017/archivo.pdf" data-fecha="24/7/2023">'
        "Publicado el 06-12-2017 y actualizado el 24/7/2023"
        "</a> "
        "Ver https://portal.sat.gob.gt/doc/06-12-2017/guia.pdf y "
        "Resolución Superintendencia 2010-04-01-4527, SAT-DSI-812-2016, SAT-IAD-005-2021."
    )
    replaced = replace_visible_dates(sample_html)
    assert 'title="Vigencia 6 de diciembre de 2017"' in replaced
    assert 'href="https://portal.sat.gob.gt/portal/06-12-2017/archivo.pdf"' in replaced
    assert 'data-fecha="24/7/2023"' in replaced
    assert "url:https%3A%2F%2Fportal.sat.gob.gt%2F06-12-2017%2Fdoc.pdf" in replaced
    assert "Publicado el 6 de diciembre de 2017 y actualizado el 24 de julio de 2023" in replaced
    assert "https://portal.sat.gob.gt/doc/06-12-2017/guia.pdf" in replaced
    assert "2010-04-01-4527" in replaced
    assert "SAT-DSI-812-2016" in replaced
    assert "SAT-IAD-005-2021" in replaced
    assert replace_visible_dates("Atención 24/7 y Vig.2-8-2019") == "Atención 24/7 y Vig.2 de agosto de 2019"
    assert replace_visible_dates('href="/files/06-12-2017.pdf" del 06-12-2017') == (
        'href="/files/06-12-2017.pdf" del 6 de diciembre de 2017'
    )

    # 3. Validación de normalize_legislacion_title
    title_cases: list[tuple[str, str]] = [
        (
            "DECRETO DEL CONGRESO 14-2013 LEY DE ADUANAS",
            "Decreto del Congreso 14-2013 Ley de Aduanas",
        ),
        (
            "DECRETO 58-90 LEY CONTRA LA DEFRAUDACION Y EL CONTRABANDO ADUANEROS",
            "Decreto 58-90 Ley contra la Defraudación y el Contrabando Aduaneros",
        ),
        (
            "SISTEMA ARANCELARIO CENTROAMERICANO SAC 2026",
            "Sistema Arancelario Centroamericano SAC 2026",
        ),
        (
            "TABLA DE VALORES IVA IPRIMA 2026",
            "Tabla de valores IVA IPRIMA 2026",
        ),
        (
            "ACUERDO DE DIRECTORIO NÚMERO 3-2024 REFORMA ACDO. DIREC. 11-2001",
            "Acuerdo de Directorio número 3-2024 reforma Acdo. Direc. 11-2001",
        ),
        (
            "ACUERDO DE DIRECTORIO 10-2021",
            "Acuerdo de Directorio 10-2021",
        ),
        (
            "ACUERDO DE DIRECTORIO 9-2021",
            "Acuerdo de Directorio 9-2021",
        ),
        (
            "R-SAT DSI-1008-2023 DISPOSIONES ADMON. REGULAR TRASLADO ATU II-PUERTO FRONTERIZO "
            "ING. JUAN LUIS LIZARRALDE ARRIVILLA HACIA CENTRALES TRANFERENCIA CARGA Y VICEVERSA",
            "R-SAT DSI-1008-2023 Disposiciones admon. regular traslado ATU II-Puerto Fronterizo "
            "Ing. Juan Luis Lizarralde Arrivilla hacia centrales transferencia carga y viceversa",
        ),
        (
            "TABLA-IVA-IMPORTACIÓN-E-IPRIMA-2019",
            "Tabla IVA importación e IPRIMA 2019",
        ),
        (
            "ACUERDO-No.-35-2018-Tabla-de-Valores-Imponibles-Específico-a-la-Primera-Matrícula-"
            "de-Vehículos-Automotores-Terrestres-Usados",
            "Acuerdo No. 35-2018 tabla de valores imponibles específico a la primera matrícula "
            "de vehículos automotores terrestres usados",
        ),
        (
            "ACUERDO-No.-34-2018-Tabla-de-Valores-Imponibles-del-Impuesto-al-Valor-Agregado-"
            "para-la-Importación",
            "Acuerdo No. 34-2018 tabla de valores imponibles del impuesto al valor agregado "
            "para la importación",
        ),
        (
            "SAT-DSI-812-2016 Rutas Fiscales por el arribo y concluir en la aduana de destino "
            "las operaciones de tánsito",
            "SAT-DSI-812-2016 Rutas fiscales por el arribo y concluir en la aduana de destino "
            "las operaciones de tránsito",
        ),
        (
            "Resolucion de Intedencia de Aduanas Número SAT-IAD-012-2023",
            "Resolución de Intendencia de Aduanas número SAT-IAD-012-2023",
        ),
        (
            "Acuerdo Superintendencia SAT-S-1080-2004. Trasmisión Electrónica el Manifiesto de "
            "Carga Aérea de Empresas Desconsolidadoras Autorizadas",
            "Acuerdo Superintendencia SAT-S-1080-2004. Transmisión electrónica el manifiesto de "
            "carga aérea de empresas desconsolidadoras autorizadas",
        ),
        (
            "Resolución Superintendencia SAT-S-201-2011.Declaración de mercancías de oficio",
            "Resolución Superintendencia SAT-S-201-2011. Declaración de mercancías de oficio",
        ),
        (
            "Resolución SAT-IAD-005-2021 Duda Razonable..",
            "Resolución SAT-IAD-005-2021 duda razonable",
        ),
        (
            "Resolución Superintendencia SAT-IAD-00r-2014. Vía electrónica declaración de mercancías",
            "Resolución Superintendencia SAT-IAD-00r-2014. Vía electrónica declaración de mercancías",
        ),
        (
            "Resolución Superintendencia Res-SAT-DSI-362-2016. Habilitar los Anexos de la "
            "Aduana de Vehículos y de la Aduana Central",
            "Resolución Superintendencia Res-SAT-DSI-362-2016. Habilitar los anexos de la "
            "Aduana de Vehículos y de la Aduana Central",
        ),
        (
            "Resolución de Directorio DIR-SAT-26-2002. Formularios electrónicos para pagos aduaneros",
            "Resolución de Directorio DIR-SAT-26-2002. Formularios electrónicos para pagos aduaneros",
        ),
        (
            "RECAUCA IV, Resolución 224-2008 COMIECO XLIX",
            "RECAUCA IV, Resolución 224-2008 COMIECO XLIX",
        ),
        (
            "Acuerdo Directorio 10-2006. Procedimientos aduaneros y facilitación de comercio en el "
            "marco del Tratado de Libre Comercio República Dominicana-Centroamérica-Estados Unidos",
            "Acuerdo Directorio 10-2006. Procedimientos aduaneros y facilitación de comercio en el "
            "marco del Tratado de Libre Comercio República Dominicana-Centroamérica-Estados Unidos",
        ),
        (
            "Resolución Superintendencia SAT-S-627-2009. Aduana El Ceibo",
            "Resolución Superintendencia SAT-S-627-2009. Aduana El Ceibo",
        ),
        (
            "Resolución del Superintendente Número SAT-DSI-1208-2019. Se autoriza a la entidad "
            "Empresa Portuaria Nacional Santo Tomás de Castilla -Emporac-",
            "Resolución del Superintendente número SAT-DSI-1208-2019. Se autoriza a la entidad "
            "Empresa Portuaria Nacional Santo Tomás de Castilla -Emporac-",
        ),
    ]

    for raw_title, expected_title in title_cases:
        actual = normalize_legislacion_title(raw_title)
        assert actual == expected_title, f"\nEsperado: {expected_title!r}\nObtenido: {actual!r}"

    # Prueba adicional sobre numerales romanos LXXXV / III y NFD Unicode
    assert normalize_legislacion_title("RESOLUCION COMIECO LXXXV NUMERAL III") == (
        "Resolución COMIECO LXXXV numeral III"
    )
    assert normalize_legislacion_title("Especi\u0301fico Matri\u0301cula") == "Específico matrícula"

    print(
        f"[OK] maquila_text_utils.py: todas las aserciones superadas "
        f"(fechas=15 casos, reemplazo_visible=4 bloques, titulos={len(title_cases) + 2} casos)."
    )
