const mongoose = require("mongoose");
const siteRuleSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  domain: { type: String, index: true },
  category: String,
  productive: Boolean
}, { timestamps: true });
module.exports = mongoose.model("SiteRule", siteRuleSchema);
