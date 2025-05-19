import jwt from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, // ✅ key should be `id`, not `userId`
    process.env.JWT_SECRET,
    { expiresIn: '5h' }
  );
};

// Middleware to verify JWT Token
// Middleware to verify JWT Token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No Authorization header or improper format.'); // Debug log
    return res.status(403).json({ message: 'Token required or incorrect format' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Incoming token:', token); // Debug log

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err.message); // Debug log
      if (err.name === 'TokenExpiredError') {
        // Handling expired token
        return res.status(401).json({ message: 'Token expired, please log in again' });
      }
      return res.status(403).json({ message: 'Invalid token or expired token' });
    }

    console.log('Decoded token:', decoded); // Debug log
    req.user = decoded;
    next();
  });
};



// Admin-only middleware
export const verifyAdmin = (req, res, next) => {
  console.log('User role:', req.user.role);  // Debug log
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

