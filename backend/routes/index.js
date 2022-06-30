var express = require("express");
var router = express.Router();

var uid2 = require("uid2");
var bcrypt = require("bcrypt");

var userModel = require("../models/users");
var booksModel = require("../models/books");

/* GET home page. */

router.get("/", (req, res) => {
  console.log("Responding to root route");
  res.send("SALUT A TOUS LES AMISss");
});

router.post("/sign-up", async function (req, res, next) {
  var error = [];
  var result = false;
  var saveUser = null;
  var token = null;

  const data = await userModel.findOne({
    email: req.body.emailFromFront,
  });

  if (data != null) {
    error.push("utilisateur déjà présent");
  }

  if (
    req.body.usernameFromFront == "" ||
    req.body.emailFromFront == "" ||
    req.body.passwordFromFront == ""
  ) {
    error.push("champs vides");
  }

  if (error.length == 0) {
    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    });

    saveUser = await newUser.save();

    if (saveUser) {
      result = true;
      token = saveUser.token;
    }
  }

  res.json({ result, saveUser, error, token });
});

router.post("/sign-in", async function (req, res, next) {
  var result = false;
  var user = null;
  var error = [];
  var token = null;

  if (req.body.emailFromFront == "" || req.body.passwordFromFront == "") {
    error.push("champs vides");
  }

  if (error.length == 0) {
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    });

    if (user) {
      if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
        result = true;
        token = user.token;
      } else {
        result = false;
        error.push("mot de passe incorrect");
      }
    } else {
      error.push("email incorrect");
    }
  }

  res.json({ result, user, error, token });
});

router.get("/getUser", async function (req, res, next) {
  var user = await userModel.find({ token: req.query.token });

  user = {
    _id: user[0]._id,
    username: user[0].username,
    token: user[0].token,
  };
  console.log(user, "LE GET USER");
  res.json(user);
});

router.post("/new-book-deja-lu", async function (req, res, next) {
  var result = false;
  var user = await userModel.findOne({ token: req.query.token });
  user = {
    _id: user._id,
    username: user.username,
    token: user.token,
  };
  console.log(user, "L UTILISATEUR IDJKZOJKD");
  if (user != null) {
    var newBook = new booksModel({
      title: req.body.title,
      cover: req.body.cover,
      description: req.body.desc,
      author: req.body.author,
      dejalu: "true",
      date: req.body.date,
      userId: user._id,
    });
  }

  var saveBook = await newBook.save();
  if (saveBook.title) {
    result = true;
  }

  res.json({ result, saveBook });
});

router.post("/new-book-pas-lu", async function (req, res, next) {
  var result = false;
  var user = await userModel.findOne({ token: req.query.token });
  user = {
    _id: user._id,
    username: user.username,
    token: user.token,
  };
  console.log(user, "L UTILISATEUR IDJKZOJKD");
  if (user != null) {
    var newBook = new booksModel({
      title: req.body.title,
      cover: req.body.cover,
      description: req.body.desc,
      author: req.body.author,
      dejalu: "false",
      date: req.body.date,
      userId: user._id,
    });
  }

  var saveBook = await newBook.save();
  if (saveBook.title) {
    result = true;
  }

  res.json({ result, saveBook });
});

router.get("/my-books", async function (req, res, next) {
  var books = [];
  var user = await userModel.findOne({ token: req.query.token });

  if (user != null) {
    books = await booksModel.find({ userId: user._id });
  }
  console.log(books, "les books");

  res.json({ books });
});

router.get("/my-books-pas-lu", async function (req, res, next) {
  var booksNonLu = [];
  var user = await userModel.findOne({ token: req.query.token });

  if (user != null) {
    booksNonLu = await booksModel.find({ userId: user._id, dejalu: "false" });
  }

  res.json({ booksNonLu });
});

router.get("/my-books-lu", async function (req, res, next) {
  var booksLu = [];
  var user = await userModel.findOne({ token: req.query.token });

  if (user != null) {
    booksLu = await booksModel.find({ userId: user._id, dejalu: "true" });
  }

  res.json({ booksLu });
});

router.get("/my-books-given", async function (req, res, next) {
  var booksGiven = [];
  var user = await userModel.findOne({ token: req.query.token });

  if (user != null) {
    booksGiven = await booksModel.find({ userId: user._id, dejalu: "donné" });
  }

  res.json({ booksGiven });
});

router.put("/change-status-lu", async function (req, res, next) {
  booksPasLu = await booksModel.updateOne(
    { _id: req.query.bookId },
    { dejalu: "true" }
  );

  console.log(booksPasLu, "le book précis pas lu");

  res.json({ booksPasLu });
});

router.put("/change-status-donne", async function (req, res, next) {
  booksLu = await booksModel.updateOne(
    { _id: req.query.bookId },
    { dejalu: "donné" }
  );

  console.log(booksLu, "le book précis lu");

  res.json({ booksLu });
});

router.delete("/delete-book-lu", async function (req, res, next) {
  booksLu = await booksModel.deleteOne({ _id: req.query.bookId });

  res.json({ booksLu });
});

/* router.get("/books-paslu", async function (req, res, next) {
  booksPasLu = await booksModel.findOne({ _id: req.query.bookId });

  console.log(booksPasLu, "le book précis pas lu");

  res.json({ booksPasLu });
});
 */
module.exports = router;
