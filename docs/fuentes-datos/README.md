# Fuentes de Datos y Matrices Excel — Portal SAT

Este directorio centraliza las fuentes de datos del proyecto, organizadas bajo una arquitectura de gobernanza documental estricta que distingue entre **insumos históricos de referencia** y **entregables vivos de producción**.

---

## 🏛️ Gobernanza y Arquitectura de Archivos de Datos

```
docs/fuentes-datos/
├── [FUENTES HISTÓRICAS / INALTERABLES]
│   ├── Detalle de Contenido para Grupos de Interes.xlsx   # Línea base institucional histórica
│   ├── Arbol_de_Navegacion_Portal_v5.xlsx                 # Matriz de trabajo inicial v5
│   └── Ruta de procesos.xlsx                              # Levantamiento inicial de procesos guiados
│
└── [ENTREGABLES OFICIALES VIVOS / SINCRONIZADOS]
    ├── Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx  # Libro Maestro Definitivo (716 filas)
    └── Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx      # Taxonomía y Plain Language (716 filas)
```

### 1. Documentos Clásicos / Fuentes Históricas (No se modifican)
*Son la memoria técnica y el insumo de partida del proyecto. Se mantienen congelados para trazabilidad y auditoría forense:*
* **`Detalle de Contenido para Grupos de Interes.xlsx`**: Matriz original de grupos de interés y requerimientos primarios.
* **`Arbol_de_Navegacion_Portal_v5.xlsx`**: Estructura de árbol de navegación en su versión inicial previa a la normalización canónica.
* **`Ruta de procesos.xlsx`**: Relevamiento tabular de los procesos guiados tributarios originales.

### 2. Documentos Oficiales Vivos / Entregables Sincronizados (Se actualizan con el código y JSON)
*Reflejan el estado de verdad (Single Source of Truth) del portal en producción y se sincronizan biunívocamente con `src/data/allTramites.json`:*
* **`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`**:
  - **716 registros consolidados** (344 Contribuyentes, 246 Comercio Exterior, 79 Entes Exentos, 47 Profesionales).
  - **Matriz de 25 Columnas Oficiales (Opción A):** Incorpora columnas explícitas de `Orden N1` a `Orden N5` intercaladas con `Nivel 1` a `Nivel 5`.
  - **Identificador Canónico (Columna 2):** Gobernado por el estándar institucional inmutable **`SAT-GES-####`** (Gestiones Únicas), preservando los IDs de origen en trazabilidad forense (`codigos_legacy`).
  - Hoja `Resumen Arquitectura` con métricas y fórmulas directas.
  - Hoja `Matriz Maestra (716)` con la taxonomía multinivel, migas de pan y dimensiones ATO completas.
  - Hoja `Comercio Exterior (246)` con las 6 ramas oficiales y compactación N4/N5 saneada.
  - Hoja `Profesionales (47)` con las 5 categorías de actor profesional (Abogados, Peritos Contadores, Auditores, Gestores, Servicios Generales).
  - Hoja `Brechas Normativas (12)` con las 12 brechas operativas pendientes de mesa técnica.
* **`Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`**:
  - Hoja `Resumen Arquitectura` con métricas globales sincronizadas.
  - Hoja `Mapa de Navegación` con la jerarquía completa antes/después por pilar.
  - Hoja `Fichas por Rol y Categoría` con títulos y descripciones redactados en Lenguaje Ciudadano (Plain Language) bajo verbos imperativos directos.

---

## 📊 Matriz Comparativa de Archivos

| Archivo | Tipo de Gobernanza | Total Filas | Sincronizado con JSON | Estado |
| :--- | :---: | :---: | :---: | :---: |
| `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` | **Entregable Oficial Vivo** | **716** | **Sí (`src/data/allTramites.json`)** | **Vigente** |
| `Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx` | **Entregable Oficial Vivo** | **716** | **Sí (`src/data/allTramites.json`)** | **Vigente** |
| `Detalle de Contenido para Grupos de Interes.xlsx` | Fuente Histórica / Insumo Base | N/A | No (Inalterable por diseño) | Congelado |
| `Arbol_de_Navegacion_Portal_v5.xlsx` | Fuente Histórica / Insumo Base | N/A | No (Inalterable por diseño) | Congelado |
| `Ruta de procesos.xlsx` | Fuente Histórica / Insumo Base | N/A | No (Inalterable por diseño) | Congelado |

---

## 📋 Lista de Control de Calidad e Integridad de Datos
- [x] **0 Duplicados**: 716 registros únicos verificados en `ID Trámite` (2 duplicados de Profesionales fusionados formalmente).
- [x] **Sincronización Total**: `allTramites.json` $\leftrightarrow$ `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` $\leftrightarrow$ `Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`.
- [x] **Profesionales Saneados**: 47 trámites distribuidos en 5 categorías de actor, 0 subcategorías genéricas residuales y migas homogéneas de 4 niveles.
- [x] **Ramas Canónicas de Comercio Exterior**: 246 trámites clasificados con exactitud en las 6 ramas maestras.
- [x] **Calidad Textual**: Lenguaje Ciudadano libre de abreviaturas crípticas en títulos y descripciones con verbos de acción.
- [x] **12 Brechas Normativas**: Documentadas con su justificación técnica y pregunta clave para mesa de trabajo.
- [x] **100% URLs Válidas**: Direcciones web oficiales de destino SAT para todos los trámites.
