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

## 4. Integración Contextual de Recursos de Ayuda, Capacitaciones y Guías (Ayuda en Contexto)
- **Diagnóstico**: Tradicionalmente en portales gubernamentales, las guías de estudio, capacitaciones virtuales, preguntas frecuentes (FAQ) y manuales se aíslan en silos genéricos y lejanos (ej. una sección global de "Cultura Tributaria" o "Descargas"). Esto obliga al usuario a abandonar el trámite que está intentando resolver para buscar ayuda en otro lugar.
- **Regla y Mandato**:
  - **Cero silos desconectados**: Todo recurso formativo, instructivo, guía en PDF, video explicativo o capacitación virtual debe ubicarse **directamente dentro del mismo segmento, categoría y subtema de la gestión a la que asiste**.
  - **Ejemplos de aplicación ya implementados y a estandarizar**:
    - *Capacitación de Factura y DUCA (FYDUCA)* ➔ Ubicada directamente dentro de *Comercio Exterior › Importadores › Declaraciones Aduaneras y DUCAs*.
    - *Capacitación de Régimen Electrónico de Devolución de Crédito Fiscal* ➔ Ubicada directamente en *Comercio Exterior › Exportadores › Devolución de Crédito Fiscal*.
    - *Guía de Franquicias Electrónicas* ➔ Ubicada en *Comercio Exterior › Importadores › Mercancías en Abandono, Depósitos y Franquicias*.
    - *Instructivo para Adquisición de Papel Sellado* ➔ Ubicado en *Profesionales › Abogados y Notarios › Timbres Fiscales y Papel Sellado*.
- **Acción a realizar**:
  - Auditar en todos los segmentos (`contribuyentes`, `profesionales`, `organismos_especiales`) que las capacitaciones, leyes tributarias aplicables, preguntas frecuentes y herramientas de apoyo no queden flotando como "ruido general", sino integradas orgánicamente como ítems o recursos de soporte en su respectivo trámite.

---

## 5. Auditoría y Saneamiento Canónico de Datos por Segmento
- **Abogados y Notarios** (`profesionales`): ✅ **Completado**. Reestructurado en 4 subtemas canónicos (*Habilitación*, *Timbres y Papel Sellado*, *e-Traspasos* y *Avisos Notariales*).
- **Operadores de Comercio Exterior** (`comercio_exterior`): ✅ **Completado**. Reestructurado en 8 categorías oficiales (150 trámites limpios):
  - *Importadores* (58 trámites en 6 subtemas: Padrón, DUCAs, Vehículos, Distribuidores, Despacho, Abandono/Franquicias).
  - *Exportadores* (21 trámites en 3 subtemas: Padrón, Devolución Crédito Fiscal, Embarques).
  - *Transportistas* (13 trámites: Equipos ATC, Manifiestos CUSCAR, Marchamo Electrónico).
  - *Agentes Aduaneros* (7 trámites: Habilitación y Sistemas).
  - *Normativa y Aranceles* (46 trámites: SAC, Acuerdos, COCONAD, Infraestructura, Consultas).
  - *OEA* (1), *Courier* (3), *Almacenes Fiscales* (1).
- **Peritos Contadores y Auditores** (`profesionales`): ⏳ **Pendiente de análisis y saneamiento**.
  - Clasificar trámites de habilitación de contadores, actualización en RTU, habilitación de libros, nombramiento de contadores y dictámenes de auditoría tributaria.
- **Entes Exentos y Organismos Especiales** (`organismos_especiales`): ⏳ **Pendiente de análisis y saneamiento**.
  - Normalizar trámites para entidades constitucionales, no lucrativas (ONGs, fundaciones, iglesias), municipalidades y dependencias del Estado.

---

## 6. Gestión de Ramas y Cierre en Git Flow
- **Rama activa**: `feature/portal-architecture-content`.
- **Acción a realizar**:
  - Al completar las tareas pendientes o estabilizar este sprint, realizar el merge hacia la rama `develop` siguiendo el estándar de Git Flow del repositorio.

---

*Documento actualizado: Octubre 2026*
