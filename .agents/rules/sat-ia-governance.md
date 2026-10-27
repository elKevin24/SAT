---
trigger: always_on
---

# Regla Oficial de Arquitectura de Información y Gobernanza Taxonómica (SAT)

Esta regla es de cumplimiento obligatorio antes de crear, clasificar, reubicar o modificar nodos jerárquicos, datasets (`src/data/allTramites.json`, `src/data/categoryOrder.ts`), scripts de datos (`scripts/`) o matrices Excel (`.xlsx`).

## 1. Los Niveles NO Tienen Nombre (Estructura Estrictamente Numérica N1–N5)
- Queda terminantemente prohibido asignar rótulos, sufijos o nombres conceptuales a los niveles jerárquicos (tales como *"Segmento"*, *"Régimen"*, *"Área"*, *"Subárea"*, *"Actor"*, *"Tema"*, *"Subtema"*, *"Tipo de Usuario"*, *"Persona"*).
- Los niveles son única y exclusivamente estructurales: **Nivel 1, Nivel 2, Nivel 3, Nivel 4, Nivel 5**. En matrices Excel, JSONs, UI, diagramas de React Flow y documentación, solo se rotulan por su número de nivel (`Nivel X`).

## 2. Capacidad de Miller ($7 \pm 2$), Rango Óptimo y Margen de Tolerancia (10 Opciones)
- **Rango Óptimo ($5\text{–}9$ opciones):** Nodos con $\le 7$ gestiones terminales (ej. *Agentes Aduaneros*) van en lista directa bajo su nivel contenedor sin subcarpetas artificiales.
- **Tolerancia Excepcional ($10$ opciones):** Permitida únicamente para $\le 5\%$ del catálogo cuando fragmentar genere micro-ramas subdensas ($\le 3$), cumpliendo alta homogeneidad temática, orden ATO estricto, lenguaje ciudadano y acceso en $\le 2\text{–}3$ clics.
- **Sobrecarga ($\ge 11$ elementos):** Listas de 11 o más gestiones deben modularizarse obligatoriamente por subtema o ciclo ATO.

## 3. Umbral de Densidad, Ramificación Asimétrica ($A, A_1, A_2$) y Cero Clics Pasarela
- **Sub-densidad ($\le 3$ hojas terminales) y Nodos Monocatenarios:** Se compactan obligatoriamente al nivel superior. Se prohíben clics pasarela (*zero pass-through clicks*) que abran carpetas con una sola opción.
- **Alta densidad ($\ge 10$ gestiones con complejidad):** Se preserva la jerarquía profunda (N4/N5) para evitar el colapso de contexto.
- **Minimización de clics:** El usuario debe llegar a su gestión en 2 a 3 clics máximo, donde cada clic represente una elección real entre $\ge 2$ opciones.

## 4. Regla del Guion Largo (`—`) en Niveles No Clasificados (Anti-Simetría Forzada)
- Prohibido obligar a que todas las gestiones llenen texto en los 5 niveles inventando categorías relleno (*"General"*, *"Otros"*) o duplicando títulos en espejo.
- Si una gestión no requiere clasificación en N3, N4 o N5, los campos de nivel y orden correspondientes (`nivel3..nivel5`, `orden_n3..orden_n5`) se registran **estrictamente con un guion largo (`—`)**.

## 5. Identificación, Orden ATO y Sincronía Multidimensional
- **Código Institucional Inmutable:** Usar siempre **`SAT-GES-####`** como identificador canónico universal (`683` contenidos únicos proyectados en `715` registros). Los IDs históricos van solo en `codigos_legacy`.
- **Desacoplamiento Numérico y Ciclo ATO:** Prohibido quemar números en títulos visibles (`nombreActual`, `gestion`, `nivel1..5`). El orden lo rige exclusivamente `orden_n1..orden_n5` siguiendo el ciclo ATO: `1. Empezar` $\to$ `2. Operar` $\to$ `3. Consultar` $\to$ `4. Modificar/Cerrar` $\to$ `5. Normativa`.
- **Matriz Canónica de 25 Columnas y Fuentes:** Mantener sincronía biunívoca entre `.xlsx` vivos, `src/data/allTramites.json` y `src/data/categoryOrder.ts`. Las fuentes históricas en `docs/fuentes-datos/` son inalterables (solo lectura).
- **Validación Activa de URLs (`HTTP 200 OK`):** Cero enlaces `404` y cero enlaces genéricos al Home (`https://portal.sat.gob.gt/`).

> **Referencia de profundización:** Para la tabla completa de 25 columnas y diagramas de densidad, consultar `.agents/skills/sat-ia-audit-sync/references/taxonomy-and-matrix-spec.md`.
