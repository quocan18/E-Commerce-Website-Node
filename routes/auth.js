const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Đăng ký người dùng
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      // Hash bằng chuẩn AES của CryptoJS
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Đăng nhập vào hệ thống
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      // Yêu cầu nhập username
      userName: req.body.user_name,
    });
    // Trường hợp nhập sai username
    !user && res.status(401).json("Wrong User Name");
    // Hash Mật khẩu
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    // Yêu cầu nhập mật khẩu
    const inputPassword = req.body.password;

    // Nếu nhập sai mật khẩu
    originalPassword != inputPassword && res.status(401).json("Wrong Password");

    // Phân quyền người dùng có phải admin hay user thường
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "1h" } // Token để bảo mật
    );
    //...others để prevent others khi test API
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
