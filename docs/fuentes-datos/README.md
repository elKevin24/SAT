# Fuentes de Datos y Matrices Excel — Portal SAT

Este directorio centraliza las fuentes de datos del proyecto, organizadas bajo una arquitectura de gobernanza estricta que separa físicamente los **archivos de inicio (insumos históricos)** de los **archivos de producto (resultados y entregables vivos)**:

```
docs/fuentes-datos/
├── 01_archivos_inicio_historicos/     # INSUMOS DE PARTIDA (CONGELADOS / INALTERABLES)
│   ├── Detalle de Contenido para Grupos de Interes.xlsx   # Línea base institucional histórica
│   ├── Arbol_de_Navegacion_Portal_v5.xlsx                 # Matriz de trabajo inicial v5 previa a normalización
│   ├── Ruta de procesos.xlsx                              # Levantamiento inicial de procesos guiados
│   └── README.md                                          # Memoria técnica histórica
│
└── 02_archivos_producto_entregables/  # ENTREGABLES DEFINITIVOS (VIVOS / RESULTADOS DE PRODUCCIÓN)
    ├── Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx  # Libro Maestro Definitivo (715 filas, 25 cols)
    ├── Catalogo_Contenidos_Unicos_Portal_SAT.xlsx              # Catálogo Canónico Raíz (683 contenidos únicos)
    ├── Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx      # Taxonomía y Plain Language (27 fichas de rol)
    └── README.md                                          # Especificación de entregables
```

---

## 📊 Matriz Comparativa de Archivos

| Directorio | Archivo | Tipo de Gobernanza | Total Registros | Estado |
| :--- | :--- | :---: | :---: | :---: |
| `02_archivos_producto_entregables/` | **`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`** | **Entregable Oficial Vivo** | **715** | **Vigente (Producción)** |
| `02_archivos_producto_entregables/` | **`Catalogo_Contenidos_Unicos_Portal_SAT.xlsx`** | **Entregable Oficial Vivo** | **683** | **Vigente (Producción)** |
| `02_archivos_producto_entregables/` | **`Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`** | **Entregable Oficial Vivo** | **27 fichas** | **Vigente (Producción)** |
| `01_archivos_inicio_historicos/` | `Detalle de Contenido para Grupos de Interes.xlsx` | Insumo de Inicio / Histórico | N/A | Congelado |
| `01_archivos_inicio_historicos/` | `Arbol_de_Navegacion_Portal_v5.xlsx` | Insumo de Inicio / Histórico | N/A | Congelado |
| `01_archivos_inicio_historicos/` | `Ruta de procesos.xlsx` | Insumo de Inicio / Histórico | N/A | Congelado |

---

## 📋 Criterios de Integridad y Sincronización
* **0 Confusión entre Inicio y Producto:** Las fuentes iniciales jamás se confunden con los resultados del portal.
* **Sincronización Total con Producción:** Cualquier ajuste en `src/data/allTramites.json` se refleja en `02_archivos_producto_entregables/`.
