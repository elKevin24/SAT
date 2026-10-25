---
name: sat-ia-governance
description: Audita, corrige y gobierna la Arquitectura de Información del Portal SAT. Aplica las reglas de AGENTS.md (N1–N5 sin nombres inventados, guion largo "—" cuando no aplique, SAT-GES-#### inmutable, ciclo ATO, Miller 7±2, evitar clics pasarela, sin "trámite"/"trámites", sin modales/popovers para contenido). Úsalo al reestructurar el árbol, editar src/data/allTramites.json, src/data/categoryOrder.ts o matrices Excel.
---

# SAT IA Governance

## Objetivo
Garantizar que toda modificación de la Arquitectura de Información cumpla estrictamente con `AGENTS.md` y `docs/diseno-normativa/DESIGN_RULES.md`, manteniendo sincronía entre Excel vivo, `src/data/allTramites.json` y `src/data/categoryOrder.ts`.

## Cuándo activarlo
- Al reestructurar ramas del catálogo (N1-N5)
- Al editar `src/data/allTramites.json` o `src/data/categoryOrder.ts`
- Al generar/actualizar la matriz Excel canónica (25 columnas)
- Al auditar coherencia jerárquica, orden o códigos
- Al corregir usos indebidos de "trámite"/"trámites"

## Lectura obligatoria (SIEMPRE primero)
Antes de cualquier acción, lee y valida:
- `AGENTS.md` (sección 5: Reglas de Arquitectura de Información y Gobernanza de Datos)
- `docs/diseno-normativa/DESIGN_RULES.md` (secciones relevantes a IA/navegación)
- `src/data/allTramites.json`
- `src/data/categoryOrder.ts`
- Archivos Excel vivos en `docs/` o rutas indicadas por el usuario

## Principios inquebrantables
- **Niveles estrictamente numéricos**: Solo `Nivel 1`-`Nivel 5`. Prohibido asignar nombres como "Segmento", "Régimen", "Área", "Subárea", "Actor", "Tema", "Subtema", etc.
- **Guion largo `—`**: Si un nivel no aplica (N3/N4/N5), usar `—` obligatoriamente. Prohibido simetría forzada o duplicados.
- **Código inmutable**: Usar `SAT-GES-####` como ID canónico. IDs históricos van solo en `codigos_legacy`.
- **Orden por ciclo ATO**: Seguir `1. Empezar → 2. Operar → 3. Consultar → 4. Modificar/Cerrar → 5. Normativa`. Gobernado por `orden_n1..orden_n5`. **Prohibido** quemar números en títulos visibles.
- **Miller 7±2**: Óptimo 5-9. Tolerancia excepcional hasta 10 solo si <=5% del catálogo, alta homogeneidad, ATO ordenado, lenguaje ciudadano y acceso <=2-3 clics. **>=11 obliga modularización**.
- **Asimetría rama a rama**: La profundidad NO es uniforme. Compactar si <=3 hojas terminales (eliminar pasarelas). Preservar N4/N5 si >=10 gestiones con complejidad.
- **Minimizar clics, cero pasarela**: 2-3 clics máximo. Prohibidos clics pasarela con única opción.
- **Sincronía multidimensional**: Excel vivo ↔ `allTramites.json` ↔ `categoryOrder.ts`. Fuentes históricas inmutables en `docs/fuentes-datos/`.
- **Lenguaje**: Usar **"gestión"/"gestiones"**. **Prohibido "trámite"/"trámites"** en UI, textos visibles, contadores, badges.
- **Navegación**: **Página completa dedicada** con URL canónica. **Prohibido** modales/popovers/overlays para fichas, requisitos, pasos o navegación.

## Flujo de trabajo
1. **Descubrir**: Localizar datos afectados (JSON/TS/Excel). Entender alcance.
2. **Leer reglas**: Releer `AGENTS.md` + `DESIGN_RULES.md` para el caso concreto.
3. **Auditar**: Verificar niveles numéricos, uso de `—`, códigos `SAT-GES-####`, `orden_n1..orden_n5`, ciclo ATO, conteo por rama (Miller), clics pasarela, "trámite", modales.
4. **Planificar cambios**: Asegurar que no rompes contratos. Identificar dependencias en componentes.
5. **Aplicar cambios**: Editar con precisión. Actualizar **todos** los puntos que requieran sincronía.
6. **Validar**: Comprobar conteos, simetría intencional vs forzada, uso correcto de `—`, sin pasarelas, sin "trámite", sin modales para contenido.
7. **Verificar URLs**: Si hay enlaces, validar que no apunten a home genérico `/` o 404. Buscar ruta canónica en `site:portal.sat.gob.gt` si aplica.

## Checklist de validación
- [ ] Solo se usan `Nivel 1-5`, sin nombres inventados
- [ ] Niveles no clasificados usan `—` (no vacíos, no inventados)
- [ ] Todos los códigos son `SAT-GES-####` (históricos solo en `codigos_legacy`)
- [ ] Orden por `orden_n1..orden_n5` según ciclo ATO (sin números en títulos visibles)
- [ ] Ramas con >=11 opciones modularizadas / ramas con <=3 compactadas
- [ ] Máximo ~10 en casos excepcionales y justificados (<5% catálogo)
- [ ] Sin clics pasarela con única opción
- [ ] Sin "trámite"/"trámites" en textos visibles/UI
- [ ] Sin modales/popovers para gestión/requisitos/pasos/navegación
- [ ] `allTramites.json` ↔ `categoryOrder.ts` ↔ Excel vivo sincronizados
- [ ] Contratos TypeScript no rotos

## Archivos clave
- `AGENTS.md`
- `docs/diseno-normativa/DESIGN_RULES.md`
- `src/data/allTramites.json`
- `src/data/categoryOrder.ts`
- `scripts/` (para ETL/validación si aplica)
- `docs/fuentes-datos/` (solo lectura - inmutables)
- `.xlsx` vivos del proyecto

## Restricciones
- **NO** inventar nombres para niveles
- **NO** forzar simetría con texto duplicado
- **NO** quemar números en `nombreActual`, `gestion`, `tramite`, `nivelX`
- **NO** crear clics pasarela
- **NO** usar "trámite"/"trámites"
- **NO** usar modales/popovers para contenido de gestión
- **NO** alterar `docs/fuentes-datos/` (históricos inmutables)
- **NO** romper contratos sin actualizar componentes dependientes
