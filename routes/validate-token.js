const jwt = require("jsonwebtoken");
/* var redis = require('redis');
var JWTR =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient); */
// middleware to validate token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization') ? req.header('Authorization').split(' ').pop() : null
  if (!token) return res.status(401).json({ error: "Access denied: Token not set" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next(); // to continue the flow
  } catch (err) {
    res.status(400).json({ error: "Token is not valid. You need to sign in again"});
  }
};
module.exports = verifyToken;