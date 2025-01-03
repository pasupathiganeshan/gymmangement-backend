const express = require('express');
const router = express.Router();
const memberCtrl = require('../controllers/members.ctrl')

router.post('/register/members', memberCtrl.regMember);
router.get('/members', memberCtrl.getAllMembersWithSeparateTables);
router.get('/:id',memberCtrl.getMemberById);
router.get("/members-with-packages", memberCtrl.getMembersWithPackageDetails);
router.put("/:id",memberCtrl.updateMemberById);
router.delete("/:id",memberCtrl.deletedMemberById);

    
module.exports = router;