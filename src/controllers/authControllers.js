const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const { StatusCodes } = require("http-status-codes");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Email không tồn tại");
  }
  const token = crypto.randomBytes(3).toString("hex");
  const expiry = Date.now() + 3600000; // Thời hạn 1 giờ
  user.resetPasswordToken = token;
  user.resetPasswordExpiry = expiry;
  await user.save();

  transporter.sendMail({
    to: email,
    from: "domanhthuong20122002@gmail.com",
    subject: "Khôi phục mật khẩu",
    text: `Nhap ma khoi phuc ${token}`,
  });
  console.log("------");

  console.log("send token");
  console.log({ email, token });

  res.send("Email khôi phục mật khẩu đã được gửi");
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await User.create({ username, email, password });
    res.status(201).json({ username, email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "username không tồn tại" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    res.json({
      message: "Đăng nhập thành công",
      user: { username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
};

const getAll = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.ACCEPTED).json({ users });
};

const checkToken = async (req, res) => {
  const { token, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "email không tồn tại" });
  }
  if (user.resetPasswordExpiry < Date.now()) {
    return res.status(400).json({ message: "token hết hạn" });
  }
  console.log("------");
  console.log("check token");
  console.log({ email, token, "user token": user.resetPasswordToken });

  if (user.resetPasswordToken === token) {
    console.log("chinh xac");
    return res.json({ message: "token chinh xac" });
  } else {
    console.log("sai");
    return res.json({ message: "token sai" });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "email không tồn tại" });
  }

  user.password = newPassword;
  await user.save();
  res.json({ message: "Đổi mật khẩu thành công" });
};

module.exports = {
  register,
  login,
  logout,
  getAll,
  forgotPassword,
  checkToken,
  resetPassword,
};
