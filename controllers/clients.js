const db = require('../utils/db');
const { clientSchema } = require('../utils/yupSchemas');
const { replaceCpf, replacePhone, replaceCep} = require('../utils/replaceString');
const {cpfValidation, phoneValidation, zipCodeValidation} = require('../utils/validations');
const changeStatus = require('../utils/changeStatus');


const registerClient = async (req, res) => {

  const { name, email, cpf, phone, zip_code, adress, complement, district, city, reference_point, state } = req.body;
  
  const finalCpf= replaceCpf(cpf);
  const finalPhone= replacePhone(phone);
  let finalCep= zip_code;

  try {

    req.body.cpf = finalCpf;
    req.body.phone = finalPhone;

    await clientSchema.validate(req.body);

    phoneValidation(finalPhone);
    cpfValidation(finalCpf);

    const cpfExists = await db('clients').where({ cpf: finalCpf }).first();
      if (cpfExists) {
        throw {
          status: 400,
          message: 'o cpf já existe'
        }
      }

    if(zip_code){
      finalCep = replaceCep(zip_code);
      zipCodeValidation(finalCep);      
    }

    const emailExists = await db('clients').where({ email }).first();
    if (emailExists) {
      throw {
        status: 400,
        message: 'o email já existe'
      }
    }

    const clientRegistration = await db('clients')
      .insert({ 
        name, email, cpf: finalCpf, phone: finalPhone, zip_code: finalCep, adress, complement, district, city, reference_point, state 
      });

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

const putClient = async (req, res) => {

  const { name, email, cpf, phone, zip_code, adress, complement, district, city, reference_point, state } = req.body;

  const finalCpf= replaceCpf(cpf);
  const finalPhone= replacePhone(phone);
  let finalCep= zip_code;

  try{

    req.body.cpf = finalCpf;
    req.body.phone = finalPhone;    
    await clientSchema.validate(req.body);

    if(cpf){
      cpfValidation(finalCpf);
      } else {
        if (finalCpf) {
          const cpfExists = await db('clients').where({ cpf: finalCpf }).first();
          if (cpfExists) {
            throw {
              status: 400,
              message: 'cpf já existe'
            }
          }
        }
      }

    if(phone){
      phoneValidation(finalPhone);
    }

    if(zip_code){
      finalCep = replaceCep(zip_code);
      zipCodeValidation(finalCep);
    }

    if (email) {
      const emailExists = await db('clients').where({  email }).first();
      if (emailExists) {
        throw {
          status: 400,
          message: 'email já existe'
        }
      }
    }

    const updateClient = await db('clients')
      .update({ 
        name, email, cpf: finalCpf, phone: finalPhone, zip_code: finalCep, adress, complement, district, city, reference_point, state 
      })
      .where({id});

      if (!updateClient) {
        throw {
          status: 500,
          message: 'não foi possível atualizar o cadastro'
        }
      }
  
    return res.status(200).json('cadastro atualizado');
    
  } catch (error) {

    return res.status(400 || error.status).json(error.message);

  }
};

const listClient = async (req, res) => {

  try {

    const joinClientCharge = await db('clients')
    .join('charges', 'charges.client_id', 'clients.id' )
    .select('clients.name', 'clients.email', 'clients.phone', 'charges.paid', 'charges.due_date');
    
    const charges = changeStatus(joinClientCharge);

    return res.status(200).json(charges);

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }

};

const getOneClient = async (req, res) => {
  const {id} = req.params;
  try {

    const joinClientCharge = await db('clients')
    .join('charges', 'charges.client_id', 'clients.id' )
    .select('clients.*', 'charges.id as charge_id', 'charges.description', 'charges.due_date', 'charges.value', 'charges.paid as status')
    .where({'clients.id': id});

    const charges = changeStatus(joinClientCharge);

    return res.status(200).json(charges);

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }
};

module.exports = {
  registerClient,
  putClient,
  listClient,
  getOneClient
}