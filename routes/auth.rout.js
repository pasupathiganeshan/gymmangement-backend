const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.ctrl');
const { authenticate, hasPermission } = require("../middlewares/auth.mdlwr"); 
router.post('/register', authCtrl.registerUser);
router.post('/login', authCtrl.loginUser)
router.get('/registers',authCtrl.getAllUser)


router.post(
  "/update-password",
  authenticate, 
  hasPermission("user", "post"),
  authCtrl.updatePassword 
);
router.delete(
    "/:id",
    authenticate,
    hasPermission("user", "update"),
    authCtrl.deleteUserById
);


module.exports = router;