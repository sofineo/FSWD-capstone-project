const { Router } = require("express");
const router = Router();

const WorkoutController = require("../controllers/WorkoutController");
const workoutController = new WorkoutController();

const verifyToken = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.post("/", workoutController.create.bind(workoutController));
router.get("/", workoutController.getWorkouts.bind(workoutController));
router.get("/:workoutId", workoutController.getWorkout.bind(workoutController));
router.put("/:workoutId", workoutController.getWorkout.bind(workoutController));
router.delete(
  "/:workoutId",
  workoutController.delete.bind(workoutController)
);

module.exports = router;
