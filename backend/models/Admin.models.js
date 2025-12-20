import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        BOD:{
            type: Date,
        },
        telephone:{
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },  
        role: {
            type: String,
            enum: ["admin"],
            default: "admin",
        },
        password: { type: String, required: true, select: false }

    },
    { timestamps: true },
);
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) 
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;    