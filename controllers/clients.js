const db = require('../utils/db');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');
const { clientSchema } = require('../utils/yupSchemas');

const registerClient = async (req, res) => {

  const { name, email, cpf, phone } = req.body;

  try {

    await clientSchema.validate(req.body);

    if (!cpfValidator.isValid(cpf)) {
      throw {
        status: 400,
        message: 'cpf inválido'
      }
    }

    /* TO DO validar phone */

    const emailExists = await db('clients').where({ email }).first();
    if (emailExists) {
      throw {
        status: 400,
        message: 'o email já existe'
      }
    }

    const clientRegistration = await db('clients').insert({ name, email, cpf, phone });

    if (clientRegistration.rowCount > 0) {
      return res.status(200).json('cliente cadastrado');
    } else {
      throw {
        status: 500,
        message: 'o cliente não pode ser cadastrado'
      }
    }

  } catch (error) {

    return res.status(400 || error.status).json(error.message);

  }
};

module.exports = {
  registerClient
}