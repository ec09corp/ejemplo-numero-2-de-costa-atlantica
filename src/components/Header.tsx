import React from 'react';
import { ShoppingBag, QrCode } from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenQR: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenQR,
}) => {
  return (
    <header
      id="main-restaurant-header"
      className="sticky top-0 z-40 w-full bg-[#081E3D] border-b border-cyan-900/60 shadow-lg text-white"
    >
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand identity: Logo + Name + "MENÚ DIGITAL" */}
        <div className="flex items-center gap-2 min-w-0">
          <Logo size="md" variant="compact" />
        </div>

        {/* Right side actions: QR Code button & Cart button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* QR Code button in the top right corner */}
          <motion.button
            id="btn-header-qrcode"
            whileTap={{ scale: 0.94 }}
            onClick={onOpenQR}
            title="Ver Código QR para escanear en mesa o celular"
            aria-label="Abrir código QR del menú"
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-full text-xs font-bold text-cyan-200 bg-white/10 hover:bg-white/20 active:bg-white/25 border border-cyan-400/40 shadow-sm transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-cyan-300 shrink-0" />
            <span className="hidden xs:inline">Código QR</span>
            <span className="xs:hidden">QR</span>
          </motion.button>

          {/* Cart Icon in top-right corner */}
          <motion.button
            id="btn-header-cart-icon"
            whileTap={{ scale: 0.94 }}
            onClick={onOpenCart}
            aria-label="Abrir carrito de compras"
            className="relative flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 active:from-cyan-700 active:to-sky-700 text-white px-3.5 py-2 rounded-full font-bold shadow-md shadow-cyan-950/40 border border-cyan-300/30 transition-all duration-200"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-white" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow border-2 border-[#081E3D]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Total display */}
            <span className="text-xs font-bold tracking-tight pr-0.5">
              {cartCount > 0 ? (
                <span>${cartTotal.toFixed(2)}</span>
              ) : (
                <span className="hidden xs:inline text-cyan-100">Carrito</span>
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

