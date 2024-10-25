const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  Logout,
  Getuser,
  Getalluser,
  Countuser,
} = require("../services/authService.js");
const {
  AuthMiddleware,
  permisionUser,
} = require("../middleware/AuthMiddleware");

// post /api/v1/../
router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/user", Getalluser);
router.get("/getuser", AuthMiddleware, Getuser);
router.get("/test", AuthMiddleware, permisionUser("admin"), (req, res) => {
  res.status(200).json({
    message: "success",
  });
});
router.get("/count", Countuser);

module.exports = router;
