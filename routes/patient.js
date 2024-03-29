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
const audioPath = './uploads/consultation';
var audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});
var audioUpload = multer({ storage: audioStorage });
const {
  getPatient,
  getPatientActive,
  getPatientHistoryPre,
  getPatientHistory,
  getPatientEDR,
  getPatientIPR,
  getPatientById,
  getPatientBySIN,
  getPatientByMRN,
  getPaitentKeyword,
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
  discharge,
  addNote,
  getNote,
  qrGenerator,
  triageStatus,
  createView,
  getPatientIHISearch,
  postPatientIHI
} = require('../controllers/patient');

const router = express.Router();
router.get('/getpatient', getPatient);
router.get('/getpatientactive', getPatientActive);
router.get('/getpatienthistorypre/:id', getPatientHistoryPre);
router.get('/getpatienthistory/:id/:requestType', getPatientHistory);
router.get('/getpatientall/:keyword', getPaitentKeyword);
router.get('/getpatientedr', getPatientEDR);
router.get('/getpatientipr', getPatientIPR);
router.put('/updateEdrIpr', updateEdrIpr);
router.put('/updateEdrIprItem', audioUpload.single('file'), updateEdrIprItem);
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
router.post('/test', audioUpload.single('file'), addNote);
router.get('/test2', getNote);
router.get('/getqrofpatient/:id', qrGenerator);
router.put('/triagestatus/:id', triageStatus);
router.get('/testView',createView)
router.get('/getpatientihi/:keyword',getPatientIHISearch)
router.post('/postpatientihi',postPatientIHI)
module.exports = router;
