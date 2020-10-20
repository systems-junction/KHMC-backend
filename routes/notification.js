const express = require('express');

const {
    getNotification
} = require('../controllers/notification');

const router = express.Router();

router.get('/getnotifications/:id', getNotification);

module.exports = router;
