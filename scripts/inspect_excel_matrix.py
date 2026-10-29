import pandas as pd, os, json, sys
excel_path = os.path.abspath('docs/fuentes-datos/02_archivos_producto_entregables/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx')
try:
    xl = pd.ExcelFile(excel_path)
except Exception as e:
    print('Error loading Excel:', e)
    sys.exit(1)
print('Sheets:', xl.sheet_names)
# Find matrix sheet by partial name
matrix_sheet = None
for name in xl.sheet_names:
    if 'Matriz' in name or 'Maestra' in name:
        matrix_sheet = name
        break
if not matrix_sheet:
    print('Matrix sheet not found')
    sys.exit(0)
print('Using sheet:', matrix_sheet)
df = xl.parse(matrix_sheet, dtype=str)
print('Columns:', df.columns.tolist())
print('First 5 rows:')
print(df.head().to_string(index=False))
# Show which column contains SAT-GES codes
code_cols = [c for c in df.columns if 'code' in c.lower() or 'codigo' in c.lower()]
print('Potential code columns:', code_cols)
# Show distinct values of first column
first_col = df.columns[0]
print('First column name:', first_col)
print('Unique values sample (first 10):', df[first_col].dropna().unique()[:10].tolist())
