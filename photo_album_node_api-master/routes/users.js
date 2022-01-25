const express = require('express');

const { body } = require('express-validator') //validation

const router = express.Router();

const passportJWT = require('../middleware/passportJWT')
const checkAdmin = require('../middleware/checkAdmin')

const userController = require('../controllers/userController')

/* GET users listing. */
// http://localhost:3000/user/
router.get('/', [passportJWT.isLogin, checkAdmin.isAdmin], userController.index );

// http://localhost:3000/user/login
router.post('/login', userController.login);

// http://localhost:3000/user/register
router.post('/register', [
    body('name').not().isEmpty().withMessage('Please enter your full name.'),
    body('email').not().isEmpty().withMessage('Please enter your email.').isEmail().withMessage('The email format is invalid.'),
    body('password').not().isEmpty().withMessage('Please enter password.').isLength({min: 8}).withMessage('A password of at least 8 characters.'),
], userController.register);

// http://localhost:3000/user/me
router.get('/me', [passportJWT.isLogin], userController.me );

module.exports = router;
