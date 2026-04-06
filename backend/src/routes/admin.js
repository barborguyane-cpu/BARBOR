const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', authenticate, requireAdmin, (req, res) => {
  const { period = 'week' } = req.query;
  const mockStats = {
    day: { revenue: 340, appointments: 12, fillRate: 85, productsSold: 4, newClients: 3 },
    week: { revenue: 1820, appointments: 67, fillRate: 78, productsSold: 23, newClients: 14 },
    month: { revenue: 8450, appointments: 284, fillRate: 82, productsSold: 98, newClients: 52 },
  };
  res.json({ success: true, data: mockStats[period] || mockStats.week });
});

// GET /api/admin/barber-performance
router.get('/barber-performance', authenticate, requireAdmin, (req, res) => {
  const performance = [
    { barberId: 'b1', name: 'Marcus DUMONT', clients: 67, revenue: 1640, rating: 4.9 },
    { barberId: 'b2', name: 'Jordan VINCENT', clients: 48, revenue: 1220, rating: 4.8 },
    { barberId: 'b3', name: 'Kevin PIERRE', clients: 39, revenue: 980, rating: 4.7 },
    { barberId: 'b4', name: 'Théo BAMANA', clients: 74, revenue: 1890, rating: 4.9 },
  ];
  res.json({ success: true, data: performance });
});

// GET /api/admin/low-stock
router.get('/low-stock', authenticate, requireAdmin, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'p6', name: "Cape Barber Gold Edition", stock: 15, threshold: 20 },
    ],
    message: '1 produit en stock faible',
  });
});

module.exports = router;
