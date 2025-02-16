const AppError = require("../utils/AppError");

class GetSleepService {
  constructor(sleepRepository) {
    this.sleepRepository = sleepRepository;
  }

  async execute(sleepId) {
    const sleep = await this.sleepRepository.getById(sleepId);

    if (!sleep) {
      throw new AppError("Sleep record not found", 404);
    }

    return sleep;
  }
}

module.exports = GetSleepService;
