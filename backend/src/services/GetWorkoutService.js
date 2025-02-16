const AppError = require("../utils/AppError");

class GetWorkoutService {
  constructor(workoutRepository) {
    this.workoutRepository = workoutRepository;
  }

  async execute(workoutId) {
    const workout = await this.workoutRepository.getById(workoutId);

    if (!workout) {
      throw new AppError("Workout not found", 404);
    }

    return workout;
  }
}

module.exports = GetWorkoutService;
