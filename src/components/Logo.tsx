import React from 'react';
import logoImg from '../assets/images/delicias_logo_1789583829461.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'badge';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'compact',
  className = '',
}) => {
  if (variant === 'badge') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative group">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-white p-2 shadow-2xl border-2 border-cyan-400/40 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
            <img
              src={logoImg}
              alt="Delicias del Atlántico - Mariscos y Ceviches"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#081E3D] text-[10px] sm:text-[11px] font-black tracking-widest text-cyan-300 uppercase px-3 py-0.5 rounded-full shadow-md border border-cyan-400/50 whitespace-nowrap">
            MARISCOS & CEVICHES
          </div>
        </div>
      </div>
    );
  }

  // Compact variant for Sticky Header
  const imgSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${imgSizes[size]} rounded-full bg-white p-0.5 shadow-md border-2 border-cyan-400/60 shrink-0 overflow-hidden`}>
        <img
          src={logoImg}
          alt="Delicias del Atlántico"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="font-['Outfit'] font-black tracking-tight text-white text-sm sm:text-base leading-none truncate">
          DELICIAS DEL ATLÁNTICO
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-cyan-300 uppercase mt-0.5 flex items-center gap-1">
          <span>MENÚ DIGITAL</span>
          <span className="inline-block w-1 h-1 rounded-full bg-cyan-400"></span>
          <span className="text-[9px] text-cyan-200 font-normal">PEDIDOS POR WHATSAPP</span>
        </span>
      </div>
    </div>
  );
};

