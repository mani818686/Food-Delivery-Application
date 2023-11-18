const mongoose = require("mongoose");

const Payment= require("./payment")

const customerSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: { type: String },

    phoneNumber: {
        type: Number,
        match:/^\+\d{1,3}\s?\d{10}$/g

    },
    address: [{
        street: { type: String },
        city: { type: String },
        pincode: { type: String },
        state: { type: String },
        country: { type: String }
    }],
    paymentId:[{type:mongoose.Schema.Types.ObjectID, ref:"Payment"}],
})

module.exports = mongoose.model("Customer", customerSchema);