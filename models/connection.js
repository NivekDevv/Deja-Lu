var mongoose = require("mongoose");

var options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.rrotg.mongodb.net/deja-lu?retryWrites=true&w=majority",
  options,
  function (err) {
    console.log(err);
  }
);

module.exports = mongoose;
