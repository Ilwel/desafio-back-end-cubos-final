const express = require('express');
const router = express();
const users = require('./controllers/users');
const profile = require('./controllers/profile');
const checkLogin = require('./middlewares/checkLogin');

router.post('/register', users.postRegistration);
router.post('/login', users.postLogin);

router.get('/profile', checkLogin, profile.getProfile);
router.put('/profile', checkLogin, profile.putProfile);

module.exports = router;