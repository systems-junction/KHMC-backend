const express = require('express');
const multer = require('multer');
const PATH = './uploads/chats';
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});
var upload = multer({ storage: storage });

const {
    getChat,
    createChat,
    deleteChat,
    uploadChatFile
} = require('../controllers/chatRoom');

const router = express.Router();
router.get('/getchat', getChat);
router.post('/createchat', createChat);
router.post('/uploadchatfile',  upload.single('file'), uploadChatFile);
router.delete('/deletechat/:id', deleteChat);
module.exports = router;
