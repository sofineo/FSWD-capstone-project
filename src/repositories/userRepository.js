const { dynamoDB } = require("../config/awsConfig");
const { v4: uuidv4 } = require("uuid");
const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { USERS_TABLE } = require("../config/env");

//TODO: ScanCommand is not suitable for large scale
//TODO: Check if email already exists before creating new user
//TODO: Check users exists before updating or deleting

class UserRepository {
  async findUserByEmail(email) {
    //CREATE FUNCTION
  }

  async create(userData) {
    const user = {
      user_id: uuidv4(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      createdAt: new Date().toISOString(),
    };

    const params = new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    });

    await dynamoDB.send(params);
    return user;
  }

  async index() {
    const params = new ScanCommand({ TableName: USERS_TABLE });
    const result = await dynamoDB.send(params);
    return result.Items || [];
  }

  async show(user_id) {
    const params = new GetCommand({
      TableName: USERS_TABLE,
      Key: { user_id },
    });

    const result = await dynamoDB.send(params);
    return result.Item || null; // Return null if user doesn't exist
  }

  async update(user_id, updates) {
    // Build the update expression dynamically.
    let updateExpression = "set";
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Iterate over each field in req.body
    Object.keys(updates).forEach((field) => {
      updateExpression += ` #${field} = :${field},`;
      expressionAttributeNames[`#${field}`] = field;
      expressionAttributeValues[`:${field}`] = updates[field];
    });

    // Remove the trailing comma
    updateExpression = updateExpression.slice(0, -1);

    const params = new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { user_id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDB.send(params);
    return result.Attributes;
  }

  async delete(user_id) {
    await dynamoDB.send(
      new DeleteCommand({
        TableName: USERS_TABLE,
        Key: { user_id },
      })
    );
  }
}

module.exports = UserRepository;
