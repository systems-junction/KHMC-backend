const express = require('express');
const {
    getMargin,
    createMargin
} = require('../controllers/margin');

const router = express.Router();
router.get('/getmargin', getMargin)
router.post('/createmargin', createMargin);
module.exports = router;
