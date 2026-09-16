import React from 'react';
import { Logo } from './Logo';
import { Search, Clock, MapPin, X } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface MenuHeaderBannerProps {
  config: RestaurantConfig;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MenuHeaderBanner: React.FC<MenuHeaderBannerProps> = ({
  config,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div
      id="menu-top-banner"
      className="w-full bg-gradient-to-b from-[#081E3D] via-[#0C2B54] to-slate-50 pt-5 pb-4 px-4 text-white text-center border-b border-slate-200/50"
    >
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Main Badge Logo as requested: LOGO -> DELICIAS DEL ATLÁNTICO */}
        <Logo size="lg" variant="badge" className="text-white" />

        {/* Short coastal tagline */}
        <p className="text-xs sm:text-sm text-cyan-200/90 max-w-sm mt-1 leading-snug font-medium">
          {config.tagline}
        </p>

        {/* Quick status pill */}
        <div className="flex items-center justify-center flex-wrap gap-2 text-[11px] text-cyan-100/80 mt-2.5">
          <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Abierto ahora
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
            <Clock className="w-3 h-3 text-cyan-300" />
            {config.schedule}
          </span>
        </div>

        {/* Instant Search Bar */}
        <div className="w-full mt-4 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="input-menu-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar ceviche, camarón, pescado..."
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-2xl shadow-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
