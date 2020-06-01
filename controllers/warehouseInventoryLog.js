    const WhInventoryLog = require('../models/warehouseInventoryLog');

    exports.getWhInventoryLog = (req, res, next) => {
        try {
            WhInventoryLog.find().then(function(data, err){
                if(err) throw err;
                res.status(200).send({success:true, data: data , message: "Warehouse inventory log fetched successfully" });
            })
        } catch (e) {
            res.status(400).send({success:false, message: "Error getting warehouse inventory log!", error: e.toString()});
        }
    };

    exports.addWhInventoryLog = (req, res, next) => {
        const { warehousePOId, itemId, purchasePrice, buPrice, salePrice, qty, batchNo, expiryDate, 
            timeStamp, staffId, rating, reviews } = req.body;
        
        try{
            WhInventoryLog.create({
                warehousePOId,
                itemId,
                purchasePrice,
                buPrice,
                salePrice,
                qty,
                batchNo,
                expiryDate,
                timeStamp,
                staffId,
                rating,
                reviews
            }).then((response, err) => {
                if(err) throw err;
                res.status(200).send({ success: true, message: "Warehouse inventory log added successfully"});
            });
        }
        catch(e){
            res.status(400).send({success:false, message: "Error adding warehouse inventory log!", error: e.toString()});
        }
    };

    exports.deleteWhInventoryLog = (req, res, next) => {
        const { _id } = req.body;

        try{
            WhInventoryLog.deleteOne({_id: _id}).then(function(response, err){
                if(err) throw err;
                res.status(200).send({success:true, message: "Warehouse inventory log deleted successfully" });
            })
        } catch(e) {
            res.status(400).send({success:false, message: "Error deleting warehouse inventory log!", error: e.toString()});
        }
    };

    exports.updateWhInventoryLog = (req, res, next) => {
        const { _id } = req.body;

        try {
            WhInventoryLog.updateOne({_id: _id}, req.body).then(function(){
                res.status(200).send({success:true, message: "Warehouse inventory log update successfully" });
            })
        } catch (e) {
            res.status(400).send({success:false, message: "Error updating warehouse inventory log!", error: e.toString()});
        }
    };