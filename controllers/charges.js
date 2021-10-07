const db = require('../utils/db');
const { chargeSchema } = require('../utils/yupSchemas');

const registerCharge = async (req, res) => {
  
  const { client_id, description, paid, value, due_date } = req.body;

  let finalDate = new Date(due_date);

  try {
    
    await chargeSchema.validate(req.body);

    const chargeRegistration = await db('charges')
      .insert({client_id, description, paid, value, due_date: finalDate});

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

    const listCharge = await db('charges');
    let {paid, due_date} = listCharge[0];
    
    /*const {due_date} = listCharge[0]
    const newDate = new Date(due_date.getTime()+due_date.getTimezoneOffset()*60*1000);
    const offset = due_date.getTimezoneOffset() / 60;
    const hours = due_date.getHours();
    newDate.setHours(hours - offset);
    console.log(newDate);*/

    return res.status(200).json(listCharge);

  } catch (error) {

    return res.status(400 || error.status).json(error.message);
  }

}

module.exports = {
    registerCharge,
    getCharges
  }