const express = require('express');

const {
    getNotification
} = require('../controllers/notification');

const router = express.Router();

router.get('/getnotifications', getNotification);

module.exports = router;
