const SleepRepository = require("../repositories/SleepRepository");
const CreateSleepService = require("../services/CreateSleepService");
const DeleteSleepService = require("../services/DeleteSleepService");
const GetSleepService = require("../services/GetSleepService");
const GetSleepsService = require("../services/GetSleepsService");
const UpdateSleepService = require("../services/UpdateSleepService");

class SleepController {
  constructor() {
    this.sleepRepository = new SleepRepository();

    this.createSleepService = new CreateSleepService(this.sleepRepository);
    this.deleteSleepService = new DeleteSleepService(this.sleepRepository);
    this.getSleepService = new GetSleepService(this.sleepRepository);
    this.getSleepsService = new GetSleepsService(this.sleepRepository);
    this.updateSleepService = new UpdateSleepService(this.sleepRepository);
  }

  async create(req, res) {
    const { sleep_hours, sleep_goal, date } = req.body;

    const userId = req.user.userId;

    const sleepData = {
      sleepHours: sleep_hours,
      sleepGoal: sleep_goal,
      date: date || new Date().toISOString().split("T")[0],
    };

    const newSleepRecord = await this.createSleepService.execute(
      userId,
      sleepData
    );

    return res.status(201).json({
      message: "Sleep record added successfully",
      sleepData: newSleepRecord,
    });
  }

  async getSleep(req, res) {
    const { sleepId } = req.params;

    const sleep = await this.getSleepService.execute(sleepId);

    return res.status(200).json(sleep);
  }

  async getSleeps(req, res) {
    const userId = req.user.userId;
    const date = req.query.date || null;

    const result = await this.getSleepsService.execute(userId, date);

    return res.status(200).json(result);
  }

  async update(req, res) {
    const updates = req.body;

    const { sleepId } = req.params;

    updates.updated_at = new Date().toISOString();

    const updatedSleep = await this.updateSleepService.execute(
      sleepId,
      updates
    );

    return res.status(200).json({
      message: "Sleep updated successfully",
      updatedSleep,
    });
  }

  async delete(req, res) {
    const { sleepId } = req.params;

    const result = await this.deleteSleepService.execute(sleepId);

    return res.status(200).json(result);
  }
}

module.exports = SleepController;
