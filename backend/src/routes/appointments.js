const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticate, requireAdmin, requireBarber } = require('../middleware/auth');

// In-memory store (replace with MongoDB)
const appointments = [];

// GET /api/appointments — client sees own, admin sees all
router.get('/', authenticate, (req, res) => {
  const result = req.user.role === 'admin'
    ? appointments
    : appointments.filter((a) => a.clientId === req.user.id);
  res.json({ success: true, data: result, count: result.length });
});

// POST /api/appointments — create
router.post('/', authenticate, (req, res) => {
  const { barberId, serviceId, serviceName, servicePrice, date, time, notes } = req.body;
  if (!barberId || !serviceId || !date || !time) {
    return res.status(400).json({ success: false, message: 'Champs requis manquants.' });
  }
  const depositAmount = Math.round(servicePrice * (parseFloat(process.env.DEPOSIT_PERCENT) || 0.3));
  const appointment = {
    id: uuidv4(),
    clientId: req.user.id,
    barberId,
    serviceId,
    serviceName,
    date,
    time,
    notes,
    status: 'pending',
    depositPaid: false,
    depositAmount,
    totalAmount: servicePrice,
    createdAt: new Date().toISOString(),
  };
  appointments.push(appointment);
  res.status(201).json({ success: true, data: appointment });
});

// PATCH /api/appointments/:id/status — update status (admin/barber)
router.patch('/:id/status', authenticate, requireBarber, (req, res) => {
  const apt = appointments.find((a) => a.id === req.params.id);
  if (!apt) return res.status(404).json({ success: false, message: 'Rendez-vous introuvable.' });
  apt.status = req.body.status;
  res.json({ success: true, data: apt });
});

// DELETE /api/appointments/:id — cancel
router.delete('/:id', authenticate, (req, res) => {
  const idx = appointments.findIndex(
    (a) => a.id === req.params.id && (a.clientId === req.user.id || req.user.role === 'admin')
  );
  if (idx === -1) return res.status(404).json({ success: false, message: 'Rendez-vous introuvable.' });
  appointments[idx].status = 'cancelled';
  res.json({ success: true, message: 'Rendez-vous annulé.' });
});

module.exports = router;
