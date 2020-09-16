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
  getPatient,
  getPatientEDR,
  getPatientIPR,
  getPatientById,
  getPatientBySIN,
  getPatientByMRN,
  getPaitentAll,
  addPatient,
  deletePatient,
  updatePatient,
  addPatientFHIR,
  updatePatientFHIR,
  searchPatient,
  updateEdrIpr,
  updateEdrIprItem,
  triage,
  pharmacy,
  lab,
  rad,
  consultation,
  discharge
} = require('../controllers/patient');

const router = express.Router();
router.get('/getpatient', getPatient);
router.get('/getpatientall/:keyword', getPaitentAll);
router.get('/getpatientedr', getPatientEDR);
router.get('/getpatientipr', getPatientIPR);
router.put('/updateEdrIpr', updateEdrIpr);
router.put('/updateEdrIprItem', updateEdrIprItem);
router.get('/getpatientbyprofileno/:profileNo', getPatientByMRN);
router.get('/getpatientbysin/:SIN', getPatientBySIN);
router.get('/getpatient/:id', getPatientById);
router.post('/addpatient', upload.single('file'), addPatient);
router.post('/addpatientfhir', addPatientFHIR);
router.put('/updatepatientfhir', updatePatientFHIR);
router.delete('/deletepatient/:_id', deletePatient);
router.put('/updatepatient', upload.single('file'), updatePatient);
router.get('/searchpatient/:_id', searchPatient);
router.get('/triage/:id', triage);
router.get('/pharmacy/:id', pharmacy);
router.get('/lab/:id', lab);
router.get('/rad/:id', rad);
router.get('/consultation/:id', consultation);
router.get('/discharge/:id', discharge);
module.exports = router;
