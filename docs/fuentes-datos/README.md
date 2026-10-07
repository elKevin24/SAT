# Fuentes de Datos y Matrices Excel — Portal SAT

Este directorio contiene las hojas de cálculo y matrices maestras utilizadas para el inventario, análisis y extracción de los trámites y procesos de la SAT.

---

## 📊 Inventario de Libros Excel

| Archivo Excel | Descripción | Rol en el Proyecto | Checkbox |
| :--- | :--- | :---: | :---: |
| `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` | **Libro Maestro Definitivo (783 filas)** con árbol L1 a L6+ y dimensiones ATO | Fuente Oficial de Producción | [x] |
| `Estructura_Final_Contenido_Portal_SAT.xlsx` | Versión consolidada de entrega inicial (783 filas) | Registro Histórico / Auditoría | [x] |
| `Arbol_de_Navegacion_Portal_v5.xlsx` | Matriz previa de navegación y trámites por segmento | Insumo Base | [x] |
| `Detalle de Contenido para Grupos de Interes.xlsx` | Fichas detalladas y requisitos por grupo de interés | Insumo Base | [x] |
| `Ruta de procesos.xlsx` | Matriz de procesos guiados y etapas tributarias | Insumo Base | [x] |

---

## 📋 Lista de Control de Integridad y Sincronización

### Integridad de Datos
- [x] Consolidación sin pérdida: 783 registros únicos verificados.
- [x] Asignación de dimensiones ATO (5 etapas de ciclo de vida + 4 tipos de interacción) para el 100% de los trámites.
- [x] Mapeo de categorías y subcategorías normalizadas en formato padre/hijo.
- [ ] Validación de URLs y enlaces oficiales de destino SAT para los 783 trámites.
- [ ] Actualización automatizada mediante pipeline o script ante nuevas resoluciones tributarias.

---

## 📂 Archivos en esta Carpeta

- `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`
- `Estructura_Final_Contenido_Portal_SAT.xlsx`
- `Arbol_de_Navegacion_Portal_v5.xlsx`
- `Detalle de Contenido para Grupos de Interes.xlsx`
- `Ruta de procesos.xlsx`
