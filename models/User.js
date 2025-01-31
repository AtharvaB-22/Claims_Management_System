const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate emails
        lowercase: true // Converts email to lowercase for consistency
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'policyholder'], // Only 'admin' or 'policyholder' allowed
        required: true
    }
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

// Export the User Model
module.exports = mongoose.model('User', UserSchema);