package entities

import (
	"time"
	"gorm.io/gorm"
)

// User who will register for website
type User struct {
    // Gorm Model
    gorm.Model
    PhoneNumber string    
    Name        string    
    Email       string    
    JoinedDate  time.Time 
    Exams       []ExamUserPreference  `gorm:"foreignKey:UserID"`    
    OTP         string    
    OtpVerified bool      
    Password    string
}

type ExamUserPreference struct {
    gorm.Model
    UserID   uint
    ExamName string
}
