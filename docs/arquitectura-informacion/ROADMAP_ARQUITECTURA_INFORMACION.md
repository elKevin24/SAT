# Roadmap — Arquitectura de Información Portal SAT

> **Última actualización:** 24 octubre 2026
> **Estado general:** Fase 1 completada · Fase 2 en curso · Fases 3–5 pendientes

---

## Contexto

El portal SAT Guatemala alberga **683 gestiones** (ciudadanas y empresariales) más **17 contenidos transversales**, catalogadas en `Catalogo_Contenidos_Unicos_Portal_SAT.xlsx`. El objetivo es rediseñar la arquitectura de información con base en evidencia cuantitativa (clustering semántico) y criterio editorial, produciendo una jerarquía N1–N5 navegable, accesible y con URLs canónicas únicas por gestión.

---

## Resumen de Estado Actual (baseline cuantitativo)

| Indicador | Valor |
|---|---|
| Total gestiones catalogadas | 683 |
| Gestiones con URL canónica propia | 442 (64.7%) |
| Gestiones dentro de páginas ómnibus | **241 (35.3%)** ⚠️ |
| Páginas ómnibus (URL base compartida 2+ gestiones) | 52 |
| Gestiones con fragmento `#` (ancla en página) | 73 |
| — de las cuales con ID autogenerado frágil (`#1542142398181…`) | **68** ⚠️ |
| Pares casi-duplicados (similitud coseno ≥ 0.95) | 12 |
| Gestiones posiblemente mal ubicadas (clustering) | 10 |
| Outliers semánticos (silhouette < 0) | 79 |
| Hoja "Mapeo a Nodos" — N1, N2, N3, miga de pan | **100% vacíos** ⚠️ |

---

## Fase 1 — Inventario y Análisis Exploratorio ✅ Completado

**Objetivo:** Entender qué existe antes de reorganizar.

| Tarea | Estado | Entregable |
|---|---|---|
| Auditoría del catálogo Excel: nulos, duplicados, URLs rotas | ✅ | `salida/exploracion.txt` |
| Clustering semántico con TF-IDF (v1 baseline) | ✅ | `salida/clusters.xlsx` v1 |
| Instalación de `sentence-transformers` y re-ejecución con embeddings reales | ✅ | — |
| Clustering semántico con embeddings multilingües (v2) | ✅ | `salida/clusters.xlsx` v2 |
| Visualización 2D UMAP coloreada por cluster | ✅ | `salida/mapa_clusters.png` |
| Informe de clustering con método, resultados y limitaciones | ✅ | `salida/informe.md` |
| Identificación de páginas ómnibus y fragmentos `#` autogenerados | ✅ | (este documento) |

**Resultados clave:**
- **8 clusters temáticos** identificados (KMeans k=8, silhouette=0.1022)
- **52 páginas ómnibus** con 241 gestiones sin URL propia — problema sistémico, no puntual
- **68 fragmentos `#` frágiles** (IDs numéricos autogenerados por WordPress/WPBakery)
- La sección `portal/` en la URL no diferencia contenido temáticamente

---

## Fase 2 — Diagnóstico Profundo y Gobernanza de URLs 🔄 En curso

**Objetivo:** Resolver los problemas de identidad de URL antes de construir la nueva IA.

| Tarea | Estado | Responsable | Prioridad |
|---|---|---|---|
| Verificar en vivo las 52 páginas ómnibus: ¿tienen anclas navegables o son listas sin `#`? | ⬜ Pendiente | Analista | 🔴 Alta |
| Documentar para cada gestión ómnibus: URL propuesta canónica propia | ⬜ Pendiente | IA + editorial | 🔴 Alta |
| Revisar 12 pares casi-duplicados: ¿consolidar, eliminar o marcar como variantes legítimas? | ⬜ Pendiente | Editorial | 🔴 Alta |
| Investigar 10 gestiones posiblemente mal ubicadas (ver tabla en `informe.md`) | ⬜ Pendiente | Editorial | 🟡 Media |
| Resolver las 2 gestiones apuntando a URL ómnibus genérica `/requisitos-de-aduanas/` sin `#` | ⬜ Pendiente | Editorial | 🔴 Alta |
| Rastrear en portal las 68 anclas `#ID-numérico`: ¿siguen activas? ¿son reemplazables? | ⬜ Pendiente | Analista | 🟡 Media |
| Scraping del portal para obtener texto completo de las 683 gestiones | ⬜ Pendiente | Técnico | 🟡 Media |

**Los 12 pares casi-duplicados a revisar:**

| Par | Similitud | Decisión pendiente |
|---|---|---|
| Curso Régimen Electrónico vs. Régimen Pequeño Contribuyente | 0.956 | ¿Consolidar? |
| Régimen Pequeño Contribuyente vs. Obligaciones Pequeño Contribuyente | 0.977 | ¿Consolidar? |
| Cerrar negocio persona fallecida vs. Cerrar negocio inactivo persona fallecida | 0.972 | ¿Variante legítima? |
| Devolución ISR con establecimiento permanente vs. sin establecimiento permanente | 0.963 | ✅ Variante legítima |
| Curso Régimen Opcional Simplificado vs. Régimen sobre las Utilidades | 0.959 | ¿Consolidar? |
| Régimen General IVA vs. Obligaciones Régimen General IVA | 0.970 | ¿Consolidar? |
| Régimen General IVA vs. Impuesto al Valor Agregado (genérico) | 0.969 | ¿Consolidar? |
| Bebidas alcohólicas vs. bebidas no alcohólicas | **0.990** | ⚠️ Revisar urgente — casi idéntico |
| Tabla IPRIMA vehículos usados vs. Tabla IVA vehículos usados | 0.953 | ✅ Variante legítima |
| Obtener distintivos (URL duplicada exacta para dos nombres) | 0.956 | ⚠️ Error de catalogación |
| Consulta tributaria "enviar" vs. "hacer" | 0.966 | ¿Duplicado real? |
| ONG antes de agosto 2022 vs. desde agosto 2022 | **0.985** | ✅ Variante legítima |

---

## Fase 3 — Construcción de la Arquitectura N1–N5 ⬜ Pendiente

**Objetivo:** Poblar la hoja "Mapeo a Nodos" (715 filas, actualmente 100% vacía en N1–N3).

| Tarea | Estado | Responsable | Prioridad |
|---|---|---|---|
| Proponer N1 (5–9 categorías de primer nivel) basado en los 8 clusters | ⬜ Pendiente | IA + editorial | 🔴 Alta |
| Validar N1 con expertos de dominio SAT | ⬜ Pendiente | Editorial | 🔴 Alta |
| Asignar cada gestión a N1 | ⬜ Pendiente | IA + editorial | 🔴 Alta |
| Proponer N2 por cada rama N1 (máx. 9 opciones; tolerancia hasta 10 excepcional) | ⬜ Pendiente | IA + editorial | 🟡 Media |
| Proponer N3 donde aplique (compactar si ≤ 3 hojas; usar `—` si no aplica) | ⬜ Pendiente | IA + editorial | 🟡 Media |
| Poblar columna "Ruta de Navegación (Miga de Pan)" | ⬜ Pendiente | IA + editorial | 🟡 Media |
| Aplicar ciclo ATO en el orden: Empezar → Operar → Consultar → Modificar/Cerrar → Normativa | ⬜ Pendiente | Editorial | 🟡 Media |
| Card sorting con usuarios (validación externa) | ⬜ Pendiente | UX Research | 🟡 Media |

**Restricciones de diseño (AGENTS.md):**
- Niveles se llaman **Nivel 1…Nivel 5**, sin nombres conceptuales inventados
- Rango óptimo: 5–9 opciones por contenedor; máximo 10 de forma excepcional (≤ 5% del catálogo)
- ≥ 11 elementos → modularizar obligatoriamente
- Nodos con ≤ 3 hojas → compactar al nivel superior
- Máximo 2–3 clics al contenido; prohibidos los clics pasarela
- Usar `—` en los niveles que no apliquen (nunca inventar categorías espejo)

---

## Fase 4 — Validación Técnica de URLs ⬜ Pendiente

**Objetivo:** Garantizar que cada gestión responde HTTP 200 a una URL canónica propia.

| Tarea | Estado | Responsable | Prioridad |
|---|---|---|---|
| Crawler de validación HTTP sobre las 683 URLs del catálogo | ⬜ Pendiente | Técnico | 🔴 Alta |
| Detectar y documentar 404s y redirecciones | ⬜ Pendiente | Técnico | 🔴 Alta |
| Rastrear URLs caídas en `site:portal.sat.gob.gt` | ⬜ Pendiente | Analista | 🟡 Media |
| Proponer URL canónica `#/gestion/:id` para cada gestión ómnibus sin ancla | ⬜ Pendiente | Técnico + editorial | 🔴 Alta |
| Actualizar el catálogo con URLs validadas | ⬜ Pendiente | Analista | 🟡 Media |

---

## Fase 5 — Sincronía Multidimensional y Entregables Finales ⬜ Pendiente

**Objetivo:** Mantener en sincronía todos los entregables vivos según la gobernanza documental.

| Tarea | Estado | Responsable | Prioridad |
|---|---|---|---|
| Actualizar `database/gestiones.json` con la nueva IA | ⬜ Pendiente | Técnico | 🟡 Media |
| Actualizar `src/data/allTramites.json` (nombre obsoleto → renombrar a `allGestiones.json`) | ⬜ Pendiente | Técnico | 🟡 Media |
| Actualizar `src/data/categoryOrder.ts` con la nueva jerarquía N1–N5 | ⬜ Pendiente | Técnico | 🟡 Media |
| Generar matriz canónica Excel de 25 columnas (Opción A Intercalada) | ⬜ Pendiente | Analista | 🟡 Media |
| Actualizar `database/arbol_navegacion.json` | ⬜ Pendiente | Técnico | 🟡 Media |
| Actualizar versiones NoSQL MongoDB en `database/nosql_mongodb/` | ⬜ Pendiente | Técnico | 🟢 Baja |
| Revisar y actualizar `docs/arquitectura-informacion/ESTRUCTURA_FINAL_CONTENIDO.md` | ⬜ Pendiente | Editorial | 🟡 Media |
| Pruebas de accesibilidad Playwright (`npx playwright test`) | ⬜ Pendiente | QA | 🟡 Media |

---

## Deuda Técnica Identificada

| Deuda | Impacto | Archivo afectado |
|---|---|---|
| `src/data/allTramites.json` usa término prohibido "Trámite" en el nombre | Bajo (interno) | `src/data/` |
| 68 fragmentos `#ID-numérico` frágiles en URLs | Alto — se rompen con migraciones CMS | Catálogo + portal |
| 241 gestiones sin URL canónica propia | Alto — viola regla #13 AGENTS.md | Portal SAT |
| Hoja "Mapeo a Nodos" 100% vacía en N1–N3 | Crítico — bloquea toda la IA | Excel catálogo |
| `inspect.py` en raíz del proyecto conflictúa con módulo estándar `inspect` de Python | Bajo (entorno dev) | `inspect.py` |

---

## Archivos de Referencia

| Archivo | Descripción |
|---|---|
| `docs/fuentes-datos/02_archivos_producto_entregables/Catalogo_Contenidos_Unicos_Portal_SAT.xlsx` | Fuente de verdad — no modificar |
| `salida/clusters.xlsx` | Resultado del clustering v2 (embeddings reales) |
| `salida/mapa_clusters.png` | Visualización UMAP 2D |
| `salida/informe.md` | Informe técnico del clustering |
| `scripts/clustering_sat.py` | Script reproducible (random_state=42) |
| `salida/exploracion.txt` | Reporte de exploración del catálogo |
| `AGENTS.md` | Reglas de arquitectura — lectura obligatoria antes de cualquier cambio |
| `docs/diseno-normativa/DESIGN_RULES.md` | Normativa visual y de diseño |

---

## Leyenda

| Símbolo | Significado |
|---|---|
| ✅ | Completado |
| 🔄 | En curso |
| ⬜ | Pendiente |
| 🔴 | Prioridad alta |
| 🟡 | Prioridad media |
| 🟢 | Prioridad baja |
| ⚠️ | Requiere atención inmediata |
