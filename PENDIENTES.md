# Tareas Pendientes y Hoja de Ruta (Backlog Oficial) - Portal Web SAT

Este documento registra los puntos pendientes acordados para continuar con la evolución del **Portal Web SAT Guatemala**, siguiendo las reglas oficiales de diseño, arquitectura tributaria, Git Flow y UX Writing.

---

## 1. Limpieza de Secciones Redundantes en la Portada (`Home`)
- **Diagnóstico**: En la página de inicio (`App.tsx`) actualmente conviven las 4 tarjetas de segmentos principales (`UserSegmentCards`) con el carrusel de accesos rápidos (`QuickAccessCarousel`) y las pestañas de temas populares (`PopularTopicsTabs`), lo cual repite enlaces a los mismos trámites (NIT, FEL, Vehículos, Solvencias).
- **Acción a realizar**:
  - Evaluar el retiro o consolidación de los bloques secundarios repetitivos.
  - Dejar una portada limpia y minimalista donde el camino primario de exploración ciudadana sea la navegación directa por los 4 segmentos en tarjetas.

---

## 2. Optimización de la Ficha de Detalle de Requisitos (Al pulsar tarjeta de Nivel 4)
- **Diagnóstico**: Al hacer clic en un trámite específico en el nivel final de tarjetas, se abre la vista o modal de detalle de requisitos (`selectedTramite`).
- **Acción a realizar**:
  - Asegurar que la ficha aplique **UX Writing en Lenguaje Ciudadano** riguroso.
  - Estructurar los pasos en orden cronológico numerado (*"Paso 1: Solicita en línea"*, *"Paso 2: Confirma tu correo"*).
  - Incluir botón CTA claro (*"Iniciar Trámite en Agencia Virtual"*, *"Llenar Formulario Declaraguate"*).
  - Mantener la base legal en una sección secundaria o plegable para no sobrecargar cognitivamente al usuario.

---

## 3. Consistencia en la Búsqueda Global del Header (`Header.tsx`)
- **Diagnóstico**: El buscador del encabezado institucional debe estar sincronizado con la experiencia visual del catálogo.
- **Acción a realizar**:
  - Presentar los resultados de búsqueda global en la misma cuadrícula uniforme de mínimo **4 columnas en desktop** (`lg:grid-cols-4`).
  - Aplicar el fondo azul mínimo institucional (`#F0F7FC`) con borde sutil (`#CDE3F1`) para mantener coherencia total en todo el portal.

---

## 4. Integración Contextual de «Cultura tributaria y capacitación» (Ayuda, Guías y Cursos en Contexto)
- **Denominación Oficial de la SAT**: Toda la oferta formativa, cursos virtuales, diplomados, talleres, seminarios, guías interactivas y recursos de estudio se denomina formalmente **«Cultura tributaria y capacitación»** (o *Capacitación y orientación aduanera* en aduanas).
- **Diagnóstico**: Tradicionalmente en portales gubernamentales, estos recursos se aíslan en silos genéricos distantes (ej. una sección global aislada de "Cultura Tributaria" o "Descargas"). Esto obliga al usuario a abandonar el trámite que está intentando resolver para buscar capacitación o ayuda en otro lugar.
- **Regla y Mandato**:
  - **Cero silos desconectados**: Ningún curso o recurso de **«Cultura tributaria y capacitación»** debe existir como un trámite suelto o huérfano. Cada capacitación o material de estudio debe ubicarse **directamente dentro del mismo segmento, categoría y subtema de la gestión a la que asiste**.
  - **Ejemplos de aplicación canónica**:
    - *Curso: Obligaciones del Pequeño Contribuyente* ➔ Directamente en *Contribuyentes › Pequeños Contribuyentes › Pequeño Contribuyente*.
    - *Curso: Productores Agropecuarios y Artesanales* ➔ Directamente en *Contribuyentes › Pequeños Contribuyentes › Régimen Agropecuario (Primario / Pecuario)*.
    - *Capacitación: Factura y DUCA (FYDUCA)* ➔ Directamente en *Comercio Exterior › Importadores › Declaraciones Aduaneras y DUCAs*.
    - *Capacitación: Régimen Electrónico de Devolución de Crédito Fiscal* ➔ Directamente en *Comercio Exterior › Exportadores › Devolución de Crédito Fiscal*.
    - *Capacitación: Equipaje del Viajero y Franquicias* ➔ Directamente en *Comercio Exterior › Importadores › Mercancías en Abandono, Depósitos y Franquicias*.
    - *Capacitación / Instructivo: Adquisición de Papel Sellado y Timbres* ➔ Directamente en *Profesionales › Abogados y Notarios › Timbres Fiscales y Papel Sellado*.
- **Acción a realizar**:
  - Reubicar los 64 recursos de **«Cultura tributaria y capacitación»** distribuyéndolos de forma contextual en cada trámite respectivo dentro de los 4 segmentos (`contribuyentes`, `comercio_exterior`, `profesionales`, `organismos_especiales`).

---

## 5. Auditoría y Saneamiento Canónico de Datos por Segmento
- **Abogados y Notarios** (`profesionales`): ✅ **Completado**. Reestructurado en 4 subtemas canónicos (*Habilitación*, *Timbres y Papel Sellado*, *e-Traspasos* y *Avisos Notariales*).
- **Operadores de Comercio Exterior** (`comercio_exterior`): ✅ **Completado**. Reestructurado en 8 categorías oficiales (162 trámites canónicos):
  - *Importadores* (64 trámites en 6 subtemas: Padrón, DUCAs, Vehículos, Distribuidores, Despacho, Abandono/Franquicias).
  - *Exportadores* (21 trámites en 3 subtemas: Padrón, Devolución Crédito Fiscal, Embarques).
  - *Transportistas* (14 trámites: Equipos ATC, Manifiestos CUSCAR, Marchamo Electrónico).
  - *Agentes Aduaneros* (7 trámites: Habilitación y Sistemas).
  - *Normativa y Aranceles* (50 trámites: SAC, Acuerdos, COCONAD, Infraestructura, Consultas).
  - *OEA* (2), *Courier* (3), *Almacenes Fiscales* (1).
- **Peritos Contadores, Auditores y Gestores** (`profesionales`): ✅ **Completado**. Depurado el ruido tributario general (45 trámites limpios):
  - *Abogados y Notarios* (17 trámites canónicos).
  - *Peritos Contadores* (11 trámites: Habilitación/Registro y Consultas, Retenciones y Libros Contables).
  - *Gestores Tributarios* (8 trámites: Acreditación/Carné Oficial y Renovación/Gestión de Gafetes).
  - *Servicios Profesionales* (5 trámites: Honorarios, RTU, Consultas y Retenciones Web).
  - *Auditores* (4 trámites: Habilitación CPA y Dictámenes de Crédito Fiscal).
- **Entes Exentos y Organismos Especiales** (`organismos_especiales`): ✅ **Completado** (79 trámites canónicos):
  - *Entidades del Estado* (26 trámites limpios de gestión institucional y órdenes judiciales).
  - *Constitucionales* (18 trámites: Universidades, Colegios e Iglesias).
  - *Decreto* (16 trámites: Regímenes especiales, fomento y cooperativas).
  - *No Lucrativos* (14 trámites: ONGs, fundaciones, sindicatos y asociaciones).
  - *Municipalidades* (5 trámites: Registro, exenciones CIVA y patrimonio).
- **Contribuyentes**: ✅ **Completado** (404 trámites canónicos):
  - *NIT sin Obligaciones* (12 trámites en sus 4 subtemas).
  - *Pequeños Contribuyentes* (22 trámites: Régimen 5% y Régimen Agropecuario).
  - *Contribuyentes Especiales* (15 trámites: Gerencias de Grandes/Medianos y Retenciones).
  - *Contribuyente General* (355 trámites consolidados con gestión vehicular y servicios unificados).

---

## 6. Gestión de Ramas y Cierre en Git Flow
- **Rama activa**: `feature/portal-architecture-content`.
- **Acción a realizar**:
  - Al completar las tareas pendientes o estabilizar este sprint, realizar el merge hacia la rama `develop` siguiendo el estándar de Git Flow del repositorio.

---

*Documento actualizado: Octubre 2026*
