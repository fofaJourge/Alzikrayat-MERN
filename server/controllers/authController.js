
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================
const register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            location,
            description,
            occupation
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            location,
            description,
            occupation
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id.toString()
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};
