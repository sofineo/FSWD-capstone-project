const { dynamoDB } = require("../config/awsConfig");
const { v4: uuidv4 } = require("uuid");
const {
  PutCommand,
  GetCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { USERS_TABLE } = require("../config/env");

// Create a new user in DynamoDB
exports.createUser = async (userData) => {
  const user = {
    id: uuidv4(), // Generate a unique ID
    name: userData.name,
    email: userData.email.toLowerCase(), // Normalize email
    createdAt: new Date().toISOString(),
  };

  const params = new PutCommand({
    TableName: USERS_TABLE,
    Item: user,
  });

  await dynamoDB.send(params);
  return user;
};

// Get a user by ID
exports.getUserById = async (id) => {
  const params = new GetCommand({
    TableName: USERS_TABLE,
    Key: { id },
  });

  const result = await dynamoDB.send(params);
  return result.Item || null; // Return null if user doesn't exist
};

// Get all users (⚠ Uses Scan → Not efficient for large datasets)
exports.getAllUsers = async () => {
  const params = new ScanCommand({ TableName: USERS_TABLE });
  const result = await dynamoDB.send(params);
  return result.Items || [];
};
