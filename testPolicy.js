const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Policy = require('./models/Policy');
const User = require('./models/User'); // Import User model to get a policyholder ID

connectDB(); // Connect to MongoDB

const testPolicy = async () => {
    try {
        // Fetch an existing policyholder (we assume a policyholder already exists)
        const policyholder = await User.findOne({ role: 'policyholder' });

        if (!policyholder) {
            console.log("❌ No policyholder found! Please create a user first.");
            mongoose.connection.close();
            return;
        }

        // Create a new policy
        const newPolicy = new Policy({
            policyNumber: "POL123456",
            policyType: "health", // Change to 'vehicle', 'home', or 'life' if needed
            coverageAmount: 500000,
            premium: 5000,
            policyholderId: policyholder._id // Link to the existing policyholder
        });

        await newPolicy.save(); // Save to MongoDB
        console.log("Policy Created Successfully: ", newPolicy);
        mongoose.connection.close(); // Close DB connection
    } catch (error) {
        console.error("Error Creating Policy:", error.message);
        mongoose.connection.close(); // Close connection even if error occurs
    }
};

testPolicy();
