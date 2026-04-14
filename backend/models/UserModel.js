import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  role: { type: String, default: "user" },
  ashaId: { type: String },
  village: { type: String }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;