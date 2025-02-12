const { dynamoDB } = require("../config/awsConfig");
const { v4: uuidv4 } = require("uuid");
const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { WORKOUTS_TABLE } = require("../config/envConfig");

class WorkoutRepository {
  async filterByUser(userId) {
    const params = new QueryCommand({
      TableName: WORKOUTS_TABLE,
      IndexName: "user_id-workout_id-index",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userId,
      },
    });

    const result = await dynamoDB.send(params);
    return result.Items.length ? result.Items : null;
  }

  async filterByType(workoutType, userId) {
    //TODO: maybe map to filter more categories at the same time?
    const params = new QueryCommand({
      TableName: WORKOUTS_TABLE,
      IndexName: "workout_type-user_id-index",
      KeyConditionExpression:
        "workout_type = :workout_type AND user_id = :user_id",
      ExpressionAttributeValues: {
        ":workout_type": workoutType.toLowerCase(),
        ":user_id": userId,
      },
    });

    const result = await dynamoDB.send(params);
    return result.Items.length ? result.Items : null;
  }

  async filterByDate(date, userId) {
    const params = new QueryCommand({
      TableName: WORKOUTS_TABLE,
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

  async create(userId, workoutData) {
    const workout = {
      workout_id: uuidv4(),
      user_id: userId,
      workout_type: workoutData.workoutType.toLowerCase(),
      duration: workoutData.duration,
      distance: workoutData.distance || null,
      calories_burned: workoutData.calories_burned || null,
      date: workoutData.date || new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    };

    const params = new PutCommand({
      TableName: WORKOUTS_TABLE,
      Item: workout,
    });

    await dynamoDB.send(params);
    return workout;
  }

  async getAll(userId) {
    const params = new QueryCommand({
      TableName: WORKOUTS_TABLE,
      IndexName: "user_id-workout_id-index",
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

  async getById(workoutId) {
    const params = new GetCommand({
      TableName: WORKOUTS_TABLE,
      Key: { workout_id: workoutId },
    });

    const result = await dynamoDB.send(params);

    return result.Item || null;
  }

  async update(workoutId, updates) {
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
      TableName: WORKOUTS_TABLE,
      Key: { workout_id: workoutId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDB.send(params);
    return result.Attributes;
  }

  async delete(workoutId) {
    await dynamoDB.send(
      new DeleteCommand({
        TableName: WORKOUTS_TABLE,
        Key: { workout_id: workoutId },
      })
    );
  }
}

module.exports = WorkoutRepository;
