const env = require("../config/env");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Initialize AWS SDK v3 DynamoDB Client
const client = new DynamoDBClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create DocumentClient for simplified data operations
const dynamoDB = DynamoDBDocumentClient.from(client);

// Export the initialized DynamoDB client
module.exports = { dynamoDB };
