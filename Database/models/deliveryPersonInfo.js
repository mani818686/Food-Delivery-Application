const mongoose = require("mongoose");

const deliveryPersonInfoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    phoneNumber: {
        type: Number,
        match: /^([7-9][0-9]{9})$/g,
    },
    password:{ type: String, required: true },
    address: [{
        street: { type: String },
        city: { type: String },
        pincode: { type: String },
        state: { type: String },
        country: { type: String }
    }],
    orderId:[ { type: mongoose.Schema.Types.ObjectId, ref: "Order" }]

})

module.exports = mongoose.model("DeliveryDriver", deliveryPersonInfoSchema);