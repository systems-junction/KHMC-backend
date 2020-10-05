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
  getOPRAll,
  getOPRFromLab,
  getOPRFromLabKeyword,
  getOPRFromPharmacy,
  getOPRFromPharmacyKeyword,
  getOPRFromRadiology,
  getOPRFromRadiologyKeyword,
  getOPRById,
  addOPR,
  deleteOPR,
  updateOPR,
  putLROPRById,
  putRROPRById,
  putPHROPRById,
  getRROPRById,
  getLROPRById,
  getPHROPRById,
} = require('../controllers/OPR');

const router = express.Router();
router.get('/getoprall', getOPRAll);
router.get('/getoprfromlab', getOPRFromLab);
router.get('/getoprfromlab/:keyword', getOPRFromLabKeyword);
router.get('/getoprfrompharmacy', getOPRFromPharmacy);
router.get('/getoprfrompharmacy/:keyword', getOPRFromPharmacyKeyword);
router.get('/getoprfromradiology', getOPRFromRadiology);
router.get('/getoprfromradiology/:keyword', getOPRFromRadiologyKeyword);
router.get('/getopr/:_id', getOPRById);
router.post('/addopr', addOPR);
router.delete('/deleteopr/:_id', deleteOPR);
router.put('/updateopr', updateOPR);
router.put('/updatelab', upload.single('file'), putLROPRById);
router.put('/updaterad', upload.single('file'), putRROPRById);
router.put('/updatephr', putPHROPRById);
router.get('/getrroprbyid/:_id', getRROPRById);
router.get('/getlroprbyid/:_id', getLROPRById);
router.get('/getphroprbyid/:_id', getPHROPRById);

module.exports = router;
