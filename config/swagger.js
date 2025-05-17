const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0', info: {
            title: 'Orphanage Management API', version: '1.0.0', description: 'API documentation for the system',
        }, servers: [{
            url: 'http://localhost:3000',
        },], components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http', scheme: 'bearer', bearerFormat: 'JWT',
                },
            },
        }, security: [{
            bearerAuth: [],
        },],
    },  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi, specs,
};
