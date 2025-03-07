const express = require("express");
const router = express.Router();
const userRouter = require("./users.routes");
const sessionRouter = require("./session.routes");
const workoutRouter = require("./workouts.routes");
const waterRouter = require("./water-intake.routes");
const sleepRouter = require("./sleep.routes");

router.use("/users", userRouter);
router.use("/session", sessionRouter);
router.use("/workouts", workoutRouter);
router.use("/water-intake", waterRouter);
router.use("/sleep", sleepRouter);

module.exports = router;
