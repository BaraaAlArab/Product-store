import Mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    telephone:{
      type: String,
      required: true,
      trim: true,
      unique: true,
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
