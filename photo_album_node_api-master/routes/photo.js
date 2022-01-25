const express = require('express');
const router = express.Router();

const photoController = require('../controllers/photoController')




// http://localhost:3000/photo/
router.post('/', photoController.insert);

// http://localhost:3000/photo/
router.delete('/:id', photoController.destroy);

module.exports = router;