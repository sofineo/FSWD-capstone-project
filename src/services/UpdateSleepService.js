class UpdateSleepService {
  constructor(sleepRepository) {
    this.sleepRepository = sleepRepository;
  }

  async execute(sleepId, updates) {
    const existingSleep = await this.sleepRepository.getById(sleepId);

    if (!existingSleep) {
      throw new AppError("Sleep record not found", 404);
    }

    const updatedSleep = await this.sleepRepository.update(sleepId, updates);

    return updatedSleep;
  }
}

module.exports = UpdateSleepService;
