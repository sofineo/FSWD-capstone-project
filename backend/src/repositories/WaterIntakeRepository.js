const { dynamoDB } = require("../config/awsConfig");
const { v4: uuidv4 } = require("uuid");
const {
  PutCommand,
  DeleteCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { WATER_INTAKE_TABLE } = require("../config/envConfig");

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
      IndexName: "user_id-date-index",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userId,
      },
      ScanIndexForward: false, // Fetch newest water-intake first
    });

    const result = await dynamoDB.send(params);
    return {
      items: result.Items || [],
      count: result.Count || null,
    };
  }

  async update(waterIntakeId, updates) {
    //REFERENCE -> https://stackoverflow.com/questions/55825544/how-to-dynamically-update-an-attribute-in-a-dynamodb-item
    // Build the update expression dynamically.
    let updateExpression = "set";
    const expressionAttributeNames = {}; //Maps att. name to avoid reserved keyword conflicts in DynamoDB
    const expressionAttributeValues = {};

    // Iterate over each field in req.body
    Object.keys(updates).forEach((field) => {
      updateExpression += ` #${field} = :${field},`;
      expressionAttributeNames[`#${field}`] = field;
      expressionAttributeValues[`:${field}`] = updates[field];
    });

    // Remove the trailing comma since updateExpression as the , in the end
    updateExpression = updateExpression.slice(0, -1);

    const params = new UpdateCommand({
      TableName: WATER_INTAKE_TABLE,
      Key: { water_intake_id: waterIntakeId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDB.send(params);
    return result.Attributes;
  }

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
