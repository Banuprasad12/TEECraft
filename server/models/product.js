const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
  qty: Number,
  desc: String,
  image: String
});

module.exports = mongoose.model("Product", productSchema);