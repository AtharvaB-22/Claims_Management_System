const express = require('express');
const bcrypt = require('bcryptjs');
const { validate, validateUser } = require("../middleware/validation");
const User = require('../models/User');
const { deleteUser } = require("../entities");
const adminOrSelfAuth = require("../middleware/authMiddleware");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const router = express.Router();
router.use(cookieParser());

// 🔹 Move Login and Register routes to the top to prevent conflicts


router.post('/', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Generate a custom user ID
        const lastUser = await User.findOne().sort({ userId: -1 });
        const newUserId = lastUser && lastUser.userId ? lastUser.userId + 1 : 1;

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            userId: newUserId,
            name,
            email,
            password: hashedPassword,
            role: role || "policyholder"
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.userId, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "User registered successfully", userId: newUser.userId, token });

    } catch (error) {
        console.error("Error in Registration:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Keep all other routes below
router.get("/", async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users from MongoDB
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { password } = req.query; // Password must be sent as a query parameter

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.userId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.userId, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Error in Login:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ userId: req.params.id }, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', adminOrSelfAuth, async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ userId: req.params.id });
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
