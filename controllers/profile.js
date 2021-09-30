const db = require('../utils/db');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');
const { userPutSchemaNameEmail, userPutSchemaPassword } = require('../utils/yupSchemas');
const { createHash } = require('../utils/hashFunctions');

const getProfile = (req, res) => {

  return res.status(200).json(req.user);

}

const putProfile = async (req, res) => {

  const { name, email, password, cpf, phone } = req.body;
  const { user } = req;

  try {

    await userPutSchemaNameEmail.validate(req.body);
    if (password) {
      await userPutSchemaPassword.validate(req.body);
    }

    if (cpf && !cpfValidator.isValid(cpf)) {
      throw {
        status: 400,
        message: 'cpf inválido'
      }
    }

    if (email !== user.email) {
      const emailExists = await db('users').where({ email }).first();
      if (emailExists) {
        throw {
          status: 400,
          message: 'email já existe'
        }
      }
    }

    if (password) {
      const hash = await createHash(password);
      const userUpdate = await db('users').update({ name, email, password: hash, cpf, phone }).where({ id: user.id });
      if (!userUpdate) {
        throw {
          status: 500,
          message: 'não foi possível atualizar o cadastro'
        }
      }
    } else {
      const userUpdate = await db('users').update({ name, email, cpf, phone }).where({ id: user.id });
      if (!userUpdate) {
        throw {
          status: 500,
          message: 'não foi possível atualizar o cadastro'
        }
      }
    }
    return res.status(200).json('cadastro atualizado');

  } catch (error) {

    return res.status(400 || error.status).json(error.message);

  }

}

module.exports = {
  getProfile,
  putProfile
}