const express = require('express');
const {
    getChat,
    createChat,
    deleteChat
} = require('../controllers/chatRoom');

const router = express.Router();
router.get('/getchat', getChat);
router.post('/createchat', createChat);
router.delete('/deletechat/:id', deleteChat);
module.exports = router;
