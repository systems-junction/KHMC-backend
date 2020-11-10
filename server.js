const express = require('express');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const moment = require('moment');
const cron = require('node-cron');
const notification = require('./components/notification');
dotenv.config({ path: './config/.env' });
connectDB();
const ChatModel = require('./models/chatRoom')
const WHInventoryModel = require('./models/warehouseInventory')
const FUInventoryModel = require('./models/fuInventory')
const ExpiredItemsWHModel = require('./models/expiredItemsWH')
const ExpiredItemsFUModel = require('./models/expiredItemsFU')
const ReplenishmentRequestModel = require('./models/replenishmentRequest');
const ItemModel = require('./models/item');
const PurchaseRequestModel = require('./models/purchaseRequest');
const PurchaseOrderModel = require('./models/purchaseOrder');
const MaterialRecievingModel = require('./models/materialReceiving');

var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay);
const requestNoFormat = require('dateformat');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pmdevteam0@gmail.com',
    pass: 'SysJunc#@!',
  },
});

//  const db = require('monk')(
//   'mongodb+srv://khmc:khmc12345@khmc-r3oxo.mongodb.net/stagingdb?retryWrites=true&w=majority'
//  );
// const db = require('monk')(
// 'mongodb+srv://khmc:khmc12345@khmc-r3oxo.mongodb.net/test?retryWrites=true&w=majority'
// );




// Route files
const auth = require('./routes/auth');
const item = require('./routes/item');
const vendor = require('./routes/vendor');
const buInventory = require('./routes/buInventory');
const fuInventory = require('./routes/fuInventory');
const buRepRequest = require('./routes/buRepRequest');
const functionalUnit = require('./routes/functionalUnit');
const buReturn = require('./routes/buReturn');
const businessUnit = require('./routes/businessUnit');
const buStockInLog = require('./routes/buStockInLog');
const buStockOutLog = require('./routes/buStockOutLog');
const buRepRequestDetails = require('./routes/buRepRequestDetails');
const systemAdmin = require('./routes/systemAdmin');
const staffType = require('./routes/staffType');
const staff = require('./routes/staff');
const warehousePRPO = require('./routes/warehousePRPO');
const warehousePODetails = require('./routes/wPODetails');
const warehouseInventory = require('./routes/warehouseInventory');
const warehouseInventoryLog = require('./routes/warehouseInventoryLog');
const purchaseRequest = require('./routes/purchaseRequest');
const purchaseOrder = require('./routes/purchaseOrder');
const receiveItem = require('./routes/receiveItem');
const receiveItemBU = require('./routes/receiveItemBU');
const receiveItemFU = require('./routes/receiveItemFU');
const materialReceiving = require('./routes/materialReceiving');
const shippingTerm = require('./routes/shippingTerm');
const accessLevel = require('./routes/accessLevel');
const account = require('./routes/account');
const replenishmentRequest = require('./routes/replenishmentRequest');
const replenishmentRequestBU = require('./routes/replenishmentRequestBU');
const internalReturnRequest = require('./routes/internalReturnRequest');
const externalReturnRequest = require('./routes/externalReturnRequest');
const subscriber = require('./routes/subscriber');
const patient = require('./routes/patient');
const insurance = require('./routes/insurance');
const radiologyService = require('./routes/radiologyService');
const laboratoryService = require('./routes/laboratoryService');
const surgeryService = require('./routes/surgeryService');
const nurseService = require('./routes/nurseService');
const dischargeRequest = require('./routes/dischargeRequest')
const EDR = require('./routes/EDR');
const IPR = require('./routes/IPR');
const ECR = require('./routes/ECR');
const OPR = require('./routes/OPR');
const PAR = require('./routes/par');
const RC = require('./routes/reimbursementClaim');
const patientClearance = require('./routes/patientClearance');
const codes = require('./routes/codes');
const notifications = require('./routes/notification');
const reports = require('./routes/reports');
const chatRooms = require('./routes/chatRoom');
const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
// Auth routes
// const { protect } = require('./middleware/auth');
// app.use(protect);

// Mount routers
app.use('/api/auth', auth);
app.use('/api/item', item);
app.use('/api/vendor', vendor);
app.use('/api/buinventory', buInventory);
app.use('/api/fuinventory', fuInventory);
app.use('/api/bureprequest', buRepRequest);
app.use('/api/functionalunit', functionalUnit);
app.use('/api/bureturn', buReturn);
app.use('/api/businessunit', businessUnit);
app.use('/api/bustockinlog', buStockInLog);
app.use('/api/bustockoutlog', buStockOutLog);
app.use('/api/bureprequestdetails', buRepRequestDetails);
app.use('/api/systemadmin', systemAdmin);
app.use('/api/accessLevel', systemAdmin);
app.use('/api/stafftype', staffType);
app.use('/api/staff', staff);
app.use('/api/warehouseprpo', warehousePRPO);
app.use('/api/warehousepodetails', warehousePODetails);
app.use('/api/warehouseinventory', warehouseInventory);
app.use('/api/warehouseinventorylog', warehouseInventoryLog);
app.use('/api/purchaserequest', purchaseRequest);
app.use('/api/purchaseorder', purchaseOrder);
app.use('/api/receiveitem', receiveItem);
app.use('/api/receiveitembu', receiveItemBU);
app.use('/api/receiveitemfu', receiveItemFU);
app.use('/api/materialreceiving', materialReceiving);
app.use('/api/shippingterm', shippingTerm);
app.use('/api/accesslevel', accessLevel);
app.use('/api/account', account);
app.use('/api/replenishmentRequest', replenishmentRequest);
app.use('/api/replenishmentRequestBU', replenishmentRequestBU);
app.use('/api/internalreturnrequest', internalReturnRequest);
app.use('/api/externalreturnrequest', externalReturnRequest);
app.use('/api/subscriber', subscriber);
app.use('/api/patient', patient);
app.use('/api/insurance', insurance);
app.use('/api/radiologyservice', radiologyService);
app.use('/api/laboratoryservice', laboratoryService);
app.use('/api/surgeryservice', surgeryService);
app.use('/api/nurseservice', nurseService);
app.use('/api/edr', EDR);
app.use('/api/ipr', IPR);
app.use('/api/ecr', ECR);
app.use('/api/opr', OPR);
app.use('/api/par', PAR);
app.use('/api/reimbursementclaim', RC)
app.use('/api/dischargerequest',dischargeRequest)
app.use('/api/patientclearance',patientClearance)
app.use('/api/codes',codes)
app.use('/api/notifications',notifications)
app.use('/api/reports',reports)
app.use('/api/chatroom',chatRooms)
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const port = 4001;
app.listen(
  PORT,
  console.log(`Server running in ${process  .env.NODE_ENV} mode on port ${PORT}`)
);
const serverSocket = http.createServer(app);
const io = socketIO(serverSocket);
io.origins('*:*');
io.on('connection', (socket) => {
  console.log("connected")
   socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on("chat_sent", function(msg) {
    ChatModel.findOneAndUpdate({_id:msg.obj2.chatId},{
              $push: { chat: msg.obj1 }
            }).then((docs)=>{
             io.emit("chat_receive", { message: msg.obj1  });
          });
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

global.globalVariable = { io: io };

serverSocket.listen(port, () =>
  console.log(`Socket is listening on port ${port}`)
);
var todayDate = moment().utc().toDate();
cron.schedule('0 0 0 * * *', () => {
  WHInventoryModel.aggregate([
    {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
    {$unwind:'$itemId'},
    {$unwind:'$batchArray'},
    {$match:{'batchArray.expiryDate':{$lte: todayDate}}},
    {$project:{_id:1, itemId: 1,batchArray:1,qty:1,maximumLevel:1}}
]).then((docs)=>{
  for(let i=0;i<docs.length;i++)
  {
    ExpiredItemsWHModel.create({
      itemId:docs[i].itemId,
      batch:docs[i].batchArray
    })
      WHInventoryModel.findOneAndUpdate({_id:docs[i]._id},{
        $pull: { batchArray : { _id : docs[i].batchArray._id } },
        $set:{ qty:docs[i].qty-docs[i].batchArray.quantity},
      },{new:true}).then((response)=>{
        if(response.qty<response.reorderLevel){
          ItemModel.findOne({ _id: docs[i].itemId }).then((item)=>{
             PurchaseRequestModel.create({
              requestNo: 'PR' + day + requestNoFormat(new Date(), 'yyHHMM'),
              generated: 'System',
              generatedBy: 'System',
              committeeStatus: 'completed',
              status: 'pending',
              commentNotes: 'System',
              reason: 'System',
              item: [
                {
                  itemId: docs[i].itemId,
                  currQty: docs[i].qty,
                  reqQty: docs[i].maximumLevel - docs[i].qty,
                  comments: 'System',
                  name: item.name,
                  description: item.description,
                  itemCode: item.itemCode,
                  status: 'pending',
                  secondStatus: 'pending',
                },
              ],
              vendorId: item.vendorId,
              requesterName: 'System',
              department: 'System',
              orderType: 'System',
            }).then((not)=>{
              notification(
                'Purchase Request',
                'A new Purchase Request ' +
                  not.requestNo +
                  ' has been generated at ' +
                  not.createdAt,
                'admin'
              );
            PurchaseOrderModel.create({
              purchaseOrderNo: 'PO' + day + requestNoFormat(new Date(), 'yyHHMM'),
              purchaseRequestId: [not._id],
              generated: 'System',
              generatedBy: 'System',
              date: moment().toDate(),
              vendorId: not.vendorId,
              status: 'po_sent',
              committeeStatus: 'po_sent',
              sentAt: moment().toDate(),
              createdAt: moment().toDate(),
              updatedAt: moment().toDate(),
            }).then((PO)=>{
        PO.populate('vendorId')
        .populate({
          path: 'purchaseRequestId',
          populate: [
            {
              path: 'item.itemId',
            },
          ],
        }).execPopulate().then((PurchaseOrder)=>{
          const vendorEmail = PurchaseOrder.vendorId.contactEmail; 
          var prArray = PurchaseOrder.purchaseRequestId.reduce(function (a, b) {
            return b;
          }, '');
          var content = prArray.item.reduce(function (a, b) {
            return (
              a +
              '<tr><td>' +
              b.itemId.itemCode +
              '</a></td><td>' +
              b.itemId.name +
              '</td><td>' +
              b.reqQty +
              '</td></tr>'
            );
          }, '');
          var mailOptions = {
            from: 'pmdevteam0@gmail.com',
            to: vendorEmail,
            subject: 'Request for items',
            html:
              '<div><table><thead><tr><th>Item Code</th><th>Item Name</th><th>Quantity</th></tr></thead><tbody>' +
              content +
              '</tbody></table></div>',
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          MaterialRecievingModel.create({
            prId: [
              {
                id: not._id,
                status: 'not recieved',
              },
            ],
            poId: PurchaseOrder._id,
            vendorId: PurchaseOrder.vendorId._id,
            status: 'pending_receipt',
          });
          notification(
            'Purchase Order',
            'A new Purchase Order ' +
            PurchaseOrder.purchaseOrderNo +
              ' has been generated at ' +
              PurchaseOrder.createdAt +
              ' by System',
            'admin'
          );         
        });
            });
            })
          });
        }
    })
  }
})
var stFU;
var st2FU;
FUInventoryModel.aggregate([
  {$lookup:{from:'items',localField:'itemId',foreignField:'_id',as:'itemId'}},
  {$unwind:'$itemId'},
  {$unwind:'$batchArray'},
  {$match:{'batchArray.expiryDate':{$lte: todayDate}}},
  {$project:{_id:1, itemId: 1,batchArray:1,qty:1,fuId:1,maximumLevel:1}}
]).then((docs)=>{
for(let i=0;i<docs.length;i++)
{
  ExpiredItemsFUModel.create({
    itemId:docs[i].itemId,
    batch:docs[i].batchArray,
    fuId:docs[i].fuId
  })
    FUInventoryModel.findOneAndUpdate({_id:docs[i]._id},{
      $pull: { batchArray : { _id : docs[i].batchArray._id } },
      $set:{ qty:docs[i].qty-docs[i].batchArray.quantity},
    },{new:true}).then((response)=>{
      if(response.qty<response.reorderLevel){
        ItemModel.findOne({ _id: docs[i].itemId }).then((item)=>{
          WHInventoryModel.findOne({itemId: docs[i].itemId}).then((whInv)=>{
            if (whInv.qty < docs[i].maximumLevel - docs[i].qty) {
              stFU = 'pending';
              st2FU = 'Cannot be fulfilled';
            } else {
              stFU = 'pending';
              st2FU = 'Can be fulfilled';
            } 
          })
           ReplenishmentRequestModel.create({
            requestNo: 'RR' + day + requestNoFormat(new Date(), 'yyHHMM'),
            generated: 'System',
            generatedBy: 'System',
            reason: 'reactivated_items',
            fuId: docs[i].fuId,
            items: [
              {
                itemId: docs[i].itemId,
                currentQty: docs[i].qty,
                requestedQty: docs[i].maximumLevel - docs[i].qty,
                recieptUnit: item.receiptUnit,
                issueUnit: item.issueUnit,
                fuItemCost: 0,
                description: item.description,
                status: "pending",
                secondStatus: "Can be fulfilled",
                batchArray: [],
              },
            ],
            comments: 'System generated Replenishment Request',
            status: stFU,
            secondStatus: st2FU,
            requesterName: 'System',
            orderType: '',
            to: 'Warehouse',
            from: 'FU',
            department: '',
          }).then((not)=>{
            notification(
              'Replenishment Request Generated',
              'New Replenishment Request Generated',
              'Warehouse Member'
            );
            notification(
              'Replenishment Request Generated',
              'New Replenishment Request Generated',
              'FU Member'
            );
          })
        });
      }
  })
}
})

});
//automated but remain in receiveItemBU

// const pRequest = db.get('purchaserequests');
// const pOrder = db.get('purchaseorders');
// cron.schedule('*/10 * * * * *', () => {
  // cron.schedule('* 7 * * *', () => {
  // pRequest
  //   .find({ committeeStatus: 'approved', generated: 'System' })
  //   .then((docs) => {
      // var temp = [];
      // for (let i = 0; i < docs.length; i++) {
      //   temp.push(docs[i]);
      // }
      // while (temp.length > 0) {
        // var c = [];
        // var temp2 = temp[0];
        // if (temp2) {
        //   c = temp.filter(
        //     (i) => i.vendorId.toString() === temp2.vendorId.toString()
        //   );
        // }
        // if (c.length > 0) {
          // var abc = [];
          // c.map((u) => {
          //   abc.push(u._id);
          // });
          // pOrder.insert({
          //   purchaseOrderNo: 'PO' +day+ requestNoFormat(new Date(), 'yyHHMM'),
          //   purchaseRequestId: abc,
          //   generated: 'System',
          //   generatedBy: 'System',
          //   date: moment().toDate(),
          //   vendorId: c[0].vendorId,
          //   status: 'pending_receipt',
          //   committeeStatus: 'approved',
          //   sentAt: moment().toDate(),
          //   createdAt: moment().toDate(),
          //   updatedAt: moment().toDate(),
          // });
          // pOrderModel
          //   .findOneAndUpdate(
          //     { committeeStatus: 'approved', generated: 'System' },
          //     { $set: { committeeStatus: 'po_sent', status: 'po_sent' } },
          //     { new: true }
          //   )
          //   .populate({
          //     path: 'purchaseRequestId',
          //     populate: [
          //       {
          //         path: 'item.itemId',
          //       },
          //     ],
          //   })
          //   .populate('vendorId')
          //   .then(function (data, err) {
          //     notification(
          //       'Purchase Order',
          //       'A new Purchase Order ' +
          //         data.purchaseOrderNo +
          //         ' has been generated at ' +
          //         data.createdAt +
          //         ' by System',
          //       'admin'
          //     );
              // const vendorEmail = data.vendorId.contactEmail;
              // var content = data.purchaseRequestId.reduce(function (a, b) {
              //   return (
              //     a +
              //     '<tr><td>' +
              //     b.item.itemId.itemCode +
              //     '</a></td><td>' +
              //     b.item.itemId.name +
              //     '</td><td>' +
              //     b.item.reqQty +
              //     '</td></tr>'
              //   );
              // }, '');
              // var mailOptions = {
              //   from: 'pmdevteam0@gmail.com',
              //   to: vendorEmail,
              //   subject: 'Request for items',
              //   html:
              //     '<div><table><thead><tr><th>Item Code</th><th>Item Name</th><th>Quantity</th></tr></thead><tbody>' +
              //     content +
              //     '</tbody></table></div>',
              // };
              // transporter.sendMail(mailOptions, function (error, info) {
              //   if (error) {
              //     console.log(error);
              //   } else {
              //     console.log('Email sent: ' + info.response);
              //   }
              // });
              // var work = [];
              // for (let q = 0; q < abc.length; q++) {
              //   work.push({ id: abc[q]._id, status: 'not recieved' });
              // }
              // MaterialRecievingModel.create({
              //   prId: work,
              //   poId: data._id,
              //   vendorId: data.vendorId._id,
              //   status: 'pending_receipt',
              // }).then(function (data, err) {});
            // });
          // temp = temp.filter(
          //   (i) => i.vendorId.toString() != c[0].vendorId.toString()
          // );
        // }
      // }
      // for (let i = 0; i < docs.length; i++) {
      //   pRequest.update(
      //     { _id: docs[i]._id },
      //     { $set: { committeeStatus: 'completed' } }
      //   );
      // }
    // });
// });