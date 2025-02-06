const express = require("express");
const router = express.Router();
const userRouter = require("./users.routes");

router.use("/users", userRouter);

module.exports = router;
