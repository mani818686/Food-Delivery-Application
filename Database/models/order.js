const mongoose = require("mongoose");

const Category = require("./category")
const Admin = require("./admin")
const Customer = require("./customer")
const Payment = require("./payment")

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    price: { type: Number, required: true },
    customerId:{type:mongoose.Schema.Types.ObjectID, ref:"Customer"},
    paymentId:{type:mongoose.Schema.Types.ObjectID, ref:"Payment"},
    Items:[{
        FoodItemId: {type:mongoose.Schema.Types.ObjectID, ref:"FoodItems"},
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
    orderStatus:{type:String,default:"Ordered"},
    orderType:{type:String}
})

module.exports = mongoose.model("Order", orderSchema);