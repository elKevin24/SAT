"""
test_wpbakery_templates.py
==========================
Valida automáticamente las 160 plantillas de WPBakery (.txt) y los paquetes WXR (.xml):
  1. 0 ocurrencias de [vc_raw_html], <iframe o <script.
  2. 100% de las páginas internas incluyen [dt_breadcrumbs].
  3. 0 enlaces internos huérfanos: toda URL relativa link="url:/...|..." apunta a una página válida del plan.
  4. 0 ocurrencias visibles de la palabra prohibida "trámite" / "trámites".
"""

import re
import sys
from pathlib import Path
from generar_wxr_wordpress import collect_all_pages

sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).parent.parent
OUTPUT_DIR = BASE_DIR / "docs" / "plantillas-wpbakery"


def main():
    pages = collect_all_pages()
    valid_internal_urls = {p["url"] for p in pages}

    errors: list[str] = []

    txt_files = sorted(OUTPUT_DIR.rglob("*.txt"))
    if len(txt_files) != 160:
        errors.append(f"Se esperaban 160 archivos .txt y se encontraron {len(txt_files)}")

    for txt_path in txt_files:
        rel_name = txt_path.relative_to(OUTPUT_DIR).as_posix()
        content = txt_path.read_text(encoding="utf-8")

        # 1. Cero [vc_raw_html], <iframe o <script
        if "[vc_raw_html]" in content or "<iframe" in content.lower() or "<script" in content.lower():
            errors.append(f"[{rel_name}] Contiene [vc_raw_html], <iframe> o <script> prohibido.")

        # 2. Todas las páginas salvo HOME llevan [dt_breadcrumbs]
        if rel_name != "HOME_portada-portal-sat.txt" and "[dt_breadcrumbs" not in content:
            errors.append(f"[{rel_name}] No incluye [dt_breadcrumbs].")

        # 3. Validar todos los enlaces internos link="url:/...|..."
        for match in re.finditer(r'link="url:([^|"]+)\|\|', content):
            raw_url = match.group(1)
            if raw_url.startswith("/"):
                clean_url = raw_url.split("#")[0]
                if clean_url not in valid_internal_urls:
                    errors.append(f"[{rel_name}] Enlace interno huérfano: {raw_url} (no existe en las 160 páginas)")

        # 4. Verificar que no aparezca "trámite" o "trámites" fuera de las URLs oficiales de sat.gob.gt
        content_without_urls = re.sub(r'link="url:[^"]+"', "", content)
        if re.search(r"\btr[áa]mites?\b", content_without_urls, flags=re.IGNORECASE):
            errors.append(f"[{rel_name}] Contiene la palabra prohibida 'trámite/trámites' en texto visible.")

    # Validar existencia de los 2 paquetes WXR XML
    for xml_name in ("wordpress-import-olas-0-1-2.xml", "wordpress-import-completo-160.xml"):
        xml_path = OUTPUT_DIR / xml_name
        if not xml_path.exists():
            errors.append(f"No existe el paquete XML {xml_name}")
        else:
            xml_text = xml_path.read_text(encoding="utf-8")
            if "[vc_raw_html]" in xml_text:
                errors.append(f"[{xml_name}] Contiene [vc_raw_html] prohibido.")

    if errors:
        print("FALLÓ LA AUDITORÍA DE PLANTILLAS WPBAKERY:")
        for e in errors:
            print("  -", e)
        sys.exit(1)

    print(
        f"[OK] Auditoría WPBakery superada: {len(txt_files)} plantillas .txt + 2 paquetes .xml verificados "
        f"(0 [vc_raw_html], 100% [dt_breadcrumbs], {len(valid_internal_urls)} rutas internas válidas, 0 'trámite')."
    )


if __name__ == "__main__":
    main()
