const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get cart
module.exports.getCart = async (req, res) => {
  try {
    const { id } = req.user;
    const userCart = await Cart.find({ userId: id });

    if (!userCart) {
      return res.status(400).json({ error: "Cart not found." });
    }
    return res.status(200).json({ message: "Cart found", data: userCart });
  } catch (err) {
    res.status(500).json({ error: "Failed to get cart.", data: err });
  }
};

// Add to cart
module.exports.addToCart = async (req, res) => {
  try {
    // validate input
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Retrieve user's cart or create a new one if it doesn't exist yet
    const userId = req.user.id;
    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = new Cart({ userId });
      await userCart.save();
    }

    // Retrieve product details
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Calculate subtotal for the new item
    const subtotal = product.price * quantity;

    // Update the cart
    const updatedCart = {
      $push: {
        cartItems: {
          productId,
          quantity,
          subtotal,
        },
      },
      $inc: { totalPrice: subtotal },
    };
    // Update and save the cart
    const updatedUserCart = await Cart.findByIdAndUpdate(userCart._id, updatedCart, { new: true });

    res.status(200).json({ message: "Item added to cart", cart: updatedUserCart });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Change product quantities in cart
module.exports.updateCartQuantity = async (req, res) => {
  try {
    // Validate input
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Retrieve user's cart
    const userId = req.user.id;
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ error: "User cart not found" });
    }

    // Check if the product is in the cart
    const existingCartItem = userCart.cartItems.find((item) => item.productId.equals(productId));

    if (!existingCartItem) {
      return res.status(404).json({ error: "Product not found in the cart" });
    }

    // Retrieve product details
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the quantity and subtotal
    existingCartItem.quantity = quantity;
    existingCartItem.subtotal = quantity * product.price;

    // Recalculate total price
    userCart.totalPrice = userCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    // Save the updated cart
    const updatedUserCart = await userCart.save();

    res.status(200).json({ message: "Cart quantity updated successfully", cart: updatedUserCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
