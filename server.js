initTracer(); // This line must come before importing any instrumented module.
import pkg from 'dd-trace';
const { init: initTracer } = pkg;

import express from "express";
import bodyParser from "body-parser";
import pkgg from 'pg';
const {Pool} = pkgg;

const app = express();
const port = 80;

const pool = new Pool({
    user: "",
    host: "",
    database: "",
    password: "",
    port: ,
    // connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  const db = await pool.connect();

// Configure PostgreSQL connection
// const db = new pg.Client({
//   user: "postgres",
//   host: "",
//   database: "",
//   password: "",
//   port: ,
// });
// db.connect();

// Middleware
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Store static assets
app.use(express.static("public"));
app.use(express.static("assets"));

// Routes Injecting broken route for testing
app.get("/api", async (req, res) => {
  const result = await db.query("SELECT * FROM items");
  const items = result.rows;
  res.render("index.ejs", { items });
});

app.get("/api/items", async (req, res) => {
  const result = await db.query("SELECT * FROM items");
  const items = result.rows;
  res.json(items);
});

app.post("/api/items", async (req, res) => {
  const { name, quantity } = req.body;
  const result = await db.query(
    "INSERT INTO items (name, quantity) VALUES ($1, $2) RETURNING *",
    [name, quantity]
  );
  const newItem = result.rows[0];
//   res.json(newItem);
  res.send('<a href="/">Return home</a><br><a href="/api/items">See JSON return</a>');
//   console.log(result);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
