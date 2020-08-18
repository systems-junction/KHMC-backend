const mongoose = require('mongoose');
const name      = require("./humanName");
const telecom         = require("./contactPoint");
const address   = require("./address");
const patientSchema = new mongoose.Schema({
  profileNo: {
    type: String,
    unique: true,
  },

  name:[
     name.humanName 
    ],
  telecom:[
     telecom.contactPoint
     ],
  gender:{
     type: String,
     enum: [ "male", "female", "other", "unknown" ]
    },
  birthDate:{ 
    type: Date
   },
  deceasedBoolean:{
    type:Boolean
  },
  deceasedDateTime:{
    type:Date
  },
  address:[ 
    address.address 
  ],
  maritalStatus:  { 
    type: String 
  },
  multipleBirthBoolean:{
    type:Boolean
  },
  multipleBirthInteger:{
    type:Number
  },
  photo:[
    {type:String}
  ],
  generalPractitioner:[
    {type:mongoose.Schema.ObjectId}
  ],
  managingOrganization:{
    type:mongoose.Schema.ObjectId
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
