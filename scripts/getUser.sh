#!/bin/bash

# Variables
GET_USER_URL="http://localhost:3000/api/user"
USER_ID="1" # Replace with actual user ID
COOKIE_FILE="cookie.txt"

# Get user details
curl -s -X GET "$GET_USER_URL/$USER_ID" \
  -b $COOKIE_FILE \
  -o response.json

# Output the response
cat response.json
