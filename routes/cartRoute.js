// [SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// ROUTES

// Get cart
router.get("/get-cart", verify, cartController.getCart);

// Add to cart route
router.post("/add-to-cart", verify, cartController.addToCart);

// Change product quantities route
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

// Remove item from cart route
router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);

// Clear cart route
router.patch("/clear-cart", verify, cartController.clearCart);

// [SECTION] Export Route System
module.exports = router;
