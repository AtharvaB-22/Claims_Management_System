/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched user data
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */

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

// Create a new user
router.post('/', validate(validateUser), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Find the highest userId and increment it
        const lastUser = await User.findOne().sort({ userId: -1 });

        // Ensure lastUser exists before incrementing
        const newUserId = lastUser && lastUser.userId ? lastUser.userId + 1 : 1;

        // Check if newUserId is valid
        if (isNaN(newUserId)) {
            return res.status(500).json({ error: "Failed to generate userId" });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user with the generated userId
        const newUser = new User({
            userId: newUserId,
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.error("Error in User Registration:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users from MongoDB
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ userId: req.params.id }, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete user (Allow self-deletion or admin-only deletion)
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
