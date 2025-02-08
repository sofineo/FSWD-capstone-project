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
  async findById() {}

  async findByType() {}

  async create() {}

  async getAll() {}

  async update() {}

  async delete() {}
}

module.exports = WorkoutRepository;
