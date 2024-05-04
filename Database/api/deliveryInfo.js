const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const deliveryPersonModel = require("../models/deliveryPersonInfo");
const orderModel = require("../models/order")
const CheckAuthDelivery = require("../middleware/CheckAuthDelivery");



router.post("/deliverysignup", (req, res) => {
    console.log("Request Body", req.body)
    deliveryPersonModel.find({ email: req.body.email })
        .then((deliveryPerson) => {
            console.log(deliveryPerson)
            if (deliveryPerson.length >= 1) {
                res.status(409).json({
                    message: "Email already exists",
                });
            } else {

                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                        });
                    } else {
                        const deliveryPerson = {
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            phoneNumber: req.body.phoneNumber,
                            address: {
                                "street": req.body.street,
                                "city": req.body.city,
                                "state": req.body.state,
                                "country": req.body.country,
                                "pincode": req.body.pincode
                            },
                        };

                        var ti = new deliveryPersonModel(deliveryPerson);
                        ti.save()
                            .then((result) => {
                                res.status(201).json({
                                    message: "delivery customer created",
                                    userDetails: {
                                        userId: result._id,
                                        firstName: req.body.firstName,
                                        lastName: req.body.lastName,
                                        email: req.body.email,
                                        password: hash,
                                        phoneNumber: req.body.phoneNumber,
                                        address: {
                                            "street": req.body.street,
                                            "city": req.body.city,
                                            "state": req.body.state,
                                            "country": req.body.country,
                                            "pincode": req.body.pincode
                                        },
                                    },
                                })
                            })
                            .catch((err) => {
                                console.error("Error during delivery person registration:",+err);
                                res.status(500).json({
                                    error: err,
                                })
                            })
                    }
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err.toString(),
            });
        })

})



router.post("/deliverylogin", (req, res) => {
    deliveryPersonModel.find({ email: req.body.email })
        .then((deliveryPerson) => {
            if (deliveryPerson.length < 1) {
                return res.status(401).json({
                    message: "Auth failed: Email not found probably",
                });
            }
            console.log(req.body, deliveryPerson)
            bcrypt.compare(req.body.password, deliveryPerson[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed",
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        userType: "deliveryPerson",
                        userId: deliveryPerson[0]._id,
                        firstName: deliveryPerson[0].firstName,
                        lastName: deliveryPerson[0].lastName,
                        email: deliveryPerson[0].email,
                        password: deliveryPerson[0].password,
                        phoneNumber: deliveryPerson[0].phoneNumber,
                    },
                        process.env.jwtSecret, {
                        expiresIn: "1d",
                    },
                    );

                    return res.status(200).json({
                        message: "Delivery Auth successful",
                        userDetails: {
                            userType: "deliveryPerson",
                            userId: deliveryPerson[0]._id,
                            firstName: deliveryPerson[0].firstName,
                            lastName: deliveryPerson[0].lastName,
                            email: deliveryPerson[0].email,
                            phoneNumber: deliveryPerson[0].phoneNumber,
                        },
                        token: token,
                    });
                }
                res.status(401).json({
                    message: "Auth failed1",
                });

            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        })

})
router.get("/all", async (req, res) => {
    try {
        const delivery = await deliveryPersonModel.find({})
        if (!delivery) {
            return res.status(404).json({ message: "deliveryperson Info not found" });
        }
        res.status(200).json({ delivery});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }}
)
router.get("/", CheckAuthDelivery, async (req, res) => {
    try {
        const delivery = await deliveryPersonModel.findById(req.user.userId)
        .populate({
            path:"orderId",
            model:"Order",
            populate: {
                path: 'customerId',
                model: 'Customer',
            }
        });

        if (!delivery) {
            return res.status(404).json({ message: "deliveryperson Info not found" });
        }

        res.status(200).json({ delivery});
       
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }}
)

router.post("/update/:orderId", CheckAuthDelivery, async (req, res) => {
    const deliveryId = req.params.orderId


    try {
      
        await orderModel.findByIdAndUpdate(deliveryId,{
            $set:{
                orderStatus:req.body.status
            }})
     
        res.status(200).json({ message:'updated'});
       
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }}
)


module.exports = router;