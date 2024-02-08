// server.js
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Configure PostgreSQL connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "inventory",
  password: "15220227",
  port: 5432,
});
db.connect();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store static assets
app.use(express.static("public"));

// Routes
app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items");
  const items = result.rows;
  res.render("index.ejs", { items });
});

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items");
  const items = result.rows;
  res.json(items);
  res.render("index.ejs", { items });
});

app.post("/api/items", async (req, res) => {
  const { name, quantity } = req.body;
  const result = await db.query(
    "INSERT INTO items (name, quantity) VALUES ($1, $2) RETURNING *",
    [name, quantity]
  );
  const newItem = result.rows[0];
  res.json(newItem);
  console.log(result);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});