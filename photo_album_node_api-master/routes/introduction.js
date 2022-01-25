const express = require('express');
const router = express.Router();

const introductionController = require('../controllers/introductionController')

// http://localhost:3000/introduction/
router.get('/', introductionController.index );

module.exports = router;