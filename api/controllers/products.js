const Product = require('../models/products');
const mongoose = require('mongoose');


exports.get_all = (req, res, next) => {
    Product.find().
        select('name price _id').
        exec().
        then(docs => {
            response = { 
                count: docs.length,
                products: docs.map(docs => {
                    return {
                        name: docs.name,
                        price: docs.price,
                        _id: docs._id,
                        request: {
                            method: "GET",
                            url: "http://localhost:3000/products/" + docs._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        }).
        catch(err => {
            res.status(500).json({
                error: err
            });
        });
} 

exports.create_product = (req, res, next) =>{

    // Gets the sent data from the request body
    /* const prod = {
        name: req.body.name, 
        price: req.body.price
    };
    */
    // To store the object, we create a new instance of the Product's model. And as the argument to the class, we pass the object to be stored
    const product = new Product({

        //creates a new object id to be assigned to the id property
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    //Save the object to the database
    product.save().then(result => {
        res.status(201).json({
            message: 'Data saved in the server', 
            createdProduct: {
                name: result.name,
                _id: result._id,
                price: result.price,
                request: {
                    method: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.get_by_id = (req, res, next) => {
    
    //Extracts the parameter from the URL
    const id = req.params.productID;

    //Get the product with the given id from the database
    Product.findById(id).
        select('name _id price').
        exec().
        then(doc => {
            if (doc) {
                response = {
                    product: doc,
                    request: {
                        method: 'GET',
                        description: 'GET ALL PRODUCTS',
                        url: 'http://localhost:3000/products'
                    }
                };
                res.status(200).json({response});
            } else {
                res.status(404).json({
                    message: 'No valid entry for provided ID'
                });
            }
            
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update = (req, res, next) => {
    
    //Extracts the parameter from the URL
    const id = req.params.productID;
    
    //To save in a new object the new values
    const newObj = req.body;
    
    //The first argument in the update method is the identifier, the second is the data to be modified
    Product.updateOne({
        _id: id
    }, 
    {
        $set: newObj
    }).exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                method: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });    
}

exports.delete = (req, res, next) => {
    
    //Extracts the parameter from the URL
    const id = req.params.productID;

    Product.deleteOne({_id: id}).
        exec().
        then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    method: 'POST',
                    url: 'http://localhost:3000/products',
                    data: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        }).
        catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}