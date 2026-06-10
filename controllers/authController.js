const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. SIGNUP LOGIC
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check karayche ki user adhi pasunch register ahe ka
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "Email already registered!" });
        }

        // Password hash (secure) karne
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Navin user database madhe save karne
        user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        // JWT Token generate karne
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ success: true, token, message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 2. LOGIN LOGIC
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check karayche ki user exist karto ka
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password!" });
        }

        // Password match karun baghne
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password!" });
        }

        // Token generate karne
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};