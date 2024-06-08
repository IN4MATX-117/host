CREATE DATABASE IF NOT EXISTS UCI_Alumni;
USE UCI_Alumni;

CREATE TABLE IF NOT EXISTS Persons (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Personal_CIK INT,
    Name VARCHAR(255),
    Parsing_name VARCHAR(255),
    Company_CIK VARCHAR(255),
    Bio LONGTEXT,
    UML VARCHAR(255),
	NumberOfShares BIGINT NULL,
    Note LONGTEXT, 
    Status VARCHAR(255), 
    WithName VARCHAR(255),
    INDEX (Personal_CIK), 
	INDEX (Company_CIK) 
);

CREATE TABLE IF NOT EXISTS Fillings (
    FilingID INT AUTO_INCREMENT PRIMARY KEY,
    Personal_CIK INT,
    StockType ENUM('Direct', 'Indirect'),
    SharePrice DECIMAL(10, 2),
    TransactionType CHAR(1),  -- Can be 'A' or 'D' for Acquisition or Disposition
    FOREIGN KEY (personal_CIK) REFERENCES Persons(personal_CIK)
);

-- Storing links to filings, with unique identifiers for each link
CREATE TABLE IF NOT EXISTS FillingLinks (
    LinkID INT AUTO_INCREMENT PRIMARY KEY,
    personal_CIK INT NOT NULL,
    SECFormType VARCHAR(10),
    FilingDate DATE NULL,
    Link VARCHAR(255),
    FOREIGN KEY (personal_CIK) REFERENCES Persons(personal_CIK)
);

CREATE TABLE IF NOT EXISTS Company (
    Company_CIK VARCHAR(255) PRIMARY KEY,
    Company_name VARCHAR(255), 
    StockTicker VARCHAR(10), 
    FOREIGN KEY (Company_CIK) REFERENCES Persons(Company_CIK)
);

CREATE TABLE IF NOT EXISTS CIK_Search (
   ID INT AUTO_INCREMENT PRIMARY KEY,
   Name VARCHAR(255), 
   CIK VARCHAR(255)
);
