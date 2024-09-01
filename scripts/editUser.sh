#!/bin/bash

# Edit user script

API_URL="http://localhost:3000/api/user" # Adjust the URL according to your setup
USER_ID="1" # The ID of the user you want to update

# New user details
NEW_NAME="Jane Doe"
NEW_EMAIL="janedoe@example.com"
NEW_PHONE_NUMBER="0987654321"
COOKIE_FILE="cookie.txt"

# Update user request
response=$(curl -s -X PATCH "$API_URL/$USER_ID" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "name": "'"${NEW_NAME}"'",
    "email": "'"${NEW_EMAIL}"'",
    "phoneNumber": "'"${NEW_PHONE_NUMBER}"'"
  }')

echo "Response from server: $response"
