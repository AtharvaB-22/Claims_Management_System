const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Find the highest userId and increment it
        const lastUser = await User.findOne().sort({ userId: -1 });

        // Ensure that lastUser exists before incrementing
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

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update User
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ userId: req.params.id }, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ userId: req.params.id });
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
