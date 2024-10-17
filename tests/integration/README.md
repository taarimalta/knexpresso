# Integration Tests for Knexpresso

This README provides instructions on how to run the integration tests for the **Knexpresso** project. The integration tests are designed to verify that Knexpresso works correctly with various SQL databases, including PostgreSQL, MySQL, MSSQL, and SQLite.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Folder Structure](#folder-structure)
- [Setting Up Databases](#setting-up-databases)
- [Running Integration Tests](#running-integration-tests)
    - [Using the Makefile](#using-the-makefile)
    - [Running Tests Individually](#running-tests-individually)
- [Test Configurations](#test-configurations)
- [Adding New Tests](#adding-new-tests)
- [Troubleshooting](#troubleshooting)
- [Conclusion](#conclusion)

---

## Overview

The integration tests ensure that Knexpresso can:

- Connect to different SQL databases.
- Perform CRUD operations as expected.
- Handle database-specific quirks and behaviors.

These tests use Docker to spin up database instances and Jest with Supertest for testing the API endpoints.

---

## Prerequisites

Before running the integration tests, make sure you have the following installed:

- **Node.js** (v18+ recommended)
- **pnpm** (the package manager)

  ```bash
  npm install -g pnpm
  ```

- **Docker** and **Docker Compose**

  Ensure Docker is running on your system. You can verify this by running:

  ```bash
  docker --version
  docker compose version
  ```

- **Make**

  Most Unix-like systems come with `make` installed. For Windows users, consider using Git Bash or WSL.

---

## Folder Structure

Here's an overview of the `tests/integration` folder:

- **configs/**: Contains Knexpresso configuration files for each database.
- **databases/**: Contains database-specific integration tests and initialization scripts.
    - **postgres/**
        - `postgres.knexpresso.integration.test.ts`
        - `dbInit.sql`
    - **mysql/**
        - `mysql.knexpresso.integration.test.ts`
        - `dbInit.sql`
    - **mssql/**
        - `mssql.knexpresso.integration.test.ts`
        - `dbInit.sql`
    - **sqlite/**
        - `sqlite.knexpresso.integration.test.ts`
        - `dbInit.sql`
- **common/**: Contains shared utilities, test cases, and setup/cleanup scripts.
    - `testUtils.ts`
    - `testCases.ts`
    - `setup.ts`
    - `cleanup.ts`
- **scripts/**: Contains helper scripts for running tests.
    - `run-all-integration-tests.sh`
- **docker-compose.yml**: Docker Compose file for spinning up database containers.
- **Makefile**: Simplifies running tests and managing Docker services.

---

## Setting Up Databases

The integration tests use Docker to run database instances. The `docker-compose.yml` file defines services for:

- PostgreSQL
- MySQL
- MSSQL
- SQLite (runs in memory; no Docker service needed)

---

## Running Integration Tests

### Using the Makefile

The easiest way to run the integration tests is by using the provided `Makefile`. This file contains predefined commands to manage the test environment and execute tests.

1. **Start All Database Services**

   Before running the tests, start the database services:

   ```bash
   make up
   ```

   This command uses Docker Compose to spin up the necessary database containers.

2. **Run All Integration Tests**

   To run tests against all supported databases:

   ```bash
   make test-all
   ```

   This command executes the `run-all-integration-tests.sh` script, which iterates over each database, runs its tests, and tears down the services afterward.

3. **Stop All Database Services**

   After running the tests, you can stop the database services:

   ```bash
   make down
   ```

   Or, to stop services and clean up resources:

   ```bash
   make clean
   ```

#### Makefile Commands

- **`make up`**: Start all database services.
- **`make down`**: Stop all database services.
- **`make test-all`**: Run all integration tests for all databases.
- **`make test-postgres`**: Run integration tests for PostgreSQL.
- **`make test-mysql`**: Run integration tests for MySQL.
- **`make test-mssql`**: Run integration tests for MSSQL.
- **`make test-sqlite`**: Run integration tests for SQLite.
- **`make clean`**: Stop all services and clean up resources.
- **`make help`**: Display help information.

### Running Tests Individually

If you prefer to run tests individually without using the Makefile, follow these steps:

1. **Start the Specific Database Service**

   For example, to test PostgreSQL:

   ```bash
   docker compose -f tests/integration/docker-compose.yml up -d postgres
   ```

2. **Wait for the Database to be Ready**

   Databases may take a few seconds to initialize. Use `sleep` or a health check script to wait.

   ```bash
   sleep 20  # Adjust the duration as needed
   ```

3. **Run the Integration Test**

   ```bash
   pnpm test tests/integration/databases/postgres/postgres.knexpresso.integration.test.ts
   ```

4. **Stop the Database Service**

   ```bash
   docker compose -f tests/integration/docker-compose.yml down
   ```

---

## Test Configurations

Each database has its own Knexpresso configuration file located in `tests/integration/configs/`. These configurations define how Knexpresso connects to the database and which tables are exposed.

- **PostgreSQL**: `postgres.knexpressoConfig.ts`
- **MySQL**: `mysql.knexpressoConfig.ts`
- **MSSQL**: `mssql.knexpressoConfig.ts`
- **SQLite**: `sqlite.knexpressoConfig.ts`

Ensure that the `client` property in each configuration matches the correct database client:

- PostgreSQL: `'pg'`
- MySQL: `'mysql2'` (recommended over `'mysql'`)
- MSSQL: `'mssql'`
- SQLite: `'sqlite3'`

---

## Adding New Tests

To add new integration tests:

1. **Create a New Test File**

   Place your test file in the appropriate database directory under `tests/integration/databases/`.

2. **Write Your Tests**

   Use Jest and Supertest to write your integration tests. You can import common utilities from `tests/integration/common/testUtils.ts`.

3. **Update Initialization Scripts**

   If your tests require changes to the database schema or initial data, update the `dbInit.sql` file in the corresponding database directory.

4. **Run the Tests**

   Use the Makefile or run the tests manually as described above.

---

## Troubleshooting

### Database Connection Issues

- **Ensure Docker Services Are Running**

  Verify that the database containers are running:

  ```bash
  docker ps
  ```

- **Check Port Conflicts**

  Make sure the ports defined in `docker-compose.yml` are not in use by other services.

### Tests Fail Due to Timeout

- **Increase Sleep Duration**

  Databases may take longer to initialize on some systems. Increase the `sleep` duration in the Makefile or scripts.

- **Use Health Checks**

  Implement health checks to wait until the database is ready before running tests.

### Common Errors

- **`ECONNREFUSED` or `ENOTFOUND`**

  These errors indicate that the application cannot connect to the database. Ensure the database service is running and accessible.

- **`Knex: run\n$ npm install mssql`**

  If you see this error when testing MSSQL, make sure the `mssql` package is installed:

  ```bash
  pnpm install mssql
  ```

---

## Conclusion

Running integration tests is crucial to ensure that Knexpresso functions correctly across different SQL databases. By following the steps outlined in this README, you can set up the testing environment, execute tests, and troubleshoot common issues.

Feel free to contribute by adding new tests or improving existing ones. If you encounter any issues, please reach out or open an issue in the repository.

---

Happy Testing!