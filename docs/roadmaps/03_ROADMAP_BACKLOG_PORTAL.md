# Roadmap 03: Backlog de Evolución y Trámites del Portal SAT

Este documento registra los puntos pendientes acordados para continuar con la evolución del **Portal Web SAT Guatemala**, siguiendo las reglas oficiales de diseño, arquitectura tributaria, Git Flow y UX Writing en Lenguaje Ciudadano.

---

## 📋 Lista de Control de Tareas (Checklist)

### 1. Limpieza de Secciones Redundantes en la Portada (`Home`)
- [ ] **1.1 Diagnóstico de redundancia visual**:
  - En la página de inicio (`App.tsx`) actualmente conviven las 4 tarjetas de segmentos principales (`UserSegmentCards`) con el carrusel de accesos rápidos (`QuickAccessCarousel`) y las pestañas de temas populares (`PopularTopicsTabs`), lo cual repite enlaces a los mismos trámites (NIT, FEL, Vehículos, Solvencias).
- [ ] **1.2 Acciones de consolidación**:
  - [ ] Evaluar el retiro o consolidación de los bloques secundarios repetitivos.
  - [ ] Dejar una portada limpia y minimalista donde el camino primario de exploración ciudadana sea la navegación directa por los 4 segmentos en tarjetas.

---

### 2. Optimización de la Ficha de Detalle de Requisitos (Modal de Ficha de Servicio)
- [ ] **2.1 Estructura en Lenguaje Ciudadano**:
  - Al abrir un trámite específico (`selectedTramite`), estructurar los requisitos en pasos secuenciales cronológicos numerados (*"Paso 1: Solicita en línea"*, *"Paso 2: Confirma tu correo"*, *"Paso 3: Descarga tu constancia"*).
- [ ] **2.2 Llamado a la Acción (CTA) destacado**:
  - Botón principal visible y accesible (*"Iniciar Trámite en Agencia Virtual"*, *"Llenar Formulario en Declaraguate"*).
- [ ] **2.3 Base Legal secundaria**:
  - Mantener la fundamentación normativa dentro de un acordeón o sección secundaria colapsable para evitar la sobrecarga cognitiva del contribuyente.

---

### 3. Navegación Dual Breadcrumbs + Sidebar y Navegación Profunda (Nivel 6+)
- [x] **3.1 Especificación conceptual y técnica**:
  - Documentada en `DESIGN_RULES.md` y `docs/ESTRUCTURA_FINAL_CONTENIDO.md`.
- [x] **3.2 Componente `Breadcrumbs.tsx`**:
  - Implementado con soporte W3C / WCAG 2.2 AA y compactación responsive móvil con micro-menú elíptico `[…]`.
- [x] **3.3 Componente `SidebarNav.tsx`**:
  - Implementado con árbol jerárquico sticky para desktop ($\ge 1024$px) y Drawer modal accesible para dispositivos móviles ($< 1024$px).
- [x] **3.4 Integración viva**:
  - Conectado en `SegmentTramitesCatalog.tsx` y presentado en `src/design-system/StyleGuide.tsx`.

---

### 4. Consistencia en la Búsqueda Global del Header (`Header.tsx`)
- [ ] **4.1 Rejilla de resultados unificada**:
  - El buscador del encabezado institucional debe presentar los resultados en una cuadrícula uniforme de mínimo 4 columnas en desktop (`lg:grid-cols-4`).
- [ ] **4.2 Estilo visual institucional**:
  - Aplicar el fondo neutro con borde sutil para mantener coherencia total con las tarjetas del catálogo.

---

### 5. Integración Contextual de «Cultura Tributaria y Capacitación»
- [ ] **5.1 Homologación de denominación oficial SAT**:
  - Toda la oferta formativa, cursos virtuales, diplomados, talleres y guías se denomina formalmente **«Cultura tributaria y capacitación»** (o *Capacitación y orientación aduanera* en el área aduanera).
- [ ] **5.2 Eliminación de silos formativos aislados**:
  - Ningún recurso formativo debe figurar como un trámite huérfano.
  - Vincular cada capacitación directamente en el segmento, categoría y subtema correspondiente:
    - *Curso: Obligaciones del Pequeño Contribuyente* ➔ en *Contribuyentes › Pequeños Contribuyentes › Régimen de Pequeño Contribuyente*.
    - *Capacitación: Factura y DUCA (FYDUCA)* ➔ en *Comercio Exterior › Importadores › Declaraciones Aduaneras y DUCAs*.
    - *Capacitación: Devolución de Crédito Fiscal* ➔ en *Comercio Exterior › Exportadores › Devolución de Crédito Fiscal*.
    - *Instructivo: Papel Sellado y Timbres* ➔ en *Profesionales › Abogados y Notarios › Timbres Fiscales y Papel Sellado*.

---

### 6. Consulta y Validación de Brechas de Comercio Exterior (26 Casos)
- [x] **6.1 Identificación y mapeo**:
  - 26 trámites operativos aduaneros (Almacenes Fiscales, DAT, ZDEEP, Courier, Apoderados, Agentes y Exportadores) documentados en `docs/brechas-comercio-exterior.md`.
- [x] **6.2 Distintivo en la interfaz**:
  - Distintivo visual neutral `Propuesta normativa SAT` activo en el catálogo.
- [ ] **6.3 Validación formal con Mesa Técnica SAT**:
  - Presentar la matriz de preguntas a la Intendencia de Aduanas para formalizar requisitos normativos, resoluciones y flujos definitivos.
