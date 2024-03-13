const express  = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth')


//Routes Definition
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.delete('/:userID', checkAuth, userController.delete_user);


module.exports = router;