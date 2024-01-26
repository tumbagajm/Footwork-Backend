// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Import Routes
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoute");
const orderRoutes = require("./routes/orderRoute");

// Environment Setup
const port = 4000;
// MongoDB password
const mongoDBPassword = "admin1234";
// Database name
const dbName = "Capstone2_API";

// [SECTION] Server Setup
const app = express();

// Registering middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// [SECTION] Database Connection
// Connect to our MongoDB database
// [SECTION] MongoDB Connection thru Mongoose
mongoose.connect(
  `mongodb+srv://admin:${mongoDBPassword}@gloriosodb.gewtusc.mongodb.net/${dbName}?retryWrites=true&w=majority`
);
// Promts a message in the terminal once the connection is open and we are able to successfully connect our database
mongoose.connection.once("open", () => console.log("Now connected to MongoDB  Atlas"));

// Backend Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);

// [SECTION] Server Gateway Response
// if(require.main) would allow us to listen to the app directly if it is not imported to another module, it will run the app directly
// else, if it is needed to be imported, it will not run the app and instead export it to be used in another file
if (require.main === module) {
  // "process.env.PORT || port" will use the environment variable if it is available OR will use port 4000 if none is defined
  app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${port}`);
  });
}

// In creating APIs, exporting modules in the "index.js" file is ommited
module.exports = app;
