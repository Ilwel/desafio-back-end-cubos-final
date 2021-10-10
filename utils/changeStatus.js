const dateFns = require('date-fns');
const db = require('./db');

function changeStatus(clients) {

  const clientStatus = clients.map(async (client) => {
    const overdueCharges = db('charges')
      .where({ paid: false, client_id: client.id })
      .where('due_date', '<', new Date())
      .count()
      .first();

    if (overdueCharges.count > 0) {
      client.status = 'inadimplente'
    } else {
      client.status = 'em dia'
    }

    return client
  })
  return Promise.all(clientStatus);
};

function changeStatusGetClient(charges) {
  return charges.map(charge => {
    const isDateAfter = dateFns.isAfter(charge.due_date, new Date());
    const isDateBefore = dateFns.isBefore(charge.due_date, new Date());

    if (!charge.paid && isDateAfter) {
      charge.status = 'em dia'
    } else if (!charge.paid && isDateBefore) {
      charge.status = 'inadimplente'
    } else {
      charge.status = 'em dia'
    }
    delete charge.paid;

    return charge
  })
};

module.exports = {
  changeStatus,
  changeStatusGetClient
};