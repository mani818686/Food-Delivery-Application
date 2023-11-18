const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


const customerModel = require("../models/customer")
const orderModel = require("../models/order")
const deliveryModel = require("../models/delivery")
const paymentModel = require("../models/payment")
const deliveryPersonModel = require("../models/deliveryPersonInfo")

const customerId = "653d9dff444cb8cda40581b7";


router.post("/signup", (req, res) => {
    customerModel.find({ email: req.body.email })
        .then((customer) => {

            if (customer.length >= 1) {
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
                        const customer = {
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            phoneNumber: req.body.phoneNumber,
                            address: req.body.address,
                            paymentId: []
                        };

                        var ti = new customerModel(customer);
                        ti.save()
                            .then((result) => {
                                res.status(201).json({
                                    message: "customer created",
                                    userDetails: {
                                        userId: result._id,
                                        firstName: req.body.firstName,
                                        lastName: req.body.lastName,
                                        email: req.body.email,
                                        password: hash,
                                        phoneNumber: req.body.phoneNumber,
                                        address: req.body.address,
                                        paymentId: []
                                    },
                                })
                            })
                            .catch((err) => {
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



router.post("/login", (req, res) => {
    customerModel.find({ email: req.body.email })
        .then((customer) => {
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
                        userType: "User",
                        userId: customer[0]._id,
                        firstName: customer[0].firstName,
                        lastName: customer[0].lastName,
                        email: customer[0].email,
                        password: customer[0].password,
                        phoneNumber: customer[0].phoneNumber,
                        address: customer[0].address,
                        paymentId: customer[0].paymentId
                    },
                        process.env.jwtSecret, {
                        expiresIn: "1d",
                    },
                    );

                    return res.status(200).json({
                        message: "Auth successful",
                        userDetails: {
                            userType: "User",
                            userId: customer[0]._id,
                            firstName: customer[0].firstName,
                            lastName: customer[0].lastName,
                            email: customer[0].email,
                            password: customer[0].password,
                            phoneNumber: customer[0].phoneNumber,
                            address: customer[0].address,
                            paymentId: customer[0].paymentId
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

router.post("/createOrder", async (req, res) => {
    try {
        const payment = new paymentModel({
            _id: new mongoose.Types.ObjectId(),
            orderId:null,
            amount: req.body.price,
            paymentMethod: req.body.paymentMethod,
            paymentDetails: req.body.paymentDetails,
        });

         await payment.save();

        const order = new orderModel({
            _id: new mongoose.Types.ObjectId(),
            price:req.body.price,
            customerId:customerId,
            paymentId: payment._id,
            deliveryId:null,
            Items:req.body.items,
            address:req.body.address
        });

        await order.save();
        payment.orderId = order._id;
        await payment.save();

        const closestDeliveryPerson = await deliveryPersonModel
            .findOne()
            .sort({
                $abs: {
                    $subtract: [
                        { $toDecimal: "$address.pincode" },  
                        { $toDecimal: req.body.address.pincode }  
                    ]
                }
            });

            const delivery = new deliveryModel({
                _id: new mongoose.Types.ObjectId(),
                deliveryPersonId: closestDeliveryPerson._id,
                type: type,
                address: address,
                expectedDeliverydate: expectedDeliveryDate,
                status: "Ordered"
            });
            
            // Save the delivery entry
            await delivery.save();

        res.status(201).json({
            message: "Order created successfully",
            orderDetails: order,
            paymentDetails:payment,
            deliveryDetails:delivery,
            deliverypersonInfo : closestDeliveryPerson
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/add-address', async (req, res) => {
    try {
        
        const { street, city, pincode, state, country } = req.body;

        const customer = await customerModel.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        customer.address.push({ street, city, pincode, state, country });

        const updatedCustomer = await customer.save();

        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router