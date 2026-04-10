// ─── Équipe ───────────────────────────────────────────────────────────────
export const BARBERS = [
  {
    id: 'b1', firstName: 'Christopher', lastName: 'CKC',
    specialty: 'Barber Principal', rating: 0, reviews: 0,
    available: true, avatar: 'CK', role: 'manager',
    age: null, phone: '', email: '', joinDate: '2024-01-01',
  },
  {
    id: 'b5', firstName: 'Chadrac', lastName: 'AUBAUNA',
    specialty: 'Apprenti barber', rating: 0, reviews: 0,
    available: true, avatar: 'CA', role: 'apprentice',
    age: 20, phone: '', email: '', joinDate: '2025-01-15',
  },
]

// ─── Horaires ─────────────────────────────────────────────────────────────
export const HOURS = {
  schedule: [
    { days: 'Mardi – Samedi', times: '10h–15h  •  16h–20h', open: true  },
    { days: 'Lundi & Dimanche', times: 'Fermé',              open: false },
  ],
  // JS getDay(): 0=Dim,1=Lun,2=Mar,3=Mer,4=Jeu,5=Ven,6=Sam
  openDays: [2, 3, 4, 5, 6],
  slots: [
    '10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30',
    '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
  ],
}

// ─── Services ─────────────────────────────────────────────────────────────
export const SERVICES = [
  // COUPES
  { id: 's1',  name: 'Coupe Simple',          price: 20, duration: 30, category: 'coupe'   },
  { id: 's2',  name: 'Coupe Ciseaux',          price: 25, duration: 35, category: 'coupe'   },
  { id: 's3',  name: 'Coupe + Barbe',          price: 25, duration: 45, category: 'pack'    },
  { id: 's4',  name: 'Coupe Barbe + Ciseaux',  price: 30, duration: 50, category: 'pack'    },
  { id: 's5',  name: 'Coupe Barbe + Black',    price: 45, duration: 60, category: 'pack'    },
  { id: 's6',  name: 'Coupe Enfant -12ans',    price: 14, duration: 25, category: 'coupe'   },
  // CONTOURS
  { id: 's7',  name: 'Contour Simple',         price: 10, duration: 20, category: 'contour' },
  { id: 's8',  name: 'Contour Barbe',          price: 10, duration: 20, category: 'contour' },
  { id: 's9',  name: 'Contour + Barbe',        price: 15, duration: 25, category: 'contour' },
  { id: 's10', name: 'Sourcils',               price:  3, duration: 10, category: 'contour' },
  // BARBES
  { id: 's11', name: 'Barbe Sculpter',         price: 15, duration: 25, category: 'barbe'   },
  { id: 's12', name: 'Brushing Barbe',         price: 10, duration: 15, category: 'barbe'   },
  { id: 's13', name: 'Barb-Black',             price: 20, duration: 30, category: 'barbe'   },
  // COLORATION
  { id: 's14', name: 'Coloration Black',       price: 20, duration: 45, category: 'couleur' },
  { id: 's15', name: 'Coloration sur Motif',   price: 20, duration: 60, category: 'couleur' },
  { id: 's16', name: 'Décoloration / Mèches',  price:  0, duration: 90, category: 'couleur', devis: true },
  { id: 's17', name: 'Défrisage (curly)',      price: 20, duration: 90, category: 'couleur' },
  // SOINS & EXTRAS
  { id: 's18', name: 'Soins Visage Simple',    price: 25, duration: 30, category: 'soin'    },
  { id: 's19', name: 'Soins Visage Complet',   price: 35, duration: 45, category: 'soin'    },
  { id: 's20', name: 'Soins de la Barbe',      price: 25, duration: 30, category: 'soin'    },
  { id: 's21', name: 'Serviette Chaude',       price:  8, duration: 10, category: 'extra'   },
  { id: 's22', name: 'Shampoing',              price:  5, duration: 10, category: 'extra'   },
  { id: 's23', name: 'Epilation Cire',         price: 15, duration: 20, category: 'extra'   },
  { id: 's24', name: 'Vapozone',               price: 10, duration: 15, category: 'extra'   },
]

// ─── Produits ─────────────────────────────────────────────────────────────
export const PRODUCTS = [
  // Gel, Cire & Huiles
  { id: 'p1', name: 'Cire Immortal Infuse',       price: 16, category: 'styling', stock: 0, brand: 'IMMORTAL',  rating: 0, reviews: 0 },
  { id: 'p2', name: 'Cire Nish Man',               price: 21, category: 'styling', stock: 0, brand: 'NISH MAN',  rating: 0, reviews: 0 },
  { id: 'p3', name: 'Gel Anaqa Men',               price: 21, category: 'styling', stock: 0, brand: 'ANAQA MEN', rating: 0, reviews: 0 },
  { id: 'p4', name: 'Oil Barbe (Argan/Kératin)',   price: 17, category: 'soins',   stock: 0, brand: "BARB'OR",   rating: 0, reviews: 0 },
  // Eau de Cologne
  { id: 'p5', name: 'Eau de Cologne Premium Std',  price: 17, category: 'soins',   stock: 0, brand: 'PREMIUM',   rating: 0, reviews: 0 },
  { id: 'p6', name: 'Eau de Cologne Premium XL',   price: 21, category: 'soins',   stock: 0, brand: 'PREMIUM',   rating: 0, reviews: 0 },
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
