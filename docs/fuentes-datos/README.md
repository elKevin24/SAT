# Fuentes de Datos y Matrices Excel — Portal SAT

Este directorio contiene las hojas de cálculo y matrices maestras utilizadas para el inventario, análisis y extracción de los trámites y procesos de la SAT.

---

## 📊 Inventario de Libros Excel

| Archivo Excel | Descripción | Rol en el Proyecto | Checkbox |
| :--- | :--- | :---: | :---: |
| Archivo Excel | Descripción | Rol en el Proyecto | Checkbox |
| :--- | :--- | :---: | :---: |
| `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` | **Libro Maestro Definitivo (739 filas)** con navegación asimétrica, desglose de actores multinivel (AFPA, ZDEEP), migas de pan dinámicas, dimensiones ATO y Control de Auditoría | Fuente Oficial de Producción | [x] |
| `Arbol_de_Navegacion_Portal_v5.xlsx` | Matriz de navegación por segmento (pestaña Comercio Exterior purgada a 202 filas netas estructuradas) | Insumo Base / Trabajo | [x] |
| `Detalle de Contenido para Grupos de Interes.xlsx` | Fichas detalladas y requisitos por grupo de interés | Insumo Base | [x] |
| `Ruta de procesos.xlsx` | Matriz de procesos guiados y etapas tributarias | Insumo Base | [x] |

---

## 📋 Lista de Control de Integridad y Sincronización

### Integridad de Datos y Taxonomía Institucional
- [x] Consolidación sin pérdida: 739 registros únicos verificados y 0 duplicados en `ID Trámite`.
- [x] Desglose asimétrico de actores: Soporte nativo para 2 niveles en ramas simples (ej. Contribuyentes) y hasta 4 niveles de actor en ramas profundas (AFPA $\rightarrow$ Depósitos $\rightarrow$ Almacenes Fiscales / AGD / DAT; Regímenes Especiales $\rightarrow$ ZDEEP $\rightarrow$ Administradoras / Usuarias).
- [x] Miga de Pan dinámicamente calculada (`Ruta de Navegación`) para el 100% de los trámites.
- [x] Erradicación de términos ajenos como *"oficial"* y sustitución por *Materia / Tema* y *Subtema / Tipo de Gestión*.
- [x] Asignación de dimensiones ATO (5 etapas de ciclo de vida + 5 tipos de interacción) para el 100% de los trámites.
- [x] Hoja de Resumen Arquitectura equipada con 27 fórmulas dinámicas nativas (`=COUNTA`, `=COUNTIF`, `=SUM`).
- [x] Sincronización exacta de la hoja `Brechas Normativas (24)` con sus preguntas para la mesa técnica SAT.
- [x] Validación de URLs y enlaces oficiales de destino SAT para el 100% de los trámites (0 enlaces de borrador).
- [x] Columna formal de `Control de Auditoría` (`APROBADO` vs. `PENDIENTE (Propuesta brecha)`).
- [x] Redacción en Lenguaje Ciudadano (Plain Language) con verbos imperativos directos para el 100% de los trámites de Comercio Exterior.

---

## 📂 Archivos en esta Carpeta

- `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`
- `Arbol_de_Navegacion_Portal_v5.xlsx`
- `Detalle de Contenido para Grupos de Interes.xlsx`
- `Ruta de procesos.xlsx`
