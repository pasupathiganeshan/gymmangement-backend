const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const packageService = require("../services/package.serv");
const Package = require("../model/package.model")
const mongoose = require('mongoose');
const logAction = require('../services/logs.serv')

exports.registerPackage = async (req, res, next) => {
  const body = req.body;

  body.createBy = req.package_id;
  body.updatedBy = req.package_id;
  if (!body.packageItemName || !body.price || !body.type) {
    return res.status(400).json({ message: "Please provide all require fields" });
  }
  try {
    let newPackage = await packageService.packagecreater(body);
    newPackage = newPackage.toJSON();
    res.status(201).json({ data: newPackage, message: "package item  successful" });

    await logAction({
      type: 'workoutpackage',
      operation: 'insert',
      remark: 'package was added'
    });
  }
  catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "An error occurred while creating the package typeId is not matching" });
  }
};
// Controller: packages.ctrl.js
exports.getAllPackages = async (req, res, next) => {
  try {
    // Call the service layer to fetch packages
    const packages = await packageService.getAllPackages();

    if (!packages || packages.length === 0) {
      return res.status(404).json({ message: "No packages found" });
    }

    // Return the list of packages
    res.status(200).json({
      message: "Packages retrieved successfully",
      data: packages,
    });
  } catch (error) {
    // Handle unexpected errors
    next(error);
  }
};

exports.updatePackageById = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const body = req.body;
  body.createdBy = req.package_id;
  body.updatedBy = req.package_id;

  try {
    const updatePackage = await packageService.updatePackageById(id, body);
    if (!updatePackage) {
      return res.status(404).json({ message: "package not found" });
    }
    res
      .status(200)
      .json({ data: updatePackage, message: "update successfully" });
    await logAction({
      type: 'workoutpackage',
      operation: 'update',
      remark: 'package was updated'
    });
  } catch (error) {
    next(error);
  }
};
exports.getOffersById = async (req, res, next) => {
  const { typeId } = req.params; // Get the typeId from the route parameter

  // Validate if the provided typeId is valid
  if (![1, 2, 3, 4, 5].includes(parseInt(typeId))) {
    return res.status(400).json({ message: 'Invalid type ID' });
  }

  try {
    const offers = await Package.find({ typeId }).select('packageItemName price');

    // If no offers are found for that typeId
    if (offers.length === 0) {
      return res.status(404).json({ message: `No offers found for typeId: ${typeId}` });
    }
    // Return the offers as JSON
    return res.status(200).json({

      data: offers,
      status: 'success',
      message: 'Offers retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    next(error);
  }
};
exports.getUserById = async (req, res, next) => {
  const { userId } = req.query; // Extract userId from query parameters
  try {
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId in query parameters' });
    }

    const users = await Package.find({ userId }).select('packageItemName price');
    if (users.length === 0) {
      return res.status(404).json({ message: `No users found with Id: ${userId}` });
    }

    return res.status(200).json({

      data: users,
      status: 'success',
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
};
exports.getById = async (req, res, next) => {
  const { userId, typeId } = req.query;

  try {
    // Validate query parameters
    if (!userId || !typeId) {
      return res.status(400).json({
        message: 'Missing userId or typeId in query parameters.'
      });
    }

    // Fetch data from the database
    const offer = await Package.find({ userId, typeId }).select('packageItemName price');

    // Check if data exists
    if (!offer || offer.length === 0) {
      return res.status(404).json({
        message: `No data found for userId and typeId`
      });
    }

    // Return success response
    return res.status(200).json({

      data: offer,
      message: "Success",
    });

  } catch (error) {
    console.error('Error fetching data:', error);

    // Return error response
    return res.status(500).json({
      message: 'An error occurred while fetching data.',
      error: error.message
    });
  }
};
exports.deletePackageById = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const deletePackage = await packageService.deletePackageById(id);
    if (!deletePackage) {
      return res.status(404).json({ message: "package not found" })
    }

    res.status(200).send({ message: "package deleted successfully" })

    await logAction({
      type: 'workoutpackage',
      operation: 'delete',
      remark: "package was deleted"
    });
  } catch (error) {
    next(error);
  }
}