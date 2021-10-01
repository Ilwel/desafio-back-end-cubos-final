const express = require('express');
const router = express();
const users = require('./controllers/users');
const profile = require('./controllers/profile');
const clients = require('./controllers/clients');
const checkLogin = require('./middlewares/checkLogin');

router.post('/register', users.postRegistration);
router.post('/login', users.postLogin);

router.use(checkLogin);

router.get('/profile', profile.getProfile);
router.put('/profile', profile.putProfile);

router.post('/client', clients.registerClient);

module.exports = router;