const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');

let services = [
  { id: 's1', name: 'Coupe', description: 'Coupe précise adaptée à votre style', price: 20, duration: 30, category: 'coupe' },
  { id: 's2', name: 'Coupe + Barbe', description: 'Coupe complète avec taille de barbe', price: 30, duration: 45, category: 'pack' },
  { id: 's3', name: 'Dégradé', description: 'Dégradé américain ou bas', price: 25, duration: 40, category: 'coupe' },
  { id: 's4', name: 'Rasage', description: 'Rasage traditionnel au rasoir droit', price: 20, duration: 30, category: 'barbe' },
  { id: 's5', name: 'Barbe seule', description: 'Taille et soin de la barbe', price: 15, duration: 20, category: 'barbe' },
  { id: 's6', name: 'Soin du cuir chevelu', description: 'Traitement nourrissant + massage', price: 25, duration: 30, category: 'soin' },
];

router.get('/', (req, res) => {
  const { category } = req.query;
  const result = category ? services.filter((s) => s.category === category) : services;
  res.json({ success: true, data: result });
});

router.get('/:id', (req, res) => {
  const service = services.find((s) => s.id === req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Prestation introuvable.' });
  res.json({ success: true, data: service });
});

router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, description, price, duration, category } = req.body;
  if (!name || !price || !duration) return res.status(400).json({ success: false, message: 'Champs requis.' });
  const service = { id: 's' + Date.now(), name, description, price, duration, category: category || 'coupe' };
  services.push(service);
  res.status(201).json({ success: true, data: service });
});

router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const idx = services.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Prestation introuvable.' });
  services[idx] = { ...services[idx], ...req.body };
  res.json({ success: true, data: services[idx] });
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  services = services.filter((s) => s.id !== req.params.id);
  res.json({ success: true, message: 'Prestation supprimée.' });
});

module.exports = router;
