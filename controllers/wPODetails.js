const WPODetails = require('../models/wPODetails');

    exports.getWPODetails = (req, res, next) => {
        try {
            WPODetails.find().then(function(data, err){
                if(err) throw err;
                res.status(200).send({success:true, data: data , message: "warehouse PO details fetched successfully" });
            })
        } catch (e) {
            res.status(400).send({success:false, message: "Error getting warehouse PO details!", error: e.toString()});
        }
    };

    exports.addWPODetails = (req, res, next) => {
        const { WarehousePOId, itemId, qty } = req.body;
        
        try{
            WPODetails.create({
                WarehousePOId,
                itemId,
                qty
            }).then((response, err) => {
                if(err) throw err;
                res.status(200).send({ success: true, message: "warehouse PO details added successfully"});
            });
        }
        catch(e){
            res.status(400).send({success:false, message: "Error adding warehouse PO details!", error: e.toString()});
        }
    };

    exports.deleteWPODetails = (req, res, next) => {
        const { _id } = req.body;

        try{
            WPODetails.deleteOne({_id: _id}).then(function(response, err){
                if(err) throw err;
                res.status(200).send({success:true, message: "warehouse PO details deleted successfully" });
            })
        } catch(e) {
            res.status(400).send({success:false, message: "Error deleting warehouse PO details!", error: e.toString()});
        }
    };

    exports.updateWPODetails = (req, res, next) => {
        const { _id } = req.body;

        try {
            WPODetails.updateOne({_id: _id}, req.body).then(function(){
                res.status(200).send({success:true, message: "warehouse PO details update successfully" });
            })
        } catch (e) {
            res.status(400).send({success:false, message: "Error deleting warehouse PO details!", error: e.toString()});
        }
    };