const { dynamoDB } = require("../config/awsConfig");
const { v4: uuidv4 } = require("uuid");
const {
  PutCommand,
  DeleteCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const { WATER_INTAKE_TABLE } = require("../config/envConfig");

class WaterIntakeRepository {
  async create(userId, waterIntakeData) {
    const waterIntake = {
      water_intake_id: uuidv4(),
      user_id: userId,
      water_consumed_ml: waterIntakeData.waterConsumedMl,
      water_goal_ml: waterIntakeData.waterGoalMl,
      created_at: new Date().toISOString(),
    };

    const params = new PutCommand({
      TableName: WATER_INTAKE_TABLE,
      Item: waterIntake,
    });

    await dynamoDB.send(params);
    return waterIntake;
  }
  async getById(waterIntakeId) {
    const params = new GetCommand({
      TableName: WATER_INTAKE_TABLE,
      Key: { water_intake_id: waterIntakeId },
    });

    const result = await dynamoDB.send(params);

    return result.Item || null;
  }

  async getByDate() {}

  async getAll() {}

  async update() {}

  async delete(waterIntakeId) {
    await dynamoDB.send(
      new DeleteCommand({
        TableName: WATER_INTAKE_TABLE,
        Key: { water_intake_id: waterIntakeId },
      })
    );
  }
}

module.exports = WaterIntakeRepository;
