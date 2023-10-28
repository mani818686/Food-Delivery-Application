const mongoose = require("mongoose");

const variantSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    size:{ type: String, required: true },
    color: { type: String, required: true },
    
})

module.exports = mongoose.model("Variant", variantSchema);