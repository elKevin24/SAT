import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Home, MoreHorizontal, ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
  /** Texto legible en lenguaje ciudadano (sin números iniciales ni códigos burocráticos) */
  label: string;
  /** Enlace opcional */
  href?: string;
  /** Acción de clic (para Single Page Applications o navegación interna) */
  onClick?: () => void;
  /** Marca explícita de ítem activo / página actual */
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  /** Lista ordenada de niveles desde el macro (Nivel 1) hasta el trámite o página actual (Nivel N) */
  items: BreadcrumbItem[];
  /** Si debe incluir el ítem raíz 'Inicio' por defecto (por defecto true) */
  includeHome?: boolean;
  /** Enlace para el ítem de inicio */
  homeHref?: string;
  /** Clic para el ítem de inicio */
  onHomeClick?: () => void;
  /** Cantidad máxima de ítems visibles en móvil antes de compactar con [...] (por defecto 3) */
  maxMobileItems?: number;
  /** Variante visual: 'standard' (elipsis interactiva en móvil) o 'back-only' (botón de retorno al padre) */
  mobileVariant?: 'standard' | 'back-only';
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

/**
 * Breadcrumbs SAT — Componente Oficial del Sistema de Diseño SAT
 *
 * Implementa la especificación de navegación profunda y compactación móvil:
 * - Desktop (>= 1024px): Muestra la ruta completa o balanceada.
 * - Mobile (< 1024px): Compacta niveles intermedios bajo [...] interactivo o botón '‹ Regresar a [Padre]'.
 * - WCAG 2.2 AA: <nav aria-label="Miga de pan">, <ol>, <li>, aria-current="page".
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  includeHome = true,
  homeHref,
  onHomeClick,
  maxMobileItems = 3,
  mobileVariant = 'standard',
  className = '',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  // Cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Lista consolidada incluyendo 'Inicio' si aplica
  const fullList: BreadcrumbItem[] = [
    ...(includeHome
      ? [
          {
            label: 'Inicio',
            href: homeHref,
            onClick: onHomeClick,
          },
        ]
      : []),
    ...items,
  ];

  if (fullList.length === 0) return null;

  const total = fullList.length;
  const parentItem = total >= 2 ? fullList[total - 2] : null;

  // En móvil con variante 'back-only', mostramos un enlace directo al padre inmediato
  if (mobileVariant === 'back-only' && parentItem) {
    return (
      <nav aria-label="Navegación de retorno" className={`lg:hidden ${className}`}>
        <button
          type="button"
          onClick={parentItem.onClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sat-azul hover:text-sat-azul-oscuro transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-sat-azul" aria-hidden="true" />
          <span>Volver a {parentItem.label}</span>
        </button>
      </nav>
    );
  }

  // Partición para compactación en pantallas móviles
  // Regla estricta: 'Inicio' es el ancla raíz del portal y NO cuenta como parte de los niveles de contenido.
  // maxMobileItems aplica exclusivamente a los niveles jerárquicos de contenido (items).
  const rootAnchor: BreadcrumbItem | null = includeHome
    ? { label: 'Inicio', href: homeHref, onClick: onHomeClick }
    : items.length > 0
    ? items[0]
    : null;

  const contentItems = includeHome ? items : items.slice(1);
  const shouldCompactMobile = contentItems.length > maxMobileItems;
  const lastItems = shouldCompactMobile ? contentItems.slice(-maxMobileItems) : contentItems;
  const hiddenItems = shouldCompactMobile ? contentItems.slice(0, -maxMobileItems) : [];

  return (
    <nav
      aria-label="Miga de pan"
      className={`text-xs font-medium text-sat-texto-suave py-0.5 ${className}`}
    >
      {/* ==============================================================
          1. VISTA DESKTOP (>= 1024px) — Ruta completa
          ============================================================== */}
      <ol className="hidden lg:flex items-center flex-wrap gap-1 sm:gap-1.5 list-none m-0 p-0">
        {fullList.map((item, index) => {
          const isLast = index === total - 1 || item.isCurrent;
          const isHome = index === 0 && includeHome;

          return (
            <li key={`desk-${index}-${item.label}`} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-[#94A3B8] shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  aria-current="page"
                  className="font-bold text-sat-azul-oscuro truncate max-w-[280px]"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : item.onClick || item.href ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="inline-flex items-center gap-1 hover:text-sat-azul transition-colors hover:underline focus:outline-none focus:ring-1 focus:ring-sat-azul rounded px-0.5 truncate max-w-[220px]"
                  title={item.label}
                >
                  {isHome && <Home className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                  <span className="truncate">{item.label}</span>
                </button>
              ) : (
                <span className="text-sat-texto-suave truncate max-w-[220px]" title={item.label}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* ==============================================================
          2. VISTA MÓVIL (< 1024px) — Compactación inteligente con [...]
          ============================================================== */}
      <ol className="flex lg:hidden items-center flex-wrap gap-1 sm:gap-1.5 list-none m-0 p-0">
        {/* Ancla raíz ('Inicio' o primer nivel) — NO cuenta contra el límite móvil */}
        {rootAnchor && (
          <li className="inline-flex items-center gap-1">
            {rootAnchor.onClick ? (
              <button
                type="button"
                onClick={rootAnchor.onClick}
                className="inline-flex items-center gap-1 hover:text-sat-azul transition-colors focus:outline-none"
                title={rootAnchor.label}
              >
                {includeHome ? (
                  <Home className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <span>{rootAnchor.label}</span>
                )}
              </button>
            ) : (
              <span>
                {includeHome ? <Home className="w-3.5 h-3.5" aria-hidden="true" /> : rootAnchor.label}
              </span>
            )}
          </li>
        )}

        {/* Botón Elíptico [...] interactivo para desplegar niveles intermedios */}
        {shouldCompactMobile && (
          <li className="inline-flex items-center gap-1.5 relative" ref={menuRef}>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center h-5 w-6 rounded bg-sat-fondo-tenue text-sat-texto hover:bg-sat-gris border border-[#DCDCDC] transition-colors focus:outline-none focus:ring-1 focus:ring-sat-azul text-[11px] font-bold"
              aria-label={`Ver ${hiddenItems.length} niveles intermedios`}
              aria-expanded={isMenuOpen}
            >
              <MoreHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {/* Menú emergente de niveles colapsados */}
            {isMenuOpen && (
              <div
                role="menu"
                className="absolute top-full left-0 mt-1.5 w-64 rounded-lg bg-white p-1.5 shadow-xl border border-[#DCDCDC] z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sat-texto-suave border-b border-[#F1F5F9] mb-1">
                  Niveles anteriores
                </div>
                {hiddenItems.map((hidden, hIdx) => (
                  <button
                    key={`hidden-${hIdx}-${hidden.label}`}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (hidden.onClick) hidden.onClick();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-sat-texto hover:bg-sat-fondo-tenue hover:text-sat-azul rounded font-medium transition-colors truncate block"
                  >
                    {hidden.label}
                  </button>
                ))}
              </div>
            )}
          </li>
        )}

        {/* Niveles finales visibles */}
        {lastItems.map((item, idx) => {
          const isActualLast = idx === lastItems.length - 1;
          return (
            <li key={`mob-last-${idx}-${item.label}`} className="inline-flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" aria-hidden="true" />
              {isActualLast ? (
                <span
                  aria-current="page"
                  className="font-bold text-sat-azul-oscuro truncate max-w-[160px]"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-sat-azul transition-colors truncate max-w-[130px]"
                  title={item.label}
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
