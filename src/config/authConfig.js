module.exports = {
  jwt: {
    secret: process.env.AUTH_SECRET || "fallback_secret",
    expiresIn: process.env.AUTH_EXPIRES_IN || "1d",
  },
};
