const { body, param, validationResult } = require("express-validator");

// Middleware to check for validation errors
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Validation Failed", details: errors.array() });
        }
        next();
    };
};

// User Validation Rules
const validateUser = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["admin", "policyholder"]).withMessage("Invalid role"),
];

// Policy Validation Rules
const validatePolicy = [
    body("policyNumber").notEmpty().withMessage("Policy Number is required"),
    body("policyType").isIn(["Health", "Vehicle", "Home", "Life"]).withMessage("Invalid policy type"),
    body("coverageAmount").isFloat({ gt: 0 }).withMessage("Coverage amount must be greater than 0"),
    body("premium").isFloat({ gt: 0 }).withMessage("Premium must be greater than 0"),
    body("policyholderId").isInt().withMessage("Policyholder ID must be a valid number"),
];

// Claim Validation Rules
const validateClaim = [
    body("policyId").isInt().withMessage("Policy ID must be a number"),
    body("policyholderId").isInt().withMessage("Policyholder ID must be a number"),
    body("claimAmount").isFloat({ gt: 0 }).withMessage("Claim Amount must be greater than 0"),
    body("status").isIn(["pending", "approved", "rejected"]).withMessage("Invalid claim status"),
];

// Document Validation Rules
const validateDocument = [
    body("claimId").isInt().withMessage("Claim ID must be a number"),
    body("fileName").notEmpty().withMessage("File name is required"),
    body("fileType").isIn(["pdf", "jpg", "png"]).withMessage("Invalid file type"),
];

module.exports = { validate, validateUser, validatePolicy, validateClaim, validateDocument };
