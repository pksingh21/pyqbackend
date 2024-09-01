#!/bin/bash

# Variables
UPDATE_USER_URL="http://localhost:3000/api/users"
USER_ID="1" # Replace with actual user ID
COOKIE_FILE="cookie.txt"
UPDATE_DATA='{"name":"New Name"}'

# Update user
curl -s -X PATCH "$UPDATE_USER_URL/$USER_ID" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d "$UPDATE_DATA" \
  -o response.json

# Output the response
cat response.json
