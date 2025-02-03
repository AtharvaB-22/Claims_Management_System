const jwt = require('jsonwebtoken');

const payload = {
    id: "123456",
    name: "Test User",
    email: "test@example.com",
    role: "policyholder"
};

const secretKey = "MONGO_URI"; 
const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

console.log("Generated Token:", token);
