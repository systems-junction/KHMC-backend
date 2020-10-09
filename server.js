const express = require('express');
const notification = require('./components/notification');
const pOrderModel = require('./models/purchaseOrder');
const MaterialRecievingModel = require('./models/materialReceiving');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const moment = require('moment');
const cron = require('node-cron');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
var nodemailer = require('nodemailer');
const requestNoFormat = require('dateformat');
   const db = require('monk')(
    'mongodb+srv://khmc:khmc12345@khmc-r3oxo.mongodb.net/stagingdb?retryWrites=true&w=majority'
   );
var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay);
//  const db = require('monk')(
//  'mongodb+srv://khmc:khmc12345@khmc-r3oxo.mongodb.net/test?retryWrites=true&w=majority'
//  );
dotenv.config({ path: './config/.env' });
connectDB();
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abdulhannan.itsolution@gmail.com',
    pass: 'Abc123##',
  },
});
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
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const port = 4001;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
const serverSocket = http.createServer(app);
const io = socketIO(serverSocket);
io.origins('*:*');
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
const pRequest = db.get('purchaserequests');
const pOrder = db.get('purchaseorders');
cron.schedule('*/10 * * * * *', () => {
  // cron.schedule('* 7 * * *', () => {
  pRequest
    .find({ committeeStatus: 'approved', generated: 'System' })
    .then((docs) => {
      var temp = [];
      for (let i = 0; i < docs.length; i++) {
        temp.push(docs[i]);
      }
      while (temp.length > 0) {
        var c = [];
        var temp2 = temp[0];
        if (temp2) {
          c = temp.filter(
            (i) => i.vendorId.toString() === temp2.vendorId.toString()
          );
        }
        if (c.length > 0) {
          var abc = [];
          c.map((u) => {
            abc.push(u._id);
          });
          pOrder.insert({
            purchaseOrderNo: 'PO' +day+ requestNoFormat(new Date(), 'yyHHMM'),
            purchaseRequestId: abc,
            generated: 'System',
            generatedBy: 'System',
            date: moment().toDate(),
            vendorId: c[0].vendorId,
            status: 'pending_receipt',
            committeeStatus: 'approved',
            sentAt: moment().toDate(),
            createdAt: moment().toDate(),
            updatedAt: moment().toDate(),
          });
          pOrderModel
            .findOneAndUpdate(
              { committeeStatus: 'approved', generated: 'System' },
              { $set: { committeeStatus: 'po_sent', status: 'po_sent' } },
              { new: true }
            )
            .populate({
              path: 'purchaseRequestId',
              populate: [
                {
                  path: 'item.itemId',
                },
              ],
            })
            .populate('vendorId')
            .then(function (data, err) {
              notification(
                'Purchase Order',
                'A new Purchase Order ' +
                  data.purchaseOrderNo +
                  ' has been generated at ' +
                  data.createdAt +
                  ' by System',
                'admin'
              );
              const vendorEmail = data.vendorId.contactEmail;
              var content = data.purchaseRequestId.reduce(function (a, b) {
                return (
                  a +
                  '<tr><td>' +
                  b.item.itemId.itemCode +
                  '</a></td><td>' +
                  b.item.itemId.name +
                  '</td><td>' +
                  b.item.reqQty +
                  '</td></tr>'
                );
              }, '');
              var mailOptions = {
                from: 'abdulhannan.itsolution@gmail.com',
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
              var work = [];
              for (let q = 0; q < abc.length; q++) {
                work.push({ id: abc[q]._id, status: 'not recieved' });
              }
              MaterialRecievingModel.create({
                prId: work,
                poId: data._id,
                vendorId: data.vendorId._id,
                status: 'pending_receipt',
              }).then(function (data, err) {});
            });
          temp = temp.filter(
            (i) => i.vendorId.toString() != c[0].vendorId.toString()
          );
        }
      }
      for (let i = 0; i < docs.length; i++) {
        pRequest.update(
          { _id: docs[i]._id },
          { $set: { committeeStatus: 'completed' } }
        );
      }
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
