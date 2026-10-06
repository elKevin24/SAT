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

## 4. Gestión de Ramas y Cierre en Git Flow
- **Rama activa**: `feature/portal-architecture-content`.
- **Acción a realizar**:
  - Al completar las tareas pendientes o estabilizar este sprint, realizar el merge hacia la rama `develop` siguiendo el estándar de Git Flow del repositorio.

---

*Documento actualizado: Octubre 2026*
