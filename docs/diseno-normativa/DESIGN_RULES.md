# Reglas Oficiales de Diseño y UI/UX - SAT Guatemala

Este documento establece los principios de diseño, estilo, accesibilidad y **UX Writing en Lenguaje Ciudadano** obligatorios para el proyecto del **Portal Web SAT Guatemala**.

---

## 1. Regla de Tarjetas (Cards) Compactas sin Íconos, sin Números y sin Botones Redundantes
- **Cero íconos decorativos en tarjetas**: Las tarjetas **NO deben contener íconos gráficos**.
- **Cero números o conteos administrativos**: Eliminar etiquetas como `4 Grupos`, `350 Trámites`, `7 pasos`, etc.
- **Sin textos de pie redundantes (ej. "Ver trámites")**: 
  - Toda la tarjeta es un área clickeable uniforme.
  - La tarjeta presenta exclusivamente: **Título en lenguaje claro** y **Descripción concisa con UX Writing**.
- **Espaciado y gap compacto**:
  - `gap-3` o `gap-3.5` entre tarjetas para evitar dispersión visual innecesaria y optimizar el espacio en pantalla.

---

## 2. Guía de UX Writing y Tratamiento de Acrónimos Tributarios

En el ámbito fiscal y aduanero de la SAT, el ciudadano promedio suele confundirse con tecnicismos y siglas. Se aplican las siguientes reglas de **Plain Language (Lenguaje Claro)**:

### A. Regla de Acrónimos y Siglas
1. **Siempre acompañar la sigla de su significado o propósito en el contexto**:
   - ❌ *RTU Digital* ➔  *Registro Tributario Unificado (RTU)*
   - ❌ *SOFI* ➔  *Solvencia Fiscal en Línea*
   - ❌ *ISCV* ➔  *Impuesto de Circulación de Vehículos*
   - ❌ *FEL / DTEs* ➔  *Factura Electrónica (FEL)*
   - ❌ *CUI / DPI* ➔  *Número de DPI (Código Único de Identificación)*
   - ❌ *DUCA* ➔  *Declaración Única Centroamericana (DUCA - Aduanas)*
   - ❌ *OEA* ➔  *Operador Económico Autorizado (Empresa Certificada en Seguridad)*
   - ❌ *IVA / ISR* ➔  *Impuesto al Valor Agregado (IVA) / Impuesto Sobre la Renta (ISR)*

### B. Sustitución de Jerga Burocrática por Lenguaje Ciudadano
| Término Interno / Burocrático | Término Ciudadano Recomendado (UX Writing) |
| :--- | :--- |
| *Sujeto Pasivo / Contribuyente afecto* | *Personas y Empresas con o sin negocio* |
| *Omisos tributarios* | *Consultar pagos o declaraciones pendientes* |
| *Régimen de Rentas del Trabajo* | *Impuestos para personas con empleo o salario* |
| *Distintivos electrónicos del Registro Fiscal* | *Tarjeta de circulación y calcomanía vehicular* |
| *Transacción de cambio de régimen* | *Paso de persona sin negocio a persona con negocio* |
| *Auxiliares de la Función Pública Aduanera* | *Agentes de aduanas, transporte y logística* |
| *Constancia de Adquisición de Insumos* | *Constancia de compra libre de impuestos para entidades exentas* |

### C. Redacción Orientada a la Acción y al Beneficio
- **Títulos con verbos de acción directa**: Priorizar verbos en infinitivo que respondan a la intención del usuario (*"Solicitar mi NIT"*, *"Emitir facturas electrónicas"*, *"Actualizar mis datos"*).
- **Descripciones en 2 oraciones máximo**:
  1. *Qué es o para qué sirve*.
  2. *Qué beneficio obtiene o qué necesita para realizarlo*.

### D. Patrón Modelo Oficial (Benchmark de UX Writing Ciudadano)
> **Número de Identificación Tributaria (NIT)**  
> *Cómo solicitar un Número de Identificación Tributaria (NIT), actualizar sus datos, consultar su NIT y qué hacer si ha sido utilizado de forma indebida.*
>
> *(Aplica acrónimo expandido en primera mención, verbos de acción directa y atención proactiva al problema ciudadano de uso indebido).*

---

## 3. Uso Mínimo y Restringido de Iconografía
- La iconografía se restringe a controles funcionales indispensables (lupa de búsqueda, flechas `<` `>`, botón de cerrar `×`, o menú móvil).
- Cero saturación visual con íconos decorativos o repetitivos.

---

## 4. Estilo Estándar de las Tarjetas (SAT Design System Original)
- **Estructura**: `bg-white`, borde `border border-[#DCDCDC]`, esquinas `rounded-[16px]` o `rounded-[14px]`.
- **Efecto Hover Sólido Interactivo**:
  - Al pasar el cursor (`hover`), el fondo cambia al color institucional del segmento (`hover:bg-[#14649B]`, `hover:bg-[#0284C7]`, `hover:bg-[#4D8014]`, `hover:bg-[#C25E00]`).
  - Sombra suave `hover:shadow-[0_14px_30px_rgba(...)]` y elevación `hover:-translate-y-1`.
  - Transición automática de todos los textos interiores a blanco (`group-hover:text-white`).

---

## 5. Accesibilidad y Modo Claro (WCAG 2.2 AA & Heurísticas Nielsen)
- Fondos neutros y claros (`#FFFFFF`, `#F8FAFC`).
- Contraste tipográfico superior a 4.5:1 para texto normal.
- Prevención de errores con validaciones claras y ayudas contextuales sin lenguaje sancionatorio.

---

## 6. Arquitectura del Viaje del Contribuyente (Taxpayer Journey)
Para el detalle exhaustivo del ciclo de vida, la jerarquía de las 5 categorías oficiales y las 6 etapas cronológicas de navegación, consultar:
- [TAXPAYER_JOURNEY.md](file:///mnt/datos/GitHub/SAT/TAXPAYER_JOURNEY.md)

---

## 7. Arquitectura de Información (IA) vs. Sistemas de Navegación

### A. Distinción Conceptual Fundamental
> **Principio de Desacoplamiento:** *Arquitectura de Información y Navegación NO son lo mismo. La arquitectura define el árbol lógico de contenidos; la navegación define cómo el usuario recorre ese árbol.*
>
> **La Tríada de Responsabilidades:**
> * **IA:** Qué está organizado y cómo se relaciona.
> * **Navegación:** Cómo el usuario recorre esa estructura.
> * **Responsive Design:** Cómo esa navegación y contenido se adaptan al viewport.

```
ARQUITECTURA DE INFORMACIÓN (IA)
       ↓
Organiza la información (el árbol lógico)
       ↓
L1 (Segmento) → L2 (Área) → L3 (Contexto) → L4 (Tema) → L5 (Contenido/Servicio) → L6+ (Profundización)
       ↓
       ↓ se representa y recorre mediante
       ↓
SISTEMAS DE NAVEGACIÓN
       ↓
Permite recorrer el árbol (la interacción visual)
       ↓
Breadcrumb + Sidebar + Menús + Enlaces Contextuales + Búsqueda
       ↓
       ↓ se adapta al viewport mediante
       ↓
RESPONSIVE DESIGN (Presentación)
       ↓
Mobile (< 768px) │ Tablet (768–1023px) │ Desktop (≥ 1024px) │ Wide Desktop (≥ 1440px)
```

### B. Regla de Profundidad Desacoplada
> **Regla Clave:** *Que un contenido se ubique en el Nivel 8 de la Arquitectura de Información NO implica que la interfaz deba mostrar ocho niveles de navegación simultáneamente.*

* **Ejemplo en IA (8 Niveles):**
  `Contribuyentes (L1) › Empleo y salarios (L2) › Relación de dependencia (L3) › ISR (L4) › Retenciones (L5) › Cálculo (L6) › Casos especiales (L7) › Ejemplo (L8)`
* **Mapeo en Navegación:**
  * **Breadcrumb:** `Inicio › … › Retenciones › Ejemplo` *(orientación jerárquica compacta)*.
  * **Sidebar:** Despliega el hub local de ISR *(solo 4 ítems: Retenciones, Deducciones, Declaraciones, Constancias; NO replica 8 niveles)*.
  * **Contenido Central:** Página actual: *Ejemplo de cálculo y tablas*.
  * **Enlaces Contextuales:** Conexiones transversales directas entre contenidos relacionados.

### C. Capas de la Arquitectura de Información (Modelo Padre/Hijo)
1. **Nivel 1 — Segmento / Audiencia:** Macro-audiencia (ej. *Contribuyentes*).
2. **Nivel 2 — Área / Dominio:** Gran ámbito (ej. *Empleo y salarios*).
3. **Nivel 3 — Contexto / Subárea:** Situación del usuario (ej. *Trabajar en relación de dependencia*).
4. **Nivel 4 — Tema / Hub:** Agrupador temático (ej. *ISR para empleados*).
5. **Nivel 5 — Contenido / Servicio:** Unidad funcional concreta (ej. *Retenciones de ISR*). No sesgado a trámites (el 67% son guías informativas); `tipo_interaccion` define la modalidad técnica.
6. **Nivel 6+ — Profundización libre:** Subcontenido, procedimiento, detalle o cálculo soportado en BD mediante `parent_id` recursivo sin columnas fijas `categoria1..9`.

### D. Distribución Funcional de los Mecanismos de Navegación
1. **Breadcrumb (Ubicación Jerárquica):**
   - Representa la ubicación jerárquica del usuario y **se adapta dinámicamente** a la profundidad de la ruta y al espacio disponible.
   - En desktop muestra la ruta completa o compacta según espacio.
   - En móvil utiliza **compactación elíptica** para ocultar niveles intermedios.
2. **Sidebar (Navegación Contextual Local):**
   - Despliega el contexto local relevante (Nivel 4 en adelante).
   - **Regla estricta:** Un Nivel 7 u 8 en la arquitectura **no implica obligatoriamente construir un Sidebar de 7 u 8 niveles**. El Sidebar muestra el sub-árbol inmediato de la sección activa. En móvil se convierte en Drawer independiente.
3. **Contenido Central (Página Actual):**
   - Renderiza la ficha concreta del servicio, guía, aplicativo o consulta (Nivel 5+).
4. **Enlaces Contextuales (Navegación Transversal):**
   - Conexiones laterales entre contenidos relacionados sin forzar subida/bajada por el árbol.

### E. Comportamiento Responsive del Breadcrumb (Desktop vs. Mobile)

#### En Desktop (Pantallas $\ge$ 1024px):
- Muestra la ruta completa navegable:
  `Inicio → Contribuyentes → Empleo y salarios → Trabajar en relación de dependencia → ISR para empleados → Retenciones`
- Si la ruta excede el ancho disponible del contenedor, colapsa los niveles intermedios superiores manteniendo siempre los nodos clave.

#### En Mobile (Pantallas < 1024px):
- **'Inicio' es el ancla raíz y NO cuenta como parte de los 2–3 niveles de contenido.**
- La jerarquía de contenidos muestra máximo 2 o 3 elementos visibles, ocultando los niveles intermedios con `[…]`:
  `Inicio → […] → ISR para empleados → Retenciones`
- **Interacción Elíptica:** Al pulsar `[…]`, se abre un menú accesible con los niveles intermedios colapsados:
  - *Contribuyentes*
  - *Empleo y salarios*
  - *Trabajar en relación de dependencia*
- **Variante Ultra-compacta (Sub-páginas y formularios transaccionales):**
  Se permite botón de retorno al nivel padre inmediato:
  `‹ Trabajar en relación de dependencia`

---

## 8. Sistema Normativo de Responsive Design & Mobile First

### A. Regla Fundamental
> **Regla de Oro:** *Diseñar primero para el espacio disponible más limitado y ampliar progresivamente la experiencia conforme aumenta el viewport, sin alterar la arquitectura de información ni la funcionalidad esencial.*
>
> *Responsive Design pertenece exclusivamente a la capa de presentación/interacción; NO modifica la Arquitectura de Información. La IA de 783 contenidos permanece idéntica en 360px y en 1920px.*

### B. Breakpoints Oficiales del Portal SAT
| Rango | Ancho Viewport | Dispositivos Clave | Estrategia de Layout |
| :--- | :--- | :--- | :--- |
| **Mobile** | `< 768px` | Smartphones (320px – 430px) | 1 columna, Drawer off-canvas, Breadcrumb con `[…]`, full-width buttons. |
| **Tablet** | `768px – 1023px` | iPads, Tablets, Plegables | 2 columnas, menús colapsables contextuales. |
| **Desktop** | `1024px – 1439px` | Laptops estándar, Monitores HD | 3 a 4 columnas, Sidebar vertical fijo visible, Breadcrumb expandido. |
| **Wide Desktop** | `≥ 1440px` | Pantallas 2K/4K, Ultrawide | `max-w-7xl` (1280px centrado), márgenes laterales generosos, cero dispersión. |

### C. Invariabilidad vs. Variabilidad
* **Invariable (Cero Cambios por Pantalla):** Nomenclatura oficial, catálogo de contenidos, jerarquía taxonómica (L1 a L6+), reglas de negocio, contrastes WCAG y acciones disponibles.
* **Variable (Adaptación por Viewport):** Distribución de columnas, tamaño y padding de componentes, mecanismo de navegación local (Sidebar $\leftrightarrow$ Drawer), presentación de tablas (Tabla $\leftrightarrow$ Tarjetas) y compactación elíptica de breadcrumbs.

### D. Sistema de Layout y Tipografía Fluida
* **Contenedor:** `w-full max-w-7xl mx-auto`.
* **Gutters Laterales:** `px-4` (móvil) $\rightarrow$ `px-6` (tablet) $\rightarrow$ `px-8` (desktop).
* **Separación de Bloques:** `space-y-6` (móvil) $\rightarrow$ `space-y-10` (desktop).
* **Escala Tipográfica:**
  * `H1`: `text-2xl` (móvil) $\rightarrow$ `text-4xl` (desktop).
  * `H2`: `text-xl` (móvil) $\rightarrow$ `text-2xl` (desktop).
  * `H3`: `text-base` (móvil) $\rightarrow$ `text-lg` (desktop).
  * `Body`: `text-sm` (móvil) $\rightarrow$ `text-base` (desktop).

### E. Ergonomía Táctil y Accesibilidad (Touch Targets)
* **Área Táctil Mínima:** $44 \times 44$ px (móvil estándar) y botones de acción principal $\ge 48$ px de altura.
* **Cero dependencia de `hover`:** Ninguna función crítica o información depende exclusivamente del cursor.
* **Resiliencia ante Zoom 200%:** La interfaz no genera scroll horizontal al escalar fuentes.

### F. Matriz de Certificación de Viewports
* **Mobile:** 320px (mínimo técnico), 360px (Android estándar), 390px (iOS estándar).
* **Tablet:** 768px (iPad vertical).
* **Desktop:** 1024px (laptop 13"), 1280px (monitor HD), 1440px (2K) y 1920px (Full HD).

### G. Jerarquía de Referencias Normativas y Buenas Prácticas

```
DESIGN SYSTEM SAT GUATEMALA
           ↓
    AUTORIDAD PRINCIPAL
(Manual V.5, tokens institucionales y componentes vivos)
           ↓
   REFERENCIAS EXTERNAS
(Aportan estándares técnicos y mejores prácticas públicas)
           ↓
├── GOV.UK Design System (Servicios públicos, formularios, tablas y lenguaje ciudadano)
├── MDN Web Docs (Estándar técnico web: media queries, viewports, grid fluido)
├── W3C WCAG 2.2 AA (Accesibilidad obligatoria: reflow, zoom 200%, touch targets ≥ 44px)
├── web.dev (Rendimiento móvil moderno y Core Web Vitals)
└── Material Design Responsive Layouts (Referencia conceptual abstracta de grids; cero estética Material)
```

> **Regla de Autoridad:** *Las referencias externas aportan buenas prácticas técnicas y de usabilidad pública; el **Design System SAT** es la autoridad visual y de componentes del portal.*  
> **Exclusión Formal:** *Microsoft Fluent 2 queda formalmente excluido de la bibliografía de referencia para asegurar un enfoque 100% nativo de web pública institucional.*

---

*Fecha de actualización: Octubre 2026*
