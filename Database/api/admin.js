const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const adminModel = require("../models/admin")
const checkAuthAdmin = require("../middleware/checkAuthAdmin")

const orderModel =  require("../models/order")
const paymentModel = require("../models/payment")
const customerModel = require("../models/customer")
const deliveryModel = require("../models/delivery")
const deliveryPersonModel = require("../models/deliveryPersonInfo")

router.post("/signup", (req, res) => {
    adminModel.find({ email: req.body.email })
        .then((admin)=>{

            if (admin.length >= 1) {
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
                        const admin = {
                            _id: new mongoose.Types.ObjectId(),
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            phoneNumber: req.body.phoneNumber,
                            address: req.body.address
                        };

                        var ti = new adminModel(admin);
                        ti.save()
                            .then((result)=>{
                                    res.status(201).json({
                                        message: "Admin created",
                                        userDetails: {
                                            userId: result._id,
                                            firstName:req.body.firstName,
                                            lastName:req.body.lastName,
                                            email: req.body.email,
                                            password: hash,
                                            phoneNumber: req.body.phoneNumber,
                                            address: req.body.address
                                        
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
    adminModel.find({email:req.body.email})
    .then((admin)=>{
        if (admin.length < 1) {
            return res.status(401).json({
                message: "Auth failed: Email not found probably",
            });
        }
        console.log(req.body, admin)
        bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed",
                });
            }
            if (result) {
                const token = jwt.sign({
                        userType:"Admin",
                        userId: admin[0]._id,
                        firstName:admin[0].firstName,
                        lastName:admin[0].lastName,
                        email: admin[0].email,
                        password: admin[0].password,
                        phoneNumber: admin[0].phoneNumber,
                        address: admin[0].address
                       
                    },
                    process.env.jwtSecret, {
                        expiresIn: "1d",
                    },
                );

                return res.status(200).json({
                    message: "Auth successful",
                    userDetails: {
                        userType:"Admin",
                        userId: admin[0]._id,
                        firstName:admin[0].firstName,
                        lastName:admin[0].lastName,
                        email: admin[0].email,
                        password: admin[0].password,
                        phoneNumber: admin[0].phoneNumber,
                        address: admin[0].address
                      
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

router.get('/orders',checkAuthAdmin, async (req, res) => {

    try {
        const orders = await orderModel.find({})
            .populate([{
                path: "Items.productId",
                model: "Product",
                populate: [
                    { path: "brandId", model: "Brand" },
                    { path: "categoryId", model: "Category" },
                ]
            },{
               path: "Items.variantId", model: "Variant" ,
            },{
                path:"paymentId",
                model:"Payment"
            },{
                path:"customerId",
                model:"Customer"
            }])

        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/cancelorder/:orderId',checkAuthAdmin, async (req, res) => {
    const orderId = req.params.orderId;

   try {
    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { orderStatus: req.body.status } },
      { new: true }
    );

    if (updatedOrder) {
        return res.status(200).json({ message: "order Cancelled" });
    } else {
        return res.status(500).json({ message: "order not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: err });
  }
});

router.post('/approve/:orderId/:deliverypersonId',checkAuthAdmin ,async (req, res) => {
    const orderId = req.params.orderId;
    const deliverypersonId = req.params.deliverypersonId
   try {

    const order = await orderModel.findOne({ _id: orderId })

    const today = new Date();
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(today.getDate() + 2);

    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = fiveDaysFromNow.toLocaleDateString(undefined, options);

    const delivery = new deliveryModel({
        _id: new mongoose.Types.ObjectId(),
        deliveryPersonId: deliverypersonId,
        type: "Express Delivery",
        address: order.address,
        expectedDeliverydate: formattedDate,
        status: "Ordered",
        customer:order.customerId
    });

    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { orderStatus: "Approved" } },
      { new: true }
    );
    
    await deliveryPersonModel.findByIdAndUpdate(deliverypersonId, {$push: { delivery:  delivery._id } })
    order.deliveryId = delivery._id
        await order.save();
      
        await delivery.save();


    if (updatedOrder) {
        return res.status(200).json({ message: "order updated" });
    } else {
        return res.status(500).json({ message: "order not found" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
});
router.post('/refund/:paymentId',checkAuthAdmin, async (req, res) => {
    const paymentId = req.params.paymentId;

   try {
    const updatedOrder = await paymentModel.findOneAndUpdate(
      { _id: paymentId },
      { $set: { status: "refunded" } },
      { new: true }
    );

    if (updatedOrder) {
        return res.status(200).json({ message: "order Cancelled" });
    } else {
        return res.status(500).json({ message: "order not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: err });
  }
});

module.exports = router