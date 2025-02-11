class UpdateWorkoutService {
  constructor(workoutRepository) {
    this.workoutRepository = workoutRepository;
  }

  async execute(workoutId, updates) {
    const existingWorkout = await this.workoutRepository.getById(workoutId);

    if (!existingWorkout) {
      throw new AppError("Workout not found", 404);
    }

    const updatedWorkout = await this.workoutRepository.update(
      workoutId,
      updates
    );

    return updatedWorkout;
  }
}

module.exports = UpdateWorkoutService;
