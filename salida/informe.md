# Informe de Clustering — Portal SAT

*Generado automáticamente. Requiere validación humana.*

---

## Resumen Ejecutivo

Se analizaron **683 gestiones** del Catálogo Único del Portal SAT mediante clustering semántico.
El método de representación utilizado fue **sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2)**.
El algoritmo seleccionado fue **KMeans k=8 (silhouette=0.1022)**, con un silhouette promedio de **0.1022**.
Se identificaron **8 grupos temáticos** que revelan patrones en la estructura de contenidos del portal.
Se detectaron **12 pares casi-duplicados** (similitud coseno ≥ 0.95),
**79 outliers globales** (silhouette negativo) y
**10 gestiones posiblemente mal ubicadas**.
La estructura actual del portal se distribuye en los clusters de forma heterogénea,
lo que sugiere oportunidades de consolidación y reorganización temática.

---

## 1. Método de Representación

**Método usado:** sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2)

**Justificación:**
- Los embeddings multilingües capturan semántica contextual, superando la simple coincidencia léxica.
- Se usa `paraphrase-multilingual-MiniLM-L12-v2` por su equilibrio velocidad/calidad en español.
- Fallback a TF-IDF char_wb (3,5) si no hay conectividad para descargar el modelo.

---

## 2. Método de Clustering y Valor de k

**Algoritmo elegido:** KMeans k=8 (silhouette=0.1022)

**Justificación:**
- Se evaluaron K-Means (k=5…30), clustering jerárquico Ward y HDBSCAN.
- K-Means elegido por mayor silhouette y estabilidad entre semillas.
- k=8 maximiza el silhouette score en el rango probado.

**Alternativas razonables:** k=7 (sil=0.1026), k=9 (sil=0.1007), k=6 (sil=0.0972)

**Nota sobre HDBSCAN:** Detectó 3 clusters
con 435 gestiones catalogadas como ruido.
Útil para identificar outliers pero produce número variable de clusters.

---

## 3. Resultados por Cluster (Top 5 por tamaño)

  - **Cluster 3 – De / Aduanera / Aduanas**: 161 gestiones | términos: de, aduanera, aduanas, información, portal, información sobre, comercio, sobre, de comercio, para
  - **Cluster 0 – De / Del / Impuesto**: 138 gestiones | términos: de, del, impuesto, del impuesto, para, en, la, portal, devolución, fiscal
  - **Cluster 7 – Requisitos / De / Para**: 124 gestiones | términos: requisitos, de, para, documentos, portal requisitos, pasos, documentos para, pasos documentos, requisitos pasos, portal
  - **Cluster 6 – Vehículo / Un Vehículo / Vehiculos**: 81 gestiones | términos: vehículo, un vehículo, vehiculos, vehículos, requisitos, un, de vehiculos, de, de vehículos, portal requisitos
  - **Cluster 4 – C3 / Sat / Capacitacionessat Page**: 74 gestiones | términos: c3, sat, capacitacionessat page, capacitacionessat, page, capacitación, cultura, virtuales, cursos, virtual

*(Ver hoja `resumen_clusters` en `clusters.xlsx` para el listado completo.)*

---

## 4. Comparación con la Estructura Actual

- **Clusters que mezclan secciones** (≥3 secciones con ≥5 gestiones c/u): ninguno detectado
- **Secciones del portal repartidas en varios clusters**: portal

Esto indica que la estructura URL actual no siempre refleja la afinidad temática real
de las gestiones. Los clusters que mezclan secciones son candidatos prioritarios
para revisión editorial.

---

## 5. Hallazgos Principales

| Hallazgo | Cantidad |
|---|---|
| Pares casi-duplicados (cos ≥ 0.95) | 12 |
| Outliers globales (silhouette < 0) | 79 |
| Gestiones posiblemente mal ubicadas | 10 |
| Clusters que mezclan secciones | 0 |
| Secciones repartidas en varios clusters | 1 |

---

## 6. Propuesta de Estructura de Navegación

**Evidencia del dato** (clustering semántico):
- Los 8 clusters revelan agrupaciones temáticas naturales que difieren
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
2. Revisar los 12 pares casi-duplicados para confirmar consolidación o eliminar.
3. Investigar los 10 gestiones posiblemente mal ubicadas.
4. Ejecutar card sorting con usuarios para validar la agrupación propuesta.
5. Incorporar métricas de tráfico para priorizar la reorganización por impacto real.
6. Iterar con texto completo de páginas para mejorar la representación vectorial.

---

*Archivos generados: `clusters.xlsx`, `mapa_clusters.png`, `informe.md`*
*Método representación: sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2)*
*Método clustering: KMeans k=8 (silhouette=0.1022)*
*Reducción dimensional: UMAP (cosine)*
