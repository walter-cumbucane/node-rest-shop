const express  = require('express');
const router = express.Router();


const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const user = require('../models/user');


router.post('/signup', (req, res, next) => {
    
    User.findOne({ email: req.body.email })
    .exec()
    .then(doc => {
        if (doc) {
            return res.status(409).json({
                message: 'mail already exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10 , (err, hash) => {

                if (err) {
                    return res.status(500).json({
                        error: err
                    })
        
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
        
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                });
        
                }
                
            });
        }
    });
        
});


router.delete('/:userID', (req, res, next) => {
    User.deleteOne({ _id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err    
        })
    });
});


module.exports = router;