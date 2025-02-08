const AppError = require("../utils/AppError");

class GetUserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    return existingUser;
  }
}

module.exports = GetUserService;
