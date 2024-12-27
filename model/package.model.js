const mongoose = require('mongoose');
const { number } = require('yup');
const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId // Ensure that ObjectId is used by default
    },
    packageItemName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId:{
        type:Number
    },
    type: {
        type: String,
        enum: ['daily', 'monthly', 'theropyMassage', 'workoutPlan', 'juicebar'],
        required: true,
    },
    typeId: {  // Added typeId field to store the numeric ID
        type: Number,
        enum: [1, 2, 3, 4, 5],
        validate: {
            validator: function (value) {
                const typeMapping = {
                    daily: 1,
                    monthly: 2,
                    theropyMassage: 3,
                    workoutPlan: 4,
                    juicebar: 5,
                };
                return typeMapping[this.type] === value;
            },

        }

    }
});

const Package = mongoose.model("Package", userSchema);

module.exports = Package;

