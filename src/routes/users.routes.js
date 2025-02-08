const { Router } = require("express");
const router = Router();

const UserController = require("../controllers/userController");
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 */
router.post("/", userController.create.bind(userController));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users.
 */
router.get("/", userController.getUsers.bind(userController));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get specific user
 *     responses:
 *       200:
 *         description: Specific user by id.
 */
router.get("/:userId", userController.getUser.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates the name of an existing user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 */
router.put("/:userId", userController.update.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Removes a user from the list.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 */
router.delete("/:userId", userController.delete.bind(userController));

module.exports = router;
