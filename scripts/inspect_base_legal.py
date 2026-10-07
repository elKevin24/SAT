import re
from collections import Counter

text = open('src/data/taxArchitecture.ts', encoding='utf-8').read()
matches = re.findall(r"baseLegal:\s*['\"]([^'\"]+)['\"]", text)
print(f"Total baseLegal en taxArchitecture.ts: {len(matches)}")
for k, v in Counter(matches).most_common(12):
    print(f"  {k}: {v}")

text_cat = open('src/data/catalogoData.ts', encoding='utf-8').read()
matches_cat = re.findall(r"ley:\s*['\"]([^'\"]+)['\"]", text_cat)
print(f"\nTotal ley en catalogoData.ts: {len(matches_cat)}")
for k, v in Counter(matches_cat).most_common(12):
    print(f"  {k}: {v}")
