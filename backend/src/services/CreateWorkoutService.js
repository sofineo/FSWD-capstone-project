class CreateWorkoutService {
  constructor(workoutRepository) {
    this.workoutRepository = workoutRepository;
  }

  async execute(userId, workoutData) {
    const newWorkout = await this.workoutRepository.create(userId, workoutData);

    return newWorkout;
  }
}

module.exports = CreateWorkoutService;
