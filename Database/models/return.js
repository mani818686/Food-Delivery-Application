const mongoose = require("mongoose");

const Order = require("./order")

const returnSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    orderId : {type:mongoose.Schema.Types.ObjectID, ref:"Order"},
   date:{type:Date},
   reason:{type:String, required:true},
   status:{type:String},
   ispickupScheduled:{type:Boolean}
})

module.exports = mongoose.model("Return", returnSchema);