const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // 🔥 MUY IMPORTANTE

// DATABASE
const db = new sqlite3.Database("./database.db");

// TABLE
db.run(`
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  age INTEGER
)
`);

// ---------------- STUDENTS CRUD ----------------

app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/students", (req, res) => {
  const { name, age } = req.body;
  db.run("INSERT INTO students(name, age) VALUES (?, ?)", [name, age], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ id: this.lastID });
  });
});

app.put("/students/:id", (req, res) => {
  const { name, age } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE students SET name = ?, age = ? WHERE id = ?",
    [name, age, id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM students WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});

// ---------------- STATS ----------------
app.get("/stats", (req, res) => {
  db.get("SELECT COUNT(*) as total FROM students", (err, row) => {
    res.json({ totalStudents: row.total });
  });
});

// ---------------- LOGIN ----------------
const users = [{ username: "admin", password: "1234" }];

app.post("/login", (req, res) => {
  console.log("LOGIN BODY:", req.body); // DEBUG

  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ message: "Login OK" });
});

// SERVER
app.listen(3000, () => {
  console.log("SERVER LOADED");
  console.log("Backend running on http://localhost:3000");
});