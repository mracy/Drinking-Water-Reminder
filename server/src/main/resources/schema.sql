CREATE DATABASE IF NOT EXISTS water_db;
USE water_db;

CREATE TABLE water_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount INT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
