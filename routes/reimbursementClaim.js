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
getClaims,
getPatient,
getEDRorIPR,
addClaims,
updateClaims
} = require('../controllers/reimbursementClaim');

const router = express.Router();
router.get('/getclaim', getClaims);
router.get('/getpatient/:keyword', getPatient);
router.get('/getedripr/:_id', getEDRorIPR);
router.post('/addclaim', upload.single('file'), addClaims);
router.put('/updateclaim', upload.single('file'), updateClaims);

module.exports = router;
