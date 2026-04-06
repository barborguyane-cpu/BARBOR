# BARB'OR GUYANE — Application Mobile Premium

> Application mobile haut de gamme pour le barbershop BARB'OR GUYANE

---

## 🎨 Identité visuelle

| Élément | Valeur |
|---------|--------|
| Noir profond | `#0A0A0A` |
| Bleu roi | `#0D1B2A` |
| Doré premium | `#D4AF37` |
| Style | Luxe · Street · Moderne · Masculin |

---

## 📱 Structure de l'application

```
barbor-guyane/
├── app/                        # React Native (Expo) — Application mobile
│   └── src/
│       ├── screens/
│       │   ├── auth/           # Splash, Login, Register
│       │   ├── HomeScreen      # Accueil + logo + actions
│       │   ├── booking/        # Sélection barber, service, date, paiement
│       │   ├── shop/           # Boutique e-commerce + panier
│       │   ├── driver/         # BARB'DRIVER (service à domicile)
│       │   ├── profile/        # Espace client, historique
│       │   └── admin/          # Back office (dashboard, planning, stocks)
│       ├── components/common/  # GoldButton, ScreenHeader, BarbOrLogo
│       ├── navigation/         # AppNavigator, tabs, stacks
│       ├── store/              # Zustand (auth, booking, shop)
│       ├── services/           # Types TypeScript, données mock
│       └── theme/              # Colors, typography, spacing
└── backend/                    # Node.js Express — API REST
    └── src/
        ├── routes/             # auth, barbers, services, appointments,
        │                       # products, orders, driver, payments, admin
        └── middleware/         # JWT auth, role guards
```

---

## ⚙️ Modules

### 1. Accueil
- Logo BARB'OR centré (SVG fidèle — double B + cercle doré)
- 3 boutons principaux : Réserver, Boutique, BARB'DRIVER
- Prochain RDV, offres & actualités, statistiques fidélité

### 2. Réservation
- Choix du barber (photo, spécialité, note)
- Choix de la prestation (coupe, barbe, dégradé, soin...)
- Sélection date & heure (calendrier + créneaux)
- Acompte 30% obligatoire (Stripe)
- Confirmation + notification push

### 3. Boutique (E-commerce)
- Catégories : Soins, Styling, Accessoires
- Fiche produit complète (image, note, stock)
- Panier + gestion quantité
- Checkout + paiement Stripe
- Suivi commande

### 4. BARB'DRIVER
- Formulaire : adresse, prestation, date/heure
- Calcul automatique des frais (10€ + 1.50€/km)
- Zone de couverture : 20 km autour de Cayenne
- Acompte 30% obligatoire
- Suivi en temps réel (barber en route)

### 5. Espace Client
- Historique RDV & commandes
- Programme fidélité Gold (points)
- Favoris & préférences
- Paramètres & profil

### 6. Back Office Admin
- Dashboard KPI (CA jour/semaine/mois)
- Planning & rendez-vous par barber
- Performance par employé
- Gestion stocks & produits
- Base clients avec segmentation

---

## 🚀 Installation

### Application mobile
```bash
cd app
npm install
expo start
```

### Backend API
```bash
cd backend
cp .env.example .env
# Remplir les variables (MongoDB, Stripe, JWT)
npm install
npm run dev
```

---

## 🔐 Variables d'environnement (backend)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Connexion MongoDB |
| `JWT_SECRET` | Clé secrète JWT |
| `STRIPE_SECRET_KEY` | Clé Stripe (test/prod) |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `EXPO_ACCESS_TOKEN` | Token push notifications |

---

## 📡 API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/barbers` | Liste des barbers |
| GET | `/api/barbers/:id/availability` | Disponibilités |
| GET | `/api/services` | Prestations |
| POST | `/api/appointments` | Créer un RDV |
| GET | `/api/products` | Catalogue boutique |
| POST | `/api/orders` | Passer une commande |
| POST | `/api/driver/requests` | Demande BARB'DRIVER |
| POST | `/api/driver/estimate` | Calcul frais déplacement |
| POST | `/api/payments/create-intent` | Stripe PaymentIntent |
| GET | `/api/admin/stats` | KPI dashboard admin |

---

## 💎 BARB'OR GUYANE — L'excellence au service de votre style
