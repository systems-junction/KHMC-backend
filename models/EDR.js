const mongoose = require('mongoose');
const requestNoFormat = require('dateformat');
var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay);
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
            code: [
                {
                    type: String,
                }
            ]
        },
    ],
    pharmacyRequest: [
        {
            date: {
                type: Date,
                default: Date.now
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
                    }
                }
            ]
        }
    ],
    labRequest: [
        {
            requestNo:{
                type:String,
                default: 'LR'+ day + requestNoFormat(new Date(), 'yyHHMM'),
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
                type: Date,
                default: Date.now
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
    triageAssessment: {
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
        }
    },
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
