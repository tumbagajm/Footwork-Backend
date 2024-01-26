const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");

// Checkout order
module.exports.checkout = async (req, res) => {
  try {
    const { id } = req.user;
    // Get user cart
    const userCart = await Cart.findOne({ userId: id });

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
    return res.status(201).json({ order: newOrder, cart: clearCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve logged in user's orders
module.exports.getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;
    const userOrders = await Order.find({ userId: id });

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
    const { id } = req.user;

    // Checks if user is an admin
    const user = await User.findById(id);
    if (!user || !user.isAdmin) {
      return res.status(400).json({ error: "You have invalid access." });
    }
    // Gets all orders
    const allOrders = await Order.find();

    return res.status(200).json({ message: "Showing all orders", data: allOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
