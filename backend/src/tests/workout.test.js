require("dotenv").config();
const request = require("supertest");
const app = require("../app");

describe("🏋️ Workout API Tests", () => {
  let workoutId;
  const token = `Bearer ${process.env.TEST_AUTH_TOKEN}`;

  test("✅ Should create a new workout", async () => {
    const workoutData = {
      workout_type: "cardio",
      duration: 30,
      distance: 5,
      caloriesBurned: 250,
      date: "2025-02-10",
    };

    const res = await request(app)
      .post("/api/workouts")
      .set("Authorization", token)
      .send(workoutData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("workout");
    workoutId = res.body.workout.workout_id;
  });

  test("✅ Should retrieve all workouts for the logged-in user", async () => {
    const res = await request(app)
      .get("/api/workouts")
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("result");
    expect(res.body.result).toHaveProperty("items");
    expect(Array.isArray(res.body.result.items)).toBe(true);
    expect(res.body.result).toHaveProperty("count");
    expect(res.body.result.count).toBeGreaterThan(0);
  });

  test("✅ Should retrieve a specific workout by ID", async () => {
    const res = await request(app)
      .get(`/api/workouts/${workoutId}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("workout_id", workoutId);
  });

  test("✅ Should update a workout", async () => {
    const updateData = { duration: 45 };

    const res = await request(app)
      .put(`/api/workouts/${workoutId}`)
      .set("Authorization", token)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.updatedWorkout).toHaveProperty("duration", 45);
  });

  test("✅ Should delete a workout", async () => {
    const res = await request(app)
      .delete(`/api/workouts/${workoutId}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Workout deleted successfully");
  });

  test("❌ Should return 404 for a non-existent workout", async () => {
    const res = await request(app)
      .get("/api/workouts/non-existent-id")
      .set("Authorization", token);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Workout not found");
    expect(res.body).toHaveProperty("status", "error");
  });
});
