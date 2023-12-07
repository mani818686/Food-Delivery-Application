const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const productModel = require("../models/product");
const brandModel = require("../models/brand");
const categoryModel = require("../models/category");
const variantModel = require("../models/variant");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");

router.post("/addProduct", checkAuthAdmin, async (req, res) => {
  try {
    const prices = req.body.price.split(",");
    const colors = req.body.color.split(",");
    const sizes = req.body.size.split(",");

    const variantIds = [];

    for (let i = 0; i < prices.length; i++) {
      const newVariant = new variantModel({
        _id: new mongoose.Types.ObjectId(),
        size: sizes[i],
        color: colors[i],
        price: prices[i],
      });
      await newVariant.save();
      variantIds.push(newVariant._id);
    }

    const brand = await brandModel.findOne({ brandName: req.body.brandName });
    let newBrand;

    if (!brand) {
      newBrand = new brandModel({
        _id: new mongoose.Types.ObjectId(),
        brandName: req.body.brandName,
      });
      await newBrand.save();
    }

    const category = await categoryModel.findOne({
      categoryName: req.body.categoryName,
    });
    let newCategory;

    if (!category) {
      newCategory = new categoryModel({
        _id: new mongoose.Types.ObjectId(),
        categoryName: req.body.categoryName,
      });
      await newCategory.save();
    }

    const newProduct = new productModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
      variantId: variantIds,
      categoryId: newCategory ? newCategory._id : category._id,
      brandId: newBrand ? newBrand._id : brand._id,
      adminId: req.admin.userId,
    });
    console.log(newProduct);
    await newProduct.save();

    res.status(200).json({
      message: "Product created successfully",
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
      if (req.query.size) {
        const variant = await variantModel.findOne({ size: req.query.size });
        console.log("Size",variant)
        if (variant) {
          filters['variantId'] = variant._id;
        }
      }

      if (req.query.color) {
        const variant = await variantModel.findOne({ color: req.query.color });
        console.log("Color",variant)
        if (variant) {
          filters['variantId'] = variant._id;
        }
      }

      if (req.query.categoryName) {
        const category = await categoryModel.findOne({ categoryName: req.query.categoryName });
        console.log("Category",category)
        if (category) {
          filters['categoryId'] = category._id;
        }
      }

      if (req.query.brandName) {
        const brand = await brandModel.findOne({ brandName: req.query.brandName });
        console.log("Brand",brand)
        if (brand) {
          filters['brandId'] = brand._id;
        }
      }
      console.log("filters----",filters)

      const products = await productModel.find(filters)
      .populate("variantId")
      .populate("categoryId")
      .populate("brandId")
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
    const products = await productModel
      .find({ _id: productId })
      .populate("variantId")
      .populate("categoryId")
      .populate("brandId");

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/updatePrice/:productId/:variantId', async (req, res) => {
  console.log(req.body)
  try {
    const productId = req.params.productId;
    const variantId = req.params.variantId;
    const newPrice = req.body.price;
    console.log(productId,variantId,newPrice)
    const product = await productModel.findById(productId).populate('variantId');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const variantIndex = product.variantId.findIndex((variant) => variant._id == variantId);

    if (variantIndex === -1) {
      return res.status(404).json({ message: 'Variant not found within the product' });
    }

    await variantModel.findByIdAndUpdate(variantId,{
      $set:{
        price:newPrice
      }
    })

    res.status(200).json({ message: 'Variant price updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/products/admin", checkAuthAdmin, async (req, res) => {
  try {
    const adminId = req.admin.userId;

    // Find all products that belong to the specified adminId
    const products = await productModel
      .find({ adminId: adminId })
      .populate("variantId")
      .populate("categoryId")
      .populate("brandId");

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/products/:productId", checkAuthAdmin, async (req, res) => {
  try {
    const productId = req.params.productId;

    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await productModel.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
