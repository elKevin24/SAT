import React from 'react';
import { 
  Phone, 
  ArrowUp, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Palette
} from 'lucide-react';

interface InstitutionalFooterProps {
  onOpenStyleGuide?: () => void;
}

export const InstitutionalFooter: React.FC<InstitutionalFooterProps> = ({ onOpenStyleGuide }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#19324B] text-white pt-10 pb-6 border-t-4 border-[#14649B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Columnas Oficiales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-700/60 text-xs">
          
          {/* Columna 1: Acerca de SAT */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#19AFE1] mb-3">
              Acerca de SAT
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="https://portal.sat.gob.gt/portal/que-es-sat/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">¿Qué es SAT?</a></li>
              <li><a href="https://portal.sat.gob.gt/portal/altos-funcionarios/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Altos funcionarios</a></li>
              <li><a href="https://portal.sat.gob.gt/portal/gestion-institucional/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Gestión Institucional</a></li>
              <li><a href="https://portal.sat.gob.gt/portal/bolsa-de-empleo/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bolsa de empleo</a></li>
            </ul>

            {/* Redes Sociales Oficiales */}
            <div className="mt-4">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">Canales oficiales:</span>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Facebook', url: 'https://facebook.com/SATGuatemala', label: 'f' },
                  { name: 'X', url: 'https://x.com/SATGT', label: '𝕏' },
                  { name: 'Instagram', url: 'https://instagram.com/satguatemala', label: '📸' },
                  { name: 'TikTok', url: 'https://tiktok.com/@satgt', label: '🎵' },
                  { name: 'LinkedIn', url: 'https://linkedin.com/company/sat-guatemala', label: 'in' },
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#14649B] text-white flex items-center justify-center font-bold text-xs transition-colors"
                    title={s.name}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Columna 2: Ubicaciones y Horarios */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#19AFE1] mb-3">
              Ubicaciones y Horarios
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="https://portal.sat.gob.gt/portal/ubicacion-agencias/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#19AFE1]" /> Agencias y Oficinas Tributarias
                </a>
              </li>
              <li>
                <a href="https://portal.sat.gob.gt/portal/aduanas-ubicaciones/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#19AFE1]" /> Aduanas de la República
                </a>
              </li>
              <li>
                <a href="https://portal.sat.gob.gt/portal/oficinas-centrales/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#19AFE1]" /> Oficinas Centrales
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Servicio no conforme & Denuncias */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#19AFE1] mb-3">
              Atención de Quejas
            </h4>
            <ul className="space-y-2 text-slate-300 mb-3">
              <li><a href="https://portal.sat.gob.gt/portal/servicio-no-conforme/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Registrar queja o servicio no conforme</a></li>
              <li><a href="https://portal.sat.gob.gt/portal/consultar-estado-queja/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Consultar estado de queja</a></li>
            </ul>

            <h5 className="text-xs font-bold text-[#FFB806] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Portal de Denuncias
            </h5>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li><a href="https://portal.sat.gob.gt/portal/denuncias-tributarias/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Denuncias Tributarias</a></li>
              <li><a href="https://portal.sat.gob.gt/portal/denuncias-corrupcion/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Denuncias de Corrupción</a></li>
              <li><a href="https://portal.sat.gob.gt/portal/denuncias-comercio-ilicito/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Denuncias de Contrabando</a></li>
            </ul>
          </div>

          {/* Columna 4: Consultas y Contact Center 1550 */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#19AFE1] mb-3">
              Consultas y Contacto
            </h4>
            <ul className="space-y-2 text-slate-300 mb-3">
              <li><a href="https://portal.sat.gob.gt/portal/preguntas-frecuentes/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
              <li><a href="https://portal.sat.gob.gt/portal/consultas-legales/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Consultas Legales</a></li>
              <li><a href="https://portal.sat.gob.gt/portal/informacion-publica/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Información Pública (Decreto 57-2008)</a></li>
            </ul>

            {/* Tarjeta de Contact Center 1550 */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#14649B] flex items-center justify-center text-white">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Contact Center SAT</div>
                  <div className="text-sm font-extrabold text-[#19AFE1] tracking-wider">1550</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300 pt-1 border-t border-white/10">
                <a href="https://wa.me/50223297070" target="_blank" rel="noopener noreferrer" className="hover:text-[#8CC63F] font-bold">
                  💬 WhatsApp
                </a>
                <span>·</span>
                <span className="text-slate-400">Lunes a Viernes 08:00 a 16:30</span>
              </div>
            </div>
          </div>

        </div>

        {/* Barra Inferior con enlace al Design System y Volver Arriba */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Superintendencia de Administración Tributaria. Todos los derechos reservados.
          </div>
          
          <div className="flex items-center gap-4">
            {onOpenStyleGuide && (
              <button
                onClick={onOpenStyleGuide}
                className="hover:text-white text-[#19AFE1] flex items-center gap-1 font-semibold transition-colors"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Guía de Estilo (Design System)</span>
              </button>
            )}

            <a href="https://portal.sat.gob.gt/portal/mapa-del-sitio/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200">
              Mapa de sitio
            </a>
            
            {/* Botón Volver Arriba en Naranja Normativo #F37521 */}
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-[#F37521] hover:bg-[#d96316] text-[#19324B] flex items-center justify-center shadow-md transition-transform hover:-translate-y-1 active:scale-90 font-bold"
              title="Volver al inicio de la página"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-4 h-4 text-[#19324B]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
