import openpyxl

excel_path = 'c:/Users/busqu/Documents/GitHub/SAT/docs/Arbol_de_Navegacion_Portal_v5.xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)
ws = wb['Operadores de comercio exterior']

print("FILAS 191 A 207 (ALMACENES FISCALES):")
print("-" * 120)
for r in range(191, 208):
    vals = [ws.cell(row=r, column=c).value for c in range(1, 10)]
    print(f"Fila {r}: N2={vals[0]} | N3={vals[1]} | N4/Tema={vals[2]} | Subtema={vals[3]} | Trámite={vals[4]} | URL={vals[7]}")
