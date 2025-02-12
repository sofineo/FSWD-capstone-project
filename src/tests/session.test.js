const request = require("supertest");
const app = require("../app");

describe("Session API Tests", () => {
  let token;
  let userId;

  test("✅ Should return 401 for invalid login credentials", async () => {
    const res = await request(app).post("/api/session").send({
      email: "nonexistent@mail.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Email or password incorrect");
  });

  test("✅ Should authenticate a user and return a token", async () => {
    const newUserResponse = await request(app).post("/api/users").send({
      name: "Test User",
      email: "test@mail.com",
      password: "123456",
    });

    userId = newUserResponse.body.user.user_id;

    const res = await request(app).post("/api/session").send({
      email: "test@mail.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("✅ Should access a protected route with valid token", async () => {
    const res = await request(app)
      .get("/api/workouts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("result");
    expect(res.body.result).toHaveProperty("items"); 
    await request(app).delete(`/api/users/${userId}`);
  });

  test("✅ Should return 401 for accessing protected route without a token", async () => {
    const res = await request(app).get("/api/workouts");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      "message",
      "Access denied. No token provided."
    );
  });

  test("✅ Should return 401 for invalid token", async () => {
    const res = await request(app)
      .get("/api/workouts")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid or expired token.");
  });
});
