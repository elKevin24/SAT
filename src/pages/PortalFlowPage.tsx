import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeProps,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ArrowLeft,
  Layers,
  ChevronRight,
  Filter,
  FileText,
  ExternalLink,
  Scale,
  ShieldCheck,
  Search,
  X,
  Compass
} from 'lucide-react';
import { SatIsologotipo } from '../components/SatIsologotipo';
import rawTramites from '../data/allTramites.json';

// --- NIVEL 1: MACRO SEGMENTO (TIPO DE USUARIO 1) ---
export type SegmentKey = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'entes_exentos';

const SEGMENT_META: Record<SegmentKey, { name: string; color: string; desc: string }> = {
  contribuyentes: {
    name: 'Contribuyentes',
    color: '#14649B',
    desc: 'Información y servicios tributarios para personas individuales y jurídicas.'
  },
  comercio_exterior: {
    name: 'Operadores de Comercio Exterior',
    color: '#0284C7',
    desc: 'Servicios e información aduanera para importación, exportación y auxiliares.'
  },
  profesionales: {
    name: 'Profesionales',
    color: '#4D8014',
    desc: 'Herramientas y habilitaciones para profesionales tributarios y auxiliares.'
  },
  entes_exentos: {
    name: 'Entes Exentos',
    color: '#C25E00',
    desc: 'Gestiones para entidades públicas, organizaciones no lucrativas y exenciones.'
  }
};

// --- CARACTERÍSTICA TRANSVERSAL DE CICLO DE VIDA (ATO) ---
const ATO_FEATURE_META: Record<string, { label: string; bg: string; text: string; border: string; icon: string }> = {
  empezar: {
    label: 'Empezar y registrarse',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    icon: '🌱'
  },
  operar: {
    label: 'Operación y declaraciones',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-300',
    icon: '⚡'
  },
  consultar: {
    label: 'Consultas y herramientas',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
    icon: '🔍'
  },
  modificar_cerrar: {
    label: 'Modificaciones y cierre',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    icon: '🔄'
  },
  normativa: {
    label: 'Normativa y asistencia',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    icon: '⚖️'
  }
};

// --- ESTRUCTURA DE CADA TRÁMITE ---
export interface FullTramiteItem {
  id: string;
  codigo: string;
  titulo: string;
  pillar: string;
  categoria: string;
  subcategoria: string;
  tema?: string;
  subtema?: string;
  nivel1_segmento: string;
  etapaAto: string;
  etapaAtoLabel: string;
  tipoInteraccionLabel: string;
  descripcion: string;
  baseLegal: string;
  perfilDestinatario?: string;
  url?: string;
}

// --- NODOS DE REACT FLOW (ROTULADOS POR NIVEL) ---

// Nivel 1 — Tipo de Usuario
const NodeLevel1Component = ({ data }: NodeProps) => (
  <div
    className="w-72 bg-white border-2 rounded-xl p-4 shadow-md transition-transform hover:-translate-y-0.5"
    style={{ borderColor: data.color as string }}
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Nivel 1</span>
      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
        {data.total as number} Trámites
      </span>
    </div>
    <p className="text-base font-black text-slate-900 mt-1">{data.name as string}</p>
    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{data.desc as string}</p>
    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
      <span>Opciones de Nivel 2:</span>
      <span className="font-bold text-slate-800">{data.n2Count as number} Tipos</span>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-700" />
  </div>
);

// Nivel 2 — Tipo de Contribuyente / Régimen
const NodeLevel2Component = ({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  return (
    <div
      className={`w-72 bg-white border-2 rounded-xl p-3.5 shadow-xs transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/50 shadow-md'
          : 'border-slate-200 hover:border-slate-400'
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-600" />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Nivel 2</span>
        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800">
          {data.count as number} trámites
        </span>
      </div>
      <p className="text-xs font-bold text-slate-900 mt-1 leading-snug">{data.name as string}</p>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 font-medium">
        <span>{data.detailText as string}</span>
        {isSelected && (
          <span className="font-bold text-sky-700 flex items-center gap-0.5">
            Activo <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-sky-600" />
    </div>
  );
};

// Nivel 3 — Subtipo de Contribuyente o Contenido/Materia
const NodeLevel3Component = ({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  return (
    <div
      className={`w-72 bg-white border-2 rounded-xl p-3.5 shadow-xs transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50 shadow-md'
          : 'border-slate-200 hover:border-slate-400'
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-600" />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Nivel 3</span>
        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800">
          {data.count as number} trámites
        </span>
      </div>
      <p className="text-xs font-bold text-slate-900 mt-1 leading-snug">{data.name as string}</p>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 font-medium">
        <span>{data.detailText as string}</span>
        {isSelected && (
          <span className="font-bold text-emerald-700 flex items-center gap-0.5">
            Activo <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-emerald-600" />
    </div>
  );
};

// Nivel 4 — Tema / Contenido Específico
const NodeLevel4Component = ({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  return (
    <div
      className={`w-72 bg-white border-2 rounded-xl p-3.5 shadow-xs transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-violet-500 border-violet-500 bg-violet-50/50 shadow-md'
          : 'border-slate-200 hover:border-slate-400'
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-600" />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Nivel 4</span>
        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800">
          {data.count as number} trámites
        </span>
      </div>
      <p className="text-xs font-bold text-slate-900 mt-1 leading-snug">{data.name as string}</p>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 font-medium">
        <span>{data.detailText as string}</span>
        {isSelected && (
          <span className="font-bold text-violet-700 flex items-center gap-0.5">
            Activo <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-violet-600" />
    </div>
  );
};

// Nivel 5 — Trámite / Servicio (con Característica ATO visible)
const NodeLevel5TramiteComponent = ({ data }: NodeProps) => {
  const atoStyle = ATO_FEATURE_META[data.etapaAto as string] || ATO_FEATURE_META.empezar;
  const handleInspect = () => {
    if (typeof data.onInspect === 'function') data.onInspect();
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleInspect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleInspect();
        }
      }}
      className="w-80 bg-white border border-slate-300 rounded-xl p-3.5 shadow-xs space-y-2 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-600" />
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-black text-slate-700 uppercase tracking-wider">Nivel 5 — Trámite</span>
        <span className="text-slate-600 font-mono text-xs">{data.codigo as string}</span>
      </div>
      <p className="text-xs font-bold text-slate-900 leading-snug group-hover:text-sky-800 transition-colors">
        {data.titulo as string}
      </p>

      {/* Característica Transversal (ATO) como atributo explícito */}
      <div className="pt-1.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border ${atoStyle.bg} ${atoStyle.text} ${atoStyle.border}`}
          title="Característica transversal del ciclo de vida (no afecta el orden jerárquico)"
        >
          <span>{atoStyle.icon}</span>
          <span>{data.etapaAtoLabel as string}</span>
        </span>
        <span className="px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {data.tipo as string}
        </span>
      </div>

      <div className="pt-1 flex items-center justify-between text-[11px] text-sky-700 font-bold group-hover:underline">
        <span>Inspeccionar ficha (L6-L8)</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};

const NODE_TYPES = {
  macroNode: NodeLevel1Component,
  level2Node: NodeLevel2Component,
  level3Node: NodeLevel3Component,
  level4Node: NodeLevel4Component,
  tramiteNode: NodeLevel5TramiteComponent
};

// --- ESTRUCTURA DEL ÁRBOL LIMPIO CON REGLA DE COLAPSO (<= 2) ---
interface CleanBranch {
  name: string;
  total: number;
  tramites: FullTramiteItem[];
  subBranches?: Record<string, CleanBranch>;
}

interface SegmentTree {
  name: string;
  total: number;
  color: string;
  desc: string;
  n2Branches: Record<string, CleanBranch>;
}

export const PortalFlowPage: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<SegmentKey>('contribuyentes');
  const [selectedN2, setSelectedN2] = useState<string>('');
  const [selectedN3, setSelectedN3] = useState<string>('');
  const [selectedN4, setSelectedN4] = useState<string>('');
  const [selectedTramite, setSelectedTramite] = useState<FullTramiteItem | null>(null);
  const [filtroCaracteristica, setFiltroCaracteristica] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. CONSTRUCCIÓN DEL ÁRBOL SANADO CON LA REGLA DE COLAPSO
  const fullTree = useMemo<Record<SegmentKey, SegmentTree>>(() => {
    const tree: Record<SegmentKey, SegmentTree> = {
      contribuyentes: { ...SEGMENT_META.contribuyentes, total: 0, n2Branches: {} },
      comercio_exterior: { ...SEGMENT_META.comercio_exterior, total: 0, n2Branches: {} },
      profesionales: { ...SEGMENT_META.profesionales, total: 0, n2Branches: {} },
      entes_exentos: { ...SEGMENT_META.entes_exentos, total: 0, n2Branches: {} }
    };

    // Procesar todos los trámites
    (rawTramites as unknown as any[]).forEach((t) => {
      const segId = t.pillar as SegmentKey;
      if (!tree[segId]) return;

      const tramiteItem: FullTramiteItem = {
        id: t.id,
        codigo: t.id,
        titulo: t.tramite || t.nombreActual || 'Trámite Oficial',
        pillar: segId,
        categoria: t.categoria || 'General',
        subcategoria: t.subcategoria || 'General',
        tema: t.tema,
        subtema: t.subtema,
        nivel1_segmento: t.nivel1_segmento || SEGMENT_META[segId].name,
        etapaAto: t.etapaAto || 'empezar',
        etapaAtoLabel: t.etapaAtoLabel || 'Empezar y registrarse',
        tipoInteraccionLabel: t.tipoInteraccionLabel || 'Guía Informativa',
        descripcion: t.descripcion || 'Procedimiento del Portal SAT.',
        baseLegal: t.baseLegal || 'Normativa tributaria y aduanera vigente.',
        perfilDestinatario: t.perfilDestinatario || '',
        url: t.url || ''
      };

      tree[segId].total++;

      // NIVEL 2: SIEMPRE TIPO DE CONTRIBUYENTE / USUARIO
      let n2Key = t.categoria;
      if (segId === 'contribuyentes') {
        if (t.categoria === 'NIT sin Obligaciones') {
          n2Key = 'NIT sin Obligaciones';
        } else if (t.categoria === 'Pequeños Contribuyentes') {
          n2Key = 'Pequeños Contribuyentes';
        } else if (t.categoria === 'Contribuyentes Especiales') {
          n2Key = 'Contribuyentes Especiales';
        } else {
          n2Key = 'Contribuyente General';
        }
      }

      if (!tree[segId].n2Branches[n2Key]) {
        tree[segId].n2Branches[n2Key] = {
          name: n2Key,
          total: 0,
          tramites: [],
          subBranches: {}
        };
      }
      tree[segId].n2Branches[n2Key].total++;
      tree[segId].n2Branches[n2Key].tramites.push(tramiteItem);

      // Agrupación para Nivel 3:
      // En Contribuyente General, la materia de contenido es la categoría específica
      let n3Key = t.subcategoria;
      if (segId === 'contribuyentes' && n2Key === 'Contribuyente General') {
        n3Key = t.categoria;
      }

      const n2Node = tree[segId].n2Branches[n2Key];
      if (!n2Node.subBranches![n3Key]) {
        n2Node.subBranches![n3Key] = {
          name: n3Key,
          total: 0,
          tramites: [],
          subBranches: {}
        };
      }
      n2Node.subBranches![n3Key].total++;
      n2Node.subBranches![n3Key].tramites.push(tramiteItem);

      // Agrupación para Nivel 4 (si aplica):
      const n4Key = t.tema || t.subtema || '';
      if (n4Key) {
        const n3Node = n2Node.subBranches![n3Key];
        if (!n3Node.subBranches![n4Key]) {
          n3Node.subBranches![n4Key] = {
            name: n4Key,
            total: 0,
            tramites: []
          };
        }
        n3Node.subBranches![n4Key].total++;
        n3Node.subBranches![n4Key].tramites.push(tramiteItem);
      }
    });

    return tree;
  }, []);

  // Orden preferencial oficial de Nivel 2
  const n2Keys = useMemo(() => {
    const current = fullTree[selectedSegment];
    const keys = Object.keys(current?.n2Branches || {});
    if (selectedSegment === 'contribuyentes') {
      const order = ['NIT sin Obligaciones', 'Pequeños Contribuyentes', 'Contribuyente General', 'Contribuyentes Especiales'];
      return order.filter((k) => keys.includes(k));
    }
    return keys;
  }, [selectedSegment, fullTree]);

  // Sincronizar selección inicial
  useEffect(() => {
    if (n2Keys.length > 0) {
      const firstN2 = n2Keys[0];
      setSelectedN2(firstN2);

      const n2Data = fullTree[selectedSegment].n2Branches[firstN2];
      const rawSub = Object.keys(n2Data?.subBranches || {});

      // REGLA DE COLAPSO: Si subBranches <= 2, se colapsa y no hay Nivel 3 intermedio
      if (rawSub.length > 2) {
        setSelectedN3(rawSub[0]);
        const n3Data = n2Data.subBranches![rawSub[0]];
        const rawN4 = Object.keys(n3Data?.subBranches || {});
        setSelectedN4(rawN4.length > 2 ? rawN4[0] : '');
      } else {
        setSelectedN3('');
        setSelectedN4('');
      }
    } else {
      setSelectedN2('');
      setSelectedN3('');
      setSelectedN4('');
    }
    setSelectedTramite(null);
  }, [selectedSegment, fullTree, n2Keys]);

  // Manejo de clic en Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTramite) {
        setSelectedTramite(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTramite]);

  // 2. GENERACIÓN DEL MAPA EN REACT FLOW CON REGLA DE COLAPSO TAXONÓMICO
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const segInfo = fullTree[selectedSegment];
    if (!segInfo) return { initialNodes: [], initialEdges: [] };

    // --- COLUMNA 1: NIVEL 1 (Tipo de Usuario / Macro Segmento) ---
    const macroNodeId = `n1-${selectedSegment}`;
    const macroCenterY = Math.max(160, (n2Keys.length * 115) / 2);
    nodes.push({
      id: macroNodeId,
      type: 'macroNode',
      position: { x: 30, y: macroCenterY },
      data: {
        name: segInfo.name,
        total: segInfo.total,
        color: segInfo.color,
        desc: segInfo.desc,
        n2Count: n2Keys.length
      }
    });

    // --- COLUMNA 2: NIVEL 2 (Tipos de Contribuyente / Régimen) ---
    n2Keys.forEach((n2Key, aIdx) => {
      const n2Obj = segInfo.n2Branches[n2Key];
      const n2NodeId = `n2-${aIdx}`;
      const isN2Selected = n2Key === selectedN2;
      const subBranchesCount = Object.keys(n2Obj.subBranches || {}).length;

      // Texto descriptivo según si colapsa o ramifica
      const detailText =
        subBranchesCount <= 2
          ? 'Trámites directos (Regla colapso)'
          : `${subBranchesCount} ramas de contenido`;

      nodes.push({
        id: n2NodeId,
        type: 'level2Node',
        position: { x: 350, y: 40 + aIdx * 115 },
        data: {
          name: n2Key,
          count: n2Obj.total,
          detailText,
          isSelected: isN2Selected,
          n2Key
        }
      });

      // Arista Nivel 1 -> Nivel 2
      edges.push({
        id: `e-${macroNodeId}-${n2NodeId}`,
        source: macroNodeId,
        target: n2NodeId,
        animated: isN2Selected,
        style: {
          stroke: isN2Selected ? segInfo.color : '#CBD5E1',
          strokeWidth: isN2Selected ? 2.5 : 1.2
        }
      });
    });

    const activeN2Obj = segInfo.n2Branches[selectedN2];
    if (!activeN2Obj) return { initialNodes: nodes, initialEdges: edges };

    const activeN2Idx = n2Keys.indexOf(selectedN2);
    const activeN2NodeId = `n2-${activeN2Idx >= 0 ? activeN2Idx : 0}`;

    // APLICACIÓN DE LA REGLA DE COLAPSO:
    const n3BranchesList = Object.entries(activeN2Obj.subBranches || {});
    const n2HasDirectTramites = n3BranchesList.length <= 2;

    if (n2HasDirectTramites) {
      // COLAPSO: Nivel 2 va DIRECTAMENTE a sus trámites (Nivel 5) sin nivel intermedio de 1 o 2 cards
      let tramitesDirectos = activeN2Obj.tramites;
      if (filtroCaracteristica !== 'todos') {
        tramitesDirectos = tramitesDirectos.filter((t) => t.etapaAto === filtroCaracteristica);
      }
      if (searchQuery.trim().length > 1) {
        tramitesDirectos = tramitesDirectos.filter(
          (t) =>
            t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.codigo.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      tramitesDirectos.slice(0, 16).forEach((trItem, trIdx) => {
        const tramiteNodeId = `t-direct-${trIdx}`;
        nodes.push({
          id: tramiteNodeId,
          type: 'tramiteNode',
          position: { x: 670, y: 40 + trIdx * 135 },
          data: {
            id: trItem.id,
            codigo: trItem.codigo,
            titulo: trItem.titulo,
            tipo: trItem.tipoInteraccionLabel,
            etapaAto: trItem.etapaAto,
            etapaAtoLabel: trItem.etapaAtoLabel,
            onInspect: () => setSelectedTramite(trItem)
          }
        });

        edges.push({
          id: `e-${activeN2NodeId}-${tramiteNodeId}`,
          source: activeN2NodeId,
          target: tramiteNodeId,
          animated: true,
          style: { stroke: '#0284C7', strokeWidth: 1.5 }
        });
      });
    } else {
      // RAMIFICACIÓN LEGÍTIMA (>= 3 ramas): DESPLEGAR NIVEL 3
      const activeN3Key = selectedN3 || (n3BranchesList[0] ? n3BranchesList[0][0] : '');

      n3BranchesList.forEach(([n3Name, n3Obj], sIdx) => {
        const n3NodeId = `n3-${sIdx}`;
        const isN3Selected = n3Name === activeN3Key;
        const subCount = Object.keys(n3Obj.subBranches || {}).length;
        const detailText =
          subCount <= 2 ? `${n3Obj.total} trámites directos` : `${subCount} temas específicos`;

        nodes.push({
          id: n3NodeId,
          type: 'level3Node',
          position: { x: 670, y: 40 + sIdx * 115 },
          data: {
            name: n3Name,
            count: n3Obj.total,
            detailText,
            isSelected: isN3Selected,
            n3Key: n3Name
          }
        });

        edges.push({
          id: `e-${activeN2NodeId}-${n3NodeId}`,
          source: activeN2NodeId,
          target: n3NodeId,
          animated: isN3Selected,
          style: {
            stroke: isN3Selected ? '#0284C7' : '#CBD5E1',
            strokeWidth: isN3Selected ? 2.5 : 1.2
          }
        });
      });

      const activeN3Obj = activeN2Obj.subBranches![activeN3Key];
      if (activeN3Obj) {
        const activeN3Idx = n3BranchesList.findIndex(([k]) => k === activeN3Key);
        const activeN3NodeId = `n3-${activeN3Idx >= 0 ? activeN3Idx : 0}`;

        const n4BranchesList = Object.entries(activeN3Obj.subBranches || {});
        const n3HasDirectTramites = n4BranchesList.length <= 2;

        if (n3HasDirectTramites) {
          // COLAPSO: Nivel 3 va DIRECTAMENTE a sus trámites (Nivel 5)
          let tramitesList = activeN3Obj.tramites;
          if (filtroCaracteristica !== 'todos') {
            tramitesList = tramitesList.filter((t) => t.etapaAto === filtroCaracteristica);
          }
          if (searchQuery.trim().length > 1) {
            tramitesList = tramitesList.filter(
              (t) =>
                t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.codigo.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }

          tramitesList.slice(0, 16).forEach((trItem, trIdx) => {
            const tramiteNodeId = `t-n3-${trIdx}`;
            nodes.push({
              id: tramiteNodeId,
              type: 'tramiteNode',
              position: { x: 990, y: 40 + trIdx * 135 },
              data: {
                id: trItem.id,
                codigo: trItem.codigo,
                titulo: trItem.titulo,
                tipo: trItem.tipoInteraccionLabel,
                etapaAto: trItem.etapaAto,
                etapaAtoLabel: trItem.etapaAtoLabel,
                onInspect: () => setSelectedTramite(trItem)
              }
            });

            edges.push({
              id: `e-${activeN3NodeId}-${tramiteNodeId}`,
              source: activeN3NodeId,
              target: tramiteNodeId,
              animated: true,
              style: { stroke: '#10B981', strokeWidth: 1.5 }
            });
          });
        } else {
          // RAMIFICACIÓN LEGÍTIMA EN NIVEL 4 (>= 3 temas)
          const activeN4Key = selectedN4 || (n4BranchesList[0] ? n4BranchesList[0][0] : '');

          n4BranchesList.forEach(([n4Name, n4Obj], tIdx) => {
            const n4NodeId = `n4-${tIdx}`;
            const isN4Selected = n4Name === activeN4Key;

            nodes.push({
              id: n4NodeId,
              type: 'level4Node',
              position: { x: 990, y: 40 + tIdx * 115 },
              data: {
                name: n4Name,
                count: n4Obj.total,
                detailText: `${n4Obj.total} trámites`,
                isSelected: isN4Selected,
                n4Key: n4Name
              }
            });

            edges.push({
              id: `e-${activeN3NodeId}-${n4NodeId}`,
              source: activeN3NodeId,
              target: n4NodeId,
              animated: isN4Selected,
              style: {
                stroke: isN4Selected ? '#10B981' : '#CBD5E1',
                strokeWidth: isN4Selected ? 2.5 : 1.2
              }
            });
          });

          const activeN4Obj = activeN3Obj.subBranches![activeN4Key];
          if (activeN4Obj) {
            const activeN4Idx = n4BranchesList.findIndex(([k]) => k === activeN4Key);
            const activeN4NodeId = `n4-${activeN4Idx >= 0 ? activeN4Idx : 0}`;

            let tramitesList = activeN4Obj.tramites;
            if (filtroCaracteristica !== 'todos') {
              tramitesList = tramitesList.filter((t) => t.etapaAto === filtroCaracteristica);
            }
            if (searchQuery.trim().length > 1) {
              tramitesList = tramitesList.filter(
                (t) =>
                  t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.codigo.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }

            tramitesList.slice(0, 16).forEach((trItem, trIdx) => {
              const tramiteNodeId = `t-n4-${trIdx}`;
              nodes.push({
                id: tramiteNodeId,
                type: 'tramiteNode',
                position: { x: 1310, y: 40 + trIdx * 135 },
                data: {
                  id: trItem.id,
                  codigo: trItem.codigo,
                  titulo: trItem.titulo,
                  tipo: trItem.tipoInteraccionLabel,
                  etapaAto: trItem.etapaAto,
                  etapaAtoLabel: trItem.etapaAtoLabel,
                  onInspect: () => setSelectedTramite(trItem)
                }
              });

              edges.push({
                id: `e-${activeN4NodeId}-${tramiteNodeId}`,
                source: activeN4NodeId,
                target: tramiteNodeId,
                animated: true,
                style: { stroke: '#8B5CF6', strokeWidth: 1.5 }
              });
            });
          }
        }
      }
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [
    selectedSegment,
    selectedN2,
    selectedN3,
    selectedN4,
    filtroCaracteristica,
    searchQuery,
    fullTree,
    n2Keys
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Manejar clics en nodos del árbol
  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (node.type === 'level2Node' && node.data.n2Key) {
      const newN2 = node.data.n2Key as string;
      setSelectedN2(newN2);

      const n2Obj = fullTree[selectedSegment]?.n2Branches[newN2];
      const subKeys = Object.keys(n2Obj?.subBranches || {});
      if (subKeys.length > 2) {
        setSelectedN3(subKeys[0]);
        const n3Obj = n2Obj?.subBranches![subKeys[0]];
        const n4Keys = Object.keys(n3Obj?.subBranches || {});
        setSelectedN4(n4Keys.length > 2 ? n4Keys[0] : '');
      } else {
        setSelectedN3('');
        setSelectedN4('');
      }
    } else if (node.type === 'level3Node' && node.data.n3Key) {
      const newN3 = node.data.n3Key as string;
      setSelectedN3(newN3);

      const n3Obj = fullTree[selectedSegment]?.n2Branches[selectedN2]?.subBranches![newN3];
      const n4Keys = Object.keys(n3Obj?.subBranches || {});
      setSelectedN4(n4Keys.length > 2 ? n4Keys[0] : '');
    } else if (node.type === 'level4Node' && node.data.n4Key) {
      setSelectedN4(node.data.n4Key as string);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* 1. HEADER INSTITUCIONAL COMPLETO */}
      <header className="bg-sat-azul-oscuro text-white border-b border-sat-azul px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <a
            href="#/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition focus:outline-hidden focus:ring-2 focus:ring-sat-celeste"
            title="Volver al Portal Ciudadano SAT"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Portal SAT</span>
          </a>

          <div className="h-6 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2">
            <SatIsologotipo variant="oscuro" />
            <div className="hidden md:block">
              <span className="text-[10px] text-sat-celeste font-bold uppercase tracking-wider block leading-none">
                República de Guatemala
              </span>
              <h1 className="text-sm font-black text-white leading-tight">
                Mapa Jerárquico Oficial — Portal SAT
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Regla de Colapso Taxonómico Activa (≤ 2 colapsa)
          </span>
          <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            676 Trámites Verificados
          </span>
        </div>
      </header>

      {/* 2. BARRA DE CONTROL DE LA TAXONOMÍA */}
      <section aria-label="Control de taxonomía y filtros" className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        {/* Nivel 1: Tipo de Usuario */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider mr-1">
            Nivel 1 (Tipo de Usuario):
          </span>
          {(['contribuyentes', 'comercio_exterior', 'profesionales', 'entes_exentos'] as SegmentKey[]).map((segId) => {
            const item = SEGMENT_META[segId];
            const totalCount = fullTree[segId]?.total || 0;
            const isActive = selectedSegment === segId;
            return (
              <button
                key={segId}
                onClick={() => setSelectedSegment(segId)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                  isActive
                    ? 'border-sky-700 bg-sky-700 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.name} ({totalCount})
              </button>
            );
          })}
        </div>

        {/* Filtro por Característica Transversal (ATO) y Buscador */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Característica Transversal */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-600" />
            <label htmlFor="filtro-caracteristica-page" className="text-xs font-bold text-slate-700">
              Característica:
            </label>
            <select
              id="filtro-caracteristica-page"
              value={filtroCaracteristica}
              onChange={(e) => setFiltroCaracteristica(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              aria-label="Filtrar trámites por característica transversal de ciclo de vida"
            >
              <option value="todos">Todas las características (atributo transversal)</option>
              <option value="empezar">🌱 Empezar y registrarse</option>
              <option value="operar">⚡ Operación y declaraciones</option>
              <option value="consultar">🔍 Consultas y herramientas</option>
              <option value="modificar_cerrar">🔄 Modificaciones y cierre</option>
              <option value="normativa">⚖️ Normativa y asistencia</option>
            </select>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en tema activo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden w-44"
              aria-label="Buscar trámites en el tema seleccionado"
            />
          </div>
        </div>
      </section>

      {/* 3. CANVAS COMPLETO DE REACT FLOW (PÁGINA COMPLETA) */}
      <main className="flex-1 w-full relative bg-slate-50 overflow-hidden min-h-[calc(100vh-125px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={NODE_TYPES}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          attributionPosition="bottom-right"
        >
          <Background color="#cbd5e1" gap={20} size={1} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'macroNode') return SEGMENT_META[selectedSegment].color;
              if (node.type === 'level2Node') return '#0284c7';
              if (node.type === 'level3Node') return '#10b981';
              if (node.type === 'level4Node') return '#8b5cf6';
              return '#64748b';
            }}
            className="!border !border-slate-200 !rounded-xl !bg-white/90 !shadow-sm"
          />

          {/* Panel Informativo de Metodología */}
          <Panel position="bottom-left" className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3.5 shadow-md text-xs space-y-1.5 max-w-md">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Compass className="w-4 h-4 text-sky-700" />
              <span>Metodología de Arquitectura de Niveles:</span>
            </div>
            <ul className="text-[11px] text-slate-700 space-y-1 font-medium">
              <li>• <strong>Nivel 1 y 2:</strong> Estrictamente Tipos de Usuario / Contribuyentes.</li>
              <li>• <strong>Nivel 3 hacia abajo:</strong> Subtipos de contribuyentes o contenido/gestión según la necesidad.</li>
              <li>• <strong>Regla de Colapso Taxonómico:</strong> Si un nodo solo se subdivide en 1 o 2 ramas, no se crea un nivel intermedio; se colocan directamente en ese nivel.</li>
              <li>• <strong>Característica ATO:</strong> Atributo transversal del trámite, no un orden jerárquico.</li>
            </ul>
          </Panel>
        </ReactFlow>

        {/* 4. DRAWER LATERAL: INSPECTOR DE FICHA (NIVEL 5 + PROFUNDIZACIÓN L6-L8) */}
        {selectedTramite && (
          <aside aria-label="Ficha de trámite e inspección procedural" className="absolute top-0 right-0 w-full sm:w-[480px] h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-20 animate-in slide-in-from-right duration-200">
            {/* Header del Inspector */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                  Ficha de Trámite — Profundización
                </span>
                <h2 className="text-sm font-black text-slate-900 leading-tight">
                  Anatomía del Procedimiento
                </h2>
              </div>
              <button
                onClick={() => setSelectedTramite(null)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                aria-label="Cerrar inspector de trámite"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Inspector */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Ruta Oficial de Niveles */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Ubicación en la Taxonomía:
                </span>
                <div className="text-[11px] font-medium text-slate-800 flex flex-wrap items-center gap-1">
                  <span className="font-semibold text-slate-900">{selectedTramite.nivel1_segmento}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>{selectedTramite.categoria}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-violet-700">{selectedTramite.subcategoria}</span>
                </div>
              </div>

              {/* Título y Código (Nivel 5) */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    Nivel 5 — Ficha
                  </span>
                  <span className="font-mono text-slate-600 text-xs">{selectedTramite.codigo}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mt-1 leading-snug">
                  {selectedTramite.titulo}
                </h3>
                <p className="text-slate-600 mt-1 text-xs leading-relaxed">
                  {selectedTramite.descripcion}
                </p>
              </div>

              {/* CARACTERÍSTICA TRANSVERSAL DE CICLO DE VIDA (ATO) */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {ATO_FEATURE_META[selectedTramite.etapaAto]?.icon || '🌱'}
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                      Característica Transversal de Ciclo de Vida:
                    </span>
                    <p className="text-xs font-bold text-emerald-900">
                      {selectedTramite.etapaAtoLabel}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800 leading-tight">
                  Esta categoría es un atributo transversal del contribuyente frente al ciclo tributario, no un orden de jerarquía en el portal.
                </p>
              </div>

              {/* NIVEL 6: PROCEDIMIENTO OPERATIVO */}
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>Nivel 6 — Procedimiento Operativo y Canales</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Canal / Modalidad:</span>
                    <span className="font-semibold text-slate-900">{selectedTramite.tipoInteraccionLabel}</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 pt-1">
                    <li>Verificación de requisitos y validación de solvencia fiscal.</li>
                    <li>Ingreso a plataforma institucional o presentación de expediente.</li>
                    <li>Generación y entrega de constancia o resolución oficial.</li>
                  </ol>
                </div>
              </div>

              {/* NIVEL 7: CASOS ESPECIALES Y EXCEPCIONES */}
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Nivel 7 — Casos Especiales y Representación</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-700">
                  {selectedTramite.perfilDestinatario && (
                    <p>
                      <strong className="text-slate-800">Perfil destinatario:</strong> {selectedTramite.perfilDestinatario}
                    </p>
                  )}
                  <p>
                    <strong className="text-slate-800">Mandatarios y gestores:</strong> Requiere acreditación vigente y mandato inscrito en el Registro Tributario Unificado (RTU).
                  </p>
                  <p className="text-slate-600">
                    Aplica validación diferenciada según persona individual o jurídica.
                  </p>
                </div>
              </div>

              {/* NIVEL 8: MARCO LEGAL Y NORMATIVA */}
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  <span>Nivel 8 — Marco Legal y Fundamento Normativo</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedTramite.baseLegal}
                </p>
              </div>

              {/* Enlace Oficial al Portal SAT */}
              {selectedTramite.url && (
                <div className="pt-2">
                  <a
                    href={selectedTramite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>Abrir ficha oficial en Portal SAT</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </aside>
        )}
      </main>
    </div>
  );
};
