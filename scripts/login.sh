#!/bin/bash

# Variables
LOGIN_URL="http://localhost:3000/api/auth/login"
COOKIE_FILE="cookie.txt"
LOGIN_DATA='{"email":"johndoe@example.com","password":"yourpassword"}'

# Perform login and store the cookie
curl -s -X POST $LOGIN_URL \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA" \
  -c $COOKIE_FILE \
  -o response.json \
  -w "%{http_code}\n"

# Output the response
cat response.json
