import React, { useState } from 'react';
import { Product } from '../types';
import { X, Plus, Minus, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    if (!product.disponible) return;
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 700);
  };

  return (
    <AnimatePresence>
      <div
        id="product-detail-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          id="product-detail-modal-card"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-auto"
        >
          {/* Close button */}
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo banner */}
          <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {!product.disponible && (
              <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                <span className="bg-red-600 text-white font-black text-sm tracking-widest px-5 py-2 rounded-full uppercase shadow-xl">
                  AGOTADO POR HOY
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest">
                  {product.category}
                </span>
                {product.destacado && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Plato Estrella
                  </span>
                )}
              </div>

              <h2 className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-slate-900 uppercase tracking-tight">
                {product.name}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2">
                {product.description}
              </p>
            </div>

            {/* Freshness & Quality Badges */}
            <div className="flex flex-wrap gap-2 py-1 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                Marisco 100% fresco
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                🍋 Limón natural
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                Prep. al instante
              </span>
            </div>

            {/* Price & Add Row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Total
                </span>
                <span className="text-2xl font-black text-[#081E3D]">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>

              {product.disponible ? (
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white active:scale-95 transition-colors cursor-pointer"
                      title="Menos"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#081E3D] text-white hover:bg-cyan-700 active:scale-95 transition-colors cursor-pointer"
                      title="Más"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    id="btn-modal-add-to-cart"
                    onClick={handleAdd}
                    className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2 shadow-md cursor-pointer transition-all ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#081E3D] hover:bg-cyan-700 active:bg-cyan-800 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>AGREGADO</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>AGREGAR AL PEDIDO</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2.5 rounded-xl uppercase">
                  Agotado
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
