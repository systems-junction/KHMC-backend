const WhInventory = require('../models/warehouseInventory');
const moment = require('moment');
const asyncHandler = require('../middleware/async');
    exports.getWhInventory = (req, res, next) => {
        try {
            WhInventory.find().populate('itemId').limit(500).then(function(data, err){
                if(err) throw err;
                res.status(200).send({success:true, data: data , message: "Warehouse inventory fetched successfully" });
            })
        } catch (e) {
            res.status(400).send({success:false, message: "Error getting warehouse inventory!", error: e.toString()});
        }
    };
    exports.getWhInventoryPaginated = asyncHandler(async (req, res) => {
      const options = {
        limit: req.params.limit,
        page: req.params.page,
        populate:[{
          path: 'itemId',
          populate:{
            path:'vendorId',
            select:['englishName','vendorNo'],
          }
      }],
      };
      const whinventory = await WhInventory.paginate({} , options)    
      res.status(200).json({ success: true, data: whinventory });
    });
exports.getWhInventoryKeyword = asyncHandler(async(req,res)=>{
   const ware = await WhInventory.find().populate('itemId').limit(500);
   var arr= [];
   for(let i = 0; i<ware.length; i++)
    {
        if(
      (ware[i].itemId.itemCode && ware[i].itemId.itemCode.toLowerCase().startsWith(req.params.keyword.toLowerCase()))||
      (ware[i].itemId.name && ware[i].itemId.name.toLowerCase().startsWith(req.params.keyword.toLowerCase()))||
      (ware[i].itemId.tradeName && ware[i].itemId.tradeName.toLowerCase().startsWith(req.params.keyword.toLowerCase()))||
      (ware[i].itemId.scientificName && ware[i].itemId.scientificName.startsWith(req.params.keyword))
      )
      {
        arr.push(ware[i])
      }
    }
    res.status(200).json({ success: true, data:arr });
})
    exports.addWhInventory = (req, res, next) => {
        const { itemId, qty, maximumLevel, reorderLevel, minimumLevel } = req.body;
        try{
            WhInventory.create({
                itemId,
                qty,
                maximumLevel,
                reorderLevel,
                minimumLevel
            }).then((response, err) => {
                if(err) throw err;
                res.status(200).send({ success: true, message: "Warehouse inventory added successfully"});
            });
        }
        catch(e){
            res.status(400).send({success:false, message: "Error adding warehouse inventory!", error: e.toString()});
        }
    };

    exports.deleteWhInventory = (req, res, next) => {
        const { _id } = req.params;

        try{
            WhInventory.deleteOne({_id: _id}).then(function(response, err){
                if(err) throw err;
                res.status(200).send({success:true, message: "Warehouse inventory deleted successfully" });
            })
        } catch(e) {
            res.status(400).send({success:false, message: "Error deleting warehouse inventory!", error: e.toString()});
        }
    };

    exports.updateWhInventory = (req, res, next) => {
        const { _id } = req.body;

        try {
            WhInventory.updateOne({_id: _id}, req.body).then(function(){
                res.status(200).send({success:true, message: "Warehouse inventory update successfully" });
            })
        } catch (e) {
            res.status(400).send({success:false, message: "Error updating warehouse inventory!", error: e.toString()});
        }
    };
    exports.getExpiredInventory = asyncHandler(async (req, res) => {
        var todayDate = moment().startOf('day')
        .utc().toDate();
        const whinventoryDate = await WhInventory.aggregate([
            {
              $lookup: {
                from: 'items',
                localField: 'itemId',
                foreignField: '_id',
                as: 'itemId',
              },
            },
            
            { $unwind: '$itemId'},
            {
              $lookup: {
                from: 'vendors',
                localField: 'itemId.vendorId',
                foreignField: '_id',
                as: 'vendorId',
              },
            },
            { $unwind: '$vendorId'},
            {
              $match: {
                'itemId.expiration':{$lte:todayDate},
              },
            },
          ]).limit(100);
            res.status(200).json({ success: true, data: whinventoryDate });
    });
    exports.getExpiredInventoryByInput = asyncHandler(async (req, res) => {
        var inputDate = moment(req.body.inputDate).startOf('day').utc().toDate();
        const whinventoryDate = await WhInventory.aggregate([
            {
              $lookup: {
                from: 'items',
                localField: 'itemId',
                foreignField: '_id',
                as: 'itemId',
              },
            },
            { $unwind: '$itemId' },
            {
              $lookup: {
                from: 'vendors',
                localField: 'itemId.vendorId',
                foreignField: '_id',
                as: 'vendorId',
              },
            },
            { $unwind: '$vendorId'},
            {
              $match: {
                'itemId.expiration':{$lte:inputDate},
              },
            },
          ]);
            res.status(200).json({ success: true, data: whinventoryDate });
    });
