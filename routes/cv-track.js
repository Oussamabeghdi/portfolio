const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const counterPath = path.join(__dirname, "../cv_clicks.json");

if (!fs.existsSync(counterPath)) {
  fs.writeFileSync(counterPath, JSON.stringify({ clicks: 0 }));
}

router.post("/track-cv", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(counterPath, "utf8"));
    data.clicks += 1;
    fs.writeFileSync(counterPath, JSON.stringify(data));
    res.status(200).json({ message: "Click enregistré" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur de tracking" });
  }
});

router.get("/cv-stats", (req, res) => {
  const data = JSON.parse(fs.readFileSync(counterPath, "utf8"));
  res.json(data);
});

module.exports = router;
