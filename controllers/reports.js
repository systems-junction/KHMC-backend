const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const PurchaseOrder = require('../models/purchaseOrder')
const PurchaseRequest = require('../models/purchaseRequest')
const ReplenishmentRequest = require('../models/replenishmentRequest')
const ReplenishmentRequestBU = require('../models/replenishmentRequestBU')
const ReturnedQty = require('../models/returnedQty')
const ReceiveItemFU = require('../models/receiveItemFU')
const ReceiveItemBU = require('../models/receiveItemBU')
const WHInventory = require('../models/warehouseInventory')
const FUInventory = require('../models/fuInventory')
const ExpiredItemsWH = require('../models/expiredItemsWH')
const ExpiredItemsFU = require('../models/expiredItemsFU')
const ERRequest = require('../models/externalReturnRequest')
const EDR = require('../models/EDR')
const IPR = require('../models/IPR')
const OPR = require('../models/OPR')
const Patient = require('../models/patient')
const PatientClearance = require('../models/patientClearance')
const PAR = require('../models/par')
const RClaim = require('../models/reimbursementClaim')
var moment = require('moment');

exports.trackingPO = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).endOf('day').utc().toDate();
    const po = await PurchaseOrder.find({'committeeStatus':req.params.status,createdAt:{$gte: startDate, $lte: endDate}}).populate('vendorId').populate('approvedBy')
    res.status(200).json({ success: true, data: po });
});

exports.trackingPOCount = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).endOf('day').utc().toDate();
    const po = await PurchaseOrder.find({'committeeStatus':req.params.status,createdAt:{$gte: startDate, $lte: endDate}}).count();
    res.status(200).json({ success: true, data: po });
});

exports.stockLevelsWH = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).startOf('day').utc().toDate();
    const whi = await WHInventory.find({updatedAt:{$gte: startDate, $lte: endDate}}).populate('itemId', 'name itemCode')
    res.status(200).json({ success: true, data: whi });
});

exports.stockLevelsFU = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).startOf('day').utc().toDate();
    const fui = await FUInventory.find({fuId:req.params.id,updatedAt:{$gte: startDate, $lte: endDate}}).populate('itemId', 'name itemCode').populate('fuId','fuName')
    res.status(200).json({ success: true, data: fui });
});

exports.supplierFulfillmentPO = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).startOf('day').utc().toDate();
    var endDate = moment(req.body.endDate).startOf('day').utc().toDate();
    const po = await PurchaseOrder.find({status:"complete",updatedAt:{$gte: startDate, $lte: endDate}}).populate('vendorId')
    res.status(200).json({ success: true, data: po });
});

exports.expiredItemsWH = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).utc().toDate();
    var endDate = moment(req.body.endDate).utc().toDate();
    const exp = await ExpiredItemsWH.find({'batch.expiryDate':{$gte: startDate, $lte: endDate}}).populate('itemId')
    res.status(200).json({ success: true, data: exp });
});

exports.expiredItemsFU = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).utc().toDate();
    var endDate = moment(req.body.endDate).utc().toDate();
    const exp = await ExpiredItemsFU.find({fuId:req.params.id,'batch.expiryDate':{$gte: startDate, $lte: endDate}}).populate('itemId')
    res.status(200).json({ success: true, data: exp });
});

exports.nearlyExpiredItemsWH = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).utc().toDate();
    var endDate = moment(req.body.endDate).utc().toDate();
    const whi = await WHInventory.aggregate([
        {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
        {$unwind:'$itemId'},
        {$unwind:'$batchArray'},
        {$match:{'batchArray.expiryDate':{$gte: startDate, $lte: endDate}}},
        {$project:{_id:1, 'itemId.itemCode': 1,'itemId.tradeName': 1,'itemId.name': 1,batchArray:1}}
    ])
    res.status(200).json({ success: true, data: whi });
});
exports.nearlyExpiredItemsFU = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).utc().toDate();
    var endDate = moment(req.body.endDate).utc().toDate();
    const fui = await FUInventory.aggregate([
        {$match:{fuId:ObjectId(req.params.id)}},
        {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
        {$unwind:'$itemId'},
        {$unwind:'$batchArray'},
        {$match:{'batchArray.expiryDate':{$gte: startDate, $lte: endDate}}},
        {$project:{_id:1, 'itemId.itemCode': 1,'itemId.tradeName': 1,'itemId.name': 1,batchArray:1}}
    ])
    res.status(200).json({ success: true, data: fui });
});

exports.disposedItems = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).utc().toDate();
    var endDate = moment(req.body.endDate).utc().toDate();
    const disposed = await ReturnedQty.aggregate([
        {$match:{fuId:ObjectId(req.params.id),reason:"Damaged",createdAt:{$gte: startDate, $lte: endDate}}},
        {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
        {$unwind:'$itemId'},
        {$unwind:'$batchArray'},
        {$project:{_id:1, 'itemId.itemCode': 1,'itemId.name': 1,batchArray:1}}
    ])
    res.status(200).json({ success: true, data: disposed });
});

exports.consumptionBalance = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).utc().toDate();
    var endDate = moment(req.body.endDate).utc().toDate();
    const bal = await ReceiveItemFU.find({createdAt:{$gte: startDate, $lte: endDate}}).populate("itemId","itemCode name")
    .populate({
        path: 'replenishmentRequestId',
        select:'dateGenerated fuId',
        populate: [
          {
            path: 'fuId',
            select:'fuName',
          },
        ],
      }).select({currentQty:1,requestedQty:1,receivedQty:1,totalPrice:1})
      let balance=[]
      for (i=0;i< bal.length;i++)
      {
        let temp = JSON.parse(JSON.stringify(bal[i]));
        var obj = {
          ...temp,
          fuId: bal[i].replenishmentRequestId.fuId
        };
        balance.push(obj)
      }
    res.status(200).json({ success: true, data: balance });
});

exports.slowMovingWH = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).utc().toDate();
    var endDate = moment(req.body.endDate).utc().toDate();
    var items = []
    const receive = await ReceiveItemFU.find({createdAt:{$gte: startDate, $lte: endDate}}).populate("itemId","_id").select({itemId:1,receivedQty:1})
    for(let  i=0; i<receive.length; i++)
    {
      await items.push(receive[i].itemId._id)
    }
    const slow = await WHInventory.find({itemId:{$nin:items}}).populate("itemId","itemCode name").select({itemId:1, qty:1})
    res.status(200).json({ success: true, data: slow });
});

exports.slowMovingFU = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).utc().toDate();
    var endDate = moment(req.body.endDate).utc().toDate();
    var items = []
    const receive = await ReceiveItemBU.find({createdAt:{$gte: startDate, $lte: endDate}}).populate("itemId","_id").select({itemId:1,receivedQty:1})
    for(let  i=0; i<receive.length; i++)
    {
      await items.push(receive[i].itemId._id)
    }
    const slow = await FUInventory.find({fuId:req.params.id,itemId:{$nin:items}}).populate("itemId","itemCode name").select({itemId:1, qty:1})
    res.status(200).json({ success: true, data: slow });
});

exports.whTransfer = asyncHandler(async (req, res) => {
    var startDate = moment(req.body.startDate).utc().toDate();
    var endDate = moment(req.body.endDate).utc().toDate();
    var items = []
    const receive = await ReceiveItemFU.aggregate([
        {$match:{createdAt:{$gte: startDate, $lte: endDate}}},
        {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
        {$lookup:{from:'replenishmentrequests',localField:'replenishmentRequestId',foreignField:'_id',as:'replenishmentRequestId'}},
        {$unwind:'$replenishmentRequestId'},
        {$lookup:{from:'functionalunits',localField:'replenishmentRequestId.fuId',foreignField:'_id',as:'replenishmentRequestId.fuId'}},  
        {$unwind:'$batchArray'},
        {$unwind:'$itemId'},
        {$unwind:'$replenishmentRequestId.fuId'},
        {$match:{'replenishmentRequestId.fuId._id':ObjectId(req.params.id)}},
        {$project:{_id:1, 'itemId.itemCode': 1,'itemId.name': 1,'itemId.receiptUnit': 1,createdAt:1,batchArray:1}}
    ])
    // const receive = await ReceiveItemFU.find({createdAt:{$gte: startDate, $lte: endDate}}).populate("itemId","itemCode name receiptUnit")
    // .populate({
    //     path: 'replenishmentRequestId',
    //     select:'fuId',
    //     populate: [
    //       {
    //         path: 'fuId',
    //         select:'_id',
    //       },
    //     ],
    //   }).select({itemId:1,batchArray:1})
    // for(let  i=0; i<receive.length; i++)
    // {
    // if(receive[i].replenishmentRequestId.fuId._id == req.params.id)
    // {
    //     items.push(receive[i])
    // }
    // }
    res.status(200).json({ success: true, data: receive });
});

exports.acmDashboard = asyncHandler(async (req, res) => {
    var sixHour = moment().subtract(6, 'hours').utc().toDate();
    let purchaseRequest = {}
    let purchaseOrder = {}
    const tat = await PurchaseRequest.find({generated:"Manual",committeeStatus:"approved",status:"in_progress",createdAt:{$gte:sixHour}})
    var time = 0
    for(let i=0; i<tat.length; i++)
    {
        const mil = (tat[i].inProgressTime - tat[i].createdAt)/1000
        time= time+mil
    }
    const finalTat = (time/tat.length)/60
    const prApproved = await PurchaseRequest.find({committeeStatus:"approved"}).countDocuments();
    const prRejected = await PurchaseRequest.find({committeeStatus:"rejected"}).countDocuments();
    const prPending = await PurchaseRequest.find({committeeStatus:"pending"}).countDocuments();
    const prModified = await PurchaseRequest.find({committeeStatus:"modify"}).countDocuments();
    const prOnHold = await PurchaseRequest.find({committeeStatus:"hold"}).countDocuments();
    purchaseRequest.prApproved = prApproved
    purchaseRequest.prRejected = prRejected
    purchaseRequest.prPending = prPending
    purchaseRequest.prModified = prModified
    purchaseRequest.prOnHold = prOnHold
    purchaseRequest.finalTat = Math.floor(finalTat)
    const tatpo = await PurchaseOrder.find({generated:"Manual",committeeStatus:"approved",status:"pending_receipt",createdAt:{$gte:sixHour}})
    var timepo = 0
    for(let i=0; i<tatpo.length; i++)
    {
        const milpo = (tatpo[i].inProgressTime - tatpo[i].createdAt)/1000
        timepo= timepo+milpo
    }
    const finalTatpo = (timepo/tatpo.length)/60
    const poApproved = await PurchaseOrder.find({committeeStatus:"approved"}).countDocuments();
    const poRejected = await PurchaseOrder.find({committeeStatus:"rejected"}).countDocuments();
    const poPending = await PurchaseOrder.find({committeeStatus:"pending"}).countDocuments();
    const poModified = await PurchaseOrder.find({committeeStatus:"modify"}).countDocuments();
    const poOnHold = await PurchaseOrder.find({committeeStatus:"hold"}).countDocuments();
    purchaseOrder.poApproved = poApproved
    purchaseOrder.poRejected = poRejected
    purchaseOrder.poPending = poPending
    purchaseOrder.poModified = poModified
    purchaseOrder.poOnHold = poOnHold
    purchaseOrder.finalTat = Math.floor(finalTatpo)
    res.status(200).json({ success: true, purchaseRequest:purchaseRequest , purchaseOrder:purchaseOrder });
});

exports.purchasingOfficerDashboard = asyncHandler(async (req, res) => {
     var sixHour = moment().subtract(6, 'hours').utc().toDate();
     let externalReturn = {};
     const tat = await ERRequest.find({createdAt:{$gte:sixHour}})
     var time = 0
     for(let i=0; i<tat.length; i++)
     {
         const mil = (tat[i].inProgressTime - tat[i].createdAt)/1000
         time= time+mil
     }
     const finalTat = (time/tat.length)/60
     const pending = await ERRequest.find({status:"pending_approval"}).countDocuments()
     const approved = await ERRequest.find({status:"approved"}).countDocuments()
     const denied = await ERRequest.find({status:"reject"}).countDocuments()
     externalReturn.pending = pending
     externalReturn.tat = Math.floor(finalTat) 
     externalReturn.approved = approved
     externalReturn.denied = denied
     const purchaseOrder = await PurchaseOrder.find().countDocuments();
     const tatPo = await PurchaseOrder.find({createdAt:{$gte:sixHour}}).populate("purchaseRequestId");    
    var semifinalTatPo = 0
    var timePo = 0
    for(let i=0; i<tatPo.length; i++)
    {
       var timePr = 0
        timePo = 0
        for(let j=0; j<tatPo[i].purchaseRequestId.length; j++)
        {
           var milPr = (tatPo[i].inProgressTime - tatPo[i].purchaseRequestId[j].createdAt)/1000
           timePr= timePr+milPr             
        }
    timePo = timePr / tatPo[i].purchaseRequestId.length
    semifinalTatPo = semifinalTatPo + timePo        
    }
    const finalTatPo =  (semifinalTatPo/tatPo.length)/60
     res.status(200).json({ success: true, externalReturn:externalReturn , purchaseOrder:purchaseOrder, purchaseOrderTat:Math.floor(finalTatPo) });
});

exports.whikDashboard = asyncHandler(async (req, res) => {
    
    var sixHour = moment().subtract(6, 'hours').utc().toDate();


    let pharmaPending = 0
    let nonPharmaPending = 0
    let nonMedicalPending = 0
    let replenishmentRequest = {}

    let timeForAllReqPharma = 0
    let timeForAllReqNonPharma = 0
    let timeForAllReqNonMed = 0

    let countOfReqContainPharma = 0
    let countOfReqContainNonPharma = 0
    let countOfReqContainNonMed = 0
    
    const tat = await ReplenishmentRequest.find({createdAt:{$gte:sixHour}}).populate('items.itemId')
    
    for(let i=0; i<tat.length; i++)
    {
    
        if(tat[i].status!=='pending'){
        var timePh = 0
        var timeNph = 0
        var timeNm = 0
    
        let countForPharma = 0
        let countForNonPharma = 0
        let countForNonMed = 0
    
        let timeForSingleReqPharma = 0
        let timeForSingleReqNonPharma = 0
        let timeForSingleReqNonMed = 0
      
        tat[i].items.forEach((element,index) => {
            if(element.itemId.medClass=="Pharmaceutical")
            {
            var milPh = (tat[i].inProgressTime - tat[i].createdAt)/1000
            timePh= timePh +  (milPh/60)
            countForPharma++
            }
            else if (element.itemId.medClass=="Non Pharmaceutical")
            {
                var milNph = (tat[i].inProgressTime - tat[i].createdAt)/1000
                timeNph= timeNph+  (milNph/60)
            countForNonPharma++
            }

            else if (element.itemId.cls=="Non-Medical")
            {
            var milNm = (tat[i].inProgressTime - tat[i].createdAt)/1000
            timeNm= timeNm + (milNm/60)
            countForNonMed++
            }
        }) 

        if(countForPharma)
        {
            countOfReqContainPharma++
          timeForSingleReqPharma =  timePh / countForPharma
        }
        if(countForNonPharma)
        {
            countOfReqContainNonPharma++
          timeForSingleReqNonPharma =  timeNph / countForNonPharma
        }
        if(countForNonMed)
        {countOfReqContainNonMed++
          timeForSingleReqNonMed =  timeNm / countForNonMed 
        }

        timeForAllReqPharma = timeForAllReqPharma + timeForSingleReqPharma
        timeForAllReqNonPharma = timeForAllReqNonPharma + timeForSingleReqNonPharma
        timeForAllReqNonMed = timeForAllReqNonMed + timeForSingleReqNonMed
    }
    }

let finalTatForPharma = countOfReqContainPharma ? timeForAllReqPharma / countOfReqContainPharma : 0
let finalTatForNonPharma = countOfReqContainNonPharma ? timeForAllReqNonPharma / countOfReqContainNonPharma : 0
let finalTatForNonMed = countOfReqContainNonMed ? timeForAllReqNonMed / countOfReqContainNonMed : 0


    const pending = await ReplenishmentRequest.find({status:"pending"}).populate('items.itemId')
    for(let i=0; i<pending.length; i++)
    {
        pending[i].items.forEach(element => {
            if(element.itemId.medClass=="Pharmaceutical")
            {
                pharmaPending++
            }
            else if (element.itemId.medClass=="Non Pharmaceutical")
            {
                nonPharmaPending++
            }
            else if (element.itemId.cls=="Non-Medical")
            {
                nonMedicalPending++
            }
        }) 
    }
    replenishmentRequest.pharma = pharmaPending
    replenishmentRequest.nonPharma =nonPharmaPending
    replenishmentRequest.nonMedical = nonMedicalPending
    replenishmentRequest.finalTatForPharma= Math.floor(finalTatForPharma)
    replenishmentRequest.finalTatForNonPharma =  Math.floor(finalTatForNonPharma)
    replenishmentRequest.finalTatForNonMed=   Math.floor(finalTatForNonMed)  
    

    const tatForPr = await PurchaseRequest.find({generated:"Manual",committeeStatus:"approved",createdAt:{$gte:sixHour}})
    var time = 0
    var timeForJitPr= 0
    for(let i=0; i<tatForPr.length; i++)
    {
        const mil = (tatForPr[i].inProgressTime - tatForPr[i].createdAt)/1000
        if(tatForPr[i].status!=="pending"){
        time= time + mil
        if( tatForPr[i].reason==='jit'){
            timeForJitPr= timeForJitPr + mil
            }
    }
    }
    const finalTatForPr = (time/tatForPr.length)/60
    const finalTatForJitPr = (timeForJitPr/tatForPr.length)/60


    const tatpo = await PurchaseOrder.find({generated:"Manual",committeeStatus:"approved",status:"pending_receipt",createdAt:{$gte:sixHour}})
    var timepo = 0
    for(let i=0; i<tatpo.length; i++)
    {
        const milpo = (tatpo[i].inProgressTime - tatpo[i].createdAt)/1000
        timepo= timepo+milpo
    }
    const finalTatpo = (timepo/tatpo.length)/60
    const prVerificationPending = await PurchaseRequest.find({generated:"Manual",committeeStatus:"pending"}).countDocuments();
    const jitPrVerificationPending = await PurchaseRequest.find({generated:"Manual",committeeStatus:"pending",reason:"JIT"}).countDocuments();
    const poCompletionPending = await PurchaseOrder.find({status:{$ne:"complete"}}).countDocuments()
    res.status(200).json({success:true, replenishmentRequestPending:replenishmentRequest, poCompletionPending:poCompletionPending, prVerificationPending:prVerificationPending, jitPrVerificationPending:jitPrVerificationPending,
        finalTatForPr: Math.floor(finalTatForPr),
        finalTatForJitPr: Math.floor(finalTatForJitPr),
        finalTatpo: Math.floor(finalTatpo)
    })
});

exports.fuikDashboard = asyncHandler(async (req, res) => {
    var sixHour = moment().subtract(6, 'hours').utc().toDate();

    let rrPharmaPending = 0
    let rrNonPharmaPending = 0
    let rrNonMedicalPending = 0
    let replenishmentRequest = {}
    let rrbPharmaPending = 0
    let rrbNonPharmaPending = 0
    let rrbNonMedicalPending = 0
    let replenishmentRequestBU = {}

    let timeForAllReqPharma = 0
    let timeForAllReqNonPharma = 0
    let timeForAllReqNonMed = 0
    let countOfReqContainPharma = 0
    let countOfReqContainNonPharma = 0
    let countOfReqContainNonMed = 0
    
    const tat = await ReplenishmentRequest.find({fuId:req.params.id,createdAt:{$gte:sixHour}}).populate('items.itemId')
    for(let i=0; i<tat.length; i++)
    {
        if(tat[i].status!=='pending'){
        var timePh = 0
        var timeNph = 0
        var timeNm = 0    
        let countForPharma = 0
        let countForNonPharma = 0
        let countForNonMed = 0
        let timeForSingleReqPharma = 0
        let timeForSingleReqNonPharma = 0
        let timeForSingleReqNonMed = 0
        tat[i].items.forEach((element,index) => {
            if(element.itemId.medClass=="Pharmaceutical")
            {
            var milPh = (tat[i].inProgressTime - tat[i].createdAt)/1000
            timePh= timePh +  (milPh/60)
            countForPharma++
            }
            else if (element.itemId.medClass=="Non Pharmaceutical")
            {
            var milNph = (tat[i].inProgressTime - tat[i].createdAt)/1000
            timeNph= timeNph+  (milNph/60)
            countForNonPharma++
            }
            else if (element.itemId.cls=="Non-Medical")
            {
            var milNm = (tat[i].inProgressTime - tat[i].createdAt)/1000
            timeNm= timeNm + (milNm/60)
            countForNonMed++
            }
        }) 
        if(countForPharma)
        {
        countOfReqContainPharma++
        timeForSingleReqPharma =  timePh / countForPharma
        }
        if(countForNonPharma)
        {
        countOfReqContainNonPharma++
        timeForSingleReqNonPharma =  timeNph / countForNonPharma
        }
        if(countForNonMed)
        {countOfReqContainNonMed++
        timeForSingleReqNonMed =  timeNm / countForNonMed 
        }
        timeForAllReqPharma = timeForAllReqPharma + timeForSingleReqPharma
        timeForAllReqNonPharma = timeForAllReqNonPharma + timeForSingleReqNonPharma
        timeForAllReqNonMed = timeForAllReqNonMed + timeForSingleReqNonMed
    }
    }

let finalTatForPharma = countOfReqContainPharma ? timeForAllReqPharma / countOfReqContainPharma : 0
let finalTatForNonPharma = countOfReqContainNonPharma ? timeForAllReqNonPharma / countOfReqContainNonPharma : 0
let finalTatForNonMed = countOfReqContainNonMed ? timeForAllReqNonMed / countOfReqContainNonMed : 0

    const rrPending = await ReplenishmentRequest.find({fuId:req.params.id,status:"pending"}).populate('items.itemId')
    for(let i=0; i<rrPending.length; i++)
    {
        rrPending[i].items.forEach(element => {
            if(element.itemId.medClass=="Pharmaceutical")
            {
                rrPharmaPending++
            }
            else if (element.itemId.medClass=="Non Pharmaceutical")
            {
                rrNonPharmaPending++
            }
            else if (element.itemId.cls=="Non-Medical")
            {
                rrNonMedicalPending++
            }
        }) 
    }
    replenishmentRequest.pharma = rrPharmaPending
    replenishmentRequest.nonPharma =rrNonPharmaPending
    replenishmentRequest.nonMedical = rrNonMedicalPending
    replenishmentRequest.finalTatForPharma= Math.floor(finalTatForPharma)
    replenishmentRequest.finalTatForNonPharma =  Math.floor(finalTatForNonPharma)
    replenishmentRequest.finalTatForNonMed=   Math.floor(finalTatForNonMed)  

    let BUtimeForAllReqPharma = 0
    let BUtimeForAllReqNonPharma = 0
    let BUtimeForAllReqNonMed = 0
    let BUcountOfReqContainPharma = 0
    let BUcountOfReqContainNonPharma = 0
    let BUcountOfReqContainNonMed = 0
    const BUtat = await ReplenishmentRequestBU.find({fuId:req.params.id,createdAt:{$gte:sixHour}}).populate('item.itemId')
    for(let i=0; i<BUtat.length; i++)
    {
        if(BUtat[i].status!=='pending'){
        var BUtimePh = 0
        var BUtimeNph = 0
        var BUtimeNm = 0    
        let BUcountForPharma = 0
        let BUcountForNonPharma = 0
        let BUcountForNonMed = 0
        let BUtimeForSingleReqPharma = 0
        let BUtimeForSingleReqNonPharma = 0
        let BUtimeForSingleReqNonMed = 0
        BUtat[i].item.forEach((element,index) => {
            if(element.itemId.medClass=="Pharmaceutical")
            {
            var BUmilPh = (BUtat[i].deliveredTime - BUtat[i].createdAt)/1000
            BUtimePh= BUtimePh +  (BUmilPh/60)
            BUcountForPharma++
            }
            else if (element.itemId.medClass=="Non Pharmaceutical")
            {
            var BUmilNph = (BUtat[i].deliveredTime - BUtat[i].createdAt)/1000
            BUtimeNph= BUtimeNph+  (BUmilNph/60)
            BUcountForNonPharma++
            }
            else if (element.itemId.cls=="Non-Medical")
            {
            var BUmilNm = (BUtat[i].deliveredTime - BUtat[i].createdAt)/1000
            BUtimeNm= BUtimeNm + (BUmilNm/60)
            BUcountForNonMed++
            }
        }) 
        if(BUcountForPharma)
        {
        BUcountOfReqContainPharma++
        BUtimeForSingleReqPharma =  BUtimePh / BUcountForPharma
        }
        if(BUcountForNonPharma)
        {
        BUcountOfReqContainNonPharma++
        BUtimeForSingleReqNonPharma =  BUtimeNph / BUcountForNonPharma
        }
        if(BUcountForNonMed)
        {BUcountOfReqContainNonMed++
        BUtimeForSingleReqNonMed =  BUtimeNm / BUcountForNonMed 
        }
        BUtimeForAllReqPharma = BUtimeForAllReqPharma + BUtimeForSingleReqPharma
        BUtimeForAllReqNonPharma = BUtimeForAllReqNonPharma + BUtimeForSingleReqNonPharma
        BUtimeForAllReqNonMed = BUtimeForAllReqNonMed + BUtimeForSingleReqNonMed
    }
    }

    let BUfinalTatForPharma = BUcountOfReqContainPharma ? BUtimeForAllReqPharma / BUcountOfReqContainPharma : 0
    let BUfinalTatForNonPharma = BUcountOfReqContainNonPharma ? BUtimeForAllReqNonPharma / BUcountOfReqContainNonPharma : 0
    let BUfinalTatForNonMed = BUcountOfReqContainNonMed ? BUtimeForAllReqNonMed / BUcountOfReqContainNonMed : 0


    const rrbPending = await ReplenishmentRequestBU.find({fuId:req.params.id,status:"pending"}).populate('item.itemId')
    for(let i=0; i<rrbPending.length; i++)
    {
        rrbPending[i].item.forEach(element => {
            if(element.itemId.medClass=="Pharmaceutical")
            {
                rrbPharmaPending++
            }
            else if (element.itemId.medClass=="Non Pharmaceutical")
            {
                rrbNonPharmaPending++
            }
            else if (element.itemId.cls=="Non-Medical")
            {
                rrbNonMedicalPending++
            }
        }) 
    }
    replenishmentRequestBU.pharma = rrbPharmaPending
    replenishmentRequestBU.nonPharma =rrbNonPharmaPending
    replenishmentRequestBU.nonMedical = rrbNonMedicalPending
    replenishmentRequestBU.finalTatForPharma= Math.floor(BUfinalTatForPharma)
    replenishmentRequestBU.finalTatForNonPharma =  Math.floor(BUfinalTatForNonPharma)
    replenishmentRequestBU.finalTatForNonMed=   Math.floor(BUfinalTatForNonMed)  

    const jitTat = await ReplenishmentRequest.find({fuId:req.params.id,reason:"JIT",createdAt:{$gte:sixHour}})
    var timeForJit= 0
    for(let i=0; i<jitTat.length; i++)
    {
        const milJit = (jitTat[i].inProgressTime - jiTtat[i].createdAt)/1000
        if(jitTat[i].status!=="pending"){
        timeForJit= timeForJit + milJit
    }
    }
    const finalTatForJit = (timeForJit/jitTat.length)/60

    const jitRrVerificationPending = await ReplenishmentRequest.find({fuId:req.params.id,generated:"Manual",committeeStatus:"pending",reason:"JIT"}).countDocuments();
   
    res.status(200).json({success:true, fulfillmentPending:replenishmentRequest , orderPending:replenishmentRequestBU, jitRrVerificationPending:jitRrVerificationPending , tatForJit:finalTatForJit})
});

exports.cashierDashboard = asyncHandler(async (req, res) => {
    var sixHour = moment().subtract(6, 'hours').utc().toDate();
    let payment = 0
    let timeEdr = 0
    let timeIpr = 0
    let finalTimeEdr = 0;
    let finalTimeIpr = 0;
    let final = 0;    
    const edr = await EDR.find({status:"pending",'dischargeRequest.status':"pending"}).countDocuments()
    const ipr = await IPR.find({status:"pending",'dischargeRequest.status':"pending"}).countDocuments()
    const dischargePending = edr + ipr;
    const edrTat = await EDR.find({'dischargeRequest.inProcessDate':{$gte: sixHour},'dischargeRequest.status':{$ne:"pending"}})
    if(edrTat.length>0)
    {
    for(let i=0; i<edrTat.length;i++)
    {
        const timeEd = (edrTat[i].dischargeRequest.completionDate - edrTat[i].dischargeRequest.inProcessDate)/1000        
        timeEdr= timeEdr +  (timeEd/60)
    }
    finalTimeEdr = timeEdr/edrTat.length
    }
    const iprTat = await IPR.find({'dischargeRequest.inProcessDate':{$gte: sixHour},'dischargeRequest.status':{$ne:"pending"}})
    if(iprTat.length>0)
    {
    for(let i=0; i<iprTat.length;i++)
    {
        const timeIp = (iprTat[i].dischargeRequest.completionDate - iprTat[i].dischargeRequest.inProcessDate)/1000        
        timeIpr= timeIpr +  (timeIp/60)
    }
     finalTimeIpr = timeIpr/iprTat.length
}
    if(edrTat.length>0 && iprTat.length>0)
    {
        final = Math.floor(((finalTimeEdr+finalTimeIpr)/2))
    }
    else
    {
        final = Math.floor(finalTimeEdr+finalTimeIpr)
    }
    const pc = await PatientClearance.find({createdAt:{$gte: sixHour}})
    for(let i=0; i<pc.length; i++)
    {
        payment = payment + pc[i].total
    }
    res.status(200).json({success:true, dischargePending:dischargePending, payment:payment, tat:final })
});

exports.icmDashboard = asyncHandler(async (req, res) => {
    let icmTat = 0;
    let final = 0;
    var sixHour = moment().subtract(6, 'hours').utc().toDate();
    const tat = await RClaim.find({createdAt:{$gte: sixHour},status:{$ne:"pending"}})
    for(let i=0; i<tat.length; i++)
    {
    const timeIcm = (tat[i].inProcessTime - tat[i].createdAt)/1000        
    icmTat= icmTat +  (timeIcm/60)
    }
    final = Math.floor(icmTat/tat.length)
    const insuranceBillsPending = await RClaim.find({status:"Analysis In Progress"}).countDocuments()
    const denied = await PAR.find({status:"Partial Approved"}).countDocuments()
    const rejected = await PAR.find({status:"Rejected"}).countDocuments()
    const approved = await PAR.find({status:"Approved"}).countDocuments()
    let par = {}
    par.denied = denied;
    par.rejected = rejected;
    par.approved = approved;
    res.status(200).json({success:true, insuranceBillsPending:insuranceBillsPending, par:par, tat:final })
});

exports.rtDashboard = asyncHandler(async (req, res) => {
    var sixHour = moment().subtract(6, 'hours').utc().toDate();
    let countActive = 0;
    let countPending = 0;
    var edrPending = 0;
    var iprPending = 0;
    var semiEdrPendingAdd = 0;
    var semiEdrPending = 0;
    var semiIprPending = 0;
    var semiIprPendingAdd = 0;
    let countForEdrPending = 0
    let countForIprPending = 0
    let finalPending = 0
    var edrActive = 0;
    var iprActive = 0;
    var semiEdrActiveAdd = 0;
    var semiEdrActive = 0;
    var semiIprActive = 0;
    var semiIprActiveAdd = 0;
    let countForEdrActive = 0
    let countForIprActive = 0
    let finalActive = 0
    const edrTat = await EDR.find({'radiologyRequest.date':{$gte: sixHour}}).select({radiologyRequest:1})
    if(edrTat.length>0)
    {
    for(let i=0; i<edrTat.length; i++)
    {
       edrTat[i].radiologyRequest.forEach(element=>{
        if(element.status!=="pending")
        {
            countForEdrPending++
            const PendingEdr = (element.activeDate - element.date)/1000 
            edrPending= edrPending +  (PendingEdr/60)
        }
        if(element.status=="completed")
        {
            countForEdrActive++
            const ActiveEdr = (element.completedDate - element.activeDate)/1000 
            edrActive= edrActive +  (ActiveEdr/60)
        }
    })
     semiEdrPendingAdd = semiEdrPendingAdd + (edrPending/countForEdrPending)
     semiEdrActiveAdd = semiEdrActiveAdd + (edrActive/countForEdrActive)
    }
    semiEdrPending = (semiEdrPendingAdd)/edrTat.length
    semiEdrActive = (semiEdrActiveAdd)/edrTat.length
    }
    const iprTat = await IPR.find({'radiologyRequest.date':{$gte: sixHour}})
    if(iprTat.length>0)
    {
    for(let i=0; i<iprTat.length; i++)
    {
       iprTat[i].radiologyRequest.forEach(element=>{
        if(element.status!=="pending")
        {
            countForIprPending++
            const PendingIpr = (element.activeDate - element.date)/1000 
            iprPending= iprPending +  (PendingIpr/60)
        }
        if(element.status=="completed")
        {
            countForIprActive++
            const ActiveIpr = (element.completedDate - element.activeDate)/1000 
            IprActive= IprActive +  (ActiveIpr/60)
        }
    })
     semiIprPendingAdd = semiIprPendingAdd + (iprPending/countForIprPending)
     semiIprActiveAdd = semiIprActiveAdd + (iprActive/countForIprActive)
    }
     semiIprPending = (semiIprPendingAdd)/iprTat.length
     semiIprActive = (semiIprActiveAdd)/iprTat.length
    }
     if(edrTat.length>0 && iprTat.length>0)
    {
        finalPending = Math.floor(((semiEdrPending+semiIprPending)/2))
        finalActive = Math.floor(((semiEdrActive+semiIprActive)/2))
    }
    else
    {
        finalPending = Math.floor(semiEdrPending+semiIprPending)
        finalActive = Math.floor(((semiEdrActive+semiIprActive)))
    }
    const edr = await EDR.find({status:"pending",radiologyRequest:{$ne:[]}})
    for(let i=0; i<edr.length; i++)
    {
        edr[i].radiologyRequest.forEach(element=>{
            if(element.status=="pending")
            {
                countPending++
            }
            else if(element.status=="active")
            {
                countActive++
            }
        })
    }
    const ipr= await IPR.find({status:"pending",radiologyRequest:{$ne:[]}})
    for(let i=0; i<ipr.length; i++)
    {
        ipr[i].radiologyRequest.forEach(element=>{
            if(element.status=="pending")
            {
                countPending++
            }
            else if(element.status=="active")
            {
                countActive++
            }
        })
    }
    const opr= await OPR.find({status:"pending",radiologyRequest:{$ne:[]}})
    for(let i=0; i<opr.length; i++)
    {
        opr[i].radiologyRequest.forEach(element=>{
            if(element.status=="pending")
            {
                countPending++
            }
            else if(element.status=="active")
            {
                countActive++
            }
        })
    }
    res.status(200).json({success:true, resultPending:countActive, imagePending:countPending, tatPending:finalPending, tatActive:finalActive })
});

exports.ltDashboard = asyncHandler(async (req, res) => {
    var sixHour = moment().subtract(6, 'hours').utc().toDate();
    let countActive = 0;
    let countPending = 0;
    var edrPending = 0;
    var iprPending = 0;
    var semiEdrPendingAdd = 0;
    var semiEdrPending = 0;
    var semiIprPending = 0;
    var semiIprPendingAdd = 0;
    let countForEdrPending = 0
    let countForIprPending = 0
    let finalPending = 0
    var edrActive = 0;
    var iprActive = 0;
    var semiEdrActiveAdd = 0;
    var semiEdrActive = 0;
    var semiIprActive = 0;
    var semiIprActiveAdd = 0;
    let countForEdrActive = 0
    let countForIprActive = 0
    let finalActive = 0
    const edrTat = await EDR.find({'labRequest.date':{$gte: sixHour}}).select({labRequest:1})
    if(edrTat.length>0)
    {
    for(let i=0; i<edrTat.length; i++)
    {
       edrTat[i].labRequest.forEach(element=>{
        if(element.status!=="pending")
        {
            countForEdrPending++
            const PendingEdr = (element.activeDate - element.date)/1000 
            edrPending= edrPending +  (PendingEdr/60)
        }
        if(element.status=="completed")
        {
            countForEdrActive++
            const ActiveEdr = (element.completedDate - element.activeDate)/1000 
            edrActive= edrActive +  (ActiveEdr/60)
        }
    })
     semiEdrPendingAdd = semiEdrPendingAdd + (edrPending/countForEdrPending)
     semiEdrActiveAdd = semiEdrActiveAdd + (edrActive/countForEdrActive)
    }
    semiEdrPending = (semiEdrPendingAdd)/edrTat.length
    semiEdrActive = (semiEdrActiveAdd)/edrTat.length
    }
    const iprTat = await IPR.find({'labRequest.date':{$gte: sixHour}})
    if(iprTat.length>0)
    {
    for(let i=0; i<iprTat.length; i++)
    {
       iprTat[i].labRequest.forEach(element=>{
        if(element.status!=="pending")
        {
            countForIprPending++
            const PendingIpr = (element.activeDate - element.date)/1000 
            iprPending= iprPending +  (PendingIpr/60)
        }
        if(element.status=="completed")
        {
            countForIprActive++
            const ActiveIpr = (element.completedDate - element.activeDate)/1000 
            IprActive= IprActive +  (ActiveIpr/60)
        }
    })
     semiIprPendingAdd = semiIprPendingAdd + (iprPending/countForIprPending)
     semiIprActiveAdd = semiIprActiveAdd + (iprActive/countForIprActive)
    }
     semiIprPending = (semiIprPendingAdd)/iprTat.length
     semiIprActive = (semiIprActiveAdd)/iprTat.length
    }
     if(edrTat.length>0 && iprTat.length>0)
    {
        finalPending = Math.floor(((semiEdrPending+semiIprPending)/2))
        finalActive = Math.floor(((semiEdrActive+semiIprActive)/2))
    }
    else
    {
        finalPending = Math.floor(semiEdrPending+semiIprPending)
        finalActive = Math.floor(((semiEdrActive+semiIprActive)))
    }

    const edr = await EDR.find({status:"pending",labRequest:{$ne:[]}})
    for(let i=0; i<edr.length; i++)
    {
        edr[i].labRequest.forEach(element=>{
            if(element.status=="pending")
            {
                countPending++
            }
            else if(element.status=="active")
            {
                countActive++
            }
        })
    }
    const ipr= await IPR.find({status:"pending",labRequest:{$ne:[]}})
    for(let i=0; i<ipr.length; i++)
    {
        ipr[i].labRequest.forEach(element=>{
            if(element.status=="pending")
            {
                countPending++
            }
            else if(element.status=="active")
            {
                countActive++
            }
        })
    }
    const opr= await OPR.find({status:"pending",labRequest:{$ne:[]}})
    for(let i=0; i<opr.length; i++)
    {
        opr[i].labRequest.forEach(element=>{
            if(element.status=="pending")
            {
                countPending++
            }
            else if(element.status=="active")
            {
                countActive++
            }
        })
    }
    res.status(200).json({success:true, resultPending:countActive, imagePending:countPending ,tatPending:finalPending, tatActive:finalActive  })
});

exports.pharmacistDashboard = asyncHandler(async (req, res) => {
    var request = 0;
    var request2 =0;
    var finalReq =0;
    var finalReq2 =0;
    var sixHour = moment().subtract(6, 'hours').utc().toDate();
    const tatRRBU = await ReplenishmentRequestBU.find({status:"Completed",createdAt:{$gte:sixHour}})
    if(tatRRBU.length>0)
    {
        for(let i=0; i<tatRRBU.length; i++)
        {
             const tatReq = (tatRRBU[i].deliveredTime - tatRRBU[i].createdAt)/1000 
            request= request +  (tatReq/60)           
        }
        finalReq = request/tatRRBU.length;
    }

    const orderPending = await ReplenishmentRequestBU.find({status:"pending",fuId:"5f6073fbce542e161a57017a",createdAt:{$gte:sixHour}}).countDocuments()
    const edrCount = await EDR.find({status:"pending",'dischargeRequest.status':"pending",createdAt:{$gte:sixHour}}).countDocuments()
    const iprCount = await IPR.find({status:"pending",'dischargeRequest.status':"pending",createdAt:{$gte:sixHour}}).countDocuments()
    dischargeCount = edrCount + iprCount;
    final = dischargeCount + orderPending
    const rrtwh = await ReplenishmentRequest.find({status:"pending" ,fuId:"5f6073fbce542e161a57017a"}).countDocuments()
    const tatRR = await ReplenishmentRequest.find({status:"completed",fuId:"5f6073fbce542e161a57017a",createdAt:{$gte:sixHour}})
    if(tatRR.length>0)
    {
    for(let i=0; i<tatRR.length; i++)
    {
         const tatReq2 = (tatRR[i].completedTime - tatRR[i].createdAt)/1000 
        request2= request2 +  (tatReq2/60)           
    }
    finalReq2 = request2/tatRR.length;
    }
    res.status(200).json({success:true, orderPending:final, rrtwh:rrtwh, tat1:Math.floor(finalReq), tat2:Math.floor(finalReq2) })
});

exports.consultantDashboard = asyncHandler(async (req, res) => {
    let count = 0; 
    var timeEdr = 0;
    var timeIpr = 0;
    var edrTime = 0;
    var iprTime = 0;
    var finalTime = 0; 
    var sixHour = moment().subtract(6, 'hours').utc().toDate();
    const edr = await EDR.find({'consultationNote.specialist':req.params.id,'consultationNote.status':"Complete",'consultationNote.completedTime':{$gte:sixHour}})
    for( let i = 0; i<edr.length; i++)
    {
        edr[i].consultationNote.forEach((element,index)=>{
            if(element.status=="Complete")
            {
            const milEdr = (element.completedTime - element.date)/1000
            timeEdr= ((timeEdr+milEdr)/(index+1))/60
            count++
            }
        })
     }
     if(edr.length>0)
     {
        edrTime = timeEdr/edr.length
     }
    const ipr = await IPR.find({'consultationNote.specialist':req.params.id,'consultationNote.status':"Complete",'consultationNote.completedTime':{$gte:sixHour}})
    for( let i = 0; i<ipr.length; i++)
    {
        ipr[i].consultationNote.forEach((element,index)=>{
            if(element.status=="Complete")
            {
                const milIpr = (element.completedTime - element.date)/1000
                timeIpr= (timeIpr+milIpr)/(index+1)
                count++
            }
        })
    }
    if(ipr.length>0 )
    {
        iprTime = timeIpr/ipr.length
    }
    if(edr.length>0 && ipr.length>0)
    {
     finalTime = (Math.floor(edrTime)+Math.floor(iprTime))/2        
    }
     
    res.status(200).json({success:true, completed:count, tat:finalTime})
});

exports.doctorDashboard = asyncHandler(async (req, res) => {
    let countPendingConsultation = 0; 
    let countPendingLab = 0; 
    let countPendingPharmacy = 0;
    let countPendingDiagnosis = 0;
    let countPatient = 0;
    let countRad = 0;
    var sixHour = moment().subtract(6, 'hours').utc().toDate();
    const edr = await EDR.find({'consultationNote.requester':req.params.id,'consultationNote.status':"pending",'consultationNote.date':{$gte:sixHour}})
    for( let i = 0; i<edr.length; i++)
    {
        edr[i].consultationNote.forEach(element=>{
            if(element.status=="pending")
            {
                countPendingConsultation++
            }
        })
    }
    const ipr = await IPR.find({'consultationNote.requester':req.params.id,'consultationNote.status':"pending",'consultationNote.date':{$gte:sixHour}})
    for( let i = 0; i<ipr.length; i++)
    {
        ipr[i].consultationNote.forEach(element=>{
            if(element.status=="pending")
            {
                countPendingConsultation++
            }
        })
    }
    const edrMain = await EDR.find({status:"pending"})
    for( let i = 0; i<edrMain.length; i++)
    {
        if(edrMain[i].labRequest.length==0)
        {
            countPendingLab++
        }
        else if(edrMain[i].pharmacyRequest.length==0)
        {
            countPendingPharmacy++
        }
        else if(edrMain[i].residentNotes.length==0)
        {
            countPendingDiagnosis++
        }
    }
    const iprMain = await IPR.find({status:"pending"})
    for( let i = 0; i<iprMain.length; i++)
    {
        if(iprMain[i].labRequest.length==0)
        {
            countPendingLab++
        }
        else if(iprMain[i].pharmacyRequest.length==0)
        {
            countPendingPharmacy++
        }
        else if(iprMain[i].residentNotes.length==0)
        {
            countPendingDiagnosis++
        }
    }
 
    const edrHour = await EDR.find({'residentNotes.doctor':req.params.id,'residentNotes.date':{$gte:sixHour}})
    for( let i = 0; i<edrHour.length; i++)
    {
        edrHour[i].residentNotes.forEach(element=>{
            if(element.date>sixHour)
            {
                countPatient++
            }

        })
    }
    const iprHour = await IPR.find({'residentNotes.doctor':req.params.id,'residentNotes.date':{$gte:sixHour}})
    for( let i = 0; i<iprHour.length; i++)
    {
        iprHour[i].residentNotes.forEach(element=>{
            if(element.date>sixHour)
            {
                countPatient++
            }

        })
    }
    let perHour = countPatient/6
    const edrRad = await EDR.find({status:"pending",radiologyRequest:{$ne:[]}})
    for(let i=0; i<edrRad.length;i++)
    {
        edrRad[i].radiologyRequest.forEach(element=>{
            if(element.comments)
            {
                countRad++
            }
        })
    }
    const iprRad = await IPR.find({status:"pending",radiologyRequest:{$ne:[]} })
    for(let i=0; i<iprRad.length;i++)
    {
        iprRad[i].radiologyRequest.forEach(element=>{
            if(!element.comments)
            {
                countRad++
            }
        })
    }    
    res.status(200).json({
        success:true,
        pendingConsultations:countPendingConsultation,
        pendingLab:countPendingLab,
        pendingPharmacy:countPendingPharmacy,
        countPendingDiagnosis:countPendingDiagnosis,
        patientPerHour:perHour,
        radConsult:countRad
     })
});

exports.nurseDashboard = asyncHandler(async (req, res) => {
    const edrTriage = await EDR.find({status:"pending",triageAssessment:{$ne:[]}}).countDocuments()
    const iprTriage = await IPR.find({status:"pending",triageAssessment:{$ne:[]}}).countDocuments()
    const triagePending = edrTriage+iprTriage
    const edrTreatment = await EDR.find({status:"pending",pharmacyRequest:{$ne:[]}}).countDocuments()
    const iprTreatment = await IPR.find({status:"pending",pharmacyRequest:{$ne:[]}}).countDocuments()
    const treatmentPending = edrTreatment+iprTreatment
    const edrLab = await EDR.find({status:"pending",labRequest:{$ne:[]}}).countDocuments()
    const iprLab = await IPR.find({status:"pending",labRequest:{$ne:[]}}).countDocuments()
    const labPending = edrLab+iprLab
    var sixHour = moment().subtract(6, 'hours').utc().toDate()
    const edrPatient = await EDR.find({status:"pending",createdAt:{$gte:sixHour}}).countDocuments()
    const iprPatient = await IPR.find({status:"pending",createdAt:{$gte:sixHour}}).countDocuments()
    const patient = edrPatient + iprPatient
    const perHour = patient/6
    res.status(200).json({success:true, triagePending:triagePending, treatmentPending:treatmentPending, labPending:labPending, perHour:perHour })

});

exports.roDashboard = asyncHandler(async (req, res) => {
    var sixHour = moment().subtract(6, 'hours').utc().toDate();
    const parPending = await PAR.find({status:"Analysis In Progress"}).countDocuments()
    const edrInsured = await EDR.find({status:"pending",claimed:"true"}).countDocuments()
    const iprInsured = await IPR.find({status:"pending",claimed:"true"}).countDocuments()
    const totalInsured = edrInsured + iprInsured
    const edrUnInsured = await EDR.find({status:"pending",claimed:"false"}).countDocuments()
    const iprUnInsured = await IPR.find({status:"pending",claimed:"false"}).countDocuments()
    const totalUnInsured = edrUnInsured + iprUnInsured
    const patient = await Patient.find({createdAt:{$gte:sixHour}}).countDocuments() 
    const perHour = patient/6
    res.status(200).json({success:true, parPending:parPending, totalInsured:totalInsured,totalUnInsured:totalUnInsured,patient:patient,perHour:perHour })
});