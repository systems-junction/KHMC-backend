const express = require('express');
const {
    getBuInventoryById,
    getBuInventory,
    addBuInventory,
    deleteBuInventory,
    updateBuInventory
} = require('../controllers/buInventory');

const router = express.Router();

router.get('/getbuinventorybyid/:_id', getBuInventoryById);
router.get('/getbuinventory', getBuInventory);
router.post('/addbuinventory', addBuInventory);
router.delete('/deletebuinventory/:_id', deleteBuInventory);
router.put('/updatebuinventory', updateBuInventory);

module.exports = router;
