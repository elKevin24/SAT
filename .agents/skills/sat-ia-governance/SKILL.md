---
name: sat-ia-governance
description: >-
  Audita y gobierna las reglas de Arquitectura de Información del Portal SAT sobre ediciones puntuales
  del árbol jerárquico (N1–N5 estrictamente numéricos, guion largo "—" en niveles no clasificados,
  código inmutable SAT-GES-####, orden por ciclo ATO, Ley de Miller 7±2, cero clics pasarela y cero uso
  de "trámite"). Úsalo al clasificar una nueva gestión, reubicar nodos, revisar coherencia taxonómica o
  editar src/data/allTramites.json y src/data/categoryOrder.ts.
---

# SAT IA Governance (Reglas de Clasificación y Gobernanza Taxonómica)

Garantiza que cualquier decisión de clasificación, edición de nodos o ajuste en [`src/data/allTramites.json`](../../../src/data/allTramites.json) y [`src/data/categoryOrder.ts`](../../../src/data/categoryOrder.ts) cumpla con la Sección 5 de [`AGENTS.md`](../../../AGENTS.md).

> **Nota:** Si necesitas ejecutar el pipeline ETL masivo en Python o regenerar los libros Excel de 25 columnas, complementa esta skill con `sat-ia-audit-sync`.

---

## 1. Reglas Taxonómicas Inquebrantables (Grado de Libertad Bajo)

1. **Niveles Estrictamente Numéricos (`Nivel 1` a `Nivel 5`):**
   - Prohibido asignar nombres conceptuales a los niveles (jamás usar *"Segmento"*, *"Régimen"*, *"Área"*, *"Subárea"*, *"Actor"*, *"Tema"*, *"Subtema"*, *"Persona"*).
   - En JSON, UI, diagramas de React Flow y documentación solo se rotulan como `Nivel 1`, `Nivel 2`, `Nivel 3`, `Nivel 4`, `Nivel 5`.
2. **Regla del Guion Largo (`—`) en Niveles No Clasificados:**
   - Prohibido forzar simetría inventando carpetas relleno (*"General"*, *"Otros"*) o duplicando el título en espejo.
   - Si una rama termina en N2 o N3, los niveles y órdenes restantes (`nivel3..nivel5`, `orden_n3..orden_n5`) llevan estrictamente un **guion largo (`—`)**.
3. **Capacidad de Miller ($7 \pm 2$) y Umbral de Densidad:**
   - **Sub-densidad ($\le 3$ gestiones):** Compactar obligatoriamente al nivel superior para evitar **clics pasarela (*zero pass-through clicks*)**. Un nodo con 1 sola opción está prohibido.
   - **Rango óptimo ($5\text{–}9$ gestiones):** Mantener en lista directa bajo su nivel contenedor.
   - **Tolerancia excepcional ($10$ gestiones):** Permitida solo en $\le 5\%$ del catálogo cuando fragmentar cree micro-ramas subdensas, manteniendo orden ATO y acceso en $\le 2\text{–}3$ clics.
   - **Sobrecarga ($\ge 11$ gestiones):** Modularizar obligatoriamente en sub-bloques temáticos o del ciclo ATO (preservar N4/N5).
4. **Orden por Ciclo ATO y Desacoplamiento Numérico:**
   - Prohibido quemar números en títulos visibles (`nombreActual`, `gestion`, `nivel1..5`).
   - El orden se controla exclusivamente mediante `orden_n1..orden_n5` siguiendo el ciclo ATO:
     `1. Empezar y registrarse` $\to$ `2. Operación y declaraciones` $\to$ `3. Consultas y herramientas` $\to$ `4. Modificaciones y cierre` $\to$ `5. Normativa y asistencia`.
5. **Código Institucional Inmutable (`SAT-GES-####`):**
   - Clave primaria universal. Los IDs heredados solo se guardan en el arreglo `codigos_legacy`.
6. **Lenguaje y Navegación:**
   - Prohibido usar *"trámite"* / *"trámites"*; usar siempre **"gestión" / "gestiones"**.
   - Toda gestión se presenta en página dedicada (`#/gestion/:id`), nunca en modal ni popover.

---

## 2. Procedimiento de Auditoría y Edición Taxonómica

1. **Inspeccionar el contexto:** Leer los registros afectados en [`src/data/allTramites.json`](../../../src/data/allTramites.json) y verificar su mapeo en [`src/data/categoryOrder.ts`](../../../src/data/categoryOrder.ts).
2. **Evaluar densidad de la rama:**
   - Contar cuántas gestiones cuelgan del nodo padre antes y después del cambio.
   - Si el cambio deja una carpeta con $\le 3$ elementos o un único hijo, compactar al nivel superior y asignar `—` a los niveles sobrantes.
   - Si una lista supera 10 elementos ($\ge 11$), particionar según etapas del ciclo ATO.
3. **Aplicar la edición manteniendo sincronía:**
   - Actualizar `nivel1..nivel5` y `orden_n1..orden_n5` en `src/data/allTramites.json`.
   - Reconstruir `migaBreadcrumb` solo con los niveles activos (sin incluir `—` ni repeticiones).
   - Si se renombró o reordenó una categoría de N2 o N3, actualizar [`src/data/categoryOrder.ts`](../../../src/data/categoryOrder.ts).

---

## 3. Bucle de Verificación (Verification Loop)

Después de editar cualquier nodo taxonómico o contrato de orden:

1. **Verificar ausencia de números quemados y coherencia del árbol:**
   ```powershell
   python scripts/check_numbers_in_json.py
   python scripts/auditoria_1_coherencia_arbol.py
   ```
2. **Validar contrato TypeScript y pruebas automatizadas:**
   ```powershell
   npm run build
   npx playwright test
   ```
   Si algún test de contrato (`order categorías` u `order subcategorías`) falla, alinear `src/data/categoryOrder.ts` con `src/data/allTramites.json` y volver a ejecutar hasta aprobar el 100%.
