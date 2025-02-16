const { Router } = require("express");
const router = Router();

const SleepController = require("../controllers/SleepController");
const sleepController = new SleepController();

const verifyToken = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.post("/", sleepController.create.bind(sleepController));
router.get("/", sleepController.getSleeps.bind(sleepController));
router.get("/:sleepId", sleepController.getSleep.bind(sleepController));
router.put("/:sleepId", sleepController.update.bind(sleepController));
router.delete("/:sleepId", sleepController.delete.bind(sleepController));

module.exports = router;
