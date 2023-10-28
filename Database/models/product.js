const mongoose = require("mongoose");

const Variant = require("./variant")
const Category = require("./category")
const Brand = require("./brand")
const Admin = require("./admin")

const productSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    variantId:{type:mongoose.Schema.Types.ObjectID, ref:"Variant"},
    categoryId:{type:mongoose.Schema.Types.ObjectID, ref:"Category"},
    brandId:{type:mongoose.Schema.Types.ObjectID, ref:"Brand"},
    adminId:{type:mongoose.Schema.Types.ObjectID, ref:"Admin"},
    
})

module.exports = mongoose.model("Product", productSchema);