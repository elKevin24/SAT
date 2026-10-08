import subprocess
import json

raw_246 = subprocess.check_output(['git', 'show', 'f7055f4:src/data/allTramites.json'], text=True, encoding='utf-8')
data_246 = json.loads(raw_246)
ce_246 = [t for t in data_246 if t.get('pillarName') == 'Operadores de Comercio Exterior']

print(f"Total CE items in 246: {len(ce_246)}")
from collections import Counter
c = Counter(t.get('categoria') for t in ce_246)
for cat, cnt in c.most_common():
    print(f"  - {cat}: {cnt}")

# Print first item structure
print("\nFirst item keys:", ce_246[0].keys())
