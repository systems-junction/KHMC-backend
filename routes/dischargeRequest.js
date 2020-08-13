const express = require('express');
const multer = require('multer');
const PATH = './uploads';
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
    getEDRdischarge,
    addDischargeRequest
} = require('../controllers/dischargeRequest');

const router = express.Router();
router.get('/getedrdischarge', getEDRdischarge);
router.post('/adddischarge', upload.single('file'), addDischargeRequest);
module.exports = router;
