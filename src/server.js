const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: 'localhost', // Change this to your MySQL host
  user: 'mytestuser', // Change this to your MySQL username
  password: 'My6$Password', // Change this to your MySQL password
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
        MAX(F.FilingDate) AS date,
        P.Status AS status
    FROM persons P
    LEFT JOIN fillinglinks F ON P.Personal_CIK = F.Personal_CIK
    LEFT JOIN company C ON P.Company_CIK = C.Company_CIK
    WHERE P.WithName = 'Yes'
    GROUP BY P.ID, P.Personal_CIK, P.Name, C.Company_name, P.Status;
  `;

  connection.query(query, (error, results) => {
    console.log('Executing MySQL query:', query);
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error fetching data from MySQL' });
      return;
    }
    res.json(results);
  });
});

// Route to fetch partial names
app.get('/api/partial-names', (req, res) => {
  const query = `
    SELECT 
        P.ID AS id, 
        P.Personal_CIK AS CIK, 
        P.Name AS name, 
        P.Bio AS bio, 
        P.UML AS URL
    FROM persons P
    LEFT JOIN fillinglinks F ON P.Personal_CIK = F.Personal_CIK
    WHERE P.WithName = 'No';
  `;

  connection.query(query, (error, results) => {
    console.log('Executing MySQL query:', query);
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error fetching partial names from MySQL' });
      return;
    }
    res.json(results);
  });
});


// Route to update status
app.put('/api/update-status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = 'UPDATE persons SET Status = ? WHERE ID = ?';
  connection.query(query, [status, id], (error, results) => {
    console.log('Executing MySQL query:', query, [status, id]);
    if (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Error updating status' });
      return;
    }
    // Fetch the updated row to return the updated status
    connection.query('SELECT Status FROM persons WHERE ID = ?', [id], (error, results) => {
      if (error) {
        console.error('Error fetching updated status:', error);
        res.status(500).json({ error: 'Error fetching updated status' });
        return;
      }
      res.json({ success: true, status: results[0].Status });
    });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
