// server.js
// This line must come before importing any instrumented module.
// const tracer = require('dd-trace').init()
// import { init as initTracer } from 'dd-trace';
import pkg from 'dd-trace';
const { init: initTracer } = pkg;
import express from "express";
import bodyParser from "body-parser";
// import {Pool} from "pg";
import pkgg from 'pg';
const {Pool} = pkgg;

const app = express();
const port = 3000;

const pool = new Pool({
    user: "kevin.d.jones.jr",
    host: "ep-round-moon-a4wa62f7.us-east-1.aws.neon.tech",
    database: "inventory",
    password: "pvTk4xGnrM7O",
    port: 5432,
    
    // connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  const db = await pool.connect();

// Configure PostgreSQL connection
// const db = new pg.Client({
//   user: "postgres",
//   host: "inventorydb.ckijnvawubo6.us-east-1.rds.amazonaws.com",
//   database: "inventory",
//   password: "12345678",
//   port: 5432,
// });
// db.connect();

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
