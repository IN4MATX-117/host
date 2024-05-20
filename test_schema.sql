CREATE DATABASE INF117;
USE INF117;

CREATE TABLE data (
    id VARCHAR(255) PRIMARY KEY,
    amount INT,
    name VARCHAR(255),
    CIK VARCHAR(255),
    forms VARCHAR(255),
    formlink VARCHAR(255)
);

-- Insert example data
INSERT INTO data (id, amount, name, CIK, forms, formlink) VALUES
('0001201633', 316, 'Samueli, Henry', '0001201633', '4', 'https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml'),
('0000000001', 242, 'A', '0000000001', '4', 'https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml'),
('0000000002', 837, 'B', '0000000002', '4', 'https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml'),
('0000000003', 874, 'C', '0000000003', '4', 'https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml'),
('0000000004', 721, 'D', '0000000004', '4', 'https://www.sec.gov/Archives/edgar/data/1730168/000110465924048357/xslF345X05/tm2412068-1_4seq1.xml');