const User = require('../models/User');

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

module.exports = adminOrSelfAuth;
