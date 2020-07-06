const express = require('express');
const {
    getWhInventory,
    addWhInventory,
    deleteWhInventory,
    updateWhInventory,
    getExpiredInventory,
    getExpiredInventoryByInput
} = require('../controllers/warehouseInventory');

const router = express.Router();


router.get('/getwhinventory', getWhInventory);
router.get('/getexpiredinventory', getExpiredInventory);
router.post('/getexpiredinventorybyinput', getExpiredInventoryByInput);
router.post('/addwhinventory', addWhInventory);
router.delete('/deletewhinventory', deleteWhInventory);
router.put('/updatewhinventory', updateWhInventory);

module.exports = router;
