const dayJs = require('dayjs');
const db = require('./db');

function changeStatusCharges(charges) {

  return charges.map(charge => {
    
    const isDateAfter = dayJs().isAfter(charge.due_date, 'day');
    const isDateBefore = dayJs().isBefore(charge.due_date, 'day');
    const isDateSame = dayJs().isSame(charge.due_date, 'day');

    console.log()

    if (!charge.paid && isDateSame || !charge.paid && isDateBefore) {
      charge.status = 'pendente'
    } else if (!charge.paid && isDateAfter) {
      charge.status = 'vencido'
    } else {
      charge.status = 'pago'
    }
    delete charge.paid;
    return charge
  })
};

async function changeStatus(clients) {

  for (client of clients) {

    const charges = await db('clients')
      .join('charges', 'charges.client_id', 'clients.id')
      .select('charges.id as charge_id', 'charges.description', 'charges.due_date', 'charges.value', 'charges.paid')
      .where({ 'clients.id': client.id });

    client.status = 'em dia'
    for (charge of charges) {
      const isDateBefore = dayJs().isBefore(charge.due_date, 'day');
      const isDateSame = dayJs().isSame(charge.due_date, 'day');
      

      if(isDateSame){
        client.status = 'em dia'
      } else if (!charge.paid && !isDateBefore) {
        client.status = 'inadimplente'
        break;
      }
    }
  }

  return clients;
};

module.exports = {
  changeStatus,
  changeStatusCharges
};