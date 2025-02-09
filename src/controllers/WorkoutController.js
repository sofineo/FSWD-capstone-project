const WorkoutRepository = require("../repositories/WorkoutRepository");
const CreateWorkoutService = require("../services/CreateWorkoutService");
const DeleteWorkoutService = require("../services/DeleteWorkoutService");
const GetWorkoutService = require("../services/GetWorkoutService");
const GetWorkoutsService = require("../services/GetWorkoutsService");
const UpdateWorkoutService = require("../services/UpdateWorkoutsService");

class WorkoutController {
  constructor() {
    this.workoutRepository = new WorkoutRepository();

    this.createWorkoutService = new CreateWorkoutService(
      this.workoutRepository
    );
    this.deleteWorkoutService = new DeleteWorkoutService(
      this.workoutRepository
    );
    this.getWorkoutService = new GetWorkoutService(this.workoutRepository);
    this.getWorkoutsService = new GetWorkoutsService(this.workoutRepository);
    this.updateWorkoutService = new UpdateWorkoutService(
      this.workoutRepository
    );
  }

  async create(req, res) {
    const { workoutType, duration, distance, caloriesBurned, date } = req.body;

    const userId = req.user.userId;

    const workoutData = {
      workout_type: workoutType,
      duration: duration,
      distance: distance,
      calories_burned: caloriesBurned,
      date: date,
    };

    const newWorkout = await this.createWorkoutService.execute(
      userId,
      workoutData
    );

    return res
      .status(201)
      .json({ message: "Workout added successfully", workout: newWorkout });
  }

  async getWorkouts(req, res) {
    //TODO
    return res.json({ message: "Access granted", user: req.user });
  }

  async getWorkout(req, res) {
    const { workoutId } = req.params;

    const workout = await this.getWorkoutService.execute(workoutId);

    return res.status(200).json(workout);
  }

  async update(req, res) {
    //TODO
    return res.json({ message: "Access granted", user: req.user });
  }

  async delete(req, res) {
    const { workoutId } = req.params;

    const result = await this.deleteWorkoutService.execute(workoutId);

    return res.status(200).json(result);
  }
}

module.exports = WorkoutController;
