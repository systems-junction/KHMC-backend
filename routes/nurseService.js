const express = require('express');

const {
    getNurseService,
    addNurseService,
    deleteNurseService,
    updateNurseService,
    getSearchedNurse
} = require('../controllers/nurseService');

const router = express.Router();

router.get('/getnurseservice', getNurseService);
router.post('/addnurseservice', addNurseService);
router.delete('/deletenurseservice/:_id', deleteNurseService);
router.put('/updatenurseservice', updateNurseService);
router.get('/getsearchednurse/:keyword', getSearchedNurse);
module.exports = router;
