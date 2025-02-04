const dynamoDB = require("../config/awsConfig");

const TABLE_NAME = "UsersTable"; // Ensure this matches your actual table name

// Get all users
const getAllUsers = async () => {
  const params = { TableName: TABLE_NAME };
  const data = await dynamoDB.scan(params).promise();
  return data.Items;
};

// Get a single user by ID
const getUserById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };
  const data = await dynamoDB.get(params).promise();
  return data.Item;
};

// Create a new user
const createUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Item: user,
  };
  await dynamoDB.put(params).promise();
  return user;
};

// Update a user
const updateUser = async (id, name) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: "set #name = :name",
    ExpressionAttributeNames: { "#name": "name" },
    ExpressionAttributeValues: { ":name": name },
    ReturnValues: "ALL_NEW",
  };
  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
};

// Delete a user
const deleteUser = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };
  await dynamoDB.delete(params).promise();
  return { message: "User deleted successfully!" };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
