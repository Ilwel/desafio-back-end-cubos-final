const express = require('express');
const router = express();
const users = require('./controllers/users');

router.post('/register', users.postRegistration);

module.exports = router;