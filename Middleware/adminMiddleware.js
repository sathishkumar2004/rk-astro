const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check if Authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Optional: Ensure the user has admin role
    if (!decoded.role || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // ✅ Attach decoded admin data to request
    req.admin = {
      id: decoded.adminId,
      email: decoded.email, // if you include email in your token
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token', error: err.message });
  }
};

module.exports = { authenticateAdmin };
