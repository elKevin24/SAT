import openpyxl

excel_path = 'c:/Users/busqu/Documents/GitHub/SAT/docs/Detalle de Contenido para Grupos de Interes.xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)
ws = wb['Auxiliares Función Pública']

print(f"Total filas en 'Auxiliares Función Pública': {ws.max_row}")

header = [cell.value for cell in ws[1]]
print("Cabeceras:", header)

rows = list(ws.iter_rows(min_row=2, values_only=True))

# Contar por Nivel 2 y Nivel 3 (Actor / Rol)
from collections import Counter
niveles_2 = Counter(r[0] for r in rows if r[0] is not None)
niveles_3 = Counter(r[1] for r in rows if len(r) > 1 and r[1] is not None)
niveles_4 = Counter(r[2] for r in rows if len(r) > 2 and r[2] is not None)

print("\n--- Nivel 2 (Grupo) ---")
for k, v in niveles_2.items():
    print(f"  {k}: {v}")

print("\n--- Nivel 3 (Actor / Rol) ---")
for k, v in niveles_3.items():
    print(f"  {k}: {v}")

print("\n--- Nivel 4 (Sub-actor / Subgrupo) ---")
for k, v in niveles_4.items():
    print(f"  {k}: {v}")

print("\n--- Detalle de filas donde Nivel 3 o Nivel 4 tiene Depósitos / Almacenes ---")
for idx, r in enumerate(rows, start=2):
    r_str = " ".join([str(v) for v in r if v is not None]).lower()
    if 'depósito' in r_str or 'deposito' in r_str or 'almacen' in r_str or 'almacén' in r_str:
        print(f"Fila {idx}: N2={r[0]} | N3={r[1]} | N4={r[2]} | Tema={r[3]} | Subtema={r[4]} | Nombre={r[5]} | URL={r[6] if len(r)>6 else ''}")
