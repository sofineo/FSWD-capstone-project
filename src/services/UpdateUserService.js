const AppError = require("../utils/AppError");

class UpdateUserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, updates) {
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    if (updates.email && updates.email !== existingUser.email) {
      const existingUserWithEmail = await this.userRepository.findByEmail(
        updates.email
      );

      if (existingUserWithEmail) {
        throw new AppError("Email already in use", 409);
      }
    }

    const updatedUser = await this.userRepository.update(userId, updates);

    return updatedUser;
  }
}

module.exports = UpdateUserService;
