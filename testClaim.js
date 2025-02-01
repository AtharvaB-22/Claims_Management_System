const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Claim = require('./models/Claim');
const Policy = require('./models/Policy');
const User = require('./models/User'); // Import User model to get policyholder ID

connectDB(); // Connect to MongoDB

const testClaim = async () => {
    try {
        // Fetch an existing policyholder
        const policyholder = await User.findOne({ role: 'policyholder' });

        if (!policyholder) {
            console.log("❌ No policyholder found! Please create a user first.");
            mongoose.connection.close();
            return;
        }

        // Fetch an existing policy for the policyholder
        const policy = await Policy.findOne({ policyholderId: policyholder._id });

        if (!policy) {
            console.log("❌ No policy found for this policyholder! Please create a policy first.");
            mongoose.connection.close();
            return;
        }

        // Create a new claim
        const newClaim = new Claim({
            policyId: policy._id, // Link to the existing policy
            policyholderId: policyholder._id, // Link to the existing policyholder
            amountClaimed: 10000, // Test claim amount
            status: "pending", // Default status
            adminComments: "" // No admin comment initially
        });

        await newClaim.save(); // Save to MongoDB
        console.log("✅ Claim Created Successfully:", newClaim);
        mongoose.connection.close(); // Close DB connection
    } catch (error) {
        console.error("❌ Error Creating Claim:", error.message);
        mongoose.connection.close(); // Close connection even if error occurs
    }
};

testClaim();
