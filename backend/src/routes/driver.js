const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticate, requireAdmin } = require('../middleware/auth');

const requests = [];

const BASE_FEE = parseFloat(process.env.BARB_DRIVER_BASE_FEE) || 10;
const PER_KM = parseFloat(process.env.BARB_DRIVER_PER_KM_FEE) || 1.5;
const MAX_RADIUS = parseFloat(process.env.BARB_DRIVER_MAX_RADIUS_KM) || 20;

// GET /api/driver/zone
router.get('/zone', (req, res) => {
  res.json({
    success: true,
    data: {
      centerLat: 4.9224,
      centerLng: -52.3135,
      radiusKm: MAX_RADIUS,
      baseFee: BASE_FEE,
      perKmFee: PER_KM,
    },
  });
});

// POST /api/driver/estimate — estimate travel fee
router.post('/estimate', authenticate, (req, res) => {
  const { distanceKm } = req.body;
  if (distanceKm === undefined) {
    return res.status(400).json({ success: false, message: 'distanceKm requis.' });
  }
  if (distanceKm > MAX_RADIUS) {
    return res.status(400).json({ success: false, message: `Zone hors de couverture (max ${MAX_RADIUS} km).` });
  }
  const travelFee = BASE_FEE + distanceKm * PER_KM;
  res.json({ success: true, data: { distanceKm, travelFee: Math.round(travelFee * 100) / 100 } });
});

// GET /api/driver/requests
router.get('/requests', authenticate, (req, res) => {
  const result = req.user.role === 'admin'
    ? requests
    : requests.filter((r) => r.clientId === req.user.id);
  res.json({ success: true, data: result });
});

// POST /api/driver/requests — create
router.post('/requests', authenticate, (req, res) => {
  const { address, serviceId, serviceName, servicePrice, scheduledDate, scheduledTime, distanceKm, notes } = req.body;
  if (!address || !serviceId || !scheduledDate || !scheduledTime) {
    return res.status(400).json({ success: false, message: 'Champs requis manquants.' });
  }
  const travelFee = BASE_FEE + (distanceKm || 5) * PER_KM;
  const totalAmount = servicePrice + travelFee;
  const depositAmount = Math.round(totalAmount * 0.3);
  const request = {
    id: uuidv4(),
    clientId: req.user.id,
    address,
    serviceId,
    serviceName,
    servicePrice,
    scheduledDate,
    scheduledTime,
    distanceKm: distanceKm || 5,
    travelFee: Math.round(travelFee * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    depositAmount,
    status: 'pending',
    notes,
    createdAt: new Date().toISOString(),
  };
  requests.push(request);
  res.status(201).json({ success: true, data: request });
});

// PATCH /api/driver/requests/:id/status — admin/barber
router.patch('/requests/:id/status', authenticate, (req, res) => {
  const req_ = requests.find((r) => r.id === req.params.id);
  if (!req_) return res.status(404).json({ success: false, message: 'Demande introuvable.' });
  req_.status = req.body.status;
  if (req.body.estimatedArrival) req_.estimatedArrival = req.body.estimatedArrival;
  if (req.body.barberId) req_.barberId = req.body.barberId;
  res.json({ success: true, data: req_ });
});

module.exports = router;
