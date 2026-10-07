import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Layers, X, Menu } from 'lucide-react';

export interface SidebarCategory {
  name: string;
  count?: number;
  subcategories: string[];
}

export interface SidebarNavProps {
  segmentTitle: string;
  segmentShortTitle?: string;
  segmentColor?: string;
  categories: SidebarCategory[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onSelectCategory: (category: string) => void;
  onSelectSubcategory: (category: string, subcategory: string) => void;
  onResetToSegment?: () => void;
  className?: string;
}

/**
 * SidebarNav SAT — Componente Oficial de Navegación Contextual Local (Nivel 4+)
 *
 * Implementa el patrón dual de navegación:
 * - Desktop (>= 1024px): Menú lateral vertical fijo/adherente (sticky) con sub-árbol del área activa.
 * - Mobile (< 1024px): Drawer off-canvas accesible activado mediante botón flotante o de barra.
 *
 * Regla de Oro: Arquitectura != Navegación. No replica 8 niveles visuales; muestra el contexto local relevante.
 */
export const SidebarNav: React.FC<SidebarNavProps> = ({
  segmentTitle,
  segmentShortTitle,
  segmentColor = '#14649B',
  categories,
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory,
  onResetToSegment,
  className = '',
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  // Control de acordeones abiertos por categoría
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Mantener expandida automáticamente la categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      setExpandedCategories((prev) => ({
        ...prev,
        [selectedCategory]: true,
      }));
    }
  }, [selectedCategory]);

  const toggleCategoryExpand = (catName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const handleCategoryClick = (catName: string) => {
    onSelectCategory(catName);
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: true,
    }));
  };

  const handleSubcategoryClick = (catName: string, subName: string) => {
    onSelectSubcategory(catName, subName);
    setMobileDrawerOpen(false); // Cerrar drawer en móvil tras selección
  };

  const activeTitle = selectedSubcategory || selectedCategory || segmentShortTitle || segmentTitle;

  const renderTreeContent = () => (
    <div className="space-y-4">
      {/* Cabecera del Segmento */}
      <div className="pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: segmentColor }}
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Navegación Contextual
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onResetToSegment) onResetToSegment();
            setMobileDrawerOpen(false);
          }}
          className="text-left font-bold text-xs text-[#19324B] hover:text-[#14649B] transition-colors line-clamp-1"
          title={`Ver todo ${segmentTitle}`}
        >
          {segmentTitle}
        </button>
      </div>

      {/* Árbol de Categorías y Subtemas */}
      <nav aria-label="Temas de esta sección" className="space-y-1">
        {categories.map((cat) => {
          const isCatSelected = selectedCategory === cat.name;
          const isExpanded = !!expandedCategories[cat.name] || isCatSelected;
          const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;

          return (
            <div key={cat.name} className="space-y-0.5">
              {/* Fila de Categoría */}
              <div
                className={`group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  isCatSelected && !selectedSubcategory
                    ? 'bg-[#14649B] text-white shadow-xs'
                    : isCatSelected
                    ? 'bg-[#14649B]/10 text-[#14649B] font-bold'
                    : 'text-[#334155] hover:bg-[#F1F5F9] hover:text-[#19324B]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex-1 text-left truncate py-0.5"
                  title={cat.name}
                >
                  <span className="truncate">{cat.name}</span>
                </button>

                {hasSubcategories && (
                  <button
                    type="button"
                    onClick={(e) => toggleCategoryExpand(cat.name, e)}
                    className="p-2 -m-1 rounded hover:bg-black/10 transition-colors focus:outline-none"
                    aria-label={isExpanded ? `Contraer ${cat.name}` : `Expandir ${cat.name}`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>

              {/* Sub-árbol de Subcategorías (Nivel 4/Hubs) */}
              {hasSubcategories && isExpanded && (
                <div className="pl-3.5 ml-2 border-l border-[#CBD5E1] space-y-0.5 py-0.5 animate-in fade-in duration-100">
                  {cat.subcategories.map((sub) => {
                    const isSubSelected = isCatSelected && selectedSubcategory === sub;

                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubcategoryClick(cat.name, sub)}
                        className={`w-full text-left truncate px-2 py-1 rounded-md text-[11px] transition-all block ${
                          isSubSelected
                            ? 'bg-[#14649B] text-white font-bold shadow-xs'
                            : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#19324B]'
                        }`}
                        title={sub}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* ==============================================================
          1. BARRA / BOTÓN MÓVIL (< 1024px)
          ============================================================== */}
      <div className="lg:hidden w-full mb-3">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-bold text-[#19324B] shadow-xs active:bg-[#EDF2F7] transition-all"
          aria-expanded={mobileDrawerOpen}
        >
          <div className="flex items-center gap-2 truncate">
            <Layers className="w-4 h-4 text-[#14649B] shrink-0" aria-hidden="true" />
            <span className="text-[#64748B]">Temas de sección:</span>
            <span className="truncate text-[#14649B]">{activeTitle}</span>
          </div>
          <Menu className="w-4 h-4 text-[#64748B] shrink-0" aria-hidden="true" />
        </button>

        {/* DRAWER OFF-CANVAS MÓVIL */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
            {/* Backdrop oscuro */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
              aria-hidden="true"
            />

            {/* Contenedor del Drawer */}
            <div className="relative ml-auto w-full max-w-xs h-full bg-white shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0]">
                  <h3 className="font-bold text-sm text-[#19324B]">Temas de esta sección</h3>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#19324B] focus:outline-none"
                    aria-label="Cerrar menú de temas"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                {renderTreeContent()}
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] mt-6">
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#334155] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==============================================================
          2. SIDEBAR VERTICAL FIJO DESKTOP (>= 1024px)
          ============================================================== */}
      <aside
        aria-label="Navegación contextual lateral"
        className={`hidden lg:block w-64 shrink-0 self-start sticky top-24 bg-white rounded-2xl border border-[#DCDCDC] p-4 shadow-xs ${className}`}
      >
        {renderTreeContent()}
      </aside>
    </>
  );
};

export default SidebarNav;
