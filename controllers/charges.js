const db = require('../utils/db');
const { chargeSchema } = require('../utils/yupSchemas');
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
  const { client_id, cpf, email, id} = req.query;

  try {

    if(client_id){
      const findClient = await db('clients').where({id: client_id}).first();

      if(!findClient){
        return res.status(404).json('cliente não encontrado');

      } else{

        const clientIdQuery = await db('charges')
        .join('clients', 'charges.client_id', 'clients.id')
        .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date')
        .where({ 'clients.id': client_id });
        const clientIdFilter = changeStatusCharges(clientIdQuery);
        return res.status(200).json(clientIdFilter);
      }
    }

    if(cpf){
      const findCpf = await db('clients').where({cpf}).first();

      if(!findCpf){
        return res.status(404).json('cpf não encontrado');

      } else{
        const clientCpfQuery = await db('charges')
        .join('clients', 'charges.client_id', 'clients.id')
        .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date')
        .where({ 'clients.cpf': cpf });
        const cpfFilter = changeStatusCharges(clientCpfQuery);
        return res.status(200).json(cpfFilter);
      }
    }

    if(email){
      const findEmail = await db('clients').where({email}).first();

      if(!findEmail){
        return res.status(404).json('email não encontrado');

      } else{
        const clientEmailQuery = await db('charges')
        .join('clients', 'charges.client_id', 'clients.id')
        .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date')
        .where({ 'clients.email': email });
        const emailFilter = changeStatusCharges(clientEmailQuery);
        return res.status(200).json(emailFilter);
      }
    }

    if(id){
      const findChargeId = await db('charges').where({id}).first();

      if(!findChargeId){
        return res.status(404).json('cobrança não encontrada');

      } else{
        const chargeIdQuery = await db('charges')
        .join('clients', 'charges.client_id', 'clients.id')
        .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date')
        .where({ 'charges.id': id });
        const chargeIdFilter = changeStatusCharges(chargeIdQuery);
        return res.status(200).json(chargeIdFilter);
      }
    }

    const joinChargeClient = await db('charges')
      .join('clients', 'charges.client_id', 'clients.id')
      .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date');

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

    const updateCharge = await db('charges')
      .update({ client_id, description, paid, value, due_date })
      .where({ id });

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