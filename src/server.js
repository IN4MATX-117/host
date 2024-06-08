const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: 'localhost', // Change this to your MySQL host
  user: 'root', // Change this to your MySQL username
  password: '', // Change this to your MySQL password
  database: 'uci_alumni', // Change this to your MySQL database name
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

  const query = `
    SELECT 
        P.ID AS id, 
        P.Personal_CIK AS CIK, 
        P.Name AS name, 
        P.NumberOfShares AS amount,
        C.Company_name AS Company, 
        GROUP_CONCAT(DISTINCT F.SECFormType) AS forms,
        MAX(F.FilingDate) AS date
    FROM persons P
    LEFT JOIN fillinglinks F ON P.Personal_CIK = F.Personal_CIK
    LEFT JOIN company C ON P.Company_CIK = C.Company_CIK
    WHERE P.WithName = 'Yes'
    GROUP BY P.ID, P.Personal_CIK, P.Name, C.Company_name;
  `;

  connection.query(query, (error, results) => {
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
