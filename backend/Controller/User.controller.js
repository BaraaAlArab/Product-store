import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { get } from "mongoose";

// Register (default client)

export const registerClient = async (req, res) => {
  try {
    const {name,telephone,DOB, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json ({message:"Email already in use"});
    }
    const user = new User({ name,telephone,DOB, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
//Signout User
export const signoutUser = async (req, res) => {
  try {
    // Invalidate the token on the client side by instructing the client to delete it
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// change password
export const changepassword = async (req,res) =>{
  try{
    const {email, oldPassword,newPassword}= req.body;

    const user = await User.findOne({email}).select("+password");
    if (!user) return res.status(401).json({message:"Invalid credentials"});
    const match = await bcrypt.compare(oldPassword,user.password);

    if (!match) return res.status(401).json({message:"Invalid credentials"});

    user.password = newPassword;
    await user.save();
    res.status(200).json({message:"Password changed successfully"});
  } catch (error){
    res.status(500).json({message:"Server error"});
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};