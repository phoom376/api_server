const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  p_name: { type: String, required: true },
  p_price: { type: Number, required: true },
  p_qty: { type: String, required: true },
  p_image: { type: String, required: true },
});

module.exports = mongoose.model("products", productSchema);
