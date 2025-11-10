import Mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      required: true,
      enum: ["admin", "client"],
      default: "client" ,
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
