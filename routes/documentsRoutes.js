/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management endpoints
 */

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: Successfully fetched all documents
 */

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get a document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Document ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched document data
 *       404:
 *         description: Document not found
 */

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Upload a new document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               type:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Validation error
 */

const express = require('express');
const { validate, validateDocument } = require("../middleware/validation");
const SupportingDocument = require('../models/SupportingDocument');
const Claim = require('../models/Claim');
const router = express.Router();

// Upload a Supporting Document
router.post("/", validate(validateDocument), async (req, res) => {
    try {
        const { documentId, claimId, fileName, fileType } = req.body;

        // Ensure claim exists
        const claim = await Claim.findOne({ claimId });
        if (!claim) {
            return res.status(400).json({ error: "Claim does not exist." });
        }

        // Validate file type
        const allowedFileTypes = ["pdf", "jpg", "png"];
        if (!allowedFileTypes.includes(fileType.toLowerCase())) {
            return res.status(400).json({ error: "Invalid file type. Allowed: pdf, jpg, png." });
        }

        // Create a new document
        const newDocument = new SupportingDocument({
            documentId,
            claimId,
            fileName,
            fileType
        });

        await newDocument.save();
        res.status(201).json({ message: "Document uploaded successfully", document: newDocument });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get All Supporting Documents
router.get("/", async (req, res) => {
    try {
        const documents = await SupportingDocument.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get Document by ID
router.get("/:id", async (req, res) => {
    try {
        const document = await SupportingDocument.findOne({ documentId: req.params.id });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Update Document by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedDocument = await SupportingDocument.findOneAndUpdate(
            { documentId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedDocument) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


// Delete Document
router.delete("/:id", async (req, res) => {
    try {
        const deletedDocument = await SupportingDocument.findOneAndDelete({ documentId: req.params.id });
        if (!deletedDocument) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.status(200).json({ message: "Document deleted successfully", deletedDocument });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Export Router
module.exports = router;
