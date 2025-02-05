/**
 * @swagger
 * tags:
 *   name: Policies
 *   description: Policy management endpoints
 */

/**
 * @swagger
 * /policies:
 *   get:
 *     summary: Get all policies
 *     tags: [Policies]
 *     responses:
 *       200:
 *         description: Successfully fetched all policies
 */

/**
 * @swagger
 * /policies/{id}:
 *   get:
 *     summary: Get a policy by ID
 *     tags: [Policies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Policy ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched policy data
 *       404:
 *         description: Policy not found
 */

/**
 * @swagger
 * /policies:
 *   post:
 *     summary: Create a new policy
 *     tags: [Policies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               policyNumber:
 *                 type: string
 *               policyType:
 *                 type: string
 *               coverageAmount:
 *                 type: number
 *               premium:
 *                 type: number
 *               policyholderId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Policy created successfully
 *       400:
 *         description: Validation error
 */

const express = require('express');
const { validate, validatePolicy } = require("../middleware/validation");
const Policy = require('../models/Policy');
const User = require('../models/User'); // Policyholders are stored as users
const router = express.Router();

router.post("/", validate(validatePolicy), async (req, res) => {
    try {
        const { policyId, policyNumber, policyType, coverageAmount, premium, policyholderId } = req.body;

        // Check if policy number already exists
        const existingPolicy = await Policy.findOne({ policyNumber });
        if (existingPolicy) {
            return res.status(400).json({ error: "Policy number already exists. Use a unique policy number." });
        }

        // Ensure policyholder exists
        const policyholder = await User.findOne({ userId: policyholderId, role: "policyholder" });
        if (!policyholder) {
            return res.status(400).json({ error: "Policyholder does not exist or is not a policyholder" });
        }

        // Create a new policy
        const newPolicy = new Policy({
            policyId,
            policyNumber,
            policyType,
            coverageAmount,
            premium,
            policyholderId, 
        });

        await newPolicy.save();
        res.status(201).json({ message: "Policy created successfully", policy: newPolicy });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


// Get All Policies
router.get("/",  async (req, res) => {
    try {
        const policies = await Policy.find();
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get Policy by ID
router.get("/:id", async (req, res) => {
    try {
        const policies = await Policy.find({ policyholderId: req.params.id }); // ✅ Corrected Query
        if (!policies || policies.length === 0) {
            return res.status(404).json({ message: "No policies found for this policyholder" });
        }
        res.json(policies); // ✅ Return all policies linked to the policyholder
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// Update Policy
router.put("/:id", async (req, res) => {
    try {
        const updatedPolicy = await Policy.findOneAndUpdate(
            { policyId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPolicy) {
            return res.status(404).json({ error: "Policy not found" });
        }
        res.status(200).json(updatedPolicy);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Delete Policy
router.delete("/:id", async (req, res) => {
    try {
        const deletedPolicy = await Policy.findOneAndDelete({ policyId: req.params.id });
        if (!deletedPolicy) {
            return res.status(404).json({ error: "Policy not found" });
        }
        res.status(200).json({ message: "Policy deleted successfully", deletedPolicy });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Export Router
module.exports = router;
