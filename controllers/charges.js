const db = require('../utils/db');
const { chargeSchema } = require('../utils/yupSchemas');
const { changeStatusCharges } = require('../utils/changeStatus');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');


const registerCharge = async (req, res) => {

  const { client_id, description, paid, value, due_date } = req.body;

  try {

    await chargeSchema.validate(req.body);

    const chargeRegistration = await db('charges')
      .insert({ client_id, description, paid, value, due_date });

    if (chargeRegistration.rowCount > 0) {
      return res.status(200).json('cobrança cadastrada');
    } else {
      throw {
        status: 500,
        message: 'a cobrança não pode ser cadastrada'
      }
    }

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }

};

const getCharges = async (req, res) => {
  const { query = '', name } = req.query;

  try {
    if (name) {
      const clientNameQuery = await db('charges')
        .join('clients', 'charges.client_id', 'clients.id')
        .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date')
        .orderBy('clients.name', 'asc');
      const clientNameFilter = changeStatusCharges(clientNameQuery);
      return res.status(200).json(clientNameFilter);
    }

    const onlyNumbers = Number(query.replace(/\D/g, '')) || null;

    const queryCharge = db('charges')
      .join('clients', 'charges.client_id', 'clients.id')
      .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date')
    if (query) {
      queryCharge
        .where('clients.cpf', '=', query)
        .orWhere('charges.id', '=', cpfValidator.isValid(query) ? null : onlyNumbers)
        .orWhere('clients.email', '=', query)
        .orWhereRaw(`LOWER(clients.name) = LOWER('${query}')`);
    }

    const joinChargeClient = await queryCharge;

    if (joinChargeClient.length === 0) {
      return res.status(404).json('não encontrado');
    }

    const charges = changeStatusCharges(joinChargeClient);

    return res.status(200).json(charges);

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }

};

const putCharge = async (req, res) => {
  const { id } = req.params;
  const { client_id, description, paid, value, due_date } = req.body;

  try {

    await chargeSchema.validate(req.body);

    if(value){
      if(value < 0 || !Number.isInteger(value)){
        throw {
          status: 400,
          message: 'o valor não é válido'
        }
      }
    }

    const updateCharge = await db('charges')
      .update({ client_id, description, paid, value, due_date })
      .where({ id });

    if(number)

    if (!updateCharge) {
      throw {
        status: 500,
        message: 'não foi possível atualizar a cobrança'
      }
    }
    return res.status(200).json('cobrança atualizada');

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }

};

const delCharge = async (req, res) => {
  const { id } = req.params;

  try {

    const selectCharge = await db('charges').where({ id }).first();

    if (!selectCharge) {

      return res.status(404).json('cobrança não encontrada');
    } else {

      const selectCharge = await db('charges').select('paid').where({ id }).first();
      const selectDueDate = await db('charges').select('due_date').where({ id }).first();

      if (selectCharge.paid === false && selectDueDate.due_date >= new Date()) {

        await db('charges').del().where({ id });

        return res.status(200).json('cobrança excluída');

      } else {

        return res.status(404).json(' a cobrança não pode ser excluída');
      }
    }

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }

};

module.exports = {
  registerCharge,
  getCharges,
  putCharge,
  delCharge
};