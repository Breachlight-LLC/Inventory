// server.js
import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
const port = 3000;

// Configure PostgreSQL connection
const pool = new pkg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventory',
  password: 'CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  quantity INT
);
',
  port: 5432,
});

// EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store static assets
app.use(express.static("public"));

// Routes
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM items');
  const items = result.rows;
  res.render('index', { items });
});

app.get('/api/items', async (req, res) => {
  const result = await pool.query('SELECT * FROM items');
  const items = result.rows;
  res.json(items);
});

app.post('/api/items', async (req, res) => {
  const { name, quantity } = req.body;
  const result = await pool.query('INSERT INTO items (name, quantity) VALUES ($1, $2) RETURNING *', [name, quantity]);
  const newItem = result.rows[0];
  res.json(newItem);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
