# Diccionario de Datos Oficial: Base de Datos Portal SAT

> **Superintendencia de Administración Tributaria (SAT Guatemala)**  
> **Versión del Esquema:** 1.0 (Relacional 3NF & NoSQL Documental)  
> **Motor Activo:** SQLite 3 (`database/sat_portal.db`)  
> **Script ANSI:** `database/sat_portal_dump.sql`  
> **Colección Documental:** `database/sat_portal_nosql.json`  

---

## 1. Tabla: `macro_grupos` (Nivel 1 de Arquitectura)

Almacena los 4 grandes segmentos nacionales de interacción con la SAT.

| Campo | Tipo | Nulo | Clave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | VARCHAR(50) | NO | PK | Identificador slug único (ej. `contribuyentes`, `comercio-exterior`). |
| `nombre` | VARCHAR(150) | NO | - | Nombre oficial del macro grupo. |
| `descripcion_ato` | TEXT | NO | - | Texto orientador de interfaz de una sola línea bajo estándar ATO. |

---

## 2. Tabla: `regimenes_nivel_2` (Nivel 2 de Arquitectura)

Almacena los regímenes tributarios y sectores aduaneros/profesionales de cada macro grupo.

| Campo | Tipo | Nulo | Clave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | VARCHAR(50) | NO | PK | Identificador slug único (ej. `pequenos-contribuyentes`). |
| `macro_grupo_id` | VARCHAR(50) | NO | FK | Referencia a `macro_grupos(id)`. |
| `nombre` | VARCHAR(150) | NO | - | Nombre oficial del régimen o sector. |
| `descripcion_ato` | TEXT | NO | - | Texto orientador de interfaz en lenguaje ciudadano. |

---

## 3. Tabla: `categorias_nivel_3` (Nivel 3 - Áreas Temáticas)

Catálogo controlado de áreas temáticas. Cumple la regla de **cero acrónimos huérfanos** (todos los nombres están completamente expandidos).

| Campo | Tipo | Nulo | Clave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | VARCHAR(100) | NO | PK | Identificador slug único. |
| `nombre_completo` | VARCHAR(250) | NO | - | Nombre descriptivo oficial con acrónimo entre paréntesis. |
| `descripcion` | TEXT | SÍ | - | Alcance temático del área. |

---

## 4. Tabla: `tramites` / `gestiones` (Entidad Central)

Contiene el inventario oficial de **gestiones únicas** del Portal SAT. Cada gestión (trámite, guía, consulta o descarga) existe exactamente una vez en esta tabla.

| Campo | Tipo | Nulo | Clave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | VARCHAR(100) | NO | PK | Slug semántico neutral o identificador canónico inmutable (ej. `solvencia-fiscal-solicitud`). |
| `codigo` | VARCHAR(20) | NO | UK | Código institucional inmutable (`SAT-GES-0001` a `SAT-GES-0683`). No cambia si el trámite cambia de categoría o nombre. |
| `titulo` | VARCHAR(350) | NO | - | Título oficial de la gestión en lenguaje ciudadano. |
| `categoria_id` | VARCHAR(100) | NO | FK | Referencia a `categorias_nivel_3(id)`. |
| `macro_grupo_id` | VARCHAR(50) | NO | FK | Referencia a `macro_grupos(id)`. |
| `etapa_ciclo_vida` | VARCHAR(100) | SÍ | - | Etapa del ciclo de vida del contribuyente (Inscripción, Operación, Cierre). |
| `canal_atencion` | VARCHAR(50) | SÍ | - | Canal de prestación: En Línea, Presencial o Mixto. |
| `descripcion` | TEXT | NO | - | Descripción funcional y operativa de la gestión. |
| `base_legal` | TEXT | NO | - | Fundamento jurídico oficial en el Código Tributario y leyes conexas. |
| `url_oficial` | VARCHAR(500) | SÍ | - | Enlace directo al servicio en portal SAT, Declaraguate o Agencia Virtual. |
| `codigos_legacy` | TEXT / JSON | SÍ | - | Array de IDs heredados de fuentes históricas (ej. `["comercio_exterior-17"]`). |

---

## 5. Tabla: `tramite_regimen` (Tabla Asociativa Muchos-a-Muchos)

Resuelve la polijerarquía (cross-listing) de trámites que aplican a múltiples regímenes sin duplicar filas ni texto.

| Campo | Tipo | Nulo | Clave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `tramite_id` | VARCHAR(100) | NO | PK, FK | Referencia a `tramites(id)`. |
| `regimen_id` | VARCHAR(50) | NO | PK, FK | Referencia a `regimenes_nivel_2(id)`. |

---

## 6. Vista: `vw_tramites_portal`

Vista desnormalizada que combina las 5 tablas relacionales para alimentar directamente reportes, consultas analíticas o APIs:

```sql
SELECT * FROM vw_tramites_portal WHERE regimen_id = 'pequenos-contribuyentes';
```
