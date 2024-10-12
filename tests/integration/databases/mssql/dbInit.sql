-- MSSQL database initialization script

-- Drop tables if they exist to ensure a clean state
IF OBJECT_ID('dbo.addresses', 'U') IS NOT NULL DROP TABLE addresses;
IF OBJECT_ID('dbo.orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE users;

-- Create the 'users' table
CREATE TABLE users (
                       id INT IDENTITY(1,1) PRIMARY KEY,
                       name NVARCHAR(255) NOT NULL,
                       email NVARCHAR(255) UNIQUE NOT NULL
);

-- Create the 'orders' table
CREATE TABLE orders (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        user_id INT NOT NULL,
                        amount DECIMAL(10, 2) NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the 'addresses' table
CREATE TABLE addresses (
                           id INT IDENTITY(1,1) PRIMARY KEY,
                           user_id INT NOT NULL,
                           street NVARCHAR(255) NOT NULL,
                           city NVARCHAR(255) NOT NULL,
                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert initial test data
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com'), ('Bob', 'bob@example.com');
INSERT INTO orders (user_id, amount) VALUES (1, 250.00), (2, 150.50);
INSERT INTO addresses (user_id, street, city) VALUES (1, '123 Main St', 'Wonderland'), (2, '456 Elm St', 'Springfield');
