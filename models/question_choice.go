package models

import (
    "time"
)

// options for a question
type QuestionChoice struct {
    ID        uint           `gorm:"primaryKey"`
    Question  Question       `gorm:"foreignKey:ID"`
    Text      string         `gorm:"type:text;not null"`
    IsAnswer  bool           `gorm:"not null"`
    ChoiceOrder int          `gorm:"not null"`
    CreatedAt    time.Time     `gorm:"autoCreateTime"`  
    UpdatedAt    time.Time     `gorm:"autoUpdateTime"` 
    CreatedBy        User           `gorm:"foreignKey:ID"`
}
