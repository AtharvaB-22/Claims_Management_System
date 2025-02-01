const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    policyId: { 
        type: Number, 
        unique: true 
    },  // Custom policy ID
    policyNumber: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate policy numbers
    },
    policyType: {
        type: String,
        required: true,
        enum: ['health', 'vehicle', 'home', 'life','auto'] // Restrict to valid policy types
    },
    coverageAmount: {
        type: Number,
        required: true
    },
    premium: {
        type: Number,
        required: true
    },
    policyholderId: {
        type: Number, // References the User schema (policyholder)
        required: true
    }
}, { timestamps: true }); // Adds createdAt & updatedAt timestamps

module.exports = mongoose.model('Policy', PolicySchema);

// Code Section	Purpose
// policyNumber: { type: String, unique: true, required: true }	Ensures each policy has a unique number.
// policyType: { type: String, enum: ['health', 'vehicle', 'home', 'life'], required: true }	Restricts policy type to specific values.
// coverageAmount: { type: Number, required: true }	Stores the maximum claimable amount.
// premium: { type: Number, required: true }	Stores the cost of the policy.
// policyholderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }	Links policy to a User (policyholder).
// { timestamps: true }	Automatically stores createdAt & updatedAt timestamps.
