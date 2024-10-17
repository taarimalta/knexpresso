-- Switch to the knexpresso_db database
\c knexpresso_db;

-- Drop tables if they exist to ensure a clean state
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create the 'users' table
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL
);

-- Create the 'orders' table
CREATE TABLE orders (
                        id SERIAL PRIMARY KEY,
                        user_id INT REFERENCES users(id) ON DELETE CASCADE,
                        amount NUMERIC(10, 2) NOT NULL
);

-- Create the 'addresses' table
CREATE TABLE addresses (
                           id SERIAL PRIMARY KEY,
                           user_id INT REFERENCES users(id) ON DELETE CASCADE,
                           street VARCHAR(255) NOT NULL,
                           city VARCHAR(255) NOT NULL
);
