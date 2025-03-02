class GetSleepsService {
  constructor(sleepRepository) {
    this.sleepRepository = sleepRepository;
  }

  async execute(userId, date) {
    if (date) {
      const sleepByDate = await this.sleepRepository.findByDate(date, userId);

      return sleepByDate;
    }

    const sleeps = await this.sleepRepository.getAll(userId);

    return sleeps;
  }
}

module.exports = GetSleepsService;
