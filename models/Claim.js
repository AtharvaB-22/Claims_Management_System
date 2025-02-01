const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
    claimId: { type: Number, required: true, unique: true },
    policyId: { type: Number, required: true },  // Changed from ObjectId to Number
    policyholderId: { type: Number, required: true },  // Changed from ObjectId to Number
    claimAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    supportingDocuments: { type: [String], default: [] }
});

const Claim = mongoose.model("Claim", claimSchema);
module.exports = Claim;
