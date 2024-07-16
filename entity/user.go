package entities

import (
    "gorm.io/gorm"
    "time"
)

type User struct {
    gorm.Model
    PhoneNumber string    `json:"phoneNumber" gorm:"unique"`
    Name        string    `json:"name"`
    Email       string    `json:"email"`
    JoinedDate  time.Time `json:"joinedDate"`
    Exams       []string  `json:"exams" gorm:"type:text[]"` // Array of exams interested in
    OTP         string    `json:"otp"`
    OtpVerified bool      `json:"otpVerified"`
}
