import React from 'react';
import { Newspaper, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  url: string;
}

const NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'SAT con más acciones de facilitación y mejora continua para el contribuyente',
    category: 'Facilitación',
    date: '2026',
    url: 'https://portal.sat.gob.gt/portal/noticias/'
  },
  {
    id: 2,
    title: 'Facilitarán reintegración productiva de migrantes retornados al sistema formal',
    category: 'Inclusión Social',
    date: '2026',
    url: 'https://portal.sat.gob.gt/portal/noticias/'
  },
  {
    id: 3,
    title: 'Guatemala moderniza su sistema aduanero con tecnología no intrusiva y DUCA',
    category: 'Aduanas',
    date: '2026',
    url: 'https://portal.sat.gob.gt/portal/noticias/'
  },
  {
    id: 4,
    title: 'Coordinación estratégica interinstitucional facilita combate a ilícitos y contrabando',
    category: 'Fiscalización',
    date: '2026',
    url: 'https://portal.sat.gob.gt/portal/noticias/'
  }
];

const TRANSPARENCY_BUTTONS = [
  {
    title: 'Marco Legal',
    desc: 'Leyes, decretos y acuerdos gubernativos en materia tributaria.',
    url: 'https://portal.sat.gob.gt/portal/leyes-tributarias/'
  },
  {
    title: 'Transparencia',
    desc: 'Informes de rendición de cuentas y ejecución presupuestaria.',
    url: 'https://portal.sat.gob.gt/portal/transparencia/'
  },
  {
    title: 'SATData+',
    desc: 'Estadísticas del comercio exterior y recaudación en tiempo real.',
    url: 'https://portal.sat.gob.gt/portal/satdata/'
  },
  {
    title: 'Información Pública',
    desc: 'Solicitudes y acceso a la información según Decreto 57-2008.',
    url: 'https://portal.sat.gob.gt/portal/informacion-publica/'
  },
  {
    title: 'El Poder Anticorrupción',
    desc: 'Canal de denuncia confidencial y código de ética institucional.',
    url: 'https://portal.sat.gob.gt/portal/anticorrupcion/'
  }
];

export const NewsAndTransparencySection: React.FC = () => {
  return (
    <div className="bg-sat-fondo-tenue py-8 sm:py-10 border-b border-sat-gris">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* 1. Sección Noticias y Anuncios */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Newspaper className="w-4 h-4 text-sat-azul" />
                <span className="text-[11px] font-black uppercase tracking-wider text-sat-azul">
                  Comunicación Oficial
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-sat-azul-oscuro tracking-tight">
                Noticias y Anuncios Institucionales
              </h3>
              <p className="text-xs text-sat-texto-suave mt-0.5">
                Divulgación de avisos oficiales y avances de la SAT Guatemala.
              </p>
            </div>
            <a
              href="https://portal.sat.gob.gt/portal/noticias/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-sat-azul hover:text-sat-azul-oscuro hover:underline flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {NEWS.map((news) => (
              <a
                key={news.id}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 sm:p-4.5 bg-white rounded-lg border border-sat-gris hover:border-sat-azul hover:shadow-[0_12px_24px_rgba(20,100,155,0.14)] hover:-translate-y-0.5 active:bg-sat-fondo-tenue transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sat-azul bg-sat-azul/10 px-2 py-0.5 rounded">
                      {news.category}
                    </span>
                    <span className="text-[10px] font-mono text-sat-texto-tenue">
                      {news.date}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-sat-azul-oscuro group-hover:text-sat-azul transition-colors line-clamp-3 leading-snug">
                    {news.title}
                  </h4>
                </div>

                <div className="pt-3 mt-3 border-t border-sat-gris/50 flex items-center justify-between text-xs font-bold text-sat-azul group-hover:text-sat-azul-oscuro">
                  <span>Leer nota oficial</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 2. Sección Transparencia y Rendición de Cuentas */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-sat-azul" />
              <span className="text-[11px] font-black uppercase tracking-wider text-sat-azul">
                Gobierno Abierto
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-sat-azul-oscuro tracking-tight">
              Transparencia y Rendición de Cuentas
            </h3>
            <p className="text-xs text-sat-texto-suave mt-0.5">
              Acceso público a la información, auditoría ciudadana y canal anticorrupción.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {TRANSPARENCY_BUTTONS.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 sm:p-4 bg-white hover:bg-sat-azul hover:text-white border border-sat-gris hover:border-sat-azul text-sat-azul-oscuro rounded-lg shadow-xs hover:shadow-[0_12px_24px_rgba(20,100,155,0.18)] hover:-translate-y-0.5 active:bg-sat-azul-oscuro transition-all flex flex-col justify-between group cursor-pointer min-h-[110px]"
              >
                <div>
                  <div className="text-xs font-bold leading-tight mb-1 group-hover:text-white transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-sat-texto-suave group-hover:text-white/85 line-clamp-2 leading-relaxed transition-colors">
                    {item.desc}
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-sat-gris/50 group-hover:border-white/20 text-[10px] font-bold text-sat-azul group-hover:text-white flex items-center justify-between transition-colors">
                  <span>Acceder</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
