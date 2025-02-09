const WorkoutRepository = require("../repositories/WorkoutRepository");
const CreateWorkoutService = require("../services/CreateWorkoutService");
const DeleteWorkoutService = require("../services/DeleteWorkoutService");
const GetWorkoutService = require("../services/GetWorkoutService");
const GetWorkoutsService = require("../services/GetWorkoutsService");
const UpdateWorkoutService = require("../services/UpdateWorkoutsService");

class WorkoutController {
  constructor() {
    this.workoutRepository = new WorkoutRepository();

    this.createWorkoutService = new CreateWorkoutService();
    this.deleteWorkoutService = new DeleteWorkoutService();
    this.getWorkoutService = new GetWorkoutService();
    this.getWorkoutsService = new GetWorkoutsService();
    this.updateWorkoutService = new UpdateWorkoutService();
  }

  async create(req, res) {
    return res.json({ message: "Access granted", user: req.user });
  }

  async getWorkouts(req, res) {
    return res.json({ message: "Access granted", user: req.user });
  }

  async getWorkout(req, res) {
    return res.json({ message: "Access granted", user: req.user });
  }

  async update(req, res) {
    return res.json({ message: "Access granted", user: req.user });
  }

  async delete(req, res) {
    return res.json({ message: "Access granted", user: req.user });
  }
}

module.exports = WorkoutController;
