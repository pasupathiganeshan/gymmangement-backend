const mongoose = require("mongoose");
const config = require("../config");
const logger = require("../logger");
const User = require("../model/user.model");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
    try {
        await mongoose.connect(`${config.MONGO_URI}/${config.MONGO_DBNAME}`);
        logger.info("MongoDB connected with database: " + config.MONGO_DBNAME);
        await createDefaultUser();
    } catch (err) {
        logger.error("Error connecting to MongoDB:", err);
    }
};

const createDefaultUser = async () => {
    try {
        let user = await User.findOne({
            email: "gymworkout@gmail.com",
            access_level: "Admin(Full)",
        });
        if (!user) {
            const hashedPassword = await bcrypt.hash('gymworkout123', 10);
            let newUser = new User({
                firstname: "Super Admin",
                lastname: "Makvishon",
                email: "gymworkout@gmail.com",
                password: hashedPassword,
                shift: "Morning",
                access_level: "Admin(Full)",
                createdBy: "667507a9777fb78e952ccfb2",
                updatedBy: "667507a9777fb78e952ccfb2",
            });
            await newUser.save();
            logger.info("Default super admin user created.");
        }
        // else {
        //   logger.info('Super admin user already exists.');
        // }
    } catch (error) {
        logger.error("Error creating default user:", error);
    }
};

module.exports = connectDB;
