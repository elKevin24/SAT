"""
find_k_optimal.py
=================
Iteración 3 — Búsqueda del k óptimo para re-clustering del Portal SAT.

Entrada:  salida/scraped_content_clean.csv
Salida:
  salida/metricas_k.csv
  salida/elbow_curve.png
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
    "numpy",
    "matplotlib",
]:
    _install(_pkg)

# ---------------------------------------------------------------------------
# IMPORTS
# ---------------------------------------------------------------------------
import logging
import re
from pathlib import Path

import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# CONFIGURACIÓN
# ---------------------------------------------------------------------------
INPUT_CSV  = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida\scraped_content_clean.csv")
OUTPUT_DIR = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida")
OUTPUT_CSV_METRICAS = OUTPUT_DIR / "metricas_k.csv"
OUTPUT_PNG          = OUTPUT_DIR / "elbow_curve.png"
OUTPUT_K_OPTIMO     = OUTPUT_DIR / "k_optimo.txt"

BASE_URL   = "https://portal.sat.gob.gt"
MAX_PALABRAS = 800
BATCH_SIZE   = 32
MODEL_NAME   = "paraphrase-multilingual-MiniLM-L12-v2"
RANDOM_STATE = 42
K_RANGE      = list(range(6, 15))   # [6, 7, 8, 9, 10, 11, 12, 13, 14]

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

    # texto_limpio con fallback a texto_extraido, luego a titulo
    if "texto_limpio" not in df.columns:
        df["texto_limpio"] = ""
    else:
        df["texto_limpio"] = df["texto_limpio"].fillna("").astype(str).str.strip()

    if "texto_extraido" in df.columns:
        df["texto_extraido"] = df["texto_extraido"].fillna("").astype(str).str.strip()
    else:
        df["texto_extraido"] = ""

    return df.reset_index(drop=True)


# ---------------------------------------------------------------------------
# PASO 2 — CONSTRUCCIÓN DE texto_analisis
# ---------------------------------------------------------------------------

def limpiar_url(url: str) -> str:
    """Elimina el dominio base y normaliza el path a espacios."""
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
    """
    Construye texto_analisis: titulo + url_limpia + texto_limpio
    con fallback a texto_extraido y luego a titulo si los anteriores están vacíos.
    Truncado a MAX_PALABRAS.
    """
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
# PASO 4 — EVALUACIÓN DE K
# ---------------------------------------------------------------------------

def evaluar_k(embeddings: np.ndarray) -> pd.DataFrame:
    """
    Ejecuta KMeans para cada k en K_RANGE y calcula:
      silhouette, inertia, davies_bouldin.
    Retorna DataFrame con los resultados.
    """
    from sklearn.cluster import KMeans
    from sklearn.metrics import davies_bouldin_score, silhouette_score

    filas = []
    for k in K_RANGE:
        log.info("Evaluando k=%d …", k)
        km = KMeans(n_clusters=k, random_state=RANDOM_STATE, n_init=20)
        labels = km.fit_predict(embeddings)

        sil = silhouette_score(
            embeddings, labels,
            sample_size=min(500, len(embeddings)),
            random_state=RANDOM_STATE,
        )
        inertia = km.inertia_
        db = davies_bouldin_score(embeddings, labels)

        print(
            f"k={k}: silhouette={sil:.4f}, "
            f"inertia={inertia:.2f}, "
            f"davies_bouldin={db:.4f}"
        )
        filas.append({
            "k":              k,
            "silhouette":     round(sil, 6),
            "inertia":        round(inertia, 4),
            "davies_bouldin": round(db, 6),
        })

    return pd.DataFrame(filas)


# ---------------------------------------------------------------------------
# PASO 5 — GUARDAR MÉTRICAS Y DETERMINAR K ÓPTIMO
# ---------------------------------------------------------------------------

def guardar_metricas(df_metricas: pd.DataFrame) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    df_metricas.to_csv(OUTPUT_CSV_METRICAS, index=False, encoding="utf-8")
    log.info("Métricas guardadas: %s", OUTPUT_CSV_METRICAS)


def determinar_k_optimo(df_metricas: pd.DataFrame) -> int:
    """Retorna el k con Silhouette Score máximo."""
    idx_max = df_metricas["silhouette"].idxmax()
    k_optimo = int(df_metricas.loc[idx_max, "k"])
    max_sil  = float(df_metricas.loc[idx_max, "silhouette"])

    print("\n" + "=" * 60)
    print(f"K ÓPTIMO RECOMENDADO: {k_optimo} (Silhouette: {max_sil:.4f})")
    print("=" * 60 + "\n")

    OUTPUT_K_OPTIMO.write_text(str(k_optimo), encoding="utf-8")
    log.info("k_optimo guardado en: %s", OUTPUT_K_OPTIMO)

    return k_optimo


# ---------------------------------------------------------------------------
# PASO 6 — GENERAR GRÁFICO
# ---------------------------------------------------------------------------

def generar_grafico(df_metricas: pd.DataFrame, k_optimo: int) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    ks         = df_metricas["k"].tolist()
    sil        = df_metricas["silhouette"].tolist()
    inertia    = df_metricas["inertia"].tolist()
    db         = df_metricas["davies_bouldin"].tolist()

    # Normalizar inercia a escala 0-1
    max_inertia = max(inertia) if max(inertia) > 0 else 1
    inertia_norm = [v / max_inertia for v in inertia]

    fig, axes = plt.subplots(3, 1, figsize=(9, 12))
    fig.suptitle(
        "Métricas de Clustering vs k — Portal SAT Iteración 3",
        fontsize=13,
        fontweight="bold",
        y=0.98,
    )

    # Subplot 1: Silhouette Score (mayor = mejor)
    ax1 = axes[0]
    ax1.plot(ks, sil, marker="o", color="steelblue", linewidth=2, label="Silhouette Score")
    ax1.axvline(x=k_optimo, color="red", linestyle="--", linewidth=1.2, label=f"k óptimo = {k_optimo}")
    idx_opt = ks.index(k_optimo)
    ax1.scatter([k_optimo], [sil[idx_opt]], color="red", zorder=5, s=80)
    ax1.set_title("Silhouette Score vs k (mayor = mejor)")
    ax1.set_xlabel("k")
    ax1.set_ylabel("Silhouette Score")
    ax1.legend(fontsize=9)
    ax1.grid(True, alpha=0.3)
    ax1.set_xticks(ks)

    # Subplot 2: Inercia normalizada (curva del codo)
    ax2 = axes[1]
    ax2.plot(ks, inertia_norm, marker="s", color="darkorange", linewidth=2, label="Inercia (normalizada)")
    ax2.set_title("Inercia Normalizada vs k")
    ax2.set_xlabel("k")
    ax2.set_ylabel("Inercia (0–1)")
    ax2.legend(fontsize=9)
    ax2.grid(True, alpha=0.3)
    ax2.set_xticks(ks)

    # Subplot 3: Davies-Bouldin Index (menor = mejor)
    ax3 = axes[2]
    ax3.plot(ks, db, marker="^", color="seagreen", linewidth=2, label="Davies-Bouldin Index")
    ax3.axvline(x=k_optimo, color="red", linestyle="--", linewidth=1.2, label=f"k óptimo = {k_optimo}")
    ax3.scatter([k_optimo], [db[idx_opt]], color="red", zorder=5, s=80)
    ax3.set_title("Davies-Bouldin Index vs k (menor = mejor)")
    ax3.set_xlabel("k")
    ax3.set_ylabel("Davies-Bouldin Index")
    ax3.legend(fontsize=9)
    ax3.grid(True, alpha=0.3)
    ax3.set_xticks(ks)

    plt.tight_layout(rect=[0, 0, 1, 0.96])
    plt.savefig(OUTPUT_PNG, dpi=150, bbox_inches="tight")
    plt.close(fig)
    log.info("Gráfico guardado: %s", OUTPUT_PNG)


# ---------------------------------------------------------------------------
# PUNTO DE ENTRADA
# ---------------------------------------------------------------------------

def main() -> None:
    log.info("=" * 60)
    log.info("Iteración 3 — Búsqueda del k óptimo — Portal SAT")
    log.info("=" * 60)

    # 1. Cargar CSV limpio
    df = cargar_csv()

    # 2. Construir texto_analisis
    log.info("Construyendo texto_analisis …")
    textos = construir_texto_analisis(df)
    log.info("Textos construidos: %d", len(textos))

    # 3. Generar embeddings
    embeddings = generar_embeddings(textos)

    # 4. Evaluar métricas para cada k
    df_metricas = evaluar_k(embeddings)

    # 5. Guardar métricas CSV
    guardar_metricas(df_metricas)

    # 6. Determinar y guardar k óptimo
    k_optimo = determinar_k_optimo(df_metricas)

    # 7. Generar gráfico
    generar_grafico(df_metricas, k_optimo)

    log.info("=" * 60)
    log.info("Métricas: %s", OUTPUT_CSV_METRICAS)
    log.info("Gráfico:  %s", OUTPUT_PNG)
    log.info("k óptimo: %d → %s", k_optimo, OUTPUT_K_OPTIMO)
    log.info("=" * 60)


if __name__ == "__main__":
    main()
