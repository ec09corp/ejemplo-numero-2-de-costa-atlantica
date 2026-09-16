import React, { useState } from 'react';
import { CartItem, RestaurantConfig } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  Receipt,
  UtensilsCrossed
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  config: RestaurantConfig;
  onUpdateConfig: (newConfig: Partial<RestaurantConfig>) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  config,
}) => {
  const [customerInfo, setCustomerInfo] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const generateWhatsAppMessage = (): string => {
    let msg = `Hola, ${config.name}.\n\nQuiero realizar el siguiente pedido:\n\n`;

    items.forEach((item) => {
      const linePrice = (item.product.price * item.quantity).toFixed(2);
      msg += `${item.quantity}x ${item.product.name} — $${linePrice}\n`;
    });

    msg += `\nTOTAL: $${subtotal.toFixed(2)}`;

    if (customerInfo.trim()) {
      msg += `\n\nMesa / Cliente: ${customerInfo.trim()}`;
    }

    if (orderNotes.trim()) {
      msg += `\nNotas adicionales: ${orderNotes.trim()}`;
    }

    return msg;
  };

  const handleSendWhatsApp = () => {
    const text = generateWhatsAppMessage();
    let cleanNumber = config.whatsappNumber.replace(/\D/g, '');
    // Ensure Panama country code 507 is present if 8 digits starting with 6
    if (cleanNumber.length === 8) {
      cleanNumber = `507${cleanNumber}`;
    }
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${cleanNumber}?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Drawer Content */}
          <motion.div
            id="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#081E3D] text-white px-5 py-4 flex items-center justify-between border-b border-cyan-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-['Outfit'] text-lg font-black tracking-tight leading-none text-white">
                    TU PEDIDO
                  </h2>
                  <p className="text-[11px] font-semibold text-cyan-300 mt-1">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en la orden
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    id="btn-clear-cart"
                    onClick={onClearCart}
                    className="p-2 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Vaciar carrito"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Vaciar</span>
                  </button>
                )}

                <button
                  id="btn-close-cart"
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Cerrar pedido"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Cart Items List / Empty State */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <div className="w-20 h-20 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 mb-4">
                    <UtensilsCrossed className="w-9 h-9" />
                  </div>
                  <h3 className="font-['Outfit'] text-lg font-bold text-slate-800">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xs mt-1 leading-relaxed">
                    Aún no has agregado productos a tu orden. ¡Descubre nuestros ceviches y mariscos frescos!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-5 bg-[#081E3D] hover:bg-cyan-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors"
                  >
                    Explorar Menú
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5 pb-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      id={`cart-item-${item.product.id}`}
                      className="flex items-start gap-3 pt-3.5 first:pt-0"
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />

                      {/* Info & Quantity controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-['Outfit'] font-bold text-slate-900 text-sm leading-snug uppercase line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            id={`btn-remove-item-${item.product.id}`}
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                            title="Eliminar del pedido"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          Unitario: ${item.product.price.toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity selector */}
                          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="w-7 h-7 rounded flex items-center justify-center text-slate-700 hover:bg-white active:scale-95 transition-colors cursor-pointer"
                              title="Disminuir"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="w-7 h-7 rounded flex items-center justify-center bg-[#081E3D] text-white hover:bg-cyan-700 active:scale-95 transition-colors cursor-pointer"
                              title="Aumentar"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line total */}
                          <span className="font-black text-slate-900 text-sm">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Extra Details / Table / Notes if cart has items */}
              {items.length > 0 && (
                <div className="pt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Mesa o Nombre (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Mesa 4 / Pedido para Carlos"
                      value={customerInfo}
                      onChange={(e) => setCustomerInfo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Instrucciones de preparación (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Picante aparte, sin cebolla..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & WhatsApp Button */}
            {items.length > 0 && (
              <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-['Outfit'] text-slate-600 font-bold uppercase text-sm tracking-wider flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-slate-500" />
                    TOTAL
                  </span>
                  <span className="text-2xl font-black text-[#081E3D] tracking-tight">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Primary Action Button: "ENVIAR PEDIDO POR WHATSAPP" */}
                <button
                  id="btn-send-whatsapp-order"
                  onClick={handleSendWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wide shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 group hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>ENVIAR PEDIDO POR WHATSAPP</span>
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  Al enviar, se abrirá WhatsApp con el formato del pedido listo para confirmar.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
