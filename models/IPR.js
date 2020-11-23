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
    consultationNote: [{
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
        doctorNotes: {
            type: String,
        },
        audioNotes: {
            type: String,
        },
        status: {
            type: String,
        },
        speciality: {
            type: String,
        },
        specialist: {
            type: mongoose.Schema.ObjectId,
            ref: 'staff',
        },
        requester: {
            type: mongoose.Schema.ObjectId,
            ref: 'staff',
        },
        completedTime:{
            type:Date
        }
    }, ],
    residentNotes: [{
        residentNoteNo: {
            type: String,
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
            type: String,
        },
        status: {
            type: String,
        },
        audioNotes: {
            type: String,
        },
        section: {
            type: String,
        },
        code: [{
            type: String,
        }, ],
    }, ],
    pharmacyRequest: [{
        type: mongoose.Schema.ObjectId,
        ref: 'ReplenishmentRequestBU',
        //   PRrequestNo:{
        //     type:String
        // },
        //   date: {
        //     type: Date,
        //     default: Date.now,
        //   },
        //   status: {
        //     type: String,
        //   },
        //   requester: {
        //     type: mongoose.Schema.ObjectId,
        //     ref: 'staff',
        //   },
        //   medicine: [
        //     {
        //       itemId: {
        //         type: mongoose.Schema.ObjectId,
        //         ref: 'Item',
        //       },
        //       priority: {
        //         type: String,
        //       },
        //       schedule: {
        //         type: String,
        //       },
        //       dosage: {
        //         type: Number,
        //       },
        //       frequency: {
        //         type: Number,
        //       },
        //       duration: {
        //         type: Number,
        //       },
        //       requestedQty: {
        //         type: Number,
        //       },
        //       medicineName: {
        //         type: String,
        //       },
        //     },
        //   ],
    }, ],
    labRequest: [{
        LRrequestNo: {
            type: String,
        },
        serviceId: {
            type: mongoose.Schema.ObjectId,
            ref: 'LaboratoryService',
        },
        price:{
            type:Number
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
        serviceType: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }, ],
    radiologyRequest: [{
        RRrequestNo: {
            type: String,
        },
        serviceId: {
            type: mongoose.Schema.ObjectId,
            ref: 'RadiologyService',
        },
        price:{
            type:Number
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
        serviceType: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }, ],
    nurseService: [{
        NSrequestNo: {
            type: String,
        },
        serviceId: {
            type: mongoose.Schema.ObjectId,
            ref: 'NurseService',
        },
        price:{
            type:Number
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
        comments: {
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
    }, ],
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
            },
            status: {
                type: String,
            },
            requester: {
                type: mongoose.Schema.ObjectId,
                ref: 'staff',
            },
            medicine: [{
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
                itemType: {
                    type:String
                },
                make_model:{
                    type:String
                },
                size:{
                    type:String
                },
            }, ],
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
    triageAssessment: [{
        triageRequestNo: {
            type: String
        },
        heartRate: {
            type: String
        },
        bloodPressureSys: {
            type: String
        },
        bloodPressureDia: {
            type: String
        },
        respiratoryRate: {
            type: String
        },
        temperature: {
            type: String
        },
        FSBS: {
            type: String
        },
        painScale: {
            type: String
        },
        pulseOX: {
            type: String
        },
        triageLevel: [
            {
                type: String,
            }
        ],
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
        requester: {
            type: mongoose.Schema.ObjectId,
            ref: 'staff',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }, ],
    followUp: [{
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
    }, ],
    requestType: {
        type: String,
        default: 'IPR',
    },
    functionalUnit: {
        type: mongoose.Schema.ObjectId,
        ref: 'functionalUnit',
    },
    verified:{
        type:Boolean
    },
    insurerId:{
        type:mongoose.Schema.ObjectId,
        ref:'insuranceVendors'
    },
    paymentMethod:{
        type:String
    },
    claimed:{
        type:Boolean
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