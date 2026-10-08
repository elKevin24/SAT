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
    ├── Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx  # Libro Maestro Definitivo (718 filas)
    └── Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx      # Taxonomía y Plain Language (718 filas)
```

### 1. Documentos Clásicos / Fuentes Históricas (No se modifican)
*Son la memoria técnica y el insumo de partida del proyecto. Se mantienen congelados para trazabilidad y auditoría forense:*
* **`Detalle de Contenido para Grupos de Interes.xlsx`**: Matriz original de grupos de interés y requerimientos primarios.
* **`Arbol_de_Navegacion_Portal_v5.xlsx`**: Estructura de árbol de navegación en su versión inicial previa a la normalización canónica.
* **`Ruta de procesos.xlsx`**: Relevamiento tabular de los procesos guiados tributarios originales.

### 2. Documentos Oficiales Vivos / Entregables Sincronizados (Se actualizan con el código y JSON)
*Reflejan el estado de verdad (Single Source of Truth) del portal en producción y se sincronizan biunívocamente con `src/data/allTramites.json`:*
* **`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`**:
  - **718 registros consolidados** (344 Contribuyentes, 246 Comercio Exterior, 79 Entes Exentos, 49 Profesionales).
  - Hoja `Resumen Arquitectura` con métricas y fórmulas directas.
  - Hoja `Matriz Maestra (718)` con la taxonomía multinivel, migas de pan y dimensiones ATO completas.
  - Hoja `Comercio Exterior (246)` con las 6 ramas oficiales y compactación N4/N5 saneada.
  - Hoja `Brechas Normativas (12)` con las 12 brechas operativas pendientes de mesa técnica.
* **`Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`**:
  - Hoja `Resumen Arquitectura` con métricas globales.
  - Hoja `Mapa de Navegación` con la jerarquía completa antes/después por pilar.
  - Hoja `Fichas por Rol y Categoría` con títulos y descripciones redactados en Lenguaje Ciudadano (Plain Language) bajo verbos imperativos directos.

---

## 📊 Matriz Comparativa de Archivos

| Archivo | Tipo de Gobernanza | Total Filas | Sincronizado con JSON | Estado |
| :--- | :---: | :---: | :---: | :---: |
| `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` | **Entregable Oficial Vivo** | **718** | **Sí (`src/data/allTramites.json`)** | **Vigente** |
| `Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx` | **Entregable Oficial Vivo** | **718** | **Sí (`src/data/allTramites.json`)** | **Vigente** |
| `Detalle de Contenido para Grupos de Interes.xlsx` | Fuente Histórica / Insumo Base | N/A | No (Inalterable por diseño) | Congelado |
| `Arbol_de_Navegacion_Portal_v5.xlsx` | Fuente Histórica / Insumo Base | N/A | No (Inalterable por diseño) | Congelado |
| `Ruta de procesos.xlsx` | Fuente Histórica / Insumo Base | N/A | No (Inalterable por diseño) | Congelado |

---

## 📋 Lista de Control de Calidad e Integridad de Datos
- [x] **0 Duplicados**: 718 registros únicos verificados en `ID Trámite`.
- [x] **Sincronización Total**: `allTramites.json` $\leftrightarrow$ `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` $\leftrightarrow$ `Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`.
- [x] **Ramas Canónicas de Comercio Exterior**: 246 trámites clasificados con exactitud en las 6 ramas maestras (Importadores, Exportadores, OEA, AFPA, Regímenes Territoriales, Normativa General).
- [x] **Calidad Textual**: Lenguaje Ciudadano libre de abreviaturas crípticas en títulos y descripciones con verbos de acción.
- [x] **12 Brechas Normativas**: Documentadas con su justificación técnica y pregunta clave para mesa de trabajo.
- [x] **100% URLs Válidas**: Direcciones web oficiales de destino SAT para todos los trámites.
