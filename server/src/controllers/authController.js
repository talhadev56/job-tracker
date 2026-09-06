import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ token, user });
  } catch (error) {
    // Covers the rare race where two requests pass the findOne check
    // at the same time — the unique index still catches it.
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    next(error);
  }
};

// @desc    Log in an existing user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // Same generic message whether the email doesn't exist or the
    // password is wrong — never reveal which one it was.
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the currently logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    // protect middleware already attached req.user (password already excluded)
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
