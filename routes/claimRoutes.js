const express = require('express');
const { validate, validateClaim } = require("../middleware/validation");
const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const User = require('../models/User');

const router = express.Router();

// Create a Claim
router.post("/", validate(validateClaim), async (req, res) => {
    try {
        const { claimId, policyId, policyholderId, claimAmount, status } = req.body;

        // Ensure policy exists
        const policy = await Policy.findOne({ policyId });
        if (!policy) {
            return res.status(400).json({ error: "Policy does not exist." });
        }

        // Ensure policyholder exists
        const policyholder = await User.findOne({ userId: policyholderId, role: "policyholder" });
        if (!policyholder) {
            return res.status(400).json({ error: "Policyholder does not exist." });
        }

        // Ensure claim amount does not exceed coverage
        if (claimAmount > policy.coverageAmount) {
            return res.status(400).json({ error: "Claim amount cannot exceed policy coverage amount." });
        }

        // Ensure valid claim status
        const validStatuses = ["pending", "approved", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid claim status. Allowed: pending, approved, rejected." });
        }

        // Create a new claim
        const newClaim = new Claim({
            claimId,
            policyId,
            policyholderId,
            claimAmount,
            status,
        });

        await newClaim.save();
        res.status(201).json({ message: "Claim submitted successfully", claim: newClaim });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get All Claims
router.get("/", async (req, res) => {
    try {
        const claims = await Claim.find();
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get Claim by ID
router.get("/:id", async (req, res) => {
    try {
        const claim = await Claim.findOne({ claimId: req.params.id });
        if (!claim) {
            return res.status(404).json({ error: "Claim not found" });
        }
        res.status(200).json(claim);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Update Claim
router.put("/:id", async (req, res) => {
    try {
        const updatedClaim = await Claim.findOneAndUpdate(
            { claimId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedClaim) {
            return res.status(404).json({ error: "Claim not found" });
        }
        res.status(200).json(updatedClaim);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Delete Claim
router.delete("/:id", async (req, res) => {
    try {
        const deletedClaim = await Claim.findOneAndDelete({ claimId: req.params.id });
        if (!deletedClaim) {
            return res.status(404).json({ error: "Claim not found" });
        }
        res.status(200).json({ message: "Claim deleted successfully", deletedClaim });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Export Router
module.exports = router;
