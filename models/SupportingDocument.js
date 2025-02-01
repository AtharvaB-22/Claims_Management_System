const mongoose = require("mongoose");

const SupportingDocumentSchema = new mongoose.Schema({
    documentId: { type: Number, required: true, unique: true }, // Custom ID
    claimId: { type: Number, required: true }, // Linked to Claim
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now } // Auto-generate upload timestamp
});

// Export Model
module.exports = mongoose.model("SupportingDocument", SupportingDocumentSchema);
