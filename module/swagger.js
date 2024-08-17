const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");
const userSchemas = require("../components/auth");
const exerciseSchemas = require("../components/exercise");
const profileSchemas = require("../components/profile");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "healthkungya API",
      version: "1.0.0",
      description: "healthkungya API with express",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ...userSchemas,
        ...exerciseSchemas,
        ...profileSchemas,
      },
    },
  },
  apis: ["./router/*.js"],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
