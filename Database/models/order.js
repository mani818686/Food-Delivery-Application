const mongoose = require("mongoose");

const Variant = require("./variant")
const Category = require("./category")
const Brand = require("./brand")
const Admin = require("./admin")
const Customer = require("./customer")
const Delivery = require("./delivery")
const Payment = require("./payment")
const Product = require("./product")

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    price: { type: Number, required: true },
    customerId:{type:mongoose.Schema.Types.ObjectID, ref:"Customer"},
    deliveryId:{type:mongoose.Schema.Types.ObjectID, ref:"Delivery"},
    paymentId:{type:mongoose.Schema.Types.ObjectID, ref:"Payment"},
    Items:[{
        productId: {type:mongoose.Schema.Types.ObjectID, ref:"Product"},
        quantity:{type:Number,required:true,default:1},
    }
    ],
    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: String },
        state: { type: String },
        country: { type: String }
    },
    date:{type:Date,default:new Date()},
    orderStatus:{type:String,default:"Ordered"}
})

module.exports = mongoose.model("Order", orderSchema);