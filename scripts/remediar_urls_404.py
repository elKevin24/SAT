#!/usr/bin/env python3
"""
scripts/remediar_urls_404.py
Aplica la remediación y actualización de URLs rotas (404) hacia sus rutas canónicas activas
en allTramites.json, allProcesos.json y catalogoContenidosUnicos.json.
Cumple con la Regla 9 de Gobernanza SAT (Zero Enlaces Rotos y Zero Home Genérico).
"""

import json
import os
import sys

URL_MAPPING = {
    # 1. Contribuyentes Morosos
    "https://portal.sat.gob.gt/portal/listado-de-contribuyentes-morosos/":
        "https://portal.sat.gob.gt/portal/transparencia/listado-de-contribuyentes-morosos/",
        
    # 2. Solvencia Fiscal
    "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/solvencia-fiscal/":
        "https://portal.sat.gob.gt/portal/solvencia-fiscal/",
        
    # 3. Documentos Pequeño Contribuyente con Imposibilidad Material
    "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/autorizacion-de-documentos-tributarios-a-pequenos-contribuyentes/":
        "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/autorizacion-de-documentos-tributarios-a-pequenos-contribuyentes-con-imposibilidad-material/",
        
    # 4. Cambio de Régimen General a Pequeño Contribuyente
    "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/requisitos-de-actualizacion-de-cambio-de-regimen-general-a-pequeno-contribuyente-persona/":
        "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-cambio-de-regimen-general-del-impuesto-al-valor-agregado-a-pequeno-contribuyente/",
        
    # 5. Registro / Consulta Productores Agropecuarios
    "https://portal.sat.gob.gt/portal/consulta-productores/":
        "https://portal.sat.gob.gt/portal/requisitos-tramites-agencia-virtual/inscripcion-en-el-registro-de-productores-de-productos-agropecuarios-artesanales-y-reciclados/",
        
    # 6. Afiliación Régimen Especial Agropecuario (Dcto 31-2024)
    "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-afiliaciones-regimen-especial-de-contribuyente-agropecuario-o-regimen-electronico-especial-de-contribuyente-agropecuario/":
        "https://portal.sat.gob.gt/portal/libro-electronico-tributario/regimenes-especiales/",
        
    # 7. Herencias, Legados y Donaciones (Derogado por Dcto 6-2026 -> canalizado vía pagos indebidos)
    "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-impuesto-de-herencias-legados-y-donaciones/":
        "https://portal.sat.gob.gt/portal/devolucion-de-pagos-indebidos/",
    "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devoulucion-impuesto-de-herencias-legados-y-donaciones/":
        "https://portal.sat.gob.gt/portal/devolucion-de-pagos-indebidos/",
        
    # 8. Talleres efímeros de Google Sites a catálogo estable
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/libro-electr%C3%B3nico-tributario-para-peque%C3%B1o-contribuyente":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/r%C3%A9gimen-electr%C3%B3nico-del-peque%C3%B1o-contribuyente":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/llenado-del-formulario-sat-1411-declaraci%C3%B3n-anual-del-isr-r%C3%A9gimen-sobre-la":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/llenado-del-formulario-de-declaraci%C3%B3n-anual-del-isr-para-contribuyentes-qu":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/qu%C3%A9-libros-debo-llevar-y-qu%C3%A9-documentos-puedo-emitir":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/tutorial-conciliaci%C3%B3n-bancaria-cuadr%C3%A1tica":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/taller-de-concientizaci%C3%B3n-a-la-poblaci%C3%B3n-sobre-la-cultura-de-legalidad":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/impuesto-de-solidaridad":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/beneficios-de-la-formalizaci%C3%B3n-ante-la-sat-para-emprendedores":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/actualizaci%C3%B3n-de-exportadores-en-el-r%C3%A9gimen-especial-por-agencia-virtual":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/r%C3%A9gimen-electr%C3%B3nico-de-devoluci%C3%B3n-de-cr%C3%A9dito-fiscal":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
    "https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-principal/sistema-de-franquicias-electr%C3%B3nicas":
        "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat",
}

def remediar_all_tramites(path="src/data/allTramites.json"):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    modificados = 0
    for t in data:
        orig_url = t.get("url", "")
        if orig_url in URL_MAPPING:
            t["url"] = URL_MAPPING[orig_url]
            modificados += 1
            
        # Actualización de base legal para la gestión de herencias derogada
        if t.get("codigo") in ("SAT-GES-0230", "SAT-GES-0687"):
            t["descripcion"] = "Requisitos y procedimiento para solicitar devolución de pagos indebidos o en exceso derivados del derogado Impuesto de Herencias, Legados y Donaciones (Decreto 6-2026)."
            t["baseLegal"] = "Decreto 6-2026 del Congreso de la República (derogatoria del Decreto 431) y Código Tributario (Art. 153)."
            
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"[OK] allTramites.json: {modificados} registros actualizados.")

def remediar_all_procesos(path="src/data/allProcesos.json"):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    modificados = 0
    for item in data:
        for paso in item.get("pasos", []):
            orig_url = paso.get("url", "")
            if orig_url in URL_MAPPING:
                paso["url"] = URL_MAPPING[orig_url]
                modificados += 1
                
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"[OK] allProcesos.json: {modificados} pasos de procesos actualizados.")

def remediar_catalogo_unicos(path="src/data/catalogoContenidosUnicos.json"):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    modificados = 0
    for item in data:
        orig_url = item.get("url", "")
        if orig_url in URL_MAPPING:
            item["url"] = URL_MAPPING[orig_url]
            modificados += 1
            
        if item.get("codigo") in ("SAT-GES-0230", "SAT-GES-0687"):
            item["descripcion"] = "Requisitos y procedimiento para solicitar devolución de pagos indebidos o en exceso derivados del derogado Impuesto de Herencias, Legados y Donaciones (Decreto 6-2026)."
            item["baseLegal"] = "Decreto 6-2026 del Congreso de la República (derogatoria del Decreto 431) y Código Tributario (Art. 153)."
            
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"[OK] catalogoContenidosUnicos.json: {modificados} registros actualizados.")

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        
    remediar_all_tramites()
    remediar_all_procesos()
    remediar_catalogo_unicos()

if __name__ == "__main__":
    main()
