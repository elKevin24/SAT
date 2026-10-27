---
name: sat-ia-audit-sync
description: >-
  Ejecuta el flujo ETL de auditoría taxonómica, compactación asimétrica de niveles, validación de URLs
  (HTTP 200 OK) y sincronización multidimensional entre src/data/allTramites.json, src/data/categoryOrder.ts
  y los libros Excel maestros de 25 columnas del Portal SAT. Úsalo cuando se pida ejecutar scripts de
  datos en scripts/, regenerar entregables .xlsx, auditar enlaces rotos o sincronizar masivamente el catálogo.
---

# SAT IA Audit & Sync (Runbook ETL y Sincronización Multidimensional)

Procedimiento ejecutable de bajo grado de libertad para auditar, normalizar y sincronizar en bloque el catálogo de **715 proyecciones (683 gestiones únicas)** entre el dataset JSON, los contratos TypeScript y los libros Excel entregables.

> Para la especificación detallada de las **25 columnas oficiales (Opción A)**, la teoría de densidad ($A, A_1, A_2$) y la tabla de referencia de las 6 ramas de Comercio Exterior, consulta [references/taxonomy-and-matrix-spec.md](./references/taxonomy-and-matrix-spec.md).

---

## 1. Reglas Críticas de Gobernanza ETL (Grado de Libertad Bajo)

1. **Inmutabilidad de Fuentes Históricas:** Prohibido modificar los archivos en `docs/fuentes-datos/` (`Detalle de Contenido para Grupos de Interes.xlsx`, `Arbol_de_Navegacion_Portal_v5.xlsx`, `Ruta de procesos.xlsx`). Solo lectura.
2. **Niveles Numéricos y Guion Largo (`—`):** Las columnas de jerarquía se rotulan estrictamente `Nivel 1` a `Nivel 5` y `Orden N1` a `Orden N5`. Si un nivel intermedio no aplica por compactación, inyectar exactamente `—` (guion largo) tanto en el nivel como en su columna de orden.
3. **Desacoplamiento Numérico y Lenguaje:** Prohibido quemar números al inicio de títulos o niveles. Prohibido usar la palabra *"trámite"* en textos visibles (usar **"gestión" / "gestiones"**).
4. **Cero Enlaces Rotos o al Home:** Ninguna gestión puede apuntar a `404` ni a `https://portal.sat.gob.gt/` genérico.

---

## 2. Flujo de Ejecución Paso a Paso (Runbook)

### Paso 1: Respaldo Preventivo del Dataset
Antes de correr scripts de transformación sobre el catálogo maestro:
```powershell
Copy-Item "src/data/allTramites.json" "src/data/allTramites.json.bak"
```

### Paso 2: Normalización Taxonómica y Saneamiento de Datos
Ejecutar los scripts de auditoría y consolidación según la rama intervenida:
- Auditoría general y coherencia del árbol:
  [`scripts/auditoria_1_coherencia_arbol.py`](../../../scripts/auditoria_1_coherencia_arbol.py)
- Verificación de números quemados en títulos/niveles:
  [`scripts/check_numbers_in_json.py`](../../../scripts/check_numbers_in_json.py)
- Expansión de acrónimos en títulos:
  [`scripts/normalize_acronyms_in_titles.py`](../../../scripts/normalize_acronyms_in_titles.py)
- Sincronización de taxonomía asimétrica:
  [`scripts/sync_asymmetric_taxonomy.py`](../../../scripts/sync_asymmetric_taxonomy.py)
- Generación del catálogo de 683 contenidos únicos desacoplados:
  [`scripts/build_catalogo_contenidos_unicos.py`](../../../scripts/build_catalogo_contenidos_unicos.py)

### Paso 3: Validación Activa y Rescate de URLs (`HTTP 200 OK`)
1. Ejecutar el validador de enlaces:
   ```powershell
   python scripts/validate_urls.py
   ```
2. Si se detecta cualquier `404 Not Found` o redirección a la raíz `/`:
   - Buscar la ruta activa en el portal oficial (`site:portal.sat.gob.gt "<nombre de la gestión>"`).
   - Verificar que la nueva URL responda `HTTP 200 OK` y actualizarla en `src/data/allTramites.json`.

### Paso 4: Sincronización de Contratos TypeScript (`src/data/categoryOrder.ts`)
Si cambiaron nombres u órdenes de `Nivel 2` o `Nivel 3`:
1. Actualizar `OFFICIAL_CATEGORY_ORDER` y `SPECIFIC_SUBCATEGORY_ORDER` en [`src/data/categoryOrder.ts`](../../../src/data/categoryOrder.ts).
2. Si se modificaron descripciones de nodos taxonómicos, ejecutar:
   ```powershell
   python scripts/generate_taxonomy_descriptions_ts.py
   ```

### Paso 5: Regeneración de Libros Excel Entregables Vivos
Reconstruir los libros maestros sincronizados con `src/data/allTramites.json`:
```powershell
python scripts/build_final_excel_deliverable.py
python scripts/build_mapa_y_descripciones_excel.py
python scripts/build_catalogo_contenidos_excel.py
```
- **Auditar entregables generados:**
  ```powershell
  python scripts/audit_entregables_completa.py
  ```
  Confirmar que las 25 columnas estén completas, que las hojas de resumen no tengan errores `#REF!` / `#VALUE!` y que el conteo de filas coincida exactamente con el JSON.

---

## 3. Bucle de Verificación Obligatorio (Feedback Loop)

Ninguna ejecución ETL se da por terminada sin superar este bucle de pruebas:

1. **Compilación y tipado estricto:**
   ```powershell
   npm run build
   ```
2. **Suite de pruebas E2E, contrato de datos y accesibilidad:**
   ```powershell
   npx playwright test
   ```
3. **Si algún test falla:**
   - Leer la traza de error de Playwright (ej. desajuste entre `OFFICIAL_CATEGORY_ORDER` y `allTramites.json`, conteo de contenidos únicos o violación axe-core).
   - Corregir el dato en el script/JSON o actualizar `categoryOrder.ts`, regenerar los Excel si aplica y **volver a ejecutar `npx playwright test` hasta obtener 100% en verde**.
4. **Limpieza:** Eliminar `src/data/allTramites.json.bak` una vez validado el éxito total.
