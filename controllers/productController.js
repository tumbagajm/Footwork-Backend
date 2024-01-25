const Product = require("../models/Product");

// Add product
module.exports.addProduct = async (req, res) => {
  try {
    let newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });

    await Product.findOne({ name: req.body.name }).then((existingProduct) => {
      if (existingProduct) {
        return res.status(409).send({
          error: "Product already exists.",
        });
      }

      return newProduct
        .save()
        .then((savedProduct) =>
          res.status(201).send({ message: "Course saved successfully", data: savedProduct })
        )
        .catch((err) =>
          res.status(500).send({
            error: "Failed to save course",
            data: err,
          })
        );
    });
  } catch (err) {
    res.status(500).send({ message: "Error in variables" });
  }
};

// Get all products
module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    if (products.length > 0) {
      return res.status(200).send(products);
    } else {
      return res.status(400).send({ message: "No courses found." });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Get all active products
module.exports.getAllActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    if (products.length > 0) {
      return res.status(200).send(products);
    } else {
      return res.status(400).send({ message: "No courses found." });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Get single product
module.exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).sent({ error: "Product not found" });
    } else {
      return res.status(200).send({ product });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Update product
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
    } else {
      return res.status(200).send({ message: "Product has been updated", data: product });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Archive product
module.exports.archiveProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const archivedProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );
    if (!archivedProduct) {
      return res.status(404).sent({ error: "Product not found" });
    } else {
      return res
        .status(200)
        .send({ message: "Product has been archived successfully!", data: archivedProduct });
    }
  } catch (err) {
    res.status(500).send({ error: "Product not found" });
  }
};

// Activate Product
module.exports.activateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const archivedProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive: true },
      { new: true }
    );
    if (!archivedProduct) {
      return res.status(404).sent({ error: "Product not found" });
    } else {
      return res
        .status(200)
        .send({ message: "Product has been archived successfully!", data: archivedProduct });
    }
  } catch (err) {
    res.status(500).send({ error: "Product not found" });
  }
};
