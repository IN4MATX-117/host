const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: 'localhost', // Change this to your MySQL host
  user: 'testuser', // Change this to your MySQL username
  password: 'My6$Password', // Change this to your MySQL password
  database: 'inf117', // Change this to your MySQL database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Define routes

// Example route to fetch data from MySQL
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM data', (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error fetching data from MySQL' });
      return;
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
