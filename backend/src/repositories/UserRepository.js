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
const { USERS_TABLE } = require("../config/envConfig");

class UserRepository {
  async findByEmail(email) {
    const params = new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email.toLowerCase(),
      },
    });

    const result = await dynamoDB.send(params);
    return result.Items.length ? result.Items[0] : null;
  }

  async findById(userId) {
    const params = new GetCommand({
      TableName: USERS_TABLE,
      Key: { user_id: userId },
    });

    const result = await dynamoDB.send(params);
    return result.Item || null; // Return null if user doesn't exist
  }

  async create(userData) {
    const user = {
      user_id: uuidv4(),
      email: userData.email.toLowerCase(),
      password: userData.password,
      name: userData.name,
      age: userData.age || null,
      gender: userData.gender || null,
      height: userData.height || null,
      weight: userData.weight || null,
      imperialSystem: userData.imperialSystem || false,
      create_at: new Date().toISOString(),
    };

    const params = new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    });

    await dynamoDB.send(params);
    return user;
  }

  //To avoid reading all the table -> pagination
  async findAll(limit = 10, lastKey = null) {
    const params = {
      TableName: USERS_TABLE,
      Limit: limit,
    };

    if (lastKey) {
      params.ExclusiveStartKey = lastKey;
    }

    const result = await dynamoDB.send(new ScanCommand(params));
    return {
      items: result.Items || [],
      lastKey: result.LastEvaluatedKey || null,
    };
  }

  async update(userId, updates) {
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
      TableName: USERS_TABLE,
      Key: { user_id: userId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDB.send(params);
    return result.Attributes;
  }

  async delete(userId) {
    await dynamoDB.send(
      new DeleteCommand({
        TableName: USERS_TABLE,
        Key: { user_id: userId },
      })
    );
  }
}

module.exports = UserRepository;
