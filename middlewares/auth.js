const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).send("Access denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user; // decoded token data
    next();
  });
}

module.exports = authenticateToken;
