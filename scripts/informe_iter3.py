"""
informe_iter3.py
================
Iteración 3 — Generación del informe de re-clustering con texto limpio.

Lee los entregables de cluster_iter3.py y genera:
    salida/informe_v3.md

Fuentes:
  - salida/clusters_iter3.xlsx
  - salida/metricas_k.csv
  - salida/scraped_content_clean.csv

Reglas:
  - Prohibido 'trámite'/'trámites' → 'gestión'/'gestiones'
  - Niveles jerárquicos: N1–N5 únicamente
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
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# CONFIGURACIÓN
# ---------------------------------------------------------------------------
OUTPUT_DIR        = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida")
XLSX_V3           = OUTPUT_DIR / "clusters_iter3.xlsx"
CSV_METRICAS_K    = OUTPUT_DIR / "metricas_k.csv"
CSV_CLEAN         = OUTPUT_DIR / "scraped_content_clean.csv"
OUTPUT_MD         = OUTPUT_DIR / "informe_v3.md"

SIL_V1_CONOCIDO       = 0.0889
N_OUTLIERS_V2_CONOCIDO = 54

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def fmt_pct(n: int | float, total: int) -> str:
    if total == 0:
        return "0%"
    return f"{float(n) / total * 100:.1f}%"


def safe_float(val) -> float:
    try:
        return float(val)
    except (TypeError, ValueError):
        return 0.0


def safe_int(val) -> int:
    try:
        return int(float(val))
    except (TypeError, ValueError):
        return 0


# ---------------------------------------------------------------------------
# PASO 1 — CARGA DE DATOS
# ---------------------------------------------------------------------------

def cargar_datos() -> dict:
    if not XLSX_V3.exists():
        raise FileNotFoundError(
            f"No se encontró: {XLSX_V3}\n"
            "Ejecute primero: python scripts/cluster_iter3.py"
        )

    datos: dict = {}

    datos["df_v3"]         = pd.read_excel(XLSX_V3, sheet_name="gestiones_v3")
    datos["df_resumen_v3"] = pd.read_excel(XLSX_V3, sheet_name="resumen_clusters_v3")
    datos["df_outliers_v3"]= pd.read_excel(XLSX_V3, sheet_name="outliers_v3")
    datos["df_cambios"]    = pd.read_excel(XLSX_V3, sheet_name="cambios_v2_v3")
    datos["df_metricas_v3"]= pd.read_excel(XLSX_V3, sheet_name="metricas_v3")

    log.info("clusters_iter3.xlsx cargado: %d gestiones", len(datos["df_v3"]))

    # Extraer métricas
    met = datos["df_metricas_v3"].set_index("metrica")["valor"].to_dict()
    datos["sil_v3"]      = safe_float(met.get("silhouette_score_v3", 0))
    datos["sil_v2"]      = safe_float(met.get("silhouette_score_v2", 0)) if met.get("silhouette_score_v2") not in (None, "N/D", "") else None
    datos["sil_v1"]      = SIL_V1_CONOCIDO
    datos["k_optimo"]    = safe_int(met.get("k_clusters", 8))
    datos["n_total"]     = safe_int(met.get("n_total", len(datos["df_v3"])))
    datos["n_outliers_v3"] = safe_int(met.get("n_outliers_v3", 0))
    datos["n_outliers_v2"] = safe_int(met.get("n_outliers_v2", N_OUTLIERS_V2_CONOCIDO))
    datos["n_cambios"]   = safe_int(met.get("n_cambios_cluster", len(datos["df_cambios"])))

    # metricas_k.csv
    datos["df_metricas_k"] = None
    if CSV_METRICAS_K.exists():
        try:
            datos["df_metricas_k"] = pd.read_csv(CSV_METRICAS_K, encoding="utf-8")
            log.info("metricas_k.csv cargado: %d filas", len(datos["df_metricas_k"]))
        except Exception as exc:
            log.warning("No se pudo cargar metricas_k.csv: %s", exc)

    # scraped_content_clean.csv
    datos["df_clean"] = None
    if CSV_CLEAN.exists():
        try:
            datos["df_clean"] = pd.read_csv(CSV_CLEAN, encoding="utf-8")
            log.info("scraped_content_clean.csv cargado: %d filas", len(datos["df_clean"]))
        except Exception as exc:
            log.warning("No se pudo cargar scraped_content_clean.csv: %s", exc)

    return datos


# ---------------------------------------------------------------------------
# SECCIÓN 0 — CABECERA Y RESUMEN EJECUTIVO
# ---------------------------------------------------------------------------

def seccion_cabecera(datos: dict) -> str:
    ahora       = datetime.now().strftime("%d/%m/%Y %H:%M")
    sil_v3      = datos["sil_v3"]
    k_optimo    = datos["k_optimo"]
    n_total     = datos["n_total"]
    n_out_v3    = datos["n_outliers_v3"]

    return f"""# Informe Iteración 3 — Limpieza de Boilerplate + Re-clustering
## Portal SAT Guatemala — Arquitectura de Información

*Generado automáticamente el {ahora}. Requiere validación humana antes de aplicar cambios al árbol de navegación.*

---

## Resumen Ejecutivo

La Iteración 3 extiende el trabajo de la Iteración 2 incorporando una etapa previa de **limpieza de boilerplate institucional** (menús, footers, scripts, frases repetidas) antes de generar los embeddings semánticos. Adicionalmente, se realiza una búsqueda del k óptimo para K-Means en el rango [6–14].

| Parámetro | Valor |
|-----------|-------|
| Total gestiones analizadas | **{n_total}** |
| Modelo de embeddings | `paraphrase-multilingual-MiniLM-L12-v2` |
| Algoritmo de clustering | K-Means, k={k_optimo} (óptimo), random_state=42 |
| Silhouette Score v3 | **`{sil_v3:.4f}`** |
| Outliers v3 (dist > p90) | **{n_out_v3}** |

---

"""


# ---------------------------------------------------------------------------
# SECCIÓN 1 — TABLA COMPARATIVA DE SILHOUETTE SCORE
# ---------------------------------------------------------------------------

def seccion_comparativa_silhouette(datos: dict) -> str:
    sil_v1   = datos["sil_v1"]
    sil_v2   = datos["sil_v2"]
    sil_v3   = datos["sil_v3"]
    k_optimo = datos["k_optimo"]

    if sil_v2 is not None and sil_v2 > 0:
        obs_v2 = "+ Texto completo (con boilerplate)"
    else:
        obs_v2 = "+ Texto completo (con boilerplate)"

    if sil_v3 > (sil_v2 or 0):
        obs_v3 = "✓ Mejora respecto a v2 — limpieza de boilerplate fue efectiva"
    else:
        obs_v3 = (
            "Sin mejora respecto a v2. Hipótesis: el boilerplate puede actuar como señal "
            "de dominio (todas las páginas del mismo portal), y su eliminación reduce la "
            "cohesión aparente. Alternativa: ajustar umbral de limpieza o reducir MAX_PALABRAS."
        )

    sil_v2_str = f"`{sil_v2:.4f}`" if sil_v2 is not None else "N/D"

    lineas = [
        "## 1. Tabla Comparativa de Silhouette Score",
        "",
        "| Versión | k | Silhouette Score | Observación |",
        "|---------|---|-----------------|-------------|",
        f"| v1 | 8 | `{sil_v1:.4f}` | Solo título + URL |",
        f"| v2 | 8 | {sil_v2_str} | {obs_v2} |",
        f"| v3 | {k_optimo} | `{sil_v3:.4f}` | + Texto limpio sin boilerplate |",
        "",
        f"> **Conclusión:** {obs_v3}",
        "",
    ]
    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# SECCIÓN 2 — EVALUACIÓN DE K
# ---------------------------------------------------------------------------

def seccion_evaluacion_k(datos: dict) -> str:
    df_k    = datos["df_metricas_k"]
    k_opt   = datos["k_optimo"]

    lineas = ["## 2. Evaluación de k (Búsqueda del k Óptimo)", ""]

    if df_k is None or df_k.empty:
        lineas.append("*metricas_k.csv no disponible. Ejecute `python scripts/find_k_optimal.py`.*")
        lineas.append("")
        return "\n".join(lineas)

    lineas.append(
        f"Se evaluaron k ∈ [6, 14]. El k seleccionado como óptimo es **k={k_opt}** "
        "(mayor Silhouette Score)."
    )
    lineas.append("")
    lineas.append("| k | Silhouette ↑ | Inercia | Davies-Bouldin ↓ | ¿Óptimo? |")
    lineas.append("|---|-------------|---------|-----------------|----------|")

    for _, row in df_k.iterrows():
        k_val = safe_int(row.get("k", 0))
        sil   = safe_float(row.get("silhouette", 0))
        iner  = safe_float(row.get("inertia", 0))
        db    = safe_float(row.get("davies_bouldin", 0))
        marca = "**✓**" if k_val == k_opt else ""
        lineas.append(f"| {k_val} | `{sil:.4f}` | `{iner:,.0f}` | `{db:.4f}` | {marca} |")

    lineas.append("")
    lineas.append(
        "> El Silhouette Score mide cohesión intra-cluster vs. separación inter-cluster. "
        "Davies-Bouldin mide la similitud promedio entre clusters (menor = mejor separación). "
        "La elección final pondera principalmente el Silhouette Score máximo, validado con la "
        "curva de inercia para confirmar el codo."
    )
    lineas.append("")
    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# SECCIÓN 3 — CLUSTERS V3
# ---------------------------------------------------------------------------

def seccion_clusters_v3(datos: dict) -> str:
    df_res = datos["df_resumen_v3"]
    k_opt  = datos["k_optimo"]
    n_total = datos["n_total"]

    lineas = ["## 3. Clusters v3", ""]
    lineas.append(
        f"K-Means con k={k_opt} agrupa las {n_total} gestiones en {k_opt} clusters semánticos. "
        "Los clusters se presentan en orden ascendente de id."
    )
    lineas.append("")

    for _, row in df_res.sort_values("cluster_v3").iterrows():
        cid      = safe_int(row["cluster_v3"])
        etiqueta = str(row.get("etiqueta_tfidf", "")).strip() or "sin etiqueta"
        n_gest   = safe_int(row.get("n_gestiones", 0))
        cohesion = safe_float(row.get("cohesion_promedio", 0))
        n_out    = safe_int(row.get("n_outliers", 0))
        top10    = str(row.get("top10_representativos", "")).strip()

        lineas.append(f"### Cluster {cid} — {n_gest} gestiones")
        lineas.append("")
        lineas.append(f"- **Etiqueta TF-IDF:** `{etiqueta}`")
        lineas.append(f"- **Cohesión promedio (dist. centroide):** `{cohesion:.4f}`")
        lineas.append(f"- **Outliers en este cluster:** {n_out}")
        lineas.append("")
        lineas.append("**Top 10 gestiones más representativas** (menor distancia al centroide):")
        lineas.append("")

        if top10:
            for linea_top in top10.split("\n"):
                linea_top = linea_top.strip()
                if linea_top:
                    lineas.append(linea_top)
        else:
            lineas.append("*Sin datos disponibles*")

        lineas.append("")

    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# SECCIÓN 4 — ANÁLISIS DE OUTLIERS
# ---------------------------------------------------------------------------

def seccion_outliers(datos: dict) -> str:
    df_out     = datos["df_outliers_v3"]
    n_out_v3   = datos["n_outliers_v3"]
    n_out_v2   = datos["n_outliers_v2"]
    n_total    = datos["n_total"]

    resueltos = max(0, n_out_v2 - n_out_v3)

    lineas = ["## 4. Análisis de Outliers", ""]
    lineas.append(f"- **Outliers v2** (conocido): **{n_out_v2}** ({fmt_pct(n_out_v2, n_total)})")
    lineas.append(f"- **Outliers v3** (dist > p90): **{n_out_v3}** ({fmt_pct(n_out_v3, n_total)})")
    lineas.append(f"- **Potencialmente resueltos** (v2 → v3): **{resueltos}** gestiones")
    lineas.append("")
    lineas.append(
        "> Un outlier en v3 que ya era outlier en v2 indica una gestión semánticamente atípica "
        "que no se beneficia de la limpieza de boilerplate. Requiere revisión manual o "
        "podría formar su propio nodo en el árbol N1–N5."
    )
    lineas.append("")

    if df_out.empty:
        lineas.append("*No hay outliers en v3.*")
        lineas.append("")
        return "\n".join(lineas)

    lineas.append("**Outliers v3 actuales** (ordenados por distancia al centroide descendente):")
    lineas.append("")
    lineas.append("| Cluster v3 | Título | URL | Distancia |")
    lineas.append("|------------|--------|-----|-----------|")

    col_dist = "distancia_centroide_v3" if "distancia_centroide_v3" in df_out.columns else "distancia_centroide"
    df_top = df_out.copy()
    if col_dist in df_top.columns:
        df_top = df_top.sort_values(col_dist, ascending=False)

    for _, row in df_top.head(30).iterrows():
        titulo  = str(row.get("titulo", ""))[:60].replace("|", "¦")
        url     = str(row.get("url", ""))[:70]
        cluster = safe_int(row.get("cluster_v3", -1))
        dist    = safe_float(row.get(col_dist, 0))
        lineas.append(f"| {cluster} | {titulo} | {url} | `{dist:.4f}` |")

    if len(df_top) > 30:
        lineas.append(f"| … | *y {len(df_top) - 30} más* | | |")

    lineas.append("")
    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# SECCIÓN 5 — GESTIONES INESTABLES SEMÁNTICAMENTE
# ---------------------------------------------------------------------------

def seccion_cambios(datos: dict) -> str:
    df_cambios = datos["df_cambios"]
    n_cambios  = datos["n_cambios"]

    lineas = ["## 5. Gestiones Inestables Semánticamente", ""]
    lineas.append(
        f"Se identificaron **{n_cambios}** gestiones que cambiaron de cluster entre v2 y v3. "
        "Esto indica inestabilidad semántica: el contenido de estas gestiones se clasifica "
        "de forma diferente dependiendo de si se incluye o no el boilerplate institucional."
    )
    lineas.append("")

    if df_cambios.empty:
        lineas.append("*No hay gestiones con cambio de cluster entre v2 y v3.*")
        lineas.append("")
        return "\n".join(lineas)

    lineas.append("| Título | URL | Cluster v2 → Cluster v3 |")
    lineas.append("|--------|-----|------------------------|")

    for _, row in df_cambios.head(50).iterrows():
        titulo    = str(row.get("titulo", ""))[:60].replace("|", "¦")
        url       = str(row.get("url", ""))[:70]
        cl_v2     = str(row.get("cluster_v2", "?"))
        cl_v3     = str(row.get("cluster_v3", "?"))
        lineas.append(f"| {titulo} | {url} | {cl_v2} → {cl_v3} |")

    if len(df_cambios) > 50:
        lineas.append(f"| … | *y {len(df_cambios) - 50} más* | |")

    lineas.append("")
    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# SECCIÓN 6 — RECOMENDACIONES PARA EL ÁRBOL N1–N5
# ---------------------------------------------------------------------------

def seccion_recomendaciones(datos: dict) -> str:
    df_v3      = datos["df_v3"]
    df_resumen = datos["df_resumen_v3"]

    lineas = ["## 6. Recomendaciones para el Árbol N1–N5", ""]
    lineas.append(
        "Cada cluster semántico v3 sugiere un agrupamiento natural de gestiones. "
        "A continuación se propone la posible categoría del árbol de navegación (N1–N2) "
        "que podría acoger cada cluster, sujeto a validación con expertos."
    )
    lineas.append("")
    lineas.append(
        "> **Nota metodológica:**\n"
        "> - Los niveles jerárquicos se denominan exclusivamente **N1, N2, N3, N4, N5** — "
        "sin etiquetas conceptuales adicionales.\n"
        "> - La regla de Miller establece 5–9 opciones por nivel (máximo excepcional: 10 en ≤5% del catálogo).\n"
        "> - El ciclo ATO ordena las gestiones: 1. Empezar → 2. Operar → 3. Consultar → "
        "4. Modificar/Cerrar → 5. Normativa.\n"
        "> - Si un nodo no requiere clasificación intermedia en N3, N4 o N5, "
        "los campos correspondientes se registran con **`—`** (guion largo).\n"
        "> - Cada clic debe representar una decisión consciente; prohibidos los clics pasarela "
        "(subcarpeta con una sola opción)."
    )
    lineas.append("")

    # Patrones heurísticos de categorización N1 (orientativos)
    heuristicas = [
        (["registro", "rtu", "inscribir", "inscripción", "nit", "contribuyente", "inscripcion"],
         "N1 candidato: Registro e Inscripción (inicio del ciclo ATO)"),
        (["declaración", "declarar", "isr", "iva", "impuesto", "formulario", "declaracion"],
         "N1 candidato: Declaraciones y Pago de Impuestos"),
        (["aduana", "importar", "exportar", "importación", "exportación", "arancel", "mercancía",
          "importacion", "exportacion", "mercancia"],
         "N1 candidato: Comercio Exterior y Aduanas"),
        (["factura", "fel", "electrónica", "emisión", "facturación", "electronica", "facturacion"],
         "N1 candidato: Factura Electrónica (FEL)"),
        (["consulta", "verificar", "verificación", "estado", "validar", "verificacion"],
         "N1 candidato: Consultas y Verificaciones"),
        (["agente", "aduanal", "aduanero", "despachante", "auxiliar"],
         "N1 candidato: Auxiliares de la Función Pública Aduanera"),
        (["recurso", "apelación", "resolución", "legal", "normativa", "ley", "apelacion", "resolucion"],
         "N1 candidato: Marco Normativo y Recursos Legales"),
        (["pago", "pagos", "cuenta", "banco", "transferencia", "recaudación", "recaudacion"],
         "N1 candidato: Pagos y Recaudación"),
    ]

    for _, row_res in df_resumen.sort_values("cluster_v3").iterrows():
        cid      = safe_int(row_res["cluster_v3"])
        n_gest   = safe_int(row_res.get("n_gestiones", 0))
        cohesion = safe_float(row_res.get("cohesion_promedio", 0))
        etiqueta = str(row_res.get("etiqueta_tfidf", "")).strip()

        mask = df_v3["cluster_v3"] == cid
        titulos_concat = df_v3[mask]["titulo"].str.lower().str.cat(sep=" ")

        categoria = "Por determinar (requiere revisión humana)"
        for keywords, cat in heuristicas:
            if any(kw in titulos_concat for kw in keywords):
                categoria = cat
                break

        cohesion_desc = (
            "Alta cohesión semántica — cluster bien definido."
            if cohesion < 3.0
            else "Cohesión moderada — posible heterogeneidad temática que puede requerir subdivisión en N3."
        )

        lineas.append(f"### Cluster {cid} — {n_gest} gestiones")
        lineas.append("")
        lineas.append(f"- **Posición sugerida en árbol:** {categoria}")
        lineas.append(f"- **Etiqueta TF-IDF:** `{etiqueta}`")
        lineas.append(f"- **Cohesión promedio:** `{cohesion:.4f}` — {cohesion_desc}")
        if n_gest <= 3:
            lineas.append(
                f"- ⚠️ **Sub-densidad** (≤3 gestiones): evaluar compactación al nivel N superior "
                "para evitar carpeta pasarela vacía."
            )
        elif n_gest >= 10:
            lineas.append(
                f"- ⚠️ **Alta densidad** ({n_gest} gestiones): considerar subdivisión en N3/N4 "
                "si la complejidad temática lo justifica."
            )
        lineas.append("")

    lineas.append("---")
    lineas.append("")
    lineas.append("### Próximos Pasos Recomendados")
    lineas.append("")
    lineas.append(
        "1. **Validación humana de clusters:** Revisar los 10 títulos más representativos "
        "por cluster con el equipo de Arquitectura de Información."
    )
    lineas.append(
        "2. **Revisión de outliers v3:** Las gestiones con `es_outlier_v3 = True` requieren "
        "clasificación manual; muchas pueden haber sido outliers también en v2."
    )
    lineas.append(
        "3. **Gestiones inestables:** Las gestiones que cambiaron de cluster entre v2 y v3 "
        "son candidatas prioritarias para revisión manual antes de fijar su posición en el árbol."
    )
    lineas.append(
        "4. **Iteración 4:** Con los clusters v3 validados, mapear cada uno a la jerarquía "
        "N1–N5 del árbol de navegación y actualizar el dataset canónico `allTramites.json`."
    )
    lineas.append("")
    return "\n".join(lineas)


# ---------------------------------------------------------------------------
# ENSAMBLADO DEL INFORME
# ---------------------------------------------------------------------------

def generar_informe(datos: dict) -> str:
    secciones = [
        seccion_cabecera(datos),
        seccion_comparativa_silhouette(datos),
        seccion_evaluacion_k(datos),
        seccion_clusters_v3(datos),
        seccion_outliers(datos),
        seccion_cambios(datos),
        seccion_recomendaciones(datos),
    ]

    pie = """---

*Fin del informe. Archivo generado por `scripts/informe_iter3.py`.*

**Instrucciones de reproducción:**
```bash
# 1. Limpiar boilerplate
python scripts/clean_boilerplate.py

# 2. Buscar k óptimo
python scripts/find_k_optimal.py

# 3. Re-clustering con k óptimo
python scripts/cluster_iter3.py

# 4. Generar este informe
python scripts/informe_iter3.py
```
"""
    return "\n".join(secciones) + pie


# ---------------------------------------------------------------------------
# PUNTO DE ENTRADA
# ---------------------------------------------------------------------------

def main() -> None:
    log.info("=" * 60)
    log.info("Iteración 3 — Generación de informe — Portal SAT")
    log.info("=" * 60)

    # 1. Cargar datos
    datos = cargar_datos()

    # 2. Ensamblar informe
    contenido = generar_informe(datos)

    # 3. Escribir informe
    OUTPUT_MD.write_text(contenido, encoding="utf-8")
    log.info("Informe escrito: %s", OUTPUT_MD)
    log.info("Tamaño: %d bytes / %d líneas", len(contenido.encode("utf-8")), contenido.count("\n"))

    # 4. Resumen en consola
    print("\n" + "=" * 60)
    print("INFORME v3 GENERADO")
    print("=" * 60)
    print(f"  Silhouette v1:     {datos['sil_v1']:.4f}")
    if datos["sil_v2"] is not None:
        print(f"  Silhouette v2:     {datos['sil_v2']:.4f}")
    else:
        print("  Silhouette v2:     N/D")
    print(f"  Silhouette v3:     {datos['sil_v3']:.4f}")
    print(f"  k óptimo:          {datos['k_optimo']}")
    print(f"  Outliers v2:       {datos['n_outliers_v2']}")
    print(f"  Outliers v3:       {datos['n_outliers_v3']}")
    print(f"  Cambios de cluster:{datos['n_cambios']}")
    print(f"  Salida:            {OUTPUT_MD}")
    print("=" * 60 + "\n")

    log.info("=" * 60)
    log.info("Silhouette v3:       %.4f", datos["sil_v3"])
    log.info("k óptimo:            %d", datos["k_optimo"])
    log.info("Outliers v3:         %d", datos["n_outliers_v3"])
    log.info("Gestiones inestables:%d", datos["n_cambios"])
    log.info("Salida:              %s", OUTPUT_MD)
    log.info("=" * 60)


if __name__ == "__main__":
    main()
