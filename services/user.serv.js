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
exports.updatePassword = async (email, oldPassword, newPassword) => {
  if (!email || !oldPassword || !newPassword) {
    throw new Error("Missing required fields");
  }

  
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Old password is incorrect");
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