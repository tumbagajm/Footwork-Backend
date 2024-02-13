// [SECTION] Dependencies and Modules
const express = require("express");
const productController = require("../controllers/productController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// ROUTES

// Add product route
router.post("/", verify, verifyAdmin, productController.addProduct);

// Retrieve all products route
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// Retrieve all active products route
router.get("/", productController.getAllActiveProducts);

// Retrieve single product route
router.get("/:productId", productController.getSingleProduct);

// Update product route
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// Archive product route
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Activate product route
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Search product by name
router.post("/searchByName", productController.searchByName);

// Search product by price range
router.post("/searchByPrice", productController.searchByPrice);

// [SECTION] Export Route System
module.exports = router;
