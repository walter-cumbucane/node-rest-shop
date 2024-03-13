const Order = require('../models/orders');
const mongoose = require('mongoose');
const Product = require('../models/products');


exports.get_all = (req, res, next) => {
    
    Order.find()
    .populate('product', 'name')
    .exec()
    .then(docs => {
        response = {
            count: docs.length,
            orders: docs.map(doc => { 
                return {
                    product: doc.product,
                    _id: doc._id,
                    request: {
                        method: "GET",
                        url: "http://localhost:3000/orders/" + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.get_by_id = (req, res, next) => {
    
    //Extracting the parameter from the url
    const id = req.params.orderID;

    //Extracts the object with the given ID
    Order.findOne({_id: id})
    .populate('product', 'name price')
    .exec()
    .then(doc => {
        if (doc) {
            response = {
                product: doc,
                _id: id,
                request: {
                    method: 'GET',
                        description: 'GET ALL PRODUCTS',
                        url: 'http://localhost:3000/orders'
                }
            };
            res.status(200).json(response);
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
};

exports.delete = (req, res, next) => {
    
    //Extracting the parameter from the url
    const id = req.params.orderID;

    //Deleting the entry from the database
    Order.deleteOne({_id: id })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.create_order = (req, res, next) => {

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
};