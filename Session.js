const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  site: { type: String },
  duration: { type: Number, default: 0 }, // minutes
  category: { type: String, enum: ["productive", "unproductive", "unclassified"], default: "unclassified" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);
