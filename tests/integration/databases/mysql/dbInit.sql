-- MySQL database initialization script

-- Drop tables if they exist to ensure a clean state
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;

-- Create the 'users' table
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL
);

-- Create the 'orders' table
CREATE TABLE orders (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        amount DECIMAL(10, 2) NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the 'addresses' table
CREATE TABLE addresses (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           user_id INT NOT NULL,
                           street VARCHAR(255) NOT NULL,
                           city VARCHAR(255) NOT NULL,
                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
