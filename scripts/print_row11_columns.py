import openpyxl

excel_path = 'c:/Users/busqu/Documents/GitHub/SAT/docs/Detalle de Contenido para Grupos de Interes.xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)
ws = wb['Auxiliares Función Pública']

row_11 = [ws.cell(row=11, column=c).value for c in range(1, 30)]
print("Columnas en Fila 11:")
for idx, val in enumerate(row_11, start=1):
    if val is not None:
        print(f"  Col {idx}: {val}")
