const express = require('express');
const {
    postSubscriber,
    getSubscriber,
} = require('../controllers/subscriber');
const router = express.Router();
router.get('/getsubscriber', getSubscriber);
router.post('/postsubscriber', postSubscriber);
module.exports = router;
