/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const config = require('../config');
// const { permissions } = require('./permissions');
const User = require('../model/user.model');

// Middleware to check if the request contains a valid token
exports.authenticate = (req, res, next) => {
  // const token = req.headers['authorization'];

  // if (!token || !token.startsWith('Bearer ')) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  // jwt.verify(token.split(' ')[1], config.JWT_SECRET, async (err, decodedData) => {
  //   if (err) {
  //     return res.status(403).json({ message: "Invalid token" });
  //   }
  //   let user= await User.findById(decodedData.userId)
  // req.user = {_id:user._id,email:user.email,name:user.name,role:user.role};
  req.user = {
    "_id": "6671308689aec35ce8b3dbf4",
    "name": "Super Admin",
    "email": "veeram28@gmail.com",
    "role": "superAdmin"
  }
  next();
  // });
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Middleware to check if the user has required permission
exports.hasPermission = (handler, action) => {
  return (req, res, next) => {
    // Retrieve the user's permissions from the request object (e.g., from req.user)
    // This assumes you've already added user data to the request object via a previous middleware
    // const role=req.user.role;
    // const userPermissions =permissions[role][handler];

    // if (userPermissions && userPermissions.includes(action)) {
    next(); // User has the required permission, proceed to the next middleware or route handler
    // } else {
    //   return  res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    // }
  };
};

