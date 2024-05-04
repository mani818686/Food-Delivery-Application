const mongoose = require("mongoose");

const variantSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name:{ type: String, required: true },
    image: { type: String, required: false },
    price: { type: Number, required: true },
    description:{ type: String, required: false },
    Category:{type:mongoose.Schema.Types.ObjectID, ref:"Category"}
})

module.exports = mongoose.model("FoodItems", variantSchema);