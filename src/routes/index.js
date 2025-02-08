const express = require("express");
const router = express.Router();
const userRouter = require("./users.routes");
const sessionRouter = require("./session.routes");
const workoutRouter = require("./workouts.routes");

router.use("/users", userRouter);
router.use("/session", sessionRouter);
router.use("/workouts", workoutRouter);

module.exports = router;
