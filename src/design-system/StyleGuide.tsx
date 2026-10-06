import React from 'react';

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
    nombre: 'Ambar',
    hex: '#FFB806',
    claro: false,
    autoridad: 'NORMATIVO',
    uso: 'Aporta color y dinamismo. No debe competir con la paleta institucional.',
  },
];

interface Degradado {
  token: string;
  combinacion: string;
  declaracion: string;
  autorizado: boolean;
}

const DEGRADADOS: Degradado[] = [
  {
    token: '--sat-degradado-1-2',
    combinacion: '1 + 2',
    declaracion: 'linear-gradient(135deg, #19afe1 0%, #14649b 100%)',
    autorizado: true,
  },
  {
    token: '--sat-degradado-2-3',
    combinacion: '2 + 3',
    declaracion: 'linear-gradient(135deg, #14649b 0%, #19324b 100%)',
    autorizado: true,
  },
  {
    token: '--sat-degradado-1-6',
    combinacion: '1 + 6',
    declaracion: 'linear-gradient(135deg, #19afe1 0%, #ffffff 100%)',
    autorizado: true,
  },
  {
    token: '--sat-degradado-4-6',
    combinacion: '4 + 6',
    declaracion: 'linear-gradient(135deg, #dcdcdc 0%, #ffffff 100%)',
    autorizado: true,
  },
];

interface Grosor {
  nombre: string;
  css: string;
  peso: number;
  principal: string;
  secundario: string;
}

const TIPOGRAFIA: Grosor[] = [
  {
    nombre: 'Light',
    css: 'var(--sat-weight-light)',
    peso: 300,
    principal: 'Palabras que no necesiten llamar la atención.',
    secundario: 'Cuerpo de texto y subtitulares, cuando sean de gran tamaño.',
  },
  {
    nombre: 'Book',
    css: 'var(--sat-weight-book)',
    peso: 400,
    principal: 'Cuerpo de texto.',
    secundario: '—',
  },
  {
    nombre: 'Medium',
    css: 'var(--sat-weight-medium)',
    peso: 500,
    principal:
      'Cuerpo de texto, principalmente cuando el tipo sea pequeño y se necesite mayor legibilidad.',
    secundario: '—',
  },
  {
    nombre: 'Bold',
    css: 'var(--sat-weight-bold)',
    peso: 700,
    principal:
      'En el cuerpo de texto para sobresaltar frases, oraciones o palabras, lograr crear énfasis.',
    secundario: 'En subtitulares.',
  },
  {
    nombre: 'Black',
    css: 'var(--sat-weight-black)',
    peso: 900,
    principal:
      'En títulos y subtítulos, incluso frases, oraciones o palabras que deban sobresalir del cuerpo de texto.',
    secundario: '—',
  },
  {
    nombre: 'Ultra',
    css: 'var(--sat-weight-light)',
    peso: 800,
    principal:
      'En títulos. Por ser un tipo extra bold debe usarse en frases cortas o palabras que deban ser foco de atención.',
    secundario: '—',
  },
];

const RESTRICCIONES = [
  'No separar los elementos del isologotipo.',
  'No deformar ni alterar su proporción.',
  'No cambiar su color fuera de la paleta oficial.',
  'No aplicar sombra, relieve ni otros efectos sobre la marca.',
  'No recortar el isologotipo.',
  'No utilizar piezas sueltas (isotipo o tipografía) por separado.',
];

const USO_INCORRECTO = [
  {
    titulo: 'Elementos separados',
    descripcion: 'El isologotipo esta indivisible.',
  },
  {
    titulo: 'Proporcion alterada',
    descripcion: 'La relacion debe permanecer 3.125:1.',
  },
  {
    titulo: 'Color fuera de norma',
    descripcion: 'Solo azul institucional o su positivo blanco.',
  },
  {
    titulo: 'Efectos sobre la marca',
    descripcion: 'Sin sombra, relieve, contorno ni degradado propio.',
  },
];

/* Razones de contraste medidas con la formula de WCAG 2.1 sobre los
 * valores reales de la paleta. El blanco falla en cinco superficies,
 * por eso existen los tokens --sat-ui-texto-sobre-*. */
const CONTRASTE: { fondo: string; token: string; blanco: string; oscuro: string }[] = [
  {
    fondo: '#14649B',
    token: '--sat-ui-texto-sobre-azul',
    blanco: '6.31 AA',
    oscuro: '2.08 FAIL',
  },
  {
    fondo: '#19324B',
    token: '--sat-ui-texto-sobre-azul-oscuro',
    blanco: '13.13 AA',
    oscuro: '1.00 FAIL',
  },
  {
    fondo: '#19AFE1',
    token: '--sat-ui-texto-sobre-celeste',
    blanco: '2.54 FAIL',
    oscuro: '5.17 AA',
  },
  {
    fondo: '#8CC63F',
    token: '--sat-ui-texto-sobre-verde',
    blanco: '2.05 FAIL',
    oscuro: '6.42 AA',
  },
  {
    fondo: '#FFB806',
    token: '--sat-ui-texto-sobre-ambar',
    blanco: '1.73 FAIL',
    oscuro: '7.57 AA',
  },
  {
    fondo: '#F37521',
    token: '--sat-ui-texto-sobre-naranja',
    blanco: '2.85 FAIL',
    oscuro: '4.61 AA',
  },
  {
    fondo: '#DCDCDC',
    token: '--sat-ui-texto-sobre-gris',
    blanco: '1.37 FAIL',
    oscuro: '9.58 AA',
  },
  {
    fondo: '#D9336E',
    token: '— sin token',
    blanco: '4.52 AA',
    oscuro: '2.91 FAIL',
  },
  {
    fondo: '#824491',
    token: '— sin token',
    blanco: '6.59 AA',
    oscuro: '1.99 FAIL',
  },
];

/* ------------------------- Componentes de apoyo ------------------------- */

function Badge({ autoridad }: { autoridad: Autoridad }) {
  const esNormativo = autoridad === 'NORMATIVO';
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
      style={{
        backgroundColor: esNormativo ? 'var(--sat-azul)' : 'var(--sat-gris)',
        color: esNormativo ? '#fff' : 'var(--sat-azul-oscuro)',
      }}
    >
      {autoridad}
    </span>
  );
}

function SwatchCard({ s }: { s: Swatch }) {
  /* Usa el token de texto-sobre-color validado por contraste. */
  const textoClaro = s.claro === true;
  const color = textoClaro ? 'var(--sat-ui-texto-sobre-azul)' : 'var(--sat-ui-texto-sobre-celeste)';
  return (
    <li className="overflow-hidden rounded-[16px] border border-[#DCDCDC] bg-white">
      <div
        className="flex h-24 items-end justify-between p-3"
        style={{ backgroundColor: s.hex, color }}
      >
        <span className="font-mono text-sm font-bold">{s.hex.toUpperCase()}</span>
        {s.pantone && (
          <span className="rounded bg-black/25 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {s.pantone}
          </span>
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-bold text-[#19324B]">{s.nombre}</span>
          <Badge autoridad={s.autoridad} />
        </div>
        <code className="block font-mono text-[11px] text-[#475569]">{s.token}</code>
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[11px] text-[#475569]">
          {s.rgb && (
            <>
              <dt className="font-bold">RGB</dt>
              <dd>{s.rgb}</dd>
            </>
          )}
          {s.cmyk && (
            <>
              <dt className="font-bold">CMYK</dt>
              <dd>{s.cmyk}</dd>
            </>
          )}
        </dl>
        <p className="text-xs leading-relaxed text-[#475569]">{s.uso}</p>
      </div>
    </li>
  );
}

function Section({
  id,
  titulo,
  pagina,
  children,
  descripcion,
}: {
  id: string;
  titulo: string;
  pagina: string;
  descripcion?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-[#DCDCDC] py-8 first:border-t-0">
      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-black text-[#19324B]">{titulo}</h2>
          <span className="rounded bg-[#DCDCDC] px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#19324B]">
            manual p.{pagina}
          </span>
        </div>
        {descripcion && (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#475569]">{descripcion}</p>
        )}
      </header>
      {children}
    </section>
  );
}

/* --------------------------------- Vista -------------------------------- */

export default function StyleGuide() {
  const copiar = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      /* clipboard no disponible */
    }
  };

  return (
    <div className="min-h-dvh bg-[#F4F6F9] text-[#19324B]">
      {/* Cabecera */}
      <header className="bg-[#14649B] text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">
                Design System
              </p>
              <h1 className="mt-1 text-3xl font-black">Manual de Imagen SAT V.5</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-90">
                Catalogo vivo de tokens derivados del{' '}
                <strong>Manual de Imagen y Normas Graficas SAT V.5</strong>, aprobado el
                18/02/2026 segun Resolucion SAT-DSI-597-2016.
              </p>
            </div>
            <a
              href="#inicio"
              className="rounded-[14px] bg-white px-4 py-2 text-sm font-bold text-[#14649B] transition-opacity hover:opacity-90"
            >
              Volver al portal
            </a>
          </div>
        </div>
      </header>

      {/* Navegacion */}
      <nav className="sticky top-0 z-10 border-b border-[#DCDCDC] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 text-sm sm:px-6">
          {[
            ['color', 'Color'],
            ['complementarios', 'Complementarios'],
            ['degradados', 'Degradados'],
            ['tipografia', 'Tipografia'],
            ['isologotipo', 'Isologotipo'],
            ['eslogan', 'Eslogan'],
            ['patron', 'Patron'],
            ['tono', 'Tono y lenguaje'],
            ['restricciones', 'Restricciones'],
            ['contraste', 'Contraste'],
            ['interfaz', 'Tokens de interfaz'],
            ['pendientes', 'Pendientes'],
          ].map(([id, txt]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded px-3 py-1.5 font-medium whitespace-nowrap text-[#475569] transition-colors hover:bg-[#F4F6F9] hover:text-[#14649B]"
            >
              {txt}
            </a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* COLOR */}
        <Section
          id="color"
          titulo="Color institucional"
          pagina="23-24"
          descripcion="Los seis colores oficiales de SAT. Los valores HEX y CMYK fueron verificados contra el manual y son consistentes entre si. Este es el color 2, AZUL SAT, color principal de marca."
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INSTITUCIONAL.map((s) => (
              <SwatchCard key={s.token} s={s} />
            ))}
          </ul>
        </Section>

        {/* COMPLEMENTARIOS */}
        <Section
          id="complementarios"
          titulo="Color complementario"
          pagina="26"
          descripcion="Segun el manual, en el uso de estos colores debe prevalecer la paleta institucional: los complementarios aportan unicamente color y dinamismo. Para mensajes publicitarios el uso del color queda libre."
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {COMPLEMENTARIOS.map((s) => (
              <SwatchCard key={s.token} s={s} />
            ))}
          </ul>
          <p className="mt-4 rounded-[14px] border-l-4 border-[#FFB806] bg-white p-4 text-sm leading-relaxed text-[#475569]">
            <strong className="text-[#19324B]">Regla de uso:</strong> estos colores no sustituyen a
            la paleta institucional en interfaz. Se reservan para acentos, indicadores y piezas
            graficas de comunicacion.
          </p>
        </Section>

        {/* DEGRADADOS */}
        <Section
          id="degradados"
          titulo="Degradados oficiales"
          pagina="25"
          descripcion="El manual define cuatro combinaciones recomendadas usando la numeracion 1=celeste, 2=azul SAT, 3=azul oscuro, 4=gris, 5=negro, 6=blanco. Se pueden aplicar capas de efecto para intensificar el color."
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEGRADADOS.map((d) => (
              <li key={d.token} className="overflow-hidden rounded-[16px] border border-[#DCDCDC] bg-white">
                <div className="h-20" style={{ background: d.declaracion }} />
                <div className="space-y-1.5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Combinacion {d.combinacion}</span>
                    <Badge autoridad={d.autorizado ? 'NORMATIVO' : 'DERIVADO'} />
                  </div>
                  <code className="block font-mono text-[10px] break-all text-[#475569]">
                    {d.token}
                  </code>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* TIPOGRAFIA */}
        <Section
          id="tipografia"
          titulo="Tipografia"
          pagina="43-45"
          descripcion="La tipografia oficial es Gotham, un tipo palo seco con varios grosores. Cada grosor tiene un uso especifico. Gotham es licencia comercial de Hoefler & Co y no puede servirse desde un CDN, por lo que se declara como primer valor y se usa Montserrat como sustituta geometrica."
        >
          <div className="mb-5 rounded-[14px] border border-[#DCDCDC] bg-white p-4">
            <p className="text-xs font-bold tracking-wider uppercase text-[#475569]">
              Familia en uso
            </p>
            <p
              className="mt-1 text-3xl font-bold"
              style={{ fontFamily: 'var(--sat-fuente)' }}
            >
              Supermanes Vector 123
            </p>
            <code className="mt-2 block font-mono text-[11px] text-[#475569]">
              --sat-fuente: &quot;Gotham&quot;, &quot;Montserrat&quot;, sans-serif
            </code>
          </div>

          <ul className="space-y-3">
            {TIPOGRAFIA.map((g) => (
              <li key={g.nombre} className="rounded-[16px] border border-[#DCDCDC] bg-white p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-black text-[#14649B]">
                    {g.nombre}
                    {g.peso === 800 && (
                      <span className="ml-2 rounded bg-[#DCDCDC] px-1.5 py-0.5 text-[10px] font-bold text-[#19324B]">
                        aproximacion por licencia
                      </span>
                    )}
                  </span>
                  <code className="font-mono text-[11px] text-[#475569]">
                    font-weight {g.peso}
                  </code>
                </div>
                <p
                  className="mt-2 text-2xl leading-tight"
                  style={{ fontWeight: g.peso, fontFamily: 'var(--sat-fuente)' }}
                >
                  Contribución Conjunto
                </p>
                <dl className="mt-3 space-y-1 text-xs leading-relaxed text-[#475569]">
                  <div>
                    <dt className="inline font-bold text-[#19324B]">Uso principal: </dt>
                    <dd className="inline">{g.principal}</dd>
                  </div>
                  {g.secundario !== '—' && (
                    <div>
                      <dt className="inline font-bold text-[#19324B]">Uso secundario: </dt>
                      <dd className="inline">{g.secundario}</dd>
                    </div>
                  )}
                </dl>
              </li>
            ))}
          </ul>
        </Section>

        {/* ISOLOGOTIPO */}
        <Section
          id="isologotipo"
          titulo="Isologotipo"
          pagina="34-37"
          descripcion="El isologotipo esta compuesto por tres elementos que forman un todo: el isotipo, la tipografia SAT y el nombre oficial. No deben separarse ni utilizar sus partes por separado."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4 rounded-[16px] border border-[#DCDCDC] bg-white p-4">
              <h3 className="text-sm font-black">Construccion y dimensiones</h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                <dt className="font-bold">Referencia</dt>
                <dd className="font-mono text-[#475569]">2.5 x 8</dd>
                <dt className="font-bold">Proporcion</dt>
                <dd className="font-mono text-[#475569]">3.125:1</dd>
                <dt className="font-bold">Tamano optimo</dt>
                <dd className="font-mono text-[#475569]">5.0 cm x 1.60 cm</dd>
                <dt className="font-bold">Tamano minimo</dt>
                <dd className="font-mono text-[#475569]">4.0 cm x 1.25 cm</dd>
                <dt className="font-bold">Posicion</dt>
                <dd className="text-[#475569]">Esquina inferior derecha</dd>
                <dt className="font-bold">Con otros logos</dt>
                <dd className="text-[#475569]">
                  SAT siempre al ultimo, ocupando entre el 6% y el 10% del area de diseno
                </dd>
                <dt className="font-bold">Separacion</dt>
                <dd className="text-[#475569]">Una referencia respecto al logo anterior</dd>
              </dl>
            </div>

            <div className="space-y-4 rounded-[16px] border border-[#DCDCDC] bg-white p-4">
              <h3 className="text-sm font-black">Zona de resguardo</h3>
              <p className="text-xs leading-relaxed text-[#475569]">
                El margen de respiro coincide con el ancho de una referencia de construccion.
                Ningun elemento puede invadir esta area.
              </p>
              <div
                className="relative flex h-32 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: 'var(--sat-azul)',
                  outline: '1px dashed rgba(255,255,255,0.6)',
                  outlineOffset: '-14px',
                }}
              >
                <div className="text-center text-white">
                  <p className="text-2xl font-black">SAT</p>
                  <p className="text-[10px] tracking-widest uppercase">
                    S. de A. T.
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#475569]">
                Marcador de posicion. El archivo vectorial oficial aun no esta disponible en el
                repositorio.
              </p>
            </div>
          </div>
        </Section>

        {/* ESLOGAN */}
        <Section
          id="eslogan"
          titulo="Eslogan"
          pagina="58-59"
          descripcion="El cintillo institucional lleva el eslogan con Gotham Black Italic en la primera palabra y Gotham Medium Italic en el resto, con un interletrado de -25 y efecto de superposicion por multiplicacion. El cintillo se completa con la abstraccion de la bandera."
        >
          <div className="overflow-hidden rounded-[16px] border border-[#DCDCDC] bg-white">
            <div
              className="flex flex-wrap items-center justify-between gap-4 p-6"
              style={{ backgroundImage: 'var(--sat-degradado-2-3)' }}
            >
              <p
                className="text-3xl italic sm:text-4xl"
                style={{
                  color: '#fff',
                  letterSpacing: 'var(--sat-eslogan-tracking)',
                  fontFamily: 'var(--sat-eslogan-font)',
                }}
              >
                <span style={{ fontWeight: 900 }}>Contribuyendo</span>{' '}
                <span style={{ fontWeight: 500 }}>juntos por Guatemala</span>
              </p>
            </div>
            <div className="space-y-1.5 p-4">
              <code className="block font-mono text-[11px] text-[#475569]">
                --sat-eslogan-tracking: -0.025em
              </code>
              <p className="text-xs leading-relaxed text-[#475569]">
                El eslogan puede usarse sin cintillo, siempre acompanado de la abstraccion de la
                bandera.
              </p>
            </div>
          </div>
        </Section>

        {/* PATRON */}
        <Section
          id="patron"
          titulo="Patron grafico"
          pagina="38-41"
          descripcion="El patron genera lineas de tension con movimiento creciente, siempre hacia arriba y siempre hacia adelante. Las esquinas se redondean para brindar suavidad. Aunque su uso es libre, es preferible combinarlo con los tres elementos que lo conforman: servicio, transparencia e innovacion."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {['Servicio', 'Transparencia', 'Innovacion'].map((nombre, i) => (
              <div
                key={nombre}
                className="flex h-32 items-center justify-center rounded-[16px] text-center"
                style={{
                  backgroundImage:
                    i === 0
                      ? 'var(--sat-degradado-1-2)'
                      : i === 1
                        ? 'var(--sat-degradado-2-3)'
                        : 'var(--sat-degradado-1-6)',
                }}
              >
                <span className="px-3 text-sm font-black text-[#19324B] mix-blend-multiply">
                  {nombre}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* TONO */}
        <Section
          id="tono"
          titulo="Tono y lenguaje"
          pagina="48-51"
          descripcion="El tono es la manera en que nos expresamos con quienes reciben nuestros mensajes. En la mayoria de nuestra comunicacion nos dirigiremos al contribuyente de TÚ, por ser un trato amigable y cercano. En casos especiales, donde la comunicacion deba ser formal e institucional, nos dirigiremos de usted."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[16px] border border-[#DCDCDC] bg-white p-4">
              <h3 className="text-sm font-black">Tono</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {['Amigable', 'Propositivo', 'Cercano'].map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-[#14649B] px-3 py-1 text-xs font-bold text-white"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                Dirigirse de <strong className="text-[#19324B]">TU</strong> al contribuyente.{' '}
                <strong className="text-[#19324B]">USTED</strong> solo en casos especiales de
                comunicacion formal e institucional.
              </p>
            </div>
            <div className="rounded-[16px] border border-[#DCDCDC] bg-white p-4">
              <h3 className="text-sm font-black">Lenguaje</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {['Accesible', 'Concreto', 'Directo'].map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-[#19AFE1] px-3 py-1 text-xs font-bold text-[#19324B]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                Los temas tributarios deben ser entendibles a todo nivel, de manera sencilla,
                evitando el lenguaje tecnico y la sobresaturacion de informacion.
              </p>
            </div>
          </div>
        </Section>

        {/* RESTRICCIONES */}
        <Section
          id="restricciones"
          titulo="Restricciones y uso incorrecto"
          pagina="19-21"
          descripcion="Aplican al isologotipo y a todos los componentes de la identidad."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[16px] border border-[#DCDCDC] bg-white p-4">
              <h3 className="text-sm font-black">No permitido</h3>
              <ul className="mt-3 space-y-2">
                {RESTRICCIONES.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-[#475569]">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: 'var(--sat-comp-naranja)' }}
                    />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[16px] border border-[#DCDCDC] bg-white p-4">
              <h3 className="text-sm font-black">Casos frecuentes de uso incorrecto</h3>
              <ul className="mt-3 space-y-2">
                {USO_INCORRECTO.map((u) => (
                  <li key={u.titulo} className="rounded-lg bg-[#F4F6F9] p-3">
                    <p className="text-sm font-bold text-[#19324B]">{u.titulo}</p>
                    <p className="mt-0.5 text-xs text-[#475569]">{u.descripcion}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* CONTRASTE */}
        <Section
          id="contraste"
          titulo="Contraste de color"
          pagina="—"
          descripcion="Razones de contraste medidas con la formula de WCAG 2.1 sobre los valores reales de la paleta. El blanco NO alcanza AA sobre celeste, verde, ambar, naranja ni gris: sobre cualquiera de esos cinco fondos el texto debe ser azul oscuro. Por eso existen los tokens --sat-ui-texto-sobre-*."
        >
          <div className="overflow-x-auto rounded-[16px] border border-[#DCDCDC] bg-white">
            <table className="w-full text-sm">
              <caption className="sr-only">Contraste de texto sobre cada color de la paleta</caption>
              <thead>
                <tr className="border-b border-[#DCDCDC] bg-[#F4F6F9] text-left">
                  <th scope="col" className="px-4 py-3 font-black">
                    Fondo
                  </th>
                  <th scope="col" className="px-4 py-3 font-black">
                    Token de texto
                  </th>
                  <th scope="col" className="px-4 py-3 font-black">
                    Blanco
                  </th>
                  <th scope="col" className="px-4 py-3 font-black">
                    Azul oscuro
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONTRASTE.map((c) => {
                  const blancoOk = c.blanco.endsWith('AA');
                  const oscuroOk = c.oscuro.endsWith('AA');
                  return (
                    <tr key={c.fondo} className="border-b border-[#DCDCDC] last:border-b-0">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-6 w-6 shrink-0 rounded border border-[#DCDCDC]"
                            style={{ backgroundColor: c.fondo }}
                          />
                          <code className="font-mono text-xs">{c.fondo}</code>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <code className="font-mono text-[11px] text-[#475569]">{c.token}</code>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-2 py-0.5 font-mono text-[11px] font-bold text-white"
                          style={{
                            backgroundColor: blancoOk ? 'var(--sat-ui-exito)' : 'var(--sat-ui-error)',
                          }}
                        >
                          {c.blanco}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-2 py-0.5 font-mono text-[11px] font-bold text-white"
                          style={{
                            backgroundColor: oscuroOk ? 'var(--sat-ui-exito)' : 'var(--sat-ui-error)',
                          }}
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
        </Section>

        {/* TOKENS DE INTERFAZ */}
        <Section
          id="interfaz"
          titulo="Tokens de interfaz"
          pagina="—"
          descripcion="El manual no define componentes de interfaz de usuario. Estos tokens son decisiones de proyecto para traducir la identidad a una aplicacion web. Requieren visto bueno de Comunicacion Social Externa."
        >
          <div className="space-y-4">
            <div className="rounded-[16px] border border-[#DCDCDC] bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black">Roles de color</h3>
                <Badge autoridad="DERIVADO" />
              </div>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  ['--sat-ui-fondo', '#FFFFFF', 'Fondo base'],
                  ['--sat-ui-fondo-tenue', '#F4F6F9', 'Fondo de seccion'],
                  ['--sat-ui-fondo-medio', '#E9EDF2', 'Fondo hundido'],
                  ['--sat-ui-borde', '#DCDCDC', 'Borde estandar'],
                  ['--sat-ui-borde-fuerte', '#B9C3CD', 'Borde enfocado'],
                  ['--sat-ui-texto', '#19324B', 'Texto principal'],
                  ['--sat-ui-texto-suave', '#475569', 'Texto secundario'],
                  ['--sat-ui-texto-tenue', '#64748B', 'Texto terciario'],
                  ['--sat-ui-foco', '#14649B', 'Anillo de foco'],
                ].map(([token, hex, uso]) => (
                  <li key={token} className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 shrink-0 rounded-lg border border-[#DCDCDC]"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="min-w-0">
                      <code className="block font-mono text-[11px] break-all">{token}</code>
                      <span className="text-[11px] text-[#475569]">
                        {hex} · {uso}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[16px] border border-[#DCDCDC] bg-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black">Espaciado</h3>
                  <Badge autoridad="DERIVADO" />
                </div>
                <p className="mt-1 text-xs text-[#475569]">Base 8px.</p>
                <div className="mt-3 flex flex-wrap items-end gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <div key={n} className="text-center">
                      <div
                        className="rounded-sm"
                        style={{ width: `var(--sat-space-${n})`, height: 20, backgroundColor: 'var(--sat-azul)' }}
                      />
                      <span className="mt-1 block font-mono text-[10px] text-[#475569]">{n}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[16px] border border-[#DCDCDC] bg-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black">Radios y elevacion</h3>
                  <Badge autoridad="DERIVADO" />
                </div>
                <p className="mt-1 text-xs text-[#475569]">
                  El manual exige redondear esquinas para dar suavidad al patron, pero no fija radios
                  exactos.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {[
                    ['sm', 'var(--sat-radio-sm)'],
                    ['md', 'var(--sat-radio-md)'],
                    ['lg', 'var(--sat-radio-lg)'],
                  ].map(([n, v]) => (
                    <div key={n} className="text-center">
                      <div
                        className="h-12 w-20 border border-[#DCDCDC] bg-[#F4F6F9]"
                        style={{ borderRadius: v }}
                      />
                      <span className="mt-1 block font-mono text-[10px] text-[#475569]">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* PENDIENTES */}
        <Section
          id="pendientes"
          titulo="Pendientes con Comunicacion Social Externa"
          pagina="—"
          descripcion="Puntos que requieren confirmacion oficial antes de cierra el sistema de diseno."
        >
          <ul className="space-y-3">
            {[
              'Obtener el archivo vectorial oficial del isologotipo. El encabezado actual usa un marcador tipografico fabricado, lo cual no cumple el manual.',
              'Licenciar Gotham. Hasta entonces se usa Montserrat como sustituta geometrica.',
              'Validar el peso Ultra. No es representable en una fuente variable comun; se aproxima con peso 800.',
              'Aprobar o rechazar los tokens de interfaz, que no tienen respaldo normativo.',
              'Confirmar la numeracion de la paleta usada en los degradados oficiales (p.25).',
            ].map((p, i) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-[14px] border border-[#DCDCDC] bg-white p-4"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                  style={{ backgroundColor: 'var(--sat-azul)' }}
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-[#475569]">{p}</span>
              </li>
            ))}
          </ul>
        </Section>
      </main>

      <footer className="mt-8 bg-[#19324B] py-6 text-center text-xs text-white/70">
        <p>
          Design System SAT · tokens en <code>src/design-system/tokens.css</code>
        </p>
        <p className="mt-1">
          Documento de trabajo derivado del Manual de Imagen y Normas Graficas SAT V.5.
        </p>
      </footer>
    </div>
  );
}