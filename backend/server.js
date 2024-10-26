const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST new product
app.post('/api/products', async (req, res) => {
  const { name, description, price, quantity } = req.body;
  try {
    await pool.query('INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4)', 
                     [name, description, price, quantity]);
    res.status(201).send('Product added');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  try {
    await pool.query('UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5', 
                     [name, description, price, quantity, id]);
    res.send('Product updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.send('Product deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
