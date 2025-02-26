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
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'library_db' 
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
  const { bookName, isLost } = req.body;

  // SQL query to update the book status based on whether it was lost
  let sql;

  if (isLost) {
      // Mark the book as 'lost'
      sql = 'UPDATE books SET status = "lost" WHERE title = ?';
  } else {
      // Mark the book as 'available'
      sql = 'UPDATE books SET status = "available" WHERE title = ?';
  }

  // Execute the query to update the book status
  db.query(sql, [bookName], (err, result) => {
      if (err) {
          console.error('Error updating book status:', err);
          res.json({ success: false, message: 'Error updating the book status.' });
      } else {
          res.json({ success: true, message: 'Book status updated successfully!' });
      }
  });
});

// API endpoint to fetch all available books
app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM books';
  db.all(sql, [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
});

app.post('/books', (req, res) => {
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

app.post('/submit-donation', (req, res) => {
  const { bookName, author, firstName, lastName, donationDate } = req.body;

  // SQL query to insert the donated book into the books table
  const sql = 'INSERT INTO books (title, author, status, donatedBy, donationDate) VALUES (?, ?, "available", ?, ?)';

  // Combine first and last name for the donor
  const donorName = `${firstName} ${lastName}`;

  // Execute the query to insert the new book
  db.query(sql, [bookName, author, donorName, donationDate], (err, result) => {
      if (err) {
          console.error('Error inserting donated book:', err);
          res.json({ success: false, message: 'Error donating the book.' });
      } else {
          res.json({ success: true, message: 'Book donated successfully!' });
      }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

