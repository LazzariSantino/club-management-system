const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./club.db", (err) => {
  if (err) console.log(err);
  else console.log("Connected to SQLite database");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Trainings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      coach TEXT
    )
  `);
});

module.exports = db;