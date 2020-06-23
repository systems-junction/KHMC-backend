const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getReceiveItemsBU,
    addReceiveItemBU,
    deleteReceiveItemBU,
    updateReceiveItemBU,
} = require('../controllers/receiveItemBU');

const router = express.Router();

router.get('/getreceiveitemsbu', getReceiveItemsBU);
router.post('/addreceiveitembu', addReceiveItemBU);
router.delete('/deletereceiveitembu/:_id', deleteReceiveItemBU);
router.put('/updatereceiveitembu', updateReceiveItemBU);

module.exports = router;
