const AppError = require("../utils/AppError");

class DeleteUserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new AppError("User not found");
    }

    await this.userRepository.delete(userId);

    return { message: "User deleted successfully", userId };
  }
}

module.exports = DeleteUserService;
