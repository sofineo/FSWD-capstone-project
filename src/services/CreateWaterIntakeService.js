class CreateWorkoutService {
  constructor(waterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  async execute(userId, waterIntakeData) {
    const newWaterIntake = await this.waterIntakeRepository.create(
      userId,
      waterIntakeData
    );

    return newWaterIntake;
  }
}

module.exports = CreateWorkoutService;
