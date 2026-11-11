#!/usr/bin/env python3
"""
scripts/add_nueva_url_column.py
Agrega la nueva columna/campo 'nueva_url' en allTramites.json, catalogoContenidosUnicos.json
y allProcesos.json eliminando la subcarpeta legacy '/portal/' y dejando la base 'https://portal.sat.gob.gt/'.
"""

import json
import os
import sys

def compute_nueva_url(url: str) -> str:
    if not url:
        return ""
    u = url.strip()
    if u.startswith("https://portal.sat.gob.gt/portal/"):
        return "https://portal.sat.gob.gt/" + u[len("https://portal.sat.gob.gt/portal/"):]
    elif u.startswith("http://portal.sat.gob.gt/portal/"):
        return "https://portal.sat.gob.gt/" + u[len("http://portal.sat.gob.gt/portal/"):]
    elif u.startswith("https://portal.sat.gob.gt/portal#"):
        return "https://portal.sat.gob.gt/#" + u[len("https://portal.sat.gob.gt/portal#"):]
    elif u.startswith("http://portal.sat.gob.gt/portal#"):
        return "https://portal.sat.gob.gt/#" + u[len("http://portal.sat.gob.gt/portal#"):]
    return u

def process_file(path: str, entity_name: str, key_to_update: str = "url"):
    if not os.path.exists(path):
        print(f"[!] No encontrado: {path}")
        return 0
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    count = 0
    if isinstance(data, list):
        for item in data:
            if key_to_update in item:
                item["nueva_url"] = compute_nueva_url(item.get(key_to_update, ""))
                count += 1
            # Para allProcesos que tiene pasos anidados
            if "pasos" in item and isinstance(item["pasos"], list):
                for paso in item["pasos"]:
                    if "url" in paso:
                        paso["nueva_url"] = compute_nueva_url(paso.get("url", ""))
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"[OK] {entity_name} ({path}): {count} registros actualizados con 'nueva_url'.")
    return count

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        
    print("[*] Incorporando nueva columna 'nueva_url' en datasets...")
    process_file("src/data/allTramites.json", "allTramites")
    process_file("src/data/catalogoContenidosUnicos.json", "catalogoContenidosUnicos")
    process_file("src/data/allProcesos.json", "allProcesos", key_to_update="nombre")

if __name__ == "__main__":
    main()
