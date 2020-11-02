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
getClaimsKeyword,
getPatient,
getPatientInsurance,
getPatientDischarged,
getEDRorIPR,
addClaims,
updateClaims,
getPatientHistoryAll
} = require('../controllers/reimbursementClaim');

const router = express.Router();
router.get('/getclaim', getClaims);
router.get('/getclaim/:keyword', getClaimsKeyword);
router.get('/getpatient/:id/:keyword', getPatient);
router.get('/getpatientinsurance/:id/:keyword', getPatientInsurance);
router.get('/getpatientdischarge/:id/:keyword', getPatientDischarged);
router.get('/getpatienthistory/:keyword', getPatientHistoryAll);
router.get('/getedripr/:_id', getEDRorIPR);
router.post('/addclaim', upload.array('file'), addClaims);
router.put('/updateclaim', upload.array('file'), updateClaims);

module.exports = router;
