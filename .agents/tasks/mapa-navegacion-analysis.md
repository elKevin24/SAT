# Análisis Exhaustivo: Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx

**Archivo:** `docs/fuentes-datos/02_archivos_producto_entregables/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`  
**Fecha de análisis:** Junio 2025  
**Herramienta:** Python 3 con pandas y openpyxl  

---

## RESUMEN EJECUTIVO

El Excel contiene **3 hojas** que documentan la arquitectura de información del portal SAT Guatemala. Es un documento de **diseño de alto nivel** (N1–N3), no un catálogo operacional. El catálogo operacional completo vive en `src/data/allTramites.json` con **715 trámites** y **52 campos** por registro. El Excel sirve como fuente de verdad para los textos institucionales (definiciones, lead texts, base jurídica) de las **27 categorías** del portal.

**Hallazgo crítico:** El Excel tiene **dos inconsistencias de conteo** respecto al JSON canónico:
1. La taxonomía de tipos de interacción reportada en Sheet 1 suma **658** (en lugar de 715), con categorías desactualizadas.
2. El campo `% Segmento` y `% Portal` de Sheet 2 están completamente **vacíos** (100% NaN en los 27 registros de datos).

---

## 1. HOJAS (TABS) DEL ARCHIVO

| # | Nombre | Shape | Descripción |
|---|--------|-------|-------------|
| 1 | **Resumen Arquitectura** | 32 filas × 8 cols | Tablero ejecutivo: segmentos, ciclo ATO, tipos de interacción |
| 2 | **Mapa de Navegación** | 38 filas × 10 cols | Taxonomía canónica N1→N3 con conteos y breadcrumbs |
| 3 | **Fichas por Rol y Categoría** | 34 filas × 8 cols | Definiciones, lead texts y base jurídica por N3 |

---

## 2. ESTRUCTURA DE COLUMNAS POR HOJA

### Hoja 1: Resumen Arquitectura

No tiene cabecera única; el contenido está organizado en **tres secciones** diferenciadas por filas de título:

| Sección | Filas | Columnas clave |
|---------|-------|----------------|
| Banner estadístico | Row 5 | TOTAL (715), por segmento |
| Segmentos N1 | Rows 9–14 | No., Segmento, Qué es, Lead text, Base jurídica, Total, % |
| Ciclo ATO | Rows 17–23 | Etapa, Descripción, Total, % |
| Tipos de Interacción | Rows 26–31 | Tipo, Descripción, Total, % |

**Filas de datos efectivos:** 4 segmentos, 5 etapas ATO, 4 tipos de interacción.

### Hoja 2: Mapa de Navegación

Cabecera en fila 5 (índice base-0). Columnas:

| Índice | Nombre | Tipo | Nulos (de 27 registros) |
|--------|--------|------|------------------------|
| 1 | No. | Integer | 0 |
| 2 | Nivel 1: Segmento Oficial | String | 0 |
| 3 | Nivel 2: Régimen / Área | String | 0 |
| 4 | Nivel 3: Categoría / Actor | String | 0 |
| 5 | Alcance y Especialidad de Navegación | String (~110–131 chars) | 0 |
| 6 | Trámites | Integer | 0 |
| 7 | % Segmento | Float | **27 (100% vacío)** |
| 8 | % Portal | Float | **27 (100% vacío)** |
| 9 | Ruta oficial de Navegación (Miga de Pan) | String | 0 |

**Filas efectivas:** 27 registros N3 + 4 subtotales de segmento + 1 total general.

### Hoja 3: Fichas por Rol y Categoría

Cabecera en fila 5 (índice base-0). Columnas:

| Índice | Nombre | Tipo | Nulos (de 28 filas totales) |
|--------|--------|------|---------------------------|
| 0 | No. | Float | 1 (fila TOTAL) |
| 1 | Segmento (Nivel 1) | String | 0 |
| 2 | Régimen / Área (Nivel 2) | String | 0 |
| 3 | Categoría / Actor (Nivel 3) | String | 0 |
| 4 | Qué es: (Definición Operativa) | String (159–329 chars) | 0 |
| 5 | Lead text: (Texto Orientador de Interfaz) | String (73–157 chars) | 1 (fila TOTAL) |
| 6 | Base jurídica | String (82–156 chars) | 1 (fila TOTAL) |
| 7 | Trámites | Float | 1 (fila TOTAL) |

**Filas efectivas:** 27 registros de categorías N3 + 1 fila TOTAL (parcialmente vacía).

---

## 3. NIVELES DE NAVEGACIÓN PRESENTES

### En el Excel
El Excel documenta únicamente **N1, N2 y N3**:

| Nivel | Campo Excel | Valores únicos |
|-------|-------------|----------------|
| N1 | Nivel 1: Segmento Oficial | 4 |
| N2 | Nivel 2: Régimen / Área | 8 |
| N3 | Nivel 3: Categoría / Actor | 27 |

**N4 y N5 no existen en el Excel.** Están presentes únicamente en `src/data/allTramites.json`.

### En el catálogo JSON (`allTramites.json`)
El catálogo operacional implementa 5 niveles completos:

| Nivel | Campo JSON | Valores únicos | Nulos |
|-------|-----------|----------------|-------|
| N1 | `nivel1_segmento` | 4 | 0 |
| N2 | `nivel2_area` / `regimenArea` | 13 | 0 |
| N3 | `nivel3_subarea` | 59 | 0 |
| N4 | `nivel4_tema` | 108 | 136 nulos\* |
| N5 | `nivel5_tramite` | 500 | 202 nulos\* |

\*Los nulos en N4/N5 corresponden a trámites donde ese nivel usa `"—"` (guión em) como placeholder, indicando que el trámite opera directamente bajo N3 sin subdivisión temática adicional. Total de items con N4=`"—"`: **138**; con N5=`"—"`: **204**.

---

## 4. MUESTRA DE DATOS REPRESENTATIVOS

### Segmentos N1 con conteos (Sheet 2 y JSON coinciden):

| # | Segmento N1 | N3 Categorías | Trámites |
|---|-------------|---------------|----------|
| 1 | Contribuyentes | 11 | 344 (48.1%) |
| 2 | Operadores de Comercio Exterior | 6 | 245 (34.3%) |
| 3 | Entes Exentos | 5 | 79 (11.0%) |
| 4 | Profesionales | 5 | 47 (6.6%) |
| **TOTAL** | **4 segmentos** | **27** | **715** |

### Ciclo ATO (Sheet 1):

| Etapa | Descripción breve | Trámites |
|-------|-------------------|----------|
| Empezar y registrarse | NIT, RTU, padrones | 79 |
| Operación y declaraciones | FEL, Declaraguate, DUCAs | 260 |
| Consultas y herramientas | Verificadores, solvencia, SAC | 116 |
| Modificaciones y cierre | RTU update, traspaso, cese | 130 |
| Normativa y asistencia | Marco legal, devoluciones | 130 |
| **TOTAL** | | **715** ✓ |

### Distribución por N3 (Sheet 2):

| N3 | N1 | Trámites |
|----|-----|---------|
| Declaraciones y Pagos | Contribuyentes | 70 |
| RTU Digital y Agencia Virtual | Contribuyentes | 68 |
| Vehículos | Contribuyentes | 60 |
| Auxiliares AFPA | Com. Exterior | 76 |
| Importadores | Com. Exterior | 54 |
| Normativa y Op. Aduaneras | Com. Exterior | 50 |
| Servicios al Contribuyente | Contribuyentes | 44 |
| Reg. Territoriales y Zonas | Com. Exterior | 42 |
| Entidades del Estado | Entes Exentos | 26 |
| Exportadores | Com. Exterior | 21 |
| ... | ... | ... |
| OEA (mínimo) | Com. Exterior | 2 |

---

## 5. IDENTIFICADORES PRESENTES

### En el Excel
**No existen campos SAT-GES-#### en el Excel.** El único uso del patrón `SAT-####` en el Excel es una referencia textual dentro de la columna "Alcance" de Sheet 2:
- Row 25, Sheet 2: mención a `SAT-7130` (formulario de papel sellado) — no es un identificador canónico sino el nombre de un formulario.

El Excel opera completamente **sin IDs canónicos** a nivel de filas/registros. Esto es una brecha arquitectónica: no hay campo que enlace directamente una categoría N3 del Excel con los registros del JSON.

### En `allTramites.json` (catálogo operacional)
El campo `id` (alias `codigo`) implementa el esquema **SAT-GES-####**:

| Formato | Cantidad | Descripción |
|---------|----------|-------------|
| `SAT-GES-####` (plain) | 645 | Identificador estándar de 4 dígitos |
| `SAT-GES-####-B` | 5 | Variante B de un trámite base |
| `SAT-GES-####-AGD` | 16 | Trámite específico de Almacenes Generales de Depósito |
| `SAT-GES-####-DAT` | 19 | Trámite específico de Depósito Aduanero Temporal |
| `SAT-GES-####-ZDEEP-USR` | ~20 | Trámite para usuario de Zona ZDEEP |
| `SAT-GES-####-ZDEEP-ADM` | ~10 | Trámite para administrador de Zona ZDEEP |
| **Total** | **715** | Todos únicos, sin duplicados |

**Rango numérico:** SAT-GES-0001 a SAT-GES-0683. Hay **38 huecos** en el rango (números 441–458, 488–508, etc.) que corresponden a los sufijos especiales (-AGD, -DAT, -ZDEEP) — los números base fueron "consumidos" por variantes.

**`codigos_legacy`:** El campo existe en el schema pero está **vacío en el 100% de los 715 registros**.

---

## 6. CAMPOS DE URL Y ESTADO APARENTE

### En el Excel
**No existe ningún campo de URL** en ninguna de las 3 hojas. El Excel no contiene hipervínculos (`0 hyperlinks` confirmado con openpyxl). No hay información sobre URLs a nivel de categoría N3.

### En `allTramites.json`
El campo `url` está poblado en los **715 registros (0 vacíos)**. Distribución por dominio:

| Dominio | Cantidad | Estado |
|---------|----------|--------|
| `portal.sat.gob.gt` | 635 | ✅ Dominio oficial |
| `sites.google.com` | **72** | ⚠️ **Riesgo alto** |
| `farm3.sat.gob.gt` | 4 | ⚠️ **Subdominio heredado** |
| `docs.google.com` | 2 | ⚠️ Externo |
| `declaraguate.sat.gob.gt` | 1 | ✅ Subdominio SAT oficial |
| `clicelpoderanticorrupcion.cgc.gob.gt` | 1 | ⚠️ Dominio externo (CGC) |

**Detalle de riesgos:**

- **72 URLs en `sites.google.com`** (dominio: `capacitacionessat.page`): Son URLs de Google Sites para capacitaciones/cursos virtuales SAT. Distribuidas principalmente en N3: Declaraciones y Pagos (25), Facturación Electrónica FEL (11), RTU Digital (9), Servicios al Contribuyente (6). Google Sites puede ser discontinuado en cualquier momento — riesgo de ruptura masiva.

- **4 URLs en `farm3.sat.gob.gt/menu/login.jsf`**: Subdominio heredado (probable legacy pre-migración). Los 4 ítems (SAT-GES-0003, SAT-GES-0071, SAT-GES-0534-DAT, SAT-GES-0600) apuntan exactamente a la misma URL de login, lo que sugiere que son links genéricos sin destino específico.

- **Catálogo deduplicado (`catalogoContenidosUnicos.json`):** 683 ítems únicos (vs. 715 en allTramites.json — diferencia de 32 registros duplicados entre segmentos). Las mismas proporciones de riesgo de URL aplican.

---

## 7. CAMPOS DESCRIPTIVOS

### En el Excel (Sheet 3, Fichas por Rol y Categoría):

| Campo | Longitud promedio | Propósito |
|-------|-------------------|-----------|
| Qué es: (Definición Operativa) | 159–329 chars | Definición formal de la figura jurídico-tributaria |
| Lead text: (Texto Orientador de Interfaz) | 73–157 chars | Texto de orientación para la UI del portal |
| Base jurídica | 82–156 chars | Fundamento legal oficial (decretos, artículos) |

**Completitud:** 100% de los 27 registros N3 tienen los 3 campos completos y ricos en contenido.

**Nota de calidad:** Los textos de "Lead text" en Hoja 3 son más ricos y específicos que los "Alcance" de Hoja 2 (~110–131 chars). Son los textos candidatos a usar directamente en el portal.

### En `allTramites.json`:

| Campo | Descripción |
|-------|-------------|
| `tramite` / `nombreActual` | Título oficial del trámite |
| `descripcion` | Descripción operacional (100% poblado, 0 vacíos) |
| `perfilDestinatario` | Audiencia objetivo |
| `impactoOImportancia` | Relevancia del trámite |
| `baseLegal` | Fundamento legal a nivel de trámite individual |
| `nota` | Notas editoriales internas |

---

## 8. SEGMENTOS Y ACTORES

### Segmentos N1 (4 segmentos canonicos)

| ID canónico JSON | Nombre visible | Trámites |
|-----------------|----------------|----------|
| `contribuyentes` | Contribuyentes | 344 |
| `comercio_exterior` | Operadores de Comercio Exterior | 245 |
| `entes_exentos` | Entes Exentos | 79 |
| `profesionales` | Profesionales | 47 |

### Actores específicos identificados (campo `grupoActor` en JSON)

Los 23 valores no-nulos más frecuentes:

| Actor | Trámites |
|-------|---------|
| Personas Individuales con Negocio | 111 |
| Importadores | 54 |
| Todos los Operadores | 49 |
| Iglesias y Comunidades Religiosas | 46 |
| Depósitos Aduaneros | 37 |
| Municipalidades | 33 |
| ZDEEP | 30 |
| Exportadores | 21 |
| Abogados y Notarios | 18 |
| Apoderados Especiales Aduaneros | 16 |
| Grandes Contribuyentes | 14 |
| Transportistas Aduaneros | 14 |
| Maquilas (Decreto 29-89) | 12 |
| Peritos Contadores | 11 |
| Ciudadanos sin Actividad Mercantil | 10 |
| Agentes Aduaneros | 7 |
| Servicios Profesionales | 6 |
| Asalariados en Relación de Dependencia | 4 |
| Auditores | 4 |
| Empresas de Entrega Rápida (Courier) | 3 |
| — (sin actor específico) | **199** |

Los **199 ítems con `grupoActor = "—"`** corresponden principalmente a trámites transversales de Comercio Exterior (245 total del segmento) que no tienen un actor única.

### Regímenes N2 únicos en el Excel (8 valores):
1. NIT sin Obligaciones
2. Pequeños Contribuyentes
3. Contribuyente General
4. Contribuyentes Especiales
5. Operaciones Aduaneras y Logística
6. Organizaciones No Lucrativas (Exentas)
7. Sector Público y Entidades del Estado
8. Servicios Profesionales y Auxiliares

---

## 9. COLUMNAS DE ORDENAMIENTO

### En el Excel
**No existen campos `orden_n#` en ninguna hoja del Excel.** El ordenamiento está implícito en el número de fila (columna `No.`). Los 27 registros N3 están ordenados siguiendo el ciclo ATO de manera implícita, no por campo explícito.

### En `allTramites.json` (catálogo canónico)

| Campo | Valores nulos | Estado |
|-------|---------------|--------|
| `orden_n1` | 0 | ✅ Completo |
| `orden_n2` | 0 | ✅ Completo |
| `orden_n3` | 0 | ✅ Completo |
| `orden_n4` | **136** (19%) | ⚠️ Incompleto |
| `orden_n5` | **202** (28%) | ⚠️ Incompleto |
| `orden_contenido` | 0 | ✅ Completo |

Los nulos en `orden_n4` y `orden_n5` son **estructuralmente coherentes**: corresponden exactamente a los ítems donde `nivel4_tema = "—"` y `nivel5_tramite = "—"` (trámites que operan directamente bajo N3 sin subdivisión N4/N5).

---

## 10. INCONSISTENCIAS Y ANOMALÍAS NOTABLES

### A. Tipos de Interacción desactualizados en Sheet 1

| Tipo | Sheet 1 (Excel) | allTramites.json (real) | Diferencia |
|------|-----------------|------------------------|------------|
| Guía Informativa / Texto | 490 | 490 | 0 |
| Trámite / Aplicativo en Línea | 137 | 137 | 0 |
| Consulta en Base de Datos | **30** | **75** | **+45** |
| Descarga de Documento / Software | **1** | **13** | **+12** |
| **Total** | **658** | **715** | **57 sin clasificar** |

El Excel Hoja 1 reporta solo 658 trámites clasificados por tipo de interacción, dejando 57 sin asignar. El catálogo JSON tiene los 715 clasificados correctamente. Los valores de "Consulta en Base de Datos" y "Descarga" en el Excel están desactualizados.

### B. Columnas `% Segmento` y `% Portal` completamente vacías (Sheet 2)

Los 27 registros de datos tienen `NaN` en las columnas de porcentaje. Los únicos valores de porcentaje están en las filas de subtotal (`100.0%`) y en el total general. Las celdas individuales parecen formateadas para cálculo automático pero sin fórmula activa (o fórmulas que no calcularon).

### C. Divergencia estructural N3: Excel vs JSON

El Excel usa 27 nombres de N3 que son **distintos** de los 59 valores de `nivel3_subarea` en el JSON. El Excel trabaja a nivel de **grupo/actor** (ej. "Auxiliares AFPA"), mientras que el JSON desglosa en subgrupos más finos (ej. "Agentes Aduaneros", "Depósitos Aduaneros", "Transportistas Aduaneros", etc.). Los campos de mapeo son:

- Excel N3 "Categoría / Actor" → JSON `regimenArea` (13 valores) o `grupoNombre` (8 valores)
- No hay un campo JSON que replique exactamente los 27 nombres del Excel

### D. IDs no-estándar en el catálogo JSON

**70 trámites** (9.8%) tienen IDs con sufijos especiales que violan el esquema canónico `SAT-GES-####`:
- `-B`: 5 ítems (variantes de trámites base — indica duplicación conceptual)
- `-AGD`: 16 ítems (Almacenes Generales de Depósito — sub-tipo de AFPA)
- `-DAT`: 19 ítems (Depósitos Aduaneros Temporales — sub-tipo de AFPA)
- `-ZDEEP-USR`: ~20 ítems (usuarios de zonas ZDEEP)
- `-ZDEEP-ADM`: ~10 ítems (administradores de zonas ZDEEP)

Estos 70 IDs rompen la regla de "Código Institucional Inmutable" (`SAT-GES-####`) establecida en AGENTS.md. Son trámites que fueron duplicados con sufijo en lugar de usar IDs únicos consecutivos.

### E. 12 trámites marcados como `esBrecha = true`

Hay 12 registros con `esBrecha: True`, todos concentrados en la categoría AFPA (Auxiliares de la Función Pública Aduanera), principalmente en variantes -AGD y -DAT. Ejemplos:
- SAT-GES-0436: Autorización inicial y registro de mandato para apoderados
- SAT-GES-0447-AGD: Registro y emisión de títulos de crédito (Certificado AGD)
- SAT-GES-0453-DAT: Control de descarga, ingreso de bultos y actas

Estas brechas representan trámites identificados pero no completamente implementados en el portal.

### F. `codigos_legacy` vacío en el 100% de los registros

El campo `codigos_legacy` existe en el schema y en todos los 715 registros, pero ninguno tiene valor. Este campo fue diseñado para preservar IDs anteriores a la migración, pero nunca fue poblado.

### G. 72 URLs en Google Sites (`capacitacionessat.page`)

No son URLs del portal oficial `portal.sat.gob.gt`. Son links a un sitio de Google Sites para capacitaciones. Están distribuidos en trámites de tipo "guia_informativa" para cursos virtuales y materiales didácticos. Este sitio es externo al dominio SAT y puede desaparecer sin aviso.

---

## 11. TOTAL DE REGISTROS

| Fuente | Total |
|--------|-------|
| **Excel Sheet 2 total declarado** | **715 trámites** |
| **`allTramites.json`** | **715 registros** ✅ coincide |
| **`catalogoContenidosUnicos.json`** (deduplicado) | **683 contenidos únicos** |
| Diferencia (duplicados entre segmentos) | 32 registros |

Los 715 trámites en `allTramites.json` corresponden a las **instancias de navegación** (un mismo contenido puede aparecer bajo múltiples segmentos). Los 683 en el catálogo de contenidos únicos son las **páginas/URLs únicas** del portal.

---

## 12. COLUMNAS VACÍAS O CON DATOS FALTANTES SIGNIFICATIVOS

### Excel:

| Hoja | Campo | Estado |
|------|-------|--------|
| Sheet 2 | `% Segmento` | **100% vacío** (27/27 NaN) |
| Sheet 2 | `% Portal` | **100% vacío** (27/27 NaN) |
| Sheet 3 | Fila TOTAL (No.=NaN) | Lead text y Base jurídica vacíos — esperado |

### JSON (`allTramites.json`):

| Campo | Nulos | % | Evaluación |
|-------|-------|---|-----------|
| `orden_n4` | 136 | 19% | ⚠️ Esperado (ítems sin N4) |
| `orden_n5` | 202 | 28% | ⚠️ Esperado (ítems sin N5) |
| `codigos_legacy` | 715 | 100% | 🔴 Nunca poblado |
| `actorEspecifico` | ~199 | 28% | ⚠️ Usa `"—"` como placeholder |
| `nota` | variable | ~80%+ | Notas editoriales, muchos vacíos |
| `descripcion` | 0 | 0% | ✅ Completo |
| `url` | 0 | 0% | ✅ Completo |
| `tramite` / `nombreActual` | 0 | 0% | ✅ Completo |
| `etapaAto` | 0 | 0% | ✅ Completo |
| `tipoInteraccion` | 0 | 0% | ✅ Completo |

---

## CONCLUSIONES Y RECOMENDACIONES

### Conclusión 1: El Excel es un documento estratégico, no operacional
El Excel define la **arquitectura de información a 3 niveles** (N1–N3) con textos institucionales de alta calidad. No tiene IDs, URLs ni datos de trámites individuales. Su valor principal está en los **27 textos de "Qué es"**, **27 lead texts** y **27 bases jurídicas** de la Hoja 3 — textos que deben sincronizarse con el portal.

**Recomendación:** Usar los lead texts de Sheet 3 como fuente de verdad para los textos de encabezado de cada categoría N3 en el portal. Verificar si `taxonomyDescriptions.ts` (79KB) ya los incorporó o si hay drift.

### Conclusión 2: Los tipos de interacción en Sheet 1 están desactualizados
Sheet 1 reporta 658 trámites clasificados en 4 tipos, dejando 57 sin clasificar. El JSON tiene 715 clasificados. La diferencia es: `consulta_datos` (75 real vs. 30 en Excel, diferencia +45) y `descarga_recurso` (13 real vs. 1 en Excel, diferencia +12).

**Recomendación:** Actualizar Sheet 1 con los valores del JSON: Guía Informativa=490, Transaccional=137, Consulta en BD=75, Descarga=13.

### Conclusión 3: 70 IDs violan el esquema canónico
Los sufijos -B, -AGD, -DAT, -ZDEEP-USR, -ZDEEP-ADM representan una deuda técnica en el catálogo. Si el AGENTS.md exige `SAT-GES-####` como identificador canónico universal, estos 70 ítems necesitan migración a IDs puros o documentación explícita como excepción.

**Recomendación:** Decidir si los sufijos se mantienen como codigos_legacy (preservándolos en ese campo) o si se reasignan a IDs consecutivos en la serie 684–753.

### Conclusión 4: 72 URLs en Google Sites representan riesgo de ruptura
Los 72 trámites con URLs en `capacitacionessat.page` (Google Sites) son vulnerables a discontinuación sin aviso. Son principalmente cursos virtuales de la categoría "Normativa y asistencia" (ATO stage 5).

**Recomendación:** Auditar si estas URLs siguen activas (HTTP check). Si los cursos se han migrado al portal SAT, actualizar URLs. Si no, documentar como riesgo en el backlog.

### Conclusión 5: `codigos_legacy` está vacío — oportunidad perdida
El campo existe en los 715 registros pero nunca fue poblado. Si los IDs con sufijos (-AGD, -DAT, etc.) tienen IDs anteriores en sistemas legacy, este es el campo correcto para preservarlos.

**Recomendación:** Poblar `codigos_legacy` con el ID base numérico para los 70 ítems con sufijos (ej. SAT-GES-0437-AGD → legacy: "SAT-GES-0437").

### Conclusión 6: Las columnas `% Segmento` y `% Portal` de Sheet 2 están vacías
Columns vacías al 100% en los registros de datos. Los subtotales sí tienen `100.0%`. Parece un error de formateo o de fórmula Excel al guardar.

**Recomendación:** Calcular y completar estos porcentajes. Ejemplo: Contribuyentes = 344/715 = 48.1%, Comercio Exterior = 245/715 = 34.3%, etc. A nivel N3, por ejemplo: Declaraciones y Pagos = 70/344 = 20.3% dentro de Contribuyentes.

### Conclusión 7: N3 del Excel y N3 del JSON son niveles distintos
El Excel usa 27 nombres de N3 (nivel de "Categoría/Actor agregada"), mientras el JSON tiene 59 valores de `nivel3_subarea` (nivel más fino). El JSON expande cada N3 del Excel en múltiples subáreas. La reconciliación correcta es mediante el campo `regimenArea` del JSON (13 valores, subconjunto de los 27 del Excel) y/o `grupoNombre` (8 valores para Contribuyentes).

**No existe un campo 1:1 entre el Excel N3 y el JSON.** Esto debe resolverse antes de cualquier automatización del ETL Excel→JSON.

---

*Análisis generado con Python 3 / pandas + openpyxl. Fuentes verificadas: archivo Excel (3 hojas), `src/data/allTramites.json` (715 registros), `src/data/catalogoContenidosUnicos.json` (683 registros), `src/data/schema.ts`, `src/data/portalMasterTaxonomy.ts`.*
