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
router.post('/addreceiveitem', addReceiveItem);

router.delete('/deletereceiveitem/:_id', deleteReceiveItem);
router.put('/updatereceiveitem', updateReceiveItem);

module.exports = router;
