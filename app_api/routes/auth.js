var express = require('express');
var router = express.Router();


var authCtrl = require('../controllers/authentication');

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;