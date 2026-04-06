const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticate, requireAdmin } = require('../middleware/auth');

const orders = [];

// GET /api/orders
router.get('/', authenticate, (req, res) => {
  const result = req.user.role === 'admin'
    ? orders
    : orders.filter((o) => o.clientId === req.user.id);
  res.json({ success: true, data: result });
});

// POST /api/orders
router.post('/', authenticate, (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items?.length || !shippingAddress) {
    return res.status(400).json({ success: false, message: 'Articles et adresse requis.' });
  }
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const order = {
    id: uuidv4(),
    clientId: req.user.id,
    items,
    totalAmount,
    status: 'processing',
    shippingAddress,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json({ success: true, data: order });
});

// PATCH /api/orders/:id/status — admin
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Commande introuvable.' });
  order.status = req.body.status;
  res.json({ success: true, data: order });
});

module.exports = router;
