class GetWaterIntakesService {
  constructor(waterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  async execute(userId, date) {
    if (date) {
      const waterIntakeByDate = await this.waterIntakeRepository.filterByDate(
        date,
        userId
      );
 
      return waterIntakeByDate;
    }

    const waterIntakes = await this.waterIntakeRepository.getAll(userId);

    return waterIntakes;
  }
}

module.exports = GetWaterIntakesService;
