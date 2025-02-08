const { Router } = require("express");

const router = Router();

const SessionController = require("../controllers/SessionController");
const sessionController = new SessionController();

router.post("/", sessionController.create.bind(sessionController));

module.exports = router;
