const db = require('../utils/db');
const { chargeSchema } = require('../utils/yupSchemas');
const dateFns = require('date-fns');
const { changeStatusCharges } = require('../utils/changeStatus');

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

  try {

    const joinChargeClient = await db('charges')
      .join('clients', 'charges.client_id', 'clients.id')
      .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date');

    const charges = changeStatusCharges(joinChargeClient);

    return res.status(200).json(charges);

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }

}

module.exports = {
  registerCharge,
  getCharges
}