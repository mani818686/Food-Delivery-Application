const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


const customerModel = require("../models/customer")
const orderModel = require("../models/order")
const deliveryModel = require("../models/delivery")
const paymentModel = require("../models/payment")
const deliveryPersonModel = require("../models/deliveryPersonInfo");
const productModel = require("../models/product")
const checkAuthUser = require("../middleware/checkAuthUser");


router.get("/checkUser", checkAuthUser, async(req, res, next) => {

    customerModel.find({_id:req.user.userId})
    .then((result)=>{
        res.status(200).json({
            result,
        });
    })
    .catch((error)=>{
        res.status(400).json({
            message: "Error "+error,
        });
    })
     
    })

router.post("/signup", (req, res) => {
    console.log("Request Body",req.body)
    customerModel.find({ email: req.body.email })
        .then((customer) => {
            console.log(customer)
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
                            address: {
                                "street": req.body.street,
                                "city": req.body.city,
                                "state": req.body.state,
                                "country": req.body.country,
                                "pincode": req.body.pincode
                            },
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
                                        address: {
                                            "street": req.body.street,
                                            "city": req.body.city,
                                            "state": req.body.state,
                                            "country": req.body.country,
                                            "pincode": req.body.pincode
                                        },
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
    customerModel.find({ email: req.body.email }).populate([
        {
        path: 'wishlist.productId',
        model: 'Product'
      },
      {
        path: 'orderHistory.OrderId',
        model: 'Order',
        populate: {
          path: 'Items.products.productId',
          model: 'Product'
        },
      }])
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
                        paymentId: customer[0].paymentId,
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
                            phoneNumber: customer[0].phoneNumber,
                            address: customer[0].address,
                            paymentId: customer[0].paymentId,
                            wishlist:customer[0].wishlist,
                            orderHistory:customer[0].orderHistory

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

router.post("/createOrder",checkAuthUser, async (req, res) => {
    console.log(req.body)
    try {
        const payment = new paymentModel({
            _id: new mongoose.Types.ObjectId(),
            orderId: null,
            amount: req.body.price,
            paymentMethod: req.body.paymentMethod,
            paymentDetails: req.body.paymentDetails,
        });

        await payment.save();

        const order = new orderModel({
            _id: new mongoose.Types.ObjectId(),
            price: req.body.price,
            customerId: req.user.userId,
            paymentId: payment._id,
            deliveryId: null,
            Items: req.body.items,
            address: req.body.address
        });

        await order.save();
        payment.orderId = order._id;
        await payment.save();

        const customer = await customerModel.findById({_id:req.user.userId});


      if (!customer) {
        return res.status(404).json({ message: 'Customer or Product not found' });
      }
      
        customer.orderHistory.push({ OrderId: order._id });
        await customer.save();
        const closestDeliveryPerson = await deliveryPersonModel.aggregate([
            {
              $addFields: {
                pincodeDifference: {
                  $abs: {
                    $subtract: [
                      { $toDecimal: "$address.pincode" },
                      { $toDecimal: req.body.address?.pincode }
                    ]
                  }
                }
              }
            },
            {
              $sort: { pincodeDifference: 1 }
            },
            {
              $limit: 1
            }
          ]);

        const delivery = new deliveryModel({
            _id: new mongoose.Types.ObjectId(),
            deliveryPersonId: closestDeliveryPerson._id,
            type: req.body.type,
            address: req.body.address,
            expectedDeliverydate: req.body.expectedDeliveryDate,
            status: "Ordered"
        });

        order.deliveryId = delivery._id
        await order.save();
        // Save the delivery entry
        await delivery.save();

        res.status(201).json({
            message: "Order created successfully",
            orderDetails: order,
            orderItems:req.body.items,
            paymentDetails: payment,
            deliveryDetails: delivery,
            deliverypersonInfo: closestDeliveryPerson
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/add-address',checkAuthUser, async (req, res) => {

    try {

        const { street, city, pincode, state, country } = req.body;

        const customer = await customerModel.findById({_id:req.user.userId});

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

router.patch('/wishlist/add/:id', async (req, res) => {
    const customerId =  "65598eb04da5c205448d67f0"|| req.user.userId;
    const productId = req.params.id; 
  
    try {
      // Check if the customer and product exist
      const customer = await customerModel.findById(customerId);
      const product = await productModel.findById(productId);
  
      if (!customer || !product) {
        return res.status(404).json({ message: 'Customer or Product not found' });
      }
      
      const existingWishlistItem = customer.wishlist.find(item => item.productId.equals(product._id));

      if (existingWishlistItem) {
        existingWishlistItem.quantity += 1;
      } else {
        customer.wishlist.push({ productId: product._id, quantity: 1 });
      }
    
      await customer.save();
  
      res.status(200).json({ message: 'Product added to wishlist successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


module.exports = router