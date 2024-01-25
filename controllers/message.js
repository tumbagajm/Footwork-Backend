// Create new product
module.exports.addProduct = async (req, res) => {
    console.log(req.body);
    try {
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            isActive: req.body.isActive
        });

        const existingProduct = await Product.findOne({ name: req.body.name });

        if (existingProduct) {
            return res.status(409).send({ error: "Product already exists." });
        }

        const savedProduct = await newProduct.save();

        return res.status(201).send({
            message: "Product saved successfully!",
            data: savedProduct
        });
    } catch (error) {
        return res.status(500).send({ error: "Failed to save product." });
    }
};

// get all products (admin only)
module.exports.getAllProducts = async (req, res) =>{
    try{
        const products = await Product.find({});
        return res.status(200).send(products);
    }catch(error){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// get all active products (everyone)
module.exports.getAllActive = async (req, res) =>{
    try{
        const activeProducts = await Product.find({isActive: true});
        if(activeProducts.length === 0){
            return res.status(200).send({message: "No active products"});
        }
        return res.status(200).send(activeProducts);
    }catch(error){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// get specific product by id (everyone)
module.exports.getProduct = async (req, res) =>{
    try{
        const product = await Product.findById(req.params.productId);
        // Check if product exists, and make sure it is active
        if(!product || product.isActive === false){
            return res.status(404).send({error: "Product not found"});
        }

        return res.status(200).send({message: "Product found!", data: product});
    }catch(error){
    }
}

// Update products
module.exports.updateProduct = async (req, res) =>{
    try {
        const {name, description, price} = req.body;
        let updateProduct = {};

        // Only change the values on fields which are filled
        if(name) updateProduct.name = name;
        if(description) updateProduct.description = description;
        if(price) updateProduct.price = price;

        const product = await Product.findByIdAndUpdate(req.params.productId, updateProduct, {new: true});
        if(!product){
            return res.status(404).send({error: "Product not found"})
        }
        return res.status(200).send({message: "Product updated successfilly"});
    
    }catch(error){
        return res.status(500).json({ error: "Error in updating a product." });
    }
}

// Archive product
module.exports.archiveProduct = async (req, res) =>{
    try{
        // Check if product exists
        const product = await Product.findById(req.params.productId);
        if(!product){
            return res.status(404).json({error: "Product not found."});
        }

        // Check if product is already inactive
        if(!product.isActive){
            return res.status(400).json({error: "Product is already inactive"});
        }

        // Proceed with archiving
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, {isActive: false}, {new: true});
        return res.status(200).json({message: "Product archived successfully!", data: updatedProduct})
    }catch(error){
        return res.status(500).json({ error: "Error in archiving the product." });
    }
}

// Activating product
module.exports.activateProduct = async(req, res) =>{
    try{
        // Check if product exists
        const product = await Product.findById(req.params.productId);
        if(!product){
            return res.status(404).json({error: "Product not found"});
        }

        // Check if product is already active
        if(product.isActive){
            return res.status(400).json({error: "Product is already active."});
        }

        // Proceed with activating
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId,{isActive: true}, {new: true});
        return res.status(200).json({message: "Product activated successfully!"})
    }catch{
        return res.status(500).json({ error: "Error in activating the product." });
    }
}