const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  c_name: { type: String, default: null },
  c_description: { type: String, default: bull },
  c_address: { type: String, default: null },
  c_board: [
    {
      b_id: { type: String, default: null },
    },
  ],
});

module.exports = mongoose.model("company", companySchema);
