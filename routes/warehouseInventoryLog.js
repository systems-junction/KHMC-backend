const express = require('express');
const {
    getWhInventoryLog,
    addWhInventoryLog,
    deleteWhInventoryLog,
    updateWhInventoryLog
} = require('../controllers/warehouseInventoryLog');

const router = express.Router();


router.get('/getwarehouseInventoryLog', getWhInventoryLog);
router.post('/addwarehouseInventoryLog', addWhInventoryLog);
router.delete('/deletewarehouseInventoryLog', deleteWhInventoryLog);
router.put('/updatewarehouseInventoryLog', updateWhInventoryLog);

module.exports = router;
