const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: Number, required: true },
  password: { type: String }, // Will be hashed by Passport
});

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, { usernameField: "username" });

module.exports = mongoose.model("User", userSchema);
