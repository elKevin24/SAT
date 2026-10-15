import re, sys, pathlib, requests
sys.stdout.reconfigure(encoding='utf-8')
def extract_urls(text):
    # Regex to capture http/https URLs up to whitespace or closing punctuation
    url_regex = re.compile(r"https?://[^\s)\]>'\"`]+")
    return url_regex.findall(text)

def validate_url(url, timeout=5):
    try:
        resp = requests.head(url, allow_redirects=True, timeout=timeout)
        return resp.status_code
    except Exception as e:
        return f"Error: {e}"

def main(root_dir='.'):  # default to repo root
    md_files = pathlib.Path(root_dir).rglob('*.md')
    results = []
    for md in md_files:
        try:
            content = md.read_text(encoding='utf-8')
        except Exception as e:
            print(f"Failed to read {md}: {e}", file=sys.stderr)
            continue
        urls = set(extract_urls(content))
        for url in urls:
            status = validate_url(url)
            results.append((md, url, status))
    # Print report
    for md_path, url, status in results:
        print(f"{md_path}\t{url}\t{status}")

if __name__ == '__main__':
    root = sys.argv[1] if len(sys.argv) > 1 else '.'
    main(root)
