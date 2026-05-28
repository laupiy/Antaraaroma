const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Syahrinaalmaf26",
  database: "antararoma",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database Connected!");
  }
});

app.get("/reviews", (req, res) => {
  db.query("SELECT * FROM reviews", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/reviews", (req, res) => {
  const { name, rating, comment } = req.body;

  db.query(
    "INSERT INTO reviews (name, rating, comment) VALUES (?, ?, ?)",
    [name, rating, comment],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Review added!");
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});