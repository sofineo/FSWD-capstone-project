const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HealthSync - Fitness Tracker API",
      version: "1.0.0",
      description: "API for managing fitness tracking users and data",
    },
    servers: [{ url: "http://localhost:3000", description: "Local server" }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
module.exports = swaggerDocs;
