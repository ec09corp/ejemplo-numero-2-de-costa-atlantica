import { Category, Product, RestaurantConfig } from '../types';

import imgCorvina from '../assets/images/ceviche_corvina_1789583326229.jpg';
import imgPulpo from '../assets/images/ceviche_pulpo_1789583340002.jpg';
import imgCombinado from '../assets/images/ceviche_combinado_1789583353836.jpg';
import imgCoctelCamaron from '../assets/images/coctel_camaron_1789583368042.jpg';
import imgCamaronCeviche from '../assets/images/ceviche_camaron_1789583384875.jpg';
import imgCamaronesAjillo from '../assets/images/camarones_ajillo_1789583402102.jpg';
import imgPescadoFrito from '../assets/images/pescado_frito_1789583417809.jpg';
import imgArrozMariscos from '../assets/images/arroz_mariscos_1789583431557.jpg';
import imgComboMarinero from '../assets/images/combo_marinero_1789583445685.jpg';
import imgLimonadaCoco from '../assets/images/limonada_coco_1789583461194.jpg';

export const DEFAULT_RESTAURANT_CONFIG: RestaurantConfig = {
  name: 'DELICIAS DEL ATLÁNTICO',
  subtitle: 'MENÚ DIGITAL',
  whatsappNumber: '50769077740',
  whatsappDisplay: '6907-7740',
  currency: '$',
  address: 'Costa del Atlántico, Plaza Marina #12',
  schedule: 'Mar a Dom: 11:30 AM - 10:00 PM',
  tagline: 'Frescura y tradición marina en cada plato',
};

export const CATEGORIES: Category[] = [
  {
    id: 'ceviches',
    name: 'CEVICHES',
    description: 'Frescura y sabor del mar en cada bocado.',
  },
  {
    id: 'camarones',
    name: 'CAMARONES',
    description: 'Camarones seleccionados de primera calidad, preparados al momento.',
  },
  {
    id: 'pescados',
    name: 'PESCADOS',
    description: 'Pescados frescos del día dorados a la perfección o a la plancha.',
  },
  {
    id: 'mariscos',
    name: 'MARISCOS',
    description: 'Especialidades marinas con la auténtica sazón costeña.',
  },
  {
    id: 'platos-fuertes',
    name: 'PLATOS FUERTES',
    description: 'Combinaciones exquisitas para los amantes del buen comer.',
  },
  {
    id: 'combos',
    name: 'COMBOS',
    description: 'Nuestras mejores opciones reunidas en porciones generosas.',
  },
  {
    id: 'bebidas',
    name: 'BEBIDAS',
    description: 'Bebidas tropicales y naturales para acompañar tu plato.',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // CEVICHES (Exact prices from prompt)
  {
    id: 'ceviche-corvina',
    name: 'CEVICHE DE CORVINA',
    category: 'ceviches',
    price: 3.75,
    image: imgCorvina,
    description: 'Fresca corvina marinada al limón con cebolla morada y cilantro.',
    disponible: true,
    tags: ['Especialidad', 'Fresco'],
    destacado: true,
  },
  {
    id: 'ceviche-pulpo',
    name: 'CEVICHE DE PULPO',
    category: 'ceviches',
    price: 4.75,
    image: imgPulpo,
    description: 'Tierno pulpo en corte fino con marinada cítrica de la casa.',
    disponible: true,
    tags: ['Recomendado'],
    destacado: true,
  },
  {
    id: 'combinacion',
    name: 'COMBINACIÓN',
    category: 'ceviches',
    price: 5.50,
    image: imgCombinado,
    description: 'Selección mixta de mariscos frescos en auténtica leche de tigre.',
    disponible: true,
    tags: ['Favorito del Chef'],
    destacado: true,
  },
  {
    id: 'coctel-camaron',
    name: 'CÓCTEL DE CAMARÓN',
    category: 'ceviches',
    price: 7.50,
    image: imgCoctelCamaron,
    description: 'Camarones jugosos con salsa cóctel especial, limón y aguacate.',
    disponible: true,
    tags: ['Clásico'],
    destacado: true,
  },
  {
    id: 'camaron',
    name: 'CAMARÓN',
    category: 'ceviches',
    price: 5.50,
    image: imgCamaronCeviche,
    description: 'Una opción fresca y deliciosa preparada con camarones selectos.',
    disponible: true,
    tags: ['Fresco'],
  },

  // CAMARONES
  {
    id: 'camarones-ajillo',
    name: 'CAMARONES AL AJILLO',
    category: 'camarones',
    price: 11.50,
    image: imgCamaronesAjillo,
    description: 'Camarones salteados en mantequilla de ajo con vino blanco y perejil.',
    disponible: true,
    tags: ['Popular'],
  },
  {
    id: 'camarones-apanados',
    name: 'CAMARONES APANADOS',
    category: 'camarones',
    price: 11.00,
    image: imgCamaronesAjillo,
    description: 'Camarones jumbo empanizados crujientes con salsa tártara artesanal.',
    disponible: true,
  },

  // PESCADOS
  {
    id: 'pescado-frito-entero',
    name: 'PESCADO FRITO ENTERO',
    category: 'pescados',
    price: 13.50,
    image: imgPescadoFrito,
    description: 'Pescado fresco entero crujiente, servido con patacones y ensalada.',
    disponible: true,
    tags: ['Tradición Costera'],
    destacado: true,
  },
  {
    id: 'filete-plancha',
    name: 'FILETE A LA PLANCHA',
    category: 'pescados',
    price: 10.50,
    image: imgPescadoFrito,
    description: 'Filete tierno de corvina sellado con finas hierbas y limón.',
    disponible: true,
  },

  // MARISCOS
  {
    id: 'arroz-mariscos',
    name: 'ARROZ CON MARISCOS',
    category: 'mariscos',
    price: 12.50,
    image: imgArrozMariscos,
    description: 'Arroz sazonado con camarones, calamares, pulpo y mejillones frescos.',
    disponible: true,
    tags: ['Familiar'],
    destacado: true,
  },
  {
    id: 'pulpo-parrilla',
    name: 'PULPO A LA PARRILLA',
    category: 'mariscos',
    price: 13.75,
    image: imgPulpo,
    description: 'Brazos de pulpo asados al carbón con aceite de oliva y pimentón.',
    disponible: false, // Demonstrates the required AGOTADO feature
    tags: ['Agotado Hoy'],
  },

  // PLATOS FUERTES
  {
    id: 'mar-y-tierra',
    name: 'MAR Y TIERRA ATLÁNTICO',
    category: 'platos-fuertes',
    price: 16.50,
    image: imgArrozMariscos,
    description: 'Combinación de corte de carne a la parrilla y camarones al ajillo.',
    disponible: true,
    tags: ['Premium'],
  },
  {
    id: 'corvina-rellena',
    name: 'CORVINA RELLENA DE CAMARONES',
    category: 'platos-fuertes',
    price: 15.50,
    image: imgPescadoFrito,
    description: 'Filete de corvina relleno de mariscos en salsa blanca gratinada.',
    disponible: true,
  },

  // COMBOS
  {
    id: 'combo-delicias',
    name: 'COMBO DELICIAS DEL ATLÁNTICO',
    category: 'combos',
    price: 19.50,
    image: imgComboMarinero,
    description: 'Pescado frito + Ceviche de Corvina + Patacones dorados + 2 Bebidas.',
    disponible: true,
    tags: ['Para Compartir'],
    destacado: true,
  },
  {
    id: 'combo-cevichero',
    name: 'COMBO CEVICHERO DOBLE',
    category: 'combos',
    price: 9.50,
    image: imgCombinado,
    description: '2 Ceviches a elección + canasta de platanitos crocantes + 2 sodas.',
    disponible: true,
  },

  // BEBIDAS
  {
    id: 'limonada-coco',
    name: 'LIMONADA DE COCO',
    category: 'bebidas',
    price: 3.25,
    image: imgLimonadaCoco,
    description: 'Refrescante frappé de coco cremoso con limón natural y hierbabuena.',
    disponible: true,
    tags: ['Favorita'],
  },
  {
    id: 'limonada-natural',
    name: 'LIMONADA CON HIERBABUENA',
    category: 'bebidas',
    price: 2.50,
    image: imgLimonadaCoco,
    description: 'Limones recién exprimidos con hielo picado y hojas de hierbabuena fresca.',
    disponible: true,
  },
  {
    id: 'maracuya-natural',
    name: 'JUGO DE MARACUYÁ',
    category: 'bebidas',
    price: 2.75,
    image: imgLimonadaCoco,
    description: 'Jugo 100% natural de fruta de la pasión bien helado.',
    disponible: true,
  },
];
