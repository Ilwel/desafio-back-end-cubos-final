const db = require('../utils/db');
const { userSchema, loginSchema } = require('../utils/yupSchemas');
const { createHash, verifyHash } = require('../utils/hashFunctions');
const { createToken } = require('../utils/tokenFunctions');

const postRegistration = async (req, res) => {

  const { name, email, password } = req.body;

  try {

    await userSchema.validate(req.body);

    const emailExists = await db('users').where({ email }).first();
    if (emailExists) {
      throw {
        status: 400,
        message: 'o email já existe'
      }
    }

    const hash = await createHash(password);

    const userRegistration = await db('users').insert({ name, email, password: hash });

    if (userRegistration.rowCount > 0) {
      return res.status(200).json('usuário cadastrado');
    } else {
      throw {
        status: 500,
        message: 'o usuário não pode ser cadastrado'
      }
    }

  } catch (error) {

    return res.status(400 || error.status).json(error.message);

  }
};

const postLogin = async (req, res) => {

  const { email, password } = req.body;

  try {

    await loginSchema.validate(req.body);

    const user = await db('users').where({ email }).first();
    if (!user) {
      throw {
        status: 400,
        message: 'email ou senha incorretos'
      }
    }

    const isCorrectPW = await verifyHash(password, user.password);
    if (!isCorrectPW) {
      throw {
        status: 400,
        message: 'email ou senha incorretos'
      }
    }

    const { password: pw, ...data } = user;
    const token = createToken(user);

    return res.status(200).json({ user: data, token });

  } catch (error) {

    return res.status(400 || error.status).json(error.message);

  }

};

module.exports = {
  postRegistration,
  postLogin
};