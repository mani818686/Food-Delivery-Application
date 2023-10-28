const mongoose = require("mongoose");

const deliveryPersonInfoSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    fullName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    phoneNumber: {
        type: Number,
        match: /^([7-9][0-9]{9})$/g,
    },

})

module.exports = mongoose.model("DeliveryPersonInfo", deliveryPersonInfoSchema);