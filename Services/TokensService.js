const jwt = require("jsonwebtoken");

const secretKey = "Javascript";

exports.jwtGenerator = (payload) => {
  return jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn: "24h",
  });
};

exports.jwtDecoder = (token) => {
  return jwt.verify(token, secretKey);
};
