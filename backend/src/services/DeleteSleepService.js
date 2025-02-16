const AppError = require("../utils/AppError");

class DeleteSleepService {
  constructor(sleepRepository) {
    this.sleepRepository = sleepRepository;
  }

  async execute(sleepId) {
    const sleep = await this.sleepRepository.getById(sleepId);

    if (!sleep) {
      throw new AppError("Sleep record not found", 404);
    }

    await this.sleepRepository.delete(sleepId);

    return { message: "Sleep record deleted successfully", sleepId };
  }
}

module.exports = DeleteSleepService;
