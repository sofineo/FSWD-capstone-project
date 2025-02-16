class GetWorkoutsService {
  constructor(workoutRepository) {
    this.workoutRepository = workoutRepository;
  }

  async execute(userId) {
    const result = await this.workoutRepository.getAll(userId);

    return result;
  }
}

module.exports = GetWorkoutsService;
