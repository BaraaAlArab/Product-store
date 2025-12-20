import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) =>   {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
      return res.status(401).json({message: "No token provided"});
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      const user = await User.findById(req.user.id);
      if (!user) {
          return res.status(401).json({message: "User not found"});
      }
      req.user.role = user.role;
      next();
  } catch (error) {
      return res.status(401).json({message: "Invalid token"});
  }
};
export const authorize = (...roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
};

// unauthenticated users only
export const guestOnly = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return res.status(403).json({ message: "gusets only" });
  }
  next();
};


