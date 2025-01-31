const mongoose = require('mongoose');

const SupportingDocumentSchema = new mongoose.Schema({
    claimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Claim', // References the Claim schema
        required: true
    },
    documentType: {
        type: String,
        required: true,
        enum: ['medical report', 'accident proof', 'verification document'] // Restricts document types
    },
    documentURL: {
        type: String,
        required: true // Stores the path or URL of the uploaded file
    }
}, { timestamps: true }); // Adds createdAt & updatedAt timestamps

module.exports = mongoose.model('SupportingDocument', SupportingDocumentSchema);

// Code Section	Purpose
// claimId: { type: ObjectId, ref: 'Claim', required: true }	Links the document to a specific claim.
// documentType: { type: String, enum: [...], required: true }	Restricts document type to predefined categories.
// documentURL: { type: String, required: true }	Stores the file path or URL of the uploaded document.
// { timestamps: true }	Automatically stores createdAt & updatedAt timestamps.