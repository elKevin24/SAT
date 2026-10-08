/**
 * Taxonomía canónica del catálogo: asigna IDs estables a pilar / categoría / subcategoría
 * y construye un índice navegable derivado únicamente de allTramites.json.
 * (Los IDs se calculan, no se persisten: evitan deriva entre ETL y frontend.)
 */

import { PillarType, slugify } from './schema';

export interface SubcategoriaNode {
  id: string;
  nombre: string;
  count: number;
}

export interface CategoriaNode {
  id: string;
  pillar: PillarType;
  nombre: string;
  count: number;
  subcategorias: SubcategoriaNode[];
}

export interface Taxonomy {
  pillars: Record<PillarType, CategoriaNode[]>;
  byCategoriaId: Map<string, CategoriaNode>;
}

export function categoriaId(pillar: PillarType, nombre: string): string {
  return `${slugify(pillar)}/${slugify(nombre)}`;
}

export function subcategoriaId(categoriaIdValue: string, nombre: string): string {
  return `${categoriaIdValue}/${slugify(nombre)}`;
}

interface Categorizable {
  pillar: PillarType;
  categoria: string;
  subcategoria: string;
}

export function buildTaxonomy(tramites: Categorizable[]): Taxonomy {
  const pillars: Taxonomy['pillars'] = {
    contribuyentes: [],
    comercio_exterior: [],
    profesionales: [],
    entes_exentos: [],
  };
  const byCategoriaId = new Map<string, CategoriaNode>();
  const subCounts = new Map<string, number>();

  const indexFor = (pillar: PillarType, categoria: string) => {
    const id = categoriaId(pillar, categoria);
    let node = byCategoriaId.get(id);
    if (!node) {
      node = { id, pillar, nombre: categoria, count: 0, subcategorias: [] };
      byCategoriaId.set(id, node);
      pillars[pillar].push(node);
    }
    return node;
  };

  tramites.forEach((t) => {
    const cat = indexFor(t.pillar, t.categoria);
    cat.count += 1;
    if (!t.subcategoria) return;
    const subId = subcategoriaId(cat.id, t.subcategoria);
    const count = (subCounts.get(subId) ?? 0) + 1;
    subCounts.set(subId, count);
    const existing = cat.subcategorias.find((s) => s.id === subId);
    if (existing) {
      existing.count = count;
    } else {
      cat.subcategorias.push({ id: subId, nombre: t.subcategoria, count });
    }
  });

  return { pillars, byCategoriaId };
}

export function resolveCategoria(
  taxonomy: Taxonomy,
  pillar: PillarType,
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const direct = taxonomy.byCategoriaId.get(value);
  if (direct) return direct.nombre;
  const bySlug = taxonomy.byCategoriaId.get(categoriaId(pillar, value));
  if (bySlug) return bySlug.nombre;
  const byName = (taxonomy.pillars[pillar] || []).find((cat) => cat.nombre === value);
  return byName ? byName.nombre : null;
}