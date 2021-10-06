const db = require('../utils/db');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');
const { clientSchema } = require('../utils/yupSchemas');
const { replaceCpf, replacePhone, replaceCep} = require('../utils/replaceString');

const registerClient = async (req, res) => {

  const { name, email, cpf, phone, zip_code, adress, complement, district, city, reference_point, state } = req.body;
  
  const finalCpf= replaceCpf(cpf);
  const finalPhone= replacePhone(phone);
  let finalCep= zip_code;

  try {

    req.body.cpf = finalCpf;
    req.body.phone = finalPhone;

    await clientSchema.validate(req.body);

    if (!cpfValidator.isValid(finalCpf)) {
      throw {
        status: 400,
        message: 'cpf inválido'
      }
    }     

    if (isNaN(finalPhone) || finalPhone.length != 11 ){
      throw {
        status: 400,
        message: 'telefone inválido'
      }
    } 

    if(zip_code){
      finalCep = replaceCep(zip_code);

      if (finalCep.length != 8){
        throw {
          status: 400,
          message: 'cep inválido'
        }
      }
    }

    const emailExists = await db('clients').where({ email }).first();
    if (emailExists) {
      throw {
        status: 400,
        message: 'o email já existe'
      }
    }

    const clientRegistration = await db('clients')
      .insert({ name, email, cpf: finalCpf, phone: finalPhone, zip_code: finalCep, adress, complement, district, city, reference_point, state });

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