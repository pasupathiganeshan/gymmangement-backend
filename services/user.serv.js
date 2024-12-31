const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const config = require("../config");
const queryParserUtil = require("../utill/queryParser.util");
exports.authCreate = async (userData) => {
  try {
    const { firstname, lastname, email, password, access_level, shift } =
      userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      access_level,
      shift,
    });
    return await newUser.save();
  } catch (error) {
    throw new Error(error);
  }
};
exports.getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email: email });
  } catch (error) {
    throw new Error(error);
  }
};
//get all user

exports.getAllUser = async (params) => {
  try {
      let query = User.find();
      query = queryParserUtil.parseQuery(query, params);
      return await query.exec();
  } catch (error) {
      throw new Error(error);
  }
};
exports.findMembers = async (filter) => {
  return Members.find(filter);
};

// update password
 

exports.updatePassword = async (email, oldPassword, newPassword) => {
  if (!email || !oldPassword || !newPassword) {
    throw new Error("Missing required fields");
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Compare the entered old password with the hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    // Log for debugging purposes (not recommended in production)
    console.log("Old password:", oldPassword);
    console.log("Hashed password:", user.password);
    console.log("Password match status:", isMatch);

    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword; // Correctly update the password with the new hashed password
    await user.save();

    return "Password updated successfully";
  } catch (err) {
    // Log the error message for debugging
    console.error("Error updating password:", err.message);
    throw new Error("Error updating password");
  }
};

//delete user
exports.deleteUserById = async (userId) => {
  try {
    return await User.findByIdAndDelete(userId, { isActive: false }
    );
  } catch (err) {
    throw new Error(err);
  }
}