import pandas as pd
xl = pd.ExcelFile('docs/fuentes-datos/02_archivos_producto_entregables/Catalogo_Contenidos_Unicos_Portal_SAT.xlsx')
result = []
for s in xl.sheet_names:
    df = pd.read_excel(xl, sheet_name=s)
    result.append(f'=== {s} === {df.shape}')
    result.append(str(list(df.columns)))
    result.append(df.head(3).to_string())
    result.append('')
with open('analysis.txt','w',encoding='utf-8') as f:
    f.write('\n'.join(result))
