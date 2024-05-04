const express = require("express");

const router = express.Router();

const customerRoutes = require("./customer");
const adminRoutes = require("./admin")
const ItemsRoutes = require("./foodItems")
const deliveryRoutes = require("./deliveryInfo")

router.use("/customer", customerRoutes);
router.use("/admin", adminRoutes);
router.use("/foodItem", ItemsRoutes);
router.use("/delivery", deliveryRoutes);

module.exports = router;