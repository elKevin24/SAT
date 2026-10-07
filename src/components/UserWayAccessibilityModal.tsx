import React from 'react';
import { X, Eye, Type, Contrast, ZoomIn, ZoomOut, Pause, Volume2, HelpCircle, RotateCcw, Check } from 'lucide-react';
import { Modal } from './ui/Modal';

interface AccessibilitySettings {
  contrastMode: 'normal' | 'high' | 'dark' | 'inverted';
  fontSizeStep: number; // -2 to +4
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  highlightLinks: boolean;
  readingGuide: boolean;
  textSpacing: boolean;
  cursorBig: boolean;
}

interface UserWayAccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  onReset: () => void;
}

export const UserWayAccessibilityModal: React.FC<UserWayAccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onReset,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      ariaLabelledBy="accessibility-title"
      maxWidth="max-w-lg"
      hideHeader
      panelClassName="p-0 overflow-hidden rounded-2xl border border-slate-200 text-slate-800"
    >
        {/* Header */}
        <div className="bg-[#14649B] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
              ♿
            </div>
            <div>
              <h2 id="accessibility-title" className="text-lg font-bold leading-none">Menú de Accesibilidad</h2>
              <span className="text-xs text-blue-100">Herramientas de inclusión y usabilidad (SAT GT)</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar menú de accesibilidad"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-sm">
          
          {/* Contrast Mode */}
          <div>
            <p className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
              <Contrast className="w-4 h-4 text-[#14649B]" /> Contraste y Colores
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'normal', label: 'Estándar' },
                { id: 'high', label: 'Alto Contraste' },
                { id: 'dark', label: 'Modo Oscuro' },
                { id: 'inverted', label: 'Invertir' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onUpdateSettings({ contrastMode: c.id as any })}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    settings.contrastMode === c.id
                      ? 'bg-[#14649B] text-white border-[#14649B] shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <p className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
              <Type className="w-4 h-4 text-[#14649B]" /> Tamaño de Fuente (Ajuste Rápido)
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateSettings({ fontSizeStep: Math.max(-2, settings.fontSizeStep - 1) })}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1 font-medium text-slate-700"
                aria-label="Reducir tamaño del texto"
              >
                <ZoomOut className="w-4 h-4" /> Reducir
              </button>
              <div className="px-3 py-1 font-mono text-sm font-bold bg-slate-100 rounded text-slate-700">
                {settings.fontSizeStep > 0 ? `+${settings.fontSizeStep}` : settings.fontSizeStep}
              </div>
              <button
                onClick={() => onUpdateSettings({ fontSizeStep: Math.min(4, settings.fontSizeStep + 1) })}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1 font-medium text-slate-700"
                aria-label="Aumentar tamaño del texto"
              >
                <ZoomIn className="w-4 h-4" /> Aumentar
              </button>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="font-semibold text-slate-700 block mb-2">Perfiles y Opciones Específicas</p>
            
            <button
              onClick={() => onUpdateSettings({ dyslexiaFont: !settings.dyslexiaFont })}
              className={`w-full py-2.5 px-3 rounded-lg border flex items-center justify-between transition-colors ${
                settings.dyslexiaFont ? 'border-[#14649B] bg-blue-50/50 text-[#14649B]' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium">Fuente Apta para Dislexia (OpenDyslexic)</span>
              {settings.dyslexiaFont && <Check className="w-4 h-4 text-[#14649B]" />}
            </button>

            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`w-full py-2.5 px-3 rounded-lg border flex items-center justify-between transition-colors ${
                settings.reducedMotion ? 'border-[#14649B] bg-blue-50/50 text-[#14649B]' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium">Detener / Pausar Animaciones (Sensibilidad)</span>
              {settings.reducedMotion && <Check className="w-4 h-4 text-[#14649B]" />}
            </button>

            <button
              onClick={() => onUpdateSettings({ highlightLinks: !settings.highlightLinks })}
              className={`w-full py-2.5 px-3 rounded-lg border flex items-center justify-between transition-colors ${
                settings.highlightLinks ? 'border-[#14649B] bg-blue-50/50 text-[#14649B]' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium">Resaltar Todos los Enlaces y Botones</span>
              {settings.highlightLinks && <Check className="w-4 h-4 text-[#14649B]" />}
            </button>

            <button
              onClick={() => onUpdateSettings({ textSpacing: !settings.textSpacing })}
              className={`w-full py-2.5 px-3 rounded-lg border flex items-center justify-between transition-colors ${
                settings.textSpacing ? 'border-[#14649B] bg-blue-50/50 text-[#14649B]' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium">Espaciado de Texto Amplio (TDAH / Legibilidad)</span>
              {settings.textSpacing && <Check className="w-4 h-4 text-[#14649B]" />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onReset}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restablecer ajustes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#14649B] text-white rounded-lg text-xs font-bold hover:bg-[#11507C] transition-colors"
          >
            Guardar y Cerrar
          </button>
        </div>
    </Modal>
  );
};
