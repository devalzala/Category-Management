const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createdUser = await User.create({ name, email, password: hashedPassword })

        res.status(201).json({
            message: "User registered successfully!",
            data: createdUser,
        });

    } catch (error) {
        res.status(500).json({ message: "Register Error", error: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentails" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentails" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            message: "Logged In successful!",
            data: user,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};