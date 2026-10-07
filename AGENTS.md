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
