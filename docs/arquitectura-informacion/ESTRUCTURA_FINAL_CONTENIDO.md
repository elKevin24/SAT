# Estructura Final de Contenido y Taxonomía del Portal SAT

> **Documento Oficial de Arquitectura de Información**  
> **Versión:** 3.1 (Definitiva y Saneada)  
> **Fecha de Emisión:** Octubre 2026  
> **Alineación:** Estructura Institucional SAT Guatemala, Modelo de Ciclo de Vida ATO (Australian Taxation Office) & Plain Language  
> **Archivo Excel Fuente:** [`docs/Estructura_Final_Contenido_Portal_SAT.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/Estructura_Final_Contenido_Portal_SAT.xlsx)  
> **Base de Datos Única (Single Source of Truth):** [`src/data/allTramites.json`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/allTramites.json) (783 registros)

---

## 1. Resumen Ejecutivo

El presente documento consolida la totalidad de **783 contenidos y servicios** del portal de la Superintendencia de Administración Tributaria (SAT).

La estructura resuelve de manera definitiva:
1. **La jerarquía natural de 4 Segmentos y 9 Grupos Oficiales** establecida en el instrumento institucional *Detalle de Contenido para Grupos de Interés*.
2. **La eliminación de jerga técnica interna y prefijos numéricos**: Se erradica el uso de términos abstractos como *"canónico"* y prefijos como *"1. Empezar..."* en textos visibles para el ciudadano.
3. **El modelo simétrico de 5 Niveles ATO + Nivel 6+ de profundización libre**: Estructura de referencia escalable soportada por un modelo de base de datos relacional Padre/Hijo (`parent_id`), sin esquemas rígidos de columnas fijas (`categoria1` a `categoria9`).
4. **La separación formal entre Arquitectura de Información y Mecanismos de Navegación**:
   * **Arquitectura:** L1 Segmento, L2 Área, L3 Contexto, L4 Tema, L5 Contenido / Servicio, L6+ Profundización libre.
   * **Navegación:** Breadcrumb (ubicación dinámica adaptable), Sidebar (contexto local Nivel 4+, sin forzar réplica de 7 u 8 niveles), Contenido (página actual) y Enlaces Contextuales (navegación transversal).
5. **La no discriminación hacia trámites en Nivel 5:** Denominado **Contenido / Servicio**, dado que 528 de los 783 registros (67.4%) corresponden a guías informativas. La tipología de interacción determina la modalidad operativa.
6. **La integración de 307 rutas de procesos administrativos** vinculadas desde `Ruta de procesos.xlsx`.
7. **La documentación de 26 brechas operativas y normativas (`[Propuesta normativa SAT]`)**, identificadas para ser normadas por la mesa técnica institucional.

---

## 2. Los 4 Segmentos y los 9 Grupos Oficiales

| No. | Segmento Oficial | Texto Orientador de Interfaz (Estándar ATO) | Grupos Oficiales Integrados | Contenidos | Participación |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **1** | **Contribuyentes** | *Información y servicios tributarios para personas y empresas.* | NIT sin Obligaciones, Pequeños Contribuyentes, Contribuyente General, Contribuyentes Especiales | **413** | 52.7% |
| **2** | **Operadores de Comercio Exterior** | *Servicios e información aduanera para la importación, exportación y logística.* | Importadores, Exportadores, Transportistas, Agentes Aduaneros, Apoderados Especiales, Depósitos/Almacenes Fiscales, ZDEEP, Courier, OEA y Normativa | **246** | 31.4% |
| **3** | **Profesionales** | *Herramientas y servicios especializados para profesionales tributarios y auxiliares.* | Abogados y Notarios, Peritos Contadores, Auditores, Gestores Tributarios y Servicios Profesionales | **45** | 5.7% |
| **4** | **Entes Exentos** | *Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.* | Entidades del Estado, Constitucionales, No Lucrativos, Municipalidades y Entidades por Decreto | **79** | 10.1% |
| **TOTAL** | **4 Segmentos** | — | **Total Portal Web SAT** | **783** | **100.0%** |

---

## 3. Arquitectura de Información (IA) — Cómo está organizada la información

La **Arquitectura de Información (IA)** define la estructura lógica, la taxonomía y la clasificación ontológica de los contenidos del portal. Es un árbol relacional independiente de cualquier interfaz de usuario y puede alcanzar 6, 7, 8 o más niveles según la complejidad de la materia.

### A. Jerarquía de Información de Referencia (5 Niveles Base y Nivel 6+ Libre)

```
ARQUITECTURA DE INFORMACIÓN (Define el árbol)
│
├── Nivel 1 — Segmento / Audiencia (Macro-audiencia nacional)
│   └── Contribuyentes
│
├── Nivel 2 — Área / Dominio (Gran ámbito fiscal o aduanero)
│   └── Empleo y salarios
│
├── Nivel 3 — Contexto / Subárea (Situación o régimen del usuario)
│   └── Trabajar en relación de dependencia
│
├── Nivel 4 — Tema / Hub (Agrupador temático o sección)
│   └── ISR para empleados
│
├── Nivel 5 — Contenido / Servicio (Unidad funcional o ficha concreta)
│   ├── Retenciones de ISR
│   ├── Deducciones permitidas
│   ├── Declaración jurada anual
│   └── Constancia de retención
│
└── Nivel 6+ — Profundización libre (Subcontenido, Procedimiento, Detalle)
    └── Retenciones de ISR (L5)
        └── Cálculo de la retención (L6)
            └── Casos especiales (L7)
                └── Ejemplo de cálculo y tablas (L8)
```

> **Regla de Neutralidad en Nivel 5:** Se denomina **Contenido / Servicio** (no "Trámite / Contenido") porque 528 de los 783 registros (67.4%) son guías informativas. La tipología de interacción (`tipo_interaccion`) define si se trata de un *Trámite en Línea*, *Consulta a Base de Datos*, *Guía Informativa* o *Descarga / Software*.

### B. Persistencia en Base de Datos: Modelo Relacional Padre/Hijo (`parent_id`)
Para soportar profundidad ilimitada sin rigidez de esquema:
* Se descartan tablas con columnas fijas (`categoria1` a `categoria9`).
* Se utiliza un modelo recursivo donde cada nodo posee `id`, `parent_id` (nullable), `nombre`, `slug`, `nivel` y `orden`.
* Una rama simple puede tener 4 niveles mientras que una rama compleja (como retenciones o aduanas) puede tener 8 niveles en la misma tabla sin modificar la base de datos.

---

## 4. Modelo de Navegación del Portal — Cómo el usuario recorre la arquitectura

La **Navegación** es el conjunto de mecanismos interactivos que permiten al usuario moverse por la Arquitectura de Información. 

```
ARQUITECTURA DE INFORMACIÓN
       ↓
Organiza la información (el árbol)
       ↓
L1 → L2 → L3 → L4 → L5 → L6 → L7 → L8+
       ↓
       ↓ se representa y recorre mediante
       ↓
MODELO DE NAVEGACIÓN
       ↓
Permite recorrer el árbol (la interacción)
       ↓
Breadcrumb + Sidebar + Menú Principal + Enlaces Contextuales + Búsqueda
```

### A. Principio Rector: Desacoplamiento entre Profundidad y Presentación
> **Regla de Oro:** *Que un contenido se ubique en el Nivel 8 de la Arquitectura de Información NO significa que la interfaz deba renderizar ocho niveles de navegación simultáneos.*

#### Ejemplo de Desacoplamiento (Página en Nivel 8):
* **En la Arquitectura (IA - 8 Niveles):**
  `Contribuyentes (L1) › Empleo y salarios (L2) › Relación de dependencia (L3) › ISR (L4) › Retenciones (L5) › Cálculo (L6) › Casos especiales (L7) › Ejemplo (L8)`
* **En la Navegación Visual en Pantalla:**
  * **Breadcrumb:** `Inicio › … › Retenciones › Ejemplo` *(ubica jerárquicamente de forma compacta)*.
  * **Sidebar:** Despliega el hub local de ISR *(solo 4 ítems: Retenciones, Deducciones, Declaraciones, Constancias; NO replica 8 niveles)*.
  * **Contenido Central:** Muestra la página concreta: *Ejemplo de cálculo y tablas*.
  * **Enlaces Contextuales:** Conexión transversal: *«Ver tabla de deducciones generales»*.

---

### B. Componentes del Sistema de Navegación y sus Roles

| Componente | Rol en el Portal | Alcance en la Arquitectura | Comportamiento Responsive |
| :--- | :--- | :--- | :--- |
| **Menú Principal (Header)** | Orientación macro y cambio de audiencia | Niveles 1 y 2 | En desktop barra fija superior; en móvil menú tipo hamburguesa colapsable. |
| **Breadcrumb (Miga de Pan)** | Ubicación jerárquica del usuario | Dinámico (toda la ruta activa) | **Adaptable al espacio:** Desktop muestra la ruta completa o compacta; móvil usa compactación elíptica `[…]` (máx. 2–3 niveles visibles; `'Inicio'` no cuenta contra el límite). |
| **Sidebar (Menú Vertical)** | Navegación contextual del área de trabajo | Nivel 4 en adelante (local) | Despliega el hub local activo. **Tener Nivel 8 no obliga a un Sidebar de 8 niveles.** En móvil se convierte en Drawer / Accordion independiente. |
| **Contenido Central** | Resolución de la tarea o consulta | Nivel 5+ (página activa) | Renderiza la ficha concreta: requisitos, pasos, formulario o tablas. |
| **Enlaces Contextuales** | Navegación transversal y descubrimiento | Conexión horizontal libre | Saltos directos entre temas relacionados sin forzar subida/bajada por el árbol. |
| **Búsqueda Global** | Acceso directo indexado | Todos los niveles (L1 a L8+) | Búsqueda predictiva con filtros por segmento y tipología. |

---

### C. Especificación Responsive del Breadcrumb

#### Desktop ($\ge$ 1024px):
Muestra la ruta completa o balanceada según el ancho disponible:
`Inicio → Contribuyentes → Empleo y salarios → Trabajar en relación de dependencia → ISR para empleados → Retenciones`

#### Mobile (< 1024px):
1. **'Inicio' es el ancla raíz y NO computa como nivel de contenido.**
2. La jerarquía de contenidos se compacta mostrando máximo 2 o 3 elementos clave con elipsis intermedia `[…]`:
   `Inicio → […] → ISR para empleados → Retenciones`
3. Al pulsar `[…]`, se despliega un micro-menú interactivo con los niveles intermedios colapsados:
   * *Contribuyentes*
   * *Empleo y salarios*
   * *Trabajar en relación de dependencia*
4. **Variante Ultra-compacta (Formularios y flujos transaccionales):**
   `‹ Trabajar en relación de dependencia`

---

## 5. Matriz de Ciclo de Vida (Modelo ATO - Australia)

Cada contenido o servicio se clasifica en una de las 5 etapas vitales, **sin prefijos numéricos visibles**:

| Etapa ATO | Denominación Visible | Fichas | % Total | Alcance Funcional |
| :--- | :--- | :---: | :---: | :--- |
| `empezar` | **Empezar y registrarse** | **98** | 12.5% | Obtención de primer NIT, inscripción en RTU Digital, habilitación de padrones y autorizaciones iniciales. |
| `operar` | **Operación y declaraciones** | **282** | 36.0% | Facturación FEL, presentación y pago en Declaraguate, transmisión DUCA, retenciones y libros contables. |
| `consultar` | **Consultas y herramientas** | **135** | 17.2% | Verificadores públicos en tiempo real, solvencia fiscal, semáforo de rampa aduanera, arancel SAC y estado de cuentas. |
| `modificar_cerrar` | **Modificaciones y cierre** | **143** | 18.3% | Actualización de datos RTU, traspaso de vehículos, cambio de régimen contable, suspensión temporal y cese definitivo. |
| `normativa` | **Normativa y asistencia** | **125** | 16.0% | Marco legal aduanero y tributario, devolución de crédito fiscal, capacitaciones, recursos administrativos y criterios SAT. |

---

## 6. Clasificación por Tipología de Interacción (Nivel 5)

La naturaleza técnica y funcional del contenido o servicio se determina por su tipo de interacción:

| Tipo de Interacción | Etiqueta en Portal | Fichas | % Total | Descripción Funcional |
| :--- | :--- | :---: | :---: | :--- |
| `servicio_transaccional` | **Trámite en Línea** | **162** | 20.7% | Formularios web transaccionales, Declaraguate, DUCAs y solicitudes autenticadas en Agencia Virtual. |
| `consulta_datos` | **Consulta a Base de Datos** | **84** | 10.7% | Búsqueda en tiempo real sin expediente (verificador DTE, rampa aduanera, autenticidad de solvencias). |
| `guia_informativa` | **Guía Informativa** | **528** | 67.4% | Fichas en Lenguaje Ciudadano con requisitos normados, pasos secuenciales y base legal. |
| `descarga_recurso` | **Descarga / Software** | **9** | 1.2% | Componentes criptográficos (ActiveX PKI/DUA), instaladores locales y plantillas descargables. |

---

## 7. Inventario de Entregables del Repositorio

| Entregable | Ruta | Propósito |
| :--- | :--- | :--- |
| **Libro Excel Maestro** | [`docs/Estructura_Final_Contenido_Portal_SAT.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/Estructura_Final_Contenido_Portal_SAT.xlsx) | Archivo formal con 4 hojas: Resumen Ejecutivo, Matriz Maestra (783 filas), Comercio Exterior (246 filas) y Brechas Normativas (26 filas). |
| **Dataset Maestro JSON** | [`src/data/allTramites.json`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/allTramites.json) | Base de datos única con 783 registros, 5 niveles poblados y 307 rutas de procesos enlazadas. |
| **Tipos TypeScript** | [`src/data/portalMasterTaxonomy.ts`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/portalMasterTaxonomy.ts) | Definiciones tipadas estrictas de los 4 Segmentos, Etapas ATO, Tipologías y Rutas de Proceso. |
| **Componente Breadcrumbs** | [`src/components/ui/Breadcrumbs.tsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/components/ui/Breadcrumbs.tsx) | Componente UI accesible (WCAG 2.2 AA) con soporte responsive y compactación elíptica `[…]` sin computar Inicio en el límite. |
| **Reglas de Diseño UI/UX** | [`DESIGN_RULES.md`](file:///c:/Users/busqu/Documents/GitHub/SAT/DESIGN_RULES.md) | Principios de diseño, UX Writing sin números, tarjetas limpias y reglas de navegación profunda. |
| **Guía de Estilos Viva** | [`src/design-system/StyleGuide.tsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/design-system/StyleGuide.tsx) | Documentación interactiva de tokens, tarjetas, breadcrumbs y accesibilidad. |
| **Informe de Brechas** | [`docs/brechas-comercio-exterior.md`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/brechas-comercio-exterior.md) | Análisis de las 26 brechas operativas detectadas para validación con la Intendencia de Aduanas. |

---

## 8. Jerarquía de Referencias Normativas Internacionales

El portal web de la SAT adopta una gobernanza clara entre estándares de diseño y mejores prácticas web públicas:

```
DESIGN SYSTEM SAT GUATEMALA
           ↓
    AUTORIDAD PRINCIPAL
(Manual de Imagen V.5, tokens institucionales y componentes del portal)
           ↓
   REFERENCIAS EXTERNAS
(Estándares y mejores prácticas públicas adoptadas)
           ↓
├── GOV.UK Design System (Servicios públicos, formularios accesibles, tablas adaptativas y lenguaje ciudadano)
├── MDN Web Docs (Estándares técnicos web: viewports, CSS grid, media queries y layouts fluidos)
├── W3C WCAG 2.2 AA (Accesibilidad obligatoria: reflow, zoom 200%, áreas táctiles ≥ 44px, contraste)
├── web.dev (Rendimiento móvil, optimización de carga y Core Web Vitals)
└── Material Design Responsive Layouts (Referencia conceptual abstracta para breakpoints y grids)
```

> **Principio de Autoridad:** *Las referencias externas aportan buenas prácticas; el **Design System SAT** es la autoridad visual y de componentes del portal.*  
> **Exclusión Formal:** *Microsoft Fluent 2 queda fuera de la bibliografía de referencia para asegurar un enfoque 100% nativo de portal web público.*
