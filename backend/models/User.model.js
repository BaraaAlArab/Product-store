import Mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    telephone:{
      type: String,
      required: true,
      trim: true,
    },
    DOB:{
      type: Date,
    },   
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          if (!value || value.length < 8) return false;
          return /[A-Z]/.test(value) && /[0-9]/.test(value);
        },
        message:
          "Password must be at least 8 characters and contain an uppercase letter and a number",
      },
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
    avatar: {
      type: String,
      default: "",
    },

  },
  {timestamps: true},
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = Mongoose.model("User", userSchema);

export default User;
