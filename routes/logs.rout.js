const express = require('express');
const router = express.Router();
const logsCtrl = require('../controllers/logs.ctrl');


router.get('/', logsCtrl.getAlllogs);



module.exports = router;
