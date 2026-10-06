import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  Search, 
  BarChart3, 
  ShieldAlert, 
  BookOpen, 
  ChevronRight,
  Calendar,
  Lock
} from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  url: string;
}

const NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'SAT con más acciones de facilitación y mejora continua para el contribuyente',
    date: '10 de marzo 2026',
    category: 'Facilitación',
    url: 'https://portal.sat.gob.gt/portal/noticias/'
  },
  {
    id: 2,
    title: 'Facilitarán reintegración productiva de migrantes retornados al sistema formal',
    date: '08 de marzo 2026',
    category: 'Inclusión Social',
    url: 'https://portal.sat.gob.gt/portal/noticias/'
  },
  {
    id: 3,
    title: 'Guatemala moderniza su sistema aduanero con tecnología no intrusiva y DUCA',
    date: '06 de marzo 2026',
    category: 'Aduanas',
    url: 'https://portal.sat.gob.gt/portal/noticias/'
  },
  {
    id: 4,
    title: 'Coordinación estratégica interinstitucional facilita combate a ilícitos y contrabando',
    date: '01 de marzo 2026',
    category: 'Fiscalización',
    url: 'https://portal.sat.gob.gt/portal/noticias/'
  }
];

const TRANSPARENCY_BUTTONS = [
  {
    title: 'Marco Legal',
    desc: 'Leyes y Decretos tributarios',
    icon: BookOpen,
    url: 'https://portal.sat.gob.gt/portal/leyes-tributarias/'
  },
  {
    title: 'Transparencia',
    desc: 'Rendición de cuentas oficial',
    icon: Search,
    url: 'https://portal.sat.gob.gt/portal/transparencia/'
  },
  {
    title: 'SATData+',
    desc: 'Portal estadístico y cifras',
    icon: BarChart3,
    url: 'https://portal.sat.gob.gt/portal/satdata/'
  },
  {
    title: 'Información Pública',
    desc: 'Decreto 57-2008 de libre acceso',
    icon: FileText,
    url: 'https://portal.sat.gob.gt/portal/informacion-publica/'
  },
  {
    title: 'El Poder Anticorrupción',
    desc: 'Denuncias y ética institucional',
    icon: ShieldAlert,
    url: 'https://portal.sat.gob.gt/portal/anticorrupcion/'
  }
];

export const NewsAndTransparencySection: React.FC = () => {
  return (
    <div className="bg-slate-50 py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 1. Sección Noticias y Anuncios (Slide 13) */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#19324B] tracking-tight">
                Noticias y Anuncios
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Divulgación de avisos oficiales y avances institucionales de la SAT Guatemala.
              </p>
            </div>
            <a
              href="https://portal.sat.gob.gt/portal/noticias/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#14649B] hover:underline flex items-center gap-1"
            >
              <span>Ver todo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NEWS.map((news) => (
              <a
                key={news.id}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#14649B] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="font-semibold text-[#14649B] bg-blue-50 px-2 py-0.5 rounded">
                      {news.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {news.date}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#14649B] transition-colors line-clamp-3 leading-snug">
                    {news.title}
                  </h4>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#14649B]">
                  <span>Leer nota completa</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 2. Sección Transparencia y Rendición de Cuentas (Slide 13) */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-extrabold text-[#19324B] tracking-tight">
              Transparencia y Rendición de Cuentas
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Alineado al marco de gobierno abierto, acceso libre a la información y control institucional.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TRANSPARENCY_BUTTONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-[#19324B] hover:bg-[#14649B] text-white rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 group-hover:bg-white group-hover:text-[#14649B] flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-300 line-clamp-1">
                      {item.desc}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
