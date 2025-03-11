const { PORT } = require("./config/envConfig");
const app = require("./app");

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://3.146.34.160:${PORT}/api`);
  console.log(`Swagger Docs available at http://3.146.34.160:${PORT}/api-docs`);
});
