import React, { useState } from 'react';
import { RestaurantConfig, Product, Category } from '../types';
import { X, Check, MessageCircle, Plus, Tag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  onUpdateConfig: (newConfig: Partial<RestaurantConfig>) => void;
  products: Product[];
  categories: Category[];
  onToggleAvailability: (productId: string) => void;
  onAddProduct: (newProduct: Product) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  products,
  categories,
  onToggleAvailability,
  onAddProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'inventory' | 'new-product'>('whatsapp');
  const [phone, setPhone] = useState(config.whatsappNumber);
  const [displayPhone, setDisplayPhone] = useState(config.whatsappDisplay);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category['id']>('ceviches');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length === 8 && !cleanDigits.startsWith('507')) {
      cleanDigits = `507${cleanDigits}`;
    }
    const display = displayPhone.trim() 
      || (cleanDigits.startsWith('507') && cleanDigits.length === 11 
          ? `${cleanDigits.slice(3, 7)}-${cleanDigits.slice(7)}` 
          : cleanDigits);
    
    onUpdateConfig({
      whatsappNumber: cleanDigits,
      whatsappDisplay: display,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: name.toUpperCase().trim(),
      category: category as any,
      price: parseFloat(price) || 0,
      description: description.trim() || 'Preparado fresco con ingredientes seleccionados del mar.',
      image: imageUrl.trim() || products[0]?.image || '',
      disponible: true,
      tags: ['Nuevo'],
    };

    onAddProduct(newProd);
    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setActiveTab('inventory');
  };

  return (
    <AnimatePresence>
      <div
        id="settings-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#081E3D] text-white p-5 flex items-center justify-between border-b border-cyan-900/60">
            <div>
              <h3 className="font-['Outfit'] font-black text-lg text-white">
                ADMINISTRACIÓN DEL MENÚ
              </h3>
              <p className="text-xs text-cyan-300">
                Configuración de WhatsApp y disponibilidad de platos
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-white text-cyan-800 border-b-2 border-cyan-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Número WhatsApp
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-white text-cyan-800 border-b-2 border-cyan-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Disponibilidad ({products.filter((p) => !p.disponible).length} Agotados)
            </button>
            <button
              onClick={() => setActiveTab('new-product')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                activeTab === 'new-product'
                  ? 'bg-white text-cyan-800 border-b-2 border-cyan-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Nuevo Plato
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 overflow-y-auto flex-1 text-slate-800">
            {activeTab === 'whatsapp' && (
              <form onSubmit={handleSavePhone} className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-emerald-950">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    El pedido generado por el cliente se enviará directamente a este número de WhatsApp en formato de texto estructurado y listo.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Número de WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 69077740"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Para Panamá ingresa 69077740 (se añade el código 507 automáticamente).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Texto a mostrar en el menú
                  </label>
                  <input
                    type="text"
                    value={displayPhone}
                    onChange={(e) => setDisplayPhone(e.target.value)}
                    placeholder="Ej. 6907-7740"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#081E3D] hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>¡Guardado con éxito!</span>
                      </>
                    ) : (
                      <span>Guardar Configuración</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  Haz clic para alternar el estado de agotado sin eliminar el plato de la carta.
                </p>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="py-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate uppercase">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            ${prod.price.toFixed(2)} · {prod.category}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleAvailability(prod.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-colors cursor-pointer shrink-0 ${
                          prod.disponible
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {prod.disponible ? 'Disponible' : 'AGOTADO'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'new-product' && (
              <form onSubmit={handleCreateProduct} className="space-y-3">
                <p className="text-xs text-slate-500 mb-1">
                  Agrega nuevos platos, ceviches o bebidas al menú digital fácilmente.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nombre del Plato
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. CEVICHE DE LANGOSTA"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Precio ($)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      required
                      placeholder="Ej. 6.50"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Descripción Corta
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Una opción fresca y deliciosa preparada para disfrutar el auténtico sabor del mar."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar en el Menú</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
