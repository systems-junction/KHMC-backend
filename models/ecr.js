const mongoose = require('mongoose');

const ECRSchema = new mongoose.Schema({
  requestNo: {
    type: String,
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'patient',
  },
  consultationNote: [
    {
      consultationNo: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      description: {
        type: String,
      },
      consultationNotes: {
        type: String,
      },
      requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
    },
  ],
  pharmacyRequest: [
    {
      requestNo: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
      },
      consultationNotes: {
        type: String,
      },
      requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      medicine: [
        {
          medicineName: {
            type: String,
          },
          duration: {
            type: String,
          },
          dosage: {
            type: String,
          },
          additionalNote: {
            type: String,
          },
        },
      ],
    },
  ],
  labRequest: [
    {
      serviceId: {
        type: mongoose.Schema.ObjectId,
        ref: 'LaboratoryService',
      },
      status: {
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
    },
  ],
  radiologyRequest: [
    {
      serviceId: {
        type: mongoose.Schema.ObjectId,
        ref: 'RadiologyService',
      },
      status: {
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
    },
  ],
  inPatientRequest: {},
  status: {
    type: String,
  },
  triageAssessment: {
    triageLevel: {
      type: String,
    },
    generalAppearance: {
      type: String,
    },
    headNeck: {
      type: String,
    },
    respiratory: {
      type: String,
    },
    cardiac: {
      type: String,
    },
    abdomen: {
      type: String,
    },
    neurological: {
      type: String,
    },
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

module.exports = mongoose.model('ECR', ECRSchema);
