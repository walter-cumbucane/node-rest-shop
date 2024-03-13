const express  = require('express');
const router = express.Router();
const userController = require('../controllers/user');


//Routes Definition
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.delete('/:userID', userController.delete_user);


module.exports = router;