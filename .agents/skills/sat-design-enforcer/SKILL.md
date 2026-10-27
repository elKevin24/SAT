---
name: sat-design-enforcer
description: >-
  Garantiza el cumplimiento estricto del Design System del SAT y de docs/diseno-normativa/DESIGN_RULES.md.
  Aplica tarjetas compactas sin íconos/números/botones redundantes, hover institucional, UX Writing en
  lenguaje ciudadano con acrónimos explicados, navegación en página completa dedicada (sin modales,
  popovers ni overlays), layout mobile-first y accesibilidad WCAG 2.2 AA. Úsalo cuando el usuario pida
  crear, editar o auditar componentes React en src/components/ o src/pages/, aplicar estilos con Tailwind
  CSS o corregir la interfaz de usuario.
---

# SAT Design Enforcer (UI/UX, Design System y Accesibilidad)

Asegura que toda creación o modificación de interfaz en React y Tailwind CSS cumpla estrictamente las normas de [`docs/diseno-normativa/DESIGN_RULES.md`](../../../docs/diseno-normativa/DESIGN_RULES.md) y los tokens de [`src/design-system/tokens.css`](../../../src/design-system/tokens.css).

## 1. Lectura Previa Obligatoria

Antes de escribir o modificar cualquier componente visual, inspecciona:
1. [`docs/diseno-normativa/DESIGN_RULES.md`](../../../docs/diseno-normativa/DESIGN_RULES.md) (reglas de tarjetas, acrónimos, breadcrumbs y página completa).
2. [`src/design-system/tokens.css`](../../../src/design-system/tokens.css) y [`src/design-system/StyleGuide.tsx`](../../../src/design-system/StyleGuide.tsx).
3. Componentes adyacentes en `src/components/` o `src/pages/` para preservar paridad visual.

---

## 2. Reglas de Diseño Inquebrantables (Grado de Libertad Bajo)

### A. Tarjetas Compactas (Cards)
- **Cero elementos parásitos:** Prohibido incluir íconos decorativos, conteos numéricos (`X gestiones`, `N grupos`) o botones/textos de pie redundantes (`Ver gestiones`, `Ver más`).
- **Contenido exclusivo:** Solo **Título en lenguaje claro** y **Descripción concisa** (máximo 2 oraciones).
- **Área 100% interactiva:** Toda la tarjeta es un enlace o botón completo con `group`, `bg-white`, `border border-[#DCDCDC]`, `rounded-[14px]` o `rounded-[16px]`, y espaciado `gap-3` o `gap-3.5` en grillas.
- **Hover institucional sólido:**
  - Fondo según Nivel 1: `hover:bg-[#14649B]`, `hover:bg-[#0284C7]`, `hover:bg-[#4D8014]` o `hover:bg-[#C25E00]`.
  - Elevación y sombra: `hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)] transition-all`.
  - Contraste en hover: Todos los textos internos cambian a blanco con `group-hover:text-white`.

### B. UX Writing Ciudadano y Terminología
- **Prohibido "trámite" / "trámites":** Usar obligatoriamente **"gestión" / "gestiones"** en cualquier texto visible, badge, contador, título o microcopy.
- **Títulos orientados a la acción:** Iniciar con verbos en infinitivo o sustantivos directos (`"Solicitar Número de Identificación Tributaria (NIT)"`, `"Emitir Factura Electrónica (FEL)"`).
- **Cero acrónimos huérfanos:** Expandir siempre la sigla en su primera mención:
  - `Registro Tributario Unificado (RTU)` | `Factura Electrónica (FEL)` | `Declaración Única Centroamericana (DUCA - Aduanas)` | `Impuesto de Circulación de Vehículos (ISCV)`.
- **Fórmula de descripción (máx. 2 oraciones):** 1) Qué es o para qué sirve + 2) Qué beneficio obtiene o qué necesita.

### C. Navegación en Página Completa Dedicada (Cero Modales)
- **Prohibición absoluta de overlays para contenido:** Queda prohibido usar modales (`<dialog>`, overlays fijos), popovers o popups para mostrar fichas de gestiones, requisitos, pasos o menús jerárquicos.
- **Patrón de página dedicada:** Toda gestión se abre en su propia vista completa con URL canónica (`#/gestion/:id`), soporte de botón Atrás/Adelante del navegador, miga de pan (*breadcrumb*) clickeable y bloque lateral/inferior *"En esta sección"*.
- **Breadcrumb adaptable:** Ruta completa en Desktop (`>= 1024px`) y compactación elíptica con `[…]` desplegable en Mobile (`< 1024px`).

### D. Mobile-First, Responsive y Accesibilidad WCAG 2.2 AA
- **Breakpoints SAT:** Mobile (`< 768px`, 1 col, Drawer), Tablet (`768–1023px`, 2 cols), Desktop (`1024–1439px`, 3–4 cols, Sidebar fijo), Wide (`>= 1440px`, `max-w-7xl mx-auto`).
- **Gutters y escala fluida:** Contenedor con `px-4 md:px-6 lg:px-8`.
- **Ergonomía táctil y teclado:** Touch targets mínimos de `44x44px` (`min-h-[48px]` en botones primarios), foco visible (`focus-visible:ring`), contraste $\ge 4.5:1$, cero dependencia exclusiva de `:hover` y soporte de zoom al 200% sin scroll horizontal.

---

## 3. Flujo de Trabajo y Bucle de Verificación (Verification Loop)

1. **Implementar o refactorizar** el componente en `src/components/` o `src/pages/` aplicando las reglas anteriores.
2. **Verificar ausencia de términos prohibidos** en los archivos editados (buscar `"trámite"` / `"tramite"` insensible a mayúsculas en textos visibles).
3. **Ejecutar compilación de producción:**
   ```powershell
   npm run build
   ```
   Si hay errores de TypeScript o JSX, corregirlos de inmediato.
4. **Ejecutar auditoría automatizada de accesibilidad y UI (Playwright + axe-core):**
   ```powershell
   npx playwright test tests/a11y.spec.ts
   ```
   Si axe-core o las aserciones de layout fallan, inspeccionar el reporte de error, corregir el contraste/etiqueta ARIA/estructura y re-ejecutar el test hasta que pase al 100%.
