const express = require("express");

const router = express.Router();

const customerRoutes = require("./customer");

router.use("/customer", customerRoutes);

module.exports = router;