#!/bin/bash

# User creation script

API_URL="http://localhost:3000/api/user" # Adjust the URL according to your setup

# User details
NAME="John Doe"
EMAIL="johndoe@example.com"
PHONE_NUMBER="1234567890"
PASSWORD="yourpassword"

# Create user request
response=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'"${NAME}"'",
    "email": "'"${EMAIL}"'",
    "phoneNumber": "'"${PHONE_NUMBER}"'",
    "password": "'"${PASSWORD}"'"
  }')

echo "Response from server: $response"
