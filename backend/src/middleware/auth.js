const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token manquant. Veuillez vous connecter.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs.' });
  }
  next();
};

const requireBarber = (req, res, next) => {
  if (!['barber', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Accès réservé aux barbers.' });
  }
  next();
};

module.exports = { authenticate, requireAdmin, requireBarber };
