import openpyxl

excel_path = 'c:/Users/busqu/Documents/GitHub/SAT/docs/Detalle de Contenido para Grupos de Interes.xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)
ws = wb['Auxiliares Función Pública']

for r in range(1, 15):
    vals = [ws.cell(row=r, column=c).value for c in range(1, 15)]
    print(f"Row {r}: {vals[:10]}")
