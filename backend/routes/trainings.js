const express = require("express");
const router = express.Router();
const db = require("../db");

// GET trainings
router.get("/", (req, res) => {
  db.all("SELECT * FROM Trainings", [], (err, rows) => {
    if (err) res.status(500).json(err);
    else res.json(rows);
  });
});

// POST training
router.post("/", (req, res) => {
  const { date, coach } = req.body;
  db.run("INSERT INTO Trainings (date, coach) VALUES (?, ?)", [date, coach]);
  res.send("Training added");
});

module.exports = router;