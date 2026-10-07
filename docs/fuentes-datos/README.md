# Fuentes de Datos y Matrices Excel — Portal SAT

Este directorio contiene las hojas de cálculo y matrices maestras utilizadas para el inventario, análisis y extracción de los trámites y procesos de la SAT.

---

## 📊 Inventario de Libros Excel

| Archivo Excel | Descripción | Rol en el Proyecto | Checkbox |
| :--- | :--- | :---: | :---: |
| Archivo Excel | Descripción | Rol en el Proyecto | Checkbox |
| :--- | :--- | :---: | :---: |
| `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` | **Libro Maestro Definitivo (783 filas)** con navegación asimétrica, desglose de actores multinivel (AFPA, ZDEEP), migas de pan dinámicas y dimensiones ATO | Fuente Oficial de Producción | [x] |
| `Arbol_de_Navegacion_Portal_v5.xlsx` | Matriz previa de navegación y trámites por segmento (379 filas en comercio exterior) | Insumo Base / Trabajo | [x] |
| `Detalle de Contenido para Grupos de Interes.xlsx` | Fichas detalladas y requisitos por grupo de interés | Insumo Base | [x] |
| `Ruta de procesos.xlsx` | Matriz de procesos guiados y etapas tributarias | Insumo Base | [x] |

---

## 📋 Lista de Control de Integridad y Sincronización

### Integridad de Datos y Taxonomía Institucional
- [x] Consolidación sin pérdida: 783 registros únicos verificados y 0 duplicados en `ID Trámite`.
- [x] Desglose asimétrico de actores: Soporte nativo para 2 niveles en ramas simples (ej. Contribuyentes) y hasta 4 niveles de actor en ramas profundas (AFPA $\rightarrow$ Depósitos $\rightarrow$ Almacenes Fiscales / AGD / DAT; Regímenes Especiales $\rightarrow$ ZDEEP $\rightarrow$ Administradoras / Usuarias).
- [x] Miga de Pan dinámicamente calculada (`Ruta de Navegación`) para el 100% de los trámites.
- [x] Erradicación de términos ajenos como *"canónico"* y sustitución por *Materia / Tema* y *Subtema / Tipo de Gestión*.
- [x] Asignación de dimensiones ATO (5 etapas de ciclo de vida + 5 tipos de interacción) para el 100% de los trámites.
- [x] Hoja de Resumen Arquitectura equipada con 27 fórmulas dinámicas nativas (`=COUNTA`, `=COUNTIF`, `=SUM`).
- [x] Sincronización exacta de la hoja `Brechas Normativas (12)` con sus preguntas para la mesa técnica SAT.
- [ ] Validación de URLs y enlaces oficiales de destino SAT para los 783 trámites.

---

## 📂 Archivos en esta Carpeta

- `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`
- `Arbol_de_Navegacion_Portal_v5.xlsx`
- `Detalle de Contenido para Grupos de Interes.xlsx`
- `Ruta de procesos.xlsx`
