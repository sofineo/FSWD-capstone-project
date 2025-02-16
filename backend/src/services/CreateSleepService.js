const AppError = require("../utils/AppError");

class CreateSleepService {
  constructor(sleepRepository) {
    this.sleepRepository = sleepRepository;
  }

  async execute(userId, sleepData) {
    const existingSleepDate = await this.sleepRepository.findByDate(
      sleepData.date,
      userId
    );

    if (existingSleepDate) {
      throw new AppError(
        "Sleep record for this date already exists. Please update the existing entry instead."
      );
    }

    const newSleep = await this.sleepRepository.create(userId, sleepData);

    return newSleep;
  }
}

module.exports = CreateSleepService;
