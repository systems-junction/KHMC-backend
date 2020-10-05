const express = require('express');
const { validateParams } = require('../middleware/validator');
const {
  register,
  login,
  logout
} = require('../controllers/auth');

const router = express.Router();

// const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', validateParams([
  {
      param_key: 'email',
      required: true,
      type: 'string',
      validator_functions: [(param) => {return param.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)}]
  },
  {
      param_key: 'password',
      required: true,
      type: 'string',
      validator_functions: [(param) => {return param.length === 6}]
  }
]), login);
router.get('/logout', logout);

module.exports = router;
