const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');

let products = [
  { id: 'p1', name: 'Pomade Gold Edition', description: 'Tenue forte brillance naturelle', price: 18, category: 'styling', stock: 45, brand: "BARB'OR", rating: 4.8 },
  { id: 'p2', name: "Huile de Barbe Premium", description: "Mélange d'huiles naturelles", price: 22, category: 'soins', stock: 30, brand: "BARB'OR", rating: 4.9 },
  { id: 'p3', name: 'Shampoing Homme Noir', description: 'Shampoing purifiant au charbon actif', price: 14, category: 'soins', stock: 60, brand: "BARB'OR", rating: 4.6 },
  { id: 'p4', name: 'Peigne Pro Corne Noire', description: 'Peigne en corne naturelle', price: 12, category: 'accessoires', stock: 25, brand: "PRO LINE", rating: 4.7 },
  { id: 'p5', name: "Baume Après-Rasage Gold", description: "Baume apaisant extraits d'or", price: 19, category: 'soins', stock: 38, brand: "BARB'OR", rating: 4.8 },
  { id: 'p6', name: "Cape Barber Gold Edition", description: "Cape de coupe waterproof", price: 35, category: 'accessoires', stock: 15, brand: "BARB'OR", rating: 4.9 },
];

// GET /api/products
router.get('/', (req, res) => {
  const { category, search, inStock } = req.query;
  let result = [...products];
  if (category) result = result.filter((p) => p.category === category);
  if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  if (inStock === 'true') result = result.filter((p) => p.stock > 0);
  res.json({ success: true, data: result, count: result.length });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable.' });
  res.json({ success: true, data: product });
});

// POST /api/products — admin
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, description, price, category, stock, brand } = req.body;
  if (!name || !price || !category) return res.status(400).json({ success: false, message: 'Champs requis.' });
  const product = { id: 'p' + Date.now(), name, description, price, category, stock: stock || 0, brand: brand || "BARB'OR", rating: 5.0 };
  products.push(product);
  res.status(201).json({ success: true, data: product });
});

// PUT /api/products/:id — admin
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Produit introuvable.' });
  products[idx] = { ...products[idx], ...req.body };
  res.json({ success: true, data: products[idx] });
});

// PATCH /api/products/:id/stock — admin
router.patch('/:id/stock', authenticate, requireAdmin, (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable.' });
  const { delta, newStock } = req.body;
  if (newStock !== undefined) {
    product.stock = Math.max(0, newStock);
  } else if (delta !== undefined) {
    product.stock = Math.max(0, product.stock + delta);
  }
  res.json({ success: true, data: product });
});

// DELETE /api/products/:id — admin
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  products = products.filter((p) => p.id !== req.params.id);
  res.json({ success: true, message: 'Produit supprimé.' });
});

module.exports = router;
