-- the database schema that using to connect to the Frontend

CREATE DATABASE IF NOT EXISTS Main_database;
USE Main_database;

-- Table for storing person's bio and identification
CREATE TABLE IF NOT EXISTS Persons (
    CIK INT PRIMARY KEY,
    Name VARCHAR(255) Null,
    Company VARCHAR(255) Null,
    StockTicker VARCHAR(10) Null, 
    Bio VARCHAR(255) Null, 
    Note VARCHAR(255) Null
);

-- Storing transactions and SEC filings, with unique identifiers for each filing
CREATE TABLE IF NOT EXISTS Filings (
    FilingID INT AUTO_INCREMENT PRIMARY KEY,
    CIK INT NOT NULL,
    StockType ENUM('Direct', 'Indirect') NULL,
    NumberOfShares BIGINT NULL,
    SharePrice DECIMAL(10, 2) NULL,
    TransactionType CHAR(1),  -- Can be 'A' or 'D' for Acquisition or Disposition
    TotalPrice BIGINT NULL,
    FOREIGN KEY (CIK) REFERENCES Persons(CIK)
);

-- Storing links to filings, with unique identifiers for each link
CREATE TABLE IF NOT EXISTS FilingLinks (
    LinkID INT AUTO_INCREMENT PRIMARY KEY,
    CIK INT NOT NULL,
    SECFormType VARCHAR(10) NULL,
    FilingDate DATE NULL,
    Link VARCHAR(255) NULL,
    FOREIGN KEY (CIK) REFERENCES Persons(CIK)
);


ALTER TABLE Persons
ADD COLUMN Status VARCHAR(255) NULL;
ALTER TABLE Persons MODIFY COLUMN Bio LONGTEXT NULL;