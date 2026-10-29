import json, pandas as pd, os, sys
json_path = os.path.abspath('src/data/allTramites.json')
excel_path = os.path.abspath('docs/fuentes-datos/02_archivos_producto_entregables/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx')
# Load JSON
with open(json_path, encoding='utf-8') as f:
    data = json.load(f)
ids_json = set(item.get('codigo') for item in data)
# Load Excel matrix sheet
xl = pd.ExcelFile(excel_path)
matrix_sheet = None
for name in xl.sheet_names:
    if 'Matriz' in name or 'Maestra' in name:
        matrix_sheet = name
        break
if not matrix_sheet:
    print('Matrix sheet not found')
    sys.exit(1)
df = xl.parse(matrix_sheet, dtype=str)
# Identify code column (should be named 'ID Gesti�n' or similar)
code_col = None
for col in df.columns:
    if 'ID' in col and 'Gest' in col:
        code_col = col
        break
if not code_col:
    print('Code column not found')
    sys.exit(1)
ids_excel = set(df[code_col].astype(str).str.strip())
print('IDs only in JSON:', len(ids_json - ids_excel))
print('IDs only in Excel:', len(ids_excel - ids_json))
if ids_json - ids_excel:
    print('Missing in Excel sample:', list(ids_json - ids_excel)[:5])
if ids_excel - ids_json:
    print('Extra in Excel sample:', list(ids_excel - ids_json)[:5])
