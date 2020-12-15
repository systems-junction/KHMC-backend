const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  profileNo: {
    type: String,
    unique: true,
  },
  SIN: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  fullName: {
    type: String,
  },
  gender: {
    type: String,
  },
  nationality: {
    type: String,
  },
  age: {
    type: Number,
  },
  height: {
    type: String,
  },
  weight: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  dob: {
    type: Date,
  },
  drugAllergy: [{ type: String }],
  phoneNumber: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  email: {
    type: String,
    // unique: true,
    // match: [
    // /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
    // 'Please add a valid email'
    // ]
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  otherDetails: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  depositAmount: {
    type: Number,
  },
  amountReceived: {
    type: Number,
  },
  bankName: {
    type: String,
  },
  depositorName: {
    type: String,
  },
  depositSlip: {
    type: String,
  },
  insuranceNo: { type: String },
  insuranceVendor: { type: String },
  // insuranceId: {
  //   //Vendor
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'insurance',
  // },
  coverageDetails: {
    type: String,
  },
  coverageTerms: {
    type: String,
  },
  payment: {
    type: String,
  },
  registeredIn: {
    type: String,
  },
  receivedBy: {
    //Vendor
    type: mongoose.Schema.ObjectId,
    ref: 'staff',
  },
  emergencyName: {
    type: String,
  },
  emergencyContactNo: {
    type: String,
  },
  emergencyRelation: {
    type: String,
  },
  coveredFamilyMembers: {
    type: String,
  },
  otherCoverageDetails: {
    type: String,
  },
  otherCity:{
    type:String
  },
  QR:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userProfile:{
    email:{type:String},
    contact:{type:String},
    firstName:{type:String},
    lastName:{type:String},
    userName:{type:String},
    gender:{type:String},
    dob:{type:Date},
    isActive:{type:Boolean},
    maritalStatus:{type:String},
    address:{type:String},
    communicationLanguage:{type:String},
    profilePicture:{type:String},
    geneticDisease:[{type:String}]
  },
  patientMedicalProfile:{
    knownAllergies:[{type:String}],
    currentMedication:[{type:String}],
    surgeries:[{type:String}],
    chronicIllness:[{type:String}],
    bloodGroup:{type:String},
    pregnancy:{type:Boolean},
  }
});

module.exports = mongoose.model('patient', patientSchema);
