const jwt = require("jsonwebtoken");

const ensureAuth = (req, resp, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return resp
      .status(403)
      .json({ message: "Unauthorized, JWT token is required" });
  }

  // Extract the token by removing the "Bearer " prefix
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    resp.status(403).json({ message: "Unauthorized, invalid JWT token" });
  }
};

module.exports = ensureAuth;
