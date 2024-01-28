// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/userController");

const {
  verify,
  verifyAdmin,
  isLoggedIn,
} = require("../auth");
const {
  validateEmail,
  validatePassword,
  validateMobileNo,
} = require("../verification");

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Routes

// Route for user registration
router.post("/", validateEmail, validatePassword, validateMobileNo, userController.registerUser);

// Route for logging in
router.post("/login", userController.loginUser);

// Route for getting user details
router.get("/details", verify, userController.getProfile);

// Set user to admin
router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.setToAdmin);

// Password Reset
router.patch("/update-password", verify, validatePassword, userController.updatePassword);

// [SECTION] Export Route System
module.exports = router;
