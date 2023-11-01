const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


const customerModel = require("../models/customer")



router.post("/signup", (req, res) => {
    customerModel.find({ email: req.body.email })
        .then((customer)=>{

            if (customer.length >= 1) {
                res.status(409).json({
                    message: "Email already exists",
                });
            } else {

                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                        });
                    } else {
                        const customer = {
                            _id: new mongoose.Types.ObjectId(),
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            phoneNumber: req.body.phoneNumber,
                            address: req.body.address,
                            paymentId:[]
                        };

                        var ti = new customerModel(customer);
                        ti.save()
                            .then((result)=>{
                                    res.status(201).json({
                                        message: "customer created",
                                        userDetails: {
                                            userId: result._id,
                                            firstName:req.body.firstName,
                                            lastName:req.body.lastName,
                                            email: req.body.email,
                                            password: hash,
                                            phoneNumber: req.body.phoneNumber,
                                            address: req.body.address,
                                            paymentId:[]
                                        },
                                    })
                                })
                        .catch((err)=>{
                            res.status(500).json({
                                error: err,
                            })
                        })
                    }
                });
            }
        })
        .catch((err)=>{
            res.status(500).json({
                error: err.toString(),
            });
        })

    })



router.post("/login", (req, res) => {
    customerModel.find({email:req.body.email})
    .then((customer)=>{
        if (customer.length < 1) {
            return res.status(401).json({
                message: "Auth failed: Email not found probably",
            });
        }
        console.log(req.body, customer)
        bcrypt.compare(req.body.password, customer[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed",
                });
            }
            if (result) {
                const token = jwt.sign({
                        userType:"User",
                        userId: customer[0]._id,
                        firstName:customer[0].firstName,
                        lastName:customer[0].lastName,
                        email: customer[0].email,
                        password: customer[0].password,
                        phoneNumber: customer[0].phoneNumber,
                        address: customer[0].address,
                        paymentId:customer[0].paymentId
                    },
                    process.env.jwtSecret, {
                        expiresIn: "1d",
                    },
                );

                return res.status(200).json({
                    message: "Auth successful",
                    userDetails: {
                        userType:"User",
                        userId: customer[0]._id,
                        firstName:customer[0].firstName,
                        lastName:customer[0].lastName,
                        email: customer[0].email,
                        password: customer[0].password,
                        phoneNumber: customer[0].phoneNumber,
                        address: customer[0].address,
                        paymentId:customer[0].paymentId
                    },
                    token: token,
                });
            }
            res.status(401).json({
                message: "Auth failed1",
            });

        })
    })
    .catch((err)=>{
        res.status(500).json({
            error: err,
        });
    })

})


module.exports = router