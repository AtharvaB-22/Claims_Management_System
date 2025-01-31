const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy', // References the Policy schema
        required: true
    },
    policyholderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User schema (policyholder)
        required: true
    },
    amountClaimed: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Restricts status values
        default: 'pending' // Default status is 'pending'
    },
    adminComments: {
        type: String,
        default: "" // Optional comments from admin on approval/rejection
    }
}, { timestamps: true }); // Adds createdAt & updatedAt timestamps

module.exports = mongoose.model('Claim', ClaimSchema);

// Code Section	Purpose
// policyId: { type: ObjectId, ref: 'Policy', required: true }	Links the claim to a specific policy.
// policyholderId: { type: ObjectId, ref: 'User', required: true }	Links the claim to the policyholder who filed it.
// amountClaimed: { type: Number, required: true }	Stores the amount requested by the policyholder.
// status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }	Tracks claim status; default is 'pending'.
// adminComments: { type: String, default: "" }	Stores any admin comments on approval/rejection.
// { timestamps: true }	Automatically stores createdAt & updatedAt timestamps.