# Script para integrar vistas completas de FEL en FelPage.tsx
import re

with open('src/pages/FelPage.tsx', 'r', encoding='utf-8') as f:
    orig = f.read()

# Marker 1: start of certificadores
m1 = '{/* ======================================================== */}\n        {/* VISTA 3: CERTIFICADORES (/portal/certificador-de-dte/)   */}'
# Marker 2: start of base legal
m2 = '{/* ======================================================== */}\n        {/* CAPA 3 ATO: CERTEZA JURÍDICA COMÚN AL PIE DE PÁGINA     */}'

if m1 in orig and m2 in orig:
    print('Found both markers!')
else:
    print('Markers not found exactly, searching substring...')
    print('m1 in orig:', m1 in orig)
    print('m2 in orig:', m2 in orig)
