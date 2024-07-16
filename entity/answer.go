package entities

import "gorm.io/gorm"

// Answer represents an answer in the system
type Answer struct {
    // Gorm ORM Model
    gorm.Model
    QuestionID uint   
    Text       string 
    IsCorrect  bool   
}
