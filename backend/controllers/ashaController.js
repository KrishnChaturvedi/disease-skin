import User from '../models/UserModel.js';
import ScanModel from '../models/ScanModel.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';
import validator from 'validator';

export const registerAsha = async (req, res) => {
  try {
    const { name, email, password, ashaId, village } = req.body;

    if (!name || !email || !password || !ashaId || !village) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ashaWorker = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "asha",
      ashaId,
      village
    });

    const token = generateToken({ id: ashaWorker._id });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: ashaWorker._id,
        name: ashaWorker.name,
        email: ashaWorker.email,
        role: ashaWorker.role,
        ashaId: ashaWorker.ashaId,
        village: ashaWorker.village
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginAsha = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail, role: "asha" });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid ASHA credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid ASHA credentials" });
    }

    const token = generateToken({ id: user._id });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ashaId: user.ashaId,
        village: user.village
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAshaStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayCount = await ScanModel.countDocuments({ 
      user: userId, 
      createdAt: { $gte: today } 
    });

    const monthCount = await ScanModel.countDocuments({ 
      user: userId, 
      createdAt: { $gte: firstDayOfMonth } 
    });

    const recentCases = await ScanModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('patientName age gender village riskLevel createdAt');

    res.status(200).json({
      success: true,
      today: todayCount,
      thisMonth: monthCount,
      pendingSync: 0,
      recentCases
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};