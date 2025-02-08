const UserRepository = require("../repositories/userRepository");
const CreateUserService = require("../services/CreateUserService");
const DeleteUserService = require("../services/DeleteUserService");
const GetUsersService = require("../services/GetUsersService");
const GetUserService = require("../services/GetUserService");
const UpdateUserService = require("../services/UpdateUserService");

class UserController {
  constructor() {
    this.userRepository = new UserRepository();

    this.createUserService = new CreateUserService(this.userRepository);
    this.deleteUserService = new DeleteUserService(this.userRepository);
    this.getUsersService = new GetUsersService(this.userRepository);
    this.getUserService = new GetUserService(this.userRepository);
    this.updateUserService = new UpdateUserService(this.userRepository);
  }

  async create(req, res) {
    const { name, email, password, age, gender, height, weight } = req.body;

    //TODO: Validate input

    const userData = {
      name: name,
      email: email,
      password: password,
      age: age,
      gender: gender,
      height: height,
      weight: weight,
    };

    const newUser = await this.createUserService.execute(userData);

    return res
      .status(201)
      .json({ message: "User added successfully", user: newUser });
  }

  async getUsers(req, res) {
    const limit = parseInt(req.query.limit) || 10;
    const lastKey = req.query.lastKey
      ? JSON.parse(decodeURIComponent(req.query.lastKey))
      : null;

    const result = await this.getUsersService.execute(limit, lastKey);

    res.status(200).json({
      users: result.items,
      nextPageKey: result.lastKey ? JSON.stringify(result.lastKey) : null,
    });
  }

  async getUser(req, res) {
    const { userId } = req.params;

    const user = await this.getUserService.execute(userId);

    res.status(200).json(user);
  }

  async update(req, res) {
    const { userId } = req.params;
    const updates = req.body;

    const updatedUser = await this.updateUserService.execute(userId, updates);
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  }

  async delete(req, res) {
    const { userId } = req.params;

    const result = await this.deleteUserService.execute(userId);

    res.status(200).json(result);
  }
}

module.exports = UserController;
