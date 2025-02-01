console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // Debugging Line

const mongoose = require('mongoose');
require('dotenv').config({ path: './setup.env' });

const connectDB = async () => {
    try {
        console.log("✅ Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected...');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
