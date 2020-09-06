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
  getOPRFromPharmacy,
  getOPRFromRadiology,
  getOPRById,
  addOPR,
  deleteOPR,
  updateOPR,
  putLROPRById,
  putRROPRById,
  getRROPRById,
} = require('../controllers/OPR');

const router = express.Router();
router.get('/getoprall', getOPRAll);
router.get('/getoprfromlab', getOPRFromLab);
router.get('/getoprfrompharmacy', getOPRFromPharmacy);
router.get('/getoprfromradiology', getOPRFromRadiology);
router.get('/getopr/:_id', getOPRById);
router.post('/addopr', addOPR);
router.delete('/deleteopr/:_id', deleteOPR);
router.put('/updateopr', updateOPR);
router.put('/updatelab', upload.single('file'), putLROPRById);
router.put('/updaterad', upload.single('file'), putRROPRById);
router.get('/getrroprbyid/:_id', getRROPRById);

module.exports = router;
