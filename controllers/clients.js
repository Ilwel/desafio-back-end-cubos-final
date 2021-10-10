const db = require('../utils/db');
const { clientSchema } = require('../utils/yupSchemas');
const { replaceCpf, replacePhone, replaceCep } = require('../utils/replaceString');
const { cpfValidation, phoneValidation, zipCodeValidation } = require('../utils/validations');
const { changeStatus, changeStatusGetClient } = require('../utils/changeStatus');


const registerClient = async (req, res) => {

  const { name, email, cpf, phone, zip_code, adress, complement, district, city, reference_point, state } = req.body;

  const finalCpf = replaceCpf(cpf);
  const finalPhone = replacePhone(phone);
  let finalCep = zip_code;

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

    if (zip_code) {
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
  const { id } = req.params;
  const { name, email, cpf, phone, zip_code, adress, complement, district, city, reference_point, state } = req.body;

  const finalCpf = replaceCpf(cpf);
  const finalPhone = replacePhone(phone);
  let finalCep = zip_code;

  try {

    req.body.cpf = finalCpf;
    req.body.phone = finalPhone;
    await clientSchema.validate(req.body);

    if (cpf) {
      cpfValidation(finalCpf);

      const cpfClient = await db('clients').select('cpf').where({ id }).first();

      if (finalCpf !== cpfClient.cpf) {
        const cpfExists = await db('clients').where({ 'cpf': finalCpf }).first();
        if (cpfExists) {
          throw {
            status: 400,
            message: 'cpf já existe'
          }
        }
      }
    }

    if (phone) {
      phoneValidation(finalPhone);
    }

    if (zip_code) {
      finalCep = replaceCep(zip_code);
      zipCodeValidation(finalCep);
    }

    if (email) {

      const emailClient = await db('clients').select('email').where({ id }).first();

      if (email !== emailClient.email) {
        const emailExists = await db('clients').where({ email }).first();
        if (emailExists) {
          throw {
            status: 400,
            message: 'email já existe'
          }
        }
      }
    }

    const updateClient = await db('clients')
      .update({
        name, email, cpf: finalCpf, phone: finalPhone, zip_code: finalCep, adress, complement, district, city, reference_point, state
      })
      .where({ id });

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
      .leftJoin('charges', 'charges.client_id', 'clients.id')
      .select('clients.name', 'clients.email', 'clients.phone', 'clients.id',
        db.raw('sum(coalesce(charges.value, 0)) as made_charges'),
        db.raw('sum(case when charges.paid then coalesce(charges.value, 0) else 0 end) as received_charges'))
      .groupBy('clients.name', 'clients.email', 'clients.phone', 'clients.id');

    const clients = await changeStatus(joinClientCharge);

    return res.status(200).json(clients);

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }

};

const getOneClient = async (req, res) => {
  const { id } = req.params;
  try {
    const getClient = await db('clients').where({ id }).first();

    const joinClientCharge = await db('clients')
      .join('charges', 'charges.client_id', 'clients.id')
      .select('charges.id as charge_id', 'charges.description', 'charges.due_date', 'charges.value', 'charges.paid')
      .where({ 'clients.id': id });

    const charges = changeStatusGetClient(joinClientCharge);

    return res.status(200).json({ Client: getClient, Charges: charges });

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }
};

module.exports = {
  registerClient,
  putClient,
  listClient,
  getOneClient
};