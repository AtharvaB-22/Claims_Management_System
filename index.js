require('dotenv').config({ path: './setup.env' }); // Load setup.env
const express = require("express");
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express(); // Initialize app first
app.use(express.json()); // Allows handling JSON data in requests

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Claims Management API",
            version: "1.0.0",
            description: "API documentation for Claims Management System",
        },
        servers: [
            {
                url: "https://claims-management-system-gpit.onrender.com",
                description: "Production Server",
            },
            {
                url: "http://localhost:3000",
                description: "Local Development Server",
            }
        ],
    },
    apis: ["./routes/*.js"], // Scans all route files for Swagger comments
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log("Swagger documentation available at /api-docs");

const allowedOrigins = [
    'https://claims-management-system-frontend.onrender.com',
    'http://localhost:3001' , // for local development
    'http://localhost:5173', // Add this for Vite frontend
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// app.use(cors());


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests, please try again later.'
});

app.use(apiLimiter);

const connectDB = require('./config/db');
connectDB();

const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const User = require('./models/User');
const Policy = require('./models/Policy');
const Claim = require('./models/Claim');
const SupportingDocument = require('./models/SupportingDocument');
const userRoutes = require('./routes/userRoutes');
const policyholderRoutes = require('./routes/policyholderRoutes');
const policyRoutes = require('./routes/policyRoutes');
const claimRoutes = require('./routes/claimRoutes');
const documentRoutes = require('./routes/documentsRoutes');

const { createUser, getUsers, getUserByID, updateUser, deleteUser, users } = require("./entities");
const { createPolicyholder, getPolicyholders, updatePolicyholder, deletePolicyholder, getPolicyholderById } = require("./entities"); // Imports policyholder functions
const { createPolicy, getPolicies, getPolicyById, updatePolicy, deletePolicy } = require("./entities");
const { createClaim, getClaimById, getClaims, updateClaim, deleteClaim } = require("./entities");
const { createDocument, getSupportingDocuments, getSupportingDocumentById, updateSupportingDocument, deleteSupportingDocument } = require("./entities");
const { reviewClaim } = require("./entities");

const PORT = 3000;

// Register routes
app.use('/users', userRoutes);
app.use('/policyholders', policyholderRoutes);
app.use('/policies', policyRoutes);
app.use('/claims', claimRoutes);
app.use('/documents', documentRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Server is running successfully!" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        details: err.message,
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
