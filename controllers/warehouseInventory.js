const WhInventory = require('../models/warehouseInventory');

    exports.getWhInventory = (req, res, next) => {
        try {
            WhInventory.find().then(function(data, err){
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
        const { _id } = req.body;

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