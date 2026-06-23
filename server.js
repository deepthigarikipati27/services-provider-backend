const express = require("express");
const cors = require("cors");
const db = require("./db/database");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// AUTH ROUTES
app.use("/api/auth", authRoutes);

console.log("AUTH ROUTES MOUNTED");

// HOME
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// TEST
app.get("/test", (req, res) => {
  res.send("MAIN TEST WORKING");
});

// ROUTES TEST
app.get("/routes-test", (req, res) => {
  res.send("Routes Loaded");
});

// USERS
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// TABLES
app.get("/tables", (req, res) => {
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table'",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(rows);
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});