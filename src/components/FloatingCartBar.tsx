import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingCartBarProps {
  totalItems: number;
  totalPrice: number;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  totalItems,
  totalPrice,
  onOpenCart,
}) => {
  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          id="floating-cart-bar-container"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-4 inset-x-0 z-40 px-3 sm:px-4 pointer-events-none"
        >
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              id="btn-floating-cart"
              onClick={onOpenCart}
              className="w-full bg-[#081E3D] hover:bg-[#0C2B54] active:scale-[0.98] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-cyan-950/40 border border-cyan-400/30 flex items-center justify-between cursor-pointer transition-all group"
            >
              {/* Left icon & summary */}
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 flex items-center justify-center text-white shadow-inner">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#081E3D] shadow-xs">
                    {totalItems}
                  </span>
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-cyan-200">
                    {totalItems === 1 ? '1 producto seleccionado' : `${totalItems} productos en pedido`}
                  </span>
                  <span className="text-lg font-black text-white tracking-tight leading-tight">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Right CTA button */}
              <div className="flex items-center gap-1.5 bg-cyan-500 text-slate-950 px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wide group-hover:bg-cyan-400 shadow-sm transition-colors">
                <span>VER PEDIDO</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
