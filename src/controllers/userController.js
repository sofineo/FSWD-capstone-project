const UserRepository = require("../repositories/userRepository");
const UserCreateService = require("../services/UserCreateService");
const UserDeleteService = require("../services/UserDeleteService");
const UserIndexService = require("../services/UserIndexService");
const UserShowService = require("../services/UserShowService");
const UserUpdateService = require("../services/UserUpdateService");

//TODO: Create Class and link to userCreateService

// const userRepository = new UserRepository();
//TODO link to Services

class UserController {
  async create(req, res) {
    const { name, email, password } = req.body;

    //TODO: Validate input
    //     if (!name || !email) {
    //       return res
    //         .status(400)
    //         .json({ error: "Missing required fields: name, email" });
    //     }

    const userData = {
      name: name,
      email: email,
      password: password,
    };

    const userRepository = new UserRepository();
    const userCreateService = new UserCreateService(userRepository);
    const newUser = await userCreateService.execute(userData);

    return res
      .status(201)
      .json({ message: "User added successfully", user: newUser });

    //TODO: ERROR HANDLING
    //     console.error("Error creating user:", error);
    //     res.status(500).json({ error: "Failed to create user" });
  }

  async index(req, res) {
    const userRepository = new UserRepository();
    const userIndexService = new UserIndexService(userRepository);
    const users = await userIndexService.execute();

    res.status(200).json({ users: users });

    //TODO: ERROR HANDLING
    //     console.error("Error retrieving users:", error);
    //     res.status(500).json({ error: "Failed to retrieve users" });
  }

  async show(req, res) {
    const { user_id } = req.params;

    const userRepository = new UserRepository();
    const userShowService = new UserShowService(userRepository);
    const user = await userShowService.execute(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);

    //TODO: ERROR HANDLING
    //     console.error("Error retrieving user:", error);
    //     res.status(500).json({ error: "Failed to retrieve user" });
  }

  async update(req, res) {
    const { user_id } = req.params;
    const updates = req.body;

    const userRepository = new UserRepository();
    const userUpdateService = new UserUpdateService(userRepository);
    const updatedUser = await userUpdateService.execute(user_id, updates);
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });

    //TODO: ERROR HANDLING
    //     console.error("Error updating user:", error);
    //     res.status(500).json({ error: "Failed to update user" });
  }

  async delete(req, res) {
    const { user_id } = req.params;

    const userRepository = new UserRepository();
    const userDeleteService = new UserDeleteService(userRepository);
    await userDeleteService.execute(user_id);

    res.status(200).json({ message: "User deleted successfully" });

    //TODO: ERROR HANDLING
    //     console.error("Error deleting user:", error);
    //     res.status(500).json({ error: "Failed to delete user" });
  }
}

module.exports = UserController;
