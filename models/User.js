const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  birthday: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  zodiac: { type: String },
  hobbies: { type: [String] },
  location: { type: String },
  hasChatted: { type: [String] },
  refreshToken: { type: String }
});

module.exports = mongoose.model("User", userSchema);
