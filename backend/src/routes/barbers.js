const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');

const barbers = [
  { id: 'b1', firstName: 'Marcus', lastName: 'DUMONT', specialty: 'Dégradés & Designs', rating: 4.9, reviewCount: 234, available: true },
  { id: 'b2', firstName: 'Jordan', lastName: 'VINCENT', specialty: 'Coupes classiques & Barbe', rating: 4.8, reviewCount: 189, available: true },
  { id: 'b3', firstName: 'Kevin', lastName: 'PIERRE', specialty: 'Rasage & Soins', rating: 4.7, reviewCount: 156, available: false },
  { id: 'b4', firstName: 'Théo', lastName: 'BAMANA', specialty: 'Art capillaire & Tresses', rating: 4.9, reviewCount: 312, available: true },
];

// GET /api/barbers
router.get('/', (req, res) => {
  const available = req.query.available === 'true' ? barbers.filter((b) => b.available) : barbers;
  res.json({ success: true, data: available });
});

// GET /api/barbers/:id
router.get('/:id', (req, res) => {
  const barber = barbers.find((b) => b.id === req.params.id);
  if (!barber) return res.status(404).json({ success: false, message: 'Barber introuvable.' });
  res.json({ success: true, data: barber });
});

// GET /api/barbers/:id/availability
router.get('/:id/availability', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ success: false, message: 'Date requise.' });
  const slots = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30',
  ].map((time) => ({ time, available: Math.random() > 0.3 }));
  res.json({ success: true, data: { barberId: req.params.id, date, slots } });
});

// PATCH /api/barbers/:id/availability — admin only
router.patch('/:id/availability', authenticate, requireAdmin, (req, res) => {
  const barber = barbers.find((b) => b.id === req.params.id);
  if (!barber) return res.status(404).json({ success: false, message: 'Barber introuvable.' });
  barber.available = req.body.available;
  res.json({ success: true, data: barber });
});

module.exports = router;
