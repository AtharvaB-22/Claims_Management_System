const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Define API documentation options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Claims Management API',
            version: '1.0.0',
            description: 'API Documentation for the Claims Management System'
        },
        servers: [
            {
                url: 'https://claims-management-system-gpit.onrender.com', // Change this if using a different domain
                description: 'Production Server'
            },
            {
                url: 'http://localhost:3000',
                description: 'Local Development Server'
            }
        ]
    },
    apis: ['./routes/*.js'] // This will scan all route files for documentation
};

// Generate Swagger Docs
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Export the function to set up Swagger UI
module.exports = { swaggerDocs, swaggerUi };
