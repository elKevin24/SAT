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

### B. Capacidad de Memoria de Trabajo (Ley de Miller: $7 \pm 2$)
* Conforme a la Ley de Miller (1956), la persona promedio puede retener entre 5 y 9 elementos ($7 \pm 2$) en su memoria de trabajo simultáneamente.
* Ninguna categoría debe presentar listas planas abrumadoras de 12 o 15 opciones inconexas.
* Los elementos se agrupan en fragmentos cognitivos (*chunks*) de $7 \pm 2$ opciones orientadas a tareas u operadores afines.

### C. Compactación Asimétrica de Niveles
* **Problema Común ("Efecto Espejo"):** Estructuras donde Nivel 4 repite literalmente el nombre de Nivel 5 (ej. *«ZDEEP > ZDEEP»* o *«DAT > DAT»*), obligando al usuario a realizar clics redundantes.
* **Solución:** Supresión de niveles intermediarios ficticios. La profundidad se adapta asimétricamente a la necesidad real: ramas simples (2-3 niveles) conviven naturalmente con ramas complejas (4 niveles de actor aduanero).

### D. Taxonomía Multidimensional ATO (Australian Taxation Office)
Cada trámite u objeto de contenido posee 4 dimensiones ortogonales:
1. **Dimensión 1 (Perfil / Actor):** Audiencia primaria (Contribuyentes, Comercio Exterior, Entes Exentos, Profesionales) y rol específico.
2. **Dimensión 2 (Ciclo de Vida ATO):** `empezar` (altas y padrones), `operar` (rutina y declaraciones), `consultar` (verificadores en tiempo real), `modificar_cerrar` (cambios, traspasos y ceses), `normativa` (marco legal y recursos). **Sin prefijos numéricos en la interfaz.**
3. **Dimensión 3 (Tipología de Interacción):** `servicio_transaccional` (trámite en línea), `consulta_datos` (búsqueda de base de datos), `guia_informativa` (ficha de requisitos y pasos), `descarga_recurso` (software/formularios).
4. **Dimensión 4 (Plataforma Técnica):** Agencia Virtual, Declaraguate, Sistemas Aduaneros (SAQD/DUCA), Portales Públicos.

### E. Plain Language (Lenguaje Ciudadano)
* Títulos orientados a la acción con verbos infinitivos o sustantivos directos claros.
* Supresión de acrónimos burocráticos internos en títulos visibles (ej. de *"MIAD"* a *"Aduana sin Papeles y modernización"*).
* Descripciones redactadas bajo la estructura: *[Verbo de acción] + [Objeto del trámite] + [Finalidad o beneficio ciudadano]*.

### F. Gobernanza Documental Estricta
* **Fuentes Históricas / Clásicas (Inalterables):** Se preservan intactas como testimonio de auditoría inicial (`Detalle de Contenido para Grupos de Interes.xlsx`, `Arbol_de_Navegacion_Portal_v5.xlsx`, `Ruta de procesos.xlsx`).
* **Entregables Vivos / Oficiales (Sincronizados):** Se recalculan y mantienen en sincronía biunívoca con `src/data/allTramites.json`:
  * `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` (Libro maestro con fórmulas dinámicas de resumen y matriz de 25 columnas).
  * `Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx` (Mapa antes/después y fichas en lenguaje ciudadano).

### G. Estándar de Identificación Inmutable (`SAT-GES-####`)
* Cada trámite, servicio o guía se gobierna por el código canónico universal **`SAT-GES-####`** (del `SAT-GES-0001` al `SAT-GES-0683`).
* Se erradican los prefijos atados a hojas o segmentos (`contribuyentes-`, `comercio_exterior-`, `profesionales-`, `entes_exentos-`), trasladándolos al atributo de auditoría forense `codigos_legacy` / `idOriginal`.
* El código **no se altera ante reestructuraciones de menú, cambios de nombre o asignación a múltiples audiencias (polijerarquía)**.

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
