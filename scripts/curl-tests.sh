#!/bin/sh

# Wait for the localhost server to be available
echo "Waiting for localhost service to be available on port 3000..."

while ! nc -z localhost 3000; do
  sleep 2
done

echo "localhost service is available. Starting curl tests..."

# Basic test to check if the API can fetch all users
echo "Testing: Fetch all users"
curl -s -X GET http://localhost:3000/api/users | grep '"status":"success"' && echo "PASS" || echo "FAIL"

# Test to fetch a single user by ID
echo "Testing: Fetch user by ID"
curl -s -X GET "http://localhost:3000/api/users?id=1" | grep '"status":"success"' && echo "PASS" || echo "FAIL"

# Test to fetch orders for a specific user
echo "Testing: Fetch orders for a user"
curl -s -X GET "http://localhost:3000/api/orders?user_id=1" | grep '"status":"success"' && echo "PASS" || echo "FAIL"

# Test for non-existent route
echo "Testing: Non-existent route"
curl -s -X GET "http://localhost:3000/api/nonexistent" | grep '"status":"error"' && echo "PASS" || echo "FAIL"

# Test to check if user exists
echo "Testing: Check if user exists by email"
curl -s -X GET "http://localhost:3000/api/users?exists=true&email=alice@example.com" | grep '"exists":true' && echo "PASS" || echo "FAIL"

# Test to count the number of users
echo "Testing: Count number of users"
curl -s -X GET "http://localhost:3000/api/users?count=true" | grep '"count":2' && echo "PASS" || echo "FAIL"

echo "Curl tests completed."
