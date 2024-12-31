const Members = require("../model/members.model")
const queryParserUtil = require("../utill/queryParser.util");


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
// services/membersService.js
exports.getMembersWithPackageDetails = async () => {
    try {
      const membersWithPackageDetails = await Members.aggregate([
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
            type: "$packageDetails.type",           
            tax: "$tax",            
            grandTotal: "$grandTotal", 
            amountPay: 1,                          
            remainingBalance: {
              $subtract: [
                { $toDouble: "$grandtotal" },
                { $toDouble: "$amountpay" },
              ],
            },
          },
        },
      ]);
      console.log(membersWithPackageDetails)
      return membersWithPackageDetails;
    } catch (error) { 
      console.error("Error fetching members with package details:", error);  
      throw new Error(error.message); 
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
