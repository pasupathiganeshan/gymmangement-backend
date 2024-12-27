const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.ctrl');
const { authenticate, hasPermission } = require("../middlewares/auth.mdlwr");
const { updatePassword } = require("../services/user.serv"); 
router.post('/register', authCtrl.registerUser);
router.post('/login', authCtrl.loginUser)
router.get('/registers',authCtrl.getAllUser)

router.post("/update-password", async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      
      const response = await updatePassword(email, oldPassword, newPassword);
      res.status(200).json(response); // Send success response
    } catch (error) {
    
      console.error("Error updating password:", error);
      res.status(400).json({ message: error.message });
    }
  });
router.delete(
    "/:id",
    authenticate,
    hasPermission("customer", "update"),
    authCtrl.deleteUserById
);


module.exports = router;