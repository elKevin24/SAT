#!/usr/bin/env python3
"""
scripts/sync_nosql_nueva_url.py
Sincroniza el campo 'nueva_url' y las URLs remediadas en las colecciones NoSQL MongoDB:
- database/nosql_mongodb/gestiones.json (683 docs)
- database/nosql_mongodb/sat_portal_nosql.json (683 docs)
a partir de src/data/catalogoContenidosUnicos.json.
"""

import json
import os
import sys

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        
    cat_path = "src/data/catalogoContenidosUnicos.json"
    if not os.path.exists(cat_path):
        print(f"[!] Error: no existe {cat_path}")
        return
        
    with open(cat_path, "r", encoding="utf-8") as f:
        catalogo = json.load(f)
        
    cat_by_codigo = {item.get("codigo"): item for item in catalogo if item.get("codigo")}
    
    # 1. database/nosql_mongodb/gestiones.json
    gestiones_path = "database/nosql_mongodb/gestiones.json"
    if os.path.exists(gestiones_path):
        with open(gestiones_path, "r", encoding="utf-8") as f:
            gestiones = json.load(f)
        updated_g = 0
        for g in gestiones:
            cid = g.get("codigo")
            if cid in cat_by_codigo:
                c_item = cat_by_codigo[cid]
                g["url"] = c_item.get("url", g.get("url", ""))
                g["nueva_url"] = c_item.get("nueva_url", "")
                if cid in ("SAT-GES-0230", "SAT-GES-0687"):
                    g["descripcion"] = c_item.get("descripcion", g.get("descripcion", ""))
                    g["base_legal"] = c_item.get("baseLegal", g.get("base_legal", ""))
                updated_g += 1
        with open(gestiones_path, "w", encoding="utf-8") as f:
            json.dump(gestiones, f, ensure_ascii=False, indent=2)
        print(f"[OK] gestiones.json: {updated_g} documentos sincronizados con 'nueva_url'.")

    # 2. database/nosql_mongodb/sat_portal_nosql.json
    nosql_path = "database/nosql_mongodb/sat_portal_nosql.json"
    if os.path.exists(nosql_path):
        with open(nosql_path, "r", encoding="utf-8") as f:
            nosql_docs = json.load(f)
        updated_n = 0
        for d in nosql_docs:
            cid = d.get("codigo")
            if cid in cat_by_codigo:
                c_item = cat_by_codigo[cid]
                d["url"] = c_item.get("url", d.get("url", ""))
                d["nueva_url"] = c_item.get("nueva_url", "")
                if cid in ("SAT-GES-0230", "SAT-GES-0687"):
                    d["descripcion"] = c_item.get("descripcion", d.get("descripcion", ""))
                    d["baseLegal"] = c_item.get("baseLegal", d.get("baseLegal", ""))
                updated_n += 1
        with open(nosql_path, "w", encoding="utf-8") as f:
            json.dump(nosql_docs, f, ensure_ascii=False, indent=2)
        print(f"[OK] sat_portal_nosql.json: {updated_n} documentos sincronizados con 'nueva_url'.")

if __name__ == "__main__":
    main()
