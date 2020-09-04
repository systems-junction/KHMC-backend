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
  getIPR,
  getDischargeIPR,
  getDischargeIPRById,
  putDischargeIPRById,
  getPHRIPR,
  getPHRIPRById,
  putPHRIPRById,
  getLRIPR,
  getLRIPRById,
  putLRIPRById,
  getRRIPR,
  getRRIPRById,
  putRRIPRById,
  getIPRById,
  addIPR,
  deleteIPR,
  updateIPR,
  addFollowUp,
  getRRPatient,
  getRRPatientById,
  getRRById,
  getLRPatient,
  getLRById,
  getPHRPatient,
  getPHRById,
  putRRById,
  putLRById,
} = require('../controllers/IPR');

const router = express.Router();
router.get('/getipr/:_id', getIPRById);
router.get('/getipr', getIPR);
router.get('/getdischargeipr', getDischargeIPR);
router.get('/getdischargeipr/:_id', getDischargeIPRById);
router.put('/updatedischarge', putDischargeIPRById);
router.get('/getphripr', getPHRIPR);
router.get('/getphripr/:_id', getPHRIPRById);
router.put('/updatephr', putPHRIPRById);
router.get('/getlripr', getLRIPR);
router.get('/getlripr/:_id', getLRIPRById);
router.put('/updatelab', upload.single('file'), putLRIPRById);
router.get('/getrripr', getRRIPR);
router.get('/getrripr/:_id', getRRIPRById);
router.put('/updaterad', upload.single('file'), putRRIPRById);
router.post('/addipr', addIPR);
router.delete('/deleteipr/:_id', deleteIPR);
router.put('/updateipr', updateIPR);
router.put('/addfollowup', upload.single('file'), addFollowUp);
router.get('/getrrpatient', getRRPatient);
router.get('/getrrpatientbyid/:_id', getRRPatientById);
router.get('/getrrbyid/:_id', getRRById);
router.put('/updaterr', upload.single('file'), putRRById);
router.get('/getlrpatient', getLRPatient);
router.get('/getlrbyid/:_id', getLRById);
router.put('/updatelr', upload.single('file'), putLRById);
router.get('/getphrpatient', getPHRPatient);
router.get('/getphrbyid/:_id', getPHRById);
module.exports = router;
