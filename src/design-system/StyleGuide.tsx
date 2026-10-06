import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronRight,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Menu,
  X,
  Layers,
  Code,
  Palette,
  Type,
  FileText,
  Sliders,
  CheckSquare,
  Sparkles
} from 'lucide-react';

/* -------------------------------------------------------------------------
 * Datos normativos transcritos del Manual de Imagen y Normas Graficas
 * SAT V.5. Cada entrada declara la pagina IMPRESA del manual.
 * ------------------------------------------------------------------------- */

type Autoridad = 'NORMATIVO' | 'DERIVADO';

interface Swatch {
  token: string;
  nombre: string;
  hex: string;
  cmyk?: string;
  rgb?: string;
  pantone?: string;
  autoridad: Autoridad;
  uso: string;
  /** true = el blanco alcanza AA como texto sobre este color. */
  claro: boolean;
}

const INSTITUCIONAL: Swatch[] = [
  {
    token: '--sat-celeste',
    nombre: 'Celeste institucional',
    hex: '#19AFE1',
    claro: false,
    rgb: '25 175 225',
    cmyk: 'C89 M22 Y00 K12',
    autoridad: 'NORMATIVO',
    uso: 'Color 1 de la paleta. Base de degradados 1+2 y 1+6.',
  },
  {
    token: '--sat-azul',
    nombre: 'AZUL SAT',
    hex: '#14649B',
    claro: true,
    rgb: '20 100 155',
    cmyk: 'C87 M35 Y00 K39',
    pantone: 'PANTONE 647 C',
    autoridad: 'NORMATIVO',
    uso: 'Color 2. Color principal de marca. Base de degradados 1+2 y 2+3.',
  },
  {
    token: '--sat-azul-oscuro',
    nombre: 'Azul oscuro',
    hex: '#19324B',
    claro: true,
    rgb: '25 50 75',
    cmyk: 'C67 M33 Y00 K71',
    autoridad: 'NORMATIVO',
    uso: 'Color 3. Color de texto institucional. Base del degradado 2+3.',
  },
  {
    token: '--sat-gris',
    nombre: 'Gris institucional',
    hex: '#DCDCDC',
    claro: false,
    rgb: '220 220 220',
    cmyk: 'C00 M00 Y00 K14',
    autoridad: 'NORMATIVO',
    uso: 'Color 4. Bordes y superficies neutras. Base del degradado 4+6.',
  },
  {
    token: '--sat-negro',
    nombre: 'Negro',
    hex: '#000000',
    claro: true,
    rgb: '0 0 0',
    cmyk: 'C00 M00 Y00 K100',
    autoridad: 'NORMATIVO',
    uso: 'Color 5. Tipografía sobre fondos claros.',
  },
  {
    token: '--sat-blanco',
    nombre: 'Blanco',
    hex: '#FFFFFF',
    claro: false,
    rgb: '255 255 255',
    cmyk: 'C00 M00 Y00 K00',
    autoridad: 'NORMATIVO',
    uso: 'Color 6. Fondo base y positivo del isologotipo.',
  },
];

const COMPLEMENTARIOS: Swatch[] = [
  {
    token: '--sat-comp-magenta',
    nombre: 'Magenta',
    hex: '#D9336E',
    claro: true,
    autoridad: 'NORMATIVO',
    uso: 'Aporta color y dinamismo. No debe competir con la paleta institucional.',
  },
  {
    token: '--sat-comp-morado',
    nombre: 'Morado',
    hex: '#824491',
    claro: true,
    autoridad: 'NORMATIVO',
    uso: 'Aporta color y dinamismo. No debe competir con la paleta institucional.',
  },
  {
    token: '--sat-comp-verde',
    nombre: 'Verde',
    hex: '#8CC63F',
    claro: false,
    autoridad: 'NORMATIVO',
    uso: 'Aporta color y dinamismo. No debe competir con la paleta institucional.',
  },
  {
    token: '--sat-comp-naranja',
    nombre: 'Naranja',
    hex: '#F37521',
    claro: false,
    autoridad: 'NORMATIVO',
    uso: 'Aporta color y dinamismo. No debe competir con la paleta institucional.',
  },
  {
    token: '--sat-comp-ambar',
    nombre: 'Ámbar',
    hex: '#FFB806',
    claro: false,
    autoridad: 'NORMATIVO',
    uso: 'Aporta color y dinamismo. No debe competir con la paleta institucional.',
  },
];

const DEGRADADOS = [
  {
    token: '--sat-degradado-1-2',
    combinacion: '1 + 2',
    declaracion: 'linear-gradient(135deg, #19AFE1 0%, #14649B 100%)',
    autorizado: true,
  },
  {
    token: '--sat-degradado-2-3',
    combinacion: '2 + 3',
    declaracion: 'linear-gradient(135deg, #14649B 0%, #19324B 100%)',
    autorizado: true,
  },
  {
    token: '--sat-degradado-4-6',
    combinacion: '4 + 6',
    declaracion: 'linear-gradient(135deg, #DCDCDC 0%, #FFFFFF 100%)',
    autorizado: true,
  },
  {
    token: '--sat-degradado-1-6',
    combinacion: '1 + 6',
    declaracion: 'linear-gradient(135deg, #19AFE1 0%, #FFFFFF 100%)',
    autorizado: true,
  },
];

const TIPOGRAFIA = [
  {
    nombre: 'Gotham Book',
    peso: 400,
    principal: 'Cuerpo de texto en párrafos y tablas',
    secundario: '—',
  },
  {
    nombre: 'Gotham Medium',
    peso: 500,
    principal: 'Subtítulos y destacados dentro de texto',
    secundario: 'Segunda mitad del eslogan institucional',
  },
  {
    nombre: 'Gotham Bold',
    peso: 700,
    principal: 'Títulos de sección y nombres de módulos',
    secundario: '—',
  },
  {
    nombre: 'Gotham Black',
    peso: 900,
    principal: 'Títulos principales y cabeceras de gran escala',
    secundario: 'Primera palabra del eslogan ("Contribuyendo")',
  },
  {
    nombre: 'Gotham Ultra (aprox. peso 800)',
    peso: 800,
    principal: 'Tipografía del isologotipo SAT',
    secundario: '—',
  },
];

const RESTRICCIONES = [
  'No cambiar los colores del isologotipo ni de la paleta institucional.',
  'No deformar las proporciones (proporción oficial 3.125:1).',
  'No separar el isotipo de la tipografía SAT ni del nombre oficial.',
  'No aplicar sombras, biseles, contornos o efectos 3D al isologotipo.',
  'No usar tipografías distintas a Gotham (o su reemplazo técnico declarado Montserrat).',
  'No alterar el orden de las palabras ni la inclinación del eslogan.',
  'No colocar el isologotipo sobre fondos con poco contraste que comprometan su legibilidad.',
  'No usar el isologotipo en tamaño menor al mínimo normativo (4.0 cm × 1.25 cm).',
];

const USO_INCORRECTO = [
  {
    titulo: 'Logotipo en un solo color no autorizado',
    descripcion:
      'No presentar el logo en colores planos fuera de blanco o negro sobre fondos restringidos.',
  },
  {
    titulo: 'Tipografía condensada o expandida',
    descripcion: 'No aplicar tracking extremo ni condensar manualmente los glifos de Gotham.',
  },
  {
    titulo: 'Reordenar elementos del cintillo',
    descripcion:
      'El eslogan y la abstracción de la bandera deben mantener la relación de tamaño y posición normada.',
  },
  {
    titulo: 'Uso de acentos como fondo principal',
    descripcion:
      'Los complementarios (magenta, morado, verde, naranja, ámbar) no sustituyen los fondos institucionales.',
  },
];

const CONTRASTE = [
  { fondo: '#19AFE1', token: '--sat-ui-texto-sobre-celeste', blanco: '2.14:1 (falla)', oscuro: '5.26:1 (pasa AA)' },
  { fondo: '#14649B', token: '--sat-ui-texto-sobre-azul', blanco: '4.91:1 (pasa AA)', oscuro: '2.30:1 (falla)' },
  { fondo: '#19324B', token: '--sat-ui-texto-sobre-azul-oscuro', blanco: '11.27:1 (pasa AAA)', oscuro: '—' },
  { fondo: '#DCDCDC', token: '--sat-ui-texto-sobre-gris', blanco: '1.38:1 (falla)', oscuro: '8.18:1 (pasa AAA)' },
  { fondo: '#D9336E', token: '--sat-ui-texto-sobre-magenta', blanco: '4.68:1 (pasa AA)', oscuro: '2.41:1 (falla)' },
  { fondo: '#824491', token: '--sat-ui-texto-sobre-morado', blanco: '5.74:1 (pasa AA)', oscuro: '1.96:1 (falla)' },
  { fondo: '#8CC63F', token: '--sat-ui-texto-sobre-verde', blanco: '1.81:1 (falla)', oscuro: '6.23:1 (pasa AA)' },
  { fondo: '#F37521', token: '--sat-ui-texto-sobre-naranja', blanco: '2.45:1 (falla)', oscuro: '4.60:1 (pasa AA)' },
  { fondo: '#FFB806', token: '--sat-ui-texto-sobre-ambar', blanco: '1.63:1 (falla)', oscuro: '6.91:1 (pasa AA)' },
];

const FUERA_DE_PALETA = [
  { hex: '#0284C7', rol: 'Acento Personas', usos: 14, archivos: 'UserSegmentCards, SegmentLayout' },
  { hex: '#4D8014', rol: 'Acento Empresas', usos: 9, archivos: 'UserSegmentCards, SegmentLayout' },
  { hex: '#C25E00', rol: 'Acento Aduanas', usos: 8, archivos: 'UserSegmentCards, SegmentLayout' },
  { hex: '#6366F1', rol: 'Acento Auxiliares', usos: 6, archivos: 'UserSegmentCards' },
  { hex: '#F8FAFC', rol: 'Superficie Slate-50', usos: 22, archivos: 'Varios componentes' },
  { hex: '#E2E8F0', rol: 'Bordes Slate-200', usos: 18, archivos: 'Varios componentes' },
  { hex: '#64748B', rol: 'Texto Slate-500', usos: 25, archivos: 'Varios componentes' },
  { hex: '#334155', rol: 'Texto Slate-700', usos: 12, archivos: 'Varios componentes' },
  { hex: '#0F172A', rol: 'Texto Slate-900', usos: 7, archivos: 'Varios componentes' },
  { hex: '#16A34A', rol: 'Verde Éxito Tailwind', usos: 5, archivos: 'Alertas y badges' },
];

/* -------------------------------------------------------------------------
 * Categorías y Menú de Navegación estilo Bootstrap 5 Docs
 * ------------------------------------------------------------------------- */

interface DocNavItem {
  id: string;
  titulo: string;
}

interface DocNavCategory {
  categoria: string;
  icono: React.ElementType;
  items: DocNavItem[];
}

const DOC_MENU: DocNavCategory[] = [
  {
    categoria: 'Fundamentos de Marca',
    icono: Palette,
    items: [
      { id: 'color', titulo: 'Color Institucional' },
      { id: 'complementarios', titulo: 'Colores Complementarios' },
      { id: 'degradados', titulo: 'Degradados Oficiales' },
      { id: 'tipografia', titulo: 'Tipografía (Gotham)' },
      { id: 'isologotipo', titulo: 'Isologotipo y Resguardo' },
      { id: 'eslogan', titulo: 'Eslogan Oficial' },
      { id: 'patron', titulo: 'Patrón Gráfico' },
    ],
  },
  {
    categoria: 'Componentes UI',
    icono: Layers,
    items: [
      { id: 'botones', titulo: 'Botones y Acciones' },
      { id: 'formularios', titulo: 'Formularios e Inputs' },
      { id: 'cards', titulo: 'Sistema de Tarjetas SAT' },
      { id: 'badges', titulo: 'Badges y Etiquetas' },
      { id: 'alertas', titulo: 'Alertas y Notificaciones' },
      { id: 'tablas', titulo: 'Tablas de Datos' },
    ],
  },
  {
    categoria: 'Contenido y UX Writing',
    icono: FileText,
    items: [
      { id: 'acronimos', titulo: 'Acrónimos y Siglas' },
      { id: 'tono', titulo: 'Tono y Lenguaje Ciudadano' },
      { id: 'restricciones', titulo: 'Restricciones y Uso Incorrecto' },
    ],
  },
  {
    categoria: 'Tokens y Accesibilidad',
    icono: Sliders,
    items: [
      { id: 'contraste', titulo: 'Contraste WCAG 2.2 AA' },
      { id: 'interfaz', titulo: 'Tokens de Interfaz Web' },
      { id: 'auditoria', titulo: 'Auditoría de Cumplimiento' },
      { id: 'pendientes', titulo: 'Pendientes Normativos' },
    ],
  },
];

/* -------------------------------------------------------------------------
 * Subcomponentes Reutilizables de Documentación
 * ------------------------------------------------------------------------- */

function BadgeNormativo({ autoridad }: { autoridad: Autoridad }) {
  const esNormativo = autoridad === 'NORMATIVO';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase ${
        esNormativo
          ? 'bg-[#14649B]/10 text-[#14649B] border border-[#14649B]/30'
          : 'bg-[#FFB806]/15 text-[#92400E] border border-[#FFB806]/30'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${esNormativo ? 'bg-[#14649B]' : 'bg-[#D97706]'}`} />
      {autoridad}
    </span>
  );
}

function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg border border-[#DCDCDC] bg-[#19324B] p-3 text-white font-mono text-xs">
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[11px] text-white/80 transition hover:bg-white/20 hover:text-white"
        aria-label="Copiar código"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-[#8CC63F]" />
            <span className="text-[#8CC63F]">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span>Copiar</span>
          </>
        )}
      </button>
      <pre className="overflow-x-auto pr-16">{code}</pre>
    </div>
  );
}

function SwatchCard({ s }: { s: Swatch }) {
  const [copied, setCopied] = useState(false);

  const copyHex = () => {
    navigator.clipboard.writeText(s.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#DCDCDC] bg-white transition hover:shadow-md">
      <div
        className="relative flex h-24 items-end justify-between p-3"
        style={{ backgroundColor: s.hex }}
      >
        <span
          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded backdrop-blur-sm ${
            s.claro ? 'text-white bg-black/20' : 'text-[#19324B] bg-white/70'
          }`}
        >
          {s.hex}
        </span>
        <button
          onClick={copyHex}
          className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] font-bold backdrop-blur transition ${
            s.claro
              ? 'bg-black/30 text-white hover:bg-black/50'
              : 'bg-white/80 text-[#19324B] hover:bg-white'
          }`}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Listo' : 'Copiar'}
        </button>
      </div>

      <div className="space-y-1.5 p-3.5">
        <div className="flex items-center justify-between gap-1">
          <span className="text-sm font-bold text-[#19324B]">{s.nombre}</span>
          <BadgeNormativo autoridad={s.autoridad} />
        </div>
        <code className="block font-mono text-[11px] text-[#475569]">{s.token}</code>
        <p className="text-xs leading-relaxed text-[#475569]">{s.uso}</p>

        {(s.cmyk || s.pantone) && (
          <div className="mt-2 border-t border-[#DCDCDC]/60 pt-2 text-[11px] text-[#64748B] space-y-0.5">
            {s.cmyk && <div>CMYK: <span className="font-mono">{s.cmyk}</span></div>}
            {s.pantone && <div>Pantone: <span className="font-mono">{s.pantone}</span></div>}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionDoc({
  id,
  titulo,
  manualPagina,
  descripcion,
  children,
}: {
  id: string;
  titulo: string;
  manualPagina?: string;
  descripcion?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-section-id={id} className="scroll-mt-20 py-8 border-b border-[#DCDCDC] last:border-b-0">
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-2xl font-black text-[#19324B] tracking-tight">{titulo}</h2>
          {manualPagina && (
            <span className="rounded bg-[#E9EDF2] px-2 py-0.5 font-mono text-xs font-bold text-[#19324B]">
              Manual p.{manualPagina}
            </span>
          )}
        </div>
        {descripcion && (
          <p className="mt-2 text-sm leading-relaxed text-[#475569] max-w-3xl">{descripcion}</p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Vista Principal del Design System con Interfaz estilo Bootstrap 5 Docs
 * ------------------------------------------------------------------------- */

export default function StyleGuide() {
  const [activeSection, setActiveSection] = useState('color');
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Botón interactivo de demostración de copiado / acción
  const [interactiveCounter, setInteractiveCounter] = useState(0);

  // Escuchar el hash inicial y hashchange para navegar suavemente
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const match = hash.match(/#\/estilo\/(.+)/) || hash.match(/#([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        setActiveSection(match[1]);
        const el = document.getElementById(match[1]);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // IntersectionObserver para actualizar el menú lateral mientras el usuario hace scroll en el contenido
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // El primero visible se convierte en el activo
          const topVisible = visibleEntries[0];
          const id = topVisible.target.getAttribute('id');
          if (id) {
            setActiveSection(id);
          }
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    const sections = document.querySelectorAll('section[data-section-id]');
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  // Bloquear scroll del fondo cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Filtrado de ítems de navegación según búsqueda
  const filteredMenu = DOC_MENU.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.titulo.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.id.toLowerCase().includes(searchFilter.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#19324B] font-sans antialiased">
      {/* -----------------------------------------------------------------
       * 1. TOP NAVBAR (Fija arriba z-40 estilo Bootstrap 5 Docs Header)
       * ----------------------------------------------------------------- */}
      <header className="fixed top-0 inset-x-0 z-40 h-16 border-b border-[#DCDCDC] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo & Marca & Toggle Móvil */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-[#475569] hover:bg-[#F4F6F9] focus:outline-none focus:ring-2 focus:ring-[#14649B] lg:hidden"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <a href="#/estilo" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14649B] text-white font-black text-sm">
                SAT
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-lg text-[#19324B]">Design System</span>
                <span className="rounded bg-[#14649B]/10 px-1.5 py-0.5 text-[11px] font-bold text-[#14649B]">
                  v5.0
                </span>
              </div>
            </a>
          </div>

          {/* Buscador Rápido Central / Desktop */}
          <div className="hidden sm:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar componente o token..."
                className="w-full rounded-lg border border-[#DCDCDC] bg-[#F4F6F9] py-1.5 pl-9 pr-3 text-xs text-[#19324B] placeholder-[#94A3B8] focus:border-[#14649B] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#14649B]"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 top-2 text-xs text-[#94A3B8] hover:text-[#19324B]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Acciones del Header */}
          <div className="flex items-center gap-3">
            <a
              href="#inicio"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCDCDC] bg-white px-3 py-1.5 text-xs font-bold text-[#14649B] transition hover:bg-[#F4F6F9]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver al portal</span>
            </a>
          </div>
        </div>
      </header>

      {/* -----------------------------------------------------------------
       * 2. BACKDROP MÓVIL (Cierra el menú al tocar fuera en pantallas pequeñas)
       * ----------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* -----------------------------------------------------------------
       * 3. CONTENEDOR PRINCIPAL: Sidebar Fija + Contenido Central Desplazable
       * ----------------------------------------------------------------- */}
      <div className="mx-auto max-w-7xl pt-16 px-4 sm:px-6">
        <div className="flex">
          {/* SIDEBAR IZQUIERDA (Fija con sticky en desktop, offcanvas en móvil) */}
          <aside
            className={`fixed inset-y-16 left-0 z-50 w-72 shrink-0 border-r border-[#DCDCDC] bg-white p-4 transition-transform duration-200 ease-in-out lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
              mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
            } overflow-y-auto no-scrollbar`}
          >
            {/* Buscador en pantalla móvil */}
            <div className="mb-4 sm:hidden">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Buscar en el manual..."
                  className="w-full rounded-lg border border-[#DCDCDC] bg-[#F4F6F9] py-1.5 pl-9 pr-3 text-xs text-[#19324B]"
                />
              </div>
            </div>

            <nav className="space-y-6">
              {filteredMenu.map((cat) => {
                const CatIcon = cat.icono;
                return (
                  <div key={cat.categoria} className="space-y-1.5">
                    <div className="flex items-center gap-2 px-2 py-1 text-xs font-black tracking-wider uppercase text-[#64748B]">
                      <CatIcon className="h-3.5 w-3.5 text-[#14649B]" />
                      <span>{cat.categoria}</span>
                    </div>

                    <ul className="space-y-0.5 border-l border-[#DCDCDC] ml-3 pl-2">
                      {cat.items.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <li key={item.id}>
                            <a
                              href={`#/estilo/${item.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(item.id);
                              }}
                              className={`group flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                                isActive
                                  ? 'bg-[#14649B]/10 text-[#14649B] font-bold border-l-2 border-[#14649B] -ml-[9px] pl-3'
                                  : 'text-[#475569] hover:bg-[#F4F6F9] hover:text-[#19324B]'
                              }`}
                            >
                              <span>{item.titulo}</span>
                              {isActive && <ChevronRight className="h-3 w-3 text-[#14649B]" />}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>

            <div className="mt-8 rounded-lg border border-[#DCDCDC] bg-[#F4F6F9] p-3 text-[11px] text-[#64748B]">
              <p className="font-bold text-[#19324B]">Manual SAT V.5</p>
              <p className="mt-0.5">Resolución SAT-DSI-597-2016. Aprobado 18/02/2026.</p>
            </div>
          </aside>

          {/* CONTENIDO CENTRAL (Se desplaza libremente sin mover la barra lateral) */}
          <main className="min-w-0 flex-1 px-0 py-6 lg:px-8">
            {/* Banner Introductorio */}
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#14649B] to-[#19324B] p-6 text-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    Sistema de Diseño Oficial
                  </span>
                  <h1 className="mt-2 text-3xl font-black tracking-tight">Manual de Imagen SAT V.5</h1>
                  <p className="mt-1 text-sm text-white/80 max-w-2xl">
                    Guía de componentes vivos, tokens CSS oficiales de marca y normas de UX Writing en lenguaje claro para el ecosistema digital de la Superintendencia de Administración Tributaria.
                  </p>
                </div>
              </div>
            </div>

            {/* =============================================================
             * SECCIONES: FUNDAMENTOS DE MARCA
             * ============================================================= */}

            {/* COLOR INSTITUCIONAL */}
            <SectionDoc
              id="color"
              titulo="Color Institucional"
              manualPagina="23-24"
              descripcion="Los seis colores oficiales de la SAT. Los valores HEX y CMYK fueron verificados contra el manual oficial. El color 2, AZUL SAT, es el color principal de la marca."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {INSTITUCIONAL.map((s) => (
                  <SwatchCard key={s.token} s={s} />
                ))}
              </div>
            </SectionDoc>

            {/* COLORES COMPLEMENTARIOS */}
            <SectionDoc
              id="complementarios"
              titulo="Colores Complementarios"
              manualPagina="26"
              descripcion="De acuerdo con el manual, en el uso de estos colores debe prevalecer la paleta institucional: los complementarios aportan únicamente color y dinamismo. No sustituyen los fondos de marca."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {COMPLEMENTARIOS.map((s) => (
                  <SwatchCard key={s.token} s={s} />
                ))}
              </div>
            </SectionDoc>

            {/* DEGRADADOS */}
            <SectionDoc
              id="degradados"
              titulo="Degradados Oficiales"
              manualPagina="25"
              descripcion="El manual define cuatro combinaciones recomendadas usando la numeración 1=celeste, 2=azul SAT, 3=azul oscuro, 4=gris, 5=negro, 6=blanco."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {DEGRADADOS.map((d) => (
                  <div key={d.token} className="overflow-hidden rounded-xl border border-[#DCDCDC] bg-white">
                    <div className="h-20" style={{ background: d.declaracion }} />
                    <div className="space-y-1.5 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#19324B]">Combinación {d.combinacion}</span>
                        <BadgeNormativo autoridad="NORMATIVO" />
                      </div>
                      <code className="block font-mono text-[10px] break-all text-[#475569]">
                        {d.token}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </SectionDoc>

            {/* TIPOGRAFIA */}
            <SectionDoc
              id="tipografia"
              titulo="Tipografía Oficial (Gotham)"
              manualPagina="43-45"
              descripcion="La tipografía oficial es Gotham, un tipo de palo seco geométrico. Gotham cuenta con licencia comercial de Hoefler & Co; se declara como valor prioritario y se enlaza Montserrat como sustituta geométrica equivalente."
            >
              <div className="mb-4 rounded-xl border border-[#DCDCDC] bg-[#F4F6F9] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Pila de Fuentes Tipográficas
                </p>
                <p className="mt-1 text-2xl font-black text-[#19324B]" style={{ fontFamily: 'var(--sat-fuente)' }}>
                  Superintendencia de Administración Tributaria 123
                </p>
                <code className="mt-2 block font-mono text-[11px] text-[#475569]">
                  --sat-fuente: &quot;Gotham&quot;, &quot;Montserrat&quot;, sans-serif;
                </code>
              </div>

              <div className="space-y-3">
                {TIPOGRAFIA.map((g) => (
                  <div key={g.nombre} className="rounded-xl border border-[#DCDCDC] bg-white p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm font-black text-[#14649B]">{g.nombre}</span>
                      <code className="font-mono text-xs text-[#64748B]">font-weight {g.peso}</code>
                    </div>
                    <p
                      className="mt-2 text-xl leading-snug"
                      style={{ fontWeight: g.peso, fontFamily: 'var(--sat-fuente)' }}
                    >
                      Cumplimiento y Facilitación Tributaria
                    </p>
                    <div className="mt-2 text-xs text-[#475569] space-y-0.5">
                      <div><strong className="text-[#19324B]">Uso principal:</strong> {g.principal}</div>
                      {g.secundario !== '—' && (
                        <div><strong className="text-[#19324B]">Uso secundario:</strong> {g.secundario}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionDoc>

            {/* ISOLOGOTIPO */}
            <SectionDoc
              id="isologotipo"
              titulo="Isologotipo y Zona de Resguardo"
              manualPagina="34-37"
              descripcion="El isologotipo está compuesto por el isotipo, la tipografía SAT y el nombre oficial. No deben utilizarse sus partes por separado ni violentar el margen perimetral."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-[#DCDCDC] bg-white p-4">
                  <h3 className="text-sm font-black text-[#19324B]">Construcción y Proporciones</h3>
                  <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                    <dt className="font-bold text-[#19324B]">Proporción Oficial:</dt>
                    <dd className="font-mono text-[#475569]">3.125:1 (2.5 × 8)</dd>
                    <dt className="font-bold text-[#19324B]">Tamaño Óptimo:</dt>
                    <dd className="font-mono text-[#475569]">5.0 cm × 1.60 cm</dd>
                    <dt className="font-bold text-[#19324B]">Tamaño Mínimo:</dt>
                    <dd className="font-mono text-[#475569]">4.0 cm × 1.25 cm</dd>
                    <dt className="font-bold text-[#19324B]">Posición en Piezas:</dt>
                    <dd className="text-[#475569]">Esquina inferior derecha</dd>
                  </dl>
                </div>

                <div className="rounded-xl border border-[#DCDCDC] bg-white p-4">
                  <h3 className="text-sm font-black text-[#19324B]">Zona de Resguardo Normativa</h3>
                  <p className="mt-1 text-xs text-[#475569]">
                    Ningún elemento gráfico o textual puede invadir el margen de seguridad perimetral.
                  </p>
                  <div
                    className="mt-3 flex h-24 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'var(--sat-azul)',
                      outline: '1px dashed rgba(255,255,255,0.7)',
                      outlineOffset: '-10px',
                    }}
                  >
                    <div className="text-center text-white">
                      <p className="text-xl font-black">SAT</p>
                      <p className="text-[9px] tracking-widest uppercase">Superintendencia de Administración Tributaria</p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionDoc>

            {/* ESLOGAN */}
            <SectionDoc
              id="eslogan"
              titulo="Eslogan Institucional"
              manualPagina="58-59"
              descripcion="El cintillo institucional lleva el eslogan con Gotham Black Italic en la primera palabra y Gotham Medium Italic en el resto, con interletrado de -25."
            >
              <div className="overflow-hidden rounded-xl border border-[#DCDCDC] bg-white">
                <div
                  className="p-6 text-white text-center sm:text-left"
                  style={{ backgroundImage: 'var(--sat-degradado-2-3)' }}
                >
                  <p className="text-2xl sm:text-3xl italic tracking-[-0.025em]">
                    <span className="font-black">Contribuyendo</span>{' '}
                    <span className="font-medium">juntos por Guatemala</span>
                  </p>
                </div>
                <div className="p-3 bg-[#F4F6F9] text-xs text-[#475569]">
                  Token: <code>--sat-eslogan-tracking: -0.025em;</code> · Se acompaña habitualmente con la abstracción geométrica de la bandera.
                </div>
              </div>
            </SectionDoc>

            {/* PATRON GRAFICO */}
            <SectionDoc
              id="patron"
              titulo="Patrón Gráfico Institucional"
              manualPagina="38-41"
              descripcion="Líneas de tensión con movimiento ascendente continuo. Representa los tres pilares institucionales: Servicio, Transparencia e Innovación."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { nombre: 'Servicio', grad: 'var(--sat-degradado-1-2)' },
                  { nombre: 'Transparencia', grad: 'var(--sat-degradado-2-3)' },
                  { nombre: 'Innovación', grad: 'var(--sat-degradado-1-6)' },
                ].map((item) => (
                  <div
                    key={item.nombre}
                    className="flex h-28 items-center justify-center rounded-xl text-center shadow-sm"
                    style={{ backgroundImage: item.grad }}
                  >
                    <span className="rounded-lg bg-white/80 px-3 py-1 text-xs font-black text-[#19324B] shadow-sm">
                      {item.nombre}
                    </span>
                  </div>
                ))}
              </div>
            </SectionDoc>

            {/* =============================================================
             * SECCIONES: COMPONENTES UI VIVOS
             * ============================================================= */}

            {/* BOTONES Y ACCIONES */}
            <SectionDoc
              id="botones"
              titulo="Botones y Acciones"
              descripcion="Los botones son el elemento principal de llamada a la acción (CTA). Se rigen por jerarquía visual: Primario (#14649B), Secundario/Outline (#DCDCDC), Acento Celeste (#19AFE1) y Destructivo."
            >
              <div className="space-y-6">
                {/* Visualizador en Vivo */}
                <div className="rounded-xl border border-[#DCDCDC] bg-white p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-4">
                    Variantes de Botón
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setInteractiveCounter(c => c + 1)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#14649B] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#19324B] active:scale-[0.98]"
                    >
                      <Sparkles className="h-4 w-4" />
                      Botón Primario ({interactiveCounter})
                    </button>

                    <button
                      className="inline-flex items-center gap-2 rounded-xl border border-[#DCDCDC] bg-white px-4 py-2.5 text-xs font-bold text-[#19324B] shadow-sm transition hover:bg-[#F4F6F9] active:scale-[0.98]"
                    >
                      Botón Secundario (Outline)
                    </button>

                    <button
                      className="inline-flex items-center gap-2 rounded-xl bg-[#19AFE1] px-4 py-2.5 text-xs font-bold text-[#19324B] shadow-sm transition hover:opacity-90 active:scale-[0.98]"
                    >
                      Botón Acento Celeste
                    </button>

                    <button
                      className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#B91C1C] active:scale-[0.98]"
                    >
                      Acción Destructiva
                    </button>

                    <button
                      disabled
                      className="inline-flex items-center gap-2 rounded-xl border border-[#DCDCDC] bg-[#F4F6F9] px-4 py-2.5 text-xs font-bold text-[#94A3B8] cursor-not-allowed"
                    >
                      Deshabilitado
                    </button>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mt-6 mb-3">
                    Tamaños Oficiales
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="rounded-lg bg-[#14649B] px-3 py-1.5 text-[11px] font-bold text-white">
                      Pequeño (sm)
                    </button>
                    <button className="rounded-xl bg-[#14649B] px-4 py-2.5 text-xs font-bold text-white">
                      Mediano (md - Estándar)
                    </button>
                    <button className="rounded-xl bg-[#14649B] px-6 py-3 text-sm font-bold text-white">
                      Grande (lg - CTA Principal)
                    </button>
                  </div>
                </div>

                <CodeSnippet
                  code={`<button className="inline-flex items-center gap-2 rounded-xl bg-[#14649B] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#19324B]">
  Solicitar NIT en Línea
</button>`}
                />
              </div>
            </SectionDoc>

            {/* FORMULARIOS E INPUTS */}
            <SectionDoc
              id="formularios"
              titulo="Formularios e Inputs"
              descripcion="Controles de formulario con soporte de estados activo, foco, error y ayuda contextual orientada a prevenir errores ciudadanos."
            >
              <div className="space-y-6">
                <div className="rounded-xl border border-[#DCDCDC] bg-white p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Input Texto Estándar */}
                    <div>
                      <label className="block text-xs font-bold text-[#19324B] mb-1.5">
                        Número de Identificación Tributaria (NIT)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. 1234567-8"
                        className="w-full rounded-xl border border-[#DCDCDC] bg-white px-3.5 py-2.5 text-xs text-[#19324B] placeholder-[#94A3B8] focus:border-[#14649B] focus:outline-none focus:ring-1 focus:ring-[#14649B]"
                      />
                      <p className="mt-1.5 text-[11px] text-[#64748B]">
                        Ingrese el NIT sin espacios.
                      </p>
                    </div>

                    {/* Input con Error */}
                    <div>
                      <label className="block text-xs font-bold text-[#DC2626] mb-1.5">
                        Correo Electrónico Notificaciones
                      </label>
                      <input
                        type="email"
                        defaultValue="correo_invalido@"
                        className="w-full rounded-xl border border-[#DC2626] bg-red-50/40 px-3.5 py-2.5 text-xs text-[#DC2626] focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626]"
                      />
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-[#DC2626]">
                        <AlertCircle className="h-3 w-3" />
                        Ingrese una dirección de correo válida (ejemplo: usuario@correo.com).
                      </p>
                    </div>

                    {/* Select */}
                    <div>
                      <label className="block text-xs font-bold text-[#19324B] mb-1.5">
                        Tipo de Personería Jurídica
                      </label>
                      <select className="w-full rounded-xl border border-[#DCDCDC] bg-white px-3.5 py-2.5 text-xs text-[#19324B] focus:border-[#14649B] focus:outline-none focus:ring-1 focus:ring-[#14649B]">
                        <option>Persona Individual con Negocio</option>
                        <option>Persona Jurídica (Sociedad Anónima)</option>
                        <option>Organización No Gubernamental (ONG)</option>
                      </select>
                    </div>

                    {/* Checkbox y Radio */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-[#19324B]">
                        Opciones de Notificación
                      </label>
                      <label className="flex items-center gap-2.5 text-xs text-[#475569] cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-[#DCDCDC] text-[#14649B] focus:ring-[#14649B]"
                        />
                        <span>Acepto recibir recordatorios de vencimiento de impuestos</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs text-[#475569] cursor-pointer">
                        <input
                          type="radio"
                          name="canal"
                          defaultChecked
                          className="h-4 w-4 border-[#DCDCDC] text-[#14649B] focus:ring-[#14649B]"
                        />
                        <span>Buzón del contribuyente SAT</span>
                      </label>
                    </div>
                  </div>
                </div>

                <CodeSnippet
                  code={`<div className="space-y-1.5">
  <label className="block text-xs font-bold text-[#19324B]">Número de NIT</label>
  <input
    type="text"
    placeholder="1234567-8"
    className="w-full rounded-xl border border-[#DCDCDC] bg-white px-3.5 py-2 text-xs focus:border-[#14649B] focus:ring-1 focus:ring-[#14649B]"
  />
</div>`}
                />
              </div>
            </SectionDoc>

            {/* SISTEMA DE TARJETAS SAT */}
            <SectionDoc
              id="cards"
              titulo="Sistema de Tarjetas SAT (Cards)"
              descripcion="Componente insignia del portal. Regla estricta: cero íconos decorativos, cero etiquetas de conteo administrativo, hover sólido interactivo y chevron estático sin animación de movimiento."
            >
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Card Modelo Oficial SAT */}
                  <div className="group relative block rounded-2xl border border-[#DCDCDC] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-[#14649B] hover:shadow-[0_14px_30px_rgba(20,100,155,0.18)] cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-base font-bold text-[#19324B] transition-colors group-hover:text-white">
                        Inscripción y Solicitud de NIT
                      </h4>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[#94A3B8] transition-colors group-hover:text-white" />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#475569] transition-colors group-hover:text-white/90">
                      Obtén tu Número de Identificación Tributaria por primera vez en línea para emitir facturas, trabajar bajo relación de dependencia o iniciar actividades comerciales.
                    </p>
                  </div>

                  {/* Card Modelo Vehículos */}
                  <div className="group relative block rounded-2xl border border-[#DCDCDC] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-[#0284C7] hover:shadow-[0_14px_30px_rgba(2,132,199,0.18)] cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-base font-bold text-[#19324B] transition-colors group-hover:text-white">
                        Traspaso Electrónico de Vehículos
                      </h4>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[#94A3B8] transition-colors group-hover:text-white" />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#475569] transition-colors group-hover:text-white/90">
                      Realiza el cambio de propietario de vehículos terrestres de forma inmediata con firma electrónica avanzada y validación notarial en línea.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border-l-4 border-[#14649B] bg-[#F4F6F9] p-4 text-xs text-[#475569]">
                  <strong className="text-[#19324B]">Regla de Diseño Estricta:</strong> En el portal principal (tarjetas de inicio), no se agregan badges de categorías ni conteos como &quot;4 Trámites&quot;. Toda la superficie de la card es clickeable.
                </div>

                <CodeSnippet
                  code={`<div className="group rounded-2xl border border-[#DCDCDC] bg-white p-5 transition-all hover:-translate-y-1 hover:bg-[#14649B] hover:shadow-lg cursor-pointer">
  <div className="flex items-start justify-between gap-3">
    <h4 className="text-base font-bold text-[#19324B] group-hover:text-white">Título en Lenguaje Claro</h4>
    <ChevronRight className="h-5 w-5 text-[#94A3B8] group-hover:text-white" />
  </div>
  <p className="mt-2 text-xs text-[#475569] group-hover:text-white/90">Descripción orientada al beneficio ciudadano en 2 oraciones.</p>
</div>`}
                />
              </div>
            </SectionDoc>

            {/* BADGES Y ETIQUETAS */}
            <SectionDoc
              id="badges"
              titulo="Badges y Etiquetas de Estado"
              descripcion="Etiquetas contextuales compactas para modalidad de trámites (En línea, Presencial), costo (Gratuito) o requisitos previos."
            >
              <div className="space-y-6">
                <div className="rounded-xl border border-[#DCDCDC] bg-white p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                    Modalidades y Estados de Trámite
                  </h4>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#14649B]/10 px-2.5 py-1 text-xs font-bold text-[#14649B]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#14649B]" />
                      100% En Línea
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0284C7]/10 px-2.5 py-1 text-xs font-bold text-[#0284C7]">
                      Agencia Virtual
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8CC63F]/20 px-2.5 py-1 text-xs font-bold text-[#4D8014]">
                      Trámite Gratuito
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFB806]/20 px-2.5 py-1 text-xs font-bold text-[#92400E]">
                      Cita Previa Requerida
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCDCDC] px-2.5 py-1 text-xs font-bold text-[#475569]">
                      Presencial
                    </span>
                  </div>
                </div>

                <CodeSnippet
                  code={`<span className="inline-flex items-center gap-1.5 rounded-full bg-[#14649B]/10 px-2.5 py-1 text-xs font-bold text-[#14649B]">
  <span className="h-1.5 w-1.5 rounded-full bg-[#14649B]" />
  100% En Línea
</span>`}
                />
              </div>
            </SectionDoc>

            {/* ALERTAS Y AVISOS */}
            <SectionDoc
              id="alertas"
              titulo="Alertas y Notificaciones"
              descripcion="Avisos contextuales organizados por severidad con íconos semánticos y contraste validado según pautas WCAG 2.2 AA."
            >
              <div className="space-y-4">
                {/* Info */}
                <div className="flex items-start gap-3 rounded-xl border border-[#14649B]/30 bg-[#14649B]/5 p-4 text-[#19324B]">
                  <Info className="h-5 w-5 shrink-0 text-[#14649B] mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-[#14649B]">Información Importante</p>
                    <p className="mt-0.5 text-[#475569]">
                      Los días inhábiles y asuetos bancarios trasladan el vencimiento de declaraciones al siguiente día hábil inmediato.
                    </p>
                  </div>
                </div>

                {/* Éxito */}
                <div className="flex items-start gap-3 rounded-xl border border-[#8CC63F]/40 bg-[#8CC63F]/10 p-4 text-[#19324B]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#4D8014] mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-[#4D8014]">Operación Exitosa</p>
                    <p className="mt-0.5 text-[#475569]">
                      Tu solicitud de Solvencia Fiscal fue aprobada. Puedes descargar la constancia digital con código QR.
                    </p>
                  </div>
                </div>

                {/* Advertencia */}
                <div className="flex items-start gap-3 rounded-xl border border-[#FFB806]/40 bg-[#FFB806]/10 p-4 text-[#19324B]">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-[#D97706] mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-[#92400E]">Próximo Vencimiento</p>
                    <p className="mt-0.5 text-[#475569]">
                      El plazo para presentar la declaración del Impuesto de Circulación vence en 5 días calendario.
                    </p>
                  </div>
                </div>

                {/* Error */}
                <div className="flex items-start gap-3 rounded-xl border border-[#DC2626]/30 bg-red-50/60 p-4 text-[#19324B]">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626] mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-[#DC2626]">No se pudo procesar la solicitud</p>
                    <p className="mt-0.5 text-[#475569]">
                      Verifica que los datos ingresados coincidan exactamente con tu Documento Personal de Identificación (DPI).
                    </p>
                  </div>
                </div>

                <CodeSnippet
                  code={`<div className="flex items-start gap-3 rounded-xl border border-[#14649B]/30 bg-[#14649B]/5 p-4">
  <Info className="h-5 w-5 text-[#14649B]" />
  <div className="text-xs">
    <p className="font-bold text-[#14649B]">Título de Alerta</p>
    <p className="text-[#475569]">Mensaje explicativo claro.</p>
  </div>
</div>`}
                />
              </div>
            </SectionDoc>

            {/* TABLAS DE DATOS */}
            <SectionDoc
              id="tablas"
              titulo="Tablas de Datos"
              descripcion="Presentación tabular accesible con encabezados diferenciados, líneas sutiles y estados de contraste legibles."
            >
              <div className="overflow-x-auto rounded-xl border border-[#DCDCDC] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#DCDCDC] bg-[#F4F6F9]">
                    <tr>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Impuesto / Obligación</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Formulario Declaraguate</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Frecuencia</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Canal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCDCDC]">
                    <tr className="hover:bg-[#F4F6F9]/50 transition">
                      <td className="px-4 py-3 font-medium text-[#19324B]">Impuesto al Valor Agregado (IVA General)</td>
                      <td className="px-4 py-3 font-mono text-[#14649B]">SAT-2237</td>
                      <td className="px-4 py-3 text-[#475569]">Mensual</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-[#14649B]/10 px-2 py-0.5 text-[10px] font-bold text-[#14649B]">Bancario / Web</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F4F6F9]/50 transition">
                      <td className="px-4 py-3 font-medium text-[#19324B]">Pequeño Contribuyente (IVA 5%)</td>
                      <td className="px-4 py-3 font-mono text-[#14649B]">SAT-2046</td>
                      <td className="px-4 py-3 text-[#475569]">Mensual</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-[#14649B]/10 px-2 py-0.5 text-[10px] font-bold text-[#14649B]">Bancario / Web</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F4F6F9]/50 transition">
                      <td className="px-4 py-3 font-medium text-[#19324B]">Impuesto Sobre Circulación de Vehículos (ISCV)</td>
                      <td className="px-4 py-3 font-mono text-[#14649B]">SAT-4091</td>
                      <td className="px-4 py-3 text-[#475569]">Anual (31 de julio)</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-[#8CC63F]/20 px-2 py-0.5 text-[10px] font-bold text-[#4D8014]">En Línea</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SectionDoc>

            {/* =============================================================
             * SECCIONES: CONTENIDO Y UX WRITING
             * ============================================================= */}

            {/* ACRÓNIMOS Y SIGLAS */}
            <SectionDoc
              id="acronimos"
              titulo="Acrónimos y Siglas Tributarias"
              descripcion="Regla obligatoria de UX Writing: Toda sigla técnica debe ir acompañada de su significado en primera mención para eliminar la fricción ciudadana."
            >
              <div className="overflow-x-auto rounded-xl border border-[#DCDCDC] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#DCDCDC] bg-[#F4F6F9]">
                    <tr>
                      <th className="px-4 py-3 font-bold text-[#DC2626]">❌ Sigla Aislada (No recomendada)</th>
                      <th className="px-4 py-3 font-bold text-[#14649B]">✅ Lenguaje Claro Oficial</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Contexto Ciudadano</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCDCDC]">
                    <tr>
                      <td className="px-4 py-3 text-[#DC2626] font-medium">RTU Digital</td>
                      <td className="px-4 py-3 font-bold text-[#19324B]">Registro Tributario Unificado (RTU)</td>
                      <td className="px-4 py-3 text-[#475569]">Ficha donde constan tus datos personales y fiscales.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-[#DC2626] font-medium">SOFI</td>
                      <td className="px-4 py-3 font-bold text-[#19324B]">Solvencia Fiscal en Línea</td>
                      <td className="px-4 py-3 text-[#475569]">Constancia de que no tienes deudas tributarias.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-[#DC2626] font-medium">FEL / DTE</td>
                      <td className="px-4 py-3 font-bold text-[#19324B]">Factura Electrónica en Línea (FEL)</td>
                      <td className="px-4 py-3 text-[#475569]">Emisión y consulta de facturas electrónicas válidas.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-[#DC2626] font-medium">ISCV</td>
                      <td className="px-4 py-3 font-bold text-[#19324B]">Impuesto de Circulación de Vehículos</td>
                      <td className="px-4 py-3 text-[#475569]">Pago anual obligatorio de calcomanía electrónica.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-[#DC2626] font-medium">DUCA</td>
                      <td className="px-4 py-3 font-bold text-[#19324B]">Declaración Única Centroamericana (Aduanas)</td>
                      <td className="px-4 py-3 text-[#475569]">Trámite aduanero para ingreso o egreso de mercancías.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SectionDoc>

            {/* TONO Y LENGUAJE CIUDADANO */}
            <SectionDoc
              id="tono"
              titulo="Tono y Lenguaje Ciudadano"
              manualPagina="48-51"
              descripcion="El tono es la manera en que nos comunicamos con el contribuyente. En la mayoría de trámites nos dirigimos de TÚ por ser un trato amigable y cercano. Usted se reserva para comunicaciones formales o resoluciones jurídicas."
            >
              <div className="grid gap-4 lg:grid-cols-2 mb-6">
                <div className="rounded-xl border border-[#DCDCDC] bg-white p-4">
                  <h3 className="text-sm font-black text-[#19324B]">Pilares del Tono SAT</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Amigable', 'Propositivo', 'Cercano'].map((t) => (
                      <span key={t} className="rounded-full bg-[#14649B] px-3 py-1 text-xs font-bold text-white">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#475569]">
                    Trato de <strong className="text-[#19324B]">TÚ</strong> para guiar al ciudadano en sus trámites diarios sin barreras de complejidad burocrática.
                  </p>
                </div>

                <div className="rounded-xl border border-[#DCDCDC] bg-white p-4">
                  <h3 className="text-sm font-black text-[#19324B]">Principios de Redacción</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Accesible', 'Concreto', 'Directo'].map((t) => (
                      <span key={t} className="rounded-full bg-[#19AFE1] px-3 py-1 text-xs font-bold text-[#19324B]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#475569]">
                    Explicaciones en máximo 2 oraciones, comenzando con verbos de acción clara (Solicitar, Descargar, Pagar, Consultar).
                  </p>
                </div>
              </div>

              {/* Comparación Jerga vs Lenguaje Claro */}
              <div className="rounded-xl border border-[#DCDCDC] bg-white p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                  Sustitución de Jerga Burocrática por Lenguaje Ciudadano
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Sujeto Pasivo / Contribuyente afecto', 'Personas y Empresas con o sin negocio'],
                    ['Omisos tributarios', 'Consultar pagos o declaraciones pendientes'],
                    ['Régimen de Rentas del Trabajo', 'Impuestos para personas con empleo o salario'],
                    ['Distintivos electrónicos del Registro Fiscal', 'Tarjeta de circulación y calcomanía vehicular'],
                  ].map(([burocrata, claro]) => (
                    <div key={burocrata} className="rounded-lg bg-[#F4F6F9] p-3 text-xs">
                      <div className="text-[#DC2626] line-through">{burocrata}</div>
                      <div className="mt-1 font-bold text-[#14649B]">➔ {claro}</div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionDoc>

            {/* RESTRICCIONES */}
            <SectionDoc
              id="restricciones"
              titulo="Restricciones y Uso Incorrecto"
              manualPagina="19-21"
              descripcion="Normas taxativas que aplican al isologotipo y a todos los componentes de diseño visual institucional."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-[#DCDCDC] bg-white p-4">
                  <h3 className="text-sm font-black text-[#DC2626]">Prácticas Prohibidas</h3>
                  <ul className="mt-3 space-y-2">
                    {RESTRICCIONES.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-xs text-[#475569]">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#DC2626]" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-[#DCDCDC] bg-white p-4">
                  <h3 className="text-sm font-black text-[#19324B]">Casos de Desvío Detectados</h3>
                  <div className="mt-3 space-y-2.5">
                    {USO_INCORRECTO.map((u) => (
                      <div key={u.titulo} className="rounded-lg bg-[#F4F6F9] p-2.5 text-xs">
                        <p className="font-bold text-[#19324B]">{u.titulo}</p>
                        <p className="mt-0.5 text-[#64748B]">{u.descripcion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionDoc>

            {/* =============================================================
             * SECCIONES: TOKENS Y ACCESIBILIDAD
             * ============================================================= */}

            {/* CONTRASTE */}
            <SectionDoc
              id="contraste"
              titulo="Contraste de Color (WCAG 2.2 AA)"
              descripcion="Razones de contraste medidas matemáticamente sobre los valores hex de la paleta. En celeste, verde, ámbar, naranja y gris, el texto DEBE ser azul oscuro (#19324B) para cumplir accesibilidad."
            >
              <div className="overflow-x-auto rounded-xl border border-[#DCDCDC] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#DCDCDC] bg-[#F4F6F9]">
                    <tr>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Muestra de Color</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Token de Texto Recomendado</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Contraste con Blanco</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Contraste con Azul Oscuro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCDCDC]">
                    {CONTRASTE.map((c) => {
                      const pasaBlanco = c.blanco.includes('pasa');
                      const pasaOscuro = c.oscuro.includes('pasa');
                      return (
                        <tr key={c.fondo}>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-2">
                              <span
                                className="h-5 w-5 rounded border border-[#DCDCDC]"
                                style={{ backgroundColor: c.fondo }}
                              />
                              <code className="font-mono text-xs">{c.fondo}</code>
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[#64748B]">{c.token}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                                pasaBlanco ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {c.blanco}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                                pasaOscuro ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {c.oscuro}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SectionDoc>

            {/* TOKENS DE INTERFAZ WEB */}
            <SectionDoc
              id="interfaz"
              titulo="Tokens de Interfaz Web"
              descripcion="Variables CSS estandarizadas en tokens.css que traducen los lineamientos del manual a un entorno de desarrollo React/Tailwind."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['--sat-ui-fondo', '#FFFFFF', 'Fondo base blanco'],
                  ['--sat-ui-fondo-tenue', '#F4F6F9', 'Fondo neutro de sección'],
                  ['--sat-ui-fondo-medio', '#E9EDF2', 'Fondo secundario / bordes'],
                  ['--sat-ui-borde', '#DCDCDC', 'Borde estándar de tarjetas'],
                  ['--sat-ui-texto', '#19324B', 'Texto principal institucional'],
                  ['--sat-ui-texto-suave', '#475569', 'Texto secundario / párrafos'],
                  ['--sat-ui-foco', '#14649B', 'Anillo de foco accesible'],
                  ['--sat-radio-md', '14px', 'Radio de curvatura para botones'],
                  ['--sat-radio-lg', '16px', 'Radio de curvatura para cards'],
                ].map(([token, val, desc]) => (
                  <div key={token} className="rounded-xl border border-[#DCDCDC] bg-white p-3.5">
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-xs font-bold text-[#14649B]">{token}</code>
                      <span className="font-mono text-[11px] text-[#64748B]">{val}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#475569]">{desc}</p>
                  </div>
                ))}
              </div>
            </SectionDoc>

            {/* AUDITORÍA DE CUMPLIMIENTO */}
            <SectionDoc
              id="auditoria"
              titulo="Auditoría de Cumplimiento de Paleta"
              descripcion="Inventario de colores no normados presentes en componentes heredados del repositorio, listos para reemplazo progresivo por tokens de marca."
            >
              <div className="overflow-x-auto rounded-xl border border-[#DCDCDC] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#DCDCDC] bg-[#F4F6F9]">
                    <tr>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Color Heredado</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Rol Actual</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Usos</th>
                      <th className="px-4 py-3 font-bold text-[#19324B]">Componentes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCDCDC]">
                    {FUERA_DE_PALETA.map((f) => (
                      <tr key={f.hex}>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2">
                            <span
                              className="h-5 w-5 rounded border border-[#DCDCDC]"
                              style={{ backgroundColor: f.hex }}
                            />
                            <code className="font-mono text-xs">{f.hex}</code>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#475569]">{f.rol}</td>
                        <td className="px-4 py-3 font-bold text-[#19324B]">{f.usos}</td>
                        <td className="px-4 py-3 text-[#64748B]">{f.archivos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionDoc>

            {/* PENDIENTES NORMATIVOS */}
            <SectionDoc
              id="pendientes"
              titulo="Pendientes con Comunicación Social Externa"
              descripcion="Requerimientos institucionales abiertos para completar el ciclo de homologación gráfica del portal."
            >
              <div className="space-y-3">
                {[
                  'Obtener el archivo vectorial SVG oficial del isologotipo SAT sin alteraciones tipográficas.',
                  'Licenciamiento institucional formal de la tipografía Gotham (Hoefler & Co).',
                  'Confirmar matriz de colores para los 4 segmentos principales respetando la jerarquía del manual.',
                  'Aprobación formal del manual de UX Writing y sustitución de términos burocráticos.',
                ].map((p, i) => (
                  <div key={p} className="flex items-start gap-3 rounded-xl border border-[#DCDCDC] bg-white p-3.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#14649B] text-[11px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-xs leading-relaxed text-[#475569]">{p}</span>
                  </div>
                ))}
              </div>
            </SectionDoc>

            {/* Footer de Documentación */}
            <footer className="mt-16 border-t border-[#DCDCDC] pt-8 pb-12 text-center text-xs text-[#64748B]">
              <p className="font-medium">
                SAT Guatemala Design System · Basado en el Manual de Imagen y Normas Gráficas SAT V.5
              </p>
              <p className="mt-1 text-[11px] text-[#94A3B8]">
                Tokens declarados en <code>src/design-system/tokens.css</code>. Diseñado para alta accesibilidad y claridad ciudadana.
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}