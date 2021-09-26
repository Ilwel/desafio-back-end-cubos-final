const { getDataFromToken } = require('../utils/tokenFunctions');
const db = require('../utils/db');

const checkLogin = async (req, res, next) => {

  try {

    const { authorization } = req.headers;
    if (!authorization) {
      throw {
        status: 400,
        message: 'o campo authorization está faltando no header'
      }
    }

    const token = authorization.replace('Bearer', '').trim();
    const { id } = getDataFromToken(token);

    const user = await db('users').where({ id }).first();
    if (!user) {
      throw {
        status: 404,
        message: 'usuário não encontrado'
      }
    }

    const { password, ...userData } = user;
    req.user = userData;
    next();

  } catch (error) {

    return res.status(400 || error.status).json(error.message);

  }

}

module.exports = checkLogin;