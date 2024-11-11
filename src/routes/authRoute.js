const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  register,
  getAll,
  forgotPassword,
  resetPassword,
  checkToken,
} = require("../controllers/authControllers");

router.post("/signup", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user", getAll);
router.post("/forgot", forgotPassword);
router.post("/checkToken", checkToken);
router.post("/resetPw", resetPassword);

module.exports = router;
