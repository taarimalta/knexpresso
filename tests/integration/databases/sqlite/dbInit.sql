-- SQLite database initialization script

-- Drop tables if they exist to ensure a clean state
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;

-- Create the 'users' table
CREATE TABLE users (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       name TEXT NOT NULL,
                       email TEXT UNIQUE NOT NULL
);

-- Create the 'orders' table
CREATE TABLE orders (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        amount REAL NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the 'addresses' table
CREATE TABLE addresses (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           user_id INTEGER NOT NULL,
                           street TEXT NOT NULL,
                           city TEXT NOT NULL,
                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert initial test data
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com'), ('Bob', 'bob@example.com');
INSERT INTO orders (user_id, amount) VALUES (1, 250.00), (2, 150.50);
INSERT INTO addresses (user_id, street, city) VALUES (1, '123 Main St', 'Wonderland'), (2, '456 Elm St', 'Springfield');
