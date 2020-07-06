const express = require('express');
const {
  getAccessLevel,
  addAccessLevel,
  deleteAccessLevel,
  updateAccessLevel,
  testnot
} = require('../controllers/accessLevel');
const router = express.Router();
router.get('/getaccesslevel', getAccessLevel);
router.post('/addaccesslevel', addAccessLevel);
router.delete('/deleteaccesslevel/:_id', deleteAccessLevel);
router.put('/updateaccesslevel', updateAccessLevel);
router.post('/testnot',testnot)
module.exports = router;
