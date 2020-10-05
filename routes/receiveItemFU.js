const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getReceiveItemsFU,
    addReceiveItemFU,
    deleteReceiveItemFU,
    updateReceiveItemFU,
} = require('../controllers/receiveItemFU');

const router = express.Router();


router.get('/getreceiveitemsfu', getReceiveItemsFU);
router.post('/addreceiveitemfu', addReceiveItemFU);

router.delete('/deletereceiveitemfu/:_id', deleteReceiveItemFU);
router.put('/updatereceiveitemfu', updateReceiveItemFU);

module.exports = router;
