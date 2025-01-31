const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

connectDB(); // Connect to MongoDB

const testUser = async () => {
    try {
        const newUser = new User({
            name: "AB",
            email: "ab@example.com",
            password: "testpassword", // We are not hashing for now
            role: "a" // Change to "admin" to test admin user
        });

        await newUser.save(); // Save to MongoDB
        console.log("✅ User Created Successfully:", newUser);
        mongoose.connection.close(); // Close DB connection
    } catch (error) {
        console.error("❌ Error Creating User:", error.message);
        mongoose.connection.close(); // Close connection even if error occurs
    }
};

testUser();