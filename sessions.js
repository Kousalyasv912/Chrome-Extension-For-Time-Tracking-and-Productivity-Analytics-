const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// POST /api/sessions — save a single session
router.post("/", async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/sessions/batch — save multiple sessions
router.post("/batch", async (req, res) => {
  try {
    const sessions = await Session.insertMany(req.body);
    res.status(201).json(sessions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/sessions/summary — aggregate totals
router.get("/summary", async (req, res) => {
  try {
    const summary = await Session.aggregate([
      {
        $group: {
          _id: "$site",
          productiveMinutes: {
            $sum: {
              $cond: [{ $eq: ["$category", "productive"] }, "$duration", 0]
            }
          },
          unproductiveMinutes: {
            $sum: {
              $cond: [{ $eq: ["$category", "unproductive"] }, "$duration", 0]
            }
          }
        }
      },
      {
        $project: {
          site: "$_id",
          productiveMinutes: 1,
          unproductiveMinutes: 1,
          totalMinutes: {
            $add: ["$productiveMinutes", "$unproductiveMinutes"]
          },
          _id: 0
        }
      },
      { $sort: { totalMinutes: -1 } }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
