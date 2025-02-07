require("express-async-errors");

const express = require("express");
const cors = require("cors");
const AppError = require("./utils/AppError");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swaggerConfig");
const apiRouter = require("./routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.log(error); //debug purpose

  return res.status(error.statusCode).json({
    status: "error",
    message: "Internal server error",
  });
});

module.exports = app;
