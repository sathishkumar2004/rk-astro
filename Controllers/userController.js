// controllers/userController.js
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Register User
exports.signup = async (req, res) => {
  const { username, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

// 🔐 Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// 🔁 Forgot Password (basic token mock)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // In real app: generate OTP/email with token
    const token = jwt.sign({ id: user.id }, 'reset-secret', { expiresIn: '15m' });

    // Send token via email (mock here)
    res.json({ message: 'Reset token generated', token });
  } catch (err) {
    res.status(500).json({ message: 'Forgot password error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { dob, tob, pob, aadhar } = req.body;
  const userId = req.userId; // coming from JWT auth middleware

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.dob = dob || user.dob;
    user.tob = tob || user.tob;
    user.pob = pob || user.pob;
    user.aadhar = aadhar || user.aadhar;

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // hide password from response
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Fetching users failed', error: error.message });
  }
};
