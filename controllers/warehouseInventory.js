const WhInventory = require('../models/warehouseInventory');
const moment = require('moment');
const asyncHandler = require('../middleware/async');
    exports.getWhInventory = (req, res, next) => {
        try {
            WhInventory.find().populate('itemId').then(function(data, err){
                if(err) throw err;
                res.status(200).send({success:true, data: data , message: "Warehouse inventory fetched successfully" });
            })
        } catch (e) {
            res.status(400).send({success:false, message: "Error getting warehouse inventory!", error: e.toString()});
        }
    };

    exports.addWhInventory = (req, res, next) => {
        const { itemId, qty } = req.body;
        
        try{
            WhInventory.create({
                itemId,
                qty
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
            { $unwind: '$itemId' },
            {
              $match: {
                'itemId.expiration':{$lte:todayDate},
              },
            },
          ]);
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
              $match: {
                'itemId.expiration':{$lte:inputDate},
              },
            },
          ]);
            res.status(200).json({ success: true, data: whinventoryDate });
    });
