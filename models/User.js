const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  birthday: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  zodiac: { type: Number },
  hobbies: { type: [String] },
  location: { type: String },
  fullName: { type: String },
  nickName: { type: String },
  phoneNumber: { type: String },
  quote: { type: String },
  image: { type: String },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
