---
name: sat-ia-audit-sync
description: >-
  Auditoría, normalización taxonómica, compactación de niveles y sincronización multidimensional
  (dataset JSON, libros Excel maestros y contratos de datos TypeScript) para la arquitectura de
  información del Portal SAT Guatemala o portales públicos de alta densidad. Usar cuando se requiera
  reestructurar ramas de trámites, resolver redundancias de navegación, aplicar dimensiones ATO,
  redactar en lenguaje ciudadano o sincronizar entregables garantizando la gobernanza documental.
---

# Skill: Auditoría y Sincronización de Arquitectura de Información (SAT IA-Audit-Sync)

Esta skill documenta el procedimiento estándar, principios metodológicos y herramientas técnicas aplicadas en la reestructuración integral de la Arquitectura de Información del **Portal Web SAT Guatemala**, con especial énfasis en la optimización de los **Operadores de Comercio Exterior** (246 trámites en 6 ramas canónicas), el saneamiento de **Profesionales** (47 trámites netos en 5 roles) y el universo total de **716 trámites consolidados**.

---

## 1. Principios Metodológicos y Marco Teórico

### A. Desacoplamiento Formal de Capas
* **Arquitectura de Información (IA):** Estructura relacional del conocimiento (árbol semántico padre-hijo). Puede tener 3, 4 o más niveles según la complejidad intrínseca de la materia.
* **Modelo de Navegación:** Mecanismos visuales que permiten al usuario recorrer la arquitectura (Breadcrumbs, Sidebar, Menú Principal, Enlaces transversales).
* **Regla de Desacoplamiento:** *Que un contenido resida en el nivel 5 o 6 de la IA no exige renderizar 5 o 6 niveles simultáneos en la interfaz.* El Sidebar se acota al hub temático local y el Breadcrumb aplica elipsis compacta `[…]` en pantallas móviles.

### B. Capacidad de Memoria de Trabajo (Ley de Miller: $7 \pm 2$) y Rango Óptimo
* Conforme a la Ley de Miller (1956), la mente humana procesa con eficacia entre 5 y 9 fragmentos de información ($7 \pm 2$) en su memoria de trabajo simultáneamente.
* **Rango Óptimo (5 a 9 elementos):** Cuando un nodo agrupa entre 5 y 9 trámites directos (ej. *Agentes Aduaneros* con exactamente 7 trámites), se exponen en **secuencia directa bajo el nodo contenedor**, eliminando carpetas intermedias artificiales.
* **Sobrecarga Cognitiva (> 9 elementos):** Listas planas de 12 a 18 trámites (ej. *Apoderados Especiales* con 16 o *DAT* con 18) saturan al ciudadano y **exigen partición modular** en sub-bloques temáticos o de ciclo de vida ATO.

### C. Regla de Umbral de Densidad y Ramificación (Notación $A, A_1, A_2$)
La profundidad del árbol nunca es simétrica ni obligada; se rige por la densidad real de cada subrama:

#### 1. Condición de Compactación / Sub-densidad ($A \to A_1, A_2$ con hojas $\le 2$)
```
        A
      /   \
    A1     A2       Si A1 y A2 contienen solo 1 o 2 trámites sueltos y ahí terminan:
    |      |        -> Se eliminan los niveles intermedios A1 y A2 (sobre-andamiaje).
   [T1]   [T2]      -> T1 y T2 cuelgan directamente de A.
```
* **Diagnóstico:** Crear un nivel intermedio para 1 o 2 trámites terminales genera **nodos pasarela (*pass-through nodes*)** y pantallas vacías con un solo botón.
* **Acción:** **SÍ se compacta**. Los trámites se elevan al nivel superior. Ejemplos: *Empresas Courier* (3 trámites netos pasan a N3 directo; se suprimen las 3 carpetas de 1 trámite) y *OEA* (2 trámites pasan a N2 directo).

#### 2. Condición de Retención de Jerarquía Profunda ($A \to A_1$ con masa crítica $\ge 10$)
```
        A
        |
       A1 (>= 10 trámites con subestructura rica)
     /    \
   A1.1   A1.2 ...  -> NO se compacta. Se preserva la jerarquía profunda (N4 / N5).
```
* **Diagnóstico:** Compactar a la fuerza un subárbol con $\ge 10$ trámites provocaría **colapso de contexto (*context collapse*)**, listas heterogéneas caóticas y pérdida de especificación regulatoria.
* **Acción:** **SE PRESERVA LA PROFUNDIDAD**. Ejemplos: *Depósitos Aduaneros Temporales (DAT - 18)*, *Almacenes Generales de Depósito (AGD - 16)* y *ZDEEP (30)*.

#### 3. Asimetría Rama por Rama (Nodos Monocatenarios)
```
          A
        /   \
      A1     A2
      |     / | \
    A1.1  A2.1 A2.2 A2.3
```
* **Rama Monocatenaria ($A_1 \to A_{1.1}$):** Un nodo con un único hijo no clasifica nada (clasificar exige elegir entre $\ge 2$ opciones) $\to$ **Se compacta**.
* **Rama Ramificada ($A_2 \to A_{2.1}, A_{2.2}, A_{2.3}$):** Bifurcación funcional genuina $\to$ **Se preserva la jerarquía**.
* **Principio Rector:** La compactación se evalúa **rama por rama**, nunca imponiendo la misma profundidad a ramas hermanas.

### D. Gobernanza del Orden y Desacoplamiento Numérico
* **Prohibición de Números Quemados en Títulos:** Queda terminantemente prohibido incluir prefijos numéricos en los textos de `Nivel 1..5` o `Nombre del Trámite` (ej. PROHIBIDO: `"1. Transmisión de Declaración"`; CORRECTO: `"Transmisión de la Declaración de Mercancías"`).
* **Control Exclusivo por Columnas de Orden (`orden_n1` a `orden_n5`):** La posición y secuencia la gobiernan exclusivamente los campos numéricos de la matriz de 25 columnas.
* **Criterio de Secuencia Universal por Ciclo ATO:**
  1. `Empezar y registrarse` (altas, padrones, requisitos iniciales, carnés).
  2. `Operación y declaraciones` (rutina operativa, transmisión DUCA, pagos, sistemas).
  3. `Consultas y herramientas` (verificadores, consulta de expedientes, selectivo).
  4. `Modificaciones y cierre` (renovación anual de fianza, traspasos, ceses).
  5. `Normativa y asistencia` (capacitaciones, cursos virtuales, marco legal).
* **Indexación en Ramas Compactadas:** Cuando una rama se compacta a N3 (como Agentes Aduaneros o Courier):
  - `orden_n4` toma la posición ordinal **1 a 7** del trámite terminal.
  - `nivel4_tema`, `nivel5_tramite` y `orden_n5` quedan en blanco / guion (**`—`**).

### E. Estándar de Identificación Inmutable (`SAT-GES-####`)
* **Código Universal Único:** Todo trámite, guía, consulta o descarga se gobierna por el código canónico **`SAT-GES-####`** (del `SAT-GES-0001` al `SAT-GES-0683`).
* **Inmutabilidad Absoluta:**
  1. No cambia ante reestructuraciones de menú o cambios de nivel.
  2. No cambia ante reformas de nombres o títulos comerciales.
  3. No se duplica ante proyecciones multi-audiencia (polijerarquía).
* **Slug Semántico:** Identificador limpio en kebab-case para URLs amigables (`portal.sat.gob.gt/gestion/[slug]`).
* **Trazabilidad Forense (`codigos_legacy`):** Los códigos de origen de hojas clásicas (`["comercio_exterior-128", "profesionales-15"]`) se archivan en `codigos_legacy` para auditoría, pero no operan como identificador primario.

### F. Matriz Oficial de 25 Columnas (Opción A - Intercalada)
Estructura canónica de los entregables Excel y datasets:
1. `No.` | 2. `ID Trámite / Código Oficial (SAT-GES-####)` | 3. **`Orden N1`** | 4. **`Nivel 1`** | 5. **`Orden N2`** | 6. **`Nivel 2`** | 7. **`Orden N3`** | 8. **`Nivel 3`** | 9. **`Orden N4`** | 10. **`Nivel 4`** | 11. **`Orden N5`** | 12. **`Nivel 5`** | 13. `Nombre del Trámite / Servicio (Lenguaje Claro)` | 14. `Ruta de Navegación (Miga de Pan)` | 15. `Etapa Ciclo de Vida ATO` | 16. `Tipo de Interacción` | 17. `Tipología de Contenido` | 18. `Plataforma / Sistema` | 19. `Canal` | 20. `Control de Auditoría` | 21. `¿Para qué sirve? (Descripción Operativa)` | 22. `Base Legal / Fundamento Jurídico` | 23. `Ruta de Procesos Asociada` | 24. `Estado Normativo` | 25. `URL Portal SAT`

### G. Taxonomía Multidimensional ATO (Australian Taxation Office)
Cada trámite u objeto de contenido posee 4 dimensiones ortogonales:
1. **Dimensión 1 (Perfil / Actor):** Audiencia primaria (Contribuyentes, Comercio Exterior, Entes Exentos, Profesionales) y rol específico.
2. **Dimensión 2 (Ciclo de Vida ATO):** `empezar`, `operar`, `consultar`, `modificar_cerrar`, `normativa`. Sin prefijos numéricos en la interfaz.
3. **Dimensión 3 (Tipología de Interacción):** `servicio_transaccional`, `consulta_datos`, `guia_informativa`, `descarga_recurso`.
4. **Dimensión 4 (Plataforma Técnica):** Agencia Virtual, Declaraguate, Sistemas Aduaneros, Portales Públicos.

### H. Plain Language (Lenguaje Ciudadano)
* Títulos orientados a la acción con verbos infinitivos o sustantivos directos claros.
* Cero acrónimos huérfanos o siglas opacas en títulos visibles.
* Descripciones operativas bajo la fórmula: *[Verbo de acción] + [Objeto del trámite] + [Finalidad o beneficio ciudadano]*.

### I. Gobernanza Documental Estricta
* **Fuentes Históricas / Clásicas (Inalterables):** Se preservan intactas como testimonio de auditoría inicial (`Detalle de Contenido para Grupos de Interes.xlsx`, `Arbol_de_Navegacion_Portal_v5.xlsx`, `Ruta de procesos.xlsx`).
* **Entregables Vivos / Oficiales (Sincronizados):** Se recalculan y mantienen en sincronía biunívoca con `src/data/allTramites.json`:
  * `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` (Libro maestro con fórmulas dinámicas de resumen y matriz de 25 columnas).
  * `Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx` (Mapa antes/después y fichas en lenguaje ciudadano).

---

## 2. Taxonomía Canónica de Comercio Exterior (Referencia Estable)

Distribución de los **246 trámites aduaneros** en **6 ramas maestras**:

| Rama Canónica | Trámites | Subcategorías Oficiales |
| :--- | :---: | :--- |
| **1. Importadores** | **55** | `Registro y Padrón de Importadores` (9), `Declaraciones Aduaneras y DUCAs` (10), `Despacho Aduanero, Levante y Selectivo` (17), `Importación y Nacionalización de Vehículos` (10), `Mercancías en Abandono, Depósitos y Franquicias` (9). |
| **2. Exportadores** | **21** | `Padrón y Registro de Exportadores` (7), `Declaraciones Aduaneras y Embarques` (4), `Devolución de Crédito Fiscal` (10). |
| **3. Operador Económico Autorizado (OEA)** | **2** | `Programa OEA` (2). |
| **4. Auxiliares de la Función Pública Aduanera (AFPA)** | **76** | `Agentes Aduaneros` (7), `Apoderados Especiales Aduaneros` (16), `Depósitos Aduaneros` (36: DAT 18, AGD 16, Fiscales 2), `Empresas de Entrega Rápida o Courier` (3), `Transportistas Aduaneros` (14). |
| **5. Regímenes Territoriales y Zonas Especiales** | **42** | `Maquilas (Decreto 29-89)` (12), `Zonas de Desarrollo Económico Especial Público (ZDEEP)` (30: Usuarias 15, Administradoras 15). |
| **6. Normativa y Operaciones Aduaneras Generales** | **50** | `Arancel Centroamericano (SAC) y Permisos` (7), `Acuerdos Comerciales y Facilitación` (8), `Prevención de Contrabando y Defraudación` (3), `Consultas Técnicas, Recursos y Valoración` (14), `Modernización e Infraestructura Aduanera` (18). |

---

## 3. Protocolo de Ejecución Paso a Paso (Runbook)

### Paso 1: Respaldo de Seguridad
Antes de cualquier modificación masiva en los datos:
```powershell
Copy-Item "src/data/allTramites.json" "src/data/allTramites.json.bak"
```

### Paso 2: Ejecución del Script de Normalización
Aplicar las reglas de auditoría y consolidación taxonómica sobre el JSON:
```powershell
python scripts/apply_comercio_exterior_audit.py
```
*El script debe:*
* Clasificar cada ID en su rama canónica y subcategoría correspondiente.
* Reconstruir `migaBreadcrumb` sin duplicidades intermedias.
* Sanear títulos con acrónimos crípticos.
* Etiquetar correctamente las 12 brechas normativas (`esBrecha: true`).

### Paso 3: Sincronización de Libros Excel Entregables
Reconstruir los libros Excel vivos utilizando `openpyxl`:
```powershell
python scripts/build_final_excel_deliverable.py
python scripts/build_mapa_y_descripciones_excel.py
```
*Verificar que:*
* Las fórmulas `=COUNTA`, `=COUNTIF`, `=SUM` de la hoja `Resumen Arquitectura` operen sin errores `#REF!` o `#VALUE!`.
* El conteo total de filas coincida exactamente con la longitud del JSON (718 registros).
* Las fuentes clásicas en `docs/fuentes-datos/` no hayan sufrido alteración.

### Paso 4: Actualización del Contrato de Datos (`src/data/categoryOrder.ts`)
Actualizar las constantes que rigen la unión entre UI y datos:
1. `OFFICIAL_CATEGORY_ORDER.comercio_exterior`: Contener exactamente las 6 ramas oficiales.
2. `SPECIFIC_SUBCATEGORY_ORDER`: Mapear las subcategorías oficiales para cada una de las 6 ramas.
3. Asegurar que no queden referencias a las 12 categorías planas obsoletas.

### Paso 5: Verificación Automatizada (Build y Tests)
Ejecutar la suite completa de pruebas:
```powershell
# 1. Compilación de producción
npm run build

# 2. Pruebas de accesibilidad y contrato de datos
npx playwright test
```
*Criterio de Aceptación:*
* **19 de 19 tests aprobados (100%)**.
* 0 violaciones WCAG 2.2 AA detectadas por axe-core en modales, páginas y flujos.
* `order categorías: cada nombre oficial existe en el dataset` $\to$ APROBADO.
* `order subcategorías: nombres oficiales existen y cubren categorías` $\to$ APROBADO.
* `catalogoContenidosUnicos: 683 contenidos únicos desacoplados y suma exacta de 716 audiencias` $\to$ APROBADO.

### Paso 6: Actualización Documental en Markdown
Actualizar la documentación técnica para reflejar los cambios:
* `docs/arquitectura-informacion/ESTRUCTURA_FINAL_CONTENIDO.md`
* `docs/arquitectura-informacion/TAXONOMIA_Y_DIMENSIONES_PORTAL_SAT.md`
* `docs/arquitectura-informacion/MAPA_DE_NAVEGACION_COMERCIO_EXTERIOR.md`
* `docs/arquitectura-informacion/MAPA_DE_NAVEGACION_PROFESIONALES.md`
* `docs/arquitectura-informacion/brechas-comercio-exterior.md`
* `docs/fuentes-datos/README.md`
* `docs/README.md`
* `database/README.md`

---

## 4. Checklist Rápido de Calidad (DoD - Definition of Done)

- [ ] **0 Duplicados** en IDs de trámites a lo largo de todo el catálogo.
- [ ] **716 registros consolidados** (344 Contribuyentes, 246 Comercio Exterior, 79 Entes Exentos, 47 Profesionales).
- [ ] **683 contenidos únicos NoSQL** generados con matriz de audiencias transversales y suma exacta de 716 proyecciones.
- [ ] **6 ramas canónicas** en Comercio Exterior, sin categorías huérfanas.
- [ ] **5 categorías saneadas** en Profesionales sin subcategorías genéricas.
- [ ] **Fuentes históricas intactas** (`Detalle de Contenido...`, `Arbol_de_Navegacion...`, `Ruta de procesos...`).
- [ ] **Libros Excel vivos recalculados** y sincronizados con `allTramites.json`.
- [ ] **`npm run build`** finalizado con 0 errores de tipado o compilación.
- [ ] **`npx playwright test`** pasando al 100% (19/19 pruebas).
