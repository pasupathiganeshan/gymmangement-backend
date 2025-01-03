const Members = require("../model/members.model")
const queryParserUtil = require("../utill/queryParser.util");
const mongoose = require('mongoose');

exports.memberscreater = async (membersData) => {
    try {
        console.log(membersData)
        const newmembers = new Members(membersData);
        return await newmembers.save();

    } catch (err) {
      throw new Error(err);
    }
}
// Get All members
exports.getAllMembers = async (filter) => {
  try {
    // Fetch members from the database based on the filter provided
    const members = await Members.find(filter); // For Sequelize: Member.findAll({ where: filter })
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error; // Throw error to be caught in controller
  }
};

//get id to value
exports.getMemberById = async (id) => {
  try {
    const member = await Members.findById(id); // Replace `Members` with your model name
    return member;
  } catch (error) {
    throw new Error(`Error fetching member: ${error.message}`);
  }
};



exports.getMemberById = async (id) => {
  try {
    // Ensure the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id) && id !== "members-with-packages") {
      throw new Error("Invalid member ID format");
    }

    if (id === "members-with-packages") {
      // Handle specific case for retrieving members with package details
      return await Members.aggregate([
        {
          $lookup: {
            from: "packages",
            localField: "package",
            foreignField: "packageItemName",
            as: "pasu",
          },
        },
        {
          $unwind: {
            path: "$packageDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            name: 1,
            package: 1,
            type: "items/juice",
            tax: "$tax",
            grandTotal: "$grandTotal",
            amountPay: 1,
            remainingBalance: {
              $subtract: [
                { $toDouble: "$grandTotal" },
                { $toDouble: "$amountPay" },
              ],
            },
          },
        },
      ]);
    }

    // If ID is a valid ObjectId, fetch the member by that ID
    return await Members.findById(id);
  } catch (error) {
    throw new Error(`Error fetching member: ${error.message}`);
  }
};

exports.deletedMemberById = async (memberId)=>{
  try{
    return await Members.findByIdAndDelete(memberId);
  }catch (err){
    throw new Error(err)
  }
};
exports.updateMemberById =async(memberId,membersData)=>{
  try{
    return await Members.findByIdAndUpdate(memberId,membersData);
  }catch(err){
    throw new Error(err)
  }
}
