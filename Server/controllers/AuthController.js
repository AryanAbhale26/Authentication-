const { UserModel } = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, resp) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return resp
        .status(409)
        .json({ message: "User is already present ", success: false });
    }
    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    resp.status(201).json({
      message: "signup successfully",
      success: true,
    });
  } catch (err) {
    resp.status(500).json({
      message: "Server error",
      success: true,
    });
  }
};

const login = async (req, resp) => {
  try {
    const { email, password } = req.body; // Remove name from here
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed: email or password is wrong";

    if (!user) {
      return resp.status(403).json({ message: errorMsg, success: false });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return resp.status(403).json({ message: errorMsg, success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    resp.status(200).json({
      message: "Login successfully",
      success: true,
      jwtToken,
      email: user.email, // Use user.email for consistency
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err); // Log the error for debugging
    resp.status(500).json({
      message: "Server error",
      success: false, // Change to false
    });
  }
};

module.exports = {
  signup,
  login,
};
