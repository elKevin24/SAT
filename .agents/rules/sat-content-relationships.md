---
trigger: always_on
---

# Regla Oficial de Relaciones de Contenido y Polijerarquía (SAT)

Esta regla gobierna cómo se conectan las gestiones entre sí en el dataset JSON (`src/data/allTramites.json`), en la interfaz React y en el modelo NoSQL (`gestiones` y `cat_actores`).

## 1. Principio de Polijerarquía sin Duplicación
- Una gestión se define **una única vez** en el catálogo maestro (`683` contenidos únicos con código `SAT-GES-####` y slug inmutable en kebab-case sin prefijos de audiencia, ej. `rtu-inscripcion-digital`).
- Cuando una gestión aplica a múltiples perfiles o niveles (ej. *Importadores*, *Agentes Aduaneros* y *ZDEEP*), se proyecta referenciando el mismo `SAT-GES-####` (`715` proyecciones totales), garantizando fuente única de verdad en base legal, URL y requisitos.

## 2. Dos Capas Ortogonales de Navegación Contextual
Ninguna ficha de gestión debe ser un callejón sin salida. Toda gestión articula sus vínculos en dos dimensiones:
1. **Capa A — Relaciones de Proceso (Secuencial / Ciclo ATO):**
   - `prerrequisito`: Gestión previa obligatoria antes de operar.
   - `siguiente_paso`: Continuidad natural tras completar la gestión actual.
   - `herramienta_apoyo`: Verificador, consulta en línea o calculadora auxiliar.
   - `normativa_asociada`: Base legal o criterio institucional vinculante.
2. **Capa B — Familia Temática (`familias_ids` / Cluster Horizontal):**
   - Agrupación transversal por ecosistema de servicio (`fel`, `rfv`, `rtu-digital`, `duca`, `regimenes-especiales`, `afpa`).

## 3. Límites Cognitivos e Integridad en UI
- **Ley de Miller en fichas de gestión:** Mostrar máximo **3 a 4 relaciones de proceso** y máximo **4 a 6 elementos** en el bloque de familia temática (*"En esta sección"*).
- **Integridad referencial:** Todo ID vinculado en relaciones de proceso o familias temáticas debe existir activamente en el catálogo y abrirse en su propia página dedicada (`#/gestion/:id`).

> **Referencia técnica NoSQL:** Para esquemas JSON de `gestiones`/`cat_actores` e índices MongoDB, consultar `.agents/skills/sat-content-relationships/references/nosql-schema-queries.md`.
