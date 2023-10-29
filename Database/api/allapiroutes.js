const express = require("express");

const router = express.Router();

const customerRoutes = require("./customer");
const adminRoutes = require("./admin")

router.use("/customer", customerRoutes);
router.use("/admin", adminRoutes);


module.exports = router;