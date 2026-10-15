#!/usr/bin/env python3
"""
scripts/validate_urls.py
Auditoría y validación activa de URLs de trámites y contenidos del Portal SAT.
Cumple con la directriz de Zero Enlaces Rotos y clasificación de impacto.
"""

import argparse
import json
import os
import re
import sys
import urllib.parse
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

DEFAULT_DATASET = "src/data/allTramites.json"
DEFAULT_OUTPUT = "reports/url_report.tsv"
SAT_DOMAINS = ("sat.gob.gt", "portal.sat.gob.gt", "agenciavirtual.sat.gob.gt", "farm2.sat.gob.gt")


def classify_url(url: str) -> dict:
    """Clasifica la URL determinando dominio, fragmentos y pertenencia institucional."""
    parsed = urllib.parse.urlparse(url)
    netloc = parsed.netloc.lower()
    
    is_sat = any(netloc == d or netloc.endswith("." + d) for d in SAT_DOMAINS)
    has_fragment = bool(parsed.fragment)
    
    flags = []
    if not is_sat:
        flags.append("EXTERNAL")
    else:
        flags.append("SAT_PORTAL")
        
    if has_fragment:
        flags.append("HAS_FRAGMENT")
        
    return {
        "domain": netloc,
        "is_sat": is_sat,
        "has_fragment": has_fragment,
        "flags": "|".join(flags),
        "clean_url": urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, parsed.query, ""))
    }


def check_url(url: str, session: requests.Session, timeout: int = 8) -> dict:
    """Verifica el estado HTTP de una URL realizando HEAD con fallback a GET."""
    # Los fragmentos (#) no viajan por HTTP; se evalúa la URL base para el status del servidor
    parsed = urllib.parse.urlparse(url)
    clean_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, parsed.query, ""))
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SAT-Audit/2.0"
    }
    
    try:
        resp = session.head(clean_url, headers=headers, allow_redirects=True, timeout=timeout)
        # Algunos servidores rechazan HEAD con 405 Method Not Allowed o 403; reintentar con GET
        if resp.status_code in (403, 405):
            resp = session.get(clean_url, headers=headers, stream=True, allow_redirects=True, timeout=timeout)
            
        return {
            "status": resp.status_code,
            "final_url": resp.url,
            "error": None
        }
    except requests.exceptions.Timeout:
        return {"status": "TIMEOUT", "final_url": clean_url, "error": "Request timed out"}
    except requests.exceptions.SSLError as e:
        return {"status": "SSL_ERROR", "final_url": clean_url, "error": str(e)}
    except requests.exceptions.ConnectionError:
        return {"status": "CONN_ERROR", "final_url": clean_url, "error": "Connection refused or DNS failure"}
    except Exception as e:
        return {"status": "ERROR", "final_url": clean_url, "error": str(e)}


def load_dataset_urls(json_path: str):
    """Carga los trámites y agrupa URLs deduplicadas calculando el impacto de cada una."""
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"No se encontró el dataset en: {json_path}")
        
    with open(json_path, "r", encoding="utf-8") as f:
        tramites = json.load(f)
        
    url_to_tramites = defaultdict(list)
    for t in tramites:
        url = t.get("url")
        t_id = t.get("id_tramite") or t.get("id") or "UNKNOWN"
        t_nombre = t.get("nombre") or t.get("titulo") or ""
        if url and url.strip():
            url_to_tramites[url.strip()].append((t_id, t_nombre))
            
    return url_to_tramites, len(tramites)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        
    parser = argparse.ArgumentParser(description="Auditoría de URLs del Portal SAT")
    parser.add_argument("--dataset", default=DEFAULT_DATASET, help="Ruta al JSON de trámites")
    parser.add_argument("--output", default=DEFAULT_OUTPUT, help="Ruta del reporte TSV de salida")
    parser.add_argument("--workers", type=int, default=10, help="Hilos concurrentes para validación")
    parser.add_argument("--timeout", type=int, default=8, help="Timeout por petición en segundos")
    parser.add_argument("--dry-run", action="store_true", help="Analizar estructura y duplicados sin peticiones HTTP")
    args = parser.parse_args()
    
    print(f"[*] Cargando dataset desde: {args.dataset}")
    url_to_tramites, total_tramites = load_dataset_urls(args.dataset)
    unique_urls = list(url_to_tramites.keys())
    
    print(f"[*] Total trámites en dataset: {total_tramites}")
    print(f"[*] Total URLs únicas a validar: {len(unique_urls)}")
    
    # Análisis de duplicación / impacto
    multi_tramite_urls = {u: ts for u, ts in url_to_tramites.items() if len(ts) > 1}
    print(f"[*] URLs compartidas por múltiples trámites (polijerarquía / paraguas): {len(multi_tramite_urls)}")
    
    # Creación de directorio de salida
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    
    results = []
    session = requests.Session()
    
    if args.dry_run:
        print("[*] Modo DRY-RUN activado (sin peticiones HTTP). Clasificando URLs...")
        for url in unique_urls:
            meta = classify_url(url)
            tramites_list = url_to_tramites[url]
            results.append({
                "url": url,
                "domain": meta["domain"],
                "flags": meta["flags"],
                "impacto_tramites": len(tramites_list),
                "tramite_ids": ";".join(t[0] for t in tramites_list),
                "status": "DRY_RUN",
                "final_url": url,
                "error": ""
            })
    else:
        print(f"[*] Ejecutando validación HTTP con {args.workers} hilos...")
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            future_to_url = {executor.submit(check_url, u, session, args.timeout): u for u in unique_urls}
            completed = 0
            for future in as_completed(future_to_url):
                url = future_to_url[future]
                res = future.result()
                meta = classify_url(url)
                tramites_list = url_to_tramites[url]
                
                results.append({
                    "url": url,
                    "domain": meta["domain"],
                    "flags": meta["flags"],
                    "impacto_tramites": len(tramites_list),
                    "tramite_ids": ";".join(t[0] for t in tramites_list),
                    "status": res["status"],
                    "final_url": res["final_url"],
                    "error": res["error"] or ""
                })
                completed += 1
                if completed % 50 == 0 or completed == len(unique_urls):
                    print(f"    Progreso: {completed}/{len(unique_urls)} URLs validadas ({completed*100//len(unique_urls)}%)")
                    
    # Guardar reporte TSV
    with open(args.output, "w", encoding="utf-8") as f:
        f.write("url\tdomain\tflags\timpacto_tramites\tstatus\tfinal_url\terror\ttramite_ids\n")
        # Ordenar por impacto descendente
        results.sort(key=lambda x: x["impacto_tramites"], reverse=True)
        for r in results:
            f.write(f"{r['url']}\t{r['domain']}\t{r['flags']}\t{r['impacto_tramites']}\t{r['status']}\t{r['final_url']}\t{r['error']}\t{r['tramite_ids']}\n")
            
    print(f"\n[OK] Reporte generado exitosamente en: {args.output}")
    
    # Resumen analítico
    status_counts = defaultdict(int)
    flag_counts = defaultdict(int)
    for r in results:
        status_counts[str(r["status"])] += 1
        for flag in r["flags"].split("|"):
            flag_counts[flag] += 1
            
    print("\n--- RESUMEN DE AUDITORÍA ---")
    print(f"Total URLs auditadas: {len(results)}")
    print("Por Flags:")
    for flag, cnt in flag_counts.items():
        print(f"  - {flag}: {cnt}")
    print("Por Estado HTTP:")
    for status, cnt in status_counts.items():
        print(f"  - {status}: {cnt}")


if __name__ == "__main__":
    main()
