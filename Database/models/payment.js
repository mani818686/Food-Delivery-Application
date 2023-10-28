const mongoose = require("mongoose");

const Order = require("./order")

const paymentSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    orderId : {type:mongoose.Schema.Types.ObjectID, ref:"Order"},
   date:{type:Date, default: Date.now},
   amount:{type:Number,required:true},
   paymentMethod:{type:String, required:true},
    
})

module.exports = mongoose.model("Payment", paymentSchema);