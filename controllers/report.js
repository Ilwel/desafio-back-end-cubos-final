const db = require('../utils/db');
const { changeStatusCharges, changeStatus } = require('../utils/changeStatus');

const report = async (req, res) => {

  try {
    const reportCharges = await db('charges')
      .join('clients', 'charges.client_id', 'clients.id')
      .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date');

    const charges = changeStatusCharges(reportCharges);

    const countPendingCharges = charges
      .filter(charge => charge.status === 'pendente')
      .length;
    const countExpiredCharges = charges
      .filter(charge => charge.status === 'vencido')
      .length;
    const countPaidCharges = charges
      .filter(charge => charge.status === 'pago')
      .length;
    

    const reportClients = await db('clients')
      .leftJoin('charges', 'charges.client_id', 'clients.id')
      .select('clients.id')
      .groupBy('clients.id');

    const clients = await changeStatus(reportClients);

    const clientsPending = clients
      .filter(client => client.status === 'inadimplente')
      .length;
    const clientsPaid = clients
      .filter(client => client.status === 'em dia')
      .length;

    return res.status(200)
      .json(
        {Pagas: countPaidCharges, 
        Previstas: countPendingCharges, 
        Vencidas: countExpiredCharges, 
        Em_dia: clientsPaid, 
        Inadimplentes: clientsPending}
      );

  } catch (error) {
    
    return res.status(400 || error.status).json(error.message);
  }
};

const reportCharges = async (req, res) => {
  const { previstas, vencidas, pagas } = req.query;

  try {
    const queryCharge = db('charges')
      .join('clients', 'charges.client_id', 'clients.id')
      .select('charges.id as charge_id', 'clients.name', 'charges.description', 'charges.value', 'charges.paid', 'charges.due_date');

    const queryReportCharge = await queryCharge;

    let charges = changeStatusCharges(queryReportCharge);

    if(previstas){
      charges = charges.filter(charge => charge.status === 'pendente');
    } else if (vencidas){
      charges = charges.filter(charge => charge.status === 'vencido');
    }else if (pagas){
      charges = charges.filter(charge => charge.status === 'pago');
    }

    return res.status(200).json(charges);

  } catch (error) {
    
    return res.status(400 || error.status).json(error.message);
  }
};

const reportClients = async (req, res) => {
  const { query = ''} = req.query;

  try {
    const queryClients = db('clients')
      .leftJoin('charges', 'charges.client_id', 'clients.id')
      .select('clients.name', 'clients.email', 'clients.phone', 'clients.id',
        db.raw('sum(coalesce(charges.value, 0)) as made_charges'),
        db.raw('sum(case when charges.paid then coalesce(charges.value, 0) else 0 end) as received_charges'))
      .groupBy('clients.name', 'clients.email', 'clients.phone', 'clients.id');
  
    const queryReportClients = await queryClients;

    let clients = await changeStatus(queryReportClients);

    if(query === 'inadimplentes'){
      clients = clients.filter(client => client.status === 'inadimplente');
    } else if (query === 'em dia'){
      clients = clients.filter(client => client.status === 'em dia');
    }

    return res.status(200).json(clients);

  } catch (error) {
    
    return res.status(400 || error.status).json(error.message);
  }
};

module.exports = { 
  report,
  reportCharges,
  reportClients
};