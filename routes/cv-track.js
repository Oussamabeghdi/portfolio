const express = require("express");
const router = express.Router();
// const fs = require("fs");
// const path = require("path");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const cvSchema = new mongoose.Schema({
  clicks: { type: Number, default: 0 },
});
const CvStat = mongoose.model("CvStat", cvSchema);
async function initCounter() {
  const existing = await CvStat.findOne();
  if (!existing) {
    await CvStat.create({ clicks: 0 });
  }
}
initCounter();
router.post("/track-cv", async (req, res) => {
  try {
    const stat = await CvStat.findOne();
    stat.clicks += 1;
    await stat.save();
    res.json({ message: "Click enregistré", clicks: stat.clicks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur de tracking" });
  }
});

router.get("/cv-stats", async (req, res) => {
  const stat = await CvStat.findOne();
  res.json({ clicks: stat?.clicks || 0 });
});

module.exports = router;
