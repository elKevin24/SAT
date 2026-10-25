---
name: sat-design-enforcer
description: Garantiza el cumplimiento estricto del Design System del SAT y de docs/diseno-normativa/DESIGN_RULES.md. Aplica tarjetas compactas sin íconos/números/botones redundantes, hover institucional, UX Writing en lenguaje ciudadano con acrónimos explicados, navegación en página completa (sin modales/popovers/overlays), enfoque mobile-first, responsive y accesibilidad WCAG 2.2 AA. Úsalo al crear/editar componentes en src/components/ o src/pages/, aplicar estilos con Tailwind o revisar UI.
---

# SAT Design Enforcer

## Objetivo
Asegurar que toda modificación visual o de UX respete the Design System oficial del SAT, manteniendo coherencia con `src/design-system/`, accesibilidad y las reglas de `docs/diseno-normativa/DESIGN_RULES.md`.

## Cuándo activarlo
- Al crear o editar componentes React (`src/components/`, `src/pages/`)
- Al aplicar o refactorizar estilos con Tailwind CSS
- Al revisar maquetaciones, tarjetas, listados o navegación
- Al corregir patrones visuales que incumplan el Design System
- Al trabajar con formularios, migas de pan o layouts responsive

## Lectura obligatoria (SIEMPRE primero)
Antes de cualquier acción, lee y valida:
- `docs/diseno-normativa/DESIGN_RULES.md`
- `src/design-system/tokens.css`
- `src/design-system/StyleGuide.tsx`
- Componentes existentes similares al que se vaya a crear/editar (para mantener paridad)

## Reglas inquebrantables

### 1) Tarjetas (Cards)
- **Sin íconos decorativos**: Cero íconos puramente decorativos.
- **Sin números o conteos**: Eliminar `X gestiones`, `N grupos`, etc.
- **Sin textos redundantes**: Prohibido "Ver gestiones", "Ver trámites" o equivalentes.
- **Toda la tarjeta clickeable**: El área completa debe ser interactiva.
- **Compactas**: Usar `gap-3` o `gap-3.5` entre tarjetas.
- **Estructura base**: `bg-white`, `border border-[#DCDCDC]`, `rounded-[14px]` o `rounded-[16px]`.
- **Hover institucional**: Al hacer `hover`, usar el color institucional del segmento (`hover:bg-[#14649B]`, `hover:bg-[#0284C7]`, `hover:bg-[#4D8014]`, `hover:bg-[#C25E00]`).
- **Efecto interactivo**: `hover:-translate-y-1`, `hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]`, con transición fluida.
- **Texto blanco en hover**: Aplicar `group` a la tarjeta y `group-hover:text-white` a todos los textos internos.

### 2) UX Writing y Acrónimos
- **Lenguaje ciudadano**: Usar verbos en infinitivo para títulos orientados a acción (`"Solicitar mi NIT"`, `"Emitir facturas electrónicas"`).
- **Acrónimos con expansión**: En primera mención, expandir el acrónimo (`Número de Identificación Tributaria (NIT)`). No dejar acrónimos huérfanos.
- **Descripción concisa**: Máximo 2 oraciones. 1) ¿Qué es/para qué sirve? 2) ¿Qué beneficio obtiene o qué necesita?
- **Sustituir jerga**: Preferir lenguaje claro frente a tecnicismos burocráticos.
- **Sin "trámite"/"trámites"**: Usar **"gestión"/"gestiones"** obligatoriamente en toda UI visible.

### 3) Navegación y Contenido
- **Página completa dedicada**: Toda ficha de gestión debe abrirse en su propia página con URL canónica. **Prohibido** modales, popovers, popups u overlays flotantes para mostrar gestiones, requisitos, pasos o navegación jerárquica.
- **Excepciones únicas**: Únicamente se permiten panel global de accesibilidad, asistente virtual conversacional o diálogos nativos de confirmación del sistema.
- **Migas de pan**: Deben ser visibles, clickeables y coherentes con la ruta jerárquica.
- **Historial del navegador**: Soportar atrás/adelante correctamente.

### 4) Responsive, Mobile-First y Accesibilidad
- **Mobile-first**: Diseñar primero para el viewport más reducido y escalar progresivamente.
- **Breakpoints SAT**: `< 768px` (mobile), `768–1023px` (tablet), `1024–1439px` (desktop), `≥ 1440px` (wide).
- **Contenedor**: `w-full max-w-7xl mx-auto` con gutters `px-4` → `px-6` → `px-8`.
- **Tipografía fluida**: Ajustar `H1/H2/H3/body` por breakpoint según lo indicado en `DESIGN_RULES.md`.
- **Touch targets**: Mínimo `44x44px`. Botones principales ≥ `48px` de altura.
- **Sin depender solo de `hover`**: Ninguna acción crítica o información esencial debe depender exclusivamente de `hover`.
- **Zoom 200%**: Debe funcionar sin scroll horizontal al hacer zoom al 200%.
- **WCAG 2.2 AA**: Contraste >= 4.5:1, foco visible, navegación por teclado, semántica correcta, sin trampas de foco.

## Flujo de trabajo
1. **Inspeccionar**: Revisar `tokens.css`, `StyleGuide.tsx` y componentes adyacentes.
2. **Analizar patrón**: Identificar si existe un componente reutilizable antes de crear uno nuevo.
3. **Diseñar coherente**: Aplicar reglas de tarjetas, UX Writing, hover institucional y espaciados.
4. **Validar responsive**: Comprobar en lógica mobile-first y breakpoints SAT.
5. **Comprobar A11y**: Foco, teclado, contraste, touch targets.
6. **Revisar navegación**: Asegurar página completa dedicada si es contenido de gestión. Sin modales/popovers.
7. **Pulir**: Mantener consistencia visual con el resto de la UI existente.

## Checklist de validación
- [ ] Sin íconos decorativos, sin conteos, sin botón/CTA redundante
- [ ] Tarjeta 100% clickeable con estructura y hover institucional correctos
- [ ] UX Writing con acrónimos explicados, verbos en infinitivo, sin "trámite"
- [ ] Sin modales/popovers/overlays para gestiones/requisitos/pasos/navegación
- [ ] Uso de tokens/estilos del Design System (`tokens.css` + `StyleGuide.tsx`)
- [ ] Mobile-first, breakpoints SAT, gutters correctos
- [ ] Touch targets >=44–48px, foco visible, teclado funcional
- [ ] Sin scroll horizontal con zoom 200%, contraste >= 4.5:1
- [ ] Coherente with components existentes

## Archivos clave
- `docs/diseno-normativa/DESIGN_RULES.md`
- `src/design-system/tokens.css`
- `src/design-system/StyleGuide.tsx`
- `src/components/`
- `src/pages/`
- `src/index.css`

## Restricciones
- **NO** añadir íconos decorativos
- **NO** usar números/conteos en tarjetas
- **NO** usar modales/popovers/overlays para contenido de gestión
- **NO** depender exclusivamente de `hover`
- **NO** romper accesibilidad para ganar "efecto"
- **NO** inventar colores/tokens fuera de los existentes
- **NO** usar "trámite"/"trámites"
- **NO** introducir patrones ajenos al Design System SAT
