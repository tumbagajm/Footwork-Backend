const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "productId is required"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  subtotal: {
    type: Number,
    default: 0,
    required: [true, "subtotal is required"],
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
  },
  cartItems: {
    type: [cartItemSchema],
    required: [true, "cartItems is required"],
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: [true, "totalPrice is required"],
  },
  addedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
