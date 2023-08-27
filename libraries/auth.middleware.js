// middleware/auth.js
import jwt from 'jsonwebtoken';
import config from '../config.js';

export default function (req, res, next) {
  const token = req.header('goceng-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.customer = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}
