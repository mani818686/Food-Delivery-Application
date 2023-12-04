const mongoose = require("mongoose");

const DeliveryPersonInfo = require("./deliveryPersonInfo")

const deliverySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    deliveryPersonId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPersonInfo" },
    type: { type: String, required: true },
    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: Number },
        state: { type: String },
        country: { type: String }
    },
    expectedDeliverydate: { type: Date },
    status:{type:String},
    customer:{type:mongoose.Schema.Types.ObjectID, ref:"Customer"}
})

module.exports = mongoose.model("Delivery", deliverySchema);