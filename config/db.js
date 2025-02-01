const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/claims_management', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully!!');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1); // Exit if the connection fails
    }
};

module.exports = connectDB;
