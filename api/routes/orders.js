#!/usr/bin/env node

const express = require('express');

//Creates a Router for the '/orders' resource
const router = express.Router();

//Imports the token validation middleware
const checkAuth = require('../middleware/check-auth');

//Imports the orders controller
const ordersController = require('../controllers/orders');



//Let's create a route that handles GET requests
router.get('/', checkAuth, ordersController.get_all);

//Let's create a route that handles POST requests
router.post('/', checkAuth, ordersController.create_order);

//Let's create routes that handles GET and DELETE requests containing orderId
router.get('/:orderID', checkAuth, ordersController.get_by_id);
router.delete('/:orderID', checkAuth, );


module.exports = router;