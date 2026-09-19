import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Register (default client)

export const registerClient = async (req, res) => {
  try {
    const {name,telephone,DOB, email, password } = req.body;
    if (!name || !telephone || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json ({message:"Email already in use"});
    }
    const user = new User({ name,telephone,DOB, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email, name or phone already in use" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
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
        name: user.name,
        email: user.email,
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
    const {oldPassword,newPassword}= req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({message:"Old and new passwords are required"});
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(401).json({message:"User not found"});
    const match = await bcrypt.compare(oldPassword,user.password);

    if (!match) return res.status(401).json({message:"Invalid credentials"});

    user.password = newPassword;
    await user.save();
    res.status(200).json({message:"Password changed successfully"});
  } catch (error){
    res.status(500).json({message:"Server error"});
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password — generates a reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal whether the email exists
      return res.status(200).json({
        message: "If that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;

    // No email service configured — log the link so it is usable in development
    console.log(`\n[Password Reset] ${resetUrl}\n`);

    // In production you would send resetUrl via email here (nodemailer / provider)
    res.status(200).json({
      message: "If that email exists, a password reset link has been sent.",
      devResetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).json({ message: "New password is required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password +resetPasswordToken +resetPasswordExpire");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now sign in." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) {
      if (!["client", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      user.role = role;
    }

    const saved = await user.save();
    const { password, ...safeUser } = saved.toObject();
    res.status(200).json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};