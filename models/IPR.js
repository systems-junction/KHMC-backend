const mongoose = require('mongoose');

const IPRSchema = new mongoose.Schema({
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
  residentNotes: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      description: {
        type: String,
      },
      doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      note: {
        type: String,
      },
      status: {
        type: String,
      },
    },
  ],
  pharmacyRequest: [
    {
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
      sampleId: {
        type: String,
      },
      comments: {
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
      results: {
        type: String,
      },
      comments: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  nurseService: [
    {
      serviceId: {
        type: mongoose.Schema.ObjectId,
        ref: 'NurseService',
      },
      requesterName: {
        type: String,
      },
      serviceCode: {
        type: String,
      },
      status: {
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
    },
  ],
  dischargeRequest: {
    dischargeSummary: {
      dischargeNotes: {
        type: String,
      },
      otherNotes: {
        type: String,
      },
    },
    dischargeMedication: {
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
          unitPrice: {
            type: Number,
          },
          totalPrice: {
            type: Number,
          },
        },
      ],
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
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
  followUp: [
    {
      requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      approvalNumber: {
        type: String,
      },
      approvalPerson: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      file: {
        type: String,
      },
      description: {
        type: String,
      },
      notes: {
        type: String,
      },
      status: {
        type: String,
      },
      doctorName: {
        type: String,
      },
      doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'staff',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  requestType: {
    type: String,
    default: 'IPR',
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

module.exports = mongoose.model('IPR', IPRSchema);
