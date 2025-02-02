const User = require('../models/User');
const jwt = require("jsonwebtoken");

const adminOrSelfAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userId); // Get user from database

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if user is an admin OR the same user trying to delete their own account
        if (user.role === "admin" || user._id.toString() === req.params.id) {
            next(); // Allow request to proceed
        } else {
            return res.status(403).json({ error: "Access Denied: You can only delete your own account" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt; // Read JWT from cookies

    if (!token) {
        return res.status(401).json({ error: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authenticateJWT;
module.exports = adminOrSelfAuth;
