export const BARBERS = [
  { id: 'b1', firstName: 'Marcus', lastName: 'DUMONT', specialty: 'Dégradés & Designs', rating: 4.9, reviews: 234, available: true, avatar: 'MD' },
  { id: 'b2', firstName: 'Jordan', lastName: 'VINCENT', specialty: 'Coupes classiques & Barbe', rating: 4.8, reviews: 189, available: true, avatar: 'JV' },
  { id: 'b3', firstName: 'Kevin',  lastName: 'PIERRE',  specialty: 'Rasage & Soins', rating: 4.7, reviews: 156, available: false, avatar: 'KP' },
  { id: 'b4', firstName: 'Théo',   lastName: 'BAMANA',  specialty: 'Art capillaire & Tresses', rating: 4.9, reviews: 312, available: true, avatar: 'TB' },
];

export const SERVICES = [
  { id: 's1', name: 'Coupe',           price: 20, duration: 30, category: 'coupe', description: 'Coupe précise adaptée à votre style' },
  { id: 's2', name: 'Coupe + Barbe',   price: 30, duration: 45, category: 'pack',  description: 'Coupe complète avec taille de barbe' },
  { id: 's3', name: 'Dégradé',         price: 25, duration: 40, category: 'coupe', description: 'Dégradé américain ou bas, rendu impeccable' },
  { id: 's4', name: 'Rasage',          price: 20, duration: 30, category: 'barbe', description: 'Rasage traditionnel au rasoir droit' },
  { id: 's5', name: 'Barbe seule',     price: 15, duration: 20, category: 'barbe', description: 'Taille et soin de la barbe' },
  { id: 's6', name: 'Soin cuir chevelu',price:25, duration: 30, category: 'soin',  description: 'Traitement nourrissant + massage' },
];

export const PRODUCTS = [
  { id: 'p1', name: 'Pomade Gold Edition',     price: 18, category: 'styling',     stock: 45, brand: "BARB'OR", rating: 4.8, reviews: 89 },
  { id: 'p2', name: 'Huile de Barbe Premium',  price: 22, category: 'soins',       stock: 30, brand: "BARB'OR", rating: 4.9, reviews: 124 },
  { id: 'p3', name: 'Shampoing Homme Noir',    price: 14, category: 'soins',       stock: 60, brand: "BARB'OR", rating: 4.6, reviews: 67 },
  { id: 'p4', name: 'Peigne Pro Corne Noire',  price: 12, category: 'accessoires', stock: 25, brand: 'PRO LINE', rating: 4.7, reviews: 43 },
  { id: 'p5', name: "Baume Après-Rasage Gold", price: 19, category: 'soins',       stock: 38, brand: "BARB'OR", rating: 4.8, reviews: 92 },
  { id: 'p6', name: 'Cape Barber Gold Edition',price: 35, category: 'accessoires', stock: 8,  brand: "BARB'OR", rating: 4.9, reviews: 28 },
  { id: 'p7', name: 'Cire Mate Premium',       price: 16, category: 'styling',     stock: 52, brand: "BARB'OR", rating: 4.7, reviews: 73 },
  { id: 'p8', name: 'Rasoir Droit Pro',        price: 65, category: 'accessoires', stock: 10, brand: 'MASTER BLADE', rating: 4.9, reviews: 56 },
];

export const APPOINTMENTS = [
  { id: 'a1', client: 'Jean MARTIN',   barber: 'Marcus D.', service: 'Coupe + Barbe', date: '2024-04-10', time: '14:00', status: 'confirmed', amount: 30, deposit: 9 },
  { id: 'a2', client: 'Kevin LOUIS',   barber: 'Théo B.',   service: 'Dégradé',       date: '2024-04-10', time: '15:00', status: 'confirmed', amount: 25, deposit: 8 },
  { id: 'a3', client: 'Marc DUPONT',   barber: 'Jordan V.', service: 'Rasage',        date: '2024-04-10', time: '11:00', status: 'completed', amount: 20, deposit: 6 },
  { id: 'a4', client: 'Thomas CESAR',  barber: 'Marcus D.', service: 'Coupe',         date: '2024-04-11', time: '09:30', status: 'pending',   amount: 20, deposit: 6 },
  { id: 'a5', client: 'Alexis MOREAU', barber: 'Kevin P.',  service: 'Soin cuir chevelu', date: '2024-04-11', time: '10:00', status: 'confirmed', amount: 25, deposit: 8 },
  { id: 'a6', client: 'Nathan FELIX',  barber: 'Théo B.',   service: 'Coupe + Barbe', date: '2024-04-11', time: '14:30', status: 'cancelled', amount: 30, deposit: 0 },
];

export const PROMOTIONS = [
  { id: 'pr1', title: '🏆 Pack VIP Printemps', desc: 'Coupe + Barbe + Soin à -20%', discount: '20%', code: 'VIP20', expiry: '30/04/2024' },
  { id: 'pr2', title: "🚗 1er BARB'DRIVER offert", desc: 'Frais de déplacement offerts', discount: '15€', code: 'DRIVER1', expiry: '31/05/2024' },
  { id: 'pr3', title: '💛 Fidélité Gold', desc: '10ème coupe offerte pour membres Gold', discount: '100%', code: null, expiry: '31/12/2024' },
];

export const STATS = {
  day:   { revenue: 340,  appointments: 12, fillRate: 85, products: 4,  newClients: 3  },
  week:  { revenue: 1820, appointments: 67, fillRate: 78, products: 23, newClients: 14 },
  month: { revenue: 8450, appointments: 284,fillRate: 82, products: 98, newClients: 52 },
};

export const REVENUE_CHART = [
  { day: 'Lun', revenue: 320 },
  { day: 'Mar', revenue: 280 },
  { day: 'Mer', revenue: 450 },
  { day: 'Jeu', revenue: 390 },
  { day: 'Ven', revenue: 520 },
  { day: 'Sam', revenue: 680 },
  { day: 'Dim', revenue: 180 },
];

export const CLIENTS = [
  { id: 'u1', name: 'Jean MARTIN',    phone: '+594 694 12 34 56', visits: 12, spend: 340, lastVisit: '10/04/2024', loyal: true  },
  { id: 'u2', name: 'Marc DUPONT',    phone: '+594 694 23 45 67', visits: 8,  spend: 220, lastVisit: '05/04/2024', loyal: false },
  { id: 'u3', name: 'Kevin LOUIS',    phone: '+594 694 34 56 78', visits: 23, spend: 680, lastVisit: '08/04/2024', loyal: true  },
  { id: 'u4', name: 'Thomas CESAR',   phone: '+594 694 45 67 89', visits: 5,  spend: 130, lastVisit: '28/03/2024', loyal: false },
  { id: 'u5', name: 'Alexis MOREAU',  phone: '+594 694 56 78 90', visits: 18, spend: 520, lastVisit: '09/04/2024', loyal: true  },
  { id: 'u6', name: 'Nathan FELIX',   phone: '+594 694 67 89 01', visits: 3,  spend: 75,  lastVisit: '01/04/2024', loyal: false },
];
