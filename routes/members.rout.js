const express = require('express');
const router = express.Router();
const memberCtrl = require('../controllers/members.ctrl')

router.post('/register/members', memberCtrl.regMember);
router.get("/", memberCtrl.getAllMembers);
router.get("/members-by-active", memberCtrl.getMembersByActiveStatus);
router.get("/members-with-packages", memberCtrl.getMembersWithPackageDetails);
router.put("/:id",memberCtrl.updateMemberById);
router.delete("/:id",memberCtrl.deletedMemberById);

    
module.exports = router;