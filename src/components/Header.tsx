import React from 'react';
import { ShoppingBag, Settings2, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenSettings: () => void;
  whatsappDisplay: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenSettings,
  whatsappDisplay,
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

        {/* Right side actions: WhatsApp Orders badge & Cart button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Direct WhatsApp info button */}
          <button
            id="btn-header-config-whatsapp"
            onClick={onOpenSettings}
            title={`Pedidos por WhatsApp: ${whatsappDisplay}. Clic para configurar`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]/20" />
            <span className="hidden md:inline">WhatsApp: {whatsappDisplay}</span>
            <Settings2 className="w-3 h-3 text-emerald-400/80 ml-0.5" />
          </button>

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

            {/* Total display on larger screens / mobile compact */}
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

