const { Router } = require("express");
const router = Router();

const WorkoutController = require("../controllers/WorkoutController");
const workoutController = new WorkoutController();

const verifyToken = require("../middlewares/authMiddleware");

router.use("/", verifyToken, (req, res) => {
  return res.json({ message: "Access granted", user: req.user });
});

// router.post("/", workoutController.create.bind(workoutController));
// router.get("/", workoutController.getWorkouts.bind(workoutController));
// router.get("/:workoutId", workoutController.getWorkout.bind(workoutController));
// router.put("/:workoutId", workoutController.getWorkout.bind(workoutController));
// router.delete(
//   "/:workoutId",
//   workoutController.getWorkout.bind(workoutController)
// );

module.exports = router;
