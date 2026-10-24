import openpyxl
wb = openpyxl.load_workbook('docs/fuentes-datos/02_archivos_producto_entregables/Catalogo_Contenidos_Unicos_Portal_SAT.xlsx')
with open('sheets_list.txt', 'w', encoding='utf-8') as f:
    for name in wb.sheetnames:
        f.write(name + '\n')
