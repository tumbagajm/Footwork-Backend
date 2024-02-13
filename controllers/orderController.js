const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");

// Checkout order
module.exports.checkout = async (req, res) => {
  try {
    const { id } = req.user;
    // Get user cart
    const userCart = await Cart.findOne({ userId: id });

    if (!userCart) {
      return res.status(400).json({ error: "User cart not found" });
    }

    // Creates new Order
    const newOrder = new Order({
      userId: userCart.userId,
      productsOrdered: userCart.cartItems,
      totalPrice: userCart.totalPrice,
    });

    // Saves the order to the database
    await newOrder.save();

    // // Clears all items inside the cart
    const clearCart = await Cart.findOneAndUpdate(
      { userId: id },
      { cartItems: [], totalPrice: 0 },
      { new: true }
    );

    // return res.status(201).json(true);
    return res.status(201).json({ order: newOrder, cart: clearCart, message: "Checkout successful! Thank you for your purchase." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve logged in user's orders
module.exports.getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;
    const userOrders = await Order.find({ userId: id }).populate('productsOrdered.productId', 'name price images');

    if (!userOrders) {
      return res.status(404).json({ error: "No orders found." });
    }

    return res.status(200).json({ message: "Here are your orders", data: userOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve all orders
module.exports.getAllOrders = async (req, res) => {
  try {
    // Gets all orders
    const allOrders = await Order.find().populate('productsOrdered.productId', 'name price images').populate('userId', 'firstName lastName');

    return res.status(200).json({ message: "Showing all orders", data: allOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update order status
module.exports.updateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Updates order status
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    return res.status(200).json({ message: `Status has been updated to ${status}`, data: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
