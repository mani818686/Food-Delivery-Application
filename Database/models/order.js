const mongoose = require("mongoose");

const Variant = require("./variant")
const Category = require("./category")
const Brand = require("./brand")
const Admin = require("./admin")
const Return = require("./return")
const Customer = require("./customer")
const Delivery = require("./delivery")
const Payment = require("./payment")
const Product = require("./product")

const orderSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    price: { type: Number, required: true },
    categoryId:{type:mongoose.Schema.Types.ObjectID, ref:"Category"},
    brandId:{type:mongoose.Schema.Types.ObjectID, ref:"Brand"},
    adminId:{type:mongoose.Schema.Types.ObjectID, ref:"Admin"},
    returnId:{type:mongoose.Schema.Types.ObjectID, ref:"Return"},
    customerId:{type:mongoose.Schema.Types.ObjectID, ref:"Customer"},
    deliveryId:{type:mongoose.Schema.Types.ObjectID, ref:"Delivery"},
    paymentId:{type:mongoose.Schema.Types.ObjectID, ref:"Payment"},
    Items:[{
        productId: {type:mongoose.Schema.Types.ObjectID, ref:"Product"},
        quantity:{type:Number,required:true},
        variantId:{type:mongoose.Schema.Types.ObjectID, ref:"Variant"},
    }
    ],
    date:{type:Date},
    isReturnRequested:{type:Boolean},
    orderStatus:{type:String}
})

module.exports = mongoose.model("Order", orderSchema);