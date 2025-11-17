import { api } from './api';

export interface ProductoWayuu {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
}

export const productosWayuu: ProductoWayuu[] = [
  // ============================================
  // MOCHILAS WAYUU (12 productos)
  // ============================================
  {
    nombre: "Mochila Wayuu Tradicional Grande",
    categoria: "Mochilas",
    precio: 180000,
    stock: 8,
    descripcion: "Mochila grande tejida a mano con diseños geométricos tradicionales. 100% algodón.",
    imagen: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
  },
  {
    nombre: "Mochila Wayuu Mediana Multicolor",
    categoria: "Mochilas",
    precio: 150000,
    stock: 12,
    descripcion: "Mochila mediana con patrones coloridos y asa trenzada.",
    imagen: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
  },
  {
    nombre: "Mochila Wayuu Pequeña Tribal",
    categoria: "Mochilas",
    precio: 120000,
    stock: 15,
    descripcion: "Mochila pequeña perfecta para uso diario. Diseño tribal auténtico.",
    imagen: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800"
  },
  {
    nombre: "Mochila Wayuu Mini Crossbody",
    categoria: "Mochilas",
    precio: 95000,
    stock: 20,
    descripcion: "Mini mochila ideal para llevar cruzada. Compacta y versátil.",
    imagen: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
  },
  {
    nombre: "Mochila Wayuu Extra Grande",
    categoria: "Mochilas",
    precio: 220000,
    stock: 5,
    descripcion: "Mochila de gran capacidad con diseños elaborados y detalles únicos.",
    imagen: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
  },
  {
    nombre: "Mochila Wayuu Diseño Floral",
    categoria: "Mochilas",
    precio: 165000,
    stock: 10,
    descripcion: "Mochila con patrones florales tejidos. Colores vibrantes y alegres.",
    imagen: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800"
  },
  {
    nombre: "Mochila Wayuu Diseño Animal",
    categoria: "Mochilas",
    precio: 175000,
    stock: 7,
    descripcion: "Mochila con representaciones de animales sagrados wayuu.",
    imagen: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
  },
  {
    nombre: "Mochila Wayuu Geométrica Premium",
    categoria: "Mochilas",
    precio: 200000,
    stock: 6,
    descripcion: "Diseño geométrico complejo. Edición especial artesanal.",
    imagen: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
  },
  {
    nombre: "Mochila Wayuu Doble Faz",
    categoria: "Mochilas",
    precio: 185000,
    stock: 9,
    descripcion: "Mochila tejida en doble faz con diseño diferente en cada lado.",
    imagen: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800"
  },
  {
    nombre: "Mochila Wayuu Degradado",
    categoria: "Mochilas",
    precio: 155000,
    stock: 11,
    descripcion: "Colores en degradado que representan el atardecer guajiro.",
    imagen: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
  },
  {
    nombre: "Mochila Wayuu Bicolor",
    categoria: "Mochilas",
    precio: 140000,
    stock: 14,
    descripcion: "Diseño minimalista en dos colores contrastantes.",
    imagen: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
  },
  {
    nombre: "Mochila Wayuu Colección Especial",
    categoria: "Mochilas",
    precio: 250000,
    stock: 3,
    descripcion: "Pieza única de colección con diseño exclusivo y detalles en oro.",
    imagen: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800"
  },

  // ============================================
  // BOLSOS WAYUU (10 productos)
  // ============================================
  {
    nombre: "Bolso Wayuu Tote Grande",
    categoria: "Bolsos",
    precio: 160000,
    stock: 10,
    descripcion: "Bolso tipo tote ideal para playa o compras. Espacioso y resistente.",
    imagen: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"
  },
  {
    nombre: "Bolso Wayuu Clutch",
    categoria: "Bolsos",
    precio: 85000,
    stock: 18,
    descripcion: "Clutch elegante para eventos especiales. Diseño sofisticado.",
    imagen: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800"
  },
  {
    nombre: "Bolso Wayuu Crossbody",
    categoria: "Bolsos",
    precio: 130000,
    stock: 15,
    descripcion: "Bolso cruzado perfecto para uso diario. Práctico y elegante.",
    imagen: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"
  },
  {
    nombre: "Bolso Wayuu de Mano",
    categoria: "Bolsos",
    precio: 145000,
    stock: 12,
    descripcion: "Bolso de mano con asa corta. Ideal para ocasiones formales.",
    imagen: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800"
  },
  {
    nombre: "Bolso Wayuu Bucket",
    categoria: "Bolsos",
    precio: 155000,
    stock: 8,
    descripcion: "Bolso tipo bucket con cordón. Estilo moderno y funcional.",
    imagen: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"
  },
  {
    nombre: "Bolso Wayuu Shopper",
    categoria: "Bolsos",
    precio: 170000,
    stock: 9,
    descripcion: "Bolso shopper amplio para llevar todo lo necesario.",
    imagen: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800"
  },
  {
    nombre: "Bolso Wayuu Redondo",
    categoria: "Bolsos",
    precio: 125000,
    stock: 11,
    descripcion: "Bolso de forma circular con diseño único. Muy original.",
    imagen: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"
  },
  {
    nombre: "Bolso Wayuu Rectangular",
    categoria: "Bolsos",
    precio: 135000,
    stock: 13,
    descripcion: "Bolso rectangular con estructura definida. Estilo clásico.",
    imagen: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800"
  },
  {
    nombre: "Bolso Wayuu Bandolera",
    categoria: "Bolsos",
    precio: 140000,
    stock: 10,
    descripcion: "Bandolera con correa ajustable. Comodidad garantizada.",
    imagen: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"
  },
  {
    nombre: "Bolso Wayuu Evening",
    categoria: "Bolsos",
    precio: 110000,
    stock: 14,
    descripcion: "Bolso pequeño para eventos nocturnos. Elegante y discreto.",
    imagen: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800"
  },

  // ============================================
  // ACCESORIOS WAYUU (15 productos)
  // ============================================
  {
    nombre: "Manilla Wayuu Tradicional",
    categoria: "Accesorios",
    precio: 35000,
    stock: 30,
    descripcion: "Manilla tejida con hilo de algodón. Diseño tradicional wayuu.",
    imagen: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800"
  },
  {
    nombre: "Collar Wayuu con Mostacillas",
    categoria: "Accesorios",
    precio: 65000,
    stock: 20,
    descripcion: "Collar artesanal decorado con mostacillas coloridas.",
    imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
  },
  {
    nombre: "Aretes Wayuu Circulares",
    categoria: "Accesorios",
    precio: 45000,
    stock: 25,
    descripcion: "Aretes circulares tejidos a mano. Ligeros y elegantes.",
    imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
  },
  {
    nombre: "Pulsera Wayuu Ancha",
    categoria: "Accesorios",
    precio: 40000,
    stock: 28,
    descripcion: "Pulsera ancha con patrones geométricos. Ajustable.",
    imagen: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800"
  },
  {
    nombre: "Tobillera Wayuu",
    categoria: "Accesorios",
    precio: 30000,
    stock: 22,
    descripcion: "Tobillera delicada tejida en hilo fino. Varios colores.",
    imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
  },
  {
    nombre: "Cinturón Wayuu Tejido",
    categoria: "Accesorios",
    precio: 95000,
    stock: 12,
    descripcion: "Cinturón tejido con hebilla artesanal. Ajustable.",
    imagen: "https://images.unsplash.com/photo-1624222247344-54d7a2e0e1be?w=800"
  },
  {
    nombre: "Diadema Wayuu",
    categoria: "Accesorios",
    precio: 38000,
    stock: 18,
    descripcion: "Diadema tejida perfecta para el cabello. Cómoda y bonita.",
    imagen: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800"
  },
  {
    nombre: "Set de Manillas Wayuu x3",
    categoria: "Accesorios",
    precio: 90000,
    stock: 15,
    descripcion: "Set de tres manillas combinables en diferentes colores.",
    imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
  },
  {
    nombre: "Gargantilla Wayuu",
    categoria: "Accesorios",
    precio: 55000,
    stock: 16,
    descripcion: "Gargantilla ajustada al cuello con diseño tribal.",
    imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
  },
  {
    nombre: "Anillo Wayuu Tejido",
    categoria: "Accesorios",
    precio: 25000,
    stock: 35,
    descripcion: "Anillo tejido en hilo encerado. Resistente al agua.",
    imagen: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800"
  },
  {
    nombre: "Aretes Wayuu Largos",
    categoria: "Accesorios",
    precio: 50000,
    stock: 20,
    descripcion: "Aretes largos con flecos. Estilo bohemio elegante.",
    imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
  },
  {
    nombre: "Collar Wayuu Largo",
    categoria: "Accesorios",
    precio: 75000,
    stock: 14,
    descripcion: "Collar largo con dije central tejido a mano.",
    imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
  },
  {
    nombre: "Pulsera Wayuu con Dijes",
    categoria: "Accesorios",
    precio: 48000,
    stock: 24,
    descripcion: "Pulsera decorada con pequeños dijes metálicos.",
    imagen: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800"
  },
  {
    nombre: "Manilla Wayuu Premium",
    categoria: "Accesorios",
    precio: 55000,
    stock: 18,
    descripcion: "Manilla premium con detalles en hilo de oro.",
    imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
  },
  {
    nombre: "Set Completo Accesorios",
    categoria: "Accesorios",
    precio: 180000,
    stock: 8,
    descripcion: "Set que incluye collar, aretes, manilla y anillo a juego.",
    imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
  },

  // ============================================
  // CALZADO WAYUU (8 productos)
  // ============================================
  {
    nombre: "Sandalias Wayuu Planas",
    categoria: "Calzado",
    precio: 120000,
    stock: 15,
    descripcion: "Sandalias planas tejidas con suela de cuero. Muy cómodas.",
    imagen: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800"
  },
  {
    nombre: "Alpargatas Wayuu Tradicionales",
    categoria: "Calzado",
    precio: 95000,
    stock: 20,
    descripcion: "Alpargatas tejidas a mano con suela de yute natural.",
    imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800"
  },
  {
    nombre: "Sandalias Wayuu con Tiras",
    categoria: "Calzado",
    precio: 135000,
    stock: 12,
    descripcion: "Sandalias con tiras decorativas tejidas. Estilo romano.",
    imagen: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800"
  },
  {
    nombre: "Alpargatas Wayuu Cerradas",
    categoria: "Calzado",
    precio: 110000,
    stock: 18,
    descripcion: "Alpargatas cerradas ideales para caminar. Transpirables.",
    imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800"
  },
  {
    nombre: "Sandalias Wayuu Plataforma",
    categoria: "Calzado",
    precio: 150000,
    stock: 10,
    descripcion: "Sandalias con plataforma tejida. Elegantes y cómodas.",
    imagen: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800"
  },
  {
    nombre: "Alpargatas Wayuu Slip-On",
    categoria: "Calzado",
    precio: 105000,
    stock: 16,
    descripcion: "Alpargatas fáciles de poner con elástico lateral.",
    imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800"
  },
  {
    nombre: "Sandalias Wayuu Gladiador",
    categoria: "Calzado",
    precio: 145000,
    stock: 8,
    descripcion: "Sandalias estilo gladiador que llegan al tobillo.",
    imagen: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800"
  },
  {
    nombre: "Alpargatas Wayuu Premium",
    categoria: "Calzado",
    precio: 130000,
    stock: 14,
    descripcion: "Alpargatas con diseños exclusivos y suela reforzada.",
    imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800"
  },

  // ============================================
  // HOGAR WAYUU (10 productos)
  // ============================================
  {
    nombre: "Chinchorro Wayuu Individual",
    categoria: "Hogar",
    precio: 280000,
    stock: 6,
    descripcion: "Hamaca tradicional wayuu tejida a mano para una persona.",
    imagen: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800"
  },
  {
    nombre: "Chinchorro Wayuu Doble",
    categoria: "Hogar",
    precio: 450000,
    stock: 4,
    descripcion: "Hamaca grande para dos personas. Resistente y cómoda.",
    imagen: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800"
  },
  {
    nombre: "Tapete Wayuu Grande",
    categoria: "Hogar",
    precio: 320000,
    stock: 8,
    descripcion: "Tapete tejido de 1.5m x 2m con diseños geométricos.",
    imagen: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800"
  },
  {
    nombre: "Tapete Wayuu Mediano",
    categoria: "Hogar",
    precio: 220000,
    stock: 12,
    descripcion: "Tapete de 1m x 1.5m ideal para salas o habitaciones.",
    imagen: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800"
  },
  {
    nombre: "Cojín Wayuu Decorativo",
    categoria: "Hogar",
    precio: 85000,
    stock: 20,
    descripcion: "Cojín cuadrado de 40x40cm con diseño wayuu.",
    imagen: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  },
  {
    nombre: "Set Cojines Wayuu x4",
    categoria: "Hogar",
    precio: 300000,
    stock: 7,
    descripcion: "Set de 4 cojines combinados para decorar tu sala.",
    imagen: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  },
  {
    nombre: "Mantel Wayuu Rectangular",
    categoria: "Hogar",
    precio: 180000,
    stock: 10,
    descripcion: "Mantel tejido de 1.5m x 2m para mesa de comedor.",
    imagen: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800"
  },
  {
    nombre: "Cortina Wayuu Decorativa",
    categoria: "Hogar",
    precio: 250000,
    stock: 6,
    descripcion: "Cortina tejida para puertas o ventanas. 2m de alto.",
    imagen: "https://images.unsplash.com/photo-1524685363537-e48ba5c4e111?w=800"
  },
  {
    nombre: "Camino de Mesa Wayuu",
    categoria: "Hogar",
    precio: 120000,
    stock: 15,
    descripcion: "Camino de mesa de 40cm x 1.5m. Elegante y tradicional.",
    imagen: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800"
  },
  {
    nombre: "Funda Wayuu para Almohada",
    categoria: "Hogar",
    precio: 65000,
    stock: 25,
    descripcion: "Funda decorativa tejida para almohada estándar.",
    imagen: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  },

  // ============================================
  // ESPECIALES (8 productos)
  // ============================================
  {
    nombre: "Mochila Wayuu Edición Limitada",
    categoria: "Especiales",
    precio: 380000,
    stock: 2,
    descripcion: "Pieza única de edición limitada con diseño exclusivo del maestro artesano.",
    imagen: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
  },
  {
    nombre: "Set Regalo Wayuu Premium",
    categoria: "Especiales",
    precio: 450000,
    stock: 5,
    descripcion: "Set de regalo que incluye mochila, bolso y accesorios en caja especial.",
    imagen: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"
  },
  {
    nombre: "Bolso Wayuu Edición Oro",
    categoria: "Especiales",
    precio: 320000,
    stock: 3,
    descripcion: "Bolso con detalles en hilo de oro. Pieza de colección.",
    imagen: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"
  },
  {
    nombre: "Tapete Wayuu Ceremonial",
    categoria: "Especiales",
    precio: 680000,
    stock: 2,
    descripcion: "Tapete ceremonial de gran tamaño con diseños ancestrales.",
    imagen: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800"
  },
  {
    nombre: "Collar Wayuu con Piedras",
    categoria: "Especiales",
    precio: 180000,
    stock: 4,
    descripcion: "Collar artesanal decorado con piedras semipreciosas.",
    imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
  },
  {
    nombre: "Mochila Wayuu Matrimonial",
    categoria: "Especiales",
    precio: 520000,
    stock: 1,
    descripcion: "Mochila especial para ceremonias matrimoniales wayuu.",
    imagen: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
  },
  {
    nombre: "Set Decoración Hogar Wayuu",
    categoria: "Especiales",
    precio: 890000,
    stock: 2,
    descripcion: "Set completo: chinchorro, tapete, cojines y cortinas.",
    imagen: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  },
  {
    nombre: "Bolso Wayuu Coleccionista",
    categoria: "Especiales",
    precio: 420000,
    stock: 3,
    descripcion: "Bolso de colección con certificado de autenticidad y diseño único.",
    imagen: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800"
  }
];

// Función para inicializar productos
export const inicializarProductosWayuu = async () => {
  console.log('🚀 Iniciando carga de productos Wayuu...');
  
  let exitosos = 0;
  let fallidos = 0;

  for (const producto of productosWayuu) {
    try {
      await api.productos.create(producto);
      exitosos++;
      console.log(`✅ Producto creado: ${producto.nombre}`);
    } catch (error) {
      fallidos++;
      console.error(`❌ Error creando ${producto.nombre}:`, error);
    }
  }

  console.log(`\n📊 Resumen de carga:`);
  console.log(`✅ Productos exitosos: ${exitosos}`);
  console.log(`❌ Productos fallidos: ${fallidos}`);
  console.log(`📦 Total de productos: ${productosWayuu.length}`);

  return { exitosos, fallidos, total: productosWayuu.length };
};
