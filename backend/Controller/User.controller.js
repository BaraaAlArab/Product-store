import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Admin (role: admin)
export const registerAdmin = async (req, res) => {
  try {
    const {name, email, password, role} = req.body;

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: "Email already exists"});
    }

    const newAdmin = new User({
      name,
      email,
      password,
      role: role || "admin", // Default to admin if role is not sent
    });

    await newAdmin.save();

    res.status(201).json({message: "Admin registered successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

// Login (common for admin/client)
export const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");
    if (!user) {
      return res.status(401).json({message: "Invalid email or password"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({message: "Invalid email or password"});
    }

    const token = jwt.sign(
      {id: user._id, role: user.role},
      process.env.JWT_SECRET,
      {expiresIn: "1d"},
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

// Get User Profile (admin/client)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

// Update Profile (admin/client)
export const updateUserProfile = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({email});
      if (existingUser) {
        return res.status(400).json({message: "Email already in use"});
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (password) user.password = password; // Will hash in pre-save hook

    await user.save();
    res.status(200).json({message: "Profile updated successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

// Delete User (admin/client)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json({message: "User deleted successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

// Get All Users (Admin only, optional)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};

// Change Password
export const changeUserPassword = async (req, res) => {
  try {
    const {currentPassword, newPassword} = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({message: "Current password is incorrect"});
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({message: "Password changed successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};
