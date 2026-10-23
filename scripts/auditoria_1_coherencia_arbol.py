#!/usr/bin/env python3
"""
Auditoría 1 – Coherencia Árbol ↔ Dataset
=========================================
Compara arbol_navegacion.json (estructura de navegación) contra
allTramites.json (catálogo de gestiones) y detecta:
  a. Rutas huérfanas: gestiones cuya ruta N1–N4 no existe en el árbol
  b. Nodos fantasma: nodos hoja del árbol sin ninguna gestión asignada
  c. Divergencias de nombre: nodos del árbol cuyo 'nombre' difiere del
     valor correspondiente en allTramites.json para la misma ruta
  d. Estadísticas de cobertura

Salida: .agents/tasks/auditoria-1-coherencia-arbol-dataset.md
"""

import json
import os
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Rutas
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
ARBOL_PATH = BASE_DIR / "database" / "arbol_navegacion.json"
GESTIONES_PATH = BASE_DIR / "src" / "data" / "allTramites.json"
REPORT_PATH = BASE_DIR / ".agents" / "tasks" / "auditoria-1-coherencia-arbol-dataset.md"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
EM_DASH = "—"

def es_vacio(val: str | None) -> bool:
    """Retorna True si el valor es vacío, None, guion largo o guion corto."""
    return val is None or val.strip() in ("", EM_DASH, "–", "-")


def normalizar(val: str | None) -> str:
    """Normaliza un valor de nivel: strip + lowercase para comparación robusta."""
    if es_vacio(val):
        return ""
    return val.strip().lower()


def ruta_efectiva_gestion(g: dict) -> tuple[str, ...]:
    """
    Construye la ruta efectiva de una gestión usando los niveles no vacíos.
    Retorna una tupla con los nombres de nivel (case-preservado) hasta el
    último nivel que no sea vacío/guion.
    Ejemplo N1+N2+N3+N4 (N5=—) → ("Contribuyentes", "…", "…", "N4val")
    """
    partes = []
    for campo in ("nivel1", "nivel2", "nivel3", "nivel4"):
        val = g.get(campo, "")
        if es_vacio(val):
            break
        partes.append(val.strip())
    return tuple(partes)


def ruta_efectiva_gestion_completa(g: dict) -> tuple[str, ...]:
    """
    Igual que ruta_efectiva_gestion pero incluye nivel5 si existe y no es vacío.
    Usado para las estadísticas detalladas.
    """
    partes = list(ruta_efectiva_gestion(g))
    n5 = g.get("nivel5", "")
    if not es_vacio(n5):
        partes.append(n5.strip())
    return tuple(partes)


def materialized_to_nombres(arbol: list[dict]) -> dict[str, str]:
    """
    Construye un mapa {materialized_path: nombre} para acceso rápido.
    """
    return {n["materialized_path"]: n["nombre"] for n in arbol}


def slug_from_nombre(nombre: str) -> str:
    """
    Genera un slug aproximado a partir del nombre para comparar rutas
    con materialized_path. No es 100% exacto; se usa solo como heurística
    de diagnóstico en divergencias.
    """
    import unicodedata
    import re
    nfkd = unicodedata.normalize("NFKD", nombre)
    sin_tilde = "".join(c for c in nfkd if not unicodedata.combining(c))
    slug = sin_tilde.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug


# ---------------------------------------------------------------------------
# Carga de datos
# ---------------------------------------------------------------------------
def cargar_datos() -> tuple[list[dict], list[dict]]:
    with open(ARBOL_PATH, encoding="utf-8") as f:
        arbol = json.load(f)
    with open(GESTIONES_PATH, encoding="utf-8") as f:
        gestiones = json.load(f)
    return arbol, gestiones


# ---------------------------------------------------------------------------
# Análisis principal
# ---------------------------------------------------------------------------
def analizar(arbol: list[dict], gestiones: list[dict]) -> dict:
    """
    Retorna un dict con todos los hallazgos y estadísticas.
    """

    # ------------------------------------------------------------------
    # 1. Construir índice del árbol
    # ------------------------------------------------------------------
    # Mapa materialized_path → nodo completo
    nodos_por_path = {n["materialized_path"]: n for n in arbol}

    # Mapa (nombre_n1, nombre_n2, ...) → materialized_path  (por nivel)
    # Para N1: ("Contribuyentes",) → "contribuyentes"
    # Para N4: ("Contribuyentes", "Pq", "R3", "N4") → "contribuyentes/pq/r3/n4"
    #
    # Construimos esto usando la ruta de IDs del nodo y reconstruyendo los nombres
    id_to_nombre = {n["_id"]: n["nombre"] for n in arbol}
    id_to_nodo   = {n["_id"]: n for n in arbol}

    def nombres_ancestros(nodo: dict) -> list[str]:
        """Devuelve lista de nombres desde N1 hasta el nodo (inclusive)."""
        cadena = []
        for aid in nodo.get("ruta", []):
            if aid in id_to_nombre:
                cadena.append(id_to_nombre[aid])
        cadena.append(nodo["nombre"])
        return cadena

    # Mapa (nombre_n1, ..., nombre_nX) → nodo  — normalizado para comparar
    arbol_por_nombres_norm: dict[tuple, dict] = {}
    arbol_por_nombres_orig: dict[tuple, dict] = {}  # con case original

    for nodo in arbol:
        nombres = nombres_ancestros(nodo)
        key_norm = tuple(normalizar(n) for n in nombres)
        key_orig = tuple(n.strip() for n in nombres)
        arbol_por_nombres_norm[key_norm] = nodo
        arbol_por_nombres_orig[key_orig] = nodo

    # ------------------------------------------------------------------
    # 2. Construir índice de gestiones
    # ------------------------------------------------------------------
    # Mapa ruta_efectiva_norm → lista de gestiones
    gestiones_por_ruta: dict[tuple, list[dict]] = defaultdict(list)
    # Rutas normalizadas de todas las gestiones (hasta N4)
    for g in gestiones:
        ruta = ruta_efectiva_gestion(g)
        ruta_norm = tuple(normalizar(v) for v in ruta)
        gestiones_por_ruta[ruta_norm].append(g)

    # ------------------------------------------------------------------
    # 3a. Rutas huérfanas
    # (rutas en allTramites.json que NO tienen nodo en el árbol)
    # ------------------------------------------------------------------
    rutas_huerfanas: list[dict] = []

    for g in gestiones:
        ruta = ruta_efectiva_gestion(g)
        if not ruta:
            continue  # gestión sin clasificación, ignorar en este check
        ruta_norm = tuple(normalizar(v) for v in ruta)
        if ruta_norm not in arbol_por_nombres_norm:
            rutas_huerfanas.append(g)

    # ------------------------------------------------------------------
    # 3b. Nodos fantasma
    # (nodos hoja del árbol sin ninguna gestión asignada)
    # Definimos "hoja" como cualquier nodo de máximo nivel en su rama,
    # es decir, nodos cuyo _id no aparece como padre_id de ningún otro nodo.
    # ------------------------------------------------------------------
    ids_con_hijos = set()
    for nodo in arbol:
        pid = nodo.get("padre_id")
        if pid:
            ids_con_hijos.add(pid)

    hojas = [n for n in arbol if n["_id"] not in ids_con_hijos]

    nodos_fantasma: list[dict] = []
    for hoja in hojas:
        nombres = nombres_ancestros(hoja)
        ruta_norm = tuple(normalizar(n) for n in nombres)
        # Verificar si alguna gestión aterriza exactamente aquí
        # (la ruta efectiva de la gestión == ruta del nodo hoja)
        tiene_gestiones = ruta_norm in gestiones_por_ruta and len(gestiones_por_ruta[ruta_norm]) > 0
        if not tiene_gestiones:
            nodos_fantasma.append({"nodo": hoja, "nombres": nombres})

    # ------------------------------------------------------------------
    # 3c. Divergencias de nombre
    # (nodos del árbol cuyo nombre difiere del valor en allTramites.json
    #  para la misma ruta de clasificación)
    # ------------------------------------------------------------------
    divergencias: list[dict] = []

    # Para cada nodo del árbol, buscamos gestiones cuya ruta pase por él
    # y comparamos si el nombre del nivel correspondiente coincide.
    for nodo in arbol:
        nivel_idx = nodo["nivel"]  # 1-indexed
        nombres_full = nombres_ancestros(nodo)
        # Construir ruta_norm hasta este nodo
        ruta_norm_hasta = tuple(normalizar(n) for n in nombres_full)

        # Buscar gestiones que tengan esta ruta como prefijo o exactamente
        for ruta_g_norm, gests_en_ruta in gestiones_por_ruta.items():
            # La ruta de la gestión hasta nivel_idx debe coincidir con ruta_norm_hasta
            if len(ruta_g_norm) >= nivel_idx:
                prefijo_g = ruta_g_norm[:nivel_idx]
                if prefijo_g == ruta_norm_hasta:
                    # Comparar el nombre del nivel en la gestión con el nombre del nodo
                    campo = f"nivel{nivel_idx}"
                    valor_g = gests_en_ruta[0].get(campo, "").strip()
                    nombre_arbol = nodo["nombre"].strip()
                    if normalizar(valor_g) != normalizar(nombre_arbol):
                        divergencias.append({
                            "nodo_id": nodo["_id"],
                            "nivel": nivel_idx,
                            "nombre_arbol": nombre_arbol,
                            "nombre_dataset": valor_g,
                            "ruta_arbol": "/".join(nombres_full),
                            "ejemplo_ges": gests_en_ruta[0].get("codigo", "—"),
                        })
                        break  # un ejemplo por nodo es suficiente

    # ------------------------------------------------------------------
    # 3d. Estadísticas de cobertura
    # ------------------------------------------------------------------
    total_nodos = len(arbol)
    total_hojas = len(hojas)
    hojas_con_gestiones = total_hojas - len(nodos_fantasma)
    hojas_sin_gestiones = len(nodos_fantasma)

    total_gestiones = len(gestiones)
    gestiones_con_ruta_valida = total_gestiones - len(rutas_huerfanas)
    gestiones_huerfanas = len(rutas_huerfanas)

    # Gestiones por nodo hoja (distribución)
    conteo_por_hoja: dict[str, int] = {}
    for hoja in hojas:
        nombres = nombres_ancestros(hoja)
        ruta_norm = tuple(normalizar(n) for n in nombres)
        conteo_por_hoja[hoja["materialized_path"]] = len(gestiones_por_ruta.get(ruta_norm, []))

    # Rutas únicas en el dataset
    rutas_unicas_dataset = len(gestiones_por_ruta)

    return {
        "rutas_huerfanas": rutas_huerfanas,
        "nodos_fantasma": nodos_fantasma,
        "divergencias": divergencias,
        "stats": {
            "total_nodos_arbol": total_nodos,
            "total_hojas_arbol": total_hojas,
            "hojas_con_gestiones": hojas_con_gestiones,
            "hojas_sin_gestiones": hojas_sin_gestiones,
            "total_gestiones": total_gestiones,
            "gestiones_con_ruta_valida": gestiones_con_ruta_valida,
            "gestiones_huerfanas": gestiones_huerfanas,
            "rutas_unicas_dataset": rutas_unicas_dataset,
        },
        "conteo_por_hoja": conteo_por_hoja,
    }


# ---------------------------------------------------------------------------
# Generación del reporte Markdown
# ---------------------------------------------------------------------------
def generar_reporte(resultados: dict) -> str:
    h = resultados["rutas_huerfanas"]
    f = resultados["nodos_fantasma"]
    d = resultados["divergencias"]
    s = resultados["stats"]
    fecha = datetime.now().strftime("%Y-%m-%d %H:%M")

    lineas = []

    lineas.append(f"# Auditoría 1 — Coherencia Árbol ↔ Dataset")
    lineas.append(f"")
    lineas.append(f"**Fecha de ejecución:** {fecha}")
    lineas.append(f"**Fuentes:**")
    lineas.append(f"- `database/arbol_navegacion.json` — {s['total_nodos_arbol']} nodos")
    lineas.append(f"- `src/data/allTramites.json` — {s['total_gestiones']} gestiones")
    lineas.append(f"")

    # ---- Resumen ejecutivo ----
    lineas.append(f"## Resumen Ejecutivo")
    lineas.append(f"")
    lineas.append(f"| Métrica | Valor |")
    lineas.append(f"|---|---|")
    lineas.append(f"| Total nodos en árbol | {s['total_nodos_arbol']} |")
    lineas.append(f"| Nodos hoja (sin hijos) | {s['total_hojas_arbol']} |")
    lineas.append(f"| Hojas con ≥1 gestión asignada | {s['hojas_con_gestiones']} |")
    lineas.append(f"| **Hojas sin ninguna gestión (fantasma)** | **{s['hojas_sin_gestiones']}** |")
    lineas.append(f"| Total gestiones en dataset | {s['total_gestiones']} |")
    lineas.append(f"| Gestiones con ruta válida en árbol | {s['gestiones_con_ruta_valida']} |")
    lineas.append(f"| **Gestiones con ruta huérfana** | **{s['gestiones_huerfanas']}** |")
    lineas.append(f"| Rutas únicas en dataset | {s['rutas_unicas_dataset']} |")
    lineas.append(f"| Divergencias de nombre detectadas | {len(d)} |")
    lineas.append(f"")

    cobertura_hojas = (s['hojas_con_gestiones'] / s['total_hojas_arbol'] * 100) if s['total_hojas_arbol'] else 0
    cobertura_gests = (s['gestiones_con_ruta_valida'] / s['total_gestiones'] * 100) if s['total_gestiones'] else 0
    lineas.append(f"**Cobertura de hojas con gestiones:** {cobertura_hojas:.1f}%")
    lineas.append(f"**Gestiones con ruta válida:** {cobertura_gests:.1f}%")
    lineas.append(f"")

    # ---- Rutas huérfanas ----
    lineas.append(f"---")
    lineas.append(f"")
    lineas.append(f"## A. Rutas Huérfanas ({len(h)} gestiones)")
    lineas.append(f"")
    lineas.append(f"Gestiones cuya combinación N1–N4 no tiene nodo correspondiente en `arbol_navegacion.json`.")
    lineas.append(f"")

    if h:
        lineas.append(f"| SAT-GES-#### | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 | Nivel 5 | Ruta Efectiva |")
        lineas.append(f"|---|---|---|---|---|---|---|")
        for g in sorted(h, key=lambda x: x.get("codigo", "")):
            codigo = g.get("codigo", "—")
            n1 = g.get("nivel1", "—") or "—"
            n2 = g.get("nivel2", "—") or "—"
            n3 = g.get("nivel3", "—") or "—"
            n4 = g.get("nivel4", "—") or "—"
            n5 = g.get("nivel5", "—") or "—"
            ruta = " > ".join(v for v in [n1,n2,n3,n4] if not es_vacio(v))
            lineas.append(f"| {codigo} | {n1} | {n2} | {n3} | {n4} | {n5} | {ruta} |")
    else:
        lineas.append(f"✅ No se encontraron rutas huérfanas.")
    lineas.append(f"")

    # ---- Nodos fantasma ----
    lineas.append(f"---")
    lineas.append(f"")
    lineas.append(f"## B. Nodos Fantasma ({len(f)} hojas sin gestiones)")
    lineas.append(f"")
    lineas.append(f"Nodos hoja del árbol de navegación que no tienen ninguna gestión asignada en el dataset.")
    lineas.append(f"")

    if f:
        lineas.append(f"| ID Nodo | Ruta Completa | Nivel |")
        lineas.append(f"|---|---|---|")
        for item in sorted(f, key=lambda x: x["nodo"]["materialized_path"]):
            nodo = item["nodo"]
            ruta_str = " > ".join(item["nombres"])
            lineas.append(f"| `{nodo['_id']}` | {ruta_str} | N{nodo['nivel']} |")
    else:
        lineas.append(f"✅ No se encontraron nodos fantasma.")
    lineas.append(f"")

    # ---- Divergencias de nombre ----
    lineas.append(f"---")
    lineas.append(f"")
    lineas.append(f"## C. Divergencias de Nombre ({len(d)})")
    lineas.append(f"")
    lineas.append(f"Nodos del árbol cuyo nombre difiere del valor en `allTramites.json` para la misma ruta.")
    lineas.append(f"")

    if d:
        lineas.append(f"| ID Nodo | Nivel | Nombre en Árbol | Nombre en Dataset | Ruta | Ejemplo Gestión |")
        lineas.append(f"|---|---|---|---|---|---|")
        for item in sorted(d, key=lambda x: x["ruta_arbol"]):
            lineas.append(
                f"| `{item['nodo_id']}` | N{item['nivel']} "
                f"| {item['nombre_arbol']} | {item['nombre_dataset']} "
                f"| {item['ruta_arbol']} | {item['ejemplo_ges']} |"
            )
    else:
        lineas.append(f"✅ No se encontraron divergencias de nombre.")
    lineas.append(f"")

    # ---- Estadísticas de cobertura adicionales ----
    lineas.append(f"---")
    lineas.append(f"")
    lineas.append(f"## D. Estadísticas de Cobertura Detallada")
    lineas.append(f"")

    # Distribución de gestiones por hoja
    conteo = resultados["conteo_por_hoja"]
    dist: dict[str, int] = {}
    for v in conteo.values():
        bucket = str(v)
        dist[bucket] = dist.get(bucket, 0) + 1

    lineas.append(f"### Distribución de gestiones por nodo hoja")
    lineas.append(f"")
    lineas.append(f"| Gestiones por hoja | # Hojas |")
    lineas.append(f"|---|---|")
    for k in sorted(dist.keys(), key=int):
        lineas.append(f"| {k} | {dist[k]} |")
    lineas.append(f"")

    # Top 10 hojas con más gestiones
    top_hojas = sorted(conteo.items(), key=lambda x: -x[1])[:10]
    lineas.append(f"### Top 10 hojas con más gestiones")
    lineas.append(f"")
    lineas.append(f"| Nodo Hoja (materialized_path) | # Gestiones |")
    lineas.append(f"|---|---|")
    for path, cnt in top_hojas:
        lineas.append(f"| `{path}` | {cnt} |")
    lineas.append(f"")

    lineas.append(f"---")
    lineas.append(f"")
    lineas.append(f"*Reporte generado automáticamente por `scripts/auditoria_1_coherencia_arbol.py`*")
    lineas.append(f"")

    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
def main():
    print("=== Auditoría 1 — Coherencia Árbol ↔ Dataset ===")
    print(f"Cargando datos desde {BASE_DIR}...")

    arbol, gestiones = cargar_datos()
    print(f"  Árbol: {len(arbol)} nodos | Dataset: {len(gestiones)} gestiones")

    print("Analizando...")
    resultados = analizar(arbol, gestiones)
    s = resultados["stats"]

    print(f"\n--- Resumen ---")
    print(f"  Rutas huérfanas:       {s['gestiones_huerfanas']:>4}  gestiones")
    print(f"  Nodos fantasma:        {s['hojas_sin_gestiones']:>4}  hojas sin gestiones")
    print(f"  Divergencias nombre:   {len(resultados['divergencias']):>4}")
    print(f"  Cobertura hojas:       {s['hojas_con_gestiones']}/{s['total_hojas_arbol']} ({s['hojas_con_gestiones']/s['total_hojas_arbol']*100:.1f}%)")
    print(f"  Ruta válida gestiones: {s['gestiones_con_ruta_valida']}/{s['total_gestiones']} ({s['gestiones_con_ruta_valida']/s['total_gestiones']*100:.1f}%)")

    reporte = generar_reporte(resultados)

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        f.write(reporte)

    print(f"\nReporte guardado en: {REPORT_PATH.relative_to(BASE_DIR)}")
    print("=== Auditoría completada ===")


if __name__ == "__main__":
    main()
