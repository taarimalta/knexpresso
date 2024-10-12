#!/bin/bash

databases=("postgres" "mysql" "mssql" "sqlite")

for db in "${databases[@]}"
do
  echo "Starting integration tests for $db..."
  docker-compose -f docker-compose.test.yml up -d $db
  sleep 20 # Wait for the database to be ready, adjust as needed
  pnpm test --config jest.integration.config.js --db=$db
  docker-compose -f docker-compose.test.yml down
done
