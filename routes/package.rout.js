const express = require('express');
const router = express.Router();
const packagectrl = require('../controllers/package.ctrl')


router.post('/register/packageitem', packagectrl.registerPackage);


// Route to get offers by typeId (e.g., daily offers have typeId 1)
router.get('/offers/:typeId', packagectrl.getOffersById);
router.get('/users',packagectrl.getUserById);
router.get('/user',packagectrl.getById);
router.get('/',packagectrl.getAllPackages)
router.put('/:id',packagectrl.updatePackageById);
router.delete('/:id',packagectrl.deletePackageById);
module.exports = router;