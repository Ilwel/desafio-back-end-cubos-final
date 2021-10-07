const dateFns = require('date-fns');

function changeStatus(charges){
    return charges.map(charge => {
      const isDateAfter = dateFns.isAfter(charge.due_date, new Date());
      const isDateBefore = dateFns.isBefore(charge.due_date, new Date());

      if(!charge.paid && isDateAfter){
          charge.status = 'em dia'
      } else if(!charge.paid && isDateBefore){
          charge.status = 'inadimplente'
      } else {
          charge.status = 'em dia'
      }
      delete charge.paid;
      
      return charge
  })
};

module.exports = changeStatus;