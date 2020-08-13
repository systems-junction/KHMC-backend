const mongoose = require('mongoose');
const name      = require("./humanName");
const telecom         = require("./contactPoint");
const address   = require("./address");
const patientSchema = new mongoose.Schema({
  profileNo: { //notneeded
    type: String,
    unique: true,
  },
  SIN: { //notneeded
    type: String,
    unique: true,
  },
  active:{
    type:Boolean
  },
  //FHIR
  name:[ name.humanName ],
  telecom:[ telecom.contactPoint ],
  gender:{ type: String, enum: [ "male", "female", "other", "unknown" ]},
  birthDate:{ type: Date },
  deceasedBoolean:{type:Boolean},
  deceasedDateTime:{type:Date},
  address:[ address.address ],
  maritalStatus:  { type: String },
  multipleBirthBoolean:{type:Boolean},
  multipleBirthInteger:{type:Number},
  photo:[{type:String}],
  generalPractitioner:[{type:mongoose.Schema.ObjectId}],
  managingOrganization:{type:mongoose.Schema.ObjectId},
  //FHIR End
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
  insuranceNo:{type:String},
  insuranceVendor:{type:String},
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('patient', patientSchema);
