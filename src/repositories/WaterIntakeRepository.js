const { dynamoDB } = require("../config/awsConfig");
const { v4: uuidv4 } = require("uuid");
const {
  PutCommand,
  DeleteCommand,
  GetCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { WATER_INTAKE_TABLE } = require("../config/envConfig");
const { ScanCommand } = require("@aws-sdk/client-dynamodb");

class WaterIntakeRepository {
  async filterByDate(date, userId) {
    const params = new QueryCommand({
      TableName: WATER_INTAKE_TABLE,
      IndexName: "date-user_id-index",
      KeyConditionExpression: "#date = :date AND user_id = :user_id",
      ExpressionAttributeNames: {
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":date": date,
        ":user_id": userId,
      },
    });

    const result = await dynamoDB.send(params);
    return result.Items.length ? result.Items : null;
  }

  async create(userId, waterIntakeData) {
    const waterIntake = {
      water_intake_id: uuidv4(),
      user_id: userId,
      water_consumed_ml: waterIntakeData.waterConsumedMl,
      water_goal_ml: waterIntakeData.waterGoalMl,
      date: waterIntakeData.date || new Date().toISOString().split("T")[0],
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

  async getAll(userId) {
    const params = new QueryCommand({
      TableName: WATER_INTAKE_TABLE,
      IndexName: "user_id-created_at-index",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userId,
      },
      ScanIndexForward: false, // Fetch newest workouts first
    });

    const result = await dynamoDB.send(params);
    return {
      items: result.Items || [],
      count: result.Count || null,
    };
  }

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
