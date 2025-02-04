const env = require("../config/env");
const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDB } = require("../config/awsConfig");

const TABLE_NAME = env.USERS_TABLE;

// Create a new user
exports.createUser = async (req, res) => {
  const { user_id, name, email } = req.body;

  if (!TABLE_NAME) {
    return res.status(500).json({ error: "Table name is missing in .env" });
  }

  if (!user_id) {
    return res
      .status(400)
      .json({ error: "user_id is required in request body" });
  }

  const params = {
    TableName: TABLE_NAME,
    Item: { user_id, name, email },
  };

  try {
    await dynamoDB.send(new PutCommand(params));
    res.json({ message: "User added successfully", user: params.Item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user by ID
exports.getUser = async (req, res) => {
  const { user_id } = req.params;

  const params = {
    TableName: TABLE_NAME,
    Key: { user_id },
  };

  try {
    const result = await dynamoDB.send(new GetCommand(params));
    if (!result.Item) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.Item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
