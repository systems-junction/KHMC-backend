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
getPatientDischarged,
getEDRorIPR,
addClaims,
updateClaims
} = require('../controllers/reimbursementClaim');

const router = express.Router();
router.get('/getclaim', getClaims);
router.get('/getpatient/:id/:keyword', getPatient);
router.get('/getpatientdischarge/:id/:keyword', getPatientDischarged);
router.get('/getedripr/:_id', getEDRorIPR);
router.post('/addclaim', upload.array('file'), addClaims);
router.put('/updateclaim', upload.single('file'), updateClaims);

module.exports = router;
