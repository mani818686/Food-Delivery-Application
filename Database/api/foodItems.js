const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const categoryModel = require("../models/category");
const foodItemsModel = require("../models/FoodItems")
const checkAuthAdmin = require("../middleware/checkAuthAdmin");

router.get('/category', async (req, res) => {
  try {
      const categories = await categoryModel.find({})
      .populate('foodItems')
      res.status(200).json({ categories });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post("/addCategory", async (req, res) => {
  try {

    const newProduct = new categoryModel({
      _id: new mongoose.Types.ObjectId(),
      categoryName: req.body.name,
      foodItems:[]
    });
    await newProduct.save();
    console.log(newProduct)
    res.status(200).json({
      message: "Category created successfully",
      product: newProduct,
    });
  }
  catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/add/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const newProduct = new foodItemsModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.body?.image,
      description: req.body.description,
      price: req.body.price,
      Category: categoryId,
     
    });
    console.log(newProduct);
    await newProduct.save();

    await categoryModel.findByIdAndUpdate(categoryId,
      { $push: { foodItems:  newProduct._id } },
      { new: true, useFindAndModify: false })

    res.status(200).json({
      message: "FoodItem created successfully",
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get('/products', async (req, res) => {
  console.log(req.query)
    try {
      const filters = {}; // Initialize an empty filter object
        console.log(req.query)
      // Check if the request includes filters for size, color, categoryName, or brandName



      if (req.query.categoryName) {
        const category = await categoryModel.findOne({ categoryName: req.query.categoryName });
        console.log("Category",category)
        if (category) {
          filters['categoryId'] = category._id;
        }
      }

      console.log("filters----",filters)

      const products = await foodItemsModel.find(filters)
      .populate("Category")
      .exec();
      res.status(200).json({ products });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find all products that belong to the specified adminId
    const products = await foodItemsModel
      .find({ _id: productId })
      .populate("Category")

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/updatePrice/:productId', async (req, res) => {
  console.log(req.body)
  try {
    const productId = req.params.productId;
    const newPrice = req.body.price;
    console.log(productId,newPrice)
    const product = await foodItemsModel.findById(productId).populate('Category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }


    await foodItemsModel.findByIdAndUpdate(product._id,{
      $set:{
        price:newPrice
      }
    })

    res.status(200).json({ message: 'price updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/", checkAuthAdmin, async (req, res) => {
  try {
    const adminId = req.admin.userId;

    // Find all products that belong to the specified adminId
    const products = await foodItemsModel
      .find()
      .populate("Category")

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/:productId", checkAuthAdmin, async (req, res) => {
  try {
    const productId = req.params.productId;

    const existingProduct = await foodItemsModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await foodItemsModel.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
