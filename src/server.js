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
        P.Status AS status,
        COALESCE(
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'id', F.LinkID,
                  'type', F.SECFormType,
                  'URL', F.Link,
                  'filingDate', F.FilingDate
              )
          ), JSON_ARRAY()
        ) AS formList
    FROM persons P
    LEFT JOIN fillinglinks F ON P.Personal_CIK = F.Personal_CIK
    LEFT JOIN company C ON P.Company_CIK = C.Company_CIK
    WHERE P.WithName = 'Yes'
    GROUP BY P.ID, P.Personal_CIK, P.Name, C.Company_name, P.Status;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Error fetching data from MySQL' });
      return;
    }
    res.json(results.map(result => ({
      ...result,
      formList: JSON.parse(result.formList)
    })));
  });
});

// Route to fetch partial names
app.get('/api/partial-names', (req, res) => {
  const query = `
    SELECT 
        P.ID AS id, 
        P.Personal_CIK AS CIK, 
        P.Parsing_name AS name, 
        P.Bio AS bio, 
        P.UML AS URL
    FROM persons P
    LEFT JOIN fillinglinks F ON P.Personal_CIK = F.Personal_CIK
    WHERE P.WithName = 'No'
        AND (P.Parsing_name IS NOT NULL AND P.Parsing_name <> '' 
           OR P.Bio IS NOT NULL AND P.Bio <> '' AND P.Bio <> 'N/A')
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

// Fetch comments for a specific person
app.get('/api/comments/:personId', (req, res) => {
  const { personId } = req.params;
  const query = 'SELECT * FROM Comments WHERE PersonID = ?';
  connection.query(query, [personId], (error, results) => {
    if (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Error fetching comments' });
      return;
    }
    res.json(results);
  });
});

// Add a new comment
app.post('/api/comments', (req, res) => {
  const { personId, comment } = req.body;
  const query = 'INSERT INTO Comments (PersonID, Comment) VALUES (?, ?)';
  connection.query(query, [personId, comment], (error, results) => {
    if (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Error adding comment' });
      return;
    }
    res.json({ success: true, commentId: results.insertId });
  });
});

// Update a comment
app.put('/api/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const query = 'UPDATE Comments SET Comment = ? WHERE CommentID = ?';
  connection.query(query, [comment, commentId], (error, results) => {
    if (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ error: 'Error updating comment' });
      return;
    }
    res.json({ success: true });
  });
});



// Route to update status
// Route to update status
app.put('/api/update-status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = 'UPDATE persons SET Status = ? WHERE ID = ?';
  connection.query(query, [status, id], (error, results) => {
    if (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Error updating status' });
      return;
    }
    res.json({ success: true });
  });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
