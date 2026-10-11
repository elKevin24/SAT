# Bases de Datos del Portal SAT Guatemala — Arquitectura Dual (SQL y NoSQL MongoDB)

Este directorio centraliza las bases de datos maestras del Portal SAT, organizadas bajo dos paradigmas de almacenamiento estrictamente separados:

```
database/
├── sql/                   # Motor Relacional SQL (PostgreSQL / MySQL / MariaDB / SQLite)
│   ├── sat_portal_dump.sql # Dump SQL normalizado en 3NF con claves foráneas y vistas
│   ├── sat_portal.db       # Base de datos SQLite compilada para uso local
│   └── README.md           # Guía de esquemas, DDL y comandos de importación
│
├── nosql_mongodb/         # Motor Documental NoSQL (Colecciones MongoDB / JSON)
│   ├── gestiones.json      # Colección maestra 'gestiones' (683 entidades desacopladas)
│   ├── arbol_navegacion.json # Colección 'arbol_navegacion' (716 nodos de árbol)
│   ├── cat_actores.json    # Catálogo de actores y roles
│   ├── cat_familias.json   # Catálogo de familias temáticas
│   ├── cat_procesos.json   # Catálogo de 31 procesos guiados
│   ├── sat_portal_nosql.json # Export consolidado de gestiones para APIs
│   └── README.md           # Guía de importación con mongoimport e índices
│
└── DICCIONARIO_DE_DATOS.md # Especificación técnica y catálogo de campos
```

---

## 🏛️ 1. Motor Relacional SQL (`database/sql/`)
* **Propósito:** Integridad referencial estricta, consultas transaccionales, auditoría interna, reportes tabulares y sistemas corporativos RDBMS (PostgreSQL, MySQL).
* **Entidades:** Desacoplamiento formal entre tablas maestras (`macro_grupos`, `regimenes_nivel_2`, `categorias_nivel_3`, `tramites`) y la tabla de resolución N:M (`tramite_regimen`).

---

## 🍃 2. Motor Documental NoSQL (`database/nosql_mongodb/`)
* **Propósito:** Alta velocidad de lectura, flexibilidad de esquema, Headless CMS, APIs REST/GraphQL, motores de búsqueda full-text e interfaces de usuario reactivas.
* **Entidades:** Documentos JSON con identificador canónico inmutable **`SAT-GES-####`**, desacoplados de la taxonomía del árbol de navegación.
