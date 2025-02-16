require("dotenv").config();
const request = require("supertest");
const app = require("../app");

describe(" Sleep API Tests", () => {
  let sleepId;
  const token = `Bearer ${process.env.TEST_AUTH_TOKEN}`;

  test("✅ Should create a new sleep entry", async () => {
    const sleepData = {
      sleep_hours: 6.5,
      sleep_goal: 8,
      date: "2025-02-10",
    };

    const res = await request(app)
      .post("/api/sleep")
      .set("Authorization", token)
      .send(sleepData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("sleepData");
    sleepId = res.body.sleepData.sleep_id;
  });

  test("✅ Should retrieve all sleep records for the logged-in user", async () => {
    const res = await request(app)
      .get("/api/sleep")
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("count");
  });

  test("✅ Should retrieve a specific sleep entry by ID", async () => {
    const res = await request(app)
      .get(`/api/sleep/${sleepId}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("sleep_id", sleepId);
  });

  test("✅ Should update a sleep record entry", async () => {
    const updateData = { sleep_hours: 7 };

    const res = await request(app)
      .put(`/api/sleep/${sleepId}`)
      .set("Authorization", token)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.updatedSleep).toHaveProperty("sleep_hours", 7);
  });

  test("✅ Should delete a sleep record entry", async () => {
    const res = await request(app)
      .delete(`/api/sleep/${sleepId}`)
      .set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Sleep record deleted successfully"
    );
  });

  test("❌ Should return 404 for a non-existent sleep record entry", async () => {
    const res = await request(app)
      .get("/api/sleep/non-existent-id")
      .set("Authorization", token);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Sleep record not found");
    expect(res.body).toHaveProperty("status", "error");
  });
});
