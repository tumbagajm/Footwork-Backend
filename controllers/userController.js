// [SECTION] Dependencies and Modules
// The "User" variable is defined using a capitalized letter to indicate that we are using its "User" model for code readability
const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.registerUser = async (req, res) => {
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // If it doesn't exist yet, continue
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      isAdmin: req.body.isAdmin || false,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res
      .status(201)
      .send({ message: "Registered successfully!", data: savedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User authentication
module.exports.loginUser = async (req, res) => {
  // the fineOne method returns the first record in the collection that matches the search criteria

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    console.log(existingUser);

    // User does not exist
    if (existingUser == null) {
      return res.status(404).send({ error: "No email found." });
      // If user exists
    } else {
      const isPasswordCorrect = await bcrypt.compareSync(
        req.body.password,
        existingUser.password
      );
      if (isPasswordCorrect) {
        return res
          .status(200)
          .send({ access: auth.createAccessToken(existingUser) });
      } else {
        return res.status(401).send("Email and password do not match");
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve User Details
module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    user.password = "******";
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Set user to admin
module.exports.setToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.user;

    if (isAdmin == true) {
      const newUserAdmin = await User.findByIdAndUpdate(
        id,
        { isAdmin: true },
        { new: true }
      );

      return res.status(200).json({ newUserAdmin });
    } else {
      return res.status(400).json({ error: "Failed to set to admin." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Reset Password
module.exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.user;

    // Hash/encrypt the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
