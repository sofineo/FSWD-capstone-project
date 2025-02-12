const AppError = require("../utils/AppError");

class GetWaterIntakeService {
  constructor(waterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  async execute(waterIntakeId) {
    const waterIntake = await this.waterIntakeRepository.getById(waterIntakeId);

    if (!waterIntake) {
      throw new AppError("Water Intake not found", 404);
    }

    return waterIntake;
  }
}

module.exports = GetWaterIntakeService;
