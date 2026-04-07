// ─── Équipe ───────────────────────────────────────────────────────────────
export const BARBERS = [
  {
    id: 'b5', firstName: 'Chadrac', lastName: 'AUBAUNA',
    specialty: 'Apprenti barber', rating: 0, reviews: 0,
    available: true, avatar: 'CA', role: 'apprentice',
    age: 20, phone: '', email: '', joinDate: '2025-01-15',
  },
  {
    id: 'b6', firstName: 'Quentin', lastName: 'SALMIER PORTUT',
    specialty: 'Apprenti barber', rating: 0, reviews: 0,
    available: true, avatar: 'QS', role: 'apprentice',
    age: 17, phone: '', email: '', joinDate: '2025-02-01',
  },
]

// ─── Services ─────────────────────────────────────────────────────────────
export const SERVICES = [
  { id: 's1',  name: 'Coupe Simple',         price: 20, duration: 30, category: 'coupe'   },
  { id: 's2',  name: 'Coupe + Barbe',         price: 30, duration: 45, category: 'pack'    },
  { id: 's3',  name: 'Coupe Enfant',          price: 15, duration: 25, category: 'coupe'   },
  { id: 's4',  name: 'Coupe Ciseau + Barbe',  price: 35, duration: 50, category: 'pack'    },
  { id: 's5',  name: 'Contour Simple',        price: 15, duration: 20, category: 'contour' },
  { id: 's6',  name: 'Contour + Barbe',       price: 20, duration: 35, category: 'pack'    },
  { id: 's7',  name: 'Dégradé',               price: 25, duration: 40, category: 'coupe'   },
  { id: 's8',  name: 'Rasage',                price: 20, duration: 30, category: 'barbe'   },
  { id: 's9',  name: 'Barbe seule',           price: 15, duration: 20, category: 'barbe'   },
  { id: 's10', name: 'Art Capillaire',         price: 50, duration: 60, category: 'special' },
]

// ─── Produits ─────────────────────────────────────────────────────────────
export const PRODUCTS = [
  { id: 'p1', name: 'Pomade Gold Edition',      price: 18, category: 'styling',     stock: 0, brand: "BARB'OR",      rating: 0, reviews: 0 },
  { id: 'p2', name: 'Huile de Barbe Premium',   price: 22, category: 'soins',       stock: 0, brand: "BARB'OR",      rating: 0, reviews: 0 },
  { id: 'p3', name: 'Shampoing Homme Noir',     price: 14, category: 'soins',       stock: 0, brand: "BARB'OR",      rating: 0, reviews: 0 },
  { id: 'p4', name: 'Peigne Pro Corne Noire',   price: 12, category: 'accessoires', stock: 0, brand: 'PRO LINE',     rating: 0, reviews: 0 },
  { id: 'p5', name: 'Baume Après-Rasage Gold',  price: 19, category: 'soins',       stock: 0, brand: "BARB'OR",      rating: 0, reviews: 0 },
  { id: 'p6', name: 'Cape Barber Gold Edition', price: 35, category: 'accessoires', stock: 0, brand: "BARB'OR",      rating: 0, reviews: 0 },
  { id: 'p7', name: 'Cire Mate Premium',        price: 16, category: 'styling',     stock: 0, brand: "BARB'OR",      rating: 0, reviews: 0 },
  { id: 'p8', name: 'Rasoir Droit Pro',         price: 65, category: 'accessoires', stock: 0, brand: 'MASTER BLADE', rating: 0, reviews: 0 },
]

// ─── Rendez-vous ──────────────────────────────────────────────────────────
export const APPOINTMENTS = []

// ─── Promotions ───────────────────────────────────────────────────────────
export const PROMOTIONS = []

// ─── Statistiques ─────────────────────────────────────────────────────────
export const STATS = {
  day:   { revenue: 0, appointments: 0, fillRate: 0, products: 0, newClients: 0 },
  week:  { revenue: 0, appointments: 0, fillRate: 0, products: 0, newClients: 0 },
  month: { revenue: 0, appointments: 0, fillRate: 0, products: 0, newClients: 0 },
}

export const REVENUE_CHART = [
  { day: 'Lun', revenue: 0 },
  { day: 'Mar', revenue: 0 },
  { day: 'Mer', revenue: 0 },
  { day: 'Jeu', revenue: 0 },
  { day: 'Ven', revenue: 0 },
  { day: 'Sam', revenue: 0 },
  { day: 'Dim', revenue: 0 },
]

// ─── Clients ──────────────────────────────────────────────────────────────
export const CLIENTS = []
