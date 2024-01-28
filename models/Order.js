const mongoose = require("mongoose");

// [SECTION] Schema/Blueprint
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required'],
  },
  productsOrdered: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'productId is required'],
      },
      quantity: {
        type: Number,
        required: [true, 'quantity is required'],
      },
      subtotal: {
        type: Number,
        required: [true, 'subtotal is required'],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "totalPrice is Required"],
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Order", orderSchema);
