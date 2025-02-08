const request = require("supertest");
const app = require("../app");

describe("User API Tests", () => {
  let userId;

  test("✅ Should create a new user", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Test User",
      email: "test@mail.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
    userId = res.body.user.user_id;
  });

  test("✅ Should retrieve all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBeGreaterThan(0);
  });

  test("✅ Should retrieve a user by ID", async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe(userId);
  });

  test("✅ Should return 404 for non-existent user", async () => {
    const res = await request(app).get("/api/users/non-existent-id");
    expect(res.status).toBe(404);
  });

  test("✅ Should update a user", async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: "Updated Name", email: "updated@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Updated Name");
  });

  test("✅ Should delete a user", async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "User deleted successfully", userId });
  });
});
