# Arquitectura de Información — Portal SAT

Este directorio reúne los documentos normativos, taxonómicos y operativos que estructuran el contenido, jerarquía y recorridos de los contribuyentes en el Portal SAT Guatemala.

---

## 📊 Estado de la Arquitectura de Información

| Documento | Alcance | Estado | Checkbox |
| :--- | :--- | :---: | :---: |
| [`ESTRUCTURA_FINAL_CONTENIDO.md`](./ESTRUCTURA_FINAL_CONTENIDO.md) | Catálogo unificado de 783 trámites (L1 a L6+) | Completo / Vigente | [x] |
| [`TAXONOMIA_Y_DIMENSIONES_PORTAL_SAT.md`](./TAXONOMIA_Y_DIMENSIONES_PORTAL_SAT.md) | Dimensiones ATO: 5 etapas del ciclo y 4 tipos de interacción | Completo / Vigente | [x] |
| [`TAXPAYER_JOURNEY.md`](./TAXPAYER_JOURNEY.md) | 8 arquetipos y recorridos de vida del contribuyente | Documentado | [x] |
| [`auditoria-contenido.md`](./auditoria-contenido.md) | Auditoría de coherencia y conteo de filas Excel vs JSON | Ejecutado | [x] |
| [`brechas-comercio-exterior.md`](./brechas-comercio-exterior.md) | 26 trámites operativos aduaneros con brecha de ficha | En validación | [ ] |

---

## 📋 Lista de Control de Entregables y Pendientes

### Jerarquía y Taxonomía (L1 a L6+)
- [x] Unificación del universo de **783 trámites oficiales** sin pérdidas.
- [x] Separación de capas conceptuales: **Arquitectura de Información (IA)** $\neq$ **Navegación** $\neq$ **Responsive Design**.
- [x] Modelo de extensibilidad para subtemas profundos (Nivel 6, 7 y 8).
- [x] Normalización de nombres de segmentos (Contribuyentes, Comercio Exterior, Vehículos, Profesionales).
- [ ] Validación formal por parte de intendencias de la nomenclatura de categorías Nivel 3 y Nivel 4.

### Dimensiones ATO (Australian Taxation Office benchmark)
- [x] Etapas del ciclo de vida del contribuyente: `inicio`, `operacion`, `declaracion_pago`, `fiscalizacion`, `cierre`.
- [x] Tipos de interacción: `consulta`, `solicitud`, `declaracion`, `pago`.
- [ ] Filtro combinado de dimensiones ATO integrado en la interfaz de usuario de móvil.

### Brechas Operativas de Comercio Exterior (26 Casos)
- [x] Identificación de las 26 brechas aduaneras (Almacenes Fiscales, DAT, ZDEEP, Courier, Apoderados).
- [x] Distintivo visual neutral `Propuesta normativa SAT` en la interfaz.
- [ ] Sesión de trabajo con la Intendencia de Aduanas para ratificar resoluciones y formularios requeridos.
- [ ] Incorporación de las fichas oficiales validadas al catálogo definitivo.

---

## 📂 Archivos en esta Carpeta

- [`ESTRUCTURA_FINAL_CONTENIDO.md`](./ESTRUCTURA_FINAL_CONTENIDO.md) — Definición exhaustiva de los 783 registros, macro-niveles y fuentes.
- [`TAXONOMIA_Y_DIMENSIONES_PORTAL_SAT.md`](./TAXONOMIA_Y_DIMENSIONES_PORTAL_SAT.md) — Guía de las dos dimensiones transversales de interacción ciudadana.
- [`TAXPAYER_JOURNEY.md`](./TAXPAYER_JOURNEY.md) — Arquetipos ciudadanos y flujos paso a paso.
- [`auditoria-contenido.md`](./auditoria-contenido.md) — Informe de consistencia cuantitativa de datos.
- [`brechas-comercio-exterior.md`](./brechas-comercio-exterior.md) — Fichas y preguntas para la Mesa Técnica de Aduanas.
