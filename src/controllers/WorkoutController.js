const WorkoutRepository = require("../repositories/WorkoutRepository");
const CreateWorkoutService = require("../services/CreateWorkoutService");
const DeleteWorkoutService = require("../services/DeleteWorkoutService");
const GetWorkoutService = require("../services/GetWorkoutService");
const GetWorkoutsService = require("../services/GetWorkoutsService");
const UpdateWorkoutService = require("../services/UpdateWorkoutsService");
const IndexWorkoutService = require("../services/WorkoutIndexService");

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
    this.indexWorkoutService = new IndexWorkoutService(this.workoutRepository);
  }

  async create(req, res) {
    const { workout_type, duration, distance, caloriesBurned, date } = req.body;

    const userId = req.user.userId;

    const workoutData = {
      workoutType: workout_type,
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
    const userId = req.user.userId;

    const result = await this.getWorkoutsService.execute(userId);

    return res.status(200).json({
      result,
    });
  }

  async getWorkout(req, res) {
    const { workoutId } = req.params;

    const workout = await this.getWorkoutService.execute(workoutId);

    res.status(200).json(workout);
  }

  async update(req, res) {
    const updates = req.body;

    const { workoutId } = req.params;

    const updatedWorkout = await this.updateWorkoutService.execute(
      workoutId,
      updates
    );

    return res
      .status(200)
      .json({ message: "Workout updated successfully", updatedWorkout });
  }

  async delete(req, res) {
    const { workoutId } = req.params;

    const result = await this.deleteWorkoutService.execute(workoutId);

    return res.status(200).json(result);
  }

  async index(req, res) {
    const userId = req.user.userId;
    const workoutType = req.query.type || null;
    const date = req.query.date || null;
    const limit = parseInt(req.query.limit) || 10;
    const lastKey = req.query.lastKey
      ? JSON.parse(decodeURIComponent(req.query.lastKey))
      : null;

    const result = await this.indexWorkoutService.execute(
      userId,
      workoutType,
      date,
      limit,
      lastKey
    );

    return res.status(200).json({
      result,
    });
  }
}

module.exports = WorkoutController;
