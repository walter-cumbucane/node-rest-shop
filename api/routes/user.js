const express  = require('express');
const router = express.Router();


const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const jwt = require('jsonwebtoken');


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

router.post('/login', (req, res, next) => {

    User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }

        //Check if the received password is equal to the one stored in the database
        bcrypt.compare(req.body.password, user.password, (err, result) => {

            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }

            //The callback function returns true if the comparison was successful
            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    userID: user._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                )
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                });

            }

            res.status(401).json({
                message: 'Auth failed'
            });
        }); 
    })
    .catch()

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