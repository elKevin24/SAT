import pandas as pd
xl = pd.ExcelFile('docs/fuentes-datos/02_archivos_producto_entregables/Catalogo_Contenidos_Unicos_Portal_SAT.xlsx')
for s in xl.sheet_names:
    df = pd.read_excel(xl, sheet_name=s, header=None)
    print('===', s, df.shape)
    for i in range(min(15, len(df))):
        print(i, list(df.iloc[i].values))
    print('\n' + '='*60 + '\n')
with open('inspect_out.txt','w',encoding='utf-8') as f:
    pass
