const express = require('express');
const {
    getFuInventory,
    getFuInventoryKeyword,
    getFuInventoryByFU,
    getFuInventoryByFUKeyword,
    addFuInventory,
    deleteFuInventory,
    updateFuInventory,
    test
} = require('../controllers/fuInventory');

const router = express.Router();


// router.get('/getfuinventory', getFuInventory);
// router.get('/getfuinventory/:keyword', getFuInventoryKeyword);
router.get('/getfuinventory/:_id', getFuInventoryByFU);
router.get('/getfuinventory/:_id/:keyword', getFuInventoryByFUKeyword);
router.post('/addfuinventory', addFuInventory);
router.delete('/deletefuinventory/:_id', deleteFuInventory);
router.put('/updatefuinventory', updateFuInventory);
router.get('/test',test)
module.exports = router;
