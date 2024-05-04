const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


const customerModel = require("../models/customer")
const orderModel = require("../models/order")
const paymentModel = require("../models/payment")
const foodItemModel = require("../models/FoodItems")
const deliveryPersonModel = require("../models/deliveryPersonInfo");
const checkAuthUser = require("../middleware/checkAuthUser");

router.get("/checkUser", checkAuthUser, async (req, res, next) => {

    customerModel.find({ _id: req.user.userId }).populate([
        {
            path: 'wishlist.productId',
            model: 'Product',
            populate: [
                { path: 'brandId', model: 'Brand' },
                { path: 'categoryId', model: 'Category' },
                { path: 'variantId', model: 'Variant' },
            ],
        },
        {
            path: 'orderHistory.OrderId',
            model: 'Order',
        },{
            path: 'wishlist.variantId',
            model: 'Variant', 
        }])
        .then((result) => {
            res.status(200).json({
                result,
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "Error " + error,
            });
        })

})


router.post("/signup", (req, res) => {
    console.log("Request Body", req.body)
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
                            DOB:req.body.DOB,
                            address: {
                                "street": req.body.street,
                                "city": req.body.city,
                                "state": req.body.state,
                                "country": req.body.country,
                                "pincode": req.body.pincode
                            },
                            wishlist:[],
                            orderHistory:[],
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
            path: 'wishlist.FoodItemId',
            model: 'FoodItems',
            // populate: [
            //     { path: 'Category', model: 'Category' },
            // ],
        },
        {
            path: 'orderHistory.OrderId',
            model: 'Order',
        },
        ])
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
                            wishlist: customer[0].wishlist,
                            orderHistory: customer[0].orderHistory
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
            console.log(err)
            res.status(500).json({
                error: err,
            });
        })

})


router.post("/createOrder", checkAuthUser, async (req, res) => {
    console.log(req.body,"Order")
    try {
        const payment = new paymentModel({
            _id: new mongoose.Types.ObjectId(),
            orderId: null,
            amount: req.body.price,
            paymentMethod: req.body.paymentMethod,
            cardNumber: req.body.cardNumber,
            securitycode:req.body.securitycode,
            cardName:req.body.cardName,
            expiryCode:req.body.expiryCode
        });

        await payment.save();

        const order = new orderModel({
            _id: new mongoose.Types.ObjectId(),
            price: req.body.price,
            customerId: req.user.userId,
            paymentId: payment._id,
            deliveryId: null,
            Items: req.body.items,
            address: req.body?.address,
            orderType:req.body.orderType
        });

        await order.save();
        payment.orderId = order._id;
        await payment.save();

        const customer = await customerModel.findById({ _id: req.user.userId });


        if (!customer) {
            return res.status(404).json({ message: 'Customer  not found' });
        }

        customer.wishlist = [];

        customer.orderHistory.push({ OrderId: order._id });
        await customer.save();
        const orderDetails  = await orderModel.findById(order._id).populate([{
            path: "Items.FoodItemId",
            model: "FoodItems",
            populate: [
                { path: "Category", model: "Category" },
            ]
        }])

        res.status(201).json({
            message: "Order created successfully",
            orderDetails: orderDetails,
            paymentDetails: payment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/add-address', checkAuthUser, async (req, res) => {

    try {

        const { street, city, pincode, state, country } = req.body;

        const customer = await customerModel.findById({ _id: req.user.userId });

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

router.post('/wishlist/add/:foodItemId', checkAuthUser, async (req, res) => {
    const customerId = req.user.userId;
    const foodItemId = req.params.foodItemId;

    try {
        // Check if the customer and product exist
        const customer = await customerModel.findById(customerId);
        const foodItem = await foodItemModel.findById(foodItemId);

        if (!customer || !foodItem) {
            return res.status(404).json({ message: 'Customer or Product not found' });
        }

        const existingWishlistItem = customer.wishlist.find(item => item.FoodItemId.equals(foodItem._id));

        if (existingWishlistItem) {
            existingWishlistItem.quantity += 1;
        } else {
            customer.wishlist.push({ FoodItemId: foodItem._id, quantity: 1 });
        }

        await customer.save();

        res.status(200).json({ message: 'Food Item added to wishlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/wishlist/delete/:foodItemId', checkAuthUser, async (req, res) => {
    const customerId = req.user.userId;
    const fooditemId = req.params.foodItemId;
    try {
        // Check if the customer and product exist
        const customer = await customerModel.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find the product in the wishlist
        const fooditem = customer.wishlist.find(item => item.FoodItemId.equals(fooditemId));

        if (fooditem) {
            // Decrease the quantity by 1
            fooditem.quantity -= 1;

            // If the quantity is now 0, remove the product from the wishlist
            if (fooditem.quantity === 0) {
                customer.wishlist = customer.wishlist.filter(item => !item.FoodItemId.equals(fooditemId) );
            }

            await customer.save();
            return res.status(200).json({ message: 'FoodItem removed from wishlist successfully' });
        } else {
            return res.status(404).json({ message: 'Food Item not found in the wishlist' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get("/lastOrder", checkAuthUser, async (req, res) => {
    try {
        const customer = await customerModel.findById(req.user.userId);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        if (customer.orderHistory.length === 0) {
            return res.status(404).json({ message: "No orders found for the customer" });
        }

        const lastOrderId = customer.orderHistory[customer.orderHistory.length - 1].OrderId;

        const populatedOrder = await orderModel
            .findById(lastOrderId._id)
            .populate([{
                path: "Items.FoodItemId",
                model: "FoodItems",
                populate: [
                    { path: "Category", model: "Category" },
                ]
            },{
                path:"paymentId",
                model:"Payment"
            }
            ])

        if (!populatedOrder) {
            return res.status(404).json({ message: "Last order not found" });
        }

        res.status(200).json({ orderDetails: populatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/order/:id", checkAuthUser, async (req, res) => {
    try {
        const customer = await customerModel.findById(req.user.userId);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        console.log(customer.orderHistory)
        const allOrders = await orderModel
            .find({ _id: req.params.id })
            .populate([{
                path: "Items.FoodItemId",
                model: "FoodItems",
                populate: [
                    { path: "Category", model: "Category" },
                ]
            }])
            .populate({ path: "paymentId", model: "Payment" });

        if (!allOrders) {
            return res.status(404).json({ message: "Orders not found" });
        }
        res.status(200).json({ message: "All orders retrieved successfully", orders: allOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/orders',checkAuthUser, async (req, res) => {

    try {
        const orders = await orderModel.find({ customerId: req.user.userId })
            .populate([{
                path: "Items.FoodItemId",
                model: "FoodItems",
                populate: [
                    { path: "Category", model: "Category" },
                ]
            }])

        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
