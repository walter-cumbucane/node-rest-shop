#!/usr/bin/env node

const express = require('express');
const app = express();
const log = require('morgan');
const bodyParser = require('body-parser');

//Imports our database connection package
const mongoose = require('mongoose');

//We import the resources' routers
const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');
const userRouter = require('./api/routes/user');


//Sets a middleware. Every incoming request goes through a middleware
/* THis middleware was set to create a basic server
app.use((req, res, next) => {
  res.status(200).json({
    message: 'It works!'
  });
});
*/


//Connects with the database
mongoose.connect('mongodb+srv://walter:' + process.env.DB_PASS +'@node-rest-shop.qyzdaxm.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop'
);

// Sets a middleware for the logging stuff
app.use(log('dev'));

// Sets a middleware for parsing urlencoded and json data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handles CORS
app.use((req, res, next) => {
  // Which origins can make a request to this API. '*' for all
  res.header('Access-Control-Allow-Origin', '*');

  //Which headers will be sent back on the response
  res.header('Acess-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
  // Adds a header to the response in the case an OPTIONS request is sent
  if (req.method === "OPTIONS"){
    res.header('Access-Control-Allow-Methods', 'PUT, GET, DELETE, POST, PATCH');
    return res.status(200).json({});
  }
  next();
});

  
/* Sets a middleware that will redirect every request with the '/products' resource to the productRouter
*/
app.use('/api/v1/products', productRouter);

// Redirects requests to the orders file
app.use('/api/v1/orders', orderRouter);

// Redirects requests to the user file
app.use('/api/v1/user', userRouter);

//Let's add some error handling logic now
/* If a request gets past the last two middlewares, it means that we didn't set up an infrastructure
* to process it, so an error would be thrown. Let's correctly handle that error 
*/
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  //Passes the error to the next middleware
  next(err);
});

//Every error will be forwarded to this middleware
app.use((err, req, res, next) => {

  res.status(err.status || 500);
  res.json({
    error : {
      message: err.message
    }
  });

});

module.exports = app;