import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CATEGORIES, 
  INITIAL_PRODUCTS, 
  DEFAULT_RESTAURANT_CONFIG 
} from './data/menuData';
import { CategoryId, Product, CartItem, RestaurantConfig } from './types';
import { Header } from './components/Header';
import { MenuHeaderBanner } from './components/MenuHeaderBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { FloatingCartBar } from './components/FloatingCartBar';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { QRCodeModal } from './components/QRCodeModal';
import { Utensils, MessageCircle, MapPin, Clock, Share2, Check, QrCode } from 'lucide-react';

const CART_STORAGE_KEY = 'delicias_atlantico_cart';
const CONFIG_STORAGE_KEY = 'delicias_atlantico_config';
const PRODUCTS_STORAGE_KEY = 'delicias_atlantico_products';

export default function App() {
  // 1. Restaurant Configuration State
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure the newly requested WhatsApp number 69077740 is applied
        if (!parsed.whatsappNumber || parsed.whatsappNumber === '50768901234' || parsed.whatsappNumber.includes('6890')) {
          return {
            ...DEFAULT_RESTAURANT_CONFIG,
            ...parsed,
            whatsappNumber: '50769077740',
            whatsappDisplay: '6907-7740',
          };
        }
        return { ...DEFAULT_RESTAURANT_CONFIG, ...parsed };
      }
      return DEFAULT_RESTAURANT_CONFIG;
    } catch {
      return DEFAULT_RESTAURANT_CONFIG;
    }
  });

  // 2. Products State (allows marking as Agotado or adding custom products)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 3. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Navigation & View states
  const [activeCategory, setActiveCategory] = useState<CategoryId>('ceviches');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Cart helper calculations
  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalCartPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  // Cart actions
  const handleAddToCart = (product: Product, qty: number = 1) => {
    if (!product.disponible) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, disponible: !p.disponible } : p
      )
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateConfig = (newConfig: Partial<RestaurantConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Scroll to Category section
  const handleSelectCategory = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-section-${categoryId}`);
    if (element) {
      // 120px offset for sticky header + category bar
      const y = element.getBoundingClientRect().top + window.pageYOffset - 128;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  // IntersectionObserver to sync active category on scroll
  useEffect(() => {
    if (searchQuery.trim()) return; // Don't scrollspy during text search

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('category-section-', '') as CategoryId;
            setActiveCategory(id);
          }
        });
      },
      {
        rootMargin: '-130px 0px -70% 0px',
        threshold: 0,
      }
    );

    CATEGORIES.forEach((cat) => {
      const el = document.getElementById(`category-section-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [searchQuery]);

  // Filtered products for search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [searchQuery, products]);

  const handleShareMenu = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: config.name,
          text: `Consulta el menú digital de ${config.name} y haz tu pedido por WhatsApp`,
          url: window.location.href,
        });
      } catch {
        // Fallback
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Sticky Navigation Header */}
      <Header
        cartCount={totalCartItems}
        cartTotal={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQR={() => setIsQRModalOpen(true)}
      />

      {/* 2. Brand Visual Top Banner (Logo -> DELICIAS DEL ATLÁNTICO -> Search) */}
      <MenuHeaderBanner
        config={config}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 3. Sticky Horizontal Category Navigation */}
      {!searchQuery && (
        <CategoryBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      )}

      {/* 4. Products Menu Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-6 pb-28">
        {/* Search Results Mode */}
        {filteredProducts ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Resultados para: "{searchQuery}"
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                {filteredProducts.length} plato(s) encontrado(s)
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-['Outfit'] text-lg font-bold text-slate-800">
                  No encontramos platos con ese nombre
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Prueba buscando por "corvina", "pulpo", "camarón", "pescado" o "bebida".
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 bg-[#081E3D] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Ver todo el menú
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((product) => {
                  const cartItem = cart.find((i) => i.product.id === product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={cartItem ? cartItem.quantity : 0}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={(prod, delta) =>
                        handleUpdateQuantity(prod.id, delta)
                      }
                      onViewDetails={setSelectedProduct}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Normal Structured Digital Menu Categories */
          <div className="space-y-10 sm:space-y-12">
            {CATEGORIES.map((cat) => {
              const categoryProducts = products.filter(
                (p) => p.category === cat.id
              );

              if (categoryProducts.length === 0) return null;

              return (
                <section
                  key={cat.id}
                  id={`category-section-${cat.id}`}
                  className="scroll-mt-32"
                >
                  {/* Category Title & Header */}
                  <div className="border-b border-slate-200/80 pb-2.5 mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-5 rounded-full bg-cyan-600 inline-block"></span>
                        <h2 className="font-['Outfit'] font-black text-xl sm:text-2xl text-slate-900 tracking-tight uppercase">
                          {cat.name}
                        </h2>
                      </div>
                      {cat.description && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 pl-4 italic">
                          "{cat.description}"
                        </p>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-slate-500 pl-4 sm:pl-0">
                      {categoryProducts.length} {categoryProducts.length === 1 ? 'opción' : 'opciones'}
                    </span>
                  </div>

                  {/* Responsive Product Cards Grid */}
                  {/* Mobile: 1 column | Tablet: 2 columns | Desktop: 3 to 4 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {categoryProducts.map((product) => {
                      const cartItem = cart.find(
                        (i) => i.product.id === product.id
                      );
                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          quantityInCart={cartItem ? cartItem.quantity : 0}
                          onAddToCart={handleAddToCart}
                          onUpdateQuantity={(prod, delta) =>
                            handleUpdateQuantity(prod.id, delta)
                          }
                          onViewDetails={setSelectedProduct}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Footer Restaurant Info & QR Direct Order Note */}
        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
          <p className="font-bold text-slate-800 uppercase tracking-wider">
            {config.name} · CARTA DIGITAL DE RESTAURANTE
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-700" />
              {config.address}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              Pedidos directos por WhatsApp
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
            <button
              id="btn-footer-qrcode"
              onClick={() => setIsQRModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold text-xs cursor-pointer transition-colors border border-cyan-200"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-700" />
              <span>Ver Código QR</span>
            </button>

            <button
              onClick={handleShareMenu}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 font-semibold text-xs cursor-pointer transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Compartir Carta</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-900 underline cursor-pointer px-2"
            >
              Configurar Platos
            </button>
          </div>

          <p className="text-[10px] text-slate-400 mt-3">
            Diseñado para pedidos rápidos en mesa y delivery vía WhatsApp. Precios en USD.
          </p>
        </footer>
      </main>

      {/* 5. Floating Cart Action Bar */}
      <FloatingCartBar
        totalItems={totalCartItems}
        totalPrice={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 6. Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        config={config}
        onUpdateConfig={handleUpdateConfig}
      />

      {/* 7. Product Quick View / Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
      />

      {/* 8. Menu Settings & WhatsApp Admin Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        products={products}
        categories={CATEGORIES}
        onToggleAvailability={handleToggleAvailability}
        onAddProduct={handleAddProduct}
      />

      {/* 9. QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        restaurantName={config.name}
      />
    </div>
  );
}
