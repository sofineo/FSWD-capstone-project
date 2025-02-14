require("dotenv").config();
const request = require("supertest");
const app = require("../app");

describe("💧 Water Intake API Tests", () => {
  let waterIntakeId;
  const token = `Bearer ${process.env.TEST_AUTH_TOKEN}`;

  test("✅ Should create a new water intake entry", async () => {
    const waterIntakeData = {
      water_consumed_ml: 500,
      water_goal_ml: 2000,
      date: "2025-02-10",
    };

    const res = await request(app)
      .post("/api/water-intake")
      .set("Authorization", token)
      .send(waterIntakeData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("waterIntake");
    waterIntakeId = res.body.waterIntake.water_intake_id;
  });

  test("✅ Should retrieve all water intake records for the logged-in user", async () => {
    const res = await request(app)
      .get("/api/water-intake")
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("result");
    expect(res.body.result).toHaveProperty("items");
    expect(Array.isArray(res.body.result.items)).toBe(true);
    expect(res.body.result).toHaveProperty("count");
    expect(res.body.result.count).toBeGreaterThan(0);
  });

  test("✅ Should retrieve a specific water intake entry by ID", async () => {
    const res = await request(app)
      .get(`/api/water-intake/${waterIntakeId}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("water_intake_id", waterIntakeId);
  });

  test("✅ Should update a water intake entry", async () => {
    const updateData = { amount_ml: 750 };

    const res = await request(app)
      .put(`/api/water-intake/${waterIntakeId}`)
      .set("Authorization", token)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.updatedWaterIntake).toHaveProperty("amount_ml", 750);
  });

  test("✅ Should delete a water intake entry", async () => {
    const res = await request(app)
      .delete(`/api/water-intake/${waterIntakeId}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Water Intake deleted successfully"
    );
  });

  test("❌ Should return 404 for a non-existent water intake entry", async () => {
    const res = await request(app)
      .get("/api/water-intake/non-existent-id")
      .set("Authorization", token);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Water Intake record not found");
    expect(res.body).toHaveProperty("status", "error");
  });
});
