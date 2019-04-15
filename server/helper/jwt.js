require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtSign = obj => {
  return jwt.sign(obj, process.env.PRIVATE_KEY, { expiresIn: 36000 });
};

const verifyJWT = token => {
  return jwt.verify(token, process.env.PRIVATE_KEY);
};

module.exports = { jwtSign, verifyJWT };
