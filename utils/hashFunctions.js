const bcrypt = require('bcrypt');

const createHash = async (password) => await bcrypt.hash(password, 10);
const verifyHash = async (password, hash) => await bcrypt.compare(password, hash);

module.exports = {
  createHash,
  verifyHash
}