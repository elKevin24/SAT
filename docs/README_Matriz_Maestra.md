# Matriz Maestra (714) y sus pestañas

La hoja **Matriz Maestra (714)** es la fuente única de verdad que contiene los **714 códigos de gestión (SAT‑GES‑####)** y sus **25 columnas oficiales**.

- Las pestañas **Contribuyentes (344)**, **Comercio Exterior (244)**, **Profesionales (47)** y **Entes Exentos (79)** son *subconjuntos filtrados* de la Matriz según el campo `pillarName`.
- Cada sub‑hoja mantiene **exactamente el mismo esquema de columnas** que la Matriz, por lo que los datos (códigos, URLs, familia temática, etc.) son idénticos al filtrarse por fila.
- Las pestañas **Brechas Normativas** y **Familias Temáticas** son metadatos auxiliares generados a partir de la Matriz.

> **Conclusión:** cualquier cambio debe realizarse primero en `src/data/allTramites.json`; luego, ejecutar `python scripts/build_final_excel_deliverable.py` para regenerar el entregable Excel y mantener la consistencia entre la Matriz y sus sub‑hojas.
