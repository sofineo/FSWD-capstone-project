require("dotenv").config();

const requiredEnv = [
  "PORT",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "USERS_TABLE"
];

// Check if all required environment variables are set
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ ERROR: Missing environment variable: ${key}`);
    process.exit(1); // Stop execution if a required variable is missing
  }
});

console.log("✅ All required environment variables are set!");

module.exports = {
  PORT: process.env.PORT || 9000,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  USERS_TABLE: process.env.USERS_TABLE
};
