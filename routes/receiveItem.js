const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getReceiveItems,
    addReceiveItem,
    deleteReceiveItem,
    updateReceiveItem,
} = require('../controllers/receiveItem');

const router = express.Router();


router.get('/getreceiveitems', getReceiveItems);
router.post('/addreceiveitem', validateParams([
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
        param_key: 'currentQty',
        required: true,
        type: 'string'
    },
    {
        param_key: 'requiredQty',
        required: true,
        type: 'string'
    }
  ]), addReceiveItem);

router.delete('/deletereceiveitem/:_id', deleteReceiveItem);
router.put('/updatereceiveitem', updateReceiveItem);

module.exports = router;
