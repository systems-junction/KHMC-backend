const express = require('express');
const {
    getWhInventory,
    addWhInventory,
    deleteWhInventory,
    updateWhInventory,
    requestForInventry
} = require('../controllers/warehouseInventory');

const router = express.Router();


router.get('/getwhinventory', getWhInventory);
router.post('/addwhinventory', addWhInventory);
router.delete('/deletewhinventory', deleteWhInventory);
router.put('/updatewhinventory', updateWhInventory);
router.post('/requestForInventry',requestForInventry);
module.exports = router;
