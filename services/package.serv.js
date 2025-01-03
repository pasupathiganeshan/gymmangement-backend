const Package = require("../model/package.model");
exports.packagecreater = async (packageData) => {

  try {
    const newpackage = new Package(packageData);
    return await newpackage.save();
  } catch (error) {
    throw new Error(error);
  }
};
exports.updatePackageById = async (packageId, PackageData) => {
  try {
    return await Package.findByIdAndUpdate(packageId, PackageData, {
      new: true,
    });
  } catch (error) {
    throw new Error(error);
  }
};
exports.deletePackageById= async(packageId)=> {
  try{
    return await Package.findByIdAndDelete(packageId);
  }catch (err){
    throw new Error(err)
  }
};
exports.getAllPackages = async () => {
  try {
    // Fetch all packages from the database
    const packages = await Package.find();
    return packages;
  } catch (error) {
    // Log the error and rethrow it to be handled by the controller
    console.error("Error fetching packages:", error.message);
    throw new Error("Failed to fetch packages.");
  }
};

//get id 
exports.getPackageById = async (packageId) => {
  try {
    const package = await Package.findById(packageId); // Fetch package by ID (Mongoose)
    // For Sequelize: return await Package.findOne({ where: { id: packageId } });

    return package;
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    throw new Error(`Error fetching package by ID: ${error.message}`);
  }
};
