#!/bin/bash

# Variables
LOGOUT_URL="http://localhost:3000/api/auth/logout"
COOKIE_FILE="cookie.txt"

# Perform logout
curl -s -X POST $LOGOUT_URL \
  -b $COOKIE_FILE \
  -c $COOKIE_FILE \
  -o response.json

# Output the response
cat response.json
