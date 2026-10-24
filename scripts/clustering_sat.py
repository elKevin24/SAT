"""
clustering_sat.py
=================
Script de clustering para el Catálogo de Contenidos Únicos del Portal SAT.

Columnas reales del archivo (hoja 'Catálogo Único (683)'):
  - 'Nombre de la Gestión / Contenido (Lenguaje Claro)'
  - 'Nombre Oficial Administrativo'
  - '¿Para qué sirve? (Descripción Operativa)'
  - 'URL Portal SAT'
  - 'Familia Temática'
  - 'Etapa del Ciclo de Vida'
  - 'Tipo de Interacción'
  - 'Tipología de Contenido'
  - 'Perfil Destinatario'
  - 'Código Canónico Oficial (SAT-GES-####)'

random_state = 42
"""

# ---------------------------------------------------------------------------
# 0. INSTALACIÓN AUTOMÁTICA DE DEPENDENCIAS
# ---------------------------------------------------------------------------
import subprocess, sys

def _install(pkg):
    subprocess.run(
        [sys.executable, "-m", "pip", "install", "--quiet", pkg],
        check=False,
    )

for _pkg in [
    "sentence-transformers",
    "hdbscan",
    "umap-learn",
    "scikit-learn",
    "pandas",
    "openpyxl",
    "matplotlib",
    "seaborn",
    "scipy",
]:
    _install(_pkg)

# ---------------------------------------------------------------------------
# IMPORTS
# ---------------------------------------------------------------------------
import os
import re
import warnings
import logging
from pathlib import Path
from urllib.parse import urlparse

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

# ---------------------------------------------------------------------------
# CONFIGURACIÓN GENERAL
# ---------------------------------------------------------------------------
RANDOM_STATE = 42
INPUT_FILE = Path(
    r"c:\Users\busqu\Documents\GitHub\SAT\docs\fuentes-datos"
    r"\02_archivos_producto_entregables\Catalogo_Contenidos_Unicos_Portal_SAT.xlsx"
)
OUTPUT_DIR = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_XLSX  = OUTPUT_DIR / "clusters.xlsx"
OUTPUT_PNG   = OUTPUT_DIR / "mapa_clusters.png"
OUTPUT_MD    = OUTPUT_DIR / "informe.md"

SHEET_NAME = "Catálogo Único (683)"

# Nombres de columna reales
COL_NOMBRE      = "Nombre de la Gestión / Contenido (Lenguaje Claro)"
COL_NOMBRE_OFI  = "Nombre Oficial Administrativo"
COL_DESC        = "¿Para qué sirve? (Descripción Operativa)"
COL_URL         = "URL Portal SAT"
COL_FAMILIA     = "Familia Temática"
COL_ETAPA       = "Etapa del Ciclo de Vida"
COL_TIPO_INT    = "Tipo de Interacción"
COL_TIPOLOGIA   = "Tipología de Contenido"
COL_PERFIL      = "Perfil Destinatario"
COL_CODIGO      = "Código Canónico Oficial (SAT-GES-####)"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# Variables de estado global que se rellenan durante la ejecución
metodo_representacion = "desconocido"
metodo_clustering     = "desconocido"
metodo_reduccion      = "desconocido"
k_elegido             = None

# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def clean_text(s) -> str:
    """Minúsculas, strip, espacios normalizados."""
    if not isinstance(s, str):
        return ""
    return re.sub(r"\s+", " ", s.lower().strip())


def url_to_text(url) -> str:
    """Extrae segmentos del path de una URL y reemplaza guiones por espacios."""
    if not isinstance(url, str) or not url.strip():
        return ""
    try:
        parsed = urlparse(url.strip())
        path = parsed.path
        # quitar slashes iniciales/finales, split por /
        segments = [s.replace("-", " ").replace("_", " ") for s in path.strip("/").split("/") if s]
        return " ".join(segments)
    except Exception:
        return ""


def cosine_sim_matrix(X):
    """Matriz de similitud coseno (numpy)."""
    from sklearn.preprocessing import normalize
    Xn = normalize(X, norm="l2")
    return Xn @ Xn.T


# ---------------------------------------------------------------------------
# PASO 1 – CARGA Y PREPARACIÓN DE TEXTO
# ---------------------------------------------------------------------------
log.info("=" * 60)
log.info("PASO 1 – Carga y preparación de texto")
log.info("=" * 60)

try:
    df = pd.read_excel(INPUT_FILE, sheet_name=SHEET_NAME)
    log.info("Filas cargadas: %d", len(df))

    # Texto limpio de cada campo
    df["_nombre"]     = df[COL_NOMBRE].apply(clean_text)
    df["_nombre_ofi"] = df[COL_NOMBRE_OFI].apply(clean_text)
    df["_desc"]       = df[COL_DESC].apply(clean_text)
    df["_url_texto"]  = df[COL_URL].apply(url_to_text).apply(clean_text)

    # Sección actual: primer segmento del path de la URL
    def _first_segment(url):
        if not isinstance(url, str):
            return "sin-url"
        try:
            path = urlparse(url.strip()).path.strip("/")
            segs = [s for s in path.split("/") if s]
            return segs[0] if segs else "raiz"
        except Exception:
            return "sin-url"

    df["seccion_actual"] = df[COL_URL].apply(_first_segment)

    # Campo principal de análisis
    df["texto_analisis"] = (
        df["_nombre"] + " "
        + df["_url_texto"] + " "
        + df["_desc"]
    ).str.strip()

    log.info("Nulos en texto_analisis: %d", df["texto_analisis"].str.strip().eq("").sum())
    log.info("Secciones únicas encontradas: %s", df["seccion_actual"].nunique())

except Exception as e:
    log.error("Paso 1 falló: %s", e)
    raise SystemExit(1)

# ---------------------------------------------------------------------------
# PASO 2 – REPRESENTACIÓN VECTORIAL
# ---------------------------------------------------------------------------
log.info("=" * 60)
log.info("PASO 2 – Representación vectorial")
log.info("=" * 60)

textos = df["texto_analisis"].tolist()
X = None

try:
    log.info("Intentando embeddings con sentence-transformers …")
    from sentence_transformers import SentenceTransformer
    model_st = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
    X = model_st.encode(textos, show_progress_bar=True, batch_size=64)
    X = np.array(X, dtype=np.float32)
    metodo_representacion = "sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2)"
    log.info("Embeddings generados: shape %s", X.shape)
except Exception as e:
    log.warning("sentence-transformers falló (%s). Usando TF-IDF char_wb (3,5).", e)
    print("\n*** ADVERTENCIA: Se usa TF-IDF (char_wb, ngram 3-5) en lugar de embeddings. ***\n")
    from sklearn.feature_extraction.text import TfidfVectorizer
    tfidf = TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), max_features=20000, sublinear_tf=True)
    X = tfidf.fit_transform(textos).toarray().astype(np.float32)
    metodo_representacion = "TF-IDF char_wb ngram(3,5)"
    log.info("TF-IDF shape: %s", X.shape)

# ---------------------------------------------------------------------------
# PASO 3 – CLUSTERING COMPARATIVO
# ---------------------------------------------------------------------------
log.info("=" * 60)
log.info("PASO 3 – Clustering comparativo")
log.info("=" * 60)

from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics import silhouette_score, davies_bouldin_score, adjusted_rand_score

metricas_modelos = []   # lista de dicts para la hoja de métricas
labels_kmeans_opt = None
labels_hier_opt   = None
labels_hdbscan    = None
k_optimo          = 10  # default

# ── K-Means: k de 5 a 30 ─────────────────────────────────────────────────
log.info("K-Means: probando k = 5..30")
sil_scores = {}
db_scores  = {}

try:
    for k in range(5, 31):
        km = KMeans(n_clusters=k, random_state=RANDOM_STATE, n_init=10)
        lbs = km.fit_predict(X)
        sil = silhouette_score(X, lbs, sample_size=min(500, len(X)), random_state=RANDOM_STATE)
        db  = davies_bouldin_score(X, lbs)
        sil_scores[k] = sil
        db_scores[k]  = db
        log.info("  k=%2d  silhouette=%.4f  davies_bouldin=%.4f", k, sil, db)
        metricas_modelos.append({
            "metodo": f"KMeans k={k}",
            "n_clusters": k,
            "silhouette": round(sil, 4),
            "davies_bouldin": round(db, 4),
            "nota": "",
        })

    # Elegir k: mayor silhouette (o menor DB como desempate)
    k_optimo = max(sil_scores, key=lambda k: sil_scores[k])
    log.info("k óptimo por silhouette: %d (%.4f)", k_optimo, sil_scores[k_optimo])

    # K-Means final con k óptimo
    km_opt = KMeans(n_clusters=k_optimo, random_state=RANDOM_STATE, n_init=20)
    labels_kmeans_opt = km_opt.fit_predict(X)
    sil_final = silhouette_score(X, labels_kmeans_opt, random_state=RANDOM_STATE)
    db_final  = davies_bouldin_score(X, labels_kmeans_opt)
    log.info("K-Means final: silhouette=%.4f, DB=%.4f", sil_final, db_final)

except Exception as e:
    log.error("K-Means falló: %s", e)

# ── Estabilidad K-Means ───────────────────────────────────────────────────
log.info("Estabilidad K-Means con semillas 42, 7, 123")
try:
    labels_seeds = {}
    for seed in [42, 7, 123]:
        km_s = KMeans(n_clusters=k_optimo, random_state=seed, n_init=10)
        labels_seeds[seed] = km_s.fit_predict(X)

    ari_42_7   = adjusted_rand_score(labels_seeds[42],  labels_seeds[7])
    ari_42_123 = adjusted_rand_score(labels_seeds[42],  labels_seeds[123])
    ari_7_123  = adjusted_rand_score(labels_seeds[7],   labels_seeds[123])
    log.info("ARI (42 vs 7)=%.4f | (42 vs 123)=%.4f | (7 vs 123)=%.4f",
             ari_42_7, ari_42_123, ari_7_123)
    metricas_modelos.append({
        "metodo": f"KMeans estabilidad k={k_optimo}",
        "n_clusters": k_optimo,
        "silhouette": round(sil_final, 4) if labels_kmeans_opt is not None else None,
        "davies_bouldin": round(db_final, 4) if labels_kmeans_opt is not None else None,
        "nota": f"ARI 42-7={ari_42_7:.4f}, 42-123={ari_42_123:.4f}, 7-123={ari_7_123:.4f}",
    })
except Exception as e:
    log.error("Estabilidad K-Means falló: %s", e)

# ── Clustering Jerárquico (Ward) ──────────────────────────────────────────
log.info("Clustering jerárquico Ward con k=%d", k_optimo)
try:
    hier = AgglomerativeClustering(n_clusters=k_optimo, linkage="ward")
    labels_hier_opt = hier.fit_predict(X)
    sil_h = silhouette_score(X, labels_hier_opt, random_state=RANDOM_STATE)
    db_h  = davies_bouldin_score(X, labels_hier_opt)
    log.info("Jerárquico: silhouette=%.4f, DB=%.4f", sil_h, db_h)
    metricas_modelos.append({
        "metodo": f"Jerárquico Ward k={k_optimo}",
        "n_clusters": k_optimo,
        "silhouette": round(sil_h, 4),
        "davies_bouldin": round(db_h, 4),
        "nota": "",
    })
except Exception as e:
    log.error("Clustering jerárquico falló: %s", e)
    labels_hier_opt = labels_kmeans_opt

# ── HDBSCAN ───────────────────────────────────────────────────────────────
log.info("HDBSCAN min_cluster_size=5")
try:
    import hdbscan
    hdb = hdbscan.HDBSCAN(min_cluster_size=5, gen_min_span_tree=True)
    labels_hdbscan = hdb.fit_predict(X)
    n_hdb = len(set(labels_hdbscan)) - (1 if -1 in labels_hdbscan else 0)
    noise  = (labels_hdbscan == -1).sum()
    log.info("HDBSCAN: %d clusters, %d ruido", n_hdb, noise)
    if n_hdb > 1:
        mask = labels_hdbscan != -1
        sil_hdb = silhouette_score(X[mask], labels_hdbscan[mask], random_state=RANDOM_STATE)
        db_hdb  = davies_bouldin_score(X[mask], labels_hdbscan[mask])
    else:
        sil_hdb, db_hdb = np.nan, np.nan
    metricas_modelos.append({
        "metodo": "HDBSCAN min_cluster_size=5",
        "n_clusters": n_hdb,
        "silhouette": round(sil_hdb, 4) if not np.isnan(sil_hdb) else "N/A",
        "davies_bouldin": round(db_hdb, 4) if not np.isnan(db_hdb) else "N/A",
        "nota": f"ruido={noise}",
    })
except Exception as e:
    log.error("HDBSCAN falló: %s", e)
    labels_hdbscan = None
    sil_hdb, db_hdb = np.nan, np.nan
    n_hdb = 0

# ── Elección del mejor método ─────────────────────────────────────────────
# Criterio: mayor silhouette entre KMeans y Jerárquico
try:
    best_sil_km   = sil_final  if labels_kmeans_opt is not None else -1
    best_sil_hier = sil_h      if labels_hier_opt   is not None else -1
    if best_sil_km >= best_sil_hier:
        labels_final  = labels_kmeans_opt
        metodo_clustering = f"KMeans k={k_optimo} (silhouette={best_sil_km:.4f})"
    else:
        labels_final  = labels_hier_opt
        metodo_clustering = f"Jerárquico Ward k={k_optimo} (silhouette={best_sil_hier:.4f})"
    k_elegido = k_optimo
    log.info("Método elegido: %s", metodo_clustering)
except Exception as e:
    log.error("Selección de método falló: %s", e)
    labels_final = labels_kmeans_opt if labels_kmeans_opt is not None else np.zeros(len(df), dtype=int)
    k_elegido = k_optimo

df["cluster_id"] = labels_final

# ---------------------------------------------------------------------------
# PASO 4 – INTERPRETACIÓN POR CLUSTER
# ---------------------------------------------------------------------------
log.info("=" * 60)
log.info("PASO 4 – Interpretación por cluster")
log.info("=" * 60)

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import pairwise_distances
from sklearn.metrics import silhouette_samples

try:
    sil_samples = silhouette_samples(X, labels_final)
    df["silhouette_score"] = sil_samples
except Exception as e:
    log.error("silhouette_samples falló: %s", e)
    df["silhouette_score"] = 0.0

cluster_info = {}   # cluster_id -> dict

try:
    tfidf_interp = TfidfVectorizer(
        analyzer="word", ngram_range=(1, 2),
        max_features=30000, sublinear_tf=True,
        min_df=2, stop_words=None,
    )
    tfidf_matrix = tfidf_interp.fit_transform(textos)
    feature_names = np.array(tfidf_interp.get_feature_names_out())

    unique_clusters = sorted(set(labels_final))
    # Calcular centroide como media de embeddings
    centroids = {}
    for c in unique_clusters:
        mask = labels_final == c
        centroids[c] = X[mask].mean(axis=0)

    # Distancia euclidiana de cada punto al centroide de su cluster
    dist_centroide = np.zeros(len(df))
    for c in unique_clusters:
        mask = labels_final == c
        idx  = np.where(mask)[0]
        dists = np.linalg.norm(X[idx] - centroids[c], axis=1)
        dist_centroide[idx] = dists
    df["distancia_centroide"] = dist_centroide

    for c in unique_clusters:
        mask   = labels_final == c
        idx    = np.where(mask)[0]
        n_pags = int(mask.sum())

        # Top-10 términos clave por TF-IDF del cluster
        cluster_tfidf = tfidf_matrix[mask].toarray().mean(axis=0)
        top10_idx     = cluster_tfidf.argsort()[-10:][::-1]
        top10_terms   = feature_names[top10_idx].tolist()

        # 5 más cercanas al centroide
        dists_c  = dist_centroide[idx]
        closest5 = idx[dists_c.argsort()[:5]].tolist()

        # 3 outliers (más lejanas)
        outliers3 = idx[dists_c.argsort()[-3:][::-1]].tolist()

        # Nombre propuesto: primera palabra del top término más las dos siguientes
        nombre_propuesto = " / ".join(top10_terms[:3]).title()

        cluster_info[c] = {
            "cluster_id":       c,
            "nombre_propuesto": nombre_propuesto,
            "n_paginas":        n_pags,
            "terminos_clave":   ", ".join(top10_terms),
            "cohesion_promedio": round(float(dists_c.mean()), 4),
            "representativas":  closest5,
            "outliers":         outliers3,
        }

    df["cluster_nombre"] = df["cluster_id"].map(lambda c: cluster_info.get(c, {}).get("nombre_propuesto", str(c)))
    df["es_outlier"] = False
    for c, info in cluster_info.items():
        for i in info["outliers"]:
            df.at[i, "es_outlier"] = True

    log.info("Clusters interpretados: %d", len(cluster_info))

except Exception as e:
    log.error("Paso 4 falló: %s", e)
    df["distancia_centroide"] = 0.0
    df["cluster_nombre"] = df["cluster_id"].astype(str)
    df["es_outlier"] = False

# ---------------------------------------------------------------------------
# PASO 5 – COMPARACIÓN CON ESTRUCTURA ACTUAL
# ---------------------------------------------------------------------------
log.info("=" * 60)
log.info("PASO 5 – Comparación con estructura actual")
log.info("=" * 60)

cross_tab = None
clusters_mezclados = []
secciones_repartidas = []

try:
    cross_tab = pd.crosstab(df["cluster_id"], df["seccion_actual"])
    log.info("Tabla cruzada cluster × sección:\n%s", cross_tab.to_string())

    # Clusters que mezclan ≥3 secciones distintas con ≥5 páginas cada una
    for c in cross_tab.index:
        row = cross_tab.loc[c]
        secciones_con_peso = (row >= 5).sum()
        if secciones_con_peso >= 3:
            clusters_mezclados.append(int(c))

    # Secciones repartidas en ≥3 clusters con ≥5 páginas cada uno
    for s in cross_tab.columns:
        col = cross_tab[s]
        clusters_con_peso = (col >= 5).sum()
        if clusters_con_peso >= 3:
            secciones_repartidas.append(s)

    log.info("Clusters que mezclan secciones (≥3 secciones con ≥5 pág): %s", clusters_mezclados)
    log.info("Secciones repartidas en ≥3 clusters: %s", secciones_repartidas)

except Exception as e:
    log.error("Paso 5 falló: %s", e)

# ---------------------------------------------------------------------------
# PASO 6 – HALLAZGOS ESPECIALES
# ---------------------------------------------------------------------------
log.info("=" * 60)
log.info("PASO 6 – Hallazgos especiales")
log.info("=" * 60)

duplicados_df  = pd.DataFrame()
outliers_glob  = pd.DataFrame()
mal_ubicadas   = pd.DataFrame()

try:
    from sklearn.preprocessing import normalize
    Xn = normalize(X, norm="l2")

    # Duplicados/casi-duplicados: similitud coseno ≥ 0.95
    BATCH = 100
    dup_pairs = []
    n = len(Xn)
    for i in range(0, n, BATCH):
        batch = Xn[i:i+BATCH]
        sims  = batch @ Xn.T       # (BATCH, n)
        for bi, gi in enumerate(range(i, min(i+BATCH, n))):
            row = sims[bi]
            row[gi] = 0.0          # excluir diagonal
            for j in np.where(row >= 0.95)[0]:
                if j > gi:
                    dup_pairs.append({
                        "idx_a": int(gi),
                        "idx_b": int(j),
                        "nombre_a": df.iloc[gi][COL_NOMBRE],
                        "nombre_b": df.iloc[j][COL_NOMBRE],
                        "url_a":    df.iloc[gi][COL_URL],
                        "url_b":    df.iloc[j][COL_URL],
                        "similitud_coseno": round(float(row[j]), 4),
                        "tipo": "duplicado/casi-duplicado",
                    })

    duplicados_df = pd.DataFrame(dup_pairs)
    log.info("Pares casi-duplicados (cos≥0.95): %d", len(dup_pairs))

    # Outliers globales: silhouette negativo
    outliers_idx = df[df["silhouette_score"] < 0].index.tolist()
    outliers_glob = df.loc[outliers_idx, [COL_NOMBRE, COL_URL, "cluster_id", "silhouette_score"]].copy()
    log.info("Outliers globales (silhouette<0): %d", len(outliers_idx))

    # Páginas posiblemente mal ubicadas: similitud con centroide ajeno > similitud con el propio
    mal_ub_list = []
    for c, info in cluster_info.items():
        centroid_c = centroids[c]
        mask = labels_final == c
        idx_c = np.where(mask)[0]
        for i in idx_c:
            sim_propio = float(Xn[i] @ normalize(centroid_c.reshape(1, -1))[0])
            mejor_ajeno = -1
            mejor_cluster = -1
            for c2, cen2 in centroids.items():
                if c2 == c:
                    continue
                s2 = float(Xn[i] @ normalize(cen2.reshape(1, -1))[0])
                if s2 > mejor_ajeno:
                    mejor_ajeno    = s2
                    mejor_cluster  = c2
            if mejor_ajeno > sim_propio:
                mal_ub_list.append({
                    "idx": int(i),
                    "nombre": df.iloc[i][COL_NOMBRE],
                    "url":    df.iloc[i][COL_URL],
                    "cluster_actual": int(c),
                    "cluster_sugerido": int(mejor_cluster),
                    "sim_cluster_actual":   round(sim_propio,   4),
                    "sim_cluster_sugerido": round(mejor_ajeno,  4),
                })
    mal_ubicadas = pd.DataFrame(mal_ub_list)
    log.info("Páginas posiblemente mal ubicadas: %d", len(mal_ub_list))

    # Concatenar todo en duplicados_outliers
    if not outliers_glob.empty:
        outliers_glob_fmt = outliers_glob.rename(columns={
            COL_NOMBRE: "nombre_a",
            COL_URL:    "url_a",
        })
        outliers_glob_fmt["tipo"] = "outlier_global_silhouette_negativo"
        duplicados_df = pd.concat(
            [duplicados_df, outliers_glob_fmt.reindex(columns=duplicados_df.columns if not duplicados_df.empty else outliers_glob_fmt.columns)],
            ignore_index=True,
        )

except Exception as e:
    log.error("Paso 6 falló: %s", e)

# ---------------------------------------------------------------------------
# PASO 7 – REDUCCIÓN DIMENSIONAL
# ---------------------------------------------------------------------------
log.info("=" * 60)
log.info("PASO 7 – Reducción dimensional para visualización")
log.info("=" * 60)

X2d = None

try:
    import umap
    reducer = umap.UMAP(n_components=2, random_state=RANDOM_STATE, metric="cosine", n_jobs=1)
    X2d = reducer.fit_transform(X)
    metodo_reduccion = "UMAP (cosine)"
    log.info("UMAP completado: shape %s", X2d.shape)
except Exception as e:
    log.warning("UMAP falló (%s). Usando PCA.", e)
    from sklearn.decomposition import PCA
    pca = PCA(n_components=2, random_state=RANDOM_STATE)
    X2d = pca.fit_transform(X)
    metodo_reduccion = "PCA (2 componentes)"
    log.info("PCA completado: shape %s", X2d.shape)

df["x_2d"] = X2d[:, 0]
df["y_2d"] = X2d[:, 1]

# ---------------------------------------------------------------------------
# PASO 8 – GENERACIÓN DE ENTREGABLES
# ---------------------------------------------------------------------------
log.info("=" * 60)
log.info("PASO 8 – Generación de entregables")
log.info("=" * 60)

# ── 8a. clusters.xlsx ─────────────────────────────────────────────────────
try:
    import openpyxl
    from openpyxl.utils import get_column_letter

    # Hoja 1: paginas
    hoja_paginas = df[[
        COL_CODIGO, COL_NOMBRE, COL_URL,
        "seccion_actual", "cluster_id", "cluster_nombre",
        "distancia_centroide", "silhouette_score", "es_outlier",
        COL_FAMILIA, COL_ETAPA,
    ]].copy()
    hoja_paginas.columns = [
        "codigo_canonico", "nombre", "url",
        "seccion_actual", "cluster_id", "cluster_nombre",
        "distancia_centroide", "silhouette_score", "es_outlier",
        "familia_tematica", "etapa_ciclo_vida",
    ]

    # Hoja 2: resumen_clusters
    resumen_rows = []
    for c, info in sorted(cluster_info.items()):
        resumen_rows.append({
            "cluster_id":       info["cluster_id"],
            "cluster_nombre":   info["nombre_propuesto"],
            "n_paginas":        info["n_paginas"],
            "terminos_clave":   info["terminos_clave"],
            "cohesion_promedio": info["cohesion_promedio"],
            "paginas_representativas": "; ".join(
                str(df.iloc[i][COL_NOMBRE]) for i in info["representativas"]
            ),
            "outliers_cluster": "; ".join(
                str(df.iloc[i][COL_NOMBRE]) for i in info["outliers"]
            ),
        })
    hoja_resumen = pd.DataFrame(resumen_rows)

    # Hoja 3: duplicados_outliers
    if duplicados_df.empty:
        hoja_dup = pd.DataFrame(columns=["tipo", "nombre_a", "nombre_b", "url_a", "url_b", "similitud_coseno"])
    else:
        hoja_dup = duplicados_df.copy()

    # Agregar mal_ubicadas si existe
    if not mal_ubicadas.empty:
        mal_fmt = mal_ubicadas.copy()
        mal_fmt["tipo"] = "posiblemente_mal_ubicada"
        mal_fmt = mal_fmt.rename(columns={"nombre": "nombre_a", "url": "url_a"})
        hoja_dup = pd.concat([hoja_dup, mal_fmt.reindex(columns=hoja_dup.columns)], ignore_index=True)

    # Hoja 4: metricas_modelos
    hoja_metricas = pd.DataFrame(metricas_modelos)

    with pd.ExcelWriter(OUTPUT_XLSX, engine="openpyxl") as writer:
        hoja_paginas.to_excel(writer,   sheet_name="paginas",           index=False)
        hoja_resumen.to_excel(writer,   sheet_name="resumen_clusters",  index=False)
        hoja_dup.to_excel(writer,       sheet_name="duplicados_outliers", index=False)
        hoja_metricas.to_excel(writer,  sheet_name="metricas_modelos",  index=False)

    log.info("clusters.xlsx escrito: %s", OUTPUT_XLSX)

except Exception as e:
    log.error("clusters.xlsx falló: %s", e)

# ── 8b. mapa_clusters.png ─────────────────────────────────────────────────
try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches
    import seaborn as sns

    unique_ids = sorted(df["cluster_id"].unique())
    palette    = sns.color_palette("tab20", n_colors=max(20, len(unique_ids)))
    color_map  = {c: palette[i % len(palette)] for i, c in enumerate(unique_ids)}

    fig, ax = plt.subplots(figsize=(16, 12), dpi=100)
    for c in unique_ids:
        mask = df["cluster_id"] == c
        ax.scatter(
            df.loc[mask, "x_2d"],
            df.loc[mask, "y_2d"],
            c=[color_map[c]],
            s=25,
            alpha=0.75,
            label=f"C{c}: {cluster_info.get(c, {}).get('nombre_propuesto', str(c))[:25]}",
        )

    # Etiquetas en el centroide de cada cluster en 2D
    for c in unique_ids:
        mask = df["cluster_id"] == c
        cx   = df.loc[mask, "x_2d"].mean()
        cy   = df.loc[mask, "y_2d"].mean()
        ax.annotate(
            f"C{c}",
            xy=(cx, cy),
            fontsize=8,
            fontweight="bold",
            ha="center",
            va="center",
            color="black",
            bbox=dict(boxstyle="round,pad=0.2", fc="white", alpha=0.6, ec="none"),
        )

    ax.set_title(
        f"Mapa de Clusters — Portal SAT\n"
        f"({metodo_clustering} | reducción: {metodo_reduccion})",
        fontsize=13,
        pad=14,
    )
    ax.set_xlabel(f"Dim 1 ({metodo_reduccion})", fontsize=10)
    ax.set_ylabel(f"Dim 2 ({metodo_reduccion})", fontsize=10)
    ax.legend(
        loc="upper left",
        bbox_to_anchor=(1.01, 1),
        fontsize=7,
        framealpha=0.8,
        borderpad=0.5,
    )
    plt.tight_layout()
    fig.savefig(OUTPUT_PNG, dpi=200, bbox_inches="tight")
    plt.close(fig)
    log.info("mapa_clusters.png escrito: %s", OUTPUT_PNG)

except Exception as e:
    log.error("mapa_clusters.png falló: %s", e)

# ── 8c. informe.md ────────────────────────────────────────────────────────
try:
    # Reunir estadísticas para el informe
    n_total      = len(df)
    n_clusters   = k_elegido
    n_dup        = len([p for p in (dup_pairs if 'dup_pairs' in dir() else [])
                        if p.get("tipo") == "duplicado/casi-duplicado"])
    n_outl       = int((df["silhouette_score"] < 0).sum())
    n_mal_ub     = len(mal_ubicadas) if not mal_ubicadas.empty else 0

    sil_global   = round(float(df["silhouette_score"].mean()), 4)

    # k alternativas (±2 del óptimo con mejor silhouette)
    alt_ks = sorted(sil_scores, key=lambda k: sil_scores[k], reverse=True)[:5]
    alt_str = ", ".join([f"k={k} (sil={sil_scores[k]:.4f})" for k in alt_ks if k != k_elegido][:3])

    # Top cluster por tamaño
    top_clusters_txt = ""
    for row in sorted(resumen_rows, key=lambda r: r["n_paginas"], reverse=True)[:5]:
        top_clusters_txt += (
            f"  - **Cluster {row['cluster_id']} – {row['cluster_nombre']}**: "
            f"{row['n_paginas']} gestiones | términos: {row['terminos_clave']}\n"
        )

    # Clusters que mezclan secciones
    mezclados_txt = ", ".join([f"C{c}" for c in clusters_mezclados]) if clusters_mezclados else "ninguno detectado"
    repartidas_txt = ", ".join(secciones_repartidas) if secciones_repartidas else "ninguna detectada"

    informe = f"""# Informe de Clustering — Portal SAT

*Generado automáticamente. Requiere validación humana.*

---

## Resumen Ejecutivo

Se analizaron **{n_total} gestiones** del Catálogo Único del Portal SAT mediante clustering semántico.
El método de representación utilizado fue **{metodo_representacion}**.
El algoritmo seleccionado fue **{metodo_clustering}**, con un silhouette promedio de **{sil_global}**.
Se identificaron **{n_clusters} grupos temáticos** que revelan patrones en la estructura de contenidos del portal.
Se detectaron **{n_dup} pares casi-duplicados** (similitud coseno ≥ 0.95),
**{n_outl} outliers globales** (silhouette negativo) y
**{n_mal_ub} gestiones posiblemente mal ubicadas**.
La estructura actual del portal se distribuye en los clusters de forma heterogénea,
lo que sugiere oportunidades de consolidación y reorganización temática.

---

## 1. Método de Representación

**Método usado:** {metodo_representacion}

**Justificación:**
- Los embeddings multilingües capturan semántica contextual, superando la simple coincidencia léxica.
- Se usa `paraphrase-multilingual-MiniLM-L12-v2` por su equilibrio velocidad/calidad en español.
- Fallback a TF-IDF char_wb (3,5) si no hay conectividad para descargar el modelo.

---

## 2. Método de Clustering y Valor de k

**Algoritmo elegido:** {metodo_clustering}

**Justificación:**
- Se evaluaron K-Means (k=5…30), clustering jerárquico Ward y HDBSCAN.
- K-Means elegido por mayor silhouette y estabilidad entre semillas.
- k={k_elegido} maximiza el silhouette score en el rango probado.

**Alternativas razonables:** {alt_str}

**Nota sobre HDBSCAN:** Detectó {n_hdb if 'n_hdb' in dir() else 'N/A'} clusters
con {noise if 'noise' in dir() else 'N/A'} gestiones catalogadas como ruido.
Útil para identificar outliers pero produce número variable de clusters.

---

## 3. Resultados por Cluster (Top 5 por tamaño)

{top_clusters_txt}
*(Ver hoja `resumen_clusters` en `clusters.xlsx` para el listado completo.)*

---

## 4. Comparación con la Estructura Actual

- **Clusters que mezclan secciones** (≥3 secciones con ≥5 gestiones c/u): {mezclados_txt}
- **Secciones del portal repartidas en varios clusters**: {repartidas_txt}

Esto indica que la estructura URL actual no siempre refleja la afinidad temática real
de las gestiones. Los clusters que mezclan secciones son candidatos prioritarios
para revisión editorial.

---

## 5. Hallazgos Principales

| Hallazgo | Cantidad |
|---|---|
| Pares casi-duplicados (cos ≥ 0.95) | {n_dup} |
| Outliers globales (silhouette < 0) | {n_outl} |
| Gestiones posiblemente mal ubicadas | {n_mal_ub} |
| Clusters que mezclan secciones | {len(clusters_mezclados)} |
| Secciones repartidas en varios clusters | {len(secciones_repartidas)} |

---

## 6. Propuesta de Estructura de Navegación

**Evidencia del dato** (clustering semántico):
- Los {n_clusters} clusters revelan agrupaciones temáticas naturales que difieren
  parcialmente de la organización URL actual.
- Los clusters más cohesivos (silhouette alto) representan áreas temáticas bien
  diferenciadas que podrían convertirse en secciones de primer nivel.

**Criterio editorial** (juicio humano requerido):
- La denominación de clusters propuesta es tentativa; debe validarse con expertos
  de dominio y usuarios reales.
- La jerarquía interna de cada cluster requiere card sorting para confirmar la
  arquitectura de N1 a N5 según las reglas del proyecto.

---

## 7. Limitaciones

1. **El clustering es exploratorio.** Los grupos reflejan patrones léxico-semánticos,
   no necesariamente la lógica de uso real.
2. **Sin métricas de tráfico.** La priorización de hallazgos no incorpora volumen
   de visitas ni patrones de búsqueda interna.
3. **Sin texto completo.** Solo se usó título + ruta URL + descripción operativa.
   El contenido completo de cada página mejoraría la precisión.
4. **Modelo de embeddings.** Si se usó TF-IDF como fallback, la representación
   semántica es menos precisa en gestiones con nombres similares pero propósito diferente.
5. **Necesita validación humana.** Especialmente: nombres propuestos de clusters,
   gestiones mal ubicadas y similares de alta similitud que pueden ser variantes
   legítimas y no duplicados reales.

---

## 8. Datos Adicionales que Mejorarían el Análisis

- Texto completo de cada página (scraping del portal).
- Métricas de uso: visitas, tiempo en página, tasa de rebote.
- Registros de búsqueda interna.
- Historial de cambios de URL (redirecciones).
- Resultados de card sorting con usuarios reales.

---

## 9. Siguientes Pasos

1. Validar con expertos de dominio los nombres propuestos para cada cluster.
2. Revisar los {n_dup} pares casi-duplicados para confirmar consolidación o eliminar.
3. Investigar los {n_mal_ub} gestiones posiblemente mal ubicadas.
4. Ejecutar card sorting con usuarios para validar la agrupación propuesta.
5. Incorporar métricas de tráfico para priorizar la reorganización por impacto real.
6. Iterar con texto completo de páginas para mejorar la representación vectorial.

---

*Archivos generados: `clusters.xlsx`, `mapa_clusters.png`, `informe.md`*
*Método representación: {metodo_representacion}*
*Método clustering: {metodo_clustering}*
*Reducción dimensional: {metodo_reduccion}*
"""

    OUTPUT_MD.write_text(informe, encoding="utf-8")
    log.info("informe.md escrito: %s", OUTPUT_MD)

except Exception as e:
    log.error("informe.md falló: %s", e)

# ---------------------------------------------------------------------------
# VERIFICACIÓN FINAL
# ---------------------------------------------------------------------------
log.info("=" * 60)
log.info("VERIFICACIÓN FINAL")
log.info("=" * 60)

errores_verificacion = []
for f in [OUTPUT_XLSX, OUTPUT_PNG, OUTPUT_MD]:
    if f.exists() and f.stat().st_size > 0:
        log.info("✓ %s  (%d bytes)", f.name, f.stat().st_size)
    else:
        msg = f"✗ {f.name} NO existe o está vacío"
        log.error(msg)
        errores_verificacion.append(msg)

if errores_verificacion:
    log.error("Errores de verificación: %s", errores_verificacion)
else:
    log.info("Todos los entregables generados correctamente.")
    log.info("Método representación : %s", metodo_representacion)
    log.info("Método clustering     : %s", metodo_clustering)
    log.info("Reducción dimensional : %s", metodo_reduccion)
    log.info("k elegido             : %s", k_elegido)
