const mongoose = require("mongoose");

const DeliveryPerson = require("./deliveryPersonInfo")

const deliverySchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    deliveryPersonId: { type: mongoose.Schema.Types.ObjectID, ref: "DeliveryPerson" },
    type: { type: String, required: true },
    address: {
        Street: { type: String },
        City: { type: String },
        pincode: { type: Number },
        state: { type: String },
        country: { type: String }
    },
    expectedDeliverydate: { type: Date },
    status:{type:String}
})

module.exports = mongoose.model("Delivery", deliverySchema);