"""
informe_iter2.py
================
Iteración 2 — Generación del informe de re-clustering con texto completo.

Lee los entregables producidos por cluster_iter2.py y genera:
    salida/informe_v2.md

Fuentes:
  - salida/clusters_texto_completo.xlsx  (resultado de cluster_iter2.py)
  - salida/clusters.xlsx                 (resultado de Iter 1, si existe)
  - salida/scraped_content.csv           (estadísticas de scraping)

Reglas de contenido:
  - Prohibido usar el término "trámite" / "trámites" → usar "gestión" / "gestiones"
  - Los niveles jerárquicos se identifican solo como N1, N2, N3, N4, N5
  - Encoding UTF-8 en todos los archivos
"""

# ---------------------------------------------------------------------------
# 0. AUTO-INSTALACIÓN DE DEPENDENCIAS
# ---------------------------------------------------------------------------
import subprocess
import sys


def _install(pkg: str) -> None:
    subprocess.run(
        [sys.executable, "-m", "pip", "install", "--quiet", pkg],
        check=False,
    )


for _pkg in ["pandas", "openpyxl", "numpy"]:
    _install(_pkg)

# ---------------------------------------------------------------------------
# IMPORTS
# ---------------------------------------------------------------------------
import logging
import math
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# CONFIGURACIÓN
# ---------------------------------------------------------------------------
OUTPUT_DIR        = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida")
XLSX_V2           = OUTPUT_DIR / "clusters_texto_completo.xlsx"
XLSX_V1           = OUTPUT_DIR / "clusters.xlsx"
CSV_SCRAPED       = OUTPUT_DIR / "scraped_content.csv"
OUTPUT_MD         = OUTPUT_DIR / "informe_v2.md"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

K_CLUSTERS = 8  # k fijo de Iter 2


# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def fmt_pct(n: int, total: int) -> str:
    if total == 0:
        return "0%"
    return f"{n / total * 100:.1f}%"


def safe_float(val) -> float:
    try:
        return float(val)
    except (TypeError, ValueError):
        return 0.0


# ---------------------------------------------------------------------------
# PASO 1 — CARGA DE DATOS
# ---------------------------------------------------------------------------

def cargar_datos() -> dict:
    """
    Carga todos los datasets necesarios y retorna un diccionario con
    los DataFrames y valores ya calculados.
    """
    datos = {}

    # ── clusters_texto_completo.xlsx ──────────────────────────────────────
    if not XLSX_V2.exists():
        raise FileNotFoundError(
            f"No se encontró: {XLSX_V2}\n"
            "Ejecute primero: python scripts/cluster_iter2.py"
        )

    datos["df_v2"]          = pd.read_excel(XLSX_V2, sheet_name="gestiones_v2")
    datos["df_resumen_v2"]  = pd.read_excel(XLSX_V2, sheet_name="resumen_clusters_v2")
    datos["df_outliers_v2"] = pd.read_excel(XLSX_V2, sheet_name="outliers_v2")
    datos["df_sin_texto"]   = pd.read_excel(XLSX_V2, sheet_name="sin_texto")
    datos["df_metricas_v2"] = pd.read_excel(XLSX_V2, sheet_name="metricas_v2")

    log.info("clusters_texto_completo.xlsx cargado: %d gestiones", len(datos["df_v2"]))

    # Silhouette v2
    metricas = datos["df_metricas_v2"].set_index("metrica")["valor"].to_dict()
    datos["sil_v2"]     = safe_float(metricas.get("silhouette_score_v2", 0))
    datos["n_total"]    = int(safe_float(metricas.get("n_total", len(datos["df_v2"]))))
    datos["p_outlier"]  = int(safe_float(metricas.get("outlier_percentil", 90)))

    # ── clusters.xlsx (Iter 1) ────────────────────────────────────────────
    datos["sil_v1"]   = None
    datos["df_v1"]    = None
    datos["v1_disponible"] = False

    if XLSX_V1.exists():
        try:
            df_v1 = pd.read_excel(XLSX_V1, sheet_name="paginas")
            datos["df_v1"] = df_v1
            datos["v1_disponible"] = True
            log.info("clusters.xlsx (v1) cargado: %d gestiones", len(df_v1))

            # Intentar leer silhouette v1 de hoja metricas_modelos
            try:
                df_met_v1 = pd.read_excel(XLSX_V1, sheet_name="metricas_modelos")
                # Filtrar KMeans k=8 (el fijo de iter 2) o el k óptimo
                km_rows = df_met_v1[df_met_v1["metodo"].str.contains("KMeans k=", na=False)]
                if not km_rows.empty:
                    datos["sil_v1"] = float(km_rows.iloc[0]["silhouette"])
                    log.info("Silhouette v1 recuperado: %.4f", datos["sil_v1"])
            except Exception:
                # Calcular desde silhouette_score directamente
                if "silhouette_score" in df_v1.columns:
                    datos["sil_v1"] = float(df_v1["silhouette_score"].mean())
                    log.info("Silhouette v1 calculado como media: %.4f", datos["sil_v1"])
        except Exception as exc:
            log.warning("No se pudo cargar clusters.xlsx (v1): %s", exc)

    # ── scraped_content.csv ───────────────────────────────────────────────
    datos["df_scraped"] = None
    if CSV_SCRAPED.exists():
        try:
            datos["df_scraped"] = pd.read_csv(CSV_SCRAPED, encoding="utf-8")
            log.info("scraped_content.csv cargado: %d filas", len(datos["df_scraped"]))
        except Exception as exc:
            log.warning("No se pudo cargar scraped_content.csv: %s", exc)

    return datos


# ---------------------------------------------------------------------------
# PASO 2 — SECCIÓN: MÉTRICAS DE CALIDAD
# ---------------------------------------------------------------------------

def seccion_metricas(datos: dict) -> str:
    sil_v2 = datos["sil_v2"]
    sil_v1 = datos["sil_v1"]

    lineas = ["## 1. Métricas de Calidad", ""]
    lineas.append(f"| Métrica | Valor |")
    lineas.append(f"|---------|-------|")
    lineas.append(f"| **Silhouette Score v2** | `{sil_v2:.4f}` |")

    if sil_v1 is not None:
        lineas.append(f"| Silhouette Score v1 | `{sil_v1:.4f}` |")
        if sil_v1 != 0:
            mejora = (sil_v2 - sil_v1) / abs(sil_v1) * 100
            signo  = "+" if mejora >= 0 else ""
            lineas.append(f"| Mejora relativa (v2 vs v1) | `{signo}{mejora:.1f}%` |")
        else:
            lineas.append(f"| Mejora relativa | N/A (v1 = 0) |")
    else:
        lineas.append("| Silhouette Score v1 | No disponible |")
        lineas.append("| Mejora relativa | No calculable — sin datos v1 |")

    lineas.append("")
    lineas.append(
        "> El Silhouette Score mide cohesión intra-cluster vs. separación inter-cluster. "
        "Rango: −1 (mala) → +1 (perfecta). Valores > 0.20 indican estructura semántica útil."
    )
    lineas.append("")
    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# PASO 3 — SECCIÓN: ESTADÍSTICAS DE SCRAPING
# ---------------------------------------------------------------------------

def seccion_scraping(datos: dict) -> str:
    df_v2     = datos["df_v2"]
    df_sc     = datos["df_scraped"]
    n_total   = datos["n_total"]

    lineas = ["## 2. Estadísticas de Scraping", ""]

    # Datos primarios: desde la hoja sin_texto y el df principal
    df_sin   = datos["df_sin_texto"]
    n_sin    = len(df_sin)
    n_con    = n_total - n_sin

    lineas.append(f"- **Total gestiones procesadas:** {n_total}")
    lineas.append(f"- **Gestiones con texto extraído:** {n_con} ({fmt_pct(n_con, n_total)})")
    lineas.append(f"- **Gestiones sin texto (errores HTTP / cuerpo vacío):** {n_sin}")

    # Longitud promedio: preferir scraped_content.csv para mayor precisión
    if df_sc is not None and "longitud_texto" in df_sc.columns:
        df_con_texto = df_sc[df_sc["longitud_texto"] > 0]
        if len(df_con_texto) > 0:
            promedio  = df_con_texto["longitud_texto"].mean()
            mediana   = df_con_texto["longitud_texto"].median()
            max_len   = df_con_texto["longitud_texto"].max()
            lineas.append(f"- **Longitud promedio de texto extraído:** {promedio:,.0f} chars")
            lineas.append(f"- **Mediana de longitud:** {mediana:,.0f} chars")
            lineas.append(f"- **Máximo de longitud:** {max_len:,.0f} chars")

        # Distribución de status HTTP
        if "status_http" in df_sc.columns:
            lineas.append("")
            lineas.append("**Distribución de status HTTP:**")
            lineas.append("")
            lineas.append("| Status HTTP | Cantidad |")
            lineas.append("|-------------|----------|")
            for status, cnt in df_sc["status_http"].value_counts().items():
                lineas.append(f"| `{status}` | {cnt} |")
    else:
        lineas.append(f"- *scraped_content.csv no disponible; datos de longitud calculados desde el Excel*")
        # Calcular desde df_v2 columna longitud_texto si existe
        if "longitud_texto" in df_v2.columns:
            df_con_len = df_v2[df_v2["longitud_texto"] > 0]
            if len(df_con_len) > 0:
                lineas.append(
                    f"- **Longitud promedio (desde Excel v2):** {df_con_len['longitud_texto'].mean():,.0f} chars"
                )

    lineas.append("")
    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# PASO 4 — SECCIÓN: ANÁLISIS DE CLUSTERS v2
# ---------------------------------------------------------------------------

def seccion_clusters(datos: dict) -> str:
    df_resumen = datos["df_resumen_v2"]
    df_v2      = datos["df_v2"]
    n_total    = datos["n_total"]

    lineas = ["## 3. Análisis de Clusters v2", ""]
    lineas.append(
        f"K-Means con k={K_CLUSTERS} agrupa las {n_total} gestiones en {K_CLUSTERS} clusters semánticos. "
        "Los clusters se ordenan de mayor a menor densidad poblacional."
    )
    lineas.append("")

    # Ordenar por n_gestiones descendente
    df_res_ord = df_resumen.sort_values("n_gestiones", ascending=False).reset_index(drop=True)

    for _, row in df_res_ord.iterrows():
        cluster_id  = int(row["cluster_v2"])
        n_gest      = int(row["n_gestiones"])
        cohesion    = safe_float(row.get("cohesion_promedio", 0))
        n_out       = int(safe_float(row.get("n_outliers", 0)))
        top10_raw   = str(row.get("top10_representativos", "")).strip()

        lineas.append(f"### Cluster {cluster_id} — {n_gest} gestiones")
        lineas.append("")
        lineas.append(f"- **Cohesión promedio (dist. centroide):** `{cohesion:.4f}`")
        lineas.append(f"- **Outliers en este cluster:** {n_out}")
        lineas.append("")
        lineas.append("**Top 10 gestiones más representativas** (menor distancia al centroide):")
        lineas.append("")

        if top10_raw:
            for linea_top in top10_raw.split("\n"):
                linea_top = linea_top.strip()
                if linea_top:
                    lineas.append(f"{linea_top}")
        else:
            lineas.append("*Sin datos disponibles*")

        lineas.append("")

    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# PASO 5 — SECCIÓN: ANÁLISIS DE OUTLIERS
# ---------------------------------------------------------------------------

def seccion_outliers(datos: dict) -> str:
    df_out    = datos["df_outliers_v2"]
    df_v2     = datos["df_v2"]
    n_total   = datos["n_total"]
    p_outlier = datos["p_outlier"]
    v1_disp   = datos["v1_disponible"]
    df_v1     = datos["df_v1"]

    n_out_v2 = len(df_out)

    lineas = ["## 4. Análisis de Outliers", ""]
    lineas.append(f"- **Total outliers v2** (distancia > p{p_outlier}): **{n_out_v2}** ({fmt_pct(n_out_v2, n_total)})")

    # Si v1 disponible, calcular cuántos outliers v1 fueron reubicados
    if v1_disp and df_v1 is not None and "cluster_v1" in df_v2.columns:
        # Outliers en v2 que en v1 tenían un cluster válido (reubicación)
        df_out_v2_con_v1 = df_out[df_out["cluster_v1"].notna()]
        n_reubicados = len(df_out_v2_con_v1)

        # Intentar detectar outliers v1 desde clusters.xlsx
        if "es_outlier" in df_v1.columns:
            n_out_v1 = int(df_v1["es_outlier"].sum())
        else:
            n_out_v1 = 79  # valor conocido de Iter 1 (79 outliers)
        lineas.append(f"- **Outliers v1** (Iteración 1): **{n_out_v1}**")

        # Gestiones que eran outlier en v1 y ahora están en cluster normal en v2
        if "url" in df_v1.columns and "es_outlier" in df_v1.columns:
            urls_out_v1 = set(df_v1[df_v1["es_outlier"] == True]["url"].tolist())
            mask_prev_out_v1 = df_v2["url"].isin(urls_out_v1)
            # Cuáles de esos ahora NO son outlier en v2
            n_mejorados = int((mask_prev_out_v1 & ~df_v2["es_outlier_v2"]).sum())
            lineas.append(
                f"- **Gestiones que eran outlier en v1 y están en cluster coherente en v2:** {n_mejorados}"
            )
        else:
            lineas.append(
                f"- Comparativa granular v1 → v2 no disponible (falta columna 'es_outlier' o 'url' en v1)"
            )
    else:
        lineas.append("- Comparativa con outliers v1 no disponible (sin datos de Iteración 1)")

    lineas.append("")
    lineas.append("**Top 20 outliers v2 (mayor distancia al centroide):**")
    lineas.append("")
    lineas.append("| Cluster v2 | Título | URL | Distancia |")
    lineas.append("|------------|--------|-----|-----------|")

    if not df_out.empty and "distancia_centroide" in df_out.columns:
        df_top = df_out.sort_values("distancia_centroide", ascending=False).head(20)
        for _, row in df_top.iterrows():
            titulo  = str(row.get("titulo", ""))[:60].replace("|", "¦")
            url     = str(row.get("url", ""))[:70]
            cluster = int(safe_float(row.get("cluster_v2", -1)))
            dist    = safe_float(row.get("distancia_centroide", 0))
            lineas.append(f"| {cluster} | {titulo} | {url} | `{dist:.4f}` |")
    else:
        lineas.append("| — | — | — | — |")

    lineas.append("")
    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# PASO 6 — SECCIÓN: GESTIONES SIN TEXTO
# ---------------------------------------------------------------------------

def seccion_sin_texto(datos: dict) -> str:
    df_sin = datos["df_sin_texto"]
    df_sc  = datos["df_scraped"]

    lineas = ["## 5. Gestiones sin Texto Extraído", ""]
    lineas.append(
        f"Las siguientes {len(df_sin)} gestiones no tienen texto extraído "
        "(error HTTP, timeout o cuerpo vacío). Su análisis semántico se basó únicamente en título + URL."
    )
    lineas.append("")

    if len(df_sin) == 0:
        lineas.append("*Todas las gestiones tienen texto extraído.*")
        lineas.append("")
        return "\n".join(lineas)

    lineas.append("| Título | URL | Status HTTP |")
    lineas.append("|--------|-----|-------------|")

    # Enriquecer con status_http si scraped_content.csv está disponible
    if df_sc is not None and "status_http" in df_sc.columns:
        mapa_status = df_sc.set_index("url")["status_http"].to_dict()
        df_sin = df_sin.copy()
        if "status_http" not in df_sin.columns:
            df_sin["status_http"] = df_sin["url"].map(mapa_status).fillna("DESCONOCIDO")
    elif "status_http" not in df_sin.columns:
        df_sin = df_sin.copy()
        df_sin["status_http"] = "DESCONOCIDO"

    for _, row in df_sin.iterrows():
        titulo = str(row.get("titulo", ""))[:60].replace("|", "¦")
        url    = str(row.get("url", ""))[:80]
        status = str(row.get("status_http", ""))
        lineas.append(f"| {titulo} | {url} | `{status}` |")

    lineas.append("")
    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# PASO 7 — SECCIÓN: RECOMENDACIONES PARA IA
# ---------------------------------------------------------------------------

def seccion_recomendaciones(datos: dict) -> str:
    """
    Análisis cluster por cluster con recomendación de categoría
    para la Arquitectura de Información (N1–N5).
    Se infiere el tema dominante a partir de los títulos más representativos.
    """
    df_v2      = datos["df_v2"]
    df_resumen = datos["df_resumen_v2"]

    lineas = ["## 6. Recomendaciones para la Arquitectura de Información", ""]
    lineas.append(
        "Cada cluster semántico sugiere un agrupamiento natural de gestiones. "
        "A continuación se propone la posible categoría del árbol de navegación (N1–N2) "
        "que podría acoger cada cluster, sujeto a validación con expertos en la materia."
    )
    lineas.append("")
    lineas.append(
        "> **Nota metodológica:** La asignación a niveles N1–N5 es orientativa. "
        "La arquitectura final requiere revisión humana para respetar las reglas de "
        "Miller (5–9 opciones por nivel), el ciclo ATO (Empezar → Operar → Consultar → "
        "Modificar/Cerrar → Normativa) y la regla del guion largo (`—`) para nodos sin clasificación intermedia."
    )
    lineas.append("")

    # Patrones heurísticos para inferir categoría IA basados en keywords frecuentes
    # Las categorías son illustrativas para guiar la revisión humana
    heuristicas = [
        (["registro", "rtu", "inscribir", "inscripción", "nit", "contribuyente"],
         "N1: Registro e Inscripción"),
        (["declaración", "declarar", "isr", "iva", "impuesto", "formulario"],
         "N1: Declaraciones y Pago de Impuestos"),
        (["aduana", "importar", "exportar", "importación", "exportación", "arancel", "mercancía"],
         "N1: Comercio Exterior y Aduanas"),
        (["factura", "fel", "electrónica", "emisión", "facturación"],
         "N1: Factura Electrónica (FEL)"),
        (["consulta", "verificar", "verificación", "estado", "validar"],
         "N1: Consultas y Verificaciones"),
        (["agente", "aduanal", "aduanero", "despachante", "auxiliar"],
         "N1: Auxiliares de la Función Pública Aduanera"),
        (["recurso", "apelación", "resolución", "legal", "normativa", "ley"],
         "N1: Marco Normativo y Recursos"),
        (["pago", "pagos", "cuenta", "banco", "transferencia"],
         "N1: Pagos y Recaudación"),
    ]

    for _, row_res in df_resumen.sort_values("cluster_v2").iterrows():
        cluster_id = int(row_res["cluster_v2"])
        n_gest     = int(row_res["n_gestiones"])
        cohesion   = safe_float(row_res.get("cohesion_promedio", 0))

        # Obtener títulos de las gestiones de este cluster
        mask    = df_v2["cluster_v2"] == cluster_id
        titulos = df_v2[mask]["titulo"].str.lower().str.cat(sep=" ")

        # Clasificar heurísticamente
        categoria_propuesta = "Por determinar (requiere revisión humana)"
        for keywords, categoria in heuristicas:
            if any(kw in titulos for kw in keywords):
                categoria_propuesta = categoria
                break

        lineas.append(f"### Cluster {cluster_id} — {n_gest} gestiones")
        lineas.append("")
        lineas.append(f"- **Categoría sugerida en IA:** {categoria_propuesta}")
        lineas.append(f"- **Cohesión promedio:** `{cohesion:.4f}` — "
                      + ("Alta cohesión semántica, cluster bien definido." if cohesion < 3.0
                         else "Cohesión moderada, posible heterogeneidad temática."))
        lineas.append("")
        lineas.append(
            "**Patrón observado:** " + _describir_patron(df_v2[mask]["titulo"].tolist())
        )
        lineas.append("")

    lineas.append("---")
    lineas.append("")
    lineas.append("### Próximos Pasos Recomendados")
    lineas.append("")
    lineas.append(
        "1. **Validación humana de clusters:** Revisar los 10 títulos más representativos por cluster "
        "con el equipo de Arquitectura de Información."
    )
    lineas.append(
        "2. **Revisión de outliers v2:** Las gestiones con `es_outlier_v2 = True` requieren "
        "clasificación manual o refinamiento del modelo."
    )
    lineas.append(
        "3. **Gestiones sin texto:** Resolver los errores HTTP e implementar estrategia "
        "de recuperación para las URLs caídas o redirigidas."
    )
    lineas.append(
        "4. **Iteración 3:** Con los clusters v2 validados, mapear cada uno a la jerarquía "
        "N1–N5 del árbol de navegación y actualizar el dataset canónico `allTramites.json`."
    )
    lineas.append("")
    return "\n".join(lineas)


def _describir_patron(titulos: list[str]) -> str:
    """Genera una descripción breve del patrón temático a partir de los títulos."""
    if not titulos:
        return "Sin gestiones en este cluster."
    # Tomar los 5 primeros para el resumen
    muestra = titulos[:5]
    return "Incluye gestiones como: " + "; ".join(f'"{t[:50]}"' for t in muestra) + "."


# ---------------------------------------------------------------------------
# PASO 8 — ENSAMBLADO DEL INFORME
# ---------------------------------------------------------------------------

def generar_informe(datos: dict) -> str:
    """Ensambla todas las secciones en el documento final."""
    ahora   = datetime.now().strftime("%d/%m/%Y %H:%M")
    sil_v2  = datos["sil_v2"]
    n_total = datos["n_total"]
    v1_disp = datos["v1_disponible"]
    sil_v1  = datos["sil_v1"]

    # Cabecera
    header = f"""# Informe Iteración 2 — Re-clustering con Texto Completo
## Portal SAT Guatemala — Arquitectura de Información

*Generado automáticamente el {ahora}. Requiere validación humana antes de aplicar cambios al árbol de navegación.*

---

## Resumen Ejecutivo

Se re-ejecutó el clustering semántico del Catálogo de Gestiones del Portal SAT incorporando el **texto completo extraído** de las páginas (Iteración 2), frente al enfoque exclusivo de título + URL de la Iteración 1.

| Parámetro | Valor |
|-----------|-------|
| Total gestiones analizadas | **{n_total}** |
| Modelo de embeddings | `paraphrase-multilingual-MiniLM-L12-v2` |
| Algoritmo de clustering | K-Means, k=8, random_state=42 |
| Silhouette Score v2 | **`{sil_v2:.4f}`** |
| Silhouette Score v1 | **`{f"{sil_v1:.4f}" if sil_v1 is not None else "No disponible"}`** |
| Outliers v2 (dist > p90) | **{len(datos["df_outliers_v2"])}** |
| Gestiones sin texto | **{len(datos["df_sin_texto"])}** |

---

"""

    secciones = [
        seccion_metricas(datos),
        seccion_scraping(datos),
        seccion_clusters(datos),
        seccion_outliers(datos),
        seccion_sin_texto(datos),
        seccion_recomendaciones(datos),
    ]

    pie = """---

*Fin del informe. Archivo generado por `scripts/informe_iter2.py`.*
*Para reproducir: `python scripts/informe_iter2.py`*
"""

    return header + "\n".join(secciones) + pie


# ---------------------------------------------------------------------------
# PUNTO DE ENTRADA
# ---------------------------------------------------------------------------

def main() -> None:
    log.info("=" * 60)
    log.info("Iteración 2 — Generación de informe — Portal SAT")
    log.info("=" * 60)

    # 1. Cargar todos los datos
    datos = cargar_datos()

    # 2. Ensamblar informe
    contenido = generar_informe(datos)

    # 3. Escribir informe
    OUTPUT_MD.write_text(contenido, encoding="utf-8")
    log.info("Informe escrito: %s", OUTPUT_MD)
    log.info("Tamaño: %d bytes / %d líneas", len(contenido.encode("utf-8")), contenido.count("\n"))

    # 4. Resumen en consola
    log.info("=" * 60)
    log.info("INFORME GENERADO")
    log.info("Silhouette v2: %.4f", datos["sil_v2"])
    if datos["sil_v1"] is not None:
        log.info("Silhouette v1: %.4f", datos["sil_v1"])
    log.info("Outliers v2:   %d", len(datos["df_outliers_v2"]))
    log.info("Sin texto:     %d", len(datos["df_sin_texto"]))
    log.info("Salida:        %s", OUTPUT_MD)
    log.info("=" * 60)


if __name__ == "__main__":
    main()
