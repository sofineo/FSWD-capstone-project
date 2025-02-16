const AppError = require("../utils/AppError");

class UpdateWaterIntakeService {
  constructor(waterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  async execute(waterIntakeId, updates) {
    const existingWaterIntake = await this.waterIntakeRepository.getById(
      waterIntakeId
    );

    if (!existingWaterIntake) {
      throw new AppError("Water Intake not found", 404);
    }

    const updatedWaterIntake = await this.waterIntakeRepository.update(
      waterIntakeId,
      updates
    );

    return updatedWaterIntake;
  }
}

module.exports = UpdateWaterIntakeService;
