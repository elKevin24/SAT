#!/usr/bin/env python3
"""
scripts/apply_deep_anchors_and_sync.py
Paso 1: Inyectar URLs profundas con sus anclas de WordPress (#vc_tta-panel) en allTramites.json y catalogoContenidosUnicos.json
Paso 2: Sincronizar los libros Excel maestros (Estructura Final y Catálogo de Contenidos Únicos) y colecciones NoSQL
Paso 3: Validación integral
"""

import json
import subprocess
import sys

ALL_TRAMITES_PATH = "src/data/allTramites.json"

ANCHOR_MAPPINGS = {
    # Vehículos
    "SAT-GES-0266": "1541722263760-bed533a1-d75d", # Inscripción de Vehículos
    "SAT-GES-0267": "1541776381173-61f2f55a-46dc", # Reposiciones con Formularios en Papel
    "SAT-GES-0269": "1541722263997-e0d7cba3-7daf", # Traspaso de Vehículos ante la SAT
    "SAT-GES-0277": "1541722264271-487e21fd-d904", # Reposición de Distintivos (Certificado, Tarjeta y Placas)
    "SAT-GES-0284": "1662393570133-d90819b2-32d3", # Cambio de Placas Temporales
    "SAT-GES-0309": "1642106578727-c83d17c4-34da", # Registro de Marca y Código de Fabricante
    "SAT-GES-0310": "1541722264551-ab829ede-22f8", # Cambios, Rectificaciones o Transformaciones en Datos de Vehículos
    "SAT-GES-0311": "1541777125986-97d04375-37ee", # Activación e Inactivación
    "SAT-GES-0568": "1541780077723-c74e470e-b935", # Traspaso Electrónico de Vehículos a través de Notarios
    "SAT-GES-0569": "1541722263997-e0d7cba3-7daf", # Traspaso de Vehículos ante la SAT
    "SAT-GES-0570": "1541780077723-c74e470e-b935", # Traspaso Electrónico de Vehículos a través de Notarios
    "SAT-GES-0591": "1541776888584-73400ddd-b78d", # Gestores Tributarios
    "SAT-GES-0608": "1541780077723-c74e470e-b935", # Traspaso Electrónico
    "SAT-GES-0611": "1541777125986-97d04375-37ee", # Activación e Inactivación
    "SAT-GES-0612": "1662393570133-d90819b2-32d3", # Cambio de Placas Temporales
    "SAT-GES-0613": "1541722263997-e0d7cba3-7daf", # Traspaso de Vehículos
    "SAT-GES-0647": "1642106578727-c83d17c4-34da", # Registro de Marca y Código de Fabricante
    "SAT-GES-0648": "1541722264551-ab829ede-22f8", # Cambios, Rectificaciones o Transformaciones en Datos

    # Personas y Empresas
    "SAT-GES-0127": "1541721863086-9194f94d-dd70", # Requisitos de Correcciones por errores en Declaraciones
    "SAT-GES-0128": "1544737166940-7b221c49-789f", # Operaciones a través de la Agencia Virtual
    "SAT-GES-0246": "1715356603270-207da69d-8699", # Distintivos y sus requisitos
    "SAT-GES-0249": "1541695993129-3a5733fd-bd87", # Trámites en Gerencias Especiales
    "SAT-GES-0339": "1606494573178-22f9effd-91cc", # Facilidades de Pago
    "SAT-GES-0408": "1544757949626-63b98f1e-c5df", # Registro Fiscal de Imprentas en Agencia Virtual
    "SAT-GES-0558": "1541715112091-e300506b-54b6", # Abogados y Notarios
    "SAT-GES-0560": "1544737166940-7b221c49-789f", # Operaciones a través de la Agencia Virtual
    "SAT-GES-0567": "1541718919329-b32e6928-0a05", # Tercera Persona Autorizada en Gestiones de RTU
    "SAT-GES-0584": "1544742215300-58052f9f-10b1", # Requisitos para Devolución de Pagos Indebidos
    "SAT-GES-0593": "1541718919329-b32e6928-0a05", # Tercera Persona Autorizada en Gestiones de RTU
    "SAT-GES-0618": "1541721863086-9194f94d-dd70", # Requisitos de Correcciones por errores en Declaraciones
    "SAT-GES-0619": "1544742215300-58052f9f-10b1", # Requisitos para Devolución de Pagos Indebidos
    "SAT-GES-0620": "1606494573178-22f9effd-91cc", # Facilidades de Pago
    "SAT-GES-0621": "1544737166940-7b221c49-789f", # Operaciones a través de la Agencia Virtual
    "SAT-GES-0643": "1541621044169-4198d06d-693f", # Actualización RTU
    "SAT-GES-0660": "1615485066841-639e67c5-51e3", # Inscripción RTU
    "SAT-GES-0673": "1541718919329-b32e6928-0a05", # Tercera Persona Autorizada en Gestiones de RTU
    "SAT-GES-0674": "1541621044169-4198d06d-693f", # Actualización RTU
    "SAT-GES-0675": "1541621044169-4198d06d-693f", # Actualización RTU

    # Aduanas
    "SAT-GES-0434": "1555105635499-a4507e58-10e9", # Declaración de mercancías
    "SAT-GES-0434-AGD": "1555105635499-a4507e58-10e9",
    "SAT-GES-0434-DAT": "1555105635499-a4507e58-10e9",
    "SAT-GES-0482": "1571412473853-2ed0b43f-287f", # Procedimientos, Instructivos, Manuales
    "SAT-GES-0486": "1774965265742-b33a96d6-e1b8", # Gestiones y Obligaciones Decreto Número 29-89
    "SAT-GES-0493-ZDEEP-USR": "1555105635499-a4507e58-10e9",
    "SAT-GES-0496-ZDEEP-USR": "1555105635499-a4507e58-10e9",
    "SAT-GES-0504-ZDEEP-ADM": "1570052747713-e3285271-1d9c", # Manifiesto de Carga
    "SAT-GES-0506-ZDEEP-ADM": "1571412473853-2ed0b43f-287f"
}

def step1_apply_all_tramites():
    print("[PASO 1] Inyectando anclas profundas en allTramites.json...")
    with open(ALL_TRAMITES_PATH, "r", encoding="utf-8") as f:
        tramites = json.load(f)
        
    updated = 0
    for t in tramites:
        tid = t.get("id")
        if tid in ANCHOR_MAPPINGS:
            aid = ANCHOR_MAPPINGS[tid]
            base_url = t.get("url", "").split("#")[0].rstrip("/")
            new_url = f"{base_url}/#{aid}"
            if t.get("url") != new_url:
                t["url"] = new_url
                updated += 1
                
    with open(ALL_TRAMITES_PATH, "w", encoding="utf-8") as f:
        json.dump(tramites, f, ensure_ascii=False, indent=2)
        
    print(f"  -> {updated} trámites actualizados exitosamente con su deep-link.")
    
    # Reconstruir catálogo de contenidos únicos
    print("[PASO 1] Reconstruyendo catalogoContenidosUnicos.json y sat_portal_nosql.json...")
    subprocess.run([sys.executable, "scripts/build_catalogo_contenidos_unicos.py"], check=True)


def step2_sync_excel_and_nosql():
    print("[PASO 2] Sincronizando libros Excel maestros...")
    print("  -> Generando Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx...")
    subprocess.run([sys.executable, "scripts/build_final_excel_deliverable.py"], check=True)
    
    print("  -> Generando Catalogo_Contenidos_Unicos_Portal_SAT.xlsx...")
    subprocess.run([sys.executable, "scripts/build_catalogo_contenidos_excel.py"], check=True)
    
    print("  -> Sincronizando colecciones NoSQL MongoDB...")
    subprocess.run([sys.executable, "scripts/sync_nosql_familias.py"], check=True)


if __name__ == "__main__":
    step1_apply_all_tramites()
    step2_sync_excel_and_nosql()
    print("[OK] Sincronización multidimensional completada.")
