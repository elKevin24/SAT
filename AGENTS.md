# Directrices y Reglas del Proyecto SAT

## 1. Principios de Comportamiento y Estilo
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

## 5. Reglas de Arquitectura de Información y Datos
- **Capacidad de Miller ($7 \pm 2$):** Diseñar contenedores entre 5 y 9 opciones. Nodos con $\le 7$ trámites terminales (ej. Agentes Aduaneros) van en lista directa bajo N3. Listas $> 9$ deben modularse.
- **Regla de Umbral de Densidad ($A, A_1, A_2$):** Sub-densidad ($\le 2$ hojas terminales) $\to$ se compacta al nivel superior. Alta densidad ($\ge 10$ trámites con complejidad) $\to$ se preserva la jerarquía profunda (N4/N5).
- **Código Institucional Inmutable:** Usar siempre **`SAT-GES-####`** como identificador canónico universal (agnóstico al árbol, segmento y nombre). Los IDs de hojas se preservan como `codigos_legacy`.
- **Gobernanza del Orden:** Prohibido quemar números en títulos visibles. El orden se rige estrictamente por `orden_n1..orden_n5` siguiendo el ciclo ATO (1. Empezar $\to$ 2. Operar $\to$ 3. Consultar $\to$ 4. Modificar $\to$ 5. Normativa).
- **Matriz Canónica de 25 Columnas:** Mantener en sincronía la estructura de 25 columnas (Opción A) en todos los entregables vivos.
- **Validación Activa de URLs (Zero Enlaces Rotos):** Verificar que cada trámite tenga una URL funcional en el portal (`HTTP 200 OK`). Enlaces caídos (`404`) o genéricos al Home (`/`) deben rastrearse e investigarse en el portal (`site:portal.sat.gob.gt`) para recuperar su ruta canónica activa.
