const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const userService = require("../services/user.serv");
const User = require("../model/user.model");
const logAction =require("../services/logs.serv")

exports.registerUser = async (req, res, next) => {
    const body = req.body;
    body.createdBy = req.user_id;
    body.updatedBy = req.user_id;

    if (!body.firstname || !body.lastname || !body.email || !body.password || !body.shift || !body.access_level) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;

        let newUser = await userService.authCreate(body);
        newUser = newUser.toJSON();
        delete newUser.password; // Do not send password in response
        res.status(201).json({ data: newUser, message: "Registration successful" });
        await logAction({
          type:'workout',
          operation:'add',
          remark :`user wast added ${name}`
        });
    } catch (error) {
        next(error);
    }
};

// Login user with email and password

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  console.log('Received email:', email); // Debug
  console.log('Received password:', password); // Debug

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Hardcoded email and password check
    const hardcodedEmail = "gymworkout@gmail.com";
    const hardcodedPassword = "gymworkout123";

    // Check if the email matches the hardcoded email
    if (email !== hardcodedEmail) {
      console.log('Invalid email'); // Debug
      return res.status(400).json({ message: "Invalid email" });
    }

    // Compare the provided password with the hardcoded password
    const isMatch = password === hardcodedPassword;
    console.log('Password match status:', isMatch); // Debug

    if (!isMatch) {
      console.log('Invalid password'); // Debug
      return res.status(400).json({ message: "Invalid Password" });
    }

    // If email and password match, return user info and success message
    return res.status(200).json({
      data: {
        email: hardcodedEmail,
        firstname: "Super Admin",
        lastname: "Makvishon",
        access_level: "Admin(Full)",
        shift: "Morning",
      },
      
      message: "success"
    });
  } catch (error) {
    console.error("Login error: ", error);
    next(error);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
      const users = await userService.getAllUser(req.query);

      // If you want to exclude the password manually from the response
      const sanitizedUsers = users.map(user => {
          const { password, ...userWithoutPassword } = user.toObject(); // remove password
          return userWithoutPassword;
      });

      res.status(200).json({ data: sanitizedUsers, message: "Success" });
  } catch (error) {
      next(error);
  }
};


exports.updateUserById = async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    body.createdBy = req.user._id;
    body.updatedBy = req.user._id;

    try {
        const updateUser = await userService.updateUserById(id, body);
        if (!updateUser) {
            return res.status(404).json({ message: "user not found" });
        }
        res.status(200).json({ data: updateUser, message: "user updated successfully" });
        await logAction({
          type:'workout',
          operation:'update',
          remark :`user wast update`
        });
    } catch (error) {
        console.log(error);
    }
};

exports.deleteUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedUser = await userService.deleteUserById(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).send({ message: "User deleted successfully" });
        await logAction({
          type:'workout',
          operation:'delete',
          remark :'user wast delete'
        });
    } catch (error) {
        next(error);
    }
};
