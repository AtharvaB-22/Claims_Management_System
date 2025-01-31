const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true // Ensures IDs are not duplicated
    },
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


// const mongoose = require('mongoose');	Imports Mongoose for schema definition.
// const UserSchema = new mongoose.Schema({...})	Creates a schema to define user structure.
// name: { type: String, required: true }	Ensures every user has a name.
// email: { type: String, required: true, unique: true, lowercase: true }	Stores email uniquely & makes it lowercase for consistency.
// password: { type: String, required: true }	Stores hashed password securely.
// role: { type: String, enum: ['admin', 'policyholder'], required: true }	Restricts role values to only admin or policyholder.
// { timestamps: true }	Automatically stores createdAt & updatedAt timestamps.
// module.exports = mongoose.model('User', UserSchema);	Exports the schema so it can be used elsewhere in the project.
