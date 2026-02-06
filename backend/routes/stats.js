const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.get("SELECT COUNT(*) as totalStudents FROM students", [], (err, row) => {
    if (err) res.status(500).json(err);
    else res.json(row);
  });
});

module.exports = router;