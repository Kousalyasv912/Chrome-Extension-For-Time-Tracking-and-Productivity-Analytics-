const mongoose = require("mongoose");

// MongoDB connection
const MONGO_URI = "mongodb://127.0.0.1:27017/focusflow";

// Schema & Model
const sessionSchema = new mongoose.Schema({
  userId: String,
  domain: String,
  durationMs: Number,
  category: String,
  timestamp: { type: Date, default: Date.now },
});

const Session = mongoose.model("Session", sessionSchema);

// Categorize domains
function categorizeSite(domain) {
  const sites = {
    "github.com": "productive",
    "stackoverflow.com": "productive",
    "linkedin.com": "productive",
    "code.visualstudio.com": "productive",
    "youtube.com": "unproductive",
    "instagram.com": "unproductive",
    "netflix.com": "unproductive",
  };
  return sites[domain] || "unclassified";
}

async function run() {
  await mongoose.connect(MONGO_URI);

  const userId = "kousalya@local";
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  // Clean old test data
  await Session.deleteMany({
    userId,
    timestamp: { $gte: startOfDay, $lt: endOfDay },
  });

  // Insert new test sessions
  const sessions = [
    {
      domain: "github.com",
      durationMs: 20 * 60 * 1000,
      timestamp: new Date(startOfDay.getTime() + 9 * 60 * 60 * 1000),
    },
    {
      domain: "youtube.com",
      durationMs: 10 * 60 * 1000,
      timestamp: new Date(startOfDay.getTime() + 10 * 60 * 60 * 1000),
    },
  ].map((s) => ({
    userId,
    domain: s.domain,
    durationMs: s.durationMs,
    category: categorizeSite(s.domain),
    timestamp: s.timestamp,
  }));

  const result = await Session.insertMany(sessions);
  console.log(`✅ Inserted ${result.length} sessions for today`);

  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("❌ Seed error:", err);
  await mongoose.connection.close();
  process.exit(1);
});
