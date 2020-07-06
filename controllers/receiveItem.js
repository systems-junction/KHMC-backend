const webpush = require("web-push");
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const ExternalReturnRequest = require('../models/externalReturnRequest');
const ReceiveItem = require('../models/receiveItem');
const MaterialReceiving = require('../models/materialReceiving');
const PurchaseRequest = require('../models/purchaseRequest');
const Account = require('../models/account');
const moment = require('moment');
const StaffType = require('../models/staffType')
const User = require('../models/user')
const Subscription = require('../models/subscriber')
const privateVapidKey = "s92YuYXxjJ38VQhRSuayTb9yjN_KnVjgKfbpsHOLpjc";
const publicVapidKey = "BOHtR0qVVMIA-IJEru-PbIKodcux05OzVVIJoIBKQu3Sp1mjvGkjaT-1PIzkEwAiAk6OuSCZfNGsgYkJJjOyV7k"
webpush.setVapidDetails(
  "mailto:hannanbutt1995@gmail.com",
  publicVapidKey,
  privateVapidKey
);
exports.getReceiveItems = asyncHandler(async (req, res) => {
    const receiveItems = await ReceiveItem.find().populate('itemId').populate('prId');

    const data = {
        receiveItems
    }
    
    res.status(200).json({ success: true, data: data });
});

exports.addReceiveItem = asyncHandler(async (req, res) => {
    const { itemId,currentQty, requestedQty, receivedQty, bonusQty, batchNumber,lotNumber,
        expiryDate,unit, discount, unitDiscount, discountAmount, tax, taxAmount, finalUnitPrice, subTotal, 
        discountAmount2,totalPrice, invoice, dateInvoice,dateReceived, notes,materialId,vendorId,prId,status } = req.body;
          var isafter = moment(req.body.dateReceived).isAfter(req.body.expiryDate);
            if (isafter)
            {
                await ExternalReturnRequest.create({
                    returnRequestNo: uuidv4(),
                    generatedBy:"System",
                    dateGenerated:req.body.dateReceived,
                    expiryDate:req.body.expiryDate,
                    itemId:req.body.itemId,
                    currentQty:req.body.qty,
                    description:"Date Expired",
                    reason:"Date Expired",
                    reasonDetail:"Date Expired",
                    status:"approved",
                    prId:req.body.prId
                })
                const payload = JSON.stringify({ title: "Item Date Expired",message:"Kindly check date of the item" });
                const type = await StaffType.findOne({type:"Warehouse Incharge"})
                const user = await User.find({staffTypeId:type._id})
                for(var i = 0; i<user.length; i++ )
                {
                Subscription.find({user:user[i]._id}, (err, subscriptions) => {
                  if (err) {
                    console.error(`Error occurred while getting subscriptions`);
                    res.status(500).json({
                      error: 'Technical error occurred',
                    });
                  } else {
                    let parallelSubscriptionCalls = subscriptions.map((subscription) => {
                      return new Promise((resolve, reject) => {
                        const pushSubscription = {
                          endpoint: subscription.endpoint,
                          keys: {
                            p256dh: subscription.keys.p256dh,
                            auth: subscription.keys.auth,
                          },
                        };
                        const pushPayload = payload;
                        webpush
                          .sendNotification(pushSubscription, pushPayload)
                          .then((value) => {
                            resolve({
                              status: true,
                              endpoint: subscription.endpoint,
                              data: value,
                            });
                          })
                          .catch((err) => {
                            reject({
                              status: false,
                              endpoint: subscription.endpoint,
                              data: err,
                            });
                          });
                      });
                    });
                  }
                });
              }
            }
            if(!isafter){
        if(req.body.receivedQty>req.body.requestedQty)
        {
        var qty=req.body.receivedQty-req.body.requestedQty;    
        await ReceiveItem.create({
            itemId,
            currentQty,
            requestedQty,
            receivedQty:req.body.requestedQty,
            bonusQty,
            batchNumber,
            lotNumber,
            expiryDate,
            unit,
            discount,
            unitDiscount,
            discountAmount,
            tax,
            taxAmount,
            finalUnitPrice,
            subTotal,
            discountAmount2,
            totalPrice,
            invoice,
            dateInvoice,
            dateReceived,
            notes,prId,status
        });
        await ExternalReturnRequest.create({
            returnRequestNo: uuidv4(),
            generatedBy:"System",
            generated:"System",
            dateGenerated:req.body.dateReceived,
            expiryDate:req.body.expiryDate,
            itemId:req.body.itemId,
            currentQty:qty,
            description:"Extra quantity",
            reason:"Extra quantity",
            reasonDetail:"Extra quantity arrived than requested",
            status:"approved",
            prId:req.body.prId
        })
        const payload = JSON.stringify({ title: "Extra Quantity Returned",message:"Kindly check quantity of the item" });
        const type = await StaffType.findOne({type:"Warehouse Incharge"})
        const user = await User.find({staffTypeId:type._id})
        for(var i = 0; i<user.length; i++ )
        {
        Subscription.find({user:user[i]._id}, (err, subscriptions) => {
          if (err) {
            console.error(`Error occurred while getting subscriptions`);
            res.status(500).json({
              error: 'Technical error occurred',
            });
          } else {
            let parallelSubscriptionCalls = subscriptions.map((subscription) => {
              return new Promise((resolve, reject) => {
                const pushSubscription = {
                  endpoint: subscription.endpoint,
                  keys: {
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth,
                  },
                };
                const pushPayload = payload;
                webpush
                  .sendNotification(pushSubscription, pushPayload)
                  .then((value) => {
                    resolve({
                      status: true,
                      endpoint: subscription.endpoint,
                      data: value,
                    });
                  })
                  .catch((err) => {
                    reject({
                      status: false,
                      endpoint: subscription.endpoint,
                      data: err,
                    });
                  });
              });
            });
          }
        });
      }
        }
        else{
            await ReceiveItem.create({
                itemId,
                currentQty,
                requestedQty,
                receivedQty,
                bonusQty,
                batchNumber,
                lotNumber,
                expiryDate,
                unit,
                discount,
                unitDiscount,
                discountAmount,
                tax,
                taxAmount,
                finalUnitPrice,
                subTotal,
                discountAmount2,
                totalPrice,
                invoice,
                dateInvoice,
                dateReceived,
                notes,prId,status
            });
        }  
    }
    
    await PurchaseRequest.findOneAndUpdate({'_id': prId},{ $set: { status: 'pending_approval_from_accounts' }},{new: true});
    const mat = await MaterialReceiving.findOneAndUpdate({'_id': materialId,'prId.id':prId},{ $set: { 'prId.$.status': req.body.status }},{new: true});
   var count = 0;
    for(let i = 0; i<mat.prId.length; i++)
    {
        if(mat.prId[i].status=="received"||mat.prId[i].status=="rejected"){
            count++;
        }
    }
    if(count == mat.prId.length)
    {
        await Account.create({
            mrId:materialId,
            status:"pending_approval_from_accounts",
            vendorId:vendorId
        })
        const payload = JSON.stringify({ title: "Account Approval Needed",message:"Kindly check the order" });
        const type = await StaffType.findOne({type:"Accounts Member"})
        const user = await User.find({staffTypeId:type._id})
        for(var i = 0; i<user.length; i++ )
        {
        Subscription.find({user:user[i]._id}, (err, subscriptions) => {
          if (err) {
            console.error(`Error occurred while getting subscriptions`);
            res.status(500).json({
              error: 'Technical error occurred',
            });
          } else {
            let parallelSubscriptionCalls = subscriptions.map((subscription) => {
              return new Promise((resolve, reject) => {
                const pushSubscription = {
                  endpoint: subscription.endpoint,
                  keys: {
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth,
                  },
                };
                const pushPayload = payload;
                webpush
                  .sendNotification(pushSubscription, pushPayload)
                  .then((value) => {
                    resolve({
                      status: true,
                      endpoint: subscription.endpoint,
                      data: value,
                    });
                  })
                  .catch((err) => {
                    reject({
                      status: false,
                      endpoint: subscription.endpoint,
                      data: err,
                    });
                  });
              });
            });
          }
        });
      }
    }
        res.status(200).json({ success: true});
});

exports.deleteReceiveItem = asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const receiveItem = await ReceiveItem.findById(_id);
    if(!receiveItem) {
        return next(
        new ErrorResponse(`Received Item not found with id of ${_id}`, 404)
        );
    }

    await ReceiveItem.deleteOne({_id: _id});

    res.status(200).json({ success: true, data: {} });
});

exports.updateReceiveItem = asyncHandler(async (req, res, next) => {
    const { _id } = req.body;

    let receiveItem = await ReceiveItem.findById(_id);

    if(!receiveItem) {
        return next(
        new ErrorResponse(`Received item not found with id of ${_id}`, 404)
        );
    }

    receiveItem = await ReceiveItem.updateOne({_id: _id}, req.body);
    res.status(200).json({ success: true, data: receiveItem });
});