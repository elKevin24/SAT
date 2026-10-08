import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { assertTramites, assertProcesos, PILLARS, TramiteItem, ProcesoGuiado } from '../src/data/schema';
import { buildTaxonomy, categoriaId, subcategoriaId, resolveCategoria } from '../src/data/taxonomy';
import { OFFICIAL_CATEGORY_ORDER, OFFICIAL_SUBCATEGORY_ORDER, subcategoryOrderFor } from '../src/data/categoryOrder';

const DATA_URL = new URL('../src/data/', import.meta.url);

function loadJson(file: string): unknown {
  return JSON.parse(readFileSync(new URL(file, DATA_URL), 'utf8')) as unknown;
}

let tramites: TramiteItem[];
let procesos: ProcesoGuiado[];

test.beforeAll(() => {
  tramites = assertTramites(loadJson('allTramites.json'));
  procesos = assertProcesos(loadJson('allProcesos.json'));
});

const enrichedTramites = () =>
  tramites.map((t) => {
    const catId = categoriaId(t.pillar, t.categoria);
    return { ...t, categoriaId: catId, subcategoriaId: subcategoriaId(catId, t.subcategoria) };
  });

const taxonomy = () => buildTaxonomy(enrichedTramites());

const subcategoriasDe = (categoria: string): Set<string> =>
  new Set(tramites.filter((t) => t.categoria === categoria).map((t) => t.subcategoria));

test('allTramites: ids únicos y campos esenciales', () => {
  const ids = new Set(tramites.map((t) => t.id));
  expect(ids.size).toBe(tramites.length);
  tramites.forEach((t) => {
    expect(t.pillar).toBeDefined();
    expect(t.categoria).toBeTruthy();
    expect(t.subcategoria).toBeTruthy();
    expect(t.url).toMatch(/^https?:\/\//);
  });
});

test('allTramites: la taxonomía resuelve a IDs estables sin colisiones', () => {
  const tax = taxonomy();
  expect(Object.keys(tax.pillars).sort()).toEqual([...PILLARS].sort());

  tramites.forEach((t) => {
    const cat = tax.byCategoriaId.get(categoriaId(t.pillar, t.categoria));
    expect(cat, `categoría "${t.categoria}" (${t.pillar}) no indexada`).toBeDefined();
    expect(
      cat!.subcategorias.some((s) => s.id === subcategoriaId(cat!.id, t.subcategoria)),
      `subcategoría "${t.subcategoria}" de "${t.categoria}" no indexada`,
    ).toBe(true);
  });
});

test('allTramites: resolveCategoria acepta id y nombre (compat URL)', () => {
  const tax = taxonomy();
  tramites.forEach((t) => {
    const id = categoriaId(t.pillar, t.categoria);
    expect(resolveCategoria(tax, t.pillar, id)).toBe(t.categoria);
    expect(resolveCategoria(tax, t.pillar, t.categoria)).toBe(t.categoria);
  });
  expect(resolveCategoria(tax, 'contribuyentes', 'nombre-inexistente')).toBeNull();
});

test('order categorías: cada nombre oficial existe en el dataset', () => {
  const porPilar = new Map<string, Set<string>>();
  tramites.forEach((t) => {
    if (!porPilar.has(t.pillar)) porPilar.set(t.pillar, new Set());
    porPilar.get(t.pillar)!.add(t.categoria);
  });

  (Object.keys(OFFICIAL_CATEGORY_ORDER) as (typeof PILLARS)[number][]).forEach((pillar) => {
    const reales = porPilar.get(pillar) ?? new Set();
    OFFICIAL_CATEGORY_ORDER[pillar].forEach((nombre) => {
      expect(reales.has(nombre), `categoría oficial ausente en datos: ${pillar} / ${nombre}`).toBe(true);
    });
  });
});

test('order subcategorías: nombres oficiales existen y cubren categorías genéricas', () => {
  (Object.keys(OFFICIAL_SUBCATEGORY_ORDER) as string[]).forEach((categoria) => {
    const reales = subcategoriasDe(categoria);
    expect(reales.size > 0, `categoría de orden inexistente en datos: ${categoria}`).toBe(true);
    OFFICIAL_SUBCATEGORY_ORDER[categoria].forEach((nombre) => {
      expect(reales.has(nombre), `subcategoría oficial ausente: ${categoria} / ${nombre}`).toBe(true);
    });
  });

  const GENERIC_4 = ['Registro y acreditación', 'Operaciones y trámites', 'Consultas y seguimiento', 'Normativa y recursos'];
  const categoriasGenericas = new Set(
    tramites
      .map((t) => t.categoria)
      .filter((cat, i, arr) => {
        const subs = subcategoriasDe(cat);
        return subs.size === 4 && GENERIC_4.every((g) => subs.has(g)) && arr.indexOf(cat) === i;
      }),
  );

  categoriasGenericas.forEach((cat) => {
    const order = subcategoryOrderFor(cat);
    GENERIC_4.forEach((g) => {
      expect(order.includes(g), `categoría genérica sin orden de ciclo de vida: ${cat} / ${g}`).toBe(true);
    });
  });
});

test('allProcesos: numeración, pasos y URLs válidas', () => {
  expect(procesos.length).toBeGreaterThan(0);
  procesos.forEach((p) => {
    expect(p.nombre).toBeTruthy();
    p.pasos!.forEach((paso) => {
      expect(paso.numero).toBeGreaterThan(0);
      expect(paso.accion).toBeTruthy();
      expect(paso.url).toMatch(/^https?:\/\//);
    });
    if (typeof p.totalPasos === 'number' && p.pasos!.length > 0) {
      const maxStep = Math.max(...p.pasos!.map((s) => s.numero));
      expect(maxStep).toBe(p.totalPasos);
    }
  });
});