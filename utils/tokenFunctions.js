const jwt = require('jsonwebtoken');

const createToken = (data, time = '8h') => jwt.sign(data, process.env.JWT_SECRET, { expiresIn: time });
const getDataFromToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createToken,
  getDataFromToken
};