const { PORT } = require("./config/envConfig");
const app = require("./app");

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/api`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
