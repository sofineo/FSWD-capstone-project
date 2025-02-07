const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class CreateUserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new AppError("Email already in use");
    }

    const hashedPassword = await hash(userData.password, 8);
    userData.password = hashedPassword;

    const newUser = await this.userRepository.create(userData);

    return newUser;
  }
}

module.exports = CreateUserService;
