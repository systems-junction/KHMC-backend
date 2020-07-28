const express = require('express');
const multer = require('multer');
const PATH = './uploads';
var storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, PATH) },
    filename: (req, file, cb) => { cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname) },
});
var upload = multer({ storage: storage });
const {
    getPatient,
    getPatientById,
    getPatientBySIN,
    getPatientByMRN,
    addPatient,
    deletePatient,
    updatePatient
} = require('../controllers/patient');

const router = express.Router();
router.get('/getpatientbyprofileno/:profileNo', getPatientByMRN);
router.get('/getpatientbysin/:SIN', getPatientBySIN);
router.get('/getpatient/:id', getPatientById);
router.get('/getpatient', getPatient);
router.post('/addpatient', upload.single('file'), addPatient);
router.delete('/deletepatient/:_id', deletePatient);
router.put('/updatepatient',upload.single('file'), updatePatient);

module.exports = router;
