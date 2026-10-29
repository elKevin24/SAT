import json, pandas as pd, sys, os
json_path = os.path.abspath('src/data/allTramites.json')
excel_path = os.path.abspath('docs/fuentes-datos/02_archivos_producto_entregables/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx')
with open(json_path, encoding='utf-8') as f:
    data = json.load(f)
print('JSON entries:', len(data))
xl = pd.ExcelFile(excel_path)
print('Sheets:', xl.sheet_names)
# Find sheet likely containing the master matrix (name may vary)
sheet_name = None
for name in xl.sheet_names:
    if 'Matriz' in name or 'Maestra' in name:
        sheet_name = name
        break
if not sheet_name:
    print('No matrix sheet found')
    sys.exit(0)
df = xl.parse(sheet_name)
print('Excel rows (including header):', df.shape[0])
# Assume first column holds the code (SAT-GES-xxxx)
ids_excel = set(df.iloc[:,0].astype(str).str.strip())
ids_json = set(item.get('codigo') for item in data)
print('IDs only in JSON:', len(ids_json - ids_excel))
print('IDs only in Excel:', len(ids_excel - ids_json))
# Show a few examples if differences exist
if ids_json - ids_excel:
    print('Sample missing in Excel:', list(ids_json - ids_excel)[:5])
if ids_excel - ids_json:
    print('Sample extra in Excel:', list(ids_excel - ids_json)[:5])
