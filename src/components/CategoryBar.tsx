import React, { useRef, useEffect } from 'react';
import { Category, CategoryId } from '../types';

interface CategoryBarProps {
  categories: Category[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll the active category button into view horizontally on mobile
  useEffect(() => {
    if (activeBtnRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeBtnRef.current;
      const scrollLeft = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  return (
    <nav
      id="category-navigation-bar"
      aria-label="Categorías del Menú"
      className="sticky top-16 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
    >
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none no-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                id={`cat-btn-${category.id}`}
                ref={isActive ? activeBtnRef : null}
                onClick={() => onSelectCategory(category.id)}
                className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#081E3D] text-white shadow-md shadow-slate-900/20 ring-2 ring-cyan-500/50'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {category.name}
                  {isActive && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
