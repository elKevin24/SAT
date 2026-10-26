import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronRight,
  FileCheck2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SolicitarNitPage } from './SolicitarNitPage';
import { GUIDED_ASSISTANTS, type GuidedAssistant } from '../data/guidedFlowsData';
import type { SegmentId } from '../components/UserSegmentCards';

interface GuidedAssistantPageProps {
  assistantId: string;
  onBackToHome: () => void;
  onBackToCatalog: () => void;
  onSelectSegment?: (segId: SegmentId) => void;
}

export const GuidedAssistantPage: React.FC<GuidedAssistantPageProps> = ({
  assistantId,
  onBackToHome,
  onBackToCatalog,
  onSelectSegment,
}) => {
  const assistant: GuidedAssistant | undefined = GUIDED_ASSISTANTS[assistantId];

  // Estado de requisitos marcados
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});
  // Paso actual de la guía
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [assistantId, currentStepIndex]);

  // Página Universal Canónica para Solicitar NIT
  if (assistantId === 'primer-nit') {
    return <SolicitarNitPage onBackToHome={onBackToCatalog} />;
  }

  if (!assistant) {
    return (
      <div className="pt-8 pb-16 bg-white min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-slate-900">Asistente no encontrado</h1>
          <p className="text-sm text-slate-600">El asistente guiado solicitado no está disponible actualmente.</p>
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

  const toggleRequirement = (reqId: string) => {
    setCheckedRequirements((prev) => ({
      ...prev,
      [reqId]: !prev[reqId],
    }));
  };

  const totalReqs = assistant.requisitos.length;
  const completedReqs = assistant.requisitos.filter((r) => checkedRequirements[r.id]).length;
  const allMandatoryCompleted = assistant.requisitos
    .filter((r) => r.obligatorio)
    .every((r) => checkedRequirements[r.id]);

  const currentStep = assistant.pasos[currentStepIndex];
  const totalSteps = assistant.pasos.length;

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
                label: assistant.pilarName,
                onClick: () => onSelectSegment?.(assistant.pilar),
              },
              {
                label: assistant.categoria,
                onClick: onBackToCatalog,
              },
              {
                label: assistant.titulo,
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

        {/* 2. Banner de Encabezado Oficial */}
        <header className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-md space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-sky-300 bg-sky-950/80 border border-sky-700/60 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Asistente Guiado Ciudadano</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
              {assistant.modalidad}
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {assistant.titulo}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl font-medium">
              {assistant.subtitulo}
            </p>
          </div>

          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            {assistant.descripcion}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Tiempo estimado: <strong>{assistant.tiempoEstimado}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Código Oficial: <strong>{assistant.codigoGestion}</strong></span>
            </div>
          </div>
        </header>

        {/* 3. Requisitos Previos e Indicador de Progreso */}
        <section aria-labelledby="requisitos-heading" className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-sky-700" />
              <h2 id="requisitos-heading" className="text-sm font-bold text-slate-900">
                Paso Previo: Verifica tus Requisitos Obligatorios ({completedReqs}/{totalReqs})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-sky-600 h-full transition-all duration-300"
                  style={{ width: `${Math.round((completedReqs / totalReqs) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-700">
                {Math.round((completedReqs / totalReqs) * 100)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assistant.requisitos.map((req) => {
              const isChecked = !!checkedRequirements[req.id];
              return (
                <div
                  key={req.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-sky-50/70 border-sky-300 text-sky-950 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <input
                    id={`req-check-${req.id}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleRequirement(req.id)}
                    className="mt-0.5 w-4 h-4 rounded text-sky-700 focus:ring-sky-600 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor={`req-check-${req.id}`} className="space-y-0.5 text-xs cursor-pointer">
                    <span className="font-bold block leading-snug">
                      {req.label} {req.obligatorio && <span className="text-amber-600 font-extrabold">*</span>}
                    </span>
                    <span className="text-slate-600 block text-[11px] leading-relaxed">
                      {req.description}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          {!allMandatoryCompleted && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Te recomendamos marcar los requisitos obligatorios (*) antes de iniciar la solicitud en el portal.
              </span>
            </div>
          )}
        </section>

        {/* 4. Guía Operativa Paso a Paso (Paso Actual) */}
        <section aria-labelledby="pasos-heading" className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-700" />
              <h2 id="pasos-heading" className="text-sm font-bold text-slate-900">
                Instrucciones Operativas de Ejecución
              </h2>
            </div>

            {/* Pestañas / Indicador de Pasos */}
            <div className="flex items-center gap-1.5">
              {assistant.pasos.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                return (
                  <button
                    key={step.numero}
                    type="button"
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Paso {step.numero}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tarjeta del Paso Actual */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-sky-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                {currentStep.numero}
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Paso {currentStep.numero}: {currentStep.titulo}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {currentStep.subtitulo}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              {currentStep.descripcion}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Acciones a realizar:
              </h4>
              <ul className="space-y-2">
                {currentStep.acciones.map((accion, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{accion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {currentStep.notaVisual && (
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-medium flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-700 shrink-0" />
                <span>{currentStep.notaVisual}</span>
              </div>
            )}
          </div>

          {/* Controles de Navegación entre Pasos */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior paso</span>
            </button>

            {currentStepIndex < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1))}
                className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Siguiente paso</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <a
                href={assistant.urlOficial}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Iniciar gestión en portal SAT</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </section>

        {/* 5. Marco Legal Informativo */}
        <footer className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">Soporte Legal y Normativo:</p>
          <p>{assistant.baseLegal}</p>
        </footer>

      </div>
    </div>
  );
};
