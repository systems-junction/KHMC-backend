const express = require('express');
const {
    getBuReturn,
    addBuReturn,
    deleteBuReturn,
    updateBuReturn
} = require('../controllers/buReturn');

const router = express.Router();


router.get('/getbureturn', getBuReturn);
router.post('/addbureturn', addBuReturn);
router.delete('/deletebureturn/:_id', deleteBuReturn);
router.put('/updatebureturn', updateBuReturn);

module.exports = router;