export type CategoryId = 
  | 'ejecutivo'
  | 'ceviches' 
  | 'entradas'
  | 'pescados' 
  | 'mariscos' 
  | 'platos-fuertes' 
  | 'picadas'
  | 'combos' 
  | 'bebidas';

export interface Category {
  id: CategoryId;
  name: string;
  shortName?: string;
  description?: string;
  badge?: string;
  iconName?: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  image: string;
  description: string;
  disponible: boolean;
  tags?: string[];
  destacado?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface RestaurantConfig {
  name: string;
  subtitle: string;
  whatsappNumber: string; // international digits, e.g. "50768901234"
  whatsappDisplay: string; // formatted, e.g. "+507 6890-1234"
  currency: string;
  address: string;
  schedule: string;
  tagline: string;
}
