const dateFns = require('date-fns');
const db = require('./db');

function changeStatusCharges(charges) {

  return charges.map(charge => {
    const isDateAfter = dateFns.isAfter(charge.due_date, new Date());
    const isDateBefore = dateFns.isBefore(charge.due_date, new Date());
    const isDateSame = dateFns.isSameDay(charge.due_date, new Date());

    if (!charge.paid && isDateSame || !charge.paid && isDateAfter) {
      charge.status = 'pendente'
    } else if (!charge.paid && isDateBefore) {
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
      const isDateBefore = dateFns.isBefore(charge.due_date, new Date());

      if (!charge.paid && isDateBefore) {
        client.status = 'inadimplente'
        break;
      }
    }
  }

  return clients;
};

function changeStatusGetClient(charges) {
  return charges.map(charge => {
    const isDateAfter = dateFns.isAfter(charge.due_date, new Date());
    const isDateBefore = dateFns.isBefore(charge.due_date, new Date());

    if (!charge.paid && isDateAfter || charge.paid) {
      charge.status = 'em dia'
    } else if (!charge.paid && isDateBefore) {
      charge.status = 'inadimplente'
    }
    delete charge.paid;

    return charge
  })
};

module.exports = {
  changeStatus,
  changeStatusGetClient,
  changeStatusCharges
};