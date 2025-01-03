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
    'packageDuration',
    'dateOfIssue'
    
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
exports.getAllMembersWithSeparateTables = async (req, res) => {
  try {
    // Retrieve query parameters for filtering
    const { active } = req.query;

    let filter = {};

    // Add filtering for 'active' status if provided
    if (active !== undefined) {
      const isActive = active === "true" ? true : active === "false" ? false : null;

      if (isActive === null) {
        return res.status(400).json({
          success: false,
          message: "'active' query parameter must be either 'true' or 'false'.",
        });
      }

      filter.active = isActive; // Add 'active' status to the filter
    }

    // Fetch members based on the filter
    const members = await memberService.getAllMembers(filter);

    if (members.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No members found with the given criteria.`,
      });
    }

    // Split members into active and inactive
    const activeMembers = members.filter(member => member.active === true);
    const inactiveMembers = members.filter(member => member.active === false);

    // Calculate total count of all members (active + inactive)
    const totalMembers = members.length; // Total count of all members regardless of status

    // Format the data for active and inactive members
    const activeMembersTable = members.map(member => ({
      name: member.name || null,
      address:member.address||null,
      contact: member.cellNo || null,
      enddate: member.dateOfIssue || null,
      feeStatus:member.amountPay ||null,
      startDate:member.registerDate || null,
      status: member.active ? "Active" : "Inactive" // Add status field to indicate if member is active or inactive
    }));

    const inactiveMembersTable = inactiveMembers.map(member => ({
      membershipNo: member.membershipNo,
      name: member.name || null,
      contact: member.cellNo || null,
      enddate: member.dateOfIssue || null,
      status: "Inactive" // Add status field to indicate if member is inactive
    }));

    // Combine active and inactive members into one list with an 'activeStatus' field
    const totalMembersTable = members.map(member => ({
      membershipNo: member.membershipNo || null,
      name: member.name || null,
      contact: member.cellNo || null,
      enddate: member.dateOfIssue || null,
      status: "Inactive"// Add status field to indicate if member is active or inactive
    }));

    // Return response with the total count of all members, and combined data for all members
    res.status(200).json({
      success: true,
      activeMembers: activeMembersTable, // Active members list
      inactiveMembers: inactiveMembersTable, // Inactive members list
      totalMembersTable: totalMembersTable,  // Combined data for all members
      message: "Members fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching members:", error);
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