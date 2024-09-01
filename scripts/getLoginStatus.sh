#!/bin/bash

# Variables
STATUS_URL="http://localhost:3000/api/auth/login-status"
COOKIE_FILE="cookie.txt"

# Fetch login status
curl -s -X GET $STATUS_URL \
  -b $COOKIE_FILE \
  -o response.json

# Output the response
cat response.json
