import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Clock,
  ShieldCheck,
  Calendar,
  FileText,
  Building,
  UserCheck,
  ChevronRight,
  Info,
  Sparkles,
  Compass,
  Phone
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SolicitarNitPage } from './SolicitarNitPage';
import type { ProcesoGuiado, ProcesoPaso } from '../data/schema';
import type { SegmentId } from '../components/UserSegmentCards';
import rawProcesos from '../data/allProcesos.json';

interface ProcessJourneyPageProps {
  procesoNo: number;
  onBackToHome: () => void;
  onBackToCatalog: () => void;
  onSelectSegment?: (segId: SegmentId) => void;
}

export const ProcessJourneyPage: React.FC<ProcessJourneyPageProps> = ({
  procesoNo,
  onBackToHome,
  onBackToCatalog,
  onSelectSegment,
}) => {
  const procesos = rawProcesos as ProcesoGuiado[];
  const proceso = procesos.find((p) => p.no === procesoNo) || procesos[0];

  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeStageIndex, setActiveStageIndex] = useState<number>(1); // 1: Requisitos, 2: Solicitar Gestión, 3: Solicitar Cita

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [procesoNo, activeStageIndex]);

  // Página Universal Canónica para Solicitar NIT (Proceso 1)
  if (procesoNo === 1) {
    return <SolicitarNitPage onBackToHome={onBackToHome} />;
  }

  if (!proceso) {
    return (
      <div className="pt-8 pb-16 bg-white min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-slate-900">Proceso no encontrado</h1>
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-700 text-white rounded-xl text-xs font-bold hover:bg-sky-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </button>
        </div>
      </div>
    );
  }

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const pasos = proceso.pasos ?? [];
  const totalPasosCount = pasos.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / Math.max(1, totalPasosCount)) * 100);

  // Clasificación canónica de pasos en las 3 fases universales
  const requisitosPasos = pasos.filter(
    (p, idx) =>
      idx === 0 ||
      p.accion.toLowerCase().includes('requisito') ||
      p.accion.toLowerCase().includes('informa') ||
      p.accion.toLowerCase().includes('prepara') ||
      p.accion.toLowerCase().includes('conoce') ||
      (p.pagina || '').toLowerCase().includes('requisito')
  );

  const gestionPasos = pasos.filter(
    (p, idx) =>
      !requisitosPasos.includes(p) &&
      (p.accion.toLowerCase().includes('solicita') ||
        p.accion.toLowerCase().includes('inscribe') ||
        p.accion.toLowerCase().includes('activa') ||
        p.accion.toLowerCase().includes('declara') ||
        p.accion.toLowerCase().includes('factura') ||
        (p.pagina || '').toLowerCase().includes('solicitud') ||
        (p.pagina || '').toLowerCase().includes('agencia') ||
        idx < pasos.length - 1)
  );

  const citaPasos = pasos.filter(
    (p) =>
      (!requisitosPasos.includes(p) && !gestionPasos.includes(p)) ||
      p.accion.toLowerCase().includes('cita') ||
      (p.pagina || '').toLowerCase().includes('cita') ||
      (p.pagina || '').toLowerCase().includes('presencial')
  );

  return (
    <div className="pt-2.5 sm:pt-3.5 pb-12 bg-slate-50/50 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 1. Miga de pan y botón de retorno */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <Breadcrumbs
            includeHome
            onHomeClick={onBackToHome}
            items={[
              {
                label: proceso.audiencia || 'Contribuyentes',
                onClick: () => onSelectSegment?.('contribuyentes'),
              },
              {
                label: `Proceso ${proceso.no}: ${proceso.nombre}`,
                isCurrent: true,
              },
            ]}
          />

          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors self-start sm:self-auto cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al catálogo</span>
          </button>
        </div>

        {/* 2. Banner Oficial del Proceso Guiado */}
        <header className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-md space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-sky-300 bg-sky-950/80 border border-sky-700/60 px-3 py-1 rounded-full">
              <Compass className="w-3 h-3 text-sky-400" />
              <span>Proceso Oficial SAT</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
              Etapa: {proceso.etapa || 'Iniciar'}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-full">
              3 Pasos Canónicos
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Proceso {proceso.no}: {proceso.nombre}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl font-medium">
              Dirigido a: <strong>{proceso.paraQuien || 'Ciudadanos y Contribuyentes'}</strong>
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Total de acciones sugeridas: <strong>{totalPasosCount} ítems</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Avance de la guía: <strong>{progressPercent}% completado</strong></span>
            </div>
          </div>
        </header>

        {/* 3. Las 3 Etapas Maestras Canónicas */}
        <section aria-labelledby="etapas-maestras" className="space-y-4">
          <h2 id="etapas-maestras" className="sr-only">Las 3 Etapas del Proceso</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Etapa 1: Requisitos */}
            <button
              type="button"
              onClick={() => setActiveStageIndex(1)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                activeStageIndex === 1
                  ? 'bg-sky-700 text-white border-sky-800 shadow-md ring-2 ring-sky-400'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                activeStageIndex === 1 ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-700'
              }`}>
                1
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold block opacity-80">
                  Etapa 1
                </span>
                <span className="font-bold text-xs sm:text-sm block">
                  Requisitos y Documentación
                </span>
                <span className={`text-[11px] block ${activeStageIndex === 1 ? 'text-sky-100' : 'text-slate-500'}`}>
                  Documentos y condiciones previas
                </span>
              </div>
            </button>

            {/* Etapa 2: Solicitar Gestión */}
            <button
              type="button"
              onClick={() => setActiveStageIndex(2)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                activeStageIndex === 2
                  ? 'bg-sky-700 text-white border-sky-800 shadow-md ring-2 ring-sky-400'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                activeStageIndex === 2 ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-700'
              }`}>
                2
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold block opacity-80">
                  Etapa 2
                </span>
                <span className="font-bold text-xs sm:text-sm block">
                  Solicitar Gestión en Línea
                </span>
                <span className={`text-[11px] block ${activeStageIndex === 2 ? 'text-sky-100' : 'text-slate-500'}`}>
                  Llenado de formulario digital
                </span>
              </div>
            </button>

            {/* Etapa 3: Solicitar Cita */}
            <button
              type="button"
              onClick={() => setActiveStageIndex(3)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                activeStageIndex === 3
                  ? 'bg-sky-700 text-white border-sky-800 shadow-md ring-2 ring-sky-400'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                activeStageIndex === 3 ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-700'
              }`}>
                3
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold block opacity-80">
                  Etapa 3
                </span>
                <span className="font-bold text-xs sm:text-sm block">
                  Solicitar Cita / Confirmación
                </span>
                <span className={`text-[11px] block ${activeStageIndex === 3 ? 'text-sky-100' : 'text-slate-500'}`}>
                  Cita presencial o recepción final
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* 4. Detalle de la Etapa Seleccionada */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-6">

          {/* DETALLE ETAPA 1: REQUISITOS */}
          {activeStageIndex === 1 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-700" />
                    <span>Paso 1: Revisa y Reúne los Requisitos Previos</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verifica que cuentas con toda la documentación oficial antes de ingresar al sistema.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(requisitosPasos.length > 0 ? requisitosPasos : pasos.slice(0, 2)).map((paso, idx) => {
                  const isDone = !!completedSteps[paso.numero];
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleStep(paso.numero)}
                          className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isDone ? '✓' : paso.numero}
                        </button>
                        <div className="space-y-1 flex-1">
                          <span className="text-xs font-bold text-slate-900 block">
                            {paso.accion} — {paso.pagina}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Ubicación oficial: {paso.ubicacion}
                          </span>
                          {paso.url && (
                            <a
                              href={paso.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline pt-1"
                            >
                              <span>Ver guía oficial de requisitos</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStageIndex(2)}
                  className="px-5 py-2 bg-sky-700 text-white font-bold text-xs rounded-xl hover:bg-sky-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continuar a Paso 2: Solicitar Gestión</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* DETALLE ETAPA 2: SOLICITAR GESTIÓN */}
          {activeStageIndex === 2 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-700" />
                    <span>Paso 2: Inicia y Completa tu Solicitud en Línea</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ingresa tus datos en la plataforma digital oficial de la SAT.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(gestionPasos.length > 0 ? gestionPasos : pasos.slice(1, -1)).map((paso, idx) => {
                  const isDone = !!completedSteps[paso.numero];
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleStep(paso.numero)}
                          className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isDone ? '✓' : paso.numero}
                        </button>
                        <div className="space-y-1 flex-1">
                          <span className="text-xs font-bold text-slate-900 block">
                            {paso.accion} — {paso.pagina}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Módulo: {paso.ubicacion}
                          </span>
                          {paso.url && (
                            <a
                              href={paso.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline pt-1"
                            >
                              <span>Ingresar al sistema en línea</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStageIndex(1)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Regresar a Requisitos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStageIndex(3)}
                  className="px-5 py-2 bg-sky-700 text-white font-bold text-xs rounded-xl hover:bg-sky-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continuar a Paso 3: Solicitar Cita</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* DETALLE ETAPA 3: SOLICITAR CITA / CONFIRMACIÓN */}
          {activeStageIndex === 3 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-700" />
                    <span>Paso 3: Solicita tu Cita Previa o Descarga la Resolución</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Programa tu atención en agencia presencial si lo requiere, o finaliza la descarga digital.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Calendar className="w-4 h-4 text-sky-700" />
                  <span>Sistema de Cita Previa Controlada SAT:</span>
                </div>
                <p className="leading-relaxed">
                  Si tu trámite requiere entrega física de documentos, autenticación de firmas o enrolamiento presencial, programa tu cita antes de acudir a la agencia tributaria.
                </p>
                <div className="pt-1">
                  <a
                    href="https://portal.sat.gob.gt/portal/cita-previa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-700 text-white font-bold rounded-xl text-xs hover:bg-sky-800 transition-colors shadow-2xs"
                  >
                    <span>Programar Cita Previa en Línea</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {(citaPasos.length > 0 ? citaPasos : pasos.slice(-1)).map((paso, idx) => {
                  const isDone = !!completedSteps[paso.numero];
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleStep(paso.numero)}
                          className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isDone ? '✓' : paso.numero}
                        </button>
                        <div className="space-y-1 flex-1">
                          <span className="text-xs font-bold text-slate-900 block">
                            {paso.accion} — {paso.pagina}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Ubicación: {paso.ubicacion}
                          </span>
                          {paso.url && (
                            <a
                              href={paso.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline pt-1"
                            >
                              <span>Ir al portal de cita o confirmación</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setActiveStageIndex(2)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Regresar a Paso 2: Solicitar Gestión
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 5. Canales de Asistencia */}
        <footer className="p-4 rounded-2xl border border-slate-200 bg-white text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-sky-700 shrink-0" />
            <span>¿Tienes dudas con este proceso? Llama al <strong>Call Center 1550</strong> de lunes a viernes de 8:00 a 16:30 hrs.</span>
          </div>
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs font-bold text-sky-700 hover:underline shrink-0"
          >
            Volver a la página principal
          </button>
        </footer>

      </div>
    </div>
  );
};
