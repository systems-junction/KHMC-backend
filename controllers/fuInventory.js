const requestNoFormat = require('dateformat');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const FuInventory = require('../models/fuInventory');
const Items = require('../models/item');
const FunctionalUnit = require('../models/functionalUnit');
const fetch = require('node-fetch');
const blockchainUrl = require('../components/blockchain');

exports.test = asyncHandler(async (req, res) => {
  // done 3 fu
  //   const f = await FunctionalUnit.find()
  //   const test2 = await Items.find().skip(8000)
  //   var count = 0;
  //   for(let i = 0; i<test2.length; i++)
  //   {
  //  const abc =  await FuInventory.create({
  //   fuId:f[2]._id,
  //   itemId: test2[i]._id,
  //   qty: 333,
  //   maximumLevel:555,
  //   minimumLevel:77,
  //   reorderLevel:111
  // })
  // if(abc){count++}
  // if(count==2000)
  // {
  //   break;
  // }
  // }
  // res.status(200).json({ success: true, data:test2});
});
exports.getFuInventory = asyncHandler(async (req, res) => {
  const fuInventory = await FuInventory.find()
    .populate('itemId')
    .populate('fuId')
    .limit(500);
  const items = await Items.find().limit(500);
  const functionalUnit = await FunctionalUnit.find();
  const data = {
    fuInventory,
    items,
    functionalUnit,
  };
  res.status(200).json({ success: true, data: data });
});
exports.getFuInventoryKeyword = asyncHandler(async (req, res) => {
  const fuInventory = await FuInventory.find()
    .populate('itemId')
    .populate('fuId')
    .limit(500);
  var arr = [];
  for (let i = 0; i < fuInventory.length; i++) {
    if (
      (fuInventory[i].itemId.itemCode &&
        fuInventory[i].itemId.itemCode
          .toLowerCase()
          .startsWith(req.params.keyword.toLowerCase())) ||
      (fuInventory[i].itemId.name &&
        fuInventory[i].itemId.name
          .toLowerCase()
          .startsWith(req.params.keyword.toLowerCase())) ||
      (fuInventory[i].itemId.tradeName &&
        fuInventory[i].itemId.tradeName
          .toLowerCase()
          .startsWith(req.params.keyword.toLowerCase())) ||
      (fuInventory[i].itemId.scientificName &&
        fuInventory[i].itemId.scientificName.startsWith(req.params.keyword))
    ) {
      arr.push(fuInventory[i]);
    }
  }
  res.status(200).json({ success: true, data: arr });
});
exports.getFuInventoryByFU = asyncHandler(async (req, res) => {
  const fuInventory = await FuInventory.find({ fuId: req.params._id })
    .populate('itemId')
    .populate('fuId')
    .limit(500);
  const items = await Items.find().limit(500);
  const functionalUnit = await FunctionalUnit.find();
  const data = {
    fuInventory,
    items,
    functionalUnit,
  };
  res.status(200).json({ success: true, data: data });
});

exports.getFuInventoryByFUKeyword = asyncHandler(async (req, res) => {
  const fuInventory = await FuInventory.find({ fuId: req.params._id })
    .populate('itemId')
    .populate('fuId')
    .limit(500);
  var arr = [];
  for (let i = 0; i < fuInventory.length; i++) {
    if (
      (fuInventory[i].itemId.itemCode &&
        fuInventory[i].itemId.itemCode
          .toLowerCase()
          .startsWith(req.params.keyword.toLowerCase())) ||
      (fuInventory[i].itemId.name &&
        fuInventory[i].itemId.name
          .toLowerCase()
          .startsWith(req.params.keyword.toLowerCase())) ||
      (fuInventory[i].itemId.tradeName &&
        fuInventory[i].itemId.tradeName
          .toLowerCase()
          .startsWith(req.params.keyword.toLowerCase())) ||
      (fuInventory[i].itemId.scientificName &&
        fuInventory[i].itemId.scientificName.startsWith(req.params.keyword))
    ) {
      arr.push(fuInventory[i]);
    }
  }
  res.status(200).json({ success: true, data: arr });
});

exports.addFuInventory = asyncHandler(async (req, res) => {
  const {
    fuId,
    itemId,
    qty,
    maximumLevel,
    reorderLevel,
    minimumLevel,
    batchArray,
  } = req.body;
  const fuInventory = await FuInventory.create({
    fuId,
    itemId,
    qty,
    maximumLevel,
    reorderLevel,
    minimumLevel,
    batchArray,
  });
  const string = JSON.stringify(fuInventory);
  var parser = JSON.parse(string);

  delete parser._id;

  (async () => {
    try {
      const response = await fetch(blockchainUrl + 'addFuInventory', {
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

  res.status(200).json({ success: true, data: fuInventory });
});

exports.deleteFuInventory = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const fuInventory = await FuInventory.findById(_id);

  if (!fuInventory) {
    return next(
      new ErrorResponse(`Fu inventory not found with id of ${_id}`, 404)
    );
  }

  await FuInventory.deleteOne({ _id: _id });

  res.status(200).json({ success: true, data: {} });
});

exports.updateFuInventory = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  let fuInventory = await FuInventory.findById(_id);

  if (!fuInventory) {
    return next(
      new ErrorResponse(`Fu inventory not found with id of ${_id}`, 404)
    );
  }

  fuInventory = await FuInventory.updateOne({ _id: _id }, req.body);

  res.status(200).json({ success: true, data: fuInventory });
});
