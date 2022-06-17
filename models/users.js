const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
