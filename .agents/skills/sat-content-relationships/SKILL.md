---
name: sat-content-relationships
description: >-
  Diseña, estructura y audita relaciones de contenido, polijerarquía, grafos temáticos y navegación
  transversal para las gestiones del Portal SAT Guatemala en JSON, TypeScript, UI React y MongoDB.
  Úsalo cuando el usuario pida conectar gestiones relacionadas, configurar prerrequisitos o siguientes
  pasos del ciclo ATO, agrupar familias temáticas (FEL, RTU, RFV, DUCA, AFPA) o modelar la colección
  NoSQL de gestiones.
---

# SAT Content Relationships (Grafo de Gestiones y Polijerarquía)

Estándar metodológico y técnico para vincular **gestiones** mediante relaciones secuenciales de proceso y clusters temáticos horizontales, evitando callejones sin salida en la navegación ciudadana.

## 1. Reglas de Dominio (Grado de Libertad Bajo)

- **Terminología estricta:** Usar siempre **"gestión" / "gestiones"**. Prohibido usar *"trámite"* o *"trámites"* en UI, esquemas visibles y microcopys.
- **Identificación inmutable:** Toda gestión se identifica con `SAT-GES-####` y un slug canónico en kebab-case sin prefijos de nivel o audiencia (ej. `rtu-inscripcion-digital`).
- **Polijerarquía sin duplicación:** Una gestión existe una sola vez en el catálogo único (`683` contenidos únicos) y se proyecta en múltiples ramas (`715` proyecciones en `src/data/allTramites.json`).
- **Presentación en página completa:** Los bloques de gestiones relacionadas se renderizan dentro de la página dedicada de la gestión (`#/gestion/:id`). Prohibido abrir relaciones en modales o popovers.

---

## 2. Las Dos Capas Ortogonales de Relación

Toda ficha de gestión articula su navegación transversal en dos dimensiones:

### Capa A: Relaciones de Proceso (Flujo Secuencial ATO)
Conecta el viaje del contribuyente paso a paso:
- `prerrequisito`: Gestión previa obligatoria (ej. *Agencia Virtual* antes de *Inscripción en RTU*).
- `siguiente_paso`: Continuidad operativa tras completar la gestión (ej. *Inscripción en RTU* $\rightarrow$ *Habilitarse como emisor de Factura Electrónica (FEL)*).
- `herramienta_apoyo`: Verificador, consulta o calculadora auxiliar (ej. *Llenar DUCA* $\rightarrow$ *Consultar Arancel Integrado*).
- `normativa_asociada`: Base legal o criterio institucional vinculante.

### Capa B: Familia Temática (`familias_ids` - Cluster Horizontal)
Agrupa gestiones de una misma materia (`fel`, `rfv`, `rtu-digital`, `duca`, `regimenes-especiales`, `afpa`) para descubrir servicios afines sin mantenimiento manual de enlaces.

> Para consultar el catálogo detallado de familias temáticas, el esquema JSON de `gestiones` y `cat_actores`, y los índices/queries en MongoDB, lee [references/nosql-schema-queries.md](./references/nosql-schema-queries.md).

---

## 3. Procedimiento de Implementación y Sincronización

1. **Inspeccionar el modelo de relaciones actual:**
   - En Frontend/JSON: Revisar `src/data/allTramites.json` y tipos en `src/types/` o `src/data/categoryOrder.ts`.
   - En NoSQL/Scripts: Revisar [references/nosql-schema-queries.md](./references/nosql-schema-queries.md) y scripts de enriquecimiento:
     - [`scripts/enrich_with_familias.py`](../../../scripts/enrich_with_familias.py)
     - [`scripts/sync_nosql_familias.py`](../../../scripts/sync_nosql_familias.py)
     - [`scripts/build_and_load_5_collections.py`](../../../scripts/build_and_load_5_collections.py)
2. **Asignar o auditar relaciones:**
   - Verificar que todo ID referenciado en `prerrequisitos_ids` o `siguientes_pasos_ids` exista como código `SAT-GES-####` o slug válido en el catálogo maestro (cero referencias huérfanas).
   - Limitar la carga cognitiva en UI (Ley de Miller): mostrar máximo **3 a 4 relaciones de proceso** y **4 a 6 gestiones por familia temática**.
3. **Diferenciar en UI:**
   - Renderizar **Capa A (Proceso)** como secuencia con etiquetas claras (`Requisito previo`, `Siguiente paso`).
   - Renderizar **Capa B (Familia Temática)** en el módulo lateral o inferior *"En esta sección"* usando tarjetas compactas sin íconos decorativos ni conteos.

---

## 4. Bucle de Validación (Verification Loop)

Tras modificar relaciones en el dataset, scripts NoSQL o componentes de UI:

1. **Validar integridad referencial y contratos:**
   ```powershell
   npm run build
   ```
   Si falla el tipado en TypeScript, corregir las interfaces antes de continuar.
2. **Ejecutar pruebas de extremo a extremo y accesibilidad:**
   ```powershell
   npx playwright test
   ```
   Confirmar que las tarjetas de gestiones relacionadas naveguen a la ruta dedicada `#/gestion/:id` y cumplan WCAG 2.2 AA.
