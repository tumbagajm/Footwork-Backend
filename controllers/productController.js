const Product = require("../models/Product");

// Add product (admin only)
module.exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isActive: req.body.isActive,
    });

    const existingProduct = await Product.findOne({ name: req.body.name });

    if (existingProduct) {
      return res.status(409).json({ error: "Product already exists." });
    }

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product saved successfully!",
      data: savedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save product." });
  }
};

// Get all products (admin only)
module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (products.length <= 0) {
      return res.status(400).json({ message: "No products found." });
    }
    return res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all active products (all)
module.exports.getAllActiveProducts = async (req, res) => {
  try {
    const activeProducts = await Product.find({ isActive: true });
    if (activeProducts.length === 0) {
      return res.status(200).json({ message: "No active products" });
    }
    return res.status(200).json(activeProducts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single product (all)
module.exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    // Check if product exists, and make sure it is active
    if (!product || product.isActive === false) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ message: "Product found!", data: product });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update product (admin only)
module.exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { name, description, price },
      { new: true }
    );

    if (!product) {
      return res.status(404).sent({ error: "Product not found" });
    }
    return res.status(200).json({ message: "Product has been updated", data: product });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Archive product (admin only)
module.exports.archiveProduct = async (req, res) => {
  try {
    // Check if product exists
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Check if product is already inactive
    if (!product.isActive) {
      return res.status(400).json({ error: "Product is already inactive" });
    }

    // Proceed with archiving
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { isActive: false },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Product archived successfully!", data: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: "Product not found" });
  }
};

// Activate Product (admin only)
module.exports.activateProduct = async (req, res) => {
  try {
    // Check if product exists
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if product is already active
    if (product.isActive) {
      return res.status(400).json({ error: "Product is already active." });
    }

    // Proceed with activating
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { isActive: true },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Product activated successfully!", data: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: "Product not found" });
  }
};
