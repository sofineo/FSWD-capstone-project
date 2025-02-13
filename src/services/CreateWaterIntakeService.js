const AppError = require("../utils/AppError");

class CreateWorkoutService {
  constructor(waterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  async execute(userId, waterIntakeData) {
    const existingWaterIntake = await this.waterIntakeRepository.filterByDate(
      waterIntakeData.date,
      userId
    );

    if (existingWaterIntake) {
      throw new AppError(
        "Water intake for this date already exists. Please update the existing entry instead."
      );
    }

    const newWaterIntake = await this.waterIntakeRepository.create(
      userId,
      waterIntakeData
    );

    return newWaterIntake;
  }
}

module.exports = CreateWorkoutService;
