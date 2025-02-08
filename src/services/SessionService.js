const AppError = require("../utils/AppError");

class SessionService {
  constructor(sessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute({ email, password }) {
    const user = await this.sessionRepository.getUserByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect", 401);
    }

    const validPassword = await this.sessionRepository.verifyPassword({
      user,
      password,
    });

    if (!validPassword) {
      throw new AppError("Email or password incorrect", 401);
    }

    const session = await this.sessionRepository.generateToken({
      user,
    });

    return session;
  }
}

module.exports = SessionService;
