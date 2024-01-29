// [SECTION] Dependencies and Modules
const express = require("express");
const orderController = require("../controllers/orderController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// ROUTES

// Checkout route
router.post("/checkout", verify, orderController.checkout);

// Retrieve logged in user's orders
router.get("/my-orders", verify, orderController.getUserOrders);

// Retrieve all orders (admin only)
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

// Update order status
router.patch("/:orderId/update-order-status", verify, verifyAdmin, orderController.updateStatus);

// [SECTION] Export Route System
module.exports = router;
