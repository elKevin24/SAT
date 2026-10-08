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
import { X, ZoomIn, ZoomOut, Maximize2, Layers, Info } from 'lucide-react';
import { SegmentId } from './UserSegmentCards';

// --- DEFINICIONES DE DATOS POR SEGMENTO ---
interface SegmentFlowData {
  id: SegmentId;
  name: string;
  total: number;
  color: string;
  toneBg: string;
  toneBorder: string;
  desc: string;
  l2: {
    id: string;
    name: string;
    count: number;
    desc: string;
    ejemplos: {
      titulo: string;
      etapa: string;
      tipo: string;
    }[];
  }[];
}

const FLOW_DATA: Record<SegmentId, SegmentFlowData> = {
  contribuyentes: {
    id: 'contribuyentes',
    name: 'Contribuyentes',
    total: 344,
    color: '#14649B',
    toneBg: 'bg-sky-50',
    toneBorder: 'border-[#14649B]',
    desc: 'Información y servicios tributarios para personas y empresas.',
    l2: [
      {
        id: 'c-nit',
        name: 'NIT sin Obligaciones',
        count: 10,
        desc: 'Identificación tributaria sin actividad económica comercial.',
        ejemplos: [
          { titulo: 'Inscripción de primer NIT', etapa: 'Empezar y registrarse', tipo: 'Trámite en Línea' },
          { titulo: 'Registro de títulos universitarios', etapa: 'Operación y declaraciones', tipo: 'Guía Informativa' },
          { titulo: 'Consulta pública de Solvencia Fiscal', etapa: 'Consultas y herramientas', tipo: 'Consulta en Base de Datos' }
        ]
      },
      {
        id: 'c-pequenos',
        name: 'Pequeños Contribuyentes',
        count: 22,
        desc: 'Régimen simplificado del 5% y actividades agropecuarias.',
        ejemplos: [
          { titulo: 'Habilitación de Factura Electrónica en Línea (FEL)', etapa: 'Empezar y registrarse', tipo: 'Trámite en Línea' },
          { titulo: 'Declaración mensual en Declaraguate', etapa: 'Operación y declaraciones', tipo: 'Trámite en Línea' },
          { titulo: 'Verificador de facturas DTE emitidas', etapa: 'Consultas y herramientas', tipo: 'Consulta en Base de Datos' }
        ]
      },
      {
        id: 'c-general',
        name: 'Contribuyente General',
        count: 298,
        desc: 'Régimen general del IVA e ISR, personas jurídicas y vehículos.',
        ejemplos: [
          { titulo: 'Inscripción de sociedades en RTU Digital', etapa: 'Empezar y registrarse', tipo: 'Trámite en Línea' },
          { titulo: 'Traspaso electrónico de vehículos en línea', etapa: 'Operación y declaraciones', tipo: 'Trámite en Línea' },
          { titulo: 'Actualización periódica de datos del RTU', etapa: 'Modificaciones y cierre', tipo: 'Trámite en Línea' }
        ]
      },
      {
        id: 'c-especiales',
        name: 'Contribuyentes Especiales',
        count: 14,
        desc: 'Grandes y medianos contribuyentes con gerencias especializadas.',
        ejemplos: [
          { titulo: 'Acreditación en Grandes Contribuyentes', etapa: 'Empezar y registrarse', tipo: 'Guía Informativa' },
          { titulo: 'Declaración jurada de precios de transferencia', etapa: 'Operación y declaraciones', tipo: 'Trámite en Línea' }
        ]
      }
    ]
  },
  comercio_exterior: {
    id: 'comercio_exterior',
    name: 'Operadores de Comercio Exterior',
    total: 204,
    color: '#0284C7',
    toneBg: 'bg-sky-50',
    toneBorder: 'border-[#0284C7]',
    desc: 'Servicios e información aduanera para importación, exportación y logística.',
    l2: [
      {
        id: 'ce-impexp',
        name: 'Importadores y Exportadores',
        count: 80,
        desc: 'Dueños de mercancías, padrones y devoluciones aduaneras.',
        ejemplos: [
          { titulo: 'Inscripción en Padrón de Importadores', etapa: 'Empezar y registrarse', tipo: 'Trámite en Línea' },
          { titulo: 'Transmisión de DUCA-D de importación definitiva', etapa: 'Operación y declaraciones', tipo: 'Trámite en Línea' },
          { titulo: 'Consulta de asignación de rampa en SAQB\'E', etapa: 'Consultas y herramientas', tipo: 'Consulta en Base de Datos' }
        ]
      },
      {
        id: 'ce-afpa',
        name: 'Auxiliares de la Función Pública (AFPA)',
        count: 70,
        desc: 'Agentes aduaneros, transportistas, depósitos y courier.',
        ejemplos: [
          { titulo: 'Acreditación oficial de Agente Aduanero', etapa: 'Empezar y registrarse', tipo: 'Guía Informativa' },
          { titulo: 'Sistema de Cobro por Permanencia de Mercancías (SCP)', etapa: 'Operación y declaraciones', tipo: 'Trámite en Línea' },
          { titulo: 'Renovación anual de carné AFPA', etapa: 'Modificaciones y cierre', tipo: 'Guía Informativa' }
        ]
      },
      {
        id: 'ce-especiales',
        name: 'Regímenes Especiales y Facilitación',
        count: 54,
        desc: 'ZDEEP, Maquilas 29-89, Zonas Francas y OEA.',
        ejemplos: [
          { titulo: 'Calificación de Empresa Usuaria en ZDEEP', etapa: 'Empezar y registrarse', tipo: 'Guía Informativa' },
          { titulo: 'Certificación como Operador Económico Autorizado (OEA)', etapa: 'Operación y declaraciones', tipo: 'Guía Informativa' }
        ]
      }
    ]
  },
  profesionales: {
    id: 'profesionales',
    name: 'Profesionales',
    total: 49,
    color: '#4D8014',
    toneBg: 'bg-emerald-50',
    toneBorder: 'border-[#4D8014]',
    desc: 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.',
    l2: [
      {
        id: 'pr-notarios',
        name: 'Abogados y Notarios',
        count: 20,
        desc: 'Timbres fiscales, papel de protocolo y traspasos electrónicos.',
        ejemplos: [
          { titulo: 'Habilitación de Notario para Traspaso Electrónico (TEV)', etapa: 'Empezar y registrarse', tipo: 'Trámite en Línea' },
          { titulo: 'Adquisición de Papel Sellado y Timbres (SAT-7130)', etapa: 'Operación y declaraciones', tipo: 'Trámite en Línea' },
          { titulo: 'Avisos notariales de transferencia vehicular', etapa: 'Operación y declaraciones', tipo: 'Trámite en Línea' }
        ]
      },
      {
        id: 'pr-contadores',
        name: 'Peritos Contadores y Auditores',
        count: 15,
        desc: 'Inscripción en RTU, Libro Electrónico LET y dictámenes fiscales.',
        ejemplos: [
          { titulo: 'Inscripción y habilitación como Perito Contador', etapa: 'Empezar y registrarse', tipo: 'Guía Informativa' },
          { titulo: 'Inscripción como Contador Público y Auditor (CPA)', etapa: 'Empezar y registrarse', tipo: 'Guía Informativa' },
          { titulo: 'Habilitación del Libro Electrónico Tributario (LET)', etapa: 'Operación y declaraciones', tipo: 'Trámite en Línea' }
        ]
      },
      {
        id: 'pr-gestores',
        name: 'Gestores Tributarios y Asesoría Profesional',
        count: 14,
        desc: 'Gestores autorizados, honorarios y consultas técnicas vinculantes.',
        ejemplos: [
          { titulo: 'Requisitos de acreditación inicial para Gestor Tributario', etapa: 'Empezar y registrarse', tipo: 'Guía Informativa' },
          { titulo: 'Consulta en línea del padrón de Gestores activos', etapa: 'Consultas y herramientas', tipo: 'Consulta en Base de Datos' },
          { titulo: 'Consultas técnico-tributarias vinculantes ante Asuntos Jurídicos', etapa: 'Consultas y herramientas', tipo: 'Guía Informativa' }
        ]
      }
    ]
  },
  entes_exentos: {
    id: 'entes_exentos',
    name: 'Entes Exentos',
    total: 79,
    color: '#C25E00',
    toneBg: 'bg-amber-50',
    toneBorder: 'border-[#C25E00]',
    desc: 'Gestiones para entidades públicas, ONGs y exenciones constitucionales.',
    l2: [
      {
        id: 'ex-estado',
        name: 'Sector Público y Entidades del Estado',
        count: 31,
        desc: 'Dependencias centrales, municipalidades y flota vehicular oficial.',
        ejemplos: [
          { titulo: 'Inscripción de Dependencia del Estado en el RTU', etapa: 'Empezar y registrarse', tipo: 'Guía Informativa' },
          { titulo: 'Emisión de Constancias de Exención del IVA (CIVA) en FEL', etapa: 'Operación y declaraciones', tipo: 'Trámite en Línea' },
          { titulo: 'Traspaso de vehículos a extinción de dominio (SENABED)', etapa: 'Operación y declaraciones', tipo: 'Guía Informativa' }
        ]
      },
      {
        id: 'ex-ongs',
        name: 'Organizaciones No Gubernamentales y No Lucrativas',
        count: 30,
        desc: 'Fundaciones, cooperativas, sindicatos y comités cívicos.',
        ejemplos: [
          { titulo: 'Inscripción de Organización No Gubernamental (ONG)', etapa: 'Modificaciones y cierre', tipo: 'Guía Informativa' },
          { titulo: 'Inscripción de cooperativa en el RTU', etapa: 'Modificaciones y cierre', tipo: 'Guía Informativa' },
          { titulo: 'Actualización integral de datos para entidades no lucrativas', etapa: 'Modificaciones y cierre', tipo: 'Trámite en Línea' }
        ]
      },
      {
        id: 'ex-constitucional',
        name: 'Centros Educativos, Religiosos y Misiones',
        count: 18,
        desc: 'Colegios, universidades, Iglesia Católica y diplomáticos.',
        ejemplos: [
          { titulo: 'Inscripción de Universidad Privada exenta en RTU', etapa: 'Empezar y registrarse', tipo: 'Guía Informativa' },
          { titulo: 'Inscripción de entidad de la Iglesia Católica', etapa: 'Empezar y registrarse', tipo: 'Guía Informativa' },
          { titulo: 'Traspaso vehicular con exención para Cuerpo Diplomático', etapa: 'Operación y declaraciones', tipo: 'Guía Informativa' }
        ]
      }
    ]
  }
};

const ATO_STAGES = [
  { id: 'ato-empezar', label: 'Empezar y registrarse', tag: 'Etapa 1', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  { id: 'ato-operar', label: 'Operación y declaraciones', tag: 'Etapa 2', color: 'border-blue-300 bg-blue-50 text-blue-800' },
  { id: 'ato-consultar', label: 'Consultas y herramientas', tag: 'Etapa 3', color: 'border-purple-300 bg-purple-50 text-purple-800' },
  { id: 'ato-modificar', label: 'Modificaciones y cierre', tag: 'Etapa 4', color: 'border-amber-300 bg-amber-50 text-amber-800' },
  { id: 'ato-normativa', label: 'Normativa y asistencia', tag: 'Etapa 5', color: 'border-slate-300 bg-slate-50 text-slate-800' }
];

// --- COMPONENTES DE NODOS PERSONALIZADOS ---
const MacroNodeComponent = ({ data }: NodeProps) => (
  <div className="w-64 bg-white border-2 rounded-xl p-4 shadow-md transition-transform hover:-translate-y-1" style={{ borderColor: data.color as string }}>
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nivel 1 — Segmento</span>
      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">{data.total as number} Trámites</span>
    </div>
    <h3 className="text-base font-black text-slate-900 mt-1">{data.name as string}</h3>
    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{data.desc as string}</p>
    <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-700" />
  </div>
);

const RegimenL2NodeComponent = ({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  return (
    <div className={`w-64 bg-white border-2 rounded-xl p-3.5 shadow-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/40 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-400" />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nivel 2 — Ámbito</span>
        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">{data.count as number} trámites</span>
      </div>
      <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{data.name as string}</h4>
      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{data.desc as string}</p>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-sky-600" />
    </div>
  );
};

const AtoNodeComponent = ({ data }: NodeProps) => (
  <div className={`w-56 border rounded-lg p-2.5 shadow-xs bg-white ${data.color as string}`}>
    <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-slate-400" />
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold leading-tight">{data.label as string}</span>
      <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded border bg-white/80">{data.tag as string}</span>
    </div>
    <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-slate-500" />
  </div>
);

const ServiceNodeComponent = ({ data }: NodeProps) => (
  <div className="w-64 bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs space-y-1 hover:border-slate-400 transition-colors">
    <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-slate-400" />
    <div className="flex items-center justify-between text-[10px]">
      <span className="font-bold text-slate-400 uppercase tracking-wider">{data.tipo as string}</span>
      <span className="text-sky-700 font-medium">{data.etapa as string}</span>
    </div>
    <h5 className="text-xs font-semibold text-slate-800 leading-snug">{data.titulo as string}</h5>
  </div>
);

const NODE_TYPES = {
  macroNode: MacroNodeComponent,
  regimenNode: RegimenL2NodeComponent,
  atoNode: AtoNodeComponent,
  serviceNode: ServiceNodeComponent
};

interface PortalFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSegment?: SegmentId;
}

export const PortalFlowModal: React.FC<PortalFlowModalProps> = ({
  isOpen,
  onClose,
  initialSegment = 'contribuyentes'
}) => {
  const [selectedSegment, setSelectedSegment] = useState<SegmentId>(initialSegment);
  const [selectedL2Index, setSelectedL2Index] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSegment) {
      setSelectedSegment(initialSegment);
      setSelectedL2Index(0);
    }
  }, [initialSegment]);

  // Manejo de tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const segData = FLOW_DATA[selectedSegment];

  // Generar Nodos y Conexiones (Edges) para React Flow
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // 1. Nodo Nivel 1 (Macro Grupo)
    const macroId = `macro-${segData.id}`;
    nodes.push({
      id: macroId,
      type: 'macroNode',
      position: { x: 40, y: 180 },
      data: {
        name: segData.name,
        total: segData.total,
        color: segData.color,
        desc: segData.desc
      }
    });

    // 2. Nodos Nivel 2 (Regímenes / Ámbitos)
    segData.l2.forEach((l2Item, idx) => {
      const l2NodeId = `l2-${l2Item.id}`;
      const isSelected = idx === selectedL2Index;
      nodes.push({
        id: l2NodeId,
        type: 'regimenNode',
        position: { x: 360, y: 40 + idx * 135 },
        data: {
          name: l2Item.name,
          count: l2Item.count,
          desc: l2Item.desc,
          isSelected,
          index: idx
        }
      });

      // Edge Nivel 1 -> Nivel 2
      edges.push({
        id: `e-${macroId}-${l2NodeId}`,
        source: macroId,
        target: l2NodeId,
        animated: isSelected,
        style: {
          stroke: isSelected ? segData.color : '#CBD5E1',
          strokeWidth: isSelected ? 2.5 : 1.2
        }
      });
    });

    // 3. Nodos Nivel 3 (Ciclo de Vida ATO)
    ATO_STAGES.forEach((ato, idx) => {
      nodes.push({
        id: ato.id,
        type: 'atoNode',
        position: { x: 680, y: 35 + idx * 80 },
        data: {
          label: ato.label,
          tag: ato.tag,
          color: ato.color
        }
      });

      // Conexión desde el Nivel 2 seleccionado hacia las 5 etapas ATO
      const activeL2Id = `l2-${segData.l2[selectedL2Index].id}`;
      edges.push({
        id: `e-${activeL2Id}-${ato.id}`,
        source: activeL2Id,
        target: ato.id,
        style: {
          stroke: segData.color,
          strokeOpacity: 0.35,
          strokeWidth: 1.5
        }
      });
    });

    // 4. Nodos Nivel 5 (Fichas Destacadas)
    const currentL2 = segData.l2[selectedL2Index];
    currentL2.ejemplos.forEach((ej, idx) => {
      const serviceNodeId = `srv-${idx}`;
      nodes.push({
        id: serviceNodeId,
        type: 'serviceNode',
        position: { x: 970, y: 50 + idx * 95 },
        data: {
          titulo: ej.titulo,
          etapa: ej.etapa,
          tipo: ej.tipo
        }
      });

      // Conectar de la etapa correspondiente a la ficha
      const matchingAto = ATO_STAGES.find(a => a.label === ej.etapa) || ATO_STAGES[0];
      edges.push({
        id: `e-${matchingAto.id}-${serviceNodeId}`,
        source: matchingAto.id,
        target: serviceNodeId,
        animated: true,
        style: {
          stroke: '#94A3B8',
          strokeWidth: 1.2
        }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [segData, selectedL2Index]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sincronizar nodos y edges cuando cambia la selección
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Manejar clic en nodo de Nivel 2
  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (node.type === 'regimenNode' && typeof node.data.index === 'number') {
      setSelectedL2Index(node.data.index);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flow-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-7xl h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      >
        {/* Header del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14649B]/10 text-[#14649B] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="flow-modal-title" className="text-lg font-black text-slate-900 tracking-tight">
                  Diagrama de Flujo del Portal SAT
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                  Powered by React Flow
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Visualización interactiva de nodos conectados: Nivel 1 (Segmento) → Nivel 2 (Ámbitos) → Nivel 3 (Ciclo ATO) → Nivel 5 (Servicios).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Cerrar modal de diagrama de flujo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Control de Segmentos */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Seleccionar Audiencia:</span>
            {(['contribuyentes', 'comercio_exterior', 'profesionales', 'entes_exentos'] as SegmentId[]).map((segId) => {
              const item = FLOW_DATA[segId];
              const isActive = selectedSegment === segId;
              return (
                <button
                  key={segId}
                  onClick={() => {
                    setSelectedSegment(segId);
                    setSelectedL2Index(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    isActive
                      ? 'border-sky-600 bg-sky-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.name} ({item.total})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 text-sky-600" />
            <span>Haz clic en cualquier tarjeta de <strong>Nivel 2</strong> para conectar sus servicios.</span>
          </div>
        </div>

        {/* Canvas de React Flow */}
        <div className="flex-1 w-full h-full relative bg-slate-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={NODE_TYPES}
            fitView
            minZoom={0.3}
            maxZoom={1.5}
            attributionPosition="bottom-right"
          >
            <Background color="#cbd5e1" gap={20} size={1} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'macroNode') return segData.color;
                if (node.type === 'regimenNode') return '#0284c7';
                if (node.type === 'atoNode') return '#8b5cf6';
                return '#94a3b8';
              }}
              className="!border !border-slate-200 !rounded-xl !bg-white/90 !shadow-sm"
            />
            <Panel position="bottom-left" className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-md text-xs space-y-1">
              <span className="font-bold text-slate-700">Guía de Navegación:</span>
              <ul className="text-[11px] text-slate-500 space-y-0.5">
                <li>• Arrastra el lienzo para desplazarte con paneo suave.</li>
                <li>• Usa la rueda del ratón o los controles para hacer zoom.</li>
                <li>• Haz clic en una tarjeta de Nivel 2 para ver su ramificación.</li>
              </ul>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};
