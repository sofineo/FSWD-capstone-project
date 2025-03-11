const { Router } = require("express");
const router = Router();

const UserController = require("../controllers/userController");
const userController = new UserController();

router.post("/", userController.create.bind(userController));
router.get("/", userController.getUsers.bind(userController));
router.get("/:userId", userController.getUser.bind(userController));
router.put("/:userId", userController.update.bind(userController));
router.delete("/:userId", userController.delete.bind(userController));

module.exports = router;
