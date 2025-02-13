const WaterIntakeRepository = require("../repositories/WaterIntakeRepository");
const CreateWaterIntakeService = require("../services/CreateWaterIntakeService");
const DeleteWaterIntakeService = require("../services/DeleteWaterIntakeService");
const GetWaterIntakesService = require("../services/GetWaterIntakesService");
const GetWaterIntakeService = require("../services/GetWaterIntakeService");
const UpdateWaterIntakeService = require("../services/UpdateWaterIntakeService");

class WaterIntakeController {
  constructor() {
    this.waterIntakeRepository = new WaterIntakeRepository();

    this.createWaterIntakeService = new CreateWaterIntakeService(
      this.waterIntakeRepository
    );
    this.deleteWaterIntakeService = new DeleteWaterIntakeService(
      this.waterIntakeRepository
    );
    this.getWaterIntakesService = new GetWaterIntakesService(
      this.waterIntakeRepository
    );
    this.getWaterIntakeService = new GetWaterIntakeService(
      this.waterIntakeRepository
    );
    this.updateWaterIntakeService = new UpdateWaterIntakeService(
      this.waterIntakeRepository
    );
  }
  async create(req, res) {
    const { water_consumed_ml, water_goal_ml, date } = req.body;

    const userId = req.user.userId;

    const waterIntakeData = {
      waterConsumedMl: water_consumed_ml,
      waterGoalMl: water_goal_ml,
      date: date || new Date().toISOString().split("T")[0],
    };

    const newWaterIntake = await this.createWaterIntakeService.execute(
      userId,
      waterIntakeData
    );

    return res.status(201).json({
      message: "Water Intake added successfully",
      workout: newWaterIntake,
    });
  }

  async getWaterIntakes(req, res) {
    const userId = req.user.userId;
    const date = req.query.date || null;

    const result = await this.getWaterIntakesService.execute(userId, date);

    return res.status(200).json({
      result,
    });
  }

  async getWaterIntake(req, res) {
    const { waterIntakeId } = req.params;

    const waterIntake = await this.getWaterIntakeService.execute(waterIntakeId);

    res.status(200).json(waterIntake);
  }

  async update(req, res) {}

  async delete(req, res) {
    const { waterIntakeId } = req.params;

    const result = await this.deleteWaterIntakeService.execute(waterIntakeId);

    return res.status(200).json(result);
  }
}

module.exports = WaterIntakeController;
