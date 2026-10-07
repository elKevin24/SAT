import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  GraduationCap, 
  CreditCard, 
  FileCheck, 
  Car, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { SegmentId } from './UserSegmentCards';
import { Modal } from './ui/Modal';

interface DirectConsultasModalProps {
  isOpen: boolean;
  onClose: () => void;
  segmentId: SegmentId;
}

export const DirectConsultasModal: React.FC<DirectConsultasModalProps> = ({
  isOpen,
  onClose,
  segmentId
}) => {
  const [activeTool, setActiveTool] = useState<'gestion' | 'titulo' | 'nit' | 'vehiculo'>('gestion');

  // Interactive Form States
  const [gestionQuery, setGestionQuery] = useState('');
  const [gestionResult, setGestionResult] = useState<any>(null);

  const [tituloQuery, setTituloQuery] = useState('');
  const [tituloResult, setTituloResult] = useState<any>(null);

  const [cuiQuery, setCuiQuery] = useState('');
  const [cuiResult, setCuiResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleConsultarGestion = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = gestionQuery.trim();
    if (!clean) return;

    if (clean.toLowerCase().includes('obs') || clean.endsWith('2')) {
      setGestionResult({
        estado: 'Observada',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        mensaje: 'Se requiere adjuntar documento de identificación legible (DPI) para continuar con la activación.'
      });
    } else {
      setGestionResult({
        estado: 'Aprobada / En Trámite',
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        mensaje: 'La solicitud de Agencia Virtual o RTU fue procesada exitosamente. Revisa tu correo registrado para confirmar.'
      });
    }
  };

  const handleConsultarTitulo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tituloQuery.trim();
    if (!clean) return;

    setTituloResult({
      numero: clean.toUpperCase(),
      profesional: 'Profesional Colegiado Activo',
      grado: 'Licenciatura Universitaria / Grado Superior',
      estado: 'Habilitado y Registrado Oficialmente ante SAT',
      timbres: 'Impuesto de Timbres Fiscales cancelado conforme al Art. 5 num. 3 Dto. 37-92'
    });
  };

  const handleConsultarNIT = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cuiQuery.trim();
    if (!clean) return;

    setCuiResult({
      cui: clean,
      nit: `${clean.slice(0, 7)}-${clean.slice(-1)}`,
      estado: 'Activo en RTU Digital',
      regimen: 'Personas Individuales / Sin Obligaciones'
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      ariaLabelledBy="consultas-title"
      maxWidth="max-w-2xl"
      hideHeader
      panelClassName="p-0 overflow-hidden rounded-2xl border border-slate-200 text-slate-800"
    >
        {/* Header */}
        <div className="bg-[#19324B] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#14649B] flex items-center justify-center font-bold text-white shadow-xs">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 id="consultas-title" className="text-base font-bold leading-none">
                Catálogo de Consultas y Verificadores Web
              </h2>
              <span className="text-xs text-slate-300">Verificadores de demostración con enlaces al portal oficial</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar modal de consultas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool selector buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'gestion', label: 'Estado de Solicitud', icon: Clock },
            { id: 'titulo', label: 'Verificar Títulos QR', icon: GraduationCap },
            { id: 'nit', label: 'Consulta CUI / NIT', icon: CreditCard },
            { id: 'vehiculo', label: 'Consultar Vehículos', icon: Car },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTool === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id as any)}
                aria-pressed={isActive}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  isActive 
                    ? 'bg-white text-[#14649B] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tool Content Area */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Aviso de demostración (datos simulados) */}
          <div role="note" className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <strong>Datos de demostración:</strong> estos verificadores ilustran la experiencia del portal oficial y
            no consultan sistemas reales de la SAT. Para resultados oficiales usa el{' '}
            <a
              href="https://portal.sat.gob.gt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              Portal SAT
            </a>
            .
          </div>
          
          {/* Tool 1: Estado de Solicitud / Gestión */}
          {activeTool === 'gestion' && (
            <div className="space-y-4">
              <label htmlFor="consultas-gestion" className="block text-xs text-slate-600">
                Ingresa el número de solicitud o gestión recibido por correo para conocer el avance de tu trámite de Agencia Virtual o RTU:
              </label>
              <form onSubmit={handleConsultarGestion} className="flex gap-2">
                <input
                  id="consultas-gestion"
                  type="text"
                  value={gestionQuery}
                  onChange={(e) => setGestionQuery(e.target.value)}
                  placeholder="Ej. SOL-2026-98124 o número de trámite"
                  className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#14649B]/20 focus:border-[#14649B] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#14649B] text-white text-xs font-bold rounded-xl hover:bg-[#11507C] transition-colors"
                >
                  Consultar
                </button>
              </form>

              {gestionResult && (
                <div className={`p-4 rounded-xl border ${gestionResult.color} space-y-1.5 animate-fadeIn text-xs`}>
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Estado: {gestionResult.estado}
                  </div>
                  <p className="text-slate-700">{gestionResult.mensaje}</p>
                </div>
              )}
            </div>
          )}

          {/* Tool 2: Verificador QR de Títulos Universitarios */}
          {activeTool === 'titulo' && (
            <div className="space-y-4">
              <label htmlFor="consultas-titulo" className="block text-xs text-slate-600">
                Verifica la acreditación oficial del título universitario y el pago del Impuesto de Timbres Fiscales (Decreto 37-92):
              </label>
              <form onSubmit={handleConsultarTitulo} className="flex gap-2">
                <input
                  id="consultas-titulo"
                  type="text"
                  value={tituloQuery}
                  onChange={(e) => setTituloQuery(e.target.value)}
                  placeholder="Ingresa código de sticker SAT o número de título"
                  className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#14649B]/20 focus:border-[#14649B] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D5A0C] text-white text-xs font-bold rounded-xl hover:bg-[#234709] transition-colors"
                >
                  Verificar
                </button>
              </form>

              {tituloResult && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2 animate-fadeIn text-xs text-slate-700">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4" /> {tituloResult.estado}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200">
                    <div>
                      <span className="font-semibold text-slate-500 block">Identificador:</span>
                      <span className="font-mono font-bold text-slate-800">{tituloResult.numero}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 block">Condición:</span>
                      <span className="font-bold text-slate-800">{tituloResult.profesional}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-900 bg-white p-2 rounded-lg border border-emerald-100">
                    {tituloResult.timbres}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tool 3: Consulta CUI / NIT */}
          {activeTool === 'nit' && (
            <div className="space-y-4">
              <label htmlFor="consultas-nit" className="block text-xs text-slate-600">
                Si no recuerdas tu NIT, ingresa tu Código Único de Identificación (CUI de 13 dígitos de tu DPI):
              </label>
              <form onSubmit={handleConsultarNIT} className="flex gap-2">
                <input
                  id="consultas-nit"
                  type="text"
                  maxLength={13}
                  value={cuiQuery}
                  onChange={(e) => setCuiQuery(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ingresa tu CUI (13 dígitos)"
                  className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#14649B]/20 focus:border-[#14649B] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#14649B] text-white text-xs font-bold rounded-xl hover:bg-[#11507C] transition-colors"
                >
                  Buscar NIT
                </button>
              </form>

              {cuiResult && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-2 animate-fadeIn text-xs text-slate-700">
                  <div className="font-bold text-[#14649B] text-sm">
                    NIT Asignado: <span className="font-mono text-base">{cuiResult.nit}</span>
                  </div>
                  <div className="text-slate-600">
                    Estado: <span className="font-semibold text-slate-800">{cuiResult.estado}</span>
                  </div>
                  <a
                    href="https://portal.sat.gob.gt/portal/constancia-rtu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#14649B] hover:underline pt-1"
                  >
                    Descargar constancia de RTU <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Tool 4: Consulta de Vehículos */}
          {activeTool === 'vehiculo' && (
            <div className="space-y-4 text-xs">
              <div className="text-slate-600">
                Herramientas directas del Registro Fiscal de Vehículos:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://portal.sat.gob.gt/portal/consulta-de-vehiculos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#14649B] bg-slate-50 hover:bg-white transition-all flex items-start gap-2.5 group"
                >
                  <Car className="w-5 h-5 text-[#14649B] shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800 group-hover:text-[#14649B]">
                      Impuesto de Circulación
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Consulta valor a pagar y calcomanía electrónica.
                    </div>
                  </div>
                </a>

                <a
                  href="https://portal.sat.gob.gt/portal/verificador-de-distintivos-electronicos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#14649B] bg-slate-50 hover:bg-white transition-all flex items-start gap-2.5 group"
                >
                  <FileCheck className="w-5 h-5 text-[#0284C7] shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800 group-hover:text-[#0284C7]">
                      Distintivos Electrónicos
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Verificación de tarjeta de circulación y título de propiedad.
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
    </Modal>
  );
};
