const express = require('express');
const router = express.Router();

const apiversionController = require('../controllers/apiversionController')

// http://localhost:3000/apiversion/
router.get('/', apiversionController.index );

module.exports = router;