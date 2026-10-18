# Base de Datos Documental NoSQL / MongoDB — Portal SAT Guatemala

Este directorio contiene las colecciones documentales NoSQL optimizadas para MongoDB, Elasticsearch y arquitecturas Headless CMS.

---

## 🍃 Arquitectura de Colecciones MongoDB

El modelo NoSQL implementa un **diseño desacoplado** donde las entidades de gestión son independientes de los nodos del árbol de navegación:

### 1. `gestiones.json` (Colección `gestiones` — 683 documentos)
Inventario canónico de entidades de trámite y servicio, sin acoplamiento a subcategorías ni jerarquías de menú:
* **`codigo`**: Código canónico inmutable universal **`SAT-GES-####`**.
* **`slug`**: Identificador semántico para URLs limpias.
* **`nombre` / `titulo`**: Título oficial en Lenguaje Ciudadano (Plain Language).
* **`descripcion`**: Resumen operativo de requisitos y alcance.
* **`url`**: Enlace institucional validado (`HTTP 200`).
* **`tipo_interaccion`**: Tipología de interacción ciudadana (`servicio_transaccional`, `consulta_datos`, `guia_informativa`, etc.).
* **`base_legal`**: Normativa aplicable.
* **`ubicaciones`**: Referencias a los IDs de nodos del árbol (`nodo_id` / `tramiteId`) donde se publica la gestión.

### 2. `arbol_navegacion.json` (Colección `arbol_navegacion` — 715 nodos)
Colección que define la taxonomía jerárquica y el orden de navegación:
* Nodos multinivel ($N_1 \to N_2 \to N_3 \to N_4 \to N_5$).
* Índices de orden canónico `orden_n1` a `orden_n5` y dimensiones ATO.

### 3. Colecciones Auxiliares de Catálogo
* **`cat_actores.json`**: Catálogo normalizado de actores y roles (abogados, contadores, importadores, etc.).
* **`cat_familias.json`**: Agrupaciones temáticas de servicios y áreas de especialidad.
* **`cat_procesos.json`**: Catálogo de los 31 Procesos Guiados transversales.
* **`sat_portal_nosql.json`**: Export consolidado de las 683 gestiones desacopladas con referencias de tramites.

---

## 🚀 Comandos de Importación en MongoDB

Para importar la base de datos completa en una instancia de MongoDB (`sat_portal`):

```bash
# 1. Colección maestra de gestiones canónicas (683)
mongoimport --db sat_portal --collection gestiones --file database/nosql_mongodb/gestiones.json --jsonArray

# 2. Colección de árbol de navegación (715)
mongoimport --db sat_portal --collection arbol_navegacion --file database/nosql_mongodb/arbol_navegacion.json --jsonArray

# 3. Catálogo de actores y roles
mongoimport --db sat_portal --collection cat_actores --file database/nosql_mongodb/cat_actores.json --jsonArray

# 4. Catálogo de familias temáticas
mongoimport --db sat_portal --collection cat_familias --file database/nosql_mongodb/cat_familias.json --jsonArray

# 5. Catálogo de procesos guiados
mongoimport --db sat_portal --collection cat_procesos --file database/nosql_mongodb/cat_procesos.json --jsonArray
```

---

## 🔍 Índices Recomendados en MongoDB

```javascript
// Índices para la colección gestiones
db.gestiones.createIndex({ "codigo": 1 }, { unique: true });
db.gestiones.createIndex({ "slug": 1 }, { unique: true });
db.gestiones.createIndex({ "tipo_interaccion": 1 });
db.gestiones.createIndex({ "etapa_ato": 1 });
db.gestiones.createIndex({ "nombre": "text", "descripcion": "text" });

// Índices para la colección arbol_navegacion
db.arbol_navegacion.createIndex({ "segmento": 1, "categoria": 1 });
db.arbol_navegacion.createIndex({ "gestion_id": 1 });
```
