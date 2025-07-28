import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.cookies?.token;;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const rhaAdmin = (req, res, next) => {
  if (req.user?.role !== 'rha-rep-admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}
export const adminProtect = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};