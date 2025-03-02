const {
  PutCommand,
  QueryCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { SLEEP_TABLE } = require("../config/envConfig");
const { dynamoDB } = require("../config/awsConfig");

class SleepRepository {
  async findByDate(date, userId) {
    console.log(date);

    const params = new QueryCommand({
      TableName: SLEEP_TABLE,
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

  async getById(sleepId) {
    const params = new GetCommand({
      TableName: SLEEP_TABLE,
      Key: { sleep_id: sleepId },
    });

    const result = await dynamoDB.send(params);

    return result.Item || null;
  }

  async create(userId, sleepData) {
    const sleep = {
      sleep_id: uuidv4(),
      user_id: userId,
      sleep_hours: sleepData.sleepHours,
      sleep_goal: sleepData.sleepGoal,
      date: sleepData.date || new Date().toISOString().split("T")[0],
      create_at: new Date().toISOString(),
    };

    const params = new PutCommand({
      TableName: SLEEP_TABLE,
      Item: sleep,
    });

    await dynamoDB.send(params);
    return sleep;
  }

  async getAll(userId) {
    const params = new QueryCommand({
      TableName: SLEEP_TABLE,
      IndexName: "user_id-date-index",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userId,
      },
      ScanIndexForward: false, // Fetch newest sleep first
    });

    const result = await dynamoDB.send(params);
    return {
      items: result.Items || [],
      count: result.Count || null,
    };
  }

  async update(sleepId, updates) {
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
      TableName: SLEEP_TABLE,
      Key: { sleep_id: sleepId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDB.send(params);
    return result.Attributes;
  }

  async delete(sleepId) {
    await dynamoDB.send(
      new DeleteCommand({
        TableName: SLEEP_TABLE,
        Key: { sleep_id: sleepId },
      })
    );
  }
}

module.exports = SleepRepository;
