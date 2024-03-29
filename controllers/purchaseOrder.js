const moment = require('moment');
const notification = require('../components/notification');
var nodemailer = require('nodemailer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Vendor = require('../models/vendor');
const PurchaseOrder = require('../models/purchaseOrder');
const MaterialRecieving = require('../models/materialReceiving');
const requestNoFormat = require('dateformat');
const purchaseRequest = require('../models/purchaseRequest');

const fetch = require('node-fetch');
const blockchainUrl = require('../components/blockchain');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pmdevteam0@gmail.com',
    pass: 'SysJunc#@!',
  },
});
exports.getPurchaseOrder = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.find()
    .populate('vendorId')
    .populate('approvedBy');
  // .populate('purchaseRequestId');
  res.status(200).json({ success: true, data: purchaseOrder });
});
exports.getPurchaseOrders = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.find()
    .populate('vendorId')
    .populate('approvedBy')
    .populate({
      path: 'purchaseRequestId',
      populate: [{ path: 'vendorId' }],
    });
  const vendor = await Vendor.find();
  const status = [
    { key: 'po_created', value: 'PO Created' },
    { key: 'po_sent', value: 'PO Sent(to Vendor)' },
    { key: 'items_in_transit', value: 'Items In Transit from Vendor' },
    {
      key: 'items_received_from_vendor',
      value: 'Items Received from Vendor(at Warehouse)',
    },
  ];
  const generated = [
    { key: 'system', value: 'System' },
    { key: 'manual', value: 'Manual' },
  ];
  const paymentTerms = [
    { key: 'term1', value: 'Term 1' },
    { key: 'term2', value: 'Term 2' },
  ];

  const data = {
    purchaseOrder,
    vendor,
    status,
    generated,
    paymentTerms,
  };

  res.status(200).json({ success: true, data: data });
});

exports.getPurchaseOrdersKeyword = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.find()
    .populate('vendorId')
    .populate('approvedBy')
    .populate({
      path: 'purchaseRequestId',
      populate: [{ path: 'vendorId' }],
    });
  var arr = [];
  for (let i = 0; i < purchaseOrder.length; i++) {
    if (
      (purchaseOrder[i].purchaseOrderNo &&
        purchaseOrder[i].purchaseOrderNo
          .toLowerCase()
          .startsWith(req.params.keyword.toLowerCase())) ||
      (purchaseOrder[i].vendorId.englishName &&
        purchaseOrder[i].vendorId.englishName
          .toLowerCase()
          .startsWith(req.params.keyword.toLowerCase()))
    ) {
      arr.push(purchaseOrder[i]);
    }
  }
  const data = {
    purchaseOrder: arr,
  };

  res.status(200).json({ success: true, data: data });
});

exports.addPurchaseOrder = asyncHandler(async (req, res) => {
  const {
    generated,
    generatedBy,
    commentNotes,
    purchaseRequestId,
    date,
    vendorId,
    status,
  } = req.body;
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  const purchaseOrder = await PurchaseOrder.create({
    purchaseOrderNo: 'PO' + day + requestNoFormat(new Date(), 'yyHHMM'),
    purchaseRequestId,
    generated,
    generatedBy,
    date,
    commentNotes,
    vendorId,
    status,
    committeeStatus: 'pending',
	newStatus:"test",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  });
  const string = JSON.stringify(purchaseOrder);
  var parser = JSON.parse(string);
  delete parser._id;
  parser.approvedBy = ' ';
  parser.sentAt = ' ';
  parser.inProgressTime = ' ';
  for (let i = 0; i < purchaseRequestId.length; i++) {
    await purchaseRequest.findOneAndUpdate(
      { _id: purchaseRequestId[i] },
      { $set: { availability: false } }
    );
  }
  (async () => {
    try {
      const response = await fetch(blockchainUrl + 'addPurchaseOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parser),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error.response.body);
    }
  })();
  //  res.status(200).json({ success: true, data: vendor });
  notification(
    'Purchase Order',
    'A new Purchase Order ' +
      purchaseOrder.purchaseOrderNo +
      ' has been generated at ' +
      purchaseOrder.createdAt,
    'admin'
  );
  const po = await PurchaseOrder.find()
    .populate('vendorId')
    .populate('purchaseRequestId');
  globalVariable.io.emit('get_data', po);
  res.status(200).json({ success: true, data: purchaseOrder });
});

exports.deletePurchaseOrder = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const purchaseOrder = await PurchaseOrder.findById(_id);
  if (!purchaseOrder) {
    return next(
      new ErrorResponse(`Purchase Order not found with id of ${_id}`, 404)
    );
  }

  await PurchaseOrder.deleteOne({ _id: _id });

  res.status(200).json({ success: true, data: {} });
});

exports.updatePurchaseOrder = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  let purchaseOrder = await PurchaseOrder.findById(_id);
  if (!purchaseOrder) {
    return next(
      new ErrorResponse(`Purchase Order not found with id of ${_id}`, 404)
    );
  }

  if (req.body.committeeStatus === 'approved') {
    notification(
      'Purchase Order',
      'Purchase Order ' +
        req.body.purchaseOrderNo +
        ' has been approved by Accounts',
      'admin'
    );
    req.body.status = 'pending_receipt';
    req.body.sentAt = Date.now();
    req.body.inProgressTime = Date.now();
    // Sending Email to Vendor

    const purchaseRequest = await PurchaseOrder.findOne({ _id: _id })
      .populate({
        path: 'purchaseRequestId',
        populate: [
          {
            path: 'item.itemId',
          },
        ],
      })
      .populate('vendorId');
    const vendorEmail = purchaseRequest.vendorId.contactEmail;
    var prArray = purchaseRequest.purchaseRequestId.reduce(function (a, b) {
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
  }
  purchaseOrder = await PurchaseOrder.findOneAndUpdate({ _id: _id }, req.body, {
    new: true,
  });
  if (purchaseOrder.status === 'pending_receipt') {
    const { prId } = req.body;
    await MaterialRecieving.create({
      prId,
      poId: purchaseOrder._id,
      vendorId: purchaseOrder.vendorId,
      status: 'pending_receipt',
    });
  }
  res.status(200).json({ success: true, data: purchaseOrder });
});

// const payload = JSON.stringify({ title: "Purchase Order Generated",message:"Kindly check the order" });
// const type = await StaffType.findOne({type:"Committe Member"})
// const user = await User.find({staffTypeId:type._id})
// for(var i = 0; i<user.length; i++ )
// {
// Subscription.find({user:user[i]._id}, (err, subscriptions) => {
//   if (err) {
//     console.error(`Error occurred while getting subscriptions`);
//     res.status(500).json({
//       error: 'Technical error occurred',
//     });
//   } else {
//     let parallelSubscriptionCalls = subscriptions.map((subscription) => {
//       return new Promise((resolve, reject) => {
//         const pushSubscription = {
//           endpoint: subscription.endpoint,
//           keys: {
//             p256dh: subscription.keys.p256dh,
//             auth: subscription.keys.auth,
//           },
//         };
//         const pushPayload = payload;
//         webpush
//           .sendNotification(pushSubscription, pushPayload)
//           .then((value) => {
//             resolve({
//               status: true,
//               endpoint: subscription.endpoint,
//               data: value,
//             });
//           })
//           .catch((err) => {
//             reject({
//               status: false,
//               endpoint: subscription.endpoint,
//               data: err,
//             });
//           });
//       });
//     });
//   }
// });
// }
// const po = await PurchaseOrder.find()
// .populate('vendorId')
// .populate('purchaseRequestId');
// globalVariable.io.emit("get_data", po)
