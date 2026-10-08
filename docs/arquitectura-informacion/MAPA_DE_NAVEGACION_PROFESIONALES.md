# Mapa de Navegación Estructurado — Profesionales (Antes vs. Después)

> **Documento Oficial de Transición y Arquitectura de Información**  
> **Área:** Profesionales y Auxiliares Tributarios (47 Trámites Consolidados)  
> **Fecha:** Octubre 2026  
> **Fuente de Verdad:** [`src/data/allTramites.json`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/allTramites.json)  
> **Entregables Sincronizados:**  
> * [`docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx)  
> * [`docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx)

---

## 1. Justificación del Cambio Arquitectónico

### Diagnóstico de la Estructura Previa (49 Trámites)
* **Duplicidad de Registros:** Existían 2 pares de trámites idénticos cargados en paralelo:
  1. `profesionales-21` frente a `profesionales-timbres-razon-electronica` (Pago de timbres en línea con razón electrónica).
  2. `contribuyentes-44` frente a `profesionales-timbres-devolucion-papel-sellado` (Devolución y canje de timbres y papel sellado).
* **Subcategorías Genéricas Residuales:** Cuatro trámites se encontraban clasificados bajo etiquetas genéricas heredadas de ciclo de vida (`Operaciones y trámites`, `Normativa y recursos`, `Consultas y seguimiento`).
* **Migas de Pan Desbordadas:** Varios trámites presentaban rutas con textos de párrafos explicativos en lugar de jerarquías limpias de navegación.

### Solución Canónica Implementada (47 Trámites Netos)
1. **Fusión de Duplicados:** Se fusionaron los registros duplicados, unificando en las URLs oficiales del portal y preservando los vínculos a procesos guiados (`rutasProceso`).
2. **Reubicación Temática:** Supresión del 100% de las subcategorías genéricas residuales. Cada trámite pertenece a una subcategoría de dominio técnico.
3. **Miga de Pan Homogénea:** Estandarización a 4 niveles canónicos:  
   `Profesionales > [Categoría] > [Subcategoría] > [Trámite]`.
4. **Preservación de Autonomía de Roles:** Mantenimiento de las 5 categorías diferenciadas (`Abogados y Notarios`, `Peritos Contadores`, `Auditores`, `Gestores Tributarios`, `Servicios Profesionales`).

---

## 2. Comparativo Estructural: Antes vs. Después

| Dimensión | Estructura Anterior | Estructura Canónica Optimizada |
| :--- | :--- | :--- |
| **Trámites Totales** | 49 registros (con 2 duplicados) | **47 trámites únicos y saneados** |
| **Categorías Oficiales** | 5 categorías | **5 categorías consolidadas** |
| **Subcategorías Genéricas** | 4 registros en `Operaciones...`, `Normativa...` | **0 subcategorías genéricas (100% temáticas)** |
| **Migas de Pan** | Rutas inconsistentes de hasta 6 niveles | **4 niveles canónicos normalizados** |
| **URLs de Destino** | Enlaces dispersos (sitios temporales de capacitación) | **Páginas oficiales directas de la SAT** |

---

## 3. Desglose Detallado por Categoría (47 Trámites)

### 1. Abogados y Notarios (18 trámites netos)
* **Habilitación y Registro Profesional (4 trámites):**
  * Inscripción y actualización de Abogado y Notario en RTU Digital (`profesionales-70`).
  * Activación de calidad de Abogado y Notario en Agencia Virtual (`profesionales-67`).
  * Registro y confirmación de huella dactilar biométrica (`profesionales-68`).
  * Ratificación anual de datos de Abogado y Notario en RTU Digital (`profesionales-77`).
* **Timbres Fiscales y Papel Sellado de Protocolo (5 trámites):**
  * Adquisición de Papel Sellado Especial para Protocolos y Timbres Fiscales — Formulario SAT-7130 (`profesionales-66`).
  * Acreditación de procurador o tercero para retiro de especies fiscales (`profesionales-38`).
  * Pago del Impuesto de Timbres Fiscales en línea con razón electrónica (`profesionales-21` — *Fusión consolidada*).
  * Devolución y canje de timbres fiscales y papel sellado inutilizado (`profesionales-timbres-devolucion-papel-sellado` — *Fusión consolidada*).
  * Capacitación sobre emisión de razón electrónica de timbres notariales (`profesionales-capacitacion-timbres-notarios`).
* **Traspaso Electrónico Vehicular — e-Traspaso (4 trámites):**
  * Habilitación de Notario para Traspaso Electrónico de Vehículos - TEV (`profesionales-74`).
  * Formalización notarial de traspaso electrónico de vehículos en línea (`profesionales-32`).
  * Carga y remisión de expedientes digitales de traspaso con firma avanzada (`profesionales-56`).
  * Autorización notarial de tercera persona en el Registro Fiscal de Vehículos (`profesionales-71`).
* **Avisos Notariales ante la SAT (5 trámites):**
  * Aviso notarial de legalización de firmas en título de propiedad vehicular (`profesionales-72`).
  * Aviso notarial de transferencia de dominio de vehículos terrestres (`profesionales-73`).
  * Consulta de avisos notariales y estado de legalizaciones registradas (`profesionales-33`).
  * Calendario y plazos de obligaciones notariales ante la SAT (`profesionales-34`).
  * Atención preferencial y requisitos en ventanillas notariales (`profesionales-75`).

---

### 2. Peritos Contadores (11 trámites)
* **Habilitación y Registro de Perito Contador (4 trámites):**
  * Inscripción y habilitación como Perito Contador ante la SAT (`profesionales-82`).
  * Registro y habilitación de Contador en Agencia Virtual (`profesionales-83`).
  * Actualización de datos de Perito Contador en Agencia Virtual (`profesionales-80`).
  * Cancelación y baja como Contador en Agencia Virtual (`profesionales-81`).
* **Consultas, Retenciones y Libros Contables (7 trámites):**
  * Habilitación y administración del Libro Electrónico Tributario - LET (`profesionales-19`).
  * Guía y administración del régimen de Factura Electrónica en Línea - FEL (`profesionales-17`).
  * Presentación de Planilla del IVA en FEL (`profesionales-18`).
  * Consulta en línea de constancias de retención del IVA e ISR (`profesionales-16`).
  * Operación y emisión en el Sistema de Retenciones del IVA (`profesionales-46`).
  * Procedimiento y rectificación para autoliquidación de impuestos (`profesionales-44`).
  * Solicitud de devolución, retención o compensación de créditos tributarios (`profesionales-42`).

---

### 3. Auditores — Contadores Públicos y Auditores (4 trámites)
* **Habilitación y Registro de Auditor - CPA (2 trámites):**
  * Inscripción y habilitación como Contador Público y Auditor - CPA (`profesionales-91`).
  * Actualización de datos de Contador Público y Auditor - CPA (`profesionales-90`).
* **Dictámenes de Crédito Fiscal y Auditoría (2 trámites):**
  * Inscripción de Contador autorizado para emitir dictámenes de devolución de crédito fiscal (`profesionales-89`).
  * Actualización de datos de Contador que emite dictámenes de devolución (`profesionales-88`).

---

### 4. Gestores Tributarios y Auxiliares (8 trámites)
* **Acreditación y Carné Oficial de Gestor (4 trámites):**
  * Marco de actuación y alcance de los Gestores Tributarios acreditados (`profesionales-30`).
  * Requisitos de acreditación inicial para Gestor Tributario o Auxiliar (`profesionales-61`).
  * Acreditación integral, carné y renovación de Gestor Tributario y Auxiliares (`profesionales-54`).
  * Acreditación de tercera persona autorizada para gestiones en el RTU (`profesionales-41`).
* **Renovación y Gestión de Gafetes (4 trámites):**
  * Actualización de datos y renovación de gafete para Gestor Tributario (`profesionales-57`).
  * Reposición de gafete de identificación para Gestor Tributario (`profesionales-60`).
  * Consulta en línea del padrón de Gestores Tributarios y Auxiliares activos (`profesionales-58`).
  * Habilitación e inhabilitación temporal o definitiva de Gestor Tributario o Auxiliar (`profesionales-59`).

---

### 5. Servicios Profesionales Generales (6 trámites)
* **Facturación por Honorarios y Formularios (1 trámite):**
  * Catálogo general de formularios tributarios electrónicos en Declaraguate (`profesionales-20`).
* **Actualización de Actividad y RTU (1 trámite):**
  * Actualización de datos registrales de Servicios Profesionales en Agencia Virtual (`profesionales-29`).
* **Consultas Jurídico Tributarias (2 trámites):**
  * Presentación de consultas técnico-tributarias vinculantes ante Asuntos Jurídicos (`profesionales-4`).
  * Recepción de propuestas y observaciones técnicas a criterios de Asuntos Jurídicos (`profesionales-objeciones-asuntos-juridicos`).
* **Sistemas de Retención en la Fuente (2 trámites):**
  * Sistema de retenciones para servicios médicos y hospitalarios - Asiste Web (`profesionales-45`).
  * Documentación y herramientas del Programa de Cumplimiento Tributario Voluntario (`profesionales-78`).

---

## 4. Trazabilidad de Entregables Sincronizados

| Entregable | Rol | Estado |
| :--- | :--- | :---: |
| [`src/data/allTramites.json`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/allTramites.json) | Base de datos única con 47 trámites saneados de Profesionales | Sincronizado (716 total) |
| [`src/data/categoryOrder.ts`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/categoryOrder.ts) | Contrato de categorías y subcategorías oficiales | Validado por tests Playwright |
| [`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx) | Libro maestro Excel con 716 registros y fórmulas de resumen | Sincronizado |
| [`Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx) | Mapa de navegación completo y fichas en Lenguaje Ciudadano | Sincronizado |
