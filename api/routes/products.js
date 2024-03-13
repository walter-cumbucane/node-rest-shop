#!/usr/bin/env node
const express = require('express');

//IMports the express router
const router = express.Router();


//It is used to allow file upload features
const multer = require('multer');

//A middleware that handles route protection
const checkAuth = require('../middleware/check-auth');

//Imports the productss controller
const productsControllers = require('../controllers/products');

//Let's create a GET route for this resource
/* In the app.js file, we guarranted that only requests with '/products' will come to this router,
* we don't have to include the '/products' again in the path   jfjf
*/
router.get('/', productsControllers.get_all);

//Handles POST requests for the '/products' resource
router.post('/', checkAuth, productsControllers.create_product);

//Let's create a route that handles GET requests containing productId
router.get('/:productID', productsControllers.get_by_id);

//Let's add PATCH and DELETE request options to the last route
router.patch('/:productID', checkAuth, productsControllers.update);
router.delete('/:productID', checkAuth, productsControllers.delete);


module.exports = router;