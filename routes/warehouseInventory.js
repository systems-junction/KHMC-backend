const express = require('express');
const {
    getWhInventory,
    getWhInventoryKeyword,
    addWhInventory,
    deleteWhInventory,
    updateWhInventory,
    getExpiredInventory,
    getExpiredInventoryByInput,
} = require('../controllers/warehouseInventory');

const router = express.Router();


router.get('/getwhinventory', getWhInventory);
router.get('/getwhinventory/:keyword', getWhInventoryKeyword);
router.get('/getexpiredinventory', getExpiredInventory);
router.post('/getexpiredinventorybyinput', getExpiredInventoryByInput);
router.post('/addwhinventory', addWhInventory);
router.delete('/deletewhinventory', deleteWhInventory);
router.put('/updatewhinventory', updateWhInventory);
module.exports = router;
