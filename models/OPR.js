const mongoose = require('mongoose');

const OPRSchema = new mongoose.Schema({
  requestNo: {
    type: String,
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'patient',
  },
  generatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'staff',
  },

  pharmacyRequest: [
    {
      PRrequestNo:{
        type:String
    },
      date: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
      },
      requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      medicine: [
        {
          itemId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Item',
          },
          priority: {
            type: String,
          },
          schedule: {
            type: String,
          },
          dosage: {
            type: Number,
          },
          frequency: {
            type: Number,
          },
          duration: {
            type: Number,
          },
          requestedQty: {
            type: Number,
          },
          medicineName: {
            type: String,
          },
        },
      ],
    },
  ],
  labRequest: [
    {
    LRrequestNo:{
        type:String
    },
      serviceId: {
        type: mongoose.Schema.ObjectId,
        ref: 'LaboratoryService',
      },
      requesterName: {
        type: String,
      },
      serviceCode: {
        type: String,
      },
      serviceName: {
        type: String,
      },
      status: {
        type: String,
      },
      requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      results: {
        type: String,
      },
      comments: {
        type: String,
      },
      sampleId: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  radiologyRequest: [
    {
      RRrequestNo:{
        type:String
    },
      serviceId: {
        type: mongoose.Schema.ObjectId,
        ref: 'RadiologyService',
      },
      serviceCode: {
        type: String,
      },
      status: {
        type: String,
      },
      requesterName: {
        type: String,
      },
      serviceName: {
        type: String,
      },
      requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      date: {
        type: Date,
        default: Date.now,
      },
      results: {
        type: String,
      },
      comments: {},
      sampleId: {
        type: String,
      },
    },
  ],

  generatedFrom: {
    type: String,
  },

  status: {
    type: String,
  },
  requestType: {
    type: String,
    default: 'OPR',
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

module.exports = mongoose.model('OPR', OPRSchema);
