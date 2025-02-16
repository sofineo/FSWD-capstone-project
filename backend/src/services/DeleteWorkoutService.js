const AppError = require("../utils/AppError");

class DeleteWorkoutService {
  constructor(workoutRepository) {
    this.workoutRepository = workoutRepository;
  }

  async execute(workoutId) {
    const existingWorkout = await this.workoutRepository.getById(workoutId);

    if (!existingWorkout) {
      throw new AppError("Workout not found", 404);
    }

    await this.workoutRepository.delete(workoutId);

    return { message: "Workout deleted successfully", workoutId };
  }
}

module.exports = DeleteWorkoutService;
