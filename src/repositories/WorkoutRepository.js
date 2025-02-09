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
  async filterByType() {
    //TODO
  }

  async create(userId, workoutData) {
    const workout = {
      workout_id: uuidv4(),
      user_id: userId,
      workout_type: workoutData.workout_type,
      duration: workoutData.duration,
      distance: workoutData.distance || null,
      calories_burned: workoutData.calories_burned || null,
      date: workoutData.date || new Date().toISOString(),
    };

    const params = new PutCommand({
      TableName: WORKOUTS_TABLE,
      Item: workout,
    });

    await dynamoDB.send(params);
    return workout;
  }

  async getAll() {
    //TODO
  }

  async getById(workoutId) {
    const params = new GetCommand({
      TableName: WORKOUTS_TABLE,
      Key: { workout_id: workoutId },
    });

    const result = await dynamoDB.send(params);

    return result.Item || null;
  }

  async update() {
    //TODO
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
