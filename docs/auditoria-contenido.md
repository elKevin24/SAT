# Auditoria de contenido — src/data/allTramites.json

Generado por `scripts/sanitize-contenido.mjs`. 

## Aplicado automaticamente

| Transformacion | Registros |
|---|---|
| `perfilDestinatario`: etiqueta de procedencia -> categoria oficial | 449 |
| `impactoOImportancia`: etiqueta de clasificacion -> nota interna | 396 |
| `descripcion`: acronimo expandido en primera mencion | 59 |

## Pendiente de redaccion humana

| Caso | Registros | Por que no es automatico |
|---|---|---|
| Descripcion que repite el titulo del tramite | 186 | Cada una requiere informacion propia del tramite; no se puede derivar del registro. |
| `impactoOImportancia` vacio tras el saneado | 401 | El beneficio ciudadano no es deducible de la clasificacion. |
| Nombre oficial de regimen dentro de frase | 7 | "Regimen Electronico de Pequeno Contribuyente" es nombre oficial: distinguirlo del uso generico exige criterio editorial. |
| `descripcion` con "Informacion sobre:" | 0 | Etiqueta de seccion, no descripcion. |
