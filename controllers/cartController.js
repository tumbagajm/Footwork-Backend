const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get cart
module.exports.getCart = async (req, res) => {
  try {
    const { id } = req.user;
    const userCart = await Cart.findOne({ userId: id }).populate('cartItems.productId', 'name price images');

    if (!userCart) {
      return res.status(400).json({ error: "Cart not found." });
    }
    return res.status(200).json({ message: "Cart found", data: userCart });
  } catch (err) {
    res.status(500).json({ error: "Failed to get cart.", data: err });
  }
};

// // Add to cart
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

    // Check if the product already exists in the cart
    const productExistsInCart = userCart.cartItems.some((item) => item.productId.equals(productId));
    if (productExistsInCart) {
      req.body.fromAddToCart = true;
      return updateCartQuantity(req, res);
    } else {
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
      const updatedUserCart = await Cart.findByIdAndUpdate(userCart._id, updatedCart, {
        new: true,
      });

      res.status(200).json({ message: "Item added to cart", cart: updatedUserCart });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Change product quantities in cart
const updateCartQuantity = async (req, res) => {
  try {
    console.log(req.body);
    // Validate input
    const { productId, quantity } = req.body;
    let fromAddToCart = req.body.fromAddToCart || false;
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
    // if the function is called from addToCart, add the quantity
    if (fromAddToCart) {
      // Update the quantity and subtotal
      existingCartItem.quantity += quantity;
      existingCartItem.subtotal += quantity * product.price;
    }
    // If not from addToCart, change the quantity
    else {
      // Update the quantity and subtotal
      existingCartItem.quantity = quantity;
      existingCartItem.subtotal = quantity * product.price;
    }

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
// Remove item from cart
module.exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const userCart = await Cart.findOne({ userId });

    // Check if user cart exists
    if (!userCart) {
      return res.status(404).json({ error: "User cart not found" });
    }

    // Check if the product exists in the cart
    const existingCartItem = userCart.cartItems.find((item) => item.productId == productId);

    console.log(existingCartItem);

    if (!existingCartItem) {
      return res.status(404).json({ error: "Product not found in the cart" });
    }

    // Filters the cart items excluding the productId to be removed
    const updatedCartItems = userCart.cartItems.filter((item) => item.productId != productId);

    const totalPrice = updatedCartItems.reduce((total, item) => total + item.subtotal, 0);

    const updatedUserCart = await Cart.findOneAndUpdate(
      { userId },
      { cartItems: updatedCartItems, totalPrice },
      { new: true }
    );

    res.status(200).json({ message: "Item removed from cart successfully", cart: updatedUserCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Clear cart
module.exports.clearCart = async (req, res) => {
  try {
    const { id } = req.user;

    const clearCart = await Cart.findOneAndUpdate(
      { userId: id },
      { cartItems: [], totalPrice: 0 },
      { new: true }
    );

    return res.status(200).json({ message: "Cart cleared successfully", data: clearCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.updateCartQuantity = updateCartQuantity;
