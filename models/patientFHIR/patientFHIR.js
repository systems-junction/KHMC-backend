const mongoose = require('mongoose');
const name = require('./humanName');
const telecom = require('./contactPoint');
const address = require('./address');
const contact = require('./contact');
const photo = require('./attachment');
const patientSchema = new mongoose.Schema({
  identifier:[{type:String}],
  name: [name.humanName],
  telecom: [telecom.contactPoint],
  gender: {
    type: String,
    //  enum: [ "male", "female", "other", "unknown" ]
  },
  birthDate: {
    type: Date,
  },
  deceasedBoolean: {
    type: Boolean,
  },
  deceasedDateTime: {
    type: Date,
  },
  address: [address.address],
  maritalStatus: {
    type: String,
  },
  multipleBirthBoolean: {
    type: Boolean,
  },
  multipleBirthInteger: {
    type: Number,
  },
  photo: [photo.attachment],
  contact: [contact.contact],
  generalPractitioner: [{ type: mongoose.Schema.ObjectId }],
  managingOrganization: {
    type: mongoose.Schema.ObjectId,
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

module.exports = mongoose.model('patientfhir', patientSchema);
