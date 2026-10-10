# Estructura Final de Contenido y Taxonomía del Portal SAT

> **Documento Oficial de Arquitectura de Información**  
> **Versión:** 4.1 (Definitiva y Sincronizada con Producción)  
> **Fecha de Emisión:** Octubre 2026  
> **Alineación:** Estructura Institucional SAT Guatemala, Modelo de Ciclo de Vida ATO (Australian Taxation Office) & Plain Language  
> **Base de Datos Única (Single Source of Truth):** [`src/data/allTramites.json`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/allTramites.json) (716 registros consolidados)  
> **Libros Excel Entregables (Vivos):**  
> * [`docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx)  
> * [`docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx)  
> **Fuentes Históricas de Referencia (Congeladas):**  
> * [`docs/fuentes-datos/Detalle de Contenido para Grupos de Interes.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Detalle%20de%20Contenido%20para%20Grupos%20de%20Interes.xlsx)  
> * [`docs/fuentes-datos/Arbol_de_Navegacion_Portal_v5.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Arbol_de_Navegacion_Portal_v5.xlsx)

---

## 1. Resumen Ejecutivo

El presente documento consolida la totalidad de **716 contenidos, trámites y servicios** del portal de la Superintendencia de Administración Tributaria (SAT).

La estructura resuelve de manera definitiva:
1. **La jerarquía de 4 Macro-Segmentos y Taxonomía Oficial**:
   * **Contribuyentes:** 344 trámites en 4 regímenes y servicios tributarios.
   * **Operadores de Comercio Exterior:** 246 trámites consolidados en **6 ramas canónicas** maestras.
   * **Entes Exentos:** 79 trámites para entidades estatales, descentralizadas y no lucrativas.
   * **Profesionales:** 47 trámites netos para auxiliares tributarios y profesionales colegiados (2 duplicados fusionados).
2. **La eliminación de jerga técnica interna y prefijos numéricos**: Se erradica el uso de términos abstractos como *"oficial"* y prefijos ordinales en textos visibles para el ciudadano.
3. **El modelo asimétrico de profundidad balanceada**: Estructura que respeta la complejidad inherente de cada área (2-3 niveles para regímenes tributarios simples; 3-4 niveles organizados para la función pública aduanera, profesionales y zonas especiales) sin redundancias artificiales.
4. **La separación formal entre Arquitectura de Información y Mecanismos de Navegación**:
   * **Arquitectura:** L1 Segmento, L2 Categoría / Rama, L3 Subcategoría / Actor, L4 Tema, L5 Contenido / Servicio.
   * **Navegación:** Breadcrumb dinámico adaptable (con elipsis en móvil), Sidebar sticky para contexto local y Enlaces Contextuales transversales.
5. **Calidad de Datos en Lenguaje Ciudadano**: Redacción orientada a tareas con verbos imperativos directos y erradicación de siglas opacas.
6. **Documentación de 12 brechas normativas (`[Propuesta brecha]`)**, identificadas para ser normadas por la mesa técnica aduanera.

---

## 2. Los 4 Segmentos del Portal SAT

| No. | Segmento Oficial | Texto Orientador de Interfaz (Estándar ATO) | Categorías / Ramas | Trámites | Participación |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **1** | **Contribuyentes** | *Información y servicios tributarios para personas y empresas.* | NIT sin Obligaciones, Pequeños Contribuyentes, Contribuyente General, Contribuyentes Especiales | **344** | 48.0% |
| **2** | **Operadores de Comercio Exterior** | *Servicios e información aduanera para la importación, exportación y logística.* | 6 Ramas Canónicas (Importadores, Exportadores, OEA, AFPA, Regímenes Territoriales, Normativa General) | **246** | 34.4% |
| **3** | **Entes Exentos** | *Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.* | Entidades del Estado, Constitucionales, No Lucrativos, Municipalidades, Decreto | **79** | 11.0% |
| **4** | **Profesionales** | *Herramientas y servicios especializados para profesionales tributarios y auxiliares.* | Abogados y Notarios, Peritos Contadores, Auditores, Gestores Tributarios, Servicios Profesionales | **47** | 6.6% |
| **TOTAL** | **4 Segmentos** | — | **Total Portal Web SAT Consolidado** | **716** | **100.0%** |

---

## 3. Desglose Oficial: Profesionales (47 Trámites)

Tras la auditoría y fusión de trámites duplicados, el segmento de Profesionales se organiza en **5 categorías de rol**:

```
PROFESIONALES (47 Trámites)
│
├── 1. Abogados y Notarios (18 trámites netos)
│   ├── Habilitación y Registro Profesional (4): RTU Digital, activación en AV, biometría y ratificación.
│   ├── Timbres Fiscales y Papel Sellado de Protocolo (5): Formulario SAT-7130, retiro con procurador, razón electrónica, devolución/canje y capacitación.
│   ├── Traspaso Electrónico Vehicular - e-Traspaso (4): Habilitación TEV, traspaso en línea, carga con firma avanzada y autorización notarial.
│   └── Avisos Notariales ante la SAT (5): Legalización vehicular, transferencia de dominio, consulta de avisos, calendario y ventanilla notarial.
│
├── 2. Peritos Contadores (11 trámites)
│   ├── Habilitación y Registro de Perito Contador (4): Inscripción inicial, registro en AV, actualización y baja.
│   └── Consultas, Retenciones y Libros Contables (7): LET, FEL, planilla IVA-FEL, retenciones IVA/ISR, autoliquidación y devolución/compensación.
│
├── 3. Auditores — Contadores Públicos y Auditores (4 trámites)
│   ├── Habilitación y Registro de Auditor - CPA (2): Inscripción de CPA y actualización registral.
│   └── Dictámenes de Crédito Fiscal y Auditoría (2): Inscripción de CPA emisor de dictámenes y actualización de datos.
│
├── 4. Gestores Tributarios y Auxiliares (8 trámites)
│   ├── Acreditación y Carné Oficial de Gestor (4): Marco normativo, acreditación inicial, carné oficial y gestiones de RTU.
│   └── Renovación y Gestión de Gafetes (4): Actualización/renovación, reposición por robo/deterioro, padrón activo e inhabilitación.
│
└── 5. Servicios Profesionales Generales (6 trámites)
    ├── Facturación por Honorarios y Formularios (1): Catálogo general en Declaraguate.
    ├── Actualización de Actividad y RTU (1): Actualización registral en Agencia Virtual.
    ├── Consultas Jurídico Tributarias (2): Consultas legales vinculantes y objeciones técnicas a criterios.
    └── Sistemas de Retención en la Fuente (2): Asiste Hospitales Web y Programa de Cumplimiento Voluntario.
```

---

## 4. Desglose Oficial: Operadores de Comercio Exterior (246 Trámites)

```
OPERADORES DE COMERCIO EXTERIOR (246 Trámites)
│
├── 1. Importadores (55 trámites)
│   ├── Registro y Padrón de Importadores (9)
│   ├── Declaraciones Aduaneras y DUCAs (10)
│   ├── Despacho Aduanero, Levante y Selectivo (17)
│   ├── Importación y Nacionalización de Vehículos (10)
│   └── Mercancías en Abandono, Depósitos y Franquicias (9)
│
├── 2. Exportadores (21 trámites)
│   ├── Padrón y Registro de Exportadores (7)
│   ├── Declaraciones Aduaneras y Embarques (4)
│   └── Devolución de Crédito Fiscal (10)
│
├── 3. Operador Económico Autorizado - OEA (2 trámites)
│   └── Programa OEA (2)
│
├── 4. Auxiliares de la Función Pública Aduanera - AFPA (76 trámites)
│   ├── Agentes Aduaneros (7)
│   ├── Apoderados Especiales Aduaneros (16)
│   ├── Depósitos Aduaneros (36: DAT 18, AGD 16, Fiscales 2)
│   ├── Empresas de Entrega Rápida o Courier (3)
│   └── Transportistas Aduaneros (14)
│
├── 5. Regímenes Territoriales y Zonas Especiales (42 trámites)
│   ├── Maquilas (Decreto 29-89) (12)
│   └── Zonas de Desarrollo Económico Especial Público - ZDEEP (30)
│
└── 6. Normativa y Operaciones Aduaneras Generales (50 trámites)
    ├── Arancel Centroamericano (SAC) y Permisos (7)
    ├── Acuerdos Comerciales y Facilitación (8)
    ├── Prevención de Contrabando y Defraudación (3)
    ├── Consultas Técnicas, Recursos y Valoración (14)
    └── Modernización e Infraestructura Aduanera (18)
```

---

## 5. Gobernanza y Sincronización de Archivos

```
src/data/allTramites.json (Single Source of Truth - 716 nodos de navegación)
            │
            ├──► docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx
            │    (Libro Maestro Excel con 7 hojas: Resumen, Matriz 716, Contribuyentes 344, Comercio Exterior 246, Profesionales 47, Entes Exentos 79, Brechas 12)
            │
            ├──► docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx
            │    (Taxonomía y fichas redactadas en Lenguaje Ciudadano)
            │
            ├──► src/data/catalogoContenidosUnicos.json & database/sat_portal_nosql.json
            │    (Catálogo NoSQL de 683 contenidos únicos desacoplados con matriz de audiencias transversales)
            │
            └──► Catálogo Web React (SegmentTramitesCatalog, PortalFlow, Tests Playwright)
```

---

## 6. Catálogo NoSQL de Gestiones y Contenidos Únicos (Content Hub Desacoplado)

Para superar el modelo jerárquico rígido de "silos" donde el contenido queda atrapado exclusivamente dentro de un grupo, se implementó la arquitectura de **Catálogo Único de Gestiones** (`database/gestiones.json`, `src/data/catalogoContenidosUnicos.json` y `database/sat_portal_nosql.json`):

1. **683 Gestiones Canónicas Únicas**:
   - Cada servicio, trámite, guía o herramienta existe como una única entidad canónica identificada por un código institucional inmutable (**`SAT-GES-0001` a `SAT-GES-0683`**).
   - **Inmutabilidad Garantizada:** Este código no cambia con el tiempo, no cambia si el trámite cambia de nombre comercial y no depende de la audiencia ni del árbol de navegación.
   - Contiene sus atributos intrínsecos: `slug` semántico, `titulo`, `descripcion`, `url`, `tipoInteraccion`, `tipologiaContenido`, `plataformaSistema`, `canalAtencion`, `etapaAto`, `baseLegal`, `esBrecha` y `codigos_legacy` (trazabilidad de fuentes históricas).

2. **Matriz de Audiencias Polijerárquica (`audiencias[]` / `ubicaciones[]`)**:
   - Cada gestión mantiene un array de audiencias o nodos donde se proyecta dentro del portal.
   - Cada audiencia incluye: `tramiteId` (nodo de navegación), `segmentoId`, `segmentoNombre`, `categoria`, `subcategoria`, `tema`, `subtema`, `actorEspecifico` y `migaBreadcrumb`.
   - Se proveen arreglos optimizados de búsqueda: `segmentosAplicables[]`, `categoriasAplicables[]` y `familias_ids[]`.

3. **Mapeo Biunívoco y Contenido Transversal**:
   - **18 contenidos transversales** son compartidos por múltiples ramas (p. ej. *Procedimientos administrativos de aduanas*, *Consulta de contribuyentes morosos*, *DUCA y Aduana sin papeles*).
   - La suma exacta de audiencias de los 683 contenidos únicos equivale a los **716 nodos del árbol de navegación** ($\sum \text{totalAudiencias} = 716$), garantizando 0 pérdida de información y 0 duplicación redundante de contenido.
