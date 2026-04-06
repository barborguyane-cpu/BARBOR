const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// In-memory store (replace with MongoDB in production)
const users = [];

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Champs obligatoires manquants.' });
    }
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email déjà utilisé.' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      id: uuidv4(),
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: 'client',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    const { password: _, ...userSafe } = user;
    const token = signToken(user);
    res.status(201).json({ success: true, data: { user: userSafe, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
    }
    const user = users.find((u) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }
    const { password: _, ...userSafe } = user;
    const token = signToken(user);
    res.json({ success: true, data: { user: userSafe, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').authenticate, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
  const { password: _, ...userSafe } = user;
  res.json({ success: true, data: userSafe });
});

module.exports = router;
