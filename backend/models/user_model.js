const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, // Added username field
  email: { type: String, unique: true, required: true },
  phone: { type: Number, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['student', 'faculty'],
    default: 'student'
  }
});

userSchema.plugin(passportLocalMongoose, { 
  usernameField: 'email'
});

module.exports = mongoose.model("User", userSchema);
