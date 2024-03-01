#!/usr/bin/env node

const express = require('express');

//Creates a Router for the '/orders' resource
const router = express.Router();

//Imports the orders Schema
const Order = require('../models/orders');
const mongoose = require('mongoose');
const Product = require('../models/products');

//Let's create a route that handles GET requests
router.get('/', (req, res, next) => {
    
    Order.find()
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


//Let's create a route that handles POST requests
router.post('/', (req, res, next) => {

    // Parses the received data from the request body
    const quantity = req.body.quantity;
    const id = req.body.productID;

    Product.findById(id).
    then( product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        //Creates the new instance that will be added to the database
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: quantity,
            productID: id
        });    
        return order.save();
    }).
    then(result => {
        res.status(201).json({
            message: 'Data Saved in the Server',
            createdObject: result
        });
    }).
    catch(err => {
        res.status(500).json({
            error: err
        });
    });
    
});

//Let's create routes that handles GET and DELETE requests containing orderId
router.get('/:orderID', (req, res, next) => {
    
    //Extracting the parameter from the url
    const id = req.params.orderID;

    //Extracts the object with the given ID
    Order.findOne({_id: id})
    .exec()
    .then(result => {
        console.log(result);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: 'No entry founded for the provided ID'
            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.delete('/:orderID', (req, res, next) => {
    
    //Extracting the parameter from the url
    const id = req.params.orderID;

    //Deleting the entry from the database
    Order.deleteOne({_id: id })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;