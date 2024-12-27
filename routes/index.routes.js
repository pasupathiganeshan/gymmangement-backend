const express = require('express');
const router = express.Router();

router.get('/',function(req,res){
    res.send('welcome to app')
})

router.use('/auth', require('./auth.rout'));
router.use('/package',require('./package.rout'));
router.use('/member',require('./members.rout'));
router.use('/logs', require('./logs.rout'));

module.exports = router;

