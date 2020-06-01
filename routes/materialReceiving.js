const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getMaterialReceivings,
    addMaterialReceiving,
    deleteMaterialReceiving,
    updateMaterialReceiving
} = require('../controllers/materialReceiving');

const router = express.Router();


router.get('/getmaterialreceivings', getMaterialReceivings);
router.post('/addmaterialreceiving', validateParams([
    {
        param_key: 'itemCode',
        required: true,
        type: 'string'
    },
    {
        param_key: 'itemName',
        required: true,
        type: 'string'
    },
    {
        param_key: 'vendorId',
        required: true,
        type: 'string'
    },
    {
        param_key: 'status',
        required: true,
        type: 'string'
    }
]), addMaterialReceiving);
router.delete('/deletematerialreceiving/:_id', deleteMaterialReceiving);
router.put('/updatematerialreceiving', updateMaterialReceiving);

module.exports = router;