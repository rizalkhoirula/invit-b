const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const AuthMiddleware = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      message:
        "Anda tidak boleh mengakses halaman ini karena tidak ada token JWT yang diberikan.",
    });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        message: "User Tidak Ditemukan",
      });
    }

    req.user = currentUser; 
    next(); 
  } catch (error) {
    return res.status(401).json({
      message: "Token JWT tidak valid",
    });
  }
};

const permisionUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Role Anda tidak bisa mengakses halaman ini.",
      });
    }
    next();
  };
};

module.exports = { AuthMiddleware, permisionUser };
