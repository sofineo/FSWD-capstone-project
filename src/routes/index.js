const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");

// Prefix API routes with /api
router.use("/users", userRoutes);

module.exports = router;
