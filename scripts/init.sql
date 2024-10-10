-- Create the 'users' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables WHERE tablename = 'users') THEN
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE
);
RAISE NOTICE 'Table users created.';
ELSE
        RAISE NOTICE 'Table users already exists.';
END IF;
END $$;

-- Create the 'orders' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables WHERE tablename = 'orders') THEN
CREATE TABLE orders (
                        id SERIAL PRIMARY KEY,
                        user_id INT NOT NULL REFERENCES users(id),
                        amount NUMERIC NOT NULL
);
RAISE NOTICE 'Table orders created.';
ELSE
        RAISE NOTICE 'Table orders already exists.';
END IF;
END $$;

-- Create the 'addresses' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables WHERE tablename = 'addresses') THEN
CREATE TABLE addresses (
                           id SERIAL PRIMARY KEY,
                           user_id INT NOT NULL REFERENCES users(id),
                           street VARCHAR(255) NOT NULL,
                           city VARCHAR(255) NOT NULL
);
RAISE NOTICE 'Table addresses created.';
ELSE
        RAISE NOTICE 'Table addresses already exists.';
END IF;
END $$;

-- Optional: Insert test data if tables were created
INSERT INTO users (name, email) VALUES
                                    ('Alice', 'alice@example.com'),
                                    ('Bob', 'bob@example.com')
    ON CONFLICT DO NOTHING;

INSERT INTO orders (user_id, amount) VALUES
                                         (1, 250.00),
                                         (2, 150.50)
    ON CONFLICT DO NOTHING;

INSERT INTO addresses (user_id, street, city) VALUES
                                                  (1, '123 Main St', 'Wonderland'),
                                                  (2, '456 Elm St', 'Springfield')
    ON CONFLICT DO NOTHING;

-- Verify if the 'users' table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_catalog.pg_tables WHERE tablename = 'users') THEN
        RAISE NOTICE 'Verification: Table users exists.';
ELSE
        RAISE NOTICE 'Verification Failed: Table users does not exist.';
END IF;
END $$;

-- Verify if the 'orders' table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_catalog.pg_tables WHERE tablename = 'orders') THEN
        RAISE NOTICE 'Verification: Table orders exists.';
ELSE
        RAISE NOTICE 'Verification Failed: Table orders does not exist.';
END IF;
END $$;

-- Verify if the 'addresses' table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_catalog.pg_tables WHERE tablename = 'addresses') THEN
        RAISE NOTICE 'Verification: Table addresses exists.';
ELSE
        RAISE NOTICE 'Verification Failed: Table addresses does not exist.';
END IF;
END $$;
