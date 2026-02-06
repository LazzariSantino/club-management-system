const express = require("express");
const router = express.Router();
const db = require("../db");

// GET students
router.get("/", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) res.status(500).json(err);
    else res.json(rows);
  });
});

// POST student
router.post("/", (req, res) => {
  const { name, age } = req.body;
  db.run("INSERT INTO students (name, age) VALUES (?, ?)", [name, age]);
  res.send("Student added");
});

module.exports = router;