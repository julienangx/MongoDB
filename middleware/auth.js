const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration/constants');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Pas de token donne' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
