const { Router } = require("express");
const router = Router();

const WaterIntakeController = require("../controllers/WaterIntakeController");
const waterIntakeController = new WaterIntakeController();

const verifyToken = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.post("/", waterIntakeController.create.bind(waterIntakeController));
router.get(
  "/",
  waterIntakeController.getWaterIntakes.bind(waterIntakeController)
);
router.get(
  "/:waterIntakeId",
  waterIntakeController.getWaterIntake.bind(waterIntakeController)
);
router.put(
  "/:waterIntakeId",
  waterIntakeController.update.bind(waterIntakeController)
);
router.delete(
  "/:waterIntakeId",
  waterIntakeController.delete.bind(waterIntakeController)
);

module.exports = router;
