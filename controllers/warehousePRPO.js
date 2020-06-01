const WhPRPO = require('../models/warehousePRPO');

    exports.getWhPRPO = (req, res, next) => {
        try {
            WhPRPO.find().then(function(data, err){
                if(err) throw err;
                res.status(200).send({success:true, data: data , message: "warehouse PRPO fetched successfully" });
            })
        } catch (e) {
            res.status(400).send({success:false, message: "Error getting warehouse PRPO!", error: e.toString()});
        }
    };

    exports.addWhPRPO = (req, res, next) => {
        const { requesterId, status, vendorId, approvedByStaffId, timeStamp } = req.body;
        
        try{
            WhPRPO.create({
                requesterId,
                status,
                vendorId,
                approvedByStaffId,
                timeStamp
            }).then((response, err) => {
                if(err) throw err;
                res.status(200).send({ success: true, message: "Warehouse PRPO added successfully"});
            });
        }
        catch(e){
            res.status(400).send({success:false, message: "Error adding warehouse PRPO!", error: e.toString()});
        }
    };

    exports.deleteWhPRPO = (req, res, next) => {
        const { _id } = req.body;

        try{
            WhPRPO.deleteOne({_id: _id}).then(function(response, err){
                if(err) throw err;
                res.status(200).send({success:true, message: "Warehouse PRPO deleted successfully" });
            })
        } catch(e) {
            res.status(400).send({success:false, message: "Error deleting warehouse PRPO!", error: e.toString()});
        }
    };

    exports.updateWhPRPO = (req, res, next) => {
        const { _id } = req.body;

        try {
            WhPRPO.updateOne({_id: _id}, req.body).then(function(){
                res.status(200).send({success:true, message: "Warehouse PRPO update successfully" });
            })
        } catch (e) {
            res.status(400).send({success:false, message: "Error deleting warehouse PRPO!", error: e.toString()});
        }
    };