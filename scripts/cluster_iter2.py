"""
cluster_iter2.py
================
Iteración 2 — Clustering semántico con texto completo del Portal SAT.

Entrada:
    salida/scraped_content.csv
    Columnas: titulo, url, texto_extraido, longitud_texto, status_http

Salida:
    salida/clusters_texto_completo.xlsx   — Dataset enriquecido con cluster_v2
    salida/embeddings_v2.pkl              — Embeddings numpy serializados

Características:
  - Columna texto_analisis = título + url_limpia + texto_extraído truncado a 500 palabras
  - Embeddings: paraphrase-multilingual-MiniLM-L12-v2 (batch 32)
  - K-Means k=8, random_state=42
  - Outliers v2 = distancia_centroide > percentil 90
  - Comparativa cluster_v1 desde salida/clusters.xlsx si está disponible
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
INPUT_CSV    = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida\scraped_content.csv")
OUTPUT_DIR   = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida")
OUTPUT_XLSX  = OUTPUT_DIR / "clusters_texto_completo.xlsx"
OUTPUT_PKL   = OUTPUT_DIR / "embeddings_v2.pkl"

# Referencia Iter 1
CLUSTERS_V1_XLSX = OUTPUT_DIR / "clusters.xlsx"

BASE_URL     = "https://portal.sat.gob.gt"
MAX_PALABRAS = 500        # truncado del texto_extraido
K_MEANS_K    = 8
RANDOM_STATE = 42
BATCH_SIZE   = 32
MODEL_NAME   = "paraphrase-multilingual-MiniLM-L12-v2"
OUTLIER_PERCENTIL = 90

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# PASO 1 — LECTURA DEL CSV DE SCRAPING
# ---------------------------------------------------------------------------

def cargar_scraped() -> pd.DataFrame:
    log.info("Leyendo: %s", INPUT_CSV)
    df = pd.read_csv(INPUT_CSV, encoding="utf-8")
    log.info("Filas cargadas: %d", len(df))

    # Normalizar tipos
    for col in ["titulo", "url", "texto_extraido", "status_http"]:
        if col not in df.columns:
            raise ValueError(f"Columna requerida ausente en scraped_content.csv: '{col}'")
        df[col] = df[col].fillna("").astype(str).str.strip()

    df["longitud_texto"] = pd.to_numeric(df["longitud_texto"], errors="coerce").fillna(0).astype(int)
    return df.reset_index(drop=True)


# ---------------------------------------------------------------------------
# PASO 2 — CONSTRUCCIÓN DE texto_analisis
# ---------------------------------------------------------------------------

def truncar_texto(texto: str, max_palabras: int) -> str:
    """Retorna las primeras max_palabras palabras del texto."""
    palabras = texto.split()
    if len(palabras) <= max_palabras:
        return texto
    return " ".join(palabras[:max_palabras])


def limpiar_url(url: str) -> str:
    """Elimina el dominio base y normaliza el path."""
    limpia = url.replace(BASE_URL, "").strip()
    # Reemplazar separadores de path por espacios para facilitar embeddings
    limpia = re.sub(r"[/\-_]", " ", limpia)
    limpia = re.sub(r"\s+", " ", limpia).strip()
    return limpia


def construir_texto_analisis(df: pd.DataFrame) -> pd.Series:
    """
    Formato: [titulo] + " " + [url_limpia] + " " + [texto_extraido truncado a 500 palabras]
    Si texto_extraido está vacío, usa solo título + url_limpia.
    """
    resultados = []
    for _, row in df.iterrows():
        titulo    = row["titulo"].strip()
        url_limpia = limpiar_url(row["url"])
        texto     = row["texto_extraido"].strip()

        if texto:
            texto_truncado = truncar_texto(texto, MAX_PALABRAS)
            analisis = f"{titulo} {url_limpia} {texto_truncado}"
        else:
            analisis = f"{titulo} {url_limpia}"

        # Normalizar espacios múltiples
        analisis = re.sub(r"\s+", " ", analisis).strip()
        resultados.append(analisis)

    return pd.Series(resultados, index=df.index)


# ---------------------------------------------------------------------------
# PASO 3 — GENERACIÓN DE EMBEDDINGS
# ---------------------------------------------------------------------------

def generar_embeddings(textos: list[str]) -> np.ndarray:
    log.info("Cargando modelo sentence-transformers: %s", MODEL_NAME)
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
# PASO 4 — K-MEANS CLUSTERING
# ---------------------------------------------------------------------------

def ejecutar_kmeans(X: np.ndarray) -> tuple[np.ndarray, float, KMeans]:
    """
    Ejecuta K-Means con k=8, random_state=42.
    Retorna (labels, silhouette_score, modelo_kmeans).
    """
    log.info("Ejecutando K-Means k=%d, random_state=%d …", K_MEANS_K, RANDOM_STATE)
    km = KMeans(n_clusters=K_MEANS_K, random_state=RANDOM_STATE, n_init=20)
    labels = km.fit_predict(X)

    sil = silhouette_score(X, labels, sample_size=min(500, len(X)), random_state=RANDOM_STATE)
    log.info("Silhouette Score v2: %.4f", sil)
    return labels, sil, km


def calcular_distancias_centroide(X: np.ndarray, labels: np.ndarray, km: KMeans) -> np.ndarray:
    """Distancia euclidiana de cada punto al centroide de su cluster asignado."""
    centroides = km.cluster_centers_
    distancias = np.zeros(len(X), dtype=np.float32)
    for k in range(K_MEANS_K):
        mask = labels == k
        if mask.sum() == 0:
            continue
        dists = np.linalg.norm(X[mask] - centroides[k], axis=1)
        distancias[mask] = dists.astype(np.float32)
    return distancias


def detectar_outliers(distancias: np.ndarray, percentil: int = OUTLIER_PERCENTIL) -> np.ndarray:
    """Retorna array booleano: True si distancia > percentil especificado."""
    umbral = np.percentile(distancias, percentil)
    log.info("Umbral outlier (p%d): %.4f", percentil, umbral)
    return distancias > umbral


# ---------------------------------------------------------------------------
# PASO 5 — CARGA DE CLUSTER_V1 (COMPARATIVA)
# ---------------------------------------------------------------------------

def cargar_cluster_v1(urls: pd.Series) -> pd.Series | None:
    """
    Busca clusters de Iter 1 en salida/.
    Estrategia:
      1. clusters.xlsx hoja 'paginas' columna 'cluster_id'
      2. Cualquier .xlsx o .csv con columna 'cluster_v1' o 'cluster'
    Retorna Serie indexada por posición (mismo orden que urls) o None si no hay datos.
    """
    # Estrategia 1: clusters.xlsx
    if CLUSTERS_V1_XLSX.exists():
        try:
            df_v1 = pd.read_excel(CLUSTERS_V1_XLSX, sheet_name="paginas")
            if "cluster_id" in df_v1.columns and "url" in df_v1.columns:
                mapa = df_v1.set_index("url")["cluster_id"].to_dict()
                resultado = urls.map(mapa)
                n_encontrados = resultado.notna().sum()
                log.info(
                    "cluster_v1 cargado desde clusters.xlsx: %d/%d URLs encontradas",
                    n_encontrados, len(urls),
                )
                if n_encontrados > 0:
                    return resultado
        except Exception as exc:
            log.warning("No se pudo leer clusters.xlsx: %s", exc)

    # Estrategia 2: buscar cualquier archivo con columna cluster_v1 o cluster
    candidatos = list(OUTPUT_DIR.glob("*.xlsx")) + list(OUTPUT_DIR.glob("*.csv"))
    for archivo in candidatos:
        if archivo.name == "clusters_texto_completo.xlsx":
            continue
        try:
            if archivo.suffix == ".xlsx":
                df_c = pd.read_excel(archivo)
            else:
                df_c = pd.read_csv(archivo)

            # Buscar columna de cluster
            col_cluster = None
            for col in df_c.columns:
                col_l = col.lower()
                if col_l in ("cluster_v1", "cluster_v2", "cluster", "cluster_id"):
                    col_cluster = col
                    break

            if col_cluster is None:
                continue

            # Buscar columna de URL
            col_url = None
            for col in df_c.columns:
                if col.lower() in ("url", "url portal sat"):
                    col_url = col
                    break

            if col_url is None:
                continue

            mapa = df_c.set_index(col_url)[col_cluster].to_dict()
            resultado = urls.map(mapa)
            n_encontrados = resultado.notna().sum()
            if n_encontrados > 0:
                log.info(
                    "cluster_v1 encontrado en '%s' columna '%s': %d URLs",
                    archivo.name, col_cluster, n_encontrados,
                )
                return resultado
        except Exception:
            continue

    log.info("No se encontraron datos de cluster_v1 — columna omitida del Excel")
    return None


# ---------------------------------------------------------------------------
# PASO 6 — SERIALIZACIÓN DE EMBEDDINGS
# ---------------------------------------------------------------------------

def guardar_embeddings(embeddings: np.ndarray) -> None:
    with open(OUTPUT_PKL, "wb") as f:
        pickle.dump(embeddings, f, protocol=pickle.HIGHEST_PROTOCOL)
    log.info("Embeddings guardados: %s (shape %s)", OUTPUT_PKL, embeddings.shape)


# ---------------------------------------------------------------------------
# PASO 7 — GENERACIÓN DEL EXCEL
# ---------------------------------------------------------------------------

def generar_excel(
    df: pd.DataFrame,
    labels_v2: np.ndarray,
    distancias: np.ndarray,
    outliers: np.ndarray,
    serie_v1: pd.Series | None,
    sil_v2: float,
) -> None:
    """Escribe clusters_texto_completo.xlsx con las columnas requeridas."""

    # Previews
    texto_extraido_preview = df["texto_extraido"].str[:200]
    texto_analisis_preview = df["texto_analisis"].str[:300]

    # Construir DataFrame de salida
    cols = {
        "titulo":                  df["titulo"],
        "url":                     df["url"],
        "texto_extraido_preview":  texto_extraido_preview,
        "longitud_texto":          df["longitud_texto"],
        "texto_analisis_preview":  texto_analisis_preview,
        "cluster_v2":              labels_v2.astype(int),
        "distancia_centroide":     np.round(distancias.astype(float), 6),
        "es_outlier_v2":           outliers,
    }

    if serie_v1 is not None:
        cols["cluster_v1"] = serie_v1.values

    df_salida = pd.DataFrame(cols)

    # Reordenar columnas para que cluster_v1 quede después de cluster_v2
    columnas_base = [
        "titulo", "url", "texto_extraido_preview", "longitud_texto",
        "texto_analisis_preview", "cluster_v2",
    ]
    if serie_v1 is not None:
        columnas_base.append("cluster_v1")
    columnas_base += ["distancia_centroide", "es_outlier_v2"]
    df_salida = df_salida[columnas_base]

    # ── Hoja 1: dataset ────────────────────────────────────────────────────
    with pd.ExcelWriter(OUTPUT_XLSX, engine="openpyxl") as writer:
        df_salida.to_excel(writer, sheet_name="gestiones_v2", index=False)

        # ── Hoja 2: resumen por cluster ────────────────────────────────────
        resumen_rows = []
        for k in sorted(range(K_MEANS_K)):
            mask = labels_v2 == k
            n = int(mask.sum())
            dists_k = distancias[mask]
            # Top 10 más representativos (menor distancia al centroide)
            idx_cluster = np.where(mask)[0]
            orden = idx_cluster[np.argsort(dists_k)][:10]
            top10_titulos = [
                f"{df.iloc[i]['titulo'][:80]} | {df.iloc[i]['url'][:80]}"
                for i in orden
            ]
            resumen_rows.append({
                "cluster_v2":          k,
                "n_gestiones":         n,
                "cohesion_promedio":   round(float(dists_k.mean()), 4) if n > 0 else 0,
                "n_outliers":          int((distancias[mask] > np.percentile(distancias, OUTLIER_PERCENTIL)).sum()),
                "top10_representativos": "\n".join(f"{j+1}. {t}" for j, t in enumerate(top10_titulos)),
            })
        pd.DataFrame(resumen_rows).to_excel(writer, sheet_name="resumen_clusters_v2", index=False)

        # ── Hoja 3: outliers ───────────────────────────────────────────────
        df_outliers = df_salida[df_salida["es_outlier_v2"]].copy()
        df_outliers.to_excel(writer, sheet_name="outliers_v2", index=False)

        # ── Hoja 4: sin texto ──────────────────────────────────────────────
        df_sin_texto = df[df["longitud_texto"] == 0][["titulo", "url", "status_http"]].copy()
        df_sin_texto.to_excel(writer, sheet_name="sin_texto", index=False)

        # ── Hoja 5: métricas ───────────────────────────────────────────────
        metricas = {"metrica": ["silhouette_score_v2", "k_clusters", "outlier_percentil", "n_total"],
                    "valor":   [round(sil_v2, 4), K_MEANS_K, OUTLIER_PERCENTIL, len(df)]}
        pd.DataFrame(metricas).to_excel(writer, sheet_name="metricas_v2", index=False)

    log.info("Excel escrito: %s (%d filas)", OUTPUT_XLSX, len(df_salida))


# ---------------------------------------------------------------------------
# PUNTO DE ENTRADA
# ---------------------------------------------------------------------------

def main() -> None:
    log.info("=" * 60)
    log.info("Iteración 2 — Clustering con texto completo — Portal SAT")
    log.info("=" * 60)

    # 1. Cargar CSV de scraping
    df = cargar_scraped()

    # 2. Construir columna texto_analisis
    log.info("Construyendo columna texto_analisis …")
    df["texto_analisis"] = construir_texto_analisis(df)
    log.info(
        "texto_analisis listo. Registros con texto completo: %d / %d",
        (df["longitud_texto"] > 0).sum(),
        len(df),
    )

    # 3. Generar embeddings
    textos = df["texto_analisis"].tolist()
    embeddings = generar_embeddings(textos)

    # 4. K-Means clustering
    labels_v2, sil_v2, km = ejecutar_kmeans(embeddings)
    distancias = calcular_distancias_centroide(embeddings, labels_v2, km)
    outliers   = detectar_outliers(distancias)

    log.info("Outliers v2 (dist > p%d): %d / %d", OUTLIER_PERCENTIL, int(outliers.sum()), len(df))

    # 5. Cargar cluster_v1 si existe
    serie_v1 = cargar_cluster_v1(df["url"])

    # 6. Guardar embeddings
    guardar_embeddings(embeddings)

    # 7. Generar Excel
    generar_excel(df, labels_v2, distancias, outliers, serie_v1, sil_v2)

    # Resumen final
    log.info("=" * 60)
    log.info("RESUMEN FINAL")
    log.info("=" * 60)
    log.info("Total gestiones procesadas:    %d", len(df))
    log.info("Con texto extraído:            %d", int((df["longitud_texto"] > 0).sum()))
    log.info("Sin texto (errores/vacío):     %d", int((df["longitud_texto"] == 0).sum()))
    log.info("Silhouette Score v2:           %.4f", sil_v2)
    log.info("Outliers v2 (p%d):             %d", OUTLIER_PERCENTIL, int(outliers.sum()))
    log.info("cluster_v1 disponible:         %s", "Sí" if serie_v1 is not None else "No")
    log.info("Salida Excel:                  %s", OUTPUT_XLSX)
    log.info("Salida embeddings PKL:         %s", OUTPUT_PKL)
    log.info("=" * 60)


if __name__ == "__main__":
    main()
