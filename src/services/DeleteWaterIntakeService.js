const AppError = require("../utils/AppError");

class DeleteWaterIntakeService {
  constructor(waterIntakeRepository) {
    this.waterIntakeRepository = waterIntakeRepository;
  }

  async execute(waterIntakeId) {
    const existingWorkout = await this.waterIntakeRepository.getById(
      waterIntakeId
    );

    if (!existingWorkout) {
      throw new AppError("Workout not found", 404);
    }

    await this.waterIntakeRepository.delete(waterIntakeId);

    return { message: "Water Intake deleted successfully", waterIntakeId };
  }
}

module.exports = DeleteWaterIntakeService;
