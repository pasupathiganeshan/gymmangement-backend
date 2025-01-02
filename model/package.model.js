const mongoose = require('mongoose');
const { number } = require('yup');
const autoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    packageItemName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    adminId: {
        type: Number,
        allowNull: false, 
    },
    userId: {
        type: Number
    },
    type: {
        type: String,
        enum: ['daily', 'monthly', 'theropyMassage', 'workoutPlan', 'juicebar'],
        required: true,
    },
    typeId: {  // Added typeId field to store the numeric ID
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },

});
userSchema.pre('save', function (next) {
    const typeMapping = {
        daily: 1,
        monthly: 2,
        theropyMassage: 3,
        workoutPlan: 4,
        juicebar: 5,
    };

    // Automatically set typeId based on the type
    if (this.type) {
        this.typeId = typeMapping[this.type];
    }
    next();
});
userSchema.plugin(autoIncrement, { inc_field: 'adminId' });

const Package = mongoose.model("Package", userSchema);

module.exports = Package;

