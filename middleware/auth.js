const jwt = require("jsonwebtoken");
const HttpError = require("../models/httpError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError("Authorization header missing or malformed", 401);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new HttpError("Token not found in Authorization header", 401);
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error =
      err instanceof HttpError
        ? err
        : new HttpError("Authentication failed", 403);
    return next(error);
  }
};
