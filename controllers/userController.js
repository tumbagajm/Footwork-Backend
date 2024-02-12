// [SECTION] Dependencies and Modules
// The "User" variable is defined using a capitalized letter to indicate that we are using its "User" model for code readability
const User = require("../models/User");
const Cart = require("../models/Cart");
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

        // Creates a cart once a new user is registered
        const newCart = new Cart({
            userId: savedUser.id,
        });

        // Save the cart to the database
        const savedCart = await newCart.save();

        res.status(201).send({ message: "Registered successfully!", data: savedUser, savedCart });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// User authentication
module.exports.loginUser = async (req, res) => {
    // the fineOne method returns the first record in the collection that matches the search criteria

    try {
        const existingUser = await User.findOne({ email: req.body.email });

        // User does not exist
        if (existingUser == null) {
            return res.status(404).send({ error: "No email found." });
            // If user exists
        } else {
            const isPasswordCorrect = await bcrypt.compareSync(req.body.password, existingUser.password);
            if (isPasswordCorrect) {
                return res.status(200).send({ access: auth.createAccessToken(existingUser) });
            } else {
                return res.status(401).send({ error: "Email and password do not match" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Retrieve User Details
module.exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).send({ error: "User not found" });
        }
        user.password = "******";
        return res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({data: { users}});
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

// Set user to admin
module.exports.setToAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Your middleware should ensure that only admins can reach this point

        const newUserAdmin = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true });

        if (!newUserAdmin) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json({ user: newUserAdmin, message: "User set to admin successfully." });
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

// Update profile
module.exports.updateProfile = async (req, res) => {
    try {
        // const userId = req.user.id;
        const { id } = req.user;

        const { firstName, lastName, mobileNo, image } = req.body;

        const updateUser = await User.findByIdAndUpdate(id, { firstName, lastName, mobileNo, image }, { new: true });

        return res.json(updateUser);
    } catch {
        return res.status(500).json({ error: "Failed to update profile." });
    }
}

module.exports.updateProfilePicture = async (req, res) => {
    try {
        const { id } = req.user;
        const { image } = req.body;
        const updatedUserPicture = await User.findByIdAndUpdate(id, { image }, { new: true });

        return res.status(200).json({ message: "Profile picture updated successfully!", data: updatedUserPicture });
    } catch {
        return res.status(500).json({ error: "Failed to update profile picture." });
    }
}