const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
  qty: Number,
  desc: String,
  image: String
});

// 🔥 THIS LINE IS CRITICAL
module.exports = mongoose.model("Product", productSchema);