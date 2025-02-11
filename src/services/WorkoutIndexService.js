class IndexWorkoutService {
  constructor(workoutRepository) {
    this.workoutRepository = workoutRepository;
  }

  async execute(userId, workoutType, date, limit, lastKey) {
    if (!workoutType && !date) {
      const resultUser = await this.workoutRepository.filterByUser(
        userId,
        limit,
        lastKey
      );

      return resultUser;
    }
    if (workoutType && !date) {
      const resultType = await this.workoutRepository.filterByType(
        workoutType,
        userId
      );

      return resultType;
    }

    if (date && !workoutType) {
      const resultDate = await this.workoutRepository.filterByDate(
        date,
        userId
      );

      return resultDate;
    }

    if (date && workoutType) {
      const resultType = await this.workoutRepository.filterByType(
        workoutType,
        userId
      );

      let result = resultType.filter((workout) => workout.date === date);

      return result;
    }
  }
}

module.exports = IndexWorkoutService;
