# Roadmap 03: Backlog de Evolución y Trámites del Portal SAT

Este documento registra los puntos pendientes acordados para continuar con la evolución del **Portal Web SAT Guatemala**, siguiendo las reglas oficiales de diseño, arquitectura tributaria, Git Flow y UX Writing en Lenguaje Ciudadano.

---

## 📋 Lista de Control de Tareas (Checklist)

### 1. Limpieza de Secciones Redundantes en la Portada (`Home`)
- [x] **1.1 Diagnóstico de redundancia visual**:
  - En la página de inicio (`App.tsx`) convivían las 4 tarjetas de segmentos principales (`UserSegmentCards`) con el carrusel de accesos rápidos (`QuickAccessCarousel`) y las pestañas de temas populares (`PopularTopicsTabs`), lo cual repetía enlaces a los mismos trámites (NIT, FEL, Vehículos, Solvencias).
- [x] **1.2 Acciones de consolidación**:
  - [x] Retiro del carrusel secundario repetitivo (`QuickAccessCarousel`).
  - [x] Portada limpia y minimalista donde el camino primario de exploración ciudadana es la navegación directa por los 4 segmentos en tarjetas (`UserSegmentCards`).


---

### 2. Optimización de la Ficha de Detalle de Requisitos (Modal de Ficha de Servicio)
- [x] **2.1 Estructura en Lenguaje Ciudadano**:
  - Al abrir un trámite específico (`selectedTramite`), requisitos estructurados en 3 pasos secuenciales cronológicos numerados (*"Paso 1: Reúne los Requisitos Previos"*, *"Paso 2: Inicia la Gestión en el Sistema Oficial"*, *"Paso 3: Descarga tu Constancia o Resolución"*).
- [x] **2.2 Llamado a la Acción (CTA) destacado**:
  - Botón principal visible y accesible con identificación del canal (*"Iniciar Trámite Ahora"* con indicación de Agencia Virtual, Declaraguate o sede).
- [x] **2.3 Base Legal secundaria**:
  - Fundamentación normativa y marco legal colocados dentro de un acordeón colapsable accesible (`aria-expanded`) para evitar la sobrecarga cognitiva del contribuyente.


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

---

### 7. Definición y Validación de Nivel 2 para Profesionales y Entes Exentos
- [ ] **7.1 Macro Grupo: Profesionales (Nivel 2)**:
  - [ ] **Peritos Contadores y Auditores**: *"Inscripción, habilitación y gestiones para el ejercicio contable y auditoría de contribuyentes."*
  - [ ] **Abogados y Notarios**: *"Servicios tributarios para la formalización legal, traspasos notariales y representación jurídica."*
  - [ ] **Servicios Profesionales Independientes**: *"Obligaciones, emisión de facturas y retenciones para profesionales colegiados y consultores."*
- [ ] **7.2 Macro Grupo: Entes Exentos (Nivel 2)**:
  - [ ] **Sector Público y Entidades del Estado**: *"Gestiones tributarias, retenciones oficiales y registros para dependencias y municipalidades."*
  - [ ] **Organizaciones No Gubernamentales y Asociaciones No Lucrativas**: *"Acreditación de exención, solvencias y obligaciones formales para entidades de beneficio social."*
  - [ ] **Centros Educativos, Religiosos y Organismos Internacionales**: *"Gestiones y constancias de exención tributaria amparadas por mandato constitucional y convenios."*

---

### 8. Generación de Base de Datos Dual del Portal (NoSQL y SQL Dump)
- [x] **8.1 Colección NoSQL Documental (`sat_portal_nosql.json`)**:
  - Catálogo íntegro estructurado por documentos con arrays embebidos de perfiles (`aplica_a`), categorías temáticas normalizadas y metadatos operativos.
- [x] **8.2 Script Relacional Normalizado (`sat_portal_dump.sql` y `sat_portal.db`)**:
  - DDL con tablas maestras (`macro_grupos`, `regimenes_nivel_2`, `categorias_nivel_3`, `tramites`), tabla relacional muchos-a-muchos (`tramite_regimen`), datos iniciales (`INSERT INTO`), base SQLite activa y vista optimizada `vw_tramites_portal`.


