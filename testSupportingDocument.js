const mongoose = require('mongoose');
const connectDB = require('./config/db');
const SupportingDocument = require('./models/SupportingDocument');
const Claim = require('./models/Claim'); // Import Claim model to get claim ID

connectDB(); // Connect to MongoDB

const testSupportingDocument = async () => {
    try {
        // Fetch an existing claim
        const claim = await Claim.findOne();

        if (!claim) {
            console.log("❌ No claim found! Please create a claim first.");
            mongoose.connection.close();
            return;
        }

        // Create a new supporting document
        const newDocument = new SupportingDocument({
            claimId: claim._id, // Link to the existing claim
            documentType: "medical report", // Change to 'accident proof' or 'verification document' if needed
            documentURL: "https://example.com/document.pdf" // Example file URL
        });

        await newDocument.save(); // Save to MongoDB
        console.log("✅ Supporting Document Created Successfully:", newDocument);
        mongoose.connection.close(); // Close DB connection
    } catch (error) {
        console.error("❌ Error Creating Supporting Document:", error.message);
        mongoose.connection.close(); // Close connection even if error occurs
    }
};

testSupportingDocument();
