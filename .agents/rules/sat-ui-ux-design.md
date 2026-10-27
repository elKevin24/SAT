---
trigger: always_on
---

# Regla Oficial de Diseño, UI/UX, Lenguaje Ciudadano y Accesibilidad (SAT)

Esta regla es de cumplimiento obligatorio antes de crear o editar componentes React (`src/components/`, `src/pages/`), estilos Tailwind CSS (`src/index.css`, `src/design-system/`), textos de interfaz o flujos de navegación.

## 1. Prohibición Estricta de "Trámite" $\to$ Uso Obligatorio de "Gestión" / "Gestiones"
- Queda terminantemente prohibido utilizar la palabra *"trámite"* o *"trámites"* en interfaces de usuario, textos visibles, botones, encabezados, títulos, contadores, microcopys, badges y documentación ciudadana.
- El término institucional obligatorio es **"gestión" / "gestiones"**, ya que engloba servicios transaccionales, consultas públicas, descargas, herramientas y guías operativas.

## 2. Prohibición Estricta de Modales, Popovers y Overlays para Contenido o Navegación
- Queda terminantemente prohibido mostrar fichas de gestiones, requisitos, pasos normados o menús jerárquicos en ventanas modales (`<dialog>`, overlays fijos), popovers, popups o cuadros flotantes.
- **Página Completa Dedicada:** Toda gestión debe abrirse en su propia página completa con URL canónica e indexable (`#/gestion/:id`), soporte íntegro del botón Atrás/Adelante del navegador, miga de pan (*breadcrumb*) clickeable y módulo de gestiones relacionadas (*"En esta sección"*).

## 3. Tarjetas Compactas (Cards) del Design System SAT
- **Cero elementos parásitos:** Prohibido incluir íconos decorativos, conteos numéricos (`4 Grupos`, `350 Gestiones`) o textos/botones redundantes de pie (`Ver gestiones`, `Ver más`).
- **Contenido y estructura:** Presentan únicamente **Título en lenguaje claro** y **Descripción concisa** (máx. 2 oraciones). Toda la tarjeta es clickeable (`bg-white`, `border border-[#DCDCDC]`, `rounded-[14px]` o `rounded-[16px]`, grilla compacta con `gap-3` o `gap-3.5`).
- **Hover institucional sólido:** Al hacer `hover`, cambia al color del Nivel 1 (`hover:bg-[#14649B]`, `hover:bg-[#0284C7]`, `hover:bg-[#4D8014]`, `hover:bg-[#C25E00]`), aplica `hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]` y convierte todos los textos internos a blanco (`group-hover:text-white`).

## 4. UX Writing Ciudadano y Acrónimos
- **Títulos orientados a la acción:** Iniciar con verbos en infinitivo o sustantivos claros (*"Solicitar mi Número de Identificación Tributaria (NIT)"*, *"Emitir Factura Electrónica (FEL)"*).
- **Cero acrónimos huérfanos:** Expandir siempre la sigla en su primera mención (`Registro Tributario Unificado (RTU)`, `Declaración Única Centroamericana (DUCA - Aduanas)`, `Impuesto de Circulación de Vehículos (ISCV)`).
- **Descripción en 2 oraciones máximo:** 1) Qué es o para qué sirve + 2) Qué beneficio obtiene o qué necesita.

## 5. Desacoplamiento IA vs. Navegación, Mobile-First y WCAG 2.2 AA
- **Profundidad desacoplada:** La profundidad en la IA (N1–N5) no obliga a mostrar 5 niveles de menú simultáneos. El Sidebar muestra solo el hub local y el Breadcrumb aplica compactación elíptica `[…]` en pantallas `< 1024px`.
- **Responsive y Accesibilidad:** Contenedor `w-full max-w-7xl mx-auto` (`px-4 md:px-6 lg:px-8`), touch targets $\ge 44\times44\text{px}$ (`min-h-[48px]` en botones principales), contraste $\ge 4.5:1$, navegación completa por teclado sin trampas de foco y soporte de zoom 200% sin scroll horizontal.

> **Referencia normativa completa:** Consultar `docs/diseno-normativa/DESIGN_RULES.md`.
