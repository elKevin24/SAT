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
  Clock,
  ShieldCheck
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
}) => {
  const [activeTool, setActiveTool] = useState<'gestion' | 'titulo' | 'nit' | 'vehiculo'>('gestion');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Interactive Form States
  const [gestionQuery, setGestionQuery] = useState('');
  const [gestionError, setGestionError] = useState<string | null>(null);
  const [gestionResult, setGestionResult] = useState<{ estado: string; color: string; mensaje: string } | null>(null);

  const [tituloQuery, setTituloQuery] = useState('');
  const [tituloError, setTituloError] = useState<string | null>(null);
  const [tituloResult, setTituloResult] = useState<{
    numero: string;
    profesional: string;
    grado: string;
    estado: string;
    timbres: string;
  } | null>(null);

  const [cuiQuery, setCuiQuery] = useState('');
  const [cuiError, setCuiError] = useState<string | null>(null);
  const [cuiResult, setCuiResult] = useState<{
    cui: string;
    nit: string;
    estado: string;
    regimen: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleConsultarGestion = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = gestionQuery.trim();
    if (!clean || clean.length < 3) {
      setGestionError('Ingresa un número de solicitud válido (mínimo 3 caracteres, ej. SOL-2026-98124).');
      setGestionResult(null);
      return;
    }

    setGestionError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (clean.toLowerCase().includes('obs') || clean.endsWith('2')) {
        setGestionResult({
          estado: 'Observada',
          color: 'text-amber-800 bg-amber-50 border-amber-300',
          mensaje: 'Se requiere adjuntar documento de identificación legible (DPI) para continuar con la activación.'
        });
      } else {
        setGestionResult({
          estado: 'Aprobada / En Gestión',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
          mensaje: 'La solicitud de Agencia Virtual o RTU fue procesada exitosamente. Revisa tu correo registrado para confirmar.'
        });
      }
    }, 150);
  };

  const handleConsultarTitulo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tituloQuery.trim();
    if (!clean || clean.length < 3) {
      setTituloError('Ingresa el código de sticker SAT o número de registro del título para verificar.');
      setTituloResult(null);
      return;
    }

    setTituloError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTituloResult({
        numero: clean.toUpperCase(),
        profesional: 'Profesional Colegiado Activo',
        grado: 'Licenciatura Universitaria / Grado Superior',
        estado: 'Habilitado y Registrado Oficialmente ante SAT',
        timbres: 'Impuesto de Timbres Fiscales cancelado conforme al Art. 5 num. 3 Dto. 37-92'
      });
    }, 150);
  };

  const handleConsultarNIT = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cuiQuery.trim();
    if (clean.length !== 13) {
      setCuiError('El Código Único de Identificación (CUI) debe contener exactamente 13 dígitos numéricos.');
      setCuiResult(null);
      return;
    }

    setCuiError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCuiResult({
        cui: clean,
        nit: `${clean.slice(0, 7)}-${clean.slice(-1)}`,
        estado: 'Activo en Registro Tributario Unificado (RTU)',
        regimen: 'Personas Individuales / Sin Obligaciones'
      });
    }, 150);
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
              onClick={() => setActiveTool(tab.id as 'gestion' | 'titulo' | 'nit' | 'vehiculo')}
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
      <div className="p-6 max-h-[70vh] overflow-y-auto" aria-busy={isLoading}>
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
              Ingresa el número de solicitud o gestión recibido por correo para conocer el avance de tu gestión de Agencia Virtual o RTU:
            </label>
            <form onSubmit={handleConsultarGestion} className="flex gap-2" noValidate>
              <input
                id="consultas-gestion"
                type="text"
                enterKeyHint="search"
                value={gestionQuery}
                onChange={(e) => {
                  setGestionQuery(e.target.value);
                  if (gestionError) setGestionError(null);
                }}
                aria-invalid={Boolean(gestionError)}
                aria-describedby={gestionError ? 'consultas-gestion-error' : undefined}
                placeholder="Ej. SOL-2026-98124 o número de gestión"
                className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#14649B]/20 focus:border-[#14649B] outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#14649B] text-white text-xs font-bold rounded-xl hover:bg-[#11507C] disabled:opacity-60 transition-colors"
              >
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </form>

            {gestionError && (
              <div
                id="consultas-gestion-error"
                role="alert"
                className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-900 text-xs flex items-center justify-between gap-2 animate-fadeIn"
              >
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                  {gestionError}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setGestionQuery('SOL-2026-98124');
                    setGestionError(null);
                  }}
                  className="font-bold underline shrink-0"
                >
                  Usar ejemplo
                </button>
              </div>
            )}

            {gestionResult && (
              <div role="status" className={`p-4 rounded-xl border ${gestionResult.color} space-y-1.5 animate-fadeIn text-xs`}>
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
            <form onSubmit={handleConsultarTitulo} className="flex gap-2" noValidate>
              <input
                id="consultas-titulo"
                type="text"
                enterKeyHint="search"
                value={tituloQuery}
                onChange={(e) => {
                  setTituloQuery(e.target.value);
                  if (tituloError) setTituloError(null);
                }}
                aria-invalid={Boolean(tituloError)}
                aria-describedby={tituloError ? 'consultas-titulo-error' : undefined}
                placeholder="Ingresa código de sticker SAT o número de título"
                className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#14649B]/20 focus:border-[#14649B] outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#2D5A0C] text-white text-xs font-bold rounded-xl hover:bg-[#234709] disabled:opacity-60 transition-colors"
              >
                {isLoading ? 'Verificando...' : 'Verificar'}
              </button>
            </form>

            {tituloError && (
              <div
                id="consultas-titulo-error"
                role="alert"
                className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-900 text-xs flex items-center justify-between gap-2 animate-fadeIn"
              >
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                  {tituloError}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTituloQuery('SAT-TIT-2026');
                    setTituloError(null);
                  }}
                  className="font-bold underline shrink-0"
                >
                  Usar ejemplo
                </button>
              </div>
            )}

            {tituloResult && (
              <div role="status" className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2 animate-fadeIn text-xs text-slate-700">
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
                <div className="text-xs text-emerald-900 bg-white p-2 rounded-lg border border-emerald-100">
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
            <form onSubmit={handleConsultarNIT} className="flex gap-2" noValidate>
              <input
                id="consultas-nit"
                type="text"
                inputMode="numeric"
                enterKeyHint="search"
                maxLength={13}
                value={cuiQuery}
                onChange={(e) => {
                  setCuiQuery(e.target.value.replace(/\D/g, ''));
                  if (cuiError) setCuiError(null);
                }}
                aria-invalid={Boolean(cuiError)}
                aria-describedby={cuiError ? 'consultas-nit-error' : undefined}
                placeholder="Ingresa tu CUI (13 dígitos)"
                className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#14649B]/20 focus:border-[#14649B] outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#14649B] text-white text-xs font-bold rounded-xl hover:bg-[#11507C] disabled:opacity-60 transition-colors"
              >
                {isLoading ? 'Buscando...' : 'Buscar NIT'}
              </button>
            </form>

            {cuiError && (
              <div
                id="consultas-nit-error"
                role="alert"
                className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-900 text-xs flex items-center justify-between gap-2 animate-fadeIn"
              >
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                  {cuiError}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCuiQuery('2548796310101');
                    setCuiError(null);
                  }}
                  className="font-bold underline shrink-0"
                >
                  Usar ejemplo
                </button>
              </div>
            )}

            {cuiResult && (
              <div role="status" className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-2 animate-fadeIn text-xs text-slate-700">
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
                  <div className="text-slate-500 text-xs mt-0.5">
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
                  <div className="text-slate-500 text-xs mt-0.5">
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
