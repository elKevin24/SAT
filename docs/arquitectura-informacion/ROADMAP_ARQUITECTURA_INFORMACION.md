# Roadmap — Arquitectura de Información Portal SAT

> **Última actualización:** 26 octubre 2026
> **Estado general:** Fases 1, 3 y 5 completadas · Fases 2 y 4 en mejora continua editorial (páginas ómnibus del portal legacy)

---

## Contexto

El portal SAT Guatemala alberga **683 contenidos únicos** desplegados en **714 ubicaciones (gestiones) dentro del árbol jerárquico** y **49 procesos guiados**, catalogados en sincronía biunívoca entre `src/data/allTramites.json`, `src/data/catalogoContenidosUnicos.json`, `database/` y los libros Excel maestros en `docs/fuentes-datos/02_archivos_producto_entregables/`.

---

## Resumen de Estado Actual (Métricas Vivas Verificadas)

| Indicador | Valor Actual |
|---|---|
| Total contenidos únicos (`catalogoContenidosUnicos.json`) | **683** ✅ |
| Total gestiones en el árbol (`allTramites.json`) | **714** ✅ |
| Total procesos conectados (`allProcesos.json`) | **49** ✅ |
| Familias temáticas transversales (`FAM-01`..`FAM-10`) | **10** ✅ |
| Niveles jerárquicos poblados (`Nivel 1` a `Nivel 5` con `—` en no clasificados) | **100% poblados y validados** ✅ |
| Páginas ómnibus en el portal WordPress actual (URL base compartida por 2+ gestiones) | **53 URLs base (269 gestiones)** ⚠️ |
| Gestiones con fragmento `#` numérico heredado de WPBakery en el portal actual | **82** ⚠️ |

---

## Fase 1 — Inventario y Análisis Exploratorio ✅ Completado

| Tarea | Estado | Entregable |
|---|---|---|
| Auditoría del catálogo Excel: nulos, duplicados, URLs rotas | ✅ | `docs/url_validation_report_summary.md` |
| Clustering semántico y agrupación en 10 familias temáticas (`FAM-01`..`10`) | ✅ | `src/data/contentRelationships.ts` |
| Identificación de páginas ómnibus y fragmentos `#` autogenerados | ✅ | Documentado en matriz maestra |

---

## Fase 2 — Diagnóstico de Páginas Ómnibus y Desacoplamiento Polijerárquico ✅ / 🔄 En curso editorial

| Tarea | Estado | Responsable | Prioridad |
|---|---|---|---|
| Desacoplar catálogo de contenidos únicos (683) de sus ubicaciones de audiencia (714) | ✅ Completado | IA + Técnico | 🔴 Alta |
| Proveer ruta web propia e indexable en el nuevo portal (`#/gestion/:slug`) para las 714 gestiones (Regla 13) | ✅ Completado | Técnico | 🔴 Alta |
| Exportar plantillas WPBakery por página/audiencia en `docs/plantillas-wpbakery/` | ✅ Completado | Técnico | 🟡 Media |
| Sustituir progresivamente las 82 anclas `#ID-numérico` en el CMS WordPress de producción por slugs semánticos | 🔄 En curso (CMS SAT) | Editorial / Webmaster SAT | 🟡 Media |

---

## Fase 3 — Construcción de la Arquitectura N1–N5 ✅ Completado

| Tarea | Estado | Responsable | Prioridad |
|---|---|---|---|
| Estructurar `Nivel 1` a `Nivel 5` estrictamente numéricos (Regla 1) | ✅ Completado | IA + Editorial | 🔴 Alta |
| Compactación asimétrica de ramas con $\le 3$ hojas usando guion largo `—` (Reglas 3 y 5) | ✅ Completado | IA + Técnico | 🔴 Alta |
| Poblar `migaBreadcrumb` y órdenes numéricos `orden_n1..orden_n5` | ✅ Completado | IA + Técnico | 🟡 Media |
| Aplicar ciclo ATO en el orden: `1. Empezar → 2. Operar → 3. Consultar → 4. Modificar/Cerrar → 5. Normativa` | ✅ Completado | IA + Técnico | 🔴 Alta |

---

## Fase 4 — Validación Técnica de URLs ✅ Completado

| Tarea | Estado | Responsable | Prioridad |
|---|---|---|---|
| Validador HTTP sobre las URLs del catálogo (`scripts/validate_urls.py`) | ✅ Completado | Técnico | 🔴 Alta |
| Garantizar 0 enlaces vacíos o caídos mediante test de contrato (`tests/data-contract.spec.ts`) | ✅ Completado | QA | 🔴 Alta |
| Ruta canónica dedicada `#/gestion/:slug` activa en el prototipo para cada gestión | ✅ Completado | Técnico | 🔴 Alta |

---

## Fase 5 — Sincronía Multidimensional y Entregables Finales ✅ Completado

| Tarea | Estado | Responsable | Prioridad |
|---|---|---|---|
| Sincronizar `database/gestiones.json` y `database/nosql_mongodb/` (5 colecciones) | ✅ Completado | Técnico | 🟡 Media |
| Sincronizar `src/data/allTramites.json` y `src/data/catalogoContenidosUnicos.json` | ✅ Completado | Técnico | 🟡 Media |
| Sincronizar `src/data/categoryOrder.ts` con tests bidireccionales | ✅ Completado | Técnico | 🟡 Media |
| Generar matriz canónica Excel de 25 columnas (`Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`) | ✅ Completado | Técnico | 🟡 Media |
| Pruebas unitarias, de contrato y de accesibilidad Playwright (`npm test`) | ✅ Completado | QA | 🟡 Media |
