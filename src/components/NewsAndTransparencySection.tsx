import React from 'react';

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
    url: 'https://portal.sat.gob.gt/portal/leyes-tributarias/'
  },
  {
    title: 'Transparencia',
    desc: 'Rendición de cuentas oficial',
    url: 'https://portal.sat.gob.gt/portal/transparencia/'
  },
  {
    title: 'SATData+',
    desc: 'Portal estadístico y cifras',
    url: 'https://portal.sat.gob.gt/portal/satdata/'
  },
  {
    title: 'Información Pública',
    desc: 'Decreto 57-2008 de libre acceso',
    url: 'https://portal.sat.gob.gt/portal/informacion-publica/'
  },
  {
    title: 'El Poder Anticorrupción',
    desc: 'Denuncias y ética institucional',
    url: 'https://portal.sat.gob.gt/portal/anticorrupcion/'
  }
];

export const NewsAndTransparencySection: React.FC = () => {
  return (
    <div className="bg-slate-50 py-10 border-b border-[#DCDCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 1. Sección Noticias y Anuncios */}
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
              className="text-xs font-bold text-[#14649B] hover:underline"
            >
              Ver todo →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NEWS.map((news) => (
              <a
                key={news.id}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 bg-white rounded-[16px] border border-[#DCDCDC] hover:border-[#14649B] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="font-bold text-[#14649B] bg-blue-50 px-2 py-0.5 rounded">
                      {news.category}
                    </span>
                    <span>{news.date}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#14649B] transition-colors line-clamp-3 leading-snug">
                    {news.title}
                  </h4>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#14649B]">
                  <span>Leer nota completa</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 2. Sección Transparencia y Rendición de Cuentas */}
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
            {TRANSPARENCY_BUTTONS.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white hover:bg-[#14649B] border border-[#DCDCDC] hover:border-[#14649B] text-[#19324B] hover:text-white rounded-[14px] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-bold leading-tight mb-1">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 group-hover:text-white/80 line-clamp-2 leading-tight">
                    {item.desc}
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 group-hover:border-white/20 text-[10px] font-bold text-[#14649B] group-hover:text-white flex items-center justify-between">
                  <span>Portal</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
