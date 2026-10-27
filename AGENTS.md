# Directrices y Reglas del Proyecto SAT

## 1. Principios de Comportamiento, Reglas Modulares y Skills
- **Lectura Previa Obligatoria antes de Crear o Editar (Prevención de Errores Ya Cometidos):** Antes de crear cualquier archivo, escribir código, editar componentes, generar datasets, matrices Excel o modificar documentación, es **obligatorio leer, consultar y validar activamente**:
  1. Este archivo maestro (`AGENTS.md`).
  2. Las **Reglas Modulares en `.agents/rules/`** (cargadas de forma permanente y de consulta obligatoria):
     - `.agents/rules/sat-ia-governance.md`: Reglas taxonómicas N1–N5 numéricos, Ley de Miller ($7\pm2$), densidad ($A, A_1, A_2$), cero clics pasarela, guion largo `—`, código `SAT-GES-####`, orden ATO y matriz de 25 columnas.
     - `.agents/rules/sat-ui-ux-design.md`: Prohibición de *"trámite"* (uso de **"gestión"**), prohibición de modales/popovers (página dedicada `#/gestion/:id`), tarjetas compactas sin íconos/conteos, UX Writing con acrónimos expandidos, responsive y WCAG 2.2 AA.
     - `.agents/rules/sat-content-relationships.md`: Polijerarquía sin duplicación (`683` únicos / `715` proyecciones), relaciones secuenciales ATO y familias temáticas (`familias_ids`).
  3. La normativa visual y de navegación en `docs/diseno-normativa/DESIGN_RULES.md`.
  4. Las **Skills Especializadas en `.agents/skills/`** y sus documentos técnicos en `references/` según la tarea o rol a ejecutar:
     - **Skills de Dominio SAT:**
       - `sat-design-enforcer` (`.agents/skills/sat-design-enforcer/SKILL.md`): Creación, edición y auditoría de componentes React/Tailwind y accesibilidad.
       - `sat-ia-governance` (`.agents/skills/sat-ia-governance/SKILL.md`): Clasificación y edición puntual del árbol jerárquico en `allTramites.json` y `categoryOrder.ts`.
       - `sat-ia-audit-sync` (`.agents/skills/sat-ia-audit-sync/SKILL.md` + `references/taxonomy-and-matrix-spec.md`): Ejecución del pipeline ETL en `scripts/`, validación de URLs (`HTTP 200 OK`) y sincronización de entregables Excel de 25 columnas.
       - `sat-content-relationships` (`.agents/skills/sat-content-relationships/SKILL.md` + `references/nosql-schema-queries.md`): Vinculación de gestiones relacionadas, ciclo ATO y modelado NoSQL en MongoDB.
     - **Skills de Roles y Gobernanza Multi-Agente ($\text{Orquestador} \to \text{Senior} \rightleftarrows \text{Junior} \to \text{QA}$):**
       - `orchestrator-governance` (`.agents/skills/orchestrator-governance/SKILL.md`): Orquestador (Lead Architect & Manager); planifica, no edita código fuente directamente y coordina ciclos entre Senior y QA.
       - `senior-developer` (`.agents/skills/senior-developer/SKILL.md`): Programador Senior; diseña arquitectura/core, delega módulos acotados al Junior, revisa/integra y entrega a QA.
       - `junior-developer` (`.agents/skills/junior-developer/SKILL.md`): Programador Junior; ejecuta tareas delimitadas asignadas por el Senior y reporta exclusivamente al Senior.
       - `qa-auditor` (`.agents/skills/qa-auditor/SKILL.md`): Auditor de QA (`EnableWriteTools: false`); audita en modo solo lectura y emite dictámenes `PASSED` / `FAILED` exclusivamente al Orquestador.
  - Está terminantemente prohibido asumir convenciones o proceder sin verificar estas fuentes; el objetivo primordial es evitar reincidir en errores previamente cometidos (tales como usar el término prohibido *"trámite"*, usar modales o popovers flotantes para mostrar contenido en vez de páginas dedicadas, nombrar niveles jerárquicos con rótulos inventados, alterar contratos sin actualizar dependencias, romper la simetría con categorías vacías en vez de guion largo `—`, o dejar acrónimos huérfanos).
- **Concisión y precisión:** Respuestas directas, al punto y sin rodeos ni complacencias.
- **Fundamento técnico:** Cada decisión, sugerencia o cambio de código debe estar rigurosamente justificado en hechos y estándares.
- **Proactividad:** Proponer e implementar soluciones completas, anticipando dependencias e impacto colateral.
- **Integridad de documentación:** Preservar comentarios existentes, anotaciones y docstrings a menos que se solicite explícitamente su refactorización.

---

## 2. Pila Tecnológica (Tech Stack)
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS.
- **Procesamiento de datos / ETL:** Python 3 (pandas, openpyxl, xlsxwriter) en directorio `scripts/`.
- **Testing:** Playwright (`tests/a11y.spec.ts`).

---

## 3. Comandos Esenciales
- **Servidor de desarrollo:** `npm run dev`
- **Compilación de producción:** `npm run build`
- **Tests de accesibilidad y e2e:** `npx playwright test`
- **Scripts de datos:** Ejecutar scripts específicos en `scripts/` utilizando `python scripts/<script_name>.py`.

---

## 4. Convenciones de Código
- Mantener tipado estricto en TypeScript en todo momento.
- No romper esquemas ni alterar contratos de datos en `src/data/` sin actualizar los componentes correspondientes.

---

## 5. Reglas de Arquitectura de Información y Gobernanza de Datos
1. **Los Niveles NO Tienen Nombre (Estructura Estrictamente Numérica N1–N5):** Queda terminantemente prohibido asignarle rótulos, sufijos o nombres conceptuales a los niveles jerárquicos (como "Segmento", "Régimen", "Área", "Subárea", "Actor", "Tema", "Subtema", "Tipo de Usuario", "Persona"). Los niveles son única y exclusivamente estructurales: **Nivel 1, Nivel 2, Nivel 3, Nivel 4, Nivel 5**. En matrices Excel, JSONs, UI, diagramas de React Flow y documentación, solo se deben rotular por su número de nivel (`Nivel X`), jamás con nombres inventados.
2. **Capacidad de Miller ($7 \pm 2$), Rango Óptimo y Margen de Tolerancia (10 Opciones):**
   - *Rango Óptimo:* Diseñar contenedores preferentemente entre 5 y 9 opciones. Nodos con $\le 7$ gestiones terminales (ej. Agentes Aduaneros) van en lista directa bajo N3.
   - *Tolerancia Excepcional de 10 Opciones:* Se permite un máximo de 10 opciones de forma residual y para un **porcentaje muy bajo del catálogo ($\le 5\%$)**, exclusivamente cuando la partición modular generaría sobre-andamiaje o fragmentación artificial, y siempre que cumpla con el resto de reglas (alta homogeneidad temática, ciclo ATO ordenado, lenguaje ciudadano y acceso en $\le 2-3$ clics).
   - *Sobrecarga ($\ge 11$ elementos):* Listas de 11 o más gestiones deben modularse obligatoriamente por subtema o ciclo ATO para evitar sobrecarga cognitiva.
3. **Regla de Umbral de Densidad y Ramificación Asimétrica ($A, A_1, A_2$):**
   - *Sub-densidad ($\le 3$ hojas terminales):* Se compacta obligatoriamente al nivel superior, eliminando carpetas pasarela y pantallas vacías.
   - *Alta densidad ($\ge 10$ gestiones con complejidad):* Se preserva la jerarquía profunda (N4/N5) para evitar el colapso de contexto.
   - *Asimetría rama por rama:* La profundidad nunca es uniforme para todo el catálogo; clasificar exige elegir entre $\ge 2$ opciones reales.
4. **Regla de Minimización de Clics sin Destruir la IA (*Breadth vs. Depth & Zero Pass-through Clicks*):** El usuario debe llegar a su contenido en la menor cantidad posible de clics (2 a 3 clics máximo). Cada clic debe representar una decisión consciente entre opciones alternativas; se prohíben clics pasarela que abran subcarpetas con una sola opción. La arquitectura no debe aplanarse ciegamente si eso provoca listas masivas indiferenciadas (colapso de contexto).
5. **Regla del Guion Largo (`—`) en Niveles No Clasificados (Anti-Simetría Forzada):** Queda prohibido obligar a que todas las gestiones llenen texto en los 5 niveles inventando categorías artificiales o títulos duplicados en espejo. Si una gestión o nodo no requiere clasificación intermedia en N3, N4 o N5, los campos de nivel y orden correspondientes se registran **estrictamente con un guion largo (`—`)**.
6. **Código Institucional Inmutable:** Usar siempre **`SAT-GES-####`** como identificador canónico universal (agnóstico al árbol, nivel, audiencia y denominación comercial). Los IDs de hojas históricas se archivan únicamente en `codigos_legacy`.
7. **Gobernanza del Orden y Desacoplamiento Numérico:** Prohibido quemar números en títulos visibles (`nombreActual`, `gestion`, `tramite`, `nivelX`). El orden se rige estrictamente por `orden_n1..orden_n5` siguiendo el ciclo ATO: 1. Empezar $\to$ 2. Operar $\to$ 3. Consultar $\to$ 4. Modificar/Cerrar $\to$ 5. Normativa.
8. **Matriz Canónica de 25 Columnas (Opción A Intercalada):** Mantener en sincronía la estructura de 25 columnas oficiales en todos los entregables vivos Excel y datasets.
9. **Validación Activa de URLs (Zero Enlaces Rotos y Zero Home Genérico):** Verificar activamente que cada gestión responda `HTTP 200 OK` directo al servicio. Enlaces caídos (`404`) o genéricos al Home (`/`) deben rastrearse e investigarse en el portal (`site:portal.sat.gob.gt`) para recuperar su ruta canónica activa.
10. **Plain Language (Lenguaje Ciudadano):** Títulos orientados a la acción con verbos en infinitivo o sustantivos precisos, cero acrónimos huérfanos y descripciones operativas claras.
11. **Gobernanza Documental Estricta y Sincronía Multidimensional:** Fuentes históricas inalterables (`docs/fuentes-datos/`). Entregables vivos (`.xlsx`), dataset JSON (`src/data/allTramites.json`) y contratos TypeScript (`src/data/categoryOrder.ts`) en rigurosa sincronía biunívoca.
12. **Prohibición Estricta de la Palabra "Trámite" $\to$ Uso Obligatorio de "Gestión" / "Gestiones":** Queda terminantemente prohibido utilizar el término "trámite" o "trámites" en interfaces de usuario, textos visibles, botones, encabezados, títulos, contadores, microcopys, badges y documentación ciudadana. En la administración tributaria y aduanera moderna, el término exacto es **"gestión" / "gestiones"**, dado que engloba tanto servicios interactivos transaccionales como consultas públicas, descargas, herramientas y guías operativas.
13. **Prohibición Estricta de Popovers, Modales y Overlays Flotantes para Contenido o Navegación:** Queda terminantemente prohibido mostrar contenidos de gestiones, fichas de información, requisitos, pasos o menús jerárquicos en ventanas modales flotantes, popovers, popups o overlays emergentes. Todo contenido de gestión debe presentarse en su propia **página completa dedicada** con URL canónica e indexable (`#/gestion/:id` o ruta web estándar), soporte íntegro del historial del navegador (atrás/adelante), miga de pan visible y accesibilidad garantizada sin trampas de foco.
