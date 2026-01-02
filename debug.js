const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Session.aggregate([
      {
        $group: {
          _id: "$domain",
          productiveMinutes: {
            $sum: {
              $cond: [{ $eq: ["$productive", true] }, { $divide: ["$durationMs", 60000] }, 0]
            }
          },
          unproductiveMinutes: {
            $sum: {
              $cond: [{ $eq: ["$productive", false] }, { $divide: ["$durationMs", 60000] }, 0]
            }
          }
        }
      }
    ]);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
