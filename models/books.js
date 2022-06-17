const mongoose = require("mongoose");

const booksSchema = mongoose.Schema({
  title: String,
  cover: String,
  description: String,
  author: String,
  dejalu: String,
  date: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const booksModel = mongoose.model("books", booksSchema);

module.exports = booksModel;
