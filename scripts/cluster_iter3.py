"""
cluster_iter3.py
================
Iteración 3 — Re-clustering semántico con texto limpio y k óptimo.

Entrada:
  salida/scraped_content_clean.csv
  salida/k_optimo.txt
  salida/clusters_texto_completo.xlsx  (para comparativa v2)
Salida:
  salida/clusters_iter3.xlsx
  salida/embeddings_v3.pkl
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


for _pkg in [
    "sentence-transformers",
    "scikit-learn",
    "pandas",
    "openpyxl",
    "numpy",
]:
    _install(_pkg)

# ---------------------------------------------------------------------------
# IMPORTS
# ---------------------------------------------------------------------------
import logging
import pickle
import re
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# ---------------------------------------------------------------------------
# CONFIGURACIÓN
# ---------------------------------------------------------------------------
INPUT_CSV         = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida\scraped_content_clean.csv")
K_OPTIMO_TXT      = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida\k_optimo.txt")
CLUSTERS_V2_XLSX  = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida\clusters_texto_completo.xlsx")

OUTPUT_DIR        = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida")
OUTPUT_XLSX       = OUTPUT_DIR / "clusters_iter3.xlsx"
OUTPUT_PKL        = OUTPUT_DIR / "embeddings_v3.pkl"

BASE_URL          = "https://portal.sat.gob.gt"
MAX_PALABRAS      = 800
BATCH_SIZE        = 32
MODEL_NAME        = "paraphrase-multilingual-MiniLM-L12-v2"
RANDOM_STATE      = 42
OUTLIER_PERCENTIL = 90

# Silhouette v1 conocido (solo título + URL, k=8)
SIL_V1_CONOCIDO   = 0.0889
N_OUTLIERS_V2_CONOCIDO = 54

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# PASO 1 — LECTURA DEL CSV LIMPIO
# ---------------------------------------------------------------------------

def cargar_csv() -> pd.DataFrame:
    log.info("Leyendo: %s", INPUT_CSV)
    df = pd.read_csv(INPUT_CSV, encoding="utf-8")
    log.info("Filas cargadas: %d", len(df))

    for col in ["titulo", "url"]:
        if col not in df.columns:
            raise ValueError(f"Columna requerida ausente: '{col}'")
        df[col] = df[col].fillna("").astype(str).str.strip()

    if "texto_limpio" not in df.columns:
        df["texto_limpio"] = ""
    else:
        df["texto_limpio"] = df["texto_limpio"].fillna("").astype(str).str.strip()

    if "texto_extraido" in df.columns:
        df["texto_extraido"] = df["texto_extraido"].fillna("").astype(str).str.strip()
    else:
        df["texto_extraido"] = ""

    if "longitud_limpia" not in df.columns:
        df["longitud_limpia"] = df["texto_limpio"].str.len()
    else:
        df["longitud_limpia"] = pd.to_numeric(df["longitud_limpia"], errors="coerce").fillna(0).astype(int)

    return df.reset_index(drop=True)


# ---------------------------------------------------------------------------
# PASO 2 — LEER K ÓPTIMO
# ---------------------------------------------------------------------------

def leer_k_optimo() -> int:
    if K_OPTIMO_TXT.exists():
        try:
            k = int(K_OPTIMO_TXT.read_text(encoding="utf-8").strip())
            log.info("k_optimo leído desde archivo: %d", k)
            return k
        except (ValueError, OSError) as exc:
            log.warning("Error leyendo k_optimo.txt: %s. Usando fallback k=8.", exc)
    else:
        log.warning("k_optimo.txt no encontrado. Usando fallback k=8.")
    return 8


# ---------------------------------------------------------------------------
# PASO 3 — CONSTRUCCIÓN DE texto_analisis
# ---------------------------------------------------------------------------

def limpiar_url(url: str) -> str:
    limpia = url.replace(BASE_URL, "").strip()
    limpia = re.sub(r"[/\-_]", " ", limpia)
    limpia = re.sub(r"\s+", " ", limpia).strip()
    return limpia


def truncar_texto(texto: str, max_palabras: int) -> str:
    palabras = texto.split()
    if len(palabras) <= max_palabras:
        return texto
    return " ".join(palabras[:max_palabras])


def construir_texto_analisis(df: pd.DataFrame) -> list[str]:
    resultados = []
    for _, row in df.iterrows():
        titulo     = row["titulo"].strip()
        url_limpia = limpiar_url(row["url"])

        texto = row["texto_limpio"].strip()
        if not texto:
            texto = row["texto_extraido"].strip()
        if not texto:
            texto = titulo

        analisis = f"{titulo} {url_limpia} {texto}"
        analisis = re.sub(r"\s+", " ", analisis).strip()
        analisis = truncar_texto(analisis, MAX_PALABRAS)
        resultados.append(analisis)
    return resultados


# ---------------------------------------------------------------------------
# PASO 4 — GENERACIÓN DE EMBEDDINGS
# ---------------------------------------------------------------------------

def generar_embeddings(textos: list[str]) -> np.ndarray:
    log.info("Cargando modelo: %s", MODEL_NAME)
    from sentence_transformers import SentenceTransformer
    modelo = SentenceTransformer(MODEL_NAME)
    log.info("Generando embeddings para %d textos (batch_size=%d) …", len(textos), BATCH_SIZE)
    embeddings = modelo.encode(
        textos,
        batch_size=BATCH_SIZE,
        show_progress_bar=True,
        convert_to_numpy=True,
    )
    embeddings = np.array(embeddings, dtype=np.float32)
    log.info("Embeddings generados: shape %s", embeddings.shape)
    return embeddings


# ---------------------------------------------------------------------------
# PASO 5 — KMEANS + MÉTRICAS
# ---------------------------------------------------------------------------

def ejecutar_kmeans(X: np.ndarray, k: int) -> tuple[np.ndarray, float, KMeans]:
    log.info("Ejecutando K-Means k=%d, random_state=%d …", k, RANDOM_STATE)
    km = KMeans(n_clusters=k, random_state=RANDOM_STATE, n_init=20)
    labels = km.fit_predict(X)
    sil = silhouette_score(
        X, labels,
        sample_size=min(500, len(X)),
        random_state=RANDOM_STATE,
    )
    log.info("Silhouette Score v3: %.4f", sil)
    return labels, sil, km


def calcular_distancias_centroide(X: np.ndarray, labels: np.ndarray, km: KMeans) -> np.ndarray:
    centroides = km.cluster_centers_
    distancias = np.zeros(len(X), dtype=np.float32)
    for k in range(len(centroides)):
        mask = labels == k
        if mask.sum() == 0:
            continue
        dists = np.linalg.norm(X[mask] - centroides[k], axis=1)
        distancias[mask] = dists.astype(np.float32)
    return distancias


def detectar_outliers(distancias: np.ndarray) -> np.ndarray:
    umbral = np.percentile(distancias, OUTLIER_PERCENTIL)
    log.info("Umbral outlier (p%d): %.4f", OUTLIER_PERCENTIL, umbral)
    return distancias > umbral


# ---------------------------------------------------------------------------
# PASO 6 — TF-IDF POR CLUSTER PARA ETIQUETAS TEMÁTICAS
# ---------------------------------------------------------------------------

def calcular_etiquetas_tfidf(df: pd.DataFrame, labels: np.ndarray, k: int) -> dict[int, str]:
    """
    Para cada cluster, concatena los texto_limpio de sus gestiones y extrae
    los top-3 términos/bigramas por TF-IDF.
    Retorna dict {cluster_id: 'term1, term2, term3'}.
    """
    from sklearn.feature_extraction.text import TfidfVectorizer

    corpus = []
    cluster_ids = []
    for cid in range(k):
        mask = labels == cid
        textos_cluster = df[mask]["texto_limpio"].tolist()
        doc = " ".join([t for t in textos_cluster if t.strip()])
        if not doc.strip():
            doc = " ".join(df[mask]["titulo"].tolist())
        corpus.append(doc)
        cluster_ids.append(cid)

    if not any(doc.strip() for doc in corpus):
        return {cid: "sin etiqueta" for cid in cluster_ids}

    tfidf = TfidfVectorizer(ngram_range=(1, 2), max_features=1000, min_df=1)
    try:
        matriz = tfidf.fit_transform(corpus)
    except ValueError:
        return {cid: "sin etiqueta" for cid in cluster_ids}

    terminos = tfidf.get_feature_names_out()
    etiquetas = {}
    for i, cid in enumerate(cluster_ids):
        fila = np.asarray(matriz[i].todense()).flatten()
        top_idx = fila.argsort()[-3:][::-1]
        top_terminos = [terminos[j] for j in top_idx if fila[j] > 0]
        etiquetas[cid] = ", ".join(top_terminos) if top_terminos else "sin etiqueta"
    return etiquetas


# ---------------------------------------------------------------------------
# PASO 7 — CARGA DE DATOS V2 PARA COMPARATIVA
# ---------------------------------------------------------------------------

def cargar_cluster_v2(df: pd.DataFrame) -> pd.Series | None:
    """
    Carga cluster_v2 desde clusters_texto_completo.xlsx hoja 'gestiones_v2'.
    Hace merge por URL. Retorna Serie con cluster_v2 o None.
    """
    if not CLUSTERS_V2_XLSX.exists():
        log.info("clusters_texto_completo.xlsx no encontrado. Sin datos v2.")
        return None

    try:
        df_v2 = pd.read_excel(CLUSTERS_V2_XLSX, sheet_name="gestiones_v2")
        if "url" not in df_v2.columns or "cluster_v2" not in df_v2.columns:
            log.warning("Hoja 'gestiones_v2' sin columnas esperadas.")
            return None

        mapa = df_v2.set_index("url")["cluster_v2"].to_dict()
        serie = df["url"].map(mapa)
        n_encontrados = serie.notna().sum()
        log.info("cluster_v2 cargado: %d/%d URLs encontradas", n_encontrados, len(df))
        return serie
    except Exception as exc:
        log.warning("No se pudo cargar cluster_v2: %s", exc)
        return None


def leer_sil_v2() -> float | None:
    """Lee el Silhouette Score v2 desde la hoja metricas_v2 del Excel v2."""
    if not CLUSTERS_V2_XLSX.exists():
        return None
    try:
        df_met = pd.read_excel(CLUSTERS_V2_XLSX, sheet_name="metricas_v2")
        mapa = df_met.set_index("metrica")["valor"].to_dict()
        val = mapa.get("silhouette_score_v2")
        return float(val) if val is not None else None
    except Exception:
        return None


# ---------------------------------------------------------------------------
# PASO 8 — SERIALIZACIÓN DE EMBEDDINGS
# ---------------------------------------------------------------------------

def guardar_embeddings(embeddings: np.ndarray) -> None:
    with open(OUTPUT_PKL, "wb") as f:
        pickle.dump(embeddings, f, protocol=pickle.HIGHEST_PROTOCOL)
    log.info("Embeddings v3 guardados: %s (shape %s)", OUTPUT_PKL, embeddings.shape)


# ---------------------------------------------------------------------------
# PASO 9 — GENERACIÓN DEL EXCEL
# ---------------------------------------------------------------------------

def generar_excel(
    df: pd.DataFrame,
    labels_v3: np.ndarray,
    distancias: np.ndarray,
    outliers: np.ndarray,
    serie_v2: pd.Series | None,
    sil_v3: float,
    sil_v2: float | None,
    etiquetas: dict[int, str],
    k: int,
) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # ── Hoja 1: gestiones_v3 ──────────────────────────────────────────────
    texto_limpio_preview = df["texto_limpio"].str[:200]

    cols: dict = {
        "titulo":                 df["titulo"],
        "url":                    df["url"],
        "texto_limpio":           texto_limpio_preview,
        "longitud_limpia":        df["longitud_limpia"],
        "cluster_v3":             labels_v3.astype(int),
        "distancia_centroide_v3": np.round(distancias.astype(float), 6),
        "es_outlier_v3":          outliers,
    }
    if serie_v2 is not None:
        cols["cluster_v2"] = serie_v2.values

    df_sal = pd.DataFrame(cols)

    # Reordenar para que cluster_v2 esté antes de cluster_v3
    col_order = ["titulo", "url", "texto_limpio", "longitud_limpia"]
    if serie_v2 is not None:
        col_order.append("cluster_v2")
    col_order += ["cluster_v3", "distancia_centroide_v3", "es_outlier_v3"]
    df_sal = df_sal[col_order]

    # ── Hoja 2: resumen_clusters_v3 ───────────────────────────────────────
    resumen_rows = []
    for cid in range(k):
        mask = labels_v3 == cid
        n = int(mask.sum())
        dists_k = distancias[mask]
        idx_cluster = np.where(mask)[0]
        orden = idx_cluster[np.argsort(dists_k)][:10]
        top10 = [
            f"{df.iloc[i]['titulo'][:80]}"
            for i in orden
        ]
        resumen_rows.append({
            "cluster_v3":             cid,
            "etiqueta_tfidf":         etiquetas.get(cid, ""),
            "n_gestiones":            n,
            "cohesion_promedio":      round(float(dists_k.mean()), 4) if n > 0 else 0,
            "n_outliers":             int(outliers[mask].sum()),
            "top10_representativos":  "\n".join(f"{j+1}. {t}" for j, t in enumerate(top10)),
        })
    df_resumen = pd.DataFrame(resumen_rows)

    # ── Hoja 3: outliers_v3 ───────────────────────────────────────────────
    df_outliers = df_sal[df_sal["es_outlier_v3"]].copy()

    # ── Hoja 4: cambios_v2_v3 ─────────────────────────────────────────────
    if serie_v2 is not None and "cluster_v2" in df_sal.columns:
        df_cambios = df_sal[
            df_sal["cluster_v2"].notna()
            & (df_sal["cluster_v2"].astype(float).astype("Int64") != df_sal["cluster_v3"])
        ][["titulo", "url", "cluster_v2", "cluster_v3"]].copy()
    else:
        df_cambios = pd.DataFrame(columns=["titulo", "url", "cluster_v2", "cluster_v3"])

    n_cambios = len(df_cambios)
    log.info("Gestiones que cambiaron de cluster (v2→v3): %d", n_cambios)

    # ── Hoja 5: metricas_v3 ───────────────────────────────────────────────
    n_outliers_v3 = int(outliers.sum())
    n_total = len(df)

    metricas_filas = [
        {"metrica": "silhouette_score_v3",     "valor": round(sil_v3, 6)},
        {"metrica": "silhouette_score_v2",     "valor": round(sil_v2, 6) if sil_v2 is not None else "N/D"},
        {"metrica": "silhouette_score_v1",     "valor": SIL_V1_CONOCIDO},
        {"metrica": "k_clusters",              "valor": k},
        {"metrica": "outlier_percentil",       "valor": OUTLIER_PERCENTIL},
        {"metrica": "n_total",                 "valor": n_total},
        {"metrica": "n_outliers_v3",           "valor": n_outliers_v3},
        {"metrica": "n_outliers_v2",           "valor": N_OUTLIERS_V2_CONOCIDO},
        {"metrica": "n_cambios_cluster",       "valor": n_cambios},
    ]
    df_metricas = pd.DataFrame(metricas_filas)

    # Escribir Excel
    with pd.ExcelWriter(OUTPUT_XLSX, engine="openpyxl") as writer:
        df_sal.to_excel(writer, sheet_name="gestiones_v3", index=False)
        df_resumen.to_excel(writer, sheet_name="resumen_clusters_v3", index=False)
        df_outliers.to_excel(writer, sheet_name="outliers_v3", index=False)
        df_cambios.to_excel(writer, sheet_name="cambios_v2_v3", index=False)
        df_metricas.to_excel(writer, sheet_name="metricas_v3", index=False)

    log.info("Excel v3 escrito: %s (%d filas)", OUTPUT_XLSX, len(df_sal))


# ---------------------------------------------------------------------------
# PUNTO DE ENTRADA
# ---------------------------------------------------------------------------

def main() -> None:
    log.info("=" * 60)
    log.info("Iteración 3 — Re-clustering semántico — Portal SAT")
    log.info("=" * 60)

    # 1. Cargar CSV limpio
    df = cargar_csv()

    # 2. Leer k óptimo
    k = leer_k_optimo()

    # 3. Construir texto_analisis
    log.info("Construyendo texto_analisis …")
    textos = construir_texto_analisis(df)

    # 4. Generar embeddings
    embeddings = generar_embeddings(textos)

    # 5. K-Means + métricas
    labels_v3, sil_v3, km = ejecutar_kmeans(embeddings, k)
    distancias = calcular_distancias_centroide(embeddings, labels_v3, km)
    outliers   = detectar_outliers(distancias)
    log.info("Outliers v3 (dist > p%d): %d / %d", OUTLIER_PERCENTIL, int(outliers.sum()), len(df))

    # 6. Etiquetas TF-IDF por cluster
    etiquetas = calcular_etiquetas_tfidf(df, labels_v3, k)
    for cid, etiq in etiquetas.items():
        log.info("  Cluster %d → %s", cid, etiq)

    # 7. Cargar datos v2 para comparativa
    serie_v2 = cargar_cluster_v2(df)
    sil_v2   = leer_sil_v2()

    # 8. Guardar embeddings
    guardar_embeddings(embeddings)

    # 9. Generar Excel
    generar_excel(
        df, labels_v3, distancias, outliers,
        serie_v2, sil_v3, sil_v2, etiquetas, k,
    )

    # Resumen final
    n_cambios = 0
    if serie_v2 is not None:
        n_cambios = int(
            (serie_v2.notna() & (serie_v2.astype(float).astype("Int64") != pd.Series(labels_v3.astype(int)))).sum()
        )

    log.info("=" * 60)
    log.info("RESUMEN COMPARATIVO v1 / v2 / v3")
    log.info("=" * 60)
    log.info("Silhouette v1 (título+URL, k=8):   %.4f", SIL_V1_CONOCIDO)
    if sil_v2 is not None:
        log.info("Silhouette v2 (texto completo, k=8): %.4f", sil_v2)
    else:
        log.info("Silhouette v2:                        N/D")
    log.info("Silhouette v3 (texto limpio, k=%d): %.4f", k, sil_v3)
    log.info("k óptimo:                            %d", k)
    log.info("Outliers v2 (conocido):              %d", N_OUTLIERS_V2_CONOCIDO)
    log.info("Outliers v3 (p%d):                   %d", OUTLIER_PERCENTIL, int(outliers.sum()))
    log.info("Gestiones que cambiaron de cluster:  %d", n_cambios)
    log.info("Total gestiones:                     %d", len(df))
    log.info("=" * 60)
    log.info("Excel v3:     %s", OUTPUT_XLSX)
    log.info("Embeddings:   %s", OUTPUT_PKL)
    log.info("=" * 60)


if __name__ == "__main__":
    main()
