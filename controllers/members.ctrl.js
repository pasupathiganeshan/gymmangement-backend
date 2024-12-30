const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const memberService = require("../services/members.serv");
const mongoose = require('mongoose');
const logAction =require('../services/logs.serv')
exports.regMember = async (req, res, next) => {
  const body = req.body;

  body.createBy = req.member_id;
  body.updatedBy = req.member_id;

  // List of required fields
  const requiredFields = [
    'membershipNo',
    'name',
    'fatherOrHusbandName',
    'dateOfBirth',
    'identityCardNo',
    'gender',
    'disease',
    'address',
    'cellNo',
    'faxNo',
    'email',
    'package',
    'packageDuration'
  ];

  // Check if any required field is missing
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Please provide all required fields. Missing: ${missingFields.join(', ')}`,
    });
  }
  try {

    let newMembers = await memberService.memberscreater(body);
    newMembers = newMembers.toJSON();
    res.status(201).json({ data: newMembers, message: "members item  successful" });
    await logAction({
      type:'members',
      operation:'add',
      remark :'member was added'
    });
  }
  catch (error) {
    console.log(error);
  }
};
//Get all Customer
exports.getAllMembers = async (req, res, next) => {
  try {
    const members = await memberService.getAllMembers(req.query);
    const filteredMembers = members.map(member => ({
      membershipNo: member.membershipNo, 
      name: member.name,
      contact: member.cellNo,           
      active: member.active,
      enddate: member.dateofissue,      
    }));
    res.status(200).json({ data: filteredMembers, message: "Success" });
  } catch (error) {
    next(error);
  }
};
exports.getMembersByActiveStatus = async (req, res) => {
  try {
    // Retrieve the 'active' query parameter
    const { active } = req.query;

    // Validate the active query parameter
    if (active === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide the 'active' query parameter (true or false).",
      });
    }

    // Convert active to boolean for query
    const isActive = active === "true" ? true : active === "false" ? false : null;

    if (isActive === null) {
      return res.status(400).json({
        success: false,
        message: "'active' query parameter must be either 'true' or 'false'.",
      });
    }

    // Fetch members based on the active status with selected fields
    const members = await memberService.findMembers({ active: isActive });

    if (members.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No members found with active = ${active}.`,
      });
    }

   
    const filteredMembers = members.map(member => ({
      name: member.name,
      address: member.address,       
      status: member.active,         
      startdate: member.dateofissue,       
      fees: member.paymenttype,              
    }));

   
    res.status(200).json({
      success: true,
      data: filteredMembers,
      message: `Members with active = ${active} fetched successfully.`,
    });
  } catch (error) {
    console.error("Error fetching members by active status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching members.",
      error: error.message,
    });
  }
};

exports.getMembersWithPackageDetails = async (req, res) => {
  try {
    const membersWithPackageDetails = await memberService.getMembersWithPackageDetails();

    if (membersWithPackageDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No members found with package details.",
      });
    }

    // Return the combined data
    res.status(200).json({
      success: true,
      data: membersWithPackageDetails,
      message: "Members with package details fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Internale server error" });
  }
};
exports.updateMemberById = async(req,res,next) =>{
  const {id} =req.params;
  const body=req.body;
  body.createdBy=req.member_id;
  body.updatedBy=req.member_id;
  try{
    const updateMember =await memberService.updateMemberById(id,body);
    if(!updateMember){
      return res.status(404).json({message:"members not found"})
    }
    res.status(200).json({data:updateMember,message:"members updated successfully"})
    await logAction({
      type:'members',
      operation:'update',
      remark :'member was update'
    });
  }catch (error){
    next(error)
  }
}
exports.deletedMemberById = async(req,res,next) =>{
  const {id} =req.params;
  try{
    const deleteMember =await memberService.deletedMemberById(id);
    if(!deleteMember){
      return res.status(404).json({message:"members not found"});
    }
    res.status(200).send({message:"members deleted successfully"})
    await logAction({
      type:'members',
      operation:'delete',
      remark :'member was deleted'
    });

  }catch (error){
    next(error)
  }
}