const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    access_level: {
        type: String,
        enum: ['Admin(Full)', 'Receptionist(moderate)'],  
        default: 'select'

    },
    shift: {
        type: String,   
        enum: ['Morning', 'evening'],
        default: 'select'
    }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
