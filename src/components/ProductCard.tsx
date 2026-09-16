import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Check, Minus } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, delta: number) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onViewDetails,
}) => {
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.disponible) return;

    onAddToCart(product);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1200);
  };

  return (
    <article
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails?.(product)}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 ${
        !product.disponible ? 'opacity-75 grayscale-20' : 'cursor-pointer'
      }`}
    >
      {/* Photo Container - Large, high-resolution and realistic */}
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient vignette for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Badges / Tags */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {product.destacado && product.disponible && (
            <span className="bg-[#081E3D]/90 backdrop-blur-xs text-cyan-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs tracking-wider border border-cyan-400/30">
              RECOMENDADO
            </span>
          )}
          {product.tags && product.tags[0] && !product.destacado && product.disponible && (
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {product.tags[0]}
            </span>
          )}
        </div>

        {/* AGOTADO Badge if unavailable */}
        {!product.disponible && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-red-600/95 text-white font-black text-xs sm:text-sm tracking-widest px-4 py-1.5 rounded-full uppercase shadow-lg border border-red-400">
              AGOTADO
            </span>
          </div>
        )}

        {/* In-cart indicator badge on the image */}
        {quantityInCart > 0 && product.disponible && (
          <div className="absolute top-2.5 right-2.5 bg-cyan-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md border border-white/60 flex items-center gap-1 z-10">
            <span>{quantityInCart}</span>
            <span className="text-[10px] uppercase font-semibold">en pedido</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between">
        <div>
          <h3 className="font-['Outfit'] font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight uppercase group-hover:text-cyan-800 transition-colors">
            {product.name}
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price & Action Button Row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Precio
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#081E3D] tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Action button */}
          {!product.disponible ? (
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl cursor-not-allowed">
              No disponible
            </span>
          ) : quantityInCart > 0 ? (
            /* Compact stepper when already in cart */
            <div
              className="flex items-center bg-cyan-50 border border-cyan-200 rounded-xl p-0.5 shadow-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id={`btn-minus-${product.id}`}
                onClick={() => onUpdateQuantity(product, -1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-cyan-900 hover:bg-cyan-200/70 active:scale-95 transition-colors cursor-pointer"
                title="Disminuir"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="w-6 text-center font-extrabold text-sm text-cyan-950">
                {quantityInCart}
              </span>
              <button
                id={`btn-plus-${product.id}`}
                onClick={() => onUpdateQuantity(product, 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-600 text-white hover:bg-cyan-500 active:scale-95 shadow-xs transition-colors cursor-pointer"
                title="Aumentar"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            /* AGREGAR button as specifically requested */
            <motion.button
              id={`btn-add-${product.id}`}
              whileTap={{ scale: 0.94 }}
              onClick={handleAdd}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide uppercase flex items-center gap-1.5 shadow-xs transition-all duration-200 cursor-pointer ${
                isAddedRecently
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#081E3D] hover:bg-cyan-700 active:bg-cyan-800 text-white'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡LISTO!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>AGREGAR</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </article>
  );
};
