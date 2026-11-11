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


def classify_url(url: str, final_url: str = "") -> dict:
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
        
    # Detección de redirección a Home genérico (Soft 404)
    if final_url:
        orig_clean = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path.rstrip('/'), "", "", ""))
        final_parsed = urllib.parse.urlparse(final_url)
        final_clean = urllib.parse.urlunparse((final_parsed.scheme, final_parsed.netloc, final_parsed.path.rstrip('/'), "", "", ""))
        
        home_variants = {
            "https://portal.sat.gob.gt",
            "https://portal.sat.gob.gt/portal",
            "http://portal.sat.gob.gt",
            "http://portal.sat.gob.gt/portal"
        }
        if orig_clean not in home_variants and final_clean in home_variants:
            flags.append("REDIRECT_HOME")
        
    return {
        "domain": netloc,
        "is_sat": is_sat,
        "has_fragment": has_fragment,
        "flags": "|".join(flags),
        "clean_url": urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, parsed.query, ""))
    }


def check_url(url: str, session: requests.Session, timeout: int = 10) -> dict:
    """Verifica el estado HTTP de una URL realizando HEAD con fallback a GET."""
    parsed = urllib.parse.urlparse(url)
    clean_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, parsed.query, ""))
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SAT-Audit/2.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
    }
    
    try:
        resp = session.head(clean_url, headers=headers, allow_redirects=True, timeout=timeout)
        # Si no devuelve 200, reintentar con GET con stream=True (muchos servidores rechazan o manejan mal HEAD)
        if resp.status_code != 200:
            resp = session.get(clean_url, headers=headers, stream=True, allow_redirects=True, timeout=timeout)
            
        final_url = resp.url
        status = resp.status_code
        
        # Validar si redirigió al home genérico de forma anómala (Soft 404)
        orig_clean = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path.rstrip('/'), "", "", ""))
        final_parsed = urllib.parse.urlparse(final_url)
        final_clean = urllib.parse.urlunparse((final_parsed.scheme, final_parsed.netloc, final_parsed.path.rstrip('/'), "", "", ""))
        home_variants = {
            "https://portal.sat.gob.gt",
            "https://portal.sat.gob.gt/portal",
            "http://portal.sat.gob.gt",
            "http://portal.sat.gob.gt/portal"
        }
        if orig_clean not in home_variants and final_clean in home_variants:
            status = "REDIRECT_HOME"
            
        return {
            "status": status,
            "final_url": final_url,
            "error": None
        }
    except requests.exceptions.Timeout:
        return {"status": "TIMEOUT", "final_url": clean_url, "error": "Request timed out"}
    except requests.exceptions.SSLError as e:
        # Reintento con verify=False para aislar si el endpoint existe pero tiene fallo de cadena TLS
        try:
            resp_insecure = session.get(clean_url, headers=headers, stream=True, verify=False, allow_redirects=True, timeout=timeout)
            return {"status": resp_insecure.status_code, "final_url": resp_insecure.url, "error": "SSL_CERT_INVALID (Accede con verify=False)"}
        except Exception:
            return {"status": "SSL_ERROR", "final_url": clean_url, "error": str(e)}
    except requests.exceptions.ConnectionError:
        return {"status": "CONN_ERROR", "final_url": clean_url, "error": "Connection refused or DNS failure"}
    except Exception as e:
        return {"status": "ERROR", "final_url": clean_url, "error": str(e)}


def load_dataset_urls(json_path: str):
    """Carga las gestiones y agrupa URLs deduplicadas calculando el impacto de cada una."""
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"No se encontró el dataset en: {json_path}")
        
    with open(json_path, "r", encoding="utf-8") as f:
        gestiones = json.load(f)
        
    url_to_gestiones = defaultdict(list)
    for g in gestiones:
        url = g.get("url")
        g_id = g.get("codigo") or g.get("id") or g.get("id_tramite") or "UNKNOWN"
        g_nombre = g.get("gestion") or g.get("nombreActual") or g.get("nombre") or g.get("titulo") or ""
        if url and url.strip():
            url_to_gestiones[url.strip()].append((g_id, g_nombre))
            
    return url_to_gestiones, len(gestiones)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        
    parser = argparse.ArgumentParser(description="Auditoría de URLs del Portal SAT")
    parser.add_argument("--dataset", default=DEFAULT_DATASET, help="Ruta al JSON de gestiones")
    parser.add_argument("--output", default=DEFAULT_OUTPUT, help="Ruta del reporte TSV de salida")
    parser.add_argument("--workers", type=int, default=15, help="Hilos concurrentes para validación")
    parser.add_argument("--timeout", type=int, default=10, help="Timeout por petición en segundos")
    parser.add_argument("--dry-run", action="store_true", help="Analizar estructura y duplicados sin peticiones HTTP")
    args = parser.parse_args()
    
    print(f"[*] Cargando dataset desde: {args.dataset}")
    url_to_gestiones, total_gestiones = load_dataset_urls(args.dataset)
    unique_urls = list(url_to_gestiones.keys())
    
    print(f"[*] Total gestiones en dataset: {total_gestiones}")
    print(f"[*] Total URLs únicas a validar: {len(unique_urls)}")
    
    # Análisis de duplicación / impacto
    multi_gestion_urls = {u: gs for u, gs in url_to_gestiones.items() if len(gs) > 1}
    print(f"[*] URLs compartidas por múltiples gestiones (polijerarquía / paraguas): {len(multi_gestion_urls)}")
    
    # Creación de directorio de salida
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    
    results = []
    session = requests.Session()
    adapter = requests.adapters.HTTPAdapter(pool_connections=args.workers * 2, pool_maxsize=args.workers * 2, max_retries=1)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    if args.dry_run:
        print("[*] Modo DRY-RUN activado (sin peticiones HTTP). Clasificando URLs...")
        for url in unique_urls:
            meta = classify_url(url)
            gestiones_list = url_to_gestiones[url]
            results.append({
                "url": url,
                "domain": meta["domain"],
                "flags": meta["flags"],
                "impacto_gestiones": len(gestiones_list),
                "gestion_ids": ";".join(t[0] for t in gestiones_list),
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
                meta = classify_url(url, final_url=res.get("final_url", ""))
                gestiones_list = url_to_gestiones[url]
                
                results.append({
                    "url": url,
                    "domain": meta["domain"],
                    "flags": meta["flags"],
                    "impacto_gestiones": len(gestiones_list),
                    "gestion_ids": ";".join(t[0] for t in gestiones_list),
                    "status": res["status"],
                    "final_url": res["final_url"],
                    "error": res["error"] or ""
                })
                completed += 1
                if completed % 50 == 0 or completed == len(unique_urls):
                    print(f"    Progreso: {completed}/{len(unique_urls)} URLs validadas ({completed*100//len(unique_urls)}%)")
                    
    # Guardar reporte TSV
    with open(args.output, "w", encoding="utf-8") as f:
        f.write("url\tdomain\tflags\timpacto_gestiones\tstatus\tfinal_url\terror\tgestion_ids\n")
        # Ordenar por impacto descendente
        results.sort(key=lambda x: x["impacto_gestiones"], reverse=True)
        for r in results:
            f.write(f"{r['url']}\t{r['domain']}\t{r['flags']}\t{r['impacto_gestiones']}\t{r['status']}\t{r['final_url']}\t{r['error']}\t{r['gestion_ids']}\n")
            
    # Guardar reporte JSON estructurado
    json_output = os.path.splitext(args.output)[0] + ".json"
    with open(json_output, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n[OK] Reporte TSV generado en: {args.output}")
    print(f"[OK] Reporte JSON generado en: {json_output}")
    
    # Resumen analítico
    status_counts = defaultdict(int)
    flag_counts = defaultdict(int)
    problematic = []
    
    for r in results:
        status_counts[str(r["status"])] += 1
        for flag in r["flags"].split("|"):
            if flag:
                flag_counts[flag] += 1
        if str(r["status"]) != "200" and str(r["status"]) != "DRY_RUN":
            problematic.append(r)
            
    print("\n================ RESUMEN DE AUDITORÍA DE ENLACES ================")
    print(f"Total URLs únicas auditadas: {len(results)}")
    print(f"Total gestiones vinculadas: {total_gestiones}")
    print("\nDesglose por Estado HTTP:")
    for status, cnt in sorted(status_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {status}: {cnt} ({cnt*100/len(results):.1f}%)")
    print("\nDesglose por Tipología / Flags:")
    for flag, cnt in sorted(flag_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {flag}: {cnt}")
        
    if problematic:
        print(f"\n[!] ATENCIÓN: Se detectaron {len(problematic)} URLs no funcionales o redirigidas a Home:")
        for p in problematic:
            print(f"  • [{p['status']}] {p['url']}")
            print(f"    Impacto: {p['impacto_gestiones']} gestión(es) -> IDs: {p['gestion_ids']}")
            if p['error']:
                print(f"    Error: {p['error']}")
            if p['status'] == 'REDIRECT_HOME':
                print(f"    Redirige a: {p['final_url']}")
    else:
        print("\n[OK] Todas las URLs respondieron HTTP 200 OK directo sin enlaces rotos ni desvíos a Home.")
    print("=================================================================")


if __name__ == "__main__":
    main()
