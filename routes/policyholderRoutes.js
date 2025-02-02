const express = require('express');
const User = require('../models/User');  // User model is used to fetch policyholders
const authenticateJWT = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateJWT, async (req, res) => {
    try {
        const { id, name, email, policyNumber } = req.body;
        if (!id || !name || !email || !policyNumber) {
            return res.status(400).json({ message: "All fields (id, name, email, policyNumber) are required." });
        }

        const newPolicyholder = { id, name, email, policyNumber };
        res.status(201).json({ message: "Policyholder created successfully!", policyholder: newPolicyholder });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get All Policyholders
router.get("/", authenticateJWT, async (req, res) => {
    try {
        const policyholders = await User.find({ role: "policyholder" }).select("-password");
        res.status(200).json(policyholders);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get Policyholder by ID
router.get("/:id", authenticateJWT, async (req, res) => {
    try {
        const policyholder = await User.findOne({ userId: req.params.id, role: "policyholder" }).select("-password");
        if (!policyholder) {
            return res.status(404).json({ error: "Policyholder not found" });
        }
        res.status(200).json(policyholder);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Update Policyholder
router.put("/:id", authenticateJWT, async (req, res) => {
    try {
        const policyholder = await User.findOneAndUpdate(
            { userId: req.params.id, role: "policyholder" },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!policyholder) {
            return res.status(404).json({ error: "Policyholder not found" });
        }
        res.status(200).json(policyholder);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Delete Policyholder
router.delete("/:id", authenticateJWT, async (req, res) => {
    try {
        const policyholder = await User.findOneAndDelete({ userId: req.params.id, role: "policyholder" });
        if (!policyholder) {
            return res.status(404).json({ error: "Policyholder not found" });
        }
        res.status(200).json({ message: "Policyholder deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Export Router
module.exports = router;