const AppError = require("../utils/AppError");

class UpdateUserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, updates) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found");
    }

    const checkIfEmailIsInUse = await this.userRepository.findByEmail(
      updates.email
    );

    if (checkIfEmailIsInUse) {
      throw new AppError("Email already in use");
    }

    const updatedUser = await this.userRepository.update(userId, updates);

    return updatedUser;
  }
}

module.exports = UpdateUserService;
