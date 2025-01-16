const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;
const express = require('express');
const mysql = require('mysql2');
const app = express();

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',     // Replace with your MySQL host (usually 'localhost' for local dev)
  user: 'root',          // Replace with your MySQL user
  password: '',          // Replace with your MySQL password
  database: 'library_db' // Replace with your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
  }
  console.log('Connected to MySQL');
});

app.post('/submit-checkin', (req, res) => {
  const { bookName, personName, lostBook } = req.body;

  if (lostBook) {
      console.log(`The book "${bookName}" was reported lost by ${personName}.`);
      // Handle lost book logic here (e.g., update database, notify library staff, etc.)
  } else {
      console.log(`${personName} checked in the book "${bookName}".`);
      // Handle normal check-in logic here (e.g., update database, mark book as returned)
  }

  res.send('Check-in submitted successfully.');
});

// API endpoint to fetch all available books
app.get('/api/books', (req, res) => {
  const sql = 'SELECT * FROM books';
  db.all(sql, [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
});

app.post('/api/books', (req, res) => {
  const { title } = req.body;
  if (!title) {
      return res.status(400).json({ error: 'Book title is required' });
  }

  const sql = 'INSERT INTO books (title) VALUES (?)';
  db.run(sql, [title], function (err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, title });
  });
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
