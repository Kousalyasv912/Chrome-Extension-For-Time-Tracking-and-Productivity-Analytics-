const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// Get totals for productive vs unproductive
router.get("/summary/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Session.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$productive",
          totalDuration: { $sum: "$durationMs" }
        }
      }
    ]);

    // Convert ms → minutes
    let productiveMinutes = 0;
    let unproductiveMinutes = 0;

    result.forEach(r => {
      if (r._id === true) {
        productiveMinutes = r.totalDuration / 60000;
      } else {
        unproductiveMinutes = r.totalDuration / 60000;
      }
    });

    const totalMinutes = productiveMinutes + unproductiveMinutes;

    res.json({
      totalMinutes,
      productiveMinutes,
      unproductiveMinutes
    });
  } catch (err) {
    console.error("Error in summary:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// Get breakdown by category
router.get("/categories/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Session.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$category",
          totalDuration: { $sum: "$durationMs" }
        }
      }
    ]);

    const categories = result.map(r => ({
      category: r._id || "unknown",
      minutes: r.totalDuration / 60000
    }));

    res.json(categories);
  } catch (err) {
    console.error("Error in categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

module.exports = router;
