const mongoose = require('mongoose');
const EDRSchema = new mongoose.Schema({
    requestNo: {
        type: String
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
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            },
            description: {
                type: String
            },
            consultationNotes: {
                type: String
            },
            doctorNotes:{
                type:String
            },
            audioNotes:[{
                type:String
            }],
            status: {
                type: String
            },
            speciality: {
                type: String
            },
            specialist: {
                type: String
            },
            requester: {
                type: mongoose.Schema.ObjectId,
                ref: 'staff'
            }
        }
    ],
    residentNotes: [
        {
            residentNoteNo:{
                type:String
            },
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
                type: String
            },
            section: {
                type: String,
            },
            audioNotes:{
                type:String
            },
            code: [
                {
                    type: String,
                }
            ]
        },
    ],
    pharmacyRequest: [
        {            
                type:mongoose.Schema.ObjectId,
                ref:'ReplenishmentRequestBU'
        }
    ],
    labRequest: [
        {
            LRrequestNo:{
                type:String
            },
            serviceId: {
                type: mongoose.Schema.ObjectId,
                ref: 'LaboratoryService'
            },
            requesterName:
            {
                type: String
            },
            serviceCode: {
                type: String
            },
            serviceName: {
                type: String
            },
            status: {
                type: String
            },
            requester: {
                type: mongoose.Schema.ObjectId,
                ref: 'staff'
            },
            results: {
                type: String
            },
            sampleId: {
                type: String
            },
            comments: {
                type: String,
            },
            serviceType: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    radiologyRequest: [
        {
            RRrequestNo:{
                type:String
            },
            serviceId: {
                type: mongoose.Schema.ObjectId,
                ref: 'RadiologyService'
            },
            serviceCode: {
                type: String
            },
            status: {
                type: String
            },
            requesterName:
            {
                type: String
            },
            serviceName: {
                type: String
            },
            requester: {
                type: mongoose.Schema.ObjectId,
                ref: 'staff'
            },
            results: {
                type: String
            },
            comments: {
                type: String,
            },
            serviceType: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    dischargeRequest: {
        dischargeSummary: {
            dischargeNotes: {
                type: String
            },
            otherNotes: {
                type: String
            }
        },
        dischargeMedication: {
            date: {
                type: Date
            },
            status: {
                type: String
            },
            requester: {
                type: mongoose.Schema.ObjectId,
                ref: 'staff'
            },
            medicine: [
                {
                    itemId: {
                        type: mongoose.Schema.ObjectId,
                        ref: 'Item'
                    },
                    priority: {
                        type: String
                    },
                    schedule: {
                        type: String
                    },
                    dosage: {
                        type: Number
                    },
                    frequency: {
                        type: Number
                    },
                    duration: {
                        type: Number
                    },
                    requestedQty: {
                        type: Number
                    },
                    medicineName:
                    {
                        type: String
                    },
                    unitPrice: {
                        type: Number
                    },
                    totalPrice: {
                        type: Number
                    }
                }
            ]
        },
        status: {
            type: String,
            default: 'pending'
        }
    },
    inPatientRequest: {},
    status: {
        type: String
    },
    triageAssessment: [{
        triageRequestNo:{
            type:String
        },
        heartRate:{
            type:String
        },
        bloodPressure:{
            type:String
        },
        respiratoryRate:{
            type:String
        },
        temperature:{
            type:String
        },
        FSBS:{
            type:String
        },
        painScale:{
            type:String
        },
        pulseOX:{
            type:String
        },
        triageLevel: {
            type: String
        },
        generalAppearance: {
            type: String
        },
        headNeck: {
            type: String
        },
        respiratory: {
            type: String
        },
        cardiac: {
            type: String
        },
        abdomen: {
            type: String
        },
        neurological: {
            type: String
        },
        requester:{
            type: mongoose.Schema.ObjectId,
            ref: 'staff'
        },
        date:{
            type: Date,
            default: Date.now
        }
    }],
    requestType: {
        type: String,
        default: 'EDR'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('EDR', EDRSchema);
