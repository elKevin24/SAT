# Arquitectura de Información — Portal SAT

Este directorio reúne los documentos normativos, taxonómicos y operativos que estructuran el contenido, jerarquía y recorridos de los contribuyentes y operadores en el Portal SAT Guatemala.

---

## 📊 Estado de la Arquitectura de Información

| Documento | Alcance | Estado | Checkbox |
| :--- | :--- | :---: | :---: |
| [`ARQUITECTURA_INFORMACION_CENTRADA_EN_USUARIO.md`](./ARQUITECTURA_INFORMACION_CENTRADA_EN_USUARIO.md) | **Marco Maestro de IA-UX (8 capas)**: Modelo mental, tareas, procesos, contenido, relaciones y gobernanza | Completo / Vigente | [x] |
| [`ESTRUCTURA_FINAL_CONTENIDO.md`](./ESTRUCTURA_FINAL_CONTENIDO.md) | Catálogo unificado de 718 trámites y taxonomía multinivel | Completo / Vigente | [x] |
| [`TAXONOMIA_Y_DIMENSIONES_PORTAL_SAT.md`](./TAXONOMIA_Y_DIMENSIONES_PORTAL_SAT.md) | Dimensiones ATO: 5 etapas del ciclo y 4 tipos de interacción | Completo / Vigente | [x] |
| [`MAPA_DE_NAVEGACION_COMERCIO_EXTERIOR.md`](./MAPA_DE_NAVEGACION_COMERCIO_EXTERIOR.md) | Comparativo antes/después y consolidación de las 6 ramas aduaneras | Completo / Vigente | [x] |
| [`brechas-comercio-exterior.md`](./brechas-comercio-exterior.md) | 12 trámites operativos aduaneros con brecha y preguntas técnicas | Documentado | [x] |
| [`TAXPAYER_JOURNEY.md`](./TAXPAYER_JOURNEY.md) | Arquetipos y recorridos de vida del contribuyente | Documentado | [x] |
| [`auditoria-contenido.md`](./auditoria-contenido.md) | Auditoría de consistencia de campos descriptivos | Documentado | [x] |

---

## 📋 Lista de Control de Entregables y Sincronización

### Jerarquía y Taxonomía (718 Trámites Consolidados)
- [x] Unificación del universo de **718 trámites oficiales** sin pérdida (344 Contribuyentes, 246 Comercio Exterior, 79 Entes Exentos, 49 Profesionales).
- [x] Consolidación canónica de Comercio Exterior en **6 ramas maestras** (Importadores, Exportadores, OEA, AFPA, Regímenes Territoriales, Normativa General).
- [x] Eliminación de niveles redundantes N4/N5 ("ZDEEP > ZDEEP", "DAT > DAT") y compactación asimétrica.
- [x] Separación de capas conceptuales: **Arquitectura de Información (IA)** $\neq$ **Navegación** $\neq$ **Responsive Design**.
- [x] Contrato de orden formal en [`src/data/categoryOrder.ts`](../../src/data/categoryOrder.ts) validado por suite automatizada de Playwright (18/18 pruebas superadas).

### Dimensiones ATO (Australian Taxation Office benchmark)
- [x] 5 etapas del ciclo de vida: `empezar`, `operar`, `consultar`, `modificar_cerrar`, `normativa`.
- [x] 4 tipos de interacción: `servicio_transaccional`, `consulta_datos`, `guia_informativa`, `descarga_recurso`.
- [x] Erradicación de números de orden forzados en textos visibles para el ciudadano.

### Brechas Operativas de Comercio Exterior (12 Casos)
- [x] 12 brechas identificadas y etiquetadas como `[Propuesta brecha]`.
- [x] Hoja dedicada en [`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](../fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx).
- [x] Distintivo visual neutral `Propuesta normativa SAT` en tarjetas de interfaz.

---

## 📂 Archivos en esta Carpeta

- [`ARQUITECTURA_INFORMACION_CENTRADA_EN_USUARIO.md`](./ARQUITECTURA_INFORMACION_CENTRADA_EN_USUARIO.md) — Marco maestro de IA: 8 capas, modelo mental, arquitectura de procesos y grafo de contenidos.
- [`ESTRUCTURA_FINAL_CONTENIDO.md`](./ESTRUCTURA_FINAL_CONTENIDO.md) — Definición exhaustiva de los 718 registros, macro-niveles y gobernanza de entregables.
- [`TAXONOMIA_Y_DIMENSIONES_PORTAL_SAT.md`](./TAXONOMIA_Y_DIMENSIONES_PORTAL_SAT.md) — Cuatro dimensiones transversales de interacción (Actor, ATO, Tipología, Plataforma).
- [`MAPA_DE_NAVEGACION_COMERCIO_EXTERIOR.md`](./MAPA_DE_NAVEGACION_COMERCIO_EXTERIOR.md) — Mapa comparativo estructurado antes vs. después de las 6 ramas de comercio exterior.
- [`brechas-comercio-exterior.md`](./brechas-comercio-exterior.md) — Matriz de las 12 brechas normativas con sus preguntas para la Mesa Técnica de Aduanas.
- [`TAXPAYER_JOURNEY.md`](./TAXPAYER_JOURNEY.md) — Arquetipos ciudadanos y flujos paso a paso.
- [`auditoria-contenido.md`](./auditoria-contenido.md) — Informe de saneamiento de campos descriptivos.
