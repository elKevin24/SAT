# Estructura Final de Contenido y Taxonomía del Portal SAT

> **Documento Oficial de Arquitectura de Información**  
> **Versión:** 4.0 (Definitiva y Sincronizada con Producción)  
> **Fecha de Emisión:** Octubre 2026  
> **Alineación:** Estructura Institucional SAT Guatemala, Modelo de Ciclo de Vida ATO (Australian Taxation Office) & Plain Language  
> **Base de Datos Única (Single Source of Truth):** [`src/data/allTramites.json`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/allTramites.json) (718 registros consolidados)  
> **Libros Excel Entregables (Vivos):**  
> * [`docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx)  
> * [`docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx)  
> **Fuentes Históricas de Referencia (Congeladas):**  
> * [`docs/fuentes-datos/Detalle de Contenido para Grupos de Interes.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Detalle%20de%20Contenido%20para%20Grupos%20de%20Interes.xlsx)  
> * [`docs/fuentes-datos/Arbol_de_Navegacion_Portal_v5.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Arbol_de_Navegacion_Portal_v5.xlsx)

---

## 1. Resumen Ejecutivo

El presente documento consolida la totalidad de **718 contenidos, trámites y servicios** del portal de la Superintendencia de Administración Tributaria (SAT).

La estructura resuelve de manera definitiva:
1. **La jerarquía de 4 Macro-Segmentos y Taxonomía Oficial**:
   * **Contribuyentes:** 344 trámites en 4 regímenes y servicios tributarios.
   * **Operadores de Comercio Exterior:** 246 trámites consolidados en **6 ramas canónicas** maestras.
   * **Entes Exentos:** 79 trámites para entidades estatales, descentralizadas y no lucrativas.
   * **Profesionales:** 49 trámites para auxiliares tributarios y profesionales colegiados.
2. **La eliminación de jerga técnica interna y prefijos numéricos**: Se erradica el uso de términos abstractos como *"oficial"* y prefijos ordinales en textos visibles para el ciudadano.
3. **El modelo asimétrico de profundidad balanceada**: Estructura que respeta la complejidad inherente de cada área (2-3 niveles para regímenes tributarios simples; 3-4 niveles organizados para la función pública aduanera y zonas especiales) sin redundancias artificiales.
4. **La separación formal entre Arquitectura de Información y Mecanismos de Navegación**:
   * **Arquitectura:** L1 Segmento, L2 Categoría / Rama, L3 Subcategoría / Actor, L4 Tema, L5 Contenido / Servicio.
   * **Navegación:** Breadcrumb dinámico adaptable (con elipsis en móvil), Sidebar sticky para contexto local y Enlaces Contextuales transversales.
5. **Calidad de Datos en Lenguaje Ciudadano**: Redacción orientada a tareas con verbos imperativos directos y erradicación de siglas opacas.
6. **Documentación de 12 brechas normativas (`[Propuesta brecha]`)**, identificadas para ser normadas por la mesa técnica aduanera.

---

## 2. Los 4 Segmentos del Portal SAT

| No. | Segmento Oficial | Texto Orientador de Interfaz (Estándar ATO) | Categorías / Ramas | Trámites | Participación |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **1** | **Contribuyentes** | *Información y servicios tributarios para personas y empresas.* | NIT sin Obligaciones, Pequeños Contribuyentes, Contribuyente General, Contribuyentes Especiales | **344** | 47.9% |
| **2** | **Operadores de Comercio Exterior** | *Servicios e información aduanera para la importación, exportación y logística.* | 6 Ramas Canónicas (Importadores, Exportadores, OEA, AFPA, Regímenes Territoriales, Normativa General) | **246** | 34.3% |
| **3** | **Entes Exentos** | *Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.* | Entidades del Estado, Constitucionales, No Lucrativos, Municipalidades, Decreto | **79** | 11.0% |
| **4** | **Profesionales** | *Herramientas y servicios especializados para profesionales tributarios y auxiliares.* | Abogados y Notarios, Peritos Contadores, Auditores, Gestores Tributarios, Servicios Profesionales | **49** | 6.8% |
| **TOTAL** | **4 Segmentos** | — | **Total Portal Web SAT Consolidado** | **718** | **100.0%** |

---

## 3. Desglose Oficial: Operadores de Comercio Exterior (246 Trámites)

Tras la auditoría universal de arquitectura de información y la erradicación de niveles redundantes, el segmento de Comercio Exterior se estructura en **6 ramas canónicas**:

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
│   ├── Depósitos Aduaneros (36)
│   │   ├── Depósitos Aduaneros Temporales - DAT (18)
│   │   ├── Almacenadoras Generales de Depósito - AGD (16)
│   │   └── Almacenes Fiscales (2)
│   ├── Empresas de Entrega Rápida o Courier (3)
│   └── Transportistas Aduaneros (14)
│
├── 5. Regímenes Territoriales y Zonas Especiales (42 trámites)
│   ├── Maquilas (Decreto 29-89) (12)
│   └── Zonas de Desarrollo Económico Especial Público - ZDEEP (30)
│       ├── Empresas Usuarias de ZDEEP (15)
│       └── Entidades Administradoras de ZDEEP (15)
│
└── 6. Normativa y Operaciones Aduaneras Generales (50 trámites)
    ├── Arancel Centroamericano (SAC) y Permisos (7)
    ├── Acuerdos Comerciales y Facilitación (8)
    ├── Prevención de Contrabando y Defraudación (3)
    ├── Consultas Técnicas, Recursos y Valoración (14)
    └── Modernización e Infraestructura Aduanera (18)
```

---

## 4. Desglose Oficial: Contribuyentes (344 Trámites)

| No. | Categoría / Régimen | Trámites | Descripción Funcional |
| :---: | :--- | :---: | :--- |
| **1** | **Contribuyente General** | **298** | RTU Digital, declaraciones en Declaraguate, Registro Fiscal de Vehículos, personas jurídicas y libros contables. |
| **2** | **Pequeños Contribuyentes** | **22** | Facturación electrónica 5% definitivo, régimen agropecuario primario y pecuario. |
| **3** | **Contribuyentes Especiales** | **14** | Gerencias de Medianos y Grandes Contribuyentes, precios de transferencia y auditorías preventivas. |
| **4** | **NIT sin Obligaciones** | **10** | Inscripción civil para apertura de cuentas, pasaporte, titulación universitaria e información pública. |

---

## 5. Matriz de Ciclo de Vida (Modelo ATO - Australia)

Cada contenido y servicio se clasifica en una de las 5 etapas del ciclo de vida del contribuyente, sin prefijos numéricos en la interfaz:

| Etapa ATO | Denominación Visible | Trámites | % Total | Alcance Operativo |
| :--- | :--- | :---: | :---: | :--- |
| `empezar` | **Empezar y registrarse** | **98** | 13.6% | Inscripción en RTU, habilitación de padrones y autorizaciones iniciales de operación. |
| `operar` | **Operación y declaraciones** | **282** | 39.3% | Emisión de facturas FEL, declaraciones tributarias periódicas, DUCAs y gestión diaria. |
| `consultar` | **Consultas y herramientas** | **135** | 18.8% | Verificadores públicos en tiempo real, solvencia fiscal, rampa aduanera y arancel SAC. |
| `modificar_cerrar` | **Modificaciones y cierre** | **143** | 19.9% | Actualización de RTU, traspaso de vehículos, cambios de régimen, suspensión y cese. |
| `normativa` | **Normativa y asistencia** | **60** | 8.4% | Marco legal aduanero y tributario, recursos administrativos y criterios institucionales. |

---

## 6. Clasificación por Tipología de Interacción

| Tipo de Interacción | Etiqueta en Portal | Trámites | % Total | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `servicio_transaccional` | **Trámite en Línea** | **162** | 22.6% | Aplicativos web, Declaraguate, DUCAs y gestiones con firma digital en Agencia Virtual. |
| `consulta_datos` | **Consulta a Base de Datos** | **84** | 11.7% | Búsquedas directas en bases de datos SAT (rampa aduanera, DTE, solvencia SOFI). |
| `guia_informativa` | **Guía Informativa** | **463** | 64.5% | Fichas en Lenguaje Ciudadano con requisitos, base legal y pasos para realizar el trámite. |
| `descarga_recurso` | **Descarga / Software** | **9** | 1.2% | Componentes criptográficos (ActiveX PKI), instaladores y plantillas oficiales. |

---

## 7. Registro de Brechas Normativas (12 Trámites Identificados)

En el marco de la auditoría técnica se aislaron **12 trámites aduaneros de alta necesidad operativa** que actualmente no poseen ficha pública en línea, documentados con su respectiva pregunta para la Mesa Técnica de Aduanas:

| No. | Categoría / Rama | Actor / Subcategoría | Trámite Identificado como Brecha |
| :---: | :--- | :--- | :--- |
| 1 | Auxiliares de la Función Pública (AFPA) | Apoderados Especiales Aduaneros | Autorización inicial y registro de mandato de apoderado especial |
| 2 | Auxiliares de la Función Pública (AFPA) | Depósitos Aduaneros (AGD) | Registro y emisión de títulos de crédito (Certificados de depósito y bonos de prenda) |
| 3 | Auxiliares de la Función Pública (AFPA) | Depósitos Aduaneros (AGD) | Reporte de saldos y existencias afianzadas ante SAT |
| 4 | Auxiliares de la Función Pública (AFPA) | Depósitos Aduaneros (DAT) | Control de descarga, ingreso de bultos y actas de recepción DAT |
| 5 | Auxiliares de la Función Pública (AFPA) | Depósitos Aduaneros (DAT) | Requisitos para habilitación y delimitación de recintos aduaneros temporales (DAT) |
| 6 | Regímenes Territoriales y Zonas Especiales | Maquilas (Decreto 29-89) | Descargo Periódico de Cuentas Corrientes y Cuadre Insumo-Producto |
| 7 | Regímenes Territoriales y Zonas Especiales | Zonas Especiales (ZDEEP) | Control, descargo y reporte periódico de inventarios de transformación |
| 8 | Regímenes Territoriales y Zonas Especiales | Zonas Especiales (ZDEEP) | Procedimiento aduanero de traslado de mercancías hacia y desde ZDEEP |
| 9 | Regímenes Territoriales y Zonas Especiales | Zonas Especiales (ZDEEP) | Registro de empresas usuarias calificadas en ZDEEP ante SAT |
| 10 | Regímenes Territoriales y Zonas Especiales | Zonas Especiales (ZDEEP) | Procedimiento de control para ingreso y egreso de carga en garita ZDEEP |
| 11 | Regímenes Territoriales y Zonas Especiales | Zonas Especiales (ZDEEP) | Registro y control de garitas aduaneras e infraestructura perimetral |
| 12 | Regímenes Territoriales y Zonas Especiales | Zonas Especiales (ZDEEP) | Requisitos para habilitación y delimitación perimetral del polígono ZDEEP |

---

## 8. Gobernanza y Sincronización de Archivos

```
src/data/allTramites.json (Single Source of Truth - 718 registros)
            │
            ├──► docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx
            │    (Libro Maestro Excel con 4 hojas y fórmulas automáticas)
            │
            ├──► docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx
            │    (Taxonomía y fichas redactadas en Lenguaje Ciudadano)
            │
            └──► Catálogo Web React (SegmentTramitesCatalog, PortalFlow, Tests Playwright)
```
