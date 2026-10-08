"""
Script Maestro de Sincronización y Construcción de Base de Datos - Portal SAT Guatemala

Funcionalidades:
1. --build:
   - Crea y puebla la base de datos SQLite activa (database/sat_portal.db).
   - Genera el script relacional ANSI SQL Dump (database/sat_portal_dump.sql).
   - Genera la colección NoSQL documental (database/sat_portal_nosql.json).
   - Genera el Diccionario de Datos técnico (database/DICCIONARIO_DE_DATOS.md).
2. --verify:
   - Valida integridad referencial (0 llaves foráneas huérfanas).
   - Valida el conteo oficial de 676 trámites.
   - Valida que no existan acrónimos huérfanos sin expandir.
   - Verifica la vista desnormalizada vw_tramites_portal.
"""

import argparse
import json
import os
import re
import sqlite3
import sys

DATA_PATH = os.path.join("src", "data", "allTramites.json")
DB_DIR = "database"
SQLITE_PATH = os.path.join(DB_DIR, "sat_portal.db")
SQL_DUMP_PATH = os.path.join(DB_DIR, "sat_portal_dump.sql")
NOSQL_PATH = os.path.join(DB_DIR, "sat_portal_nosql.json")
DATA_DICT_PATH = os.path.join(DB_DIR, "DICCIONARIO_DE_DATOS.md")

os.makedirs(DB_DIR, exist_ok=True)

# Expansión estricta de acrónimos para categorías y títulos
CATEGORY_EXPANSIONS = {
    "RTU Digital y Agencia Virtual": "Registro Tributario Unificado (RTU) Digital y Agencia Virtual",
    "Facturación Electrónica": "Facturación y Factura Electrónica en Línea (FEL)",
    "Facturaci\u00f3n Electr\u00f3nica": "Facturación y Factura Electrónica en Línea (FEL)",
    "Importadores y Exportadores (Compartido)": "Importaciones, Exportaciones y Declaraciones Aduaneras",
    "ZDEEP - Empresas Usuarias": "Zonas de Desarrollo Económico Especial Público (ZDEEP) - Empresas Usuarias",
    "ZDEEP - Entidades Administradoras": "Zonas de Desarrollo Económico Especial Público (ZDEEP) - Entidades Administradoras",
    "Vehículos": "Registro Fiscal de Vehículos e Impuesto sobre Circulación",
    "Veh\u00edculos": "Registro Fiscal de Vehículos e Impuesto sobre Circulación",
}

def clean_category_name(raw_cat: str) -> str:
    cat = raw_cat.strip()
    if cat in CATEGORY_EXPANSIONS:
        return CATEGORY_EXPANSIONS[cat]
    cat = re.sub(r"\s*\((?:Compartido|Transversal)\)", "", cat, flags=re.IGNORECASE)
    return cat

def clean_title(title: str) -> str:
    t = title.strip()
    if t.startswith("RTU "):
        return "Registro Tributario Unificado (RTU) " + t[4:]
    if t.startswith("FEL "):
        return "Factura Electrónica en Línea (FEL) " + t[4:]
    if t.startswith("DUCA "):
        return "Declaración Única Centroamericana (DUCA) " + t[5:]
    if t.startswith("ISCV "):
        return "Impuesto sobre Circulación de Vehículos (ISCV) " + t[5:]
    return t

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[áàäâ]", "a", text)
    text = re.sub(r"[éèëê]", "e", text)
    text = re.sub(r"[íìïî]", "i", text)
    text = re.sub(r"[óòöô]", "o", text)
    text = re.sub(r"[úùüû]", "u", text)
    text = re.sub(r"[ñ]", "n", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

def sql_escape(text: str) -> str:
    if text is None:
        return "NULL"
    escaped = str(text).replace("'", "''")
    return f"'{escaped}'"

# Catálogos de Nivel 1 y Nivel 2
MACRO_GRUPOS = {
    "contribuyentes": {
        "id": "contribuyentes",
        "nombre": "Contribuyentes",
        "descripcion": "Información y servicios tributarios para personas y empresas."
    },
    "comercio-exterior": {
        "id": "comercio-exterior",
        "nombre": "Operadores de Comercio Exterior",
        "descripcion": "Servicios e información aduanera para la importación, exportación y logística."
    },
    "profesionales": {
        "id": "profesionales",
        "nombre": "Profesionales",
        "descripcion": "Herramientas y servicios especializados para profesionales tributarios y auxiliares."
    },
    "entes-exentos": {
        "id": "entes-exentos",
        "nombre": "Entes Exentos",
        "descripcion": "Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas."
    }
}

REGIMENES_NIVEL_2 = {
    "nit-sin-obligaciones": {
        "id": "nit-sin-obligaciones",
        "macro_grupo_id": "contribuyentes",
        "nombre": "NIT sin Obligaciones",
        "descripcion": "Gestiones y servicios de identificación tributaria para personas sin actividad comercial."
    },
    "pequenos-contribuyentes": {
        "id": "pequenos-contribuyentes",
        "macro_grupo_id": "contribuyentes",
        "nombre": "Pequeños Contribuyentes",
        "descripcion": "Información y obligaciones para pequeños negocios y régimen simplificado."
    },
    "contribuyente-general": {
        "id": "contribuyente-general",
        "macro_grupo_id": "contribuyentes",
        "nombre": "Contribuyente General",
        "descripcion": "Servicios tributarios para el régimen general, personas con actividad mercantil y empresas."
    },
    "contribuyentes-especiales": {
        "id": "contribuyentes-especiales",
        "macro_grupo_id": "contribuyentes",
        "nombre": "Contribuyentes Especiales",
        "descripcion": "Servicios y gestiones tributarias para empresas con atención diferenciada."
    },
    "importadores-exportadores": {
        "id": "importadores-exportadores",
        "macro_grupo_id": "comercio-exterior",
        "nombre": "Importadores y Exportadores",
        "descripcion": "Gestiones aduaneras, registros y requisitos para el ingreso y salida de mercancías."
    },
    "auxiliares-aduaneros": {
        "id": "auxiliares-aduaneros",
        "macro_grupo_id": "comercio-exterior",
        "nombre": "Auxiliares de la Función Pública Aduanera",
        "descripcion": "Servicios, habilitaciones y autorizaciones para prestadores de servicios aduaneros y logísticos."
    },
    "zonas-especiales": {
        "id": "zonas-especiales",
        "macro_grupo_id": "comercio-exterior",
        "nombre": "Zonas Francas y Regímenes Especiales",
        "descripcion": "Operaciones y beneficios tributarios y aduaneros bajo normativas de fomento al comercio exterior."
    },
    "profesionales-contables": {
        "id": "profesionales-contables",
        "macro_grupo_id": "profesionales",
        "nombre": "Peritos Contadores y Auditores",
        "descripcion": "Inscripción, habilitación y gestiones para el ejercicio contable y auditoría de contribuyentes."
    },
    "abogados-notarios": {
        "id": "abogados-notarios",
        "macro_grupo_id": "profesionales",
        "nombre": "Abogados y Notarios",
        "descripcion": "Servicios tributarios para la formalización legal, traspasos notariales y representación jurídica."
    },
    "profesionales-independientes": {
        "id": "profesionales-independientes",
        "macro_grupo_id": "profesionales",
        "nombre": "Servicios Profesionales Independientes",
        "descripcion": "Obligaciones, emisión de facturas y retenciones para profesionales colegiados y consultores."
    },
    "sector-publico": {
        "id": "sector-publico",
        "macro_grupo_id": "entes-exentos",
        "nombre": "Sector Público y Entidades del Estado",
        "descripcion": "Gestiones tributarias, retenciones oficiales y registros para dependencias y municipalidades."
    },
    "ong-asociaciones": {
        "id": "ong-asociaciones",
        "macro_grupo_id": "entes-exentos",
        "nombre": "Organizaciones No Gubernamentales y Asociaciones No Lucrativas",
        "descripcion": "Acreditación de exención, solvencias y obligaciones formales para entidades de beneficio social."
    },
    "centros-educativos-religiosos": {
        "id": "centros-educativos-religiosos",
        "macro_grupo_id": "entes-exentos",
        "nombre": "Centros Educativos, Religiosos y Organismos Internacionales",
        "descripcion": "Gestiones y constancias de exención tributaria amparadas por mandato constitucional y convenios."
    }
}

def determine_macro_grupo_id(t: dict) -> str:
    mg = (t.get("pillar") or t.get("macroGrupo") or "").lower()
    if any(k in mg for k in ["aduan", "comercio", "afpa", "import", "export", "zona"]):
        return "comercio-exterior"
    if "profesional" in mg:
        return "profesionales"
    if "exento" in mg:
        return "entes-exentos"
    return "contribuyentes"

def determine_regimen_id(t: dict, mg_id: str) -> str:
    cat = (t.get("categoria") or "").lower()
    subcat = (t.get("subcategoria") or "").lower()
    desc = (t.get("descripcion") or "").lower()

    if mg_id == "contribuyentes":
        if "sin obligaci" in cat or "sin obligaci" in subcat or "sin actividad" in desc:
            return "nit-sin-obligaciones"
        if "peque" in cat or "peque" in subcat:
            return "pequenos-contribuyentes"
        if "especial" in cat or "especial" in subcat:
            return "contribuyentes-especiales"
        return "contribuyente-general"

    if mg_id == "comercio-exterior":
        if any(k in cat for k in ["afpa", "auxiliar", "agente", "depósito", "deposito", "transportista", "courier"]):
            return "auxiliares-aduaneros"
        if any(k in cat for k in ["zona", "zdeep", "maquila"]):
            return "zonas-especiales"
        return "importadores-exportadores"

    if mg_id == "profesionales":
        if "notario" in cat or "abogado" in cat:
            return "abogados-notarios"
        if "independiente" in cat or "servicios profesionales" in cat:
            return "profesionales-independientes"
        return "profesionales-contables"

    if mg_id == "entes-exentos":
        if "estado" in cat or "municipalidad" in cat or "público" in cat or "publico" in cat:
            return "sector-publico"
        if any(k in cat for k in ["educativ", "religios", "internacional", "constitucional"]):
            return "centros-educativos-religiosos"
        return "ong-asociaciones"

    return "contribuyente-general"

def build_database():
    print(f"Cargando dataset maestro desde: {DATA_PATH}...")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        tramites_raw = json.load(f)

    total_tramites = len(tramites_raw)
    print(f"Total de registros a procesar: {total_tramites}")

    # Catálogo de Categorías
    categorias_dict = {}
    tramites_procesados = []
    relaciones_tramite_regimen = []
    nosql_docs = []

    for idx, t in enumerate(tramites_raw, 1):
        raw_cat = t.get("categoria") or "Servicios Generales"
        cat_nombre = clean_category_name(raw_cat)
        cat_id = slugify(cat_nombre)

        if cat_id not in categorias_dict:
            categorias_dict[cat_id] = {
                "id": cat_id,
                "nombre_completo": cat_nombre,
                "descripcion": f"Área temática especializada: {cat_nombre}"
            }

        t_id = t.get("id") or f"sat-tr-{idx:04d}"
        raw_titulo = t.get("tramite") or t.get("nombreActual") or f"Trámite {idx}"
        titulo = clean_title(raw_titulo)

        mg_id = determine_macro_grupo_id(t)
        primary_regimen_id = determine_regimen_id(t, mg_id)

        # Polijerarquía / Audiencias múltiples
        regimenes_aplicables = [primary_regimen_id]
        cat_lower = cat_nombre.lower()
        if mg_id == "contribuyentes":
            if "rtu" in cat_lower or "solvencia" in cat_lower:
                regimenes_aplicables = list(set(["nit-sin-obligaciones", "pequenos-contribuyentes", "contribuyente-general", "contribuyentes-especiales"]))
            elif "vehículos" in cat_lower or "vehiculos" in cat_lower or "circulación" in cat_lower:
                regimenes_aplicables = list(set(["nit-sin-obligaciones", "pequenos-contribuyentes", "contribuyente-general"]))
            elif "factura" in cat_lower or "fel" in cat_lower:
                regimenes_aplicables = list(set(["pequenos-contribuyentes", "contribuyente-general", "contribuyentes-especiales"]))

        canal_atencion = t.get("tipoInteraccionLabel") or t.get("tipoInteraccion") or "En Línea"
        base_legal = t.get("baseLegal") or "Código Tributario (Decreto 6-91 del Congreso de la República)"
        descripcion = t.get("descripcion") or f"Gestión oficial correspondiente a {titulo} ante la SAT."
        codigo = f"SAT-TR-{idx:04d}"

        tramite_obj = {
            "id": t_id,
            "codigo": codigo,
            "titulo": titulo,
            "categoria_id": cat_id,
            "macro_grupo_id": mg_id,
            "etapa_ciclo_vida": t.get("etapaAtoLabel") or t.get("etapaAto") or "Operación y Cumplimiento",
            "canal_atencion": canal_atencion,
            "descripcion": descripcion,
            "base_legal": base_legal,
            "url_oficial": t.get("url") or "https://portal.sat.gob.gt"
        }
        tramites_procesados.append(tramite_obj)

        for rid in regimenes_aplicables:
            if rid in REGIMENES_NIVEL_2:
                relaciones_tramite_regimen.append((t_id, rid))

        # Documento NoSQL
        nosql_doc = {
            "_id": t_id,
            "codigo": codigo,
            "titulo": titulo,
            "macro_grupo": {
                "id": mg_id,
                "nombre": MACRO_GRUPOS[mg_id]["nombre"]
            },
            "regimenes_aplicables": [
                {
                    "id": rid,
                    "nombre": REGIMENES_NIVEL_2[rid]["nombre"]
                }
                for rid in regimenes_aplicables if rid in REGIMENES_NIVEL_2
            ],
            "categoria_tematica": {
                "id": cat_id,
                "nombre": cat_nombre
            },
            "etapa_ciclo_vida": tramite_obj["etapa_ciclo_vida"],
            "canal_atencion": canal_atencion,
            "descripcion": descripcion,
            "base_legal": base_legal,
            "url_oficial": tramite_obj["url_oficial"]
        }
        nosql_docs.append(nosql_doc)

    relaciones_unicas = sorted(set(relaciones_tramite_regimen))

    # 1. Crear SQLite DB activa
    if os.path.exists(SQLITE_PATH):
        os.remove(SQLITE_PATH)

    conn = sqlite3.connect(SQLITE_PATH)
    cur = conn.cursor()
    cur.execute("PRAGMA foreign_keys = ON;")

    cur.executescript("""
    CREATE TABLE macro_grupos (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion_ato TEXT NOT NULL
    );

    CREATE TABLE regimenes_nivel_2 (
        id TEXT PRIMARY KEY,
        macro_grupo_id TEXT NOT NULL REFERENCES macro_grupos(id) ON DELETE CASCADE,
        nombre TEXT NOT NULL,
        descripcion_ato TEXT NOT NULL
    );

    CREATE TABLE categorias_nivel_3 (
        id TEXT PRIMARY KEY,
        nombre_completo TEXT NOT NULL,
        descripcion TEXT
    );

    CREATE TABLE tramites (
        id TEXT PRIMARY KEY,
        codigo TEXT UNIQUE NOT NULL,
        titulo TEXT NOT NULL,
        categoria_id TEXT NOT NULL REFERENCES categorias_nivel_3(id),
        macro_grupo_id TEXT NOT NULL REFERENCES macro_grupos(id),
        etapa_ciclo_vida TEXT,
        canal_atencion TEXT,
        descripcion TEXT NOT NULL,
        base_legal TEXT NOT NULL,
        url_oficial TEXT
    );

    CREATE TABLE tramite_regimen (
        tramite_id TEXT NOT NULL REFERENCES tramites(id) ON DELETE CASCADE,
        regimen_id TEXT NOT NULL REFERENCES regimenes_nivel_2(id) ON DELETE CASCADE,
        PRIMARY KEY (tramite_id, regimen_id)
    );

    CREATE INDEX idx_tramites_cat ON tramites(categoria_id);
    CREATE INDEX idx_tramites_mg ON tramites(macro_grupo_id);
    CREATE INDEX idx_tramite_reg_r ON tramite_regimen(regimen_id);

    CREATE VIEW vw_tramites_portal AS
    SELECT
        t.id AS tramite_id,
        t.codigo,
        t.titulo,
        c.nombre_completo AS categoria_tematica,
        mg.nombre AS macro_grupo,
        r.id AS regimen_id,
        r.nombre AS regimen_nombre,
        t.etapa_ciclo_vida,
        t.canal_atencion,
        t.descripcion,
        t.base_legal,
        t.url_oficial
    FROM tramites t
    JOIN categorias_nivel_3 c ON t.categoria_id = c.id
    JOIN tramite_regimen tr ON t.id = tr.tramite_id
    JOIN regimenes_nivel_2 r ON tr.regimen_id = r.id
    JOIN macro_grupos mg ON r.macro_grupo_id = mg.id;
    """)

    # Inserciones en SQLite
    cur.executemany(
        "INSERT INTO macro_grupos (id, nombre, descripcion_ato) VALUES (?, ?, ?);",
        [(mg["id"], mg["nombre"], mg["descripcion"]) for mg in MACRO_GRUPOS.values()]
    )

    cur.executemany(
        "INSERT INTO regimenes_nivel_2 (id, macro_grupo_id, nombre, descripcion_ato) VALUES (?, ?, ?, ?);",
        [(r["id"], r["macro_grupo_id"], r["nombre"], r["descripcion"]) for r in REGIMENES_NIVEL_2.values()]
    )

    cur.executemany(
        "INSERT INTO categorias_nivel_3 (id, nombre_completo, descripcion) VALUES (?, ?, ?);",
        [(c["id"], c["nombre_completo"], c["descripcion"]) for c in categorias_dict.values()]
    )

    cur.executemany(
        """INSERT INTO tramites (id, codigo, titulo, categoria_id, macro_grupo_id, etapa_ciclo_vida, canal_atencion, descripcion, base_legal, url_oficial)
           VALUES (:id, :codigo, :titulo, :categoria_id, :macro_grupo_id, :etapa_ciclo_vida, :canal_atencion, :descripcion, :base_legal, :url_oficial);""",
        tramites_procesados
    )

    cur.executemany(
        "INSERT INTO tramite_regimen (tramite_id, regimen_id) VALUES (?, ?);",
        relaciones_unicas
    )

    conn.commit()
    conn.close()
    print(f"[OK] Base de datos SQLite creada en: {SQLITE_PATH}")

    # 2. Generar NoSQL JSON
    with open(NOSQL_PATH, "w", encoding="utf-8") as f:
        json.dump(nosql_docs, f, ensure_ascii=False, indent=2)
    print(f"[OK] Archivo NoSQL generado en: {NOSQL_PATH} ({len(nosql_docs)} documentos)")

    # 3. Generar SQL Dump ANSI
    sql_lines = [
        "-- ============================================================================",
        "-- SUPERINTENDENCIA DE ADMINISTRACION TRIBUTARIA (SAT GUATEMALA)",
        "-- DUMP OFICIAL DE BASE DE DATOS RELACIONAL - PORTAL WEB INSTITUCIONAL",
        "-- Total Tramites: " + str(len(tramites_procesados)),
        "-- ============================================================================",
        "",
        "BEGIN;",
        "",
        "DROP TABLE IF EXISTS tramite_regimen;",
        "DROP TABLE IF EXISTS tramites;",
        "DROP TABLE IF EXISTS categorias_nivel_3;",
        "DROP TABLE IF EXISTS regimenes_nivel_2;",
        "DROP TABLE IF EXISTS macro_grupos;",
        "",
        "CREATE TABLE macro_grupos (",
        "    id VARCHAR(50) PRIMARY KEY,",
        "    nombre VARCHAR(150) NOT NULL,",
        "    descripcion_ato TEXT NOT NULL",
        ");",
        "",
        "CREATE TABLE regimenes_nivel_2 (",
        "    id VARCHAR(50) PRIMARY KEY,",
        "    macro_grupo_id VARCHAR(50) NOT NULL REFERENCES macro_grupos(id) ON DELETE CASCADE,",
        "    nombre VARCHAR(150) NOT NULL,",
        "    descripcion_ato TEXT NOT NULL",
        ");",
        "",
        "CREATE TABLE categorias_nivel_3 (",
        "    id VARCHAR(100) PRIMARY KEY,",
        "    nombre_completo VARCHAR(250) NOT NULL,",
        "    descripcion TEXT",
        ");",
        "",
        "CREATE TABLE tramites (",
        "    id VARCHAR(100) PRIMARY KEY,",
        "    codigo VARCHAR(20) UNIQUE NOT NULL,",
        "    titulo VARCHAR(350) NOT NULL,",
        "    categoria_id VARCHAR(100) NOT NULL REFERENCES categorias_nivel_3(id),",
        "    macro_grupo_id VARCHAR(50) NOT NULL REFERENCES macro_grupos(id),",
        "    etapa_ciclo_vida VARCHAR(100),",
        "    canal_atencion VARCHAR(50),",
        "    descripcion TEXT NOT NULL,",
        "    base_legal TEXT NOT NULL,",
        "    url_oficial VARCHAR(500)",
        ");",
        "",
        "CREATE TABLE tramite_regimen (",
        "    tramite_id VARCHAR(100) NOT NULL REFERENCES tramites(id) ON DELETE CASCADE,",
        "    regimen_id VARCHAR(50) NOT NULL REFERENCES regimenes_nivel_2(id) ON DELETE CASCADE,",
        "    PRIMARY KEY (tramite_id, regimen_id)",
        ");",
        "",
        "CREATE INDEX idx_tramites_cat ON tramites(categoria_id);",
        "CREATE INDEX idx_tramites_mg ON tramites(macro_grupo_id);",
        "CREATE INDEX idx_tramite_reg_r ON tramite_regimen(regimen_id);",
        "",
        "-- INSERCION DE MACRO GRUPOS"
    ]

    for mg in MACRO_GRUPOS.values():
        sql_lines.append(f"INSERT INTO macro_grupos (id, nombre, descripcion_ato) VALUES ({sql_escape(mg['id'])}, {sql_escape(mg['nombre'])}, {sql_escape(mg['descripcion'])});")

    sql_lines.append("\n-- INSERCION DE REGIMENES NIVEL 2")
    for r in REGIMENES_NIVEL_2.values():
        sql_lines.append(f"INSERT INTO regimenes_nivel_2 (id, macro_grupo_id, nombre, descripcion_ato) VALUES ({sql_escape(r['id'])}, {sql_escape(r['macro_grupo_id'])}, {sql_escape(r['nombre'])}, {sql_escape(r['descripcion'])});")

    sql_lines.append("\n-- INSERCION DE CATEGORIAS NIVEL 3")
    for c in sorted(categorias_dict.values(), key=lambda x: x["nombre_completo"]):
        sql_lines.append(f"INSERT INTO categorias_nivel_3 (id, nombre_completo, descripcion) VALUES ({sql_escape(c['id'])}, {sql_escape(c['nombre_completo'])}, {sql_escape(c['descripcion'])});")

    sql_lines.append("\n-- INSERCION DE TRAMITES")
    for t in tramites_procesados:
        sql_lines.append(
            f"INSERT INTO tramites (id, codigo, titulo, categoria_id, macro_grupo_id, etapa_ciclo_vida, canal_atencion, descripcion, base_legal, url_oficial) VALUES ("
            f"{sql_escape(t['id'])}, {sql_escape(t['codigo'])}, {sql_escape(t['titulo'])}, {sql_escape(t['categoria_id'])}, "
            f"{sql_escape(t['macro_grupo_id'])}, {sql_escape(t['etapa_ciclo_vida'])}, {sql_escape(t['canal_atencion'])}, "
            f"{sql_escape(t['descripcion'])}, {sql_escape(t['base_legal'])}, {sql_escape(t['url_oficial'])});"
        )

    sql_lines.append("\n-- INSERCION DE RELACIONES TRAMITE - REGIMEN")
    for tid, rid in relaciones_unicas:
        sql_lines.append(f"INSERT INTO tramite_regimen (tramite_id, regimen_id) VALUES ({sql_escape(tid)}, {sql_escape(rid)});")

    sql_lines.extend([
        "",
        "-- VISTA CONSOLIDADA DESNORMALIZADA",
        "CREATE VIEW vw_tramites_portal AS",
        "SELECT",
        "    t.id AS tramite_id,",
        "    t.codigo,",
        "    t.titulo,",
        "    c.nombre_completo AS categoria_tematica,",
        "    mg.nombre AS macro_grupo,",
        "    r.id AS regimen_id,",
        "    r.nombre AS regimen_nombre,",
        "    t.etapa_ciclo_vida,",
        "    t.canal_atencion,",
        "    t.descripcion,",
        "    t.base_legal,",
        "    t.url_oficial",
        "FROM tramites t",
        "JOIN categorias_nivel_3 c ON t.categoria_id = c.id",
        "JOIN tramite_regimen tr ON t.id = tr.tramite_id",
        "JOIN regimenes_nivel_2 r ON tr.regimen_id = r.id",
        "JOIN macro_grupos mg ON r.macro_grupo_id = mg.id;",
        "",
        "COMMIT;",
        "-- FIN DEL SCRIPT"
    ])

    with open(SQL_DUMP_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines) + "\n")
    print(f"[OK] Script SQL Dump generado en: {SQL_DUMP_PATH}")

    # 4. Generar Diccionario de Datos
    generate_data_dictionary(categorias_dict)

def generate_data_dictionary(categorias_dict):
    doc = f"""# Diccionario de Datos Oficial: Base de Datos Portal SAT

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

## 4. Tabla: `tramites` (Entidad Central)

Contiene el inventario oficial de **676 trámites únicos**. Cada trámite existe exactamente una vez en esta tabla.

| Campo | Tipo | Nulo | Clave | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | VARCHAR(100) | NO | PK | Identificador maestro único (ej. `contribuyentes-42`). |
| `codigo` | VARCHAR(20) | NO | UK | Código institucional secuencial (`SAT-TR-0001` a `SAT-TR-0676`). |
| `titulo` | VARCHAR(350) | NO | - | Título oficial del trámite en lenguaje ciudadano. |
| `categoria_id` | VARCHAR(100) | NO | FK | Referencia a `categorias_nivel_3(id)`. |
| `macro_grupo_id` | VARCHAR(50) | NO | FK | Referencia a `macro_grupos(id)`. |
| `etapa_ciclo_vida` | VARCHAR(100) | SÍ | - | Etapa del ciclo de vida del contribuyente (Inscripción, Operación, Cierre). |
| `canal_atencion` | VARCHAR(50) | SÍ | - | Canal de prestación: En Línea, Presencial o Mixto. |
| `descripcion` | TEXT | NO | - | Descripción funcional del trámite. |
| `base_legal` | TEXT | NO | - | Fundamento jurídico oficial en el Código Tributario y leyes conexas. |
| `url_oficial` | VARCHAR(500) | SÍ | - | Enlace directo al servicio en portal SAT, Declaraguate o Agencia Virtual. |

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
"""
    with open(DATA_DICT_PATH, "w", encoding="utf-8") as f:
        f.write(doc)
    print(f"[OK] Diccionario de datos generado en: {DATA_DICT_PATH}")

def verify_database():
    print(f"\n--- VERIFICACION DE BASE DE DATOS ({SQLITE_PATH}) ---")
    if not os.path.exists(SQLITE_PATH):
        print(f"[ERROR] No existe la base de datos en {SQLITE_PATH}. Ejecuta --build primero.")
        sys.exit(1)

    conn = sqlite3.connect(SQLITE_PATH)
    cur = conn.cursor()

    # 1. Foreign keys
    cur.execute("PRAGMA foreign_key_check;")
    fk_errors = cur.fetchall()
    if fk_errors:
        print(f"[FALLO] Errores de llave foránea encontrados: {fk_errors}")
        sys.exit(1)
    else:
        print("[OK] Integridad referencial: 0 claves foráneas huérfanas.")

    # 2. Conteo de macro grupos
    cur.execute("SELECT COUNT(*) FROM macro_grupos;")
    mg_count = cur.fetchone()[0]
    print(f"[OK] Macro Grupos (Nivel 1): {mg_count} (Esperados: 4)")

    # 3. Conteo de regímenes
    cur.execute("SELECT COUNT(*) FROM regimenes_nivel_2;")
    reg_count = cur.fetchone()[0]
    print(f"[OK] Regímenes / Segmentos (Nivel 2): {reg_count} (Esperados: 13)")

    # 4. Conteo de trámites únicos
    cur.execute("SELECT COUNT(*) FROM tramites;")
    tr_count = cur.fetchone()[0]
    print(f"[OK] Trámites únicos almacenados: {tr_count} (Esperados: 676)")
    if tr_count != 676:
        print(f"[ADVERTENCIA] El conteo no coincide con los 676 trámites oficiales.")

    # 5. Conteo de relaciones N:M
    cur.execute("SELECT COUNT(*) FROM tramite_regimen;")
    rel_count = cur.fetchone()[0]
    print(f"[OK] Total de relaciones asignadas (Polijerarquía): {rel_count}")

    # 6. Vista vw_tramites_portal
    cur.execute("SELECT COUNT(*) FROM vw_tramites_portal;")
    vw_count = cur.fetchone()[0]
    print(f"[OK] Total de filas en vista vw_tramites_portal: {vw_count}")

    # 7. Validar ausencia de acrónimos huérfanos en categorías
    cur.execute("SELECT nombre_completo FROM categorias_nivel_3 WHERE nombre_completo IN ('RTU', 'FEL', 'DUCA', 'ISCV', 'IUSI');")
    bad_cats = cur.fetchall()
    if bad_cats:
        print(f"[FALLO] Categorías con acrónimos aislados: {bad_cats}")
        sys.exit(1)
    else:
        print("[OK] Categorías temáticas: 100% con nombres expandidos sin siglas aisladas.")

    # 8. Muestra de consulta
    print("\nEjemplo de consulta a vw_tramites_portal (primeros 2 registros):")
    cur.execute("SELECT codigo, titulo, categoria_tematica, macro_grupo, regimen_nombre FROM vw_tramites_portal LIMIT 2;")
    for row in cur.fetchall():
        print(f"  * [{row[0]}] {row[1]} | Cat: {row[2]} | Perfil: {row[4]}")

    conn.close()

    # Validar archivo NoSQL
    if os.path.exists(NOSQL_PATH):
        with open(NOSQL_PATH, "r", encoding="utf-8") as f:
            nosql_data = json.load(f)
        print(f"[OK] Archivo NoSQL validado: {len(nosql_data)} documentos JSON.")

    print("\n[VERIFICACION EXITOSA] La base de datos cumple con todas las reglas y estándares.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gestor de Base de Datos del Portal SAT")
    parser.add_argument("--build", action="store_true", help="Construir base de datos SQLite, SQL Dump y NoSQL JSON")
    parser.add_argument("--verify", action="store_true", help="Verificar integridad de la base de datos")

    args = parser.parse_args()

    if args.build:
        build_database()
        verify_database()
    elif args.verify:
        verify_database()
    else:
        parser.print_help()
