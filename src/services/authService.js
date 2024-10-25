const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const asyncHandler = require("../middleware/AsyncHandler");
// Generate JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// JWT Cookie
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Make it secure in production
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    token, // Include token in response body
    data: user,
  });
};

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password must not be empty");
  }

  const user = await User.findOne({ email }).select("+password");
  if (user && (await user.comparePassword(password))) {
    sendToken(user, 200, res);
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const Register = asyncHandler(async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;

  const role = isFirstAccount ? "admin" : "user";

  const { username, email, password } = req.body;

  const createUser = await User.create({
    username,
    email,
    password,
    role,
  });

  // JWT Process
  sendToken(createUser, 201, res);
});

const Logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: false,
  });
  return res.status(200).json({
    message: "Logout Berhasil",
  });
};

const Getuser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select({ password: 0 });

    if (user) {
      return res.status(200).json({
        user,
      });
    }

    return res.status(404).json({
      message: "User tidak ditemukan",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};
const Getalluser = async (req, res) => {
  try {
    const alluser = await User.find();

    res.status(200).json(alluser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengambil barang");
  }
};
const Countuser = async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghitung pengguna" });
  }
};

module.exports = { Login, Register, Logout, Getuser, Getalluser, Countuser };
