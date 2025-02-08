const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../config/authConfig");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Access denied. No token provided.", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    req.user = { userId: user_id };

    return next();
  } catch (error) {
    throw new AppError("Invalid or expired token.", 401);
  }
}

module.exports = verifyToken;
