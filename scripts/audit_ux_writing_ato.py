#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auditoría Automatizada de UX Writing y Content Design (Estándar ATO-SAT)
Evalúa el dataset src/data/allTramites.json bajo las pautas del Australian Taxation Office (ATO),
Australian Government Style Manual y las Reglas de Gobernanza SAT (Reglas 10 y 12).
"""

import json
import re
import sys
from pathlib import Path

# Configuración de umbrales cuantitativos ATO / SAT
MAX_WORDS_TITLE = 10
MAX_SENTENCES_DESC = 2
MAX_WORDS_PER_SENTENCE_DESC = 28

# Acrónimos comunes en SAT que deben estar expandidos en primera mención
KNOWN_ACRONYMS = {
    'NIT': 'Número de Identificación Tributaria',
    'RTU': 'Registro Tributario Unificado',
    'FEL': 'Factura Electrónica',
    'ISCV': 'Impuesto de Circulación de Vehículos',
    'IVA': 'Impuesto al Valor Agregado',
    'ISR': 'Impuesto Sobre la Renta',
    'DUCA': 'Declaración Única Centroamericana',
    'OEA': 'Operador Económico Autorizado',
    'SOFI': 'Solvencia Fiscal',
}

# Prefijos burocráticos no recomendados (no front-loaded)
FILLER_PREFIXES = [
    r'^requisitos\s+para\s+',
    r'^informaci[oó]n\s+sobre\s+',
    r'^procedimiento\s+para\s+',
    r'^instructivo\s+de\s+',
    r'^gu[ií]a\s+para\s+el\s+',
    r'^tr[aá]mite\s+de\s+',
    r'^solicitud\s+de\s+requisitos\s+',
]

def analyze_gestiones(json_path: Path):
    if not json_path.exists():
        print(f"Error: No existe el archivo {json_path}")
        sys.exit(1)

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total = len(data)
    tramite_violations = []
    long_titles = []
    filler_titles = []
    long_descriptions = []
    desc_sentences_gt_2 = []
    orphan_acronym_instances = []

    for item in data:
        gid = item.get('id', '')
        title = item.get('nombreActual', '').strip()
        desc = item.get('descripcion', '').strip()
        full_text = f"{title} {desc}"

        # 1. Regla 12: Cero "trámite"
        if re.search(r'\btr[aá]mites?\b', full_text, re.IGNORECASE):
            tramite_violations.append((gid, title))

        # 2. Longitud del Título (Máx 10 palabras)
        words_title = title.split()
        if len(words_title) > MAX_WORDS_TITLE:
            long_titles.append((gid, title, len(words_title)))

        # 3. Front-loading (Prefijos de relleno)
        for pat in FILLER_PREFIXES:
            if re.search(pat, title, re.IGNORECASE):
                filler_titles.append((gid, title))
                break

        # 4. Longitud de Descripciones y Conteo de Oraciones
        if desc:
            # Dividir en oraciones por punto, exclamación o interrogación
            sentences = [s.strip() for s in re.split(r'[.!?]+', desc) if s.strip()]
            if len(sentences) > MAX_SENTENCES_DESC:
                desc_sentences_gt_2.append((gid, len(sentences), desc))

            for s in sentences:
                s_words = len(s.split())
                if s_words > MAX_WORDS_PER_SENTENCE_DESC:
                    long_descriptions.append((gid, s_words, s))
                    break

        # 5. Acrónimos huérfanos en Título y Descripción combinados
        for acr, expansion in KNOWN_ACRONYMS.items():
            # Si la sigla aparece como palabra independiente
            if re.search(rf'\b{acr}\b', full_text):
                # Verificar si la expansión o parte clave de ella está presente
                key_part = expansion.split()[0]  # e.g., 'Número', 'Registro', 'Factura', etc.
                if not re.search(rf'{key_part}', full_text, re.IGNORECASE):
                    orphan_acronym_instances.append((gid, acr, title))

    # Cálculo del Scorecard ATO (0 a 100%)
    score_tramite = 100 if len(tramite_violations) == 0 else max(0, 100 - len(tramite_violations) * 10)
    score_title_len = max(0, 100 - (len(long_titles) / total) * 100)
    score_front_load = max(0, 100 - (len(filler_titles) / total) * 100)
    score_desc_len = max(0, 100 - (len(desc_sentences_gt_2) / total) * 100)
    score_acronyms = max(0, 100 - (len(orphan_acronym_instances) / total) * 100)

    global_score = (
        score_tramite * 0.20 +
        score_title_len * 0.20 +
        score_front_load * 0.20 +
        score_desc_len * 0.20 +
        score_acronyms * 0.20
    )

    print("=" * 80)
    print("AUDITORÍA DE UX WRITING Y CONTENT DESIGN (ATO - SAT GUATEMALA)")
    print(f"Archivo auditado: {json_path}")
    print(f"Total de gestiones analizadas: {total}")
    print("=" * 80)
    print(f"\n1. REGLA 12 (PROHIBICIÓN ESTRICTA DE 'TRÁMITE'):")
    print(f"   - Violaciones detectadas: {len(tramite_violations)}")
    if tramite_violations:
        for gid, t in tramite_violations[:5]:
            print(f"     * [{gid}] {t}")

    print(f"\n2. TÍTULOS Y FRONT-LOADING (ATO PILAR 2):")
    print(f"   - Títulos con > {MAX_WORDS_TITLE} palabras: {len(long_titles)} ({len(long_titles)/total*100:.1f}%)")
    print(f"   - Títulos con prefijos de relleno burocrático: {len(filler_titles)} ({len(filler_titles)/total*100:.1f}%)")
    if long_titles:
        print("   - Muestra de los 5 títulos más extensos a optimizar:")
        sorted_long = sorted(long_titles, key=lambda x: x[2], reverse=True)[:5]
        for gid, t, w in sorted_long:
            print(f"     * [{gid}] ({w} pal): {t}")

    print(f"\n3. DESCRIPCIONES Y CONCISIÓN (ATO PILAR 1 & 2):")
    print(f"   - Descripciones con > {MAX_SENTENCES_DESC} oraciones: {len(desc_sentences_gt_2)}")
    print(f"   - Oraciones con > {MAX_WORDS_PER_SENTENCE_DESC} palabras: {len(long_descriptions)}")

    print(f"\n4. GOBERNANZA DE ACRÓNIMOS (REGLA 10):")
    print(f"   - Instancias con acrónimos potencialmente huérfanos: {len(orphan_acronym_instances)}")
    if orphan_acronym_instances:
        print("   - Muestra de acrónimos huérfanos:")
        for gid, acr, t in orphan_acronym_instances[:5]:
            print(f"     * [{gid}] Sigla '{acr}' sin expandir en título: {t}")

    print("\n" + "=" * 80)
    print("CALIFICACIÓN GLOBAL DE SALUD LINGÜÍSTICA ATO-SAT:")
    print(f"   - Cumplimiento Regla 12 (Cero Trámites):      {score_tramite:.1f}%")
    print(f"   - Concisión de Títulos (<= 10 palabras):      {score_title_len:.1f}%")
    print(f"   - Front-loading en Títulos (Sin relleno):     {score_front_load:.1f}%")
    print(f"   - Estructura de Descripciones (<= 2 orac):    {score_desc_len:.1f}%")
    print(f"   - Acrónimos Expandidos:                       {score_acronyms:.1f}%")
    print(f"   --> ÍNDICE ATO DE ACCESIBILIDAD LINGÜÍSTICA: {global_score:.1f} / 100")
    print("=" * 80)

if __name__ == '__main__':
    catalog_path = Path('src/data/allTramites.json')
    analyze_gestiones(catalog_path)
