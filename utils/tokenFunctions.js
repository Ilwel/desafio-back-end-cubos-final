const jwt = require('jsonwebtoken');

const createToken = (data, time = '8h') => jwt.sign(data, process.env.JWT_SECRET, { expiresIn: time });

module.exports = {

  createToken,

}