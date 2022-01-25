const express = require('express');
const router = express.Router();

const albumphotoController = require('../controllers/albumphotoController')

// http://localhost:3000/albumphoto/
router.get('/', albumphotoController.index);

// http://localhost:3000/albumphoto/photo
router.get('/photo', albumphotoController.photo);

// http://localhost:3000/albumphoto/:id
router.get('/:id', albumphotoController.getAlbumWithPhoto);

// http://localhost:3000/albumphoto/
router.post('/', albumphotoController.insert);

// http://localhost:3000/albumphoto/:id
router.delete('/:id', albumphotoController.destroy);

// http://localhost:3000/albumphoto/:id
router.put('/:id', albumphotoController.update);

module.exports = router;