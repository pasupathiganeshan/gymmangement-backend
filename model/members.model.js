const mongoose = require('mongoose');
const { string } = require('yup');

// Define Membership Schema
const MembershipSchema = new mongoose.Schema({
  membershipNo: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  fatherOrHusbandName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  identityCardNo: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  disease: {
    type: String,
    enum: ['blepresure', 'heartdesecies', 'diabetes', 'asthuma', 'hepatitas'],
    required: true,
  },
  residentOf:{
    type:String,
    required:true,
  },
  address: {
    type: String,
    required: true,
  },
  cellNo: {
    type: String,
    required: true,
  },
  faxNo: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  package: {
    type: String,
    enum: ['aerobatices/yoga', 'gynasinum', 'zumba', 'personaltrainer', 'testgym', 'cardio'],
    required: true
  },
  packageDuration: {
    type: String,
    enum: ['6 months', '1 months', '12 months'],
  },
  time: {
    type: String,
    enum: ['evening', 'morning'],

  },
  registrationFee: {
    type: String,
    required: true,
  },
  monthly: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },
  subTotal: {
    type: String,
    required: true,
  },
  tax: {
    type: String,
    required: true,
  },
  grandTotal: {
    type: String,
    required: true,
  },
  amountPay: {
    type: String,
    required: true,
  },
  remaningBalance: {
    type: String,
    required: true,
  },
  dateofIssue: {
    type: Date,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ['cash', 'creditcard', 'cheque'],

  },
  active: {
    type: Boolean,
    default: true, // Default to active
  },

}, { timestamps: true });

// Create Membership Model
const Membership = mongoose.model('Membership', MembershipSchema);

module.exports = Membership;
