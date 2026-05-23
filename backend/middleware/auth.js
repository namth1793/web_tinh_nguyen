const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Không có token xác thực' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'phatphap_secret');
    next();
  } catch {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Không có quyền admin' });
    next();
  });
}

module.exports = { authMiddleware, adminMiddleware };
