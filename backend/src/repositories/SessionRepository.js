const { dynamoDB } = require("../config/awsConfig");
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { USERS_TABLE } = require("../config/envConfig");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const authConfig = require("../config/authConfig");

class SessionRepository {
  async getUserByEmail(email) {
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

  async verifyPassword({ user, password }) {
    return await compare(password, user.password);
  }

  async generateToken({ user }) {
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ sub: String(user.user_id) }, secret, { expiresIn });

    return { user, token };
  }
}

module.exports = SessionRepository;
