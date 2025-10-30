import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token", error: error.message });
  }
};

// Middleware to verify admin role
export const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.userId = decoded.userId;
    
    // Check if user has admin role
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token", error: error.message });
  }
};