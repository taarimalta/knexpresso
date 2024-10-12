# Variables
DOCKER_COMPOSE := docker compose
DOCKER_COMPOSE_FILE := tests/integration/docker-compose.yml
TEST_SCRIPT := ./tests/integration/scripts/run-all-integration-tests.sh
JEST_CONFIG := jest.integration.config.js

# Phony targets to ensure they run every time
.PHONY: all up down test-all test-postgres test-mysql test-mssql test-sqlite clean help

# Default target
all: help

# Help command
help:
	@echo "Makefile for running Knexpresso integration tests"
	@echo
	@echo "Commands:"
	@echo "  make up             - Start all database services"
	@echo "  make down           - Stop all database services"
	@echo "  make test-all       - Run all integration tests for all databases"
	@echo "  make test-postgres  - Run integration tests for PostgreSQL"
	@echo "  make test-mysql     - Run integration tests for MySQL"
	@echo "  make test-mssql     - Run integration tests for MSSQL"
	@echo "  make test-sqlite    - Run integration tests for SQLite"
	@echo "  make clean          - Stop all services and clean up resources"

# Start all database services
up:
	@echo "Starting all database services..."
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "All database services started."

# Stop all database services
down:
	@echo "Stopping all database services..."
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down
	@echo "All database services stopped."

# Run all integration tests
test-all: up
	@echo "Running all integration tests..."
	bash $(TEST_SCRIPT)
	@echo "All integration tests completed."

# Run PostgreSQL integration tests
test-postgres: up
	@echo "Running PostgreSQL integration tests..."
	sleep 20  # Wait for PostgreSQL to be ready
	pnpm test tests/integration/databases/postgres/postgres.knexpresso.integration.test.ts
	@echo "PostgreSQL integration tests completed."

# Run MySQL integration tests
test-mysql: up
	@echo "Running MySQL integration tests..."
	sleep 20  # Wait for MySQL to be ready
	pnpm test tests/integration/databases/mysql/mysql.knexpresso.integration.ts
	@echo "MySQL integration tests completed."

# Run MSSQL integration tests
test-mssql: up
	@echo "Running MSSQL integration tests..."
	sleep 30  # Wait for MSSQL to be ready
	pnpm test tests/integration/databases/mssql/mssql.knexpresso.integration.test.ts
	@echo "MSSQL integration tests completed."

# Run SQLite integration tests
test-sqlite: up
	@echo "Running SQLite integration tests..."
	sleep 5  # Give some time for initialization (SQLite runs in memory)
	pnpm test tests/integration/databases/sqlite/sqlite.knexpresso.integration.test.ts
	@echo "SQLite integration tests completed."

# Stop services and clean up resources
clean: down
	@echo "Clean up completed."
