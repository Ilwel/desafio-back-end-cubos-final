const express = require('express');
const router = express();
const users = require('./controllers/users');
const profile = require('./controllers/profile');
const clients = require('./controllers/clients');
const charges = require('./controllers/charges');
const reports = require('./controllers/report');
const checkLogin = require('./middlewares/checkLogin');

router.post('/register', users.postRegistration);
router.post('/login', users.postLogin);

router.use(checkLogin);

router.get('/profile', profile.getProfile);
router.put('/profile', profile.putProfile);

router.post('/client', clients.registerClient);
router.put('/client/:id', clients.putClient);
router.get('/client', clients.listClient);
router.get('/client/:id', clients.getOneClient);

router.post('/charge', charges.registerCharge);
router.get('/charge', charges.getCharges);
router.put('/charge/:id', charges.putCharge);
router.delete('/charge/:id', charges.delCharge);

router.get('/home', reports.report);
router.get('/report/charges', reports.reportCharges);
router.get('/report/clients', reports.reportClients);

module.exports = router;